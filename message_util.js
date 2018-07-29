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
 * @param {string} successMessage 交代設定に成功した内容
 * @param {string} errorMessage   交代設定に失敗した内容
 */
function postChangeDutyPerson(successMessage, errorMessage) {
  var message = '';
  if(successMessage){
    message += "■電話当番交代を設定しました\n" + successMessage + "\n";
  }
  if(errorMessage) {
    message += "■電話当番交代の設定に失敗しました\n" + errorMessage;
  }

  postMessage(message);
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

