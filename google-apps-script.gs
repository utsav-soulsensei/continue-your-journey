/**
 * SoulSensei – lead capture endpoint for Google Sheets.
 *
 * Setup:
 *  1. Open the target sheet:
 *     https://docs.google.com/spreadsheets/d/1V5go6_MFTroKkQkIo0BVeBwhNCeuw0hb0l90Pp2FXEs/edit
 *  2. Extensions → Apps Script. Paste this whole file.
 *  3. Run `setup` once (creates header row) and authorize when prompted.
 *  4. Deploy → New deployment → type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Copy the /exec URL and paste it into app.js (SHEET_ENDPOINT).
 *  5. After ANY code change, redeploy (Deploy → Manage deployments → Edit → New version).
 */

var SHEET_ID = "1V5go6_MFTroKkQkIo0BVeBwhNCeuw0hb0l90Pp2FXEs";
var SHEET_NAME = "Leads";

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Source"]);
  }
  return sheet;
}

/** Run once to create the sheet + header row. */
function setup() {
  getSheet_();
}

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Fallback: support raw JSON bodies too.
    if ((!p.name && !p.email && !p.phone) && e && e.postData && e.postData.contents) {
      try { p = JSON.parse(e.postData.contents); } catch (ignore) {}
    }

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      p.name || "",
      p.email || "",
      p.phone || "",
      p.source || ""
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, status: "SoulSensei lead endpoint is live" });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
