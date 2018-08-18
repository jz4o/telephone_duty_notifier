/**
 * 当番制度を変更
 *
 * @param {string} shift 当番制度キーワード
 */
function changeShiftSystem(shift) {
  var isChangeShift = shiftSystems[shift] != null;
  if(isChangeShift){
    shiftSystem = shiftSystems[shift];
    sheet['duties'].getRange(1, 2).setValue(shiftSystem);
  }

  postChangeShiftSystem(shiftSystem, isChangeShift);
}

