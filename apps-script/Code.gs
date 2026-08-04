/**
 * BioPC — quotation form receiver for services.biopc.org
 *
 * Paste this file's contents into the Apps Script editor as Code.gs.
 * Do NOT include any ``` fence or a "javascript" line — the editor expects
 * raw JavaScript, and a stray language tag produces:
 *   ReferenceError: javascript is not defined
 *
 * SETUP
 *   1. Fill in SHEET_ID and FOLDER_ID below.
 *   2. Run the `setup` function once (Run ▸ setup) and grant permissions.
 *      Never run `doPost` from the editor — it has no event object and will
 *      always fail with "Cannot read properties of undefined (reading
 *      'postData')". That error means the script is fine; you just called it
 *      the wrong way.
 *   3. Deploy ▸ New deployment ▸ Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *   4. Copy the /exec URL into .env.production of the website.
 *
 * AFTER ANY EDIT: Deploy ▸ Manage deployments ▸ ✏️ ▸ Version: New version.
 * Without that, the /exec URL keeps serving the old code.
 */

// ── Configuration ─────────────────────────────────────────────────────────
// Sheet ID is the long string in the Sheet's URL:
//   docs.google.com/spreadsheets/d/<THIS_PART>/edit
const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

// Drive folder for uploaded .pdb / ligand files. Open the folder in Drive:
//   drive.google.com/drive/folders/<THIS_PART>
// Leave as '' to skip file saving (the request still logs).
const FOLDER_ID = '';

const NOTIFY = 'biopc.research@gmail.com';

const HEADERS = [
  'Received', 'Name', 'Institution', 'Email', 'WhatsApp',
  'Protein / PDB', 'Length', 'Analysis', 'Deadline', 'Notes', 'Files',
];

// ── Entry points ──────────────────────────────────────────────────────────

/** Browser GET — lets you confirm the deployment is live. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'BioPC quotation receiver' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      // Reached by pressing Run in the editor rather than by a real request.
      throw new Error('No POST body. Deploy as a web app and submit the form.');
    }

    const d = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    const links = saveFiles_(d.files);

    sheet.appendRow([
      new Date(),
      d.name || '',
      d.institution || '',
      d.email || '',
      d.whatsapp || '',
      d.pdb || '',
      d.length || '',
      (d.analysis || []).join('; '),
      d.deadline || '',
      d.notes || '',
      links.join('\n'),
    ]);

    notify_(d, links);
    return json_({ ok: true });
  } catch (err) {
    // Logged to Executions in the Apps Script UI, so a failed submission is
    // diagnosable after the fact rather than silently lost.
    console.error(err.stack || err);
    return json_({ ok: false, error: String(err) });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Opens the target sheet by ID rather than getActiveSpreadsheet(), which
 * returns null in a standalone script project and is the usual cause of
 * "Cannot read properties of null (reading 'getSheets')".
 */
function getSheet_() {
  if (!SHEET_ID || SHEET_ID === 'PASTE_YOUR_SHEET_ID_HERE') {
    throw new Error('SHEET_ID is not set in Code.gs.');
  }
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveFiles_(files) {
  if (!FOLDER_ID || !files || !files.length) return [];
  const folder = DriveApp.getFolderById(FOLDER_ID);
  return files.map(function (f) {
    // The browser sends a data: URL — strip the "data:...;base64," prefix.
    const b64 = String(f.content).split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(b64), f.type, f.name);
    return folder.createFile(blob).getUrl();
  });
}

function notify_(d, links) {
  MailApp.sendEmail({
    to: NOTIFY,
    subject: 'MD quotation request — ' + (d.name || 'unnamed'),
    body: [
      'Name: ' + (d.name || ''),
      'Institution: ' + (d.institution || ''),
      'Email: ' + (d.email || ''),
      'WhatsApp: ' + (d.whatsapp || ''),
      'Protein: ' + (d.pdb || ''),
      'Length: ' + (d.length || ''),
      'Analysis: ' + (d.analysis || []).join(', '),
      'Deadline: ' + (d.deadline || ''),
      '',
      'Notes:',
      d.notes || '(none)',
      '',
      'Files:',
      links.join('\n') || '(none)',
    ].join('\n'),
  });
}

/**
 * Run this once from the editor. It verifies the Sheet ID, creates the header
 * row, checks the Drive folder and sends one test email — exercising every
 * permission the web app needs so the consent prompt appears now rather than
 * on a real visitor's submission.
 */
function setup() {
  const sheet = getSheet_();
  console.log('Sheet OK: "%s" (%s rows)', sheet.getName(), sheet.getLastRow());

  if (FOLDER_ID) {
    console.log('Drive folder OK: %s', DriveApp.getFolderById(FOLDER_ID).getName());
  } else {
    console.log('FOLDER_ID empty — uploaded files will not be saved.');
  }

  notify_(
    {
      name: 'Setup test',
      institution: 'BioPC',
      email: NOTIFY,
      pdb: '4G8A',
      length: '500 ns',
      analysis: ['MM/PBSA or MM/GBSA'],
      notes: 'If you are reading this, the receiver is configured correctly.',
    },
    [],
  );
  console.log('Test email sent to %s', NOTIFY);
}
