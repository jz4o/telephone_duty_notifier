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

