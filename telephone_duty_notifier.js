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
 * POSTリクエストのエントリーポイント
 *
 * @param {hash} e リクエストパラメータ
 */
function doPost(e) {
  // 不正なリクエストをリジェクト
  if(e['parameter']['token'] != slack['outgoingToken']) {
    return;
  }

  relayRequest(e['parameter']);
}

/**
 * POSTリクエストに応じた関数をコールします
 *
 * @param {hash} e リクエストパラメータ
 */
function relayRequest(e) {
  var trigger, action, type, person, date;
  [trigger, action, type, person, date] = e['text'].split(' ');

  if(action == 'set' && type == 'duty') {
    setChangeDuty(person, date);
  }else if(action == 'add' && type == 'duty') {
    addDutyPerson(person);
  }else if(action == 'delete' && type == 'duty') {
    deleteDutyPerson(person);
  }else if(action == 'list' && type == 'duty') {
    postDutyList();
  }else{
    postHelpMessage(trigger);
  }
}

