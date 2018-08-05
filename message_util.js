/*
 * メッセージを投稿します.
 *
 * @param {string} message 投稿内容
 */
function postMessage(message) {
  var options = {
    'method'     : 'post',
    'contentType': 'application/json',
    'payload'    : JSON.stringify({ 'text': message })
  };

  UrlFetchApp.fetch(slack['incomingUrl'], options);
}

/**
 * 該当日の担当者を投稿します.
 *
 * @param {date}   date   該当日
 * @param {string} person 担当者
 */
function postDutyPerson(date, person) {
  postMessage(getYmdString(date) + ' の当番は ' + person + ' さんです')
}

/**
 * 担当者の交代を投稿します.
 *
 * @param {string} message 交代設定内容
 */
function postChangeDutyPerson(message) {
  postMessage("■電話当番交代を設定しました\n" + message);
}

/**
 * 担当者の交代通知用のメッセージを返却します.
 *
 * @param {date} date 該当日
 * @param {string} beforeDutyPerson 交代前の担当者
 * @param {string} afterDutyPerson  交代後の担当者
 *
 * @return {string} 交代通知メッセージ
 */
function getChangeDutyPersonMessage(date, beforeDutyPerson, afterDutyPerson) {
  return(
    getYmdString(date) + ' の当番を '
      + beforeDutyPerson + ' さんから '
      + afterDutyPerson  + ' さんに変更しました'
  );
}

/**
 * リクエスト内容不足のメッセージを投稿します.
 */
function postTooFewArgumentsError() {
  postMessage('入力内容が不足しています');
}

/**
 * リクエストに含まれる日付が正しくないメッセージを投稿します.
 */
function postInvalidDate() {
  postMessage('入力された日付が正しくありません');
}

