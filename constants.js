/*
 * スクリプトのプロパティ
 */
var scriptProperties = PropertiesService.getScriptProperties();

/*
 * Slack関連の定数
 */
var slack = {
  'incomingUrl'  : scriptProperties.getProperty('SLACK_INCOMING_URL'),
  'outgoingToken': scriptProperties.getProperty('SLACK_OUTGOING_TOKEN')
};

/**
 * Spread Sheet関連
 */
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = {
  'duties' : spreadSheet.getSheetByName('duties'),
  'changes': spreadSheet.getSheetByName('changes'),
  'config' : spreadSheet.getSheetByName('config')
};
var sheetTitleRows = {
  'duties' : ['担当者'],
  'changes': ['日付', '担当者'],
  'config' : ['項目名', '設定値']
};
var sheetColumns = {
  'duties': {
    'person': 0
  },
  'changes': {
    'date'  : 0,
    'person': 1
  },
  'config': {
    'key'  : 0,
    'value': 1
  }
};

/**
 * 各種設定値
 */
var config = (function() {
  var result = {}

  var keyColumn   = sheetColumns['config']['key'];
  var valueColumn = sheetColumns['config']['value'];

  if(!sheet['config']) {
    setup_sheets();
  }

  var values = sheet['config'].getDataRange().getValues();
  for(var i=1; i<values.length; i++) {
    result[values[i][keyColumn]] = values[i][valueColumn];
  }

  return result;
}());

/**
 * 当番制度
 */
var shiftSystems =　{
  'daily'    : '日番制',
  'weekly'   : '週番制',
  'dayOfWeek': '曜日制'
};

