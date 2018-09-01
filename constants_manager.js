/**
 * 当番制度を変更
 *
 * @param {string} shift 当番制度キーワード
 */
function changeShiftSystem(shift) {
  var isChangeShift = shiftSystems[shift] != null;
  if(isChangeShift){
    updateConfig('shift', shiftSystems[shift]);
  }

  postChangeShiftSystem(config['shift'], isChangeShift);
}

/**
 * 設定値を更新
 *
 * @param {string} key   項目名
 * @param {object} value 設定値
 */
function updateConfig(key, value) {
  config[key] = value;

  var arrayConfig = [];
  for(var key in config) {
    arrayConfig.push([key, config[key]]);
  }

  var rowSize    = arrayConfig.length;
  var columnSize = arrayConfig[0].length;
  sheet['config'].getRange(2, 1, rowSize, columnSize).setValues(arrayConfig);
}

