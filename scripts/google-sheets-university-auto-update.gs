/**
 * WISE Advisory Board spreadsheet — auto-update University tab from List
 *
 * SETUP (Google Sheets):
 * 1. Open your spreadsheet in Google Sheets (upload the .xlsx if needed).
 * 2. Go to Extensions → Apps Script.
 * 3. Delete any sample code and paste this entire file.
 * 4. Click Save, then Run → updateUniqueUniversities (approve permissions once).
 * 5. Add new rows on the List tab — University updates automatically on edit.
 *
 * Manual refresh anytime: Run → updateUniqueUniversities
 */

function updateUniqueUniversities() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var list = ss.getSheetByName('List');
  if (!list) {
    throw new Error('Sheet "List" not found.');
  }

  var uni = ss.getSheetByName('University');
  if (!uni) {
    uni = ss.insertSheet('University');
  }

  var lastRow = list.getLastRow();
  var values = lastRow >= 2 ? list.getRange(2, 4, lastRow - 1, 1).getValues() : [];

  var seen = {};
  var unique = [];
  for (var i = 0; i < values.length; i++) {
    var name = String(values[i][0] || '').trim();
    if (!name) continue;
    var key = name.toLowerCase();
    if (!seen[key]) {
      seen[key] = true;
      unique.push(name);
    }
  }
  unique.sort(function (a, b) {
    return a.localeCompare(b);
  });

  uni.clear();
  uni.getRange(1, 1).setValue('University');
  if (unique.length > 0) {
    uni.getRange(2, 1, unique.length, 1).setValues(
      unique.map(function (u) {
        return [u];
      })
    );
  }
}

/** Runs automatically when you edit the List sheet */
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== 'List') return;
  updateUniqueUniversities();
}
