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
    .map(row => ({
      date: row[0] || '',
      time: row[1] || '',
      activity: row[2] || '',
      location: row[3] || '',
      transport: row[4] || '',
      note: row[5] || ''
    }));
  
  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

// 테스트용 함수
function testDoGet() {
  const result = doGet({});
  Logger.log(result.getContent());
}
