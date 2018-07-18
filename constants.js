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
 * Splead Sheet
 */
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = {
  'duties' : spreadSheet.getSheetByName('duties'),
  'changes': spreadSheet.getSheetByName('changes')
};
var sheetColumns = {
  'duties': {
    'person': 0
  },
  'changes': {
    'date'  : 0,
    'person': 1
  }
};

/**
 * 当番制度
 */
var shiftSystems =　{
  'daily'    : '日番制',
  'weekly'   : '週番制',
  'dayOfWeek': '曜日制'
};
var shiftSystem = sheet['duties'].getRange(1, 2).getValue();

