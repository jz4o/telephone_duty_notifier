/**
 * トリガー実行のエントリーポイント
 */
function main() {
  var today = new Date();

  // 休日は通知しない
  if(isHoliday(today)){
    return;
  }

  // 実行状態が「起動」でない場合は通知しない
  if (config['service'] != serviceStatus['active']) {
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
  var trigger, action, type, target, opt;
  [trigger, action, type, target, opt] = e['text'].split(' ');

  if(action == 'add' && type == 'duty') {
    addDutyPerson(target);
  }else if(action == 'delete' && type == 'duty') {
    deleteDutyPerson(target);
  }else if(action == 'list' && type == 'duty') {
    postDutyList();
  }else if(action == 'reset' && type == 'duty') {
    resetDutyPerson();
  }else if(action == 'set' && type == 'duty') {
    setChangeDuty(target, opt);
  }else if(action == 'rotate' && type == 'duty') {
    rotateDutyPerson(target, opt);
  }else if(action == 'check' && type == 'duty') {
    noticeDutyPerson(target);
  }else if(action == 'set' && type == 'shift') {
    changeShiftSystem(target);
  }else if(action == 'list' && type == 'shift') {
    postShiftSystemList();
  }else if(type == 'service') {
    changeServiceStatus(action, trigger);
  }else{
    postHelpMessage(trigger);
  }
}

