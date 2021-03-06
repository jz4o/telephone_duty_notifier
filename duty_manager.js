/**
 * 担当者一覧
 */
var persons = (function() {
  var result = [];

  if(!sheet['duties']){
    setup_sheets();
  }

  values = sheet['duties'].getDataRange().getValues();
  for (var i=1; i<values.length; i++){
    result.push(values[i][sheetColumns['duties']['person']]);
  }

  return result;
}());

/**
 * 担当者変更一覧
 */
var changePersons = (function() {
  var result = {};

  if(!sheet['changes']){
    setup_sheets();
  }

  values = sheet['changes'].getDataRange().getValues();
  for(var i=1; i<values.length; i++){
    var date   = values[i][sheetColumns['changes']['date']];
    var person = values[i][sheetColumns['changes']['person']];
    result[date] = person;
  }

  return result;
}());

/**
 * 担当者を追加
 *
 * @param {string} person 担当者
 */
function addDutyPerson(person) {
  var isAdd = persons.indexOf(person) < 0;
  if(isAdd){
    persons.push(person);
    sheet['duties'].appendRow([person]);
  }

  postAddDutyPerson(person, isAdd);
}

/**
 * 担当者を削除
 *
 * @param {string} person 担当者
 */
function deleteDutyPerson(person) {
  var isDelete = false;
  var data = [];

  // データ更新
  for(var i=persons.length-1; i>=0; i--){
    if(persons[i] == person){
      isDelete = true;
      persons.splice(i, 1);

      data.push(['']);
    }else{
      data.unshift([persons[i]]);
    }
  }

  // シート更新
  if(isDelete){
    var personColumn = sheetColumns['duties']['person'] + 1;
    sheet['duties'].getRange(2, personColumn, data.length).setValues(data);
  }

  postDeleteDutyPerson(person, isDelete);
}

/**
 * 担当者をリセット
 */
function resetDutyPerson() {
  persons = [];

  var lastRow = sheet['duties'].getLastRow();
  if (lastRow > 1) {
    sheet['duties'].getRange(2, 1, lastRow - 1).clear();
  }

  postResetDutyPerson();
}

/**
 * 該当日の担当者を通知
 *
 * @param {date / string} date 該当日
 */
function noticeDutyPerson(date) {
  // 引数チェック
  if(!date){
    postTooFewArgumentsError();
    return;
  }

  // 日付チェック
  if(typeof(date) === 'string' && !isValidDate(date)){
    postInvalidDate();
    return;
  }

  date = new Date(date);

  var dutyPerson = getChangeDutyPerson(date) || getOriginalDutyPerson(date);
  postDutyPerson(date, dutyPerson);
}

/**
 * 該当日の本来の担当者を返却
 *
 * @param {date} date 該当日
 */
function getOriginalDutyPerson(date) {
  switch(config['shift']){
  case shiftSystems['daily']:
    return getDailyDutyPerson(date);
  case shiftSystems['weekly']:
    return getWeeklyDutyPerson(date);
  case shiftSystems['dayOfWeek']:
    return getDayOfWeekDutyPerson(date);
  default:
    return null;
  }
}

/**
 * 該当日の本来の担当者(日番制)を返却
 *
 * @param {date} date 該当日
 */
function getDailyDutyPerson(date) {
  var elapseDays = getDiffDays(FIRST_MONDAY, date);
  var elapseWeeks = Math.floor(elapseDays / 7);
  var elapseWeeksModulus = elapseDays % 7;

  var elapseDutyDays = elapseWeeks * 5 + elapseWeeksModulus;

  return persons[elapseDutyDays % persons.length];
}

/**
 * 該当日の本来の担当者(週番制)を返却
 *
 * @param {date} date 該当日
 */
function getWeeklyDutyPerson(date) {
  var elapseDays = getDiffDays(FIRST_MONDAY, date);
  var elapseWeeks = Math.floor(elapseDays / 7);

  return persons[elapseWeeks % persons.length];
}

/**
 * 該当日の本来の担当者(曜日制)を返却
 *
 * 担当者のいない曜日は週番制を採用
 *
 * @param {date} date 該当日
 */
function getDayOfWeekDutyPerson(date) {
  return persons[date.getDay() - 1] || getWeeklyDutyPerson(date);
}

/**
 * 交代がある場合の担当者を返却
 *
 * @param {date} date 該当日
 */
function getChangeDutyPerson(date) {
  return changePersons[getYmdString(date)];
}

/**
 * 担当者の変更を設定
 *
 * @param {string} person 担当者
 * @param {string} date   日付文字列
 */
function setChangeDuty(person, date) {
  // 引数チェック
  if(!person || !date){
    postTooFewArgumentsError();
    return;
  }

  // 日付チェック
  if(!isValidDate(date)){
    postInvalidDate();
    return;
  }

  // 交代設定
  date = new Date(Date.parse(date));
  if(getChangeDutyPerson(date)){
    // 交代設定通知
    var beforeDutyPerson = getChangeDutyPerson(date);
    postChangeDutyPerson(date, beforeDutyPerson, person);

    editChangeDutyPerson(date, person);
  }else{
    // 交代設定通知
    var beforeDutyPerson = getOriginalDutyPerson(date);
    postChangeDutyPerson(date, beforeDutyPerson, person);

    addChangeDutyPerson(date, person);
  }
}

/**
 * 担当者を再交代
 *
 * @param {date} date     該当日
 * @param {string} person 担当者
 */
function editChangeDutyPerson(date, person) {
  var beforeDutyPerson = changePersons[date];
  changePersons[date] = person;

  var ranges = sheet['changes'].getDataRange();
  var values = ranges.getValues();
  for(var i=0; i<values.length; i++){
    if(values[i][sheetColumns['changes']['date']] == getYmdString(date)){
      ranges.getCell(i+1, sheetColumns['changes']['person']+1).setValue(person);
      break;
    }
  }
}

/**
 * 担当者を交代
 *
 * @param {date} date     該当日
 * @param {string} person 担当者
 */
function addChangeDutyPerson(date, person) {
  changePersons[date] = person;
  sheet['changes'].appendRow(["'" + getYmdString(date), person]);
}

/**
 * 過去の交代設定を削除
 */
function removeOldChangeDutyPerson() {
  var removeBorderDate = getYesterday(new Date());

  var ranges = sheet['changes'].getDataRange();
  var values = ranges.getValues();

  for(var i=values.length-1; i>0; i--){
    if(values[i][sheetColumns['changes']['date']] < removeBorderDate) {
      values.splice(i, 1);
      values.push(['', '']);
    }
  }

  ranges.setValues(values);
}

/**
 * `date` の担当者が `person` となるよう担当者テーブルを循環
 *
 * @param {string} person 担当者
 * @param {string} date   日付文字列
 */
function rotateDutyPerson(person, date) {
  // 引数チェック
  if(!person || !date){
    postTooFewArgumentsError();
    return;
  }

  // 担当者チェック
  var personIndex = persons.indexOf(person);
  if(personIndex < 0){
    return;
  }

  // 日付チェック
  if(!isValidDate(date)){
    postInvalidDate();
    return;
  }

  // 循環数
  date = new Date(Date.parse(date));
  var originalPersonIndex = persons.indexOf(getOriginalDutyPerson(date));
  var rotateCount = originalPersonIndex - personIndex;

  // 循環
  if (rotateCount > 0) {
    for (i = 0; i < rotateCount; i++) {
      persons.unshift(persons.pop());
    }
  } else {
    rotateCount = -rotateCount;
    for (i = 0; i < rotateCount; i++) {
      persons.push(persons.shift());
    }
  }

  // シート更新
  var data = []
  for (i = 0; i < persons.length; i++) {
    data.push([persons[i]]);
  }
  var personColumn = sheetColumns['duties']['person'] + 1;
  sheet['duties'].getRange(2, personColumn, data.length).setValues(data);
}
