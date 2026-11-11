function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Ad Soyad", "Telefon", "Ne istiyor", "Tarih"]);
  }
  sheet.appendRow([
    data["Ad Soyad"],
    data["Telefon"],
    data["Ne istiyor"],
    data["Tarih"],
  ]);
  return ContentService.createTextOutput("ok");
}
