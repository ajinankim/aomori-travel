// Google Apps Script - 여행 일정표 JSON API
// 이 스크립트를 시트의 Apps Script 편집기에서 실행하세요.

const SPREADSHEET_ID = '10D6BHT4KAOUYCm9uZm9iRPWNbRhiIdEIdQ4C9QrFC4Y';
const SHEET_NAME = '시트1';

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // 헤더 제거
  const headers = data.shift();
  
  // JSON 데이터로 변환
  const jsonData = data
    .filter(row => row[0] !== '' && row[0] !== null) // 빈 행 제거
    .map(row => {
      // 시간 필드가 Date 객체이면 문자열로 변환
      let time = row[1] || '';
      if (time instanceof Date) {
        const h = String(time.getHours()).padStart(2, '0');
        const m = String(time.getMinutes()).padStart(2, '0');
        time = h + ':' + m;
      } else {
        time = String(time);
      }

      let date = row[0] || '';
      if (date instanceof Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[date.getDay()];
        date = month + '/' + day + ' (' + dayOfWeek + ')';
      } else {
        date = String(date);
      }

      const result = {
        date: date,
        time: time,
        activity: String(row[2] || ''),
        location: String(row[3] || ''),
        transport: String(row[4] || ''),
        note: String(row[5] || ''),
        map: String(row[6] || '')
      };

      // alternatives 컬럼 (H열) 있으면 추가
      if (row[7]) {
        result.alternatives = String(row[7]).split('\n').filter(s => s.trim());
      }

      return result;
    });
  
  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

// 테스트용 함수
function testDoGet() {
  const result = doGet({});
  Logger.log(result.getContent());
}
