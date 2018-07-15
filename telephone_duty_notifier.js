/*
 * スクリプトのプロパティ
 */
var scriptProperties = PropertiesService.getScriptProperties();

/*
 * Slack関連の定数
 */
var slack = {
  'incomingUrl': scriptProperties.getProperty('SLACK_INCOMING_URL')
};

/**
 * Splead Sheet
 */
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = {
  'duties' : spreadSheet.getSheetByName('duties')
};
var sheetColumns = {
  'duties': {
    'person': 0
  }
};

/**
 * 担当者一覧
 */
var persons = (function() {
  var result = [];

  values = sheet['duties'].getDataRange().getValues();
  for (var i=1; i<values.length; i++){
    result.push(values[i][sheetColumns['duties']['person']]);
  }

  return result;
}());

/**
 * トリガー実行のエントリーポイント
 */
function main() {
  var today = new Date();

  // 休日は通知しない
  if(isHoliday(today)){
    return;
  }

  // 該当日の担当者を通知
  noticeDutyPerson(today);
}

/**
 * 該当日の担当者を通知
 *
 * @param {date} date 該当日
 */
function noticeDutyPerson(date) {
  var dutyPerson = getOriginalDutyPerson(date);
  postDutyPerson(date, dutyPerson);
}

/**
 * 該当日の本来の担当者を返却
 *
 * @param {date} date 該当日
 */
function getOriginalDutyPerson(date) {
  var elapseDays = getDiffDays(FIRST_MONDAY, date);
  var elapseWeeks = Math.floor(elapseDays / 7);
  var elapseWeeksModulus = elapseDays % 7;

  var elapseDutyDays = elapseWeeks * 5 + elapseWeeksModulus;

  return persons[elapseDutyDays % persons.length];
}

