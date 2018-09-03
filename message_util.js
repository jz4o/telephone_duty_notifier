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
 * 担当者追加のメッセージを投稿します.
 *
 * @param {string}  person 担当者
 * @param {boolean} result 追加の成否
 */
function postAddDutyPerson(person, result) {
  var resultMsg = result ? 'しました。' : 'できませんでした。';
  postMessage(person + 'を追加' + resultMsg);

  postDutyList();
}

/**
 * 担当者削除のメッセージを投稿します.
 *
 * @param {string}  person 担当者
 * @param {boolean} result 削除の成否
 */
function postDeleteDutyPerson(person, result) {
  var resultMsg = result ? 'しました。' : 'できませんでした。';
  postMessage(person + 'を削除' + resultMsg);

  postDutyList();
}

/**
 * 担当者一覧を投稿します.
 */
function postDutyList() {
  var message = '現在の担当者は以下の通りです。\n'
  persons.forEach(function(element){
    message += '> ' + element + '\n'
  });
  postMessage(message);
}

/**
 * 該当日の担当者を投稿します.
 *
 * @param {date}   date   該当日
 * @param {string} person 担当者
 */
function postDutyPerson(date, person) {
  if(person){
    postMessage(getYmdString(date) + ' の当番は ' + person + ' さんです。');
  }else{
    postMessage('担当者が設定されていません。');
  }
}

/**
 * 担当者の交代を投稿します.
 *
 * @param {date}   date             該当日
 * @param {string} beforeDutyPerson 交代前の担当者
 * @param {string} afterDutyPerson  交代後の担当者
 */
function postChangeDutyPerson(date, beforeDutyPerson, afterDutyPerson) {
  postMessage(
    getYmdString(date) + ' の当番を '
      + beforeDutyPerson + ' さんから '
      + afterDutyPerson  + ' さんに変更しました。'
  );
}

/**
 * 当番制度変更のメッセージを投稿します.
 *
 * @param {string}  shift  変更後の当番制度
 * @param {boolean} result 変更の成否
 */
function postChangeShiftSystem(shift, result) {
  if(result){
    postMessage('当番制度を' + shift + 'に変更しました。');
  }else {
    postMessage('当番制度を変更できませんでした。');
    postShiftSystemList();
  }
}

/**
 * 当番制度に指定可能なキーワード一覧を投稿します.
 */
function postShiftSystemList() {
  var message = '';
  for(key in shiftSystems) {
    message += key + '(' + shiftSystems[key] + ')\n';
  }

  postMessage('当番制度のキーワードは以下の通りです。\n' + message);
}

/**
 * リクエスト内容不足のメッセージを投稿します.
 */
function postTooFewArgumentsError() {
  postMessage('入力内容が不足しています。');
}

/**
 * リクエストに含まれる日付が正しくないメッセージを投稿します.
 */
function postInvalidDate() {
  postMessage('入力された日付が正しくありません。');
}

/**
 * ヘルプメッセージを投稿します.
 *
 * @param {string} trigger トリガーメッセージ
 */
function postHelpMessage(trigger) {
  var commands = [
    trigger + ' add duty 担当者A',
    trigger + ' delete duty 担当者A',
    trigger + ' set duty 担当者A 2000/01/01',
    trigger + ' list duty',
    trigger + ' check duty 2000/01/01',
    trigger + ' set shift daily',
    trigger + ' list shift',
    trigger + ' help'
  ];
  postMessage(
    '`' + trigger + "`の使用方法が必要ですか？\n" +
    '`' + trigger + "`は電話当番の通知を行うBotです。使用例は以下の通りです。\n>>>\n" +
    commands.join("\n")
  );
}

