/**
 * 初期化処理
 */
function setup() {
  setup_sheets();
  updateConfig('shift', shiftSystems['daily']);
  updateConfig('service', serviceStatus['active']);
}

/**
 * スプレッドシート初期化処理
 */
function setup_sheets() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  for(sheetName in sheet) {
    if(!sheet[sheetName]) {
      sheet[sheetName] = spreadSheet.insertSheet(sheetName);
      sheet[sheetName].appendRow(sheetTitleRows[sheetName]);
    }
  }
}

