/**
 * Unix Epoch以降で最初の月曜日
 */
var FIRST_MONDAY = new Date(1970, 1-1, 5);

/**
 * 秒～年をミリ秒で定義
 */
var SECOND_MILLISECOND = 1000;
var MINUTE_MILLISECOND =   60 * SECOND_MILLISECOND;
var HOUR_MILLISECOND   =   60 * MINUTE_MILLISECOND;
var DAY_MILLISECOND    =   24 * HOUR_MILLISECOND;
var WEEK_MILLISECOND   =    7 * DAY_MILLISECOND;
var YEAR_MILLISECOND   =  365 * DAY_MILLISECOND;

/**
 * 受取った日付の0時0分0秒を返却
 *
 * @param {date} 日付
 *
 * @return {date} 受取った日付の0時0分0秒
 */
function getBeginningOfDay(date){
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  return date;
}

/**
 * 受取った日付の前日を返却
 *
 * @param {date} 日付
 *
 * @return {date} 受取った日付の前日
 */
function getYesterday(date){
  date.setDate(date.getDate() - 1);
  return date;
}

/**
 * 開始／終了日間の日数を返却
 *
 * @param {date} 開始日
 * @param {date} 終了日
 *
 * @return {number} 開始日から終了日までの日数
 */
function getDiffDays(fromDate, toDate){
  fromDate = getBeginningOfDay(fromDate);
  toDate   = getBeginningOfDay(toDate);

  var diffTime = toDate.getTime() - fromDate.getTime();
  return Math.floor(diffTime / DAY_MILLISECOND);
}

/**
 * 受取った日付が休日・祝日か判定
 * 日付が渡されていない場合、当日で判定
 *
 * @param {date} 日付
 *
 * @return {boolean} 土日祝日：true, 平日：false
 */
function isHoliday(date){
  date = date || new Date();

  //土日か判定
  var weekInt = date.getDay();
  if(weekInt <= 0 || 6 <= weekInt){
    return true;
  }

  //祝日か判定
  var calendarId = "ja.japanese#holiday@group.v.calendar.google.com";
  var calendar = CalendarApp.getCalendarById(calendarId);
  var todayEvents = calendar.getEventsForDay(date);
  if(todayEvents.length > 0){
    return true;
  }

  return false;
}

/**
 * 受取った日付文字列が正しいか判定
 *
 * @param {string} dateStr 日付文字列
 *
 * @return {boolean} 正しい：true, 誤り：false
 */
function isValidDate(dateStr){
  // フォーマットチェック
  if(!/\d{4}\/\d{1,2}\/\d{1,2}/.test(dateStr)){
    return false;
  }

  // 存在チェック
  var year, month, day;
  [year, month, day] = dateStr.split('/');
  var date = new Date(year, month-1, day);
  return(
    date.getFullYear() == year &&
      date.getMonth()  == month-1 &&
      date.getDate()   == day
  );
}

/**
 * 受取った日付をYYYY/MM/DD形式で返却
 *
 * @param {date} 日付
 *
 * @return {string} "YYYY/MM/DD"
 */
function getYmdString(date){
  return date.toLocaleDateString('en-US');
}

