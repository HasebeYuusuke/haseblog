function getCard() {
  var trelloKey   = ""; // 開発者向けAPIキー★★★
  var trelloToken = ""; // トークン★★★
  var listId 　　 = "5e99d1e7aee8c765d2c72850";
  var url = "https://trello.com/1/lists/" + listId + "/cards?key=" + trelloKey + "&token=" + trelloToken;
  var res = UrlFetchApp.fetch(url, {'method':'get','contentType':'application/json'});
  var json = JSON.parse(res);
  var url2 = "";
  var res2 = "";
  var json2 = "";
  var cards =[];
  var maxRows = json.length;  
  for(var i = 0; i < maxRows; i++){
    var name = json[i].name;
    var idMembers = json[i].idMembers;
    var membersfullName = "";
    var shortUrl = json[i].shortUrl;
// Start ★★★
    for(var j = 0; j < json[i].idMembers.length; j++){
      url2 = "https://trello.com/1/members/" + json[i].idMembers[j] + "?key=" + trelloKey + "&token=" + trelloToken;
      try {
        res2 = UrlFetchApp.fetch(url2, {'method':'get','contentType':'application/json'});
        //Utilities.sleep(100);
        json2 = JSON.parse(res2);
        membersfullName += json2.fullName;
        Logger.log(url2);
      } catch (ex) {
        Logger.log("Message:" + ex.message + "\r\nFile:" + ex.fileName + "\r\nLine:" + ex.lineNumber + "\r\n");
      }
    }
    var card = [name, idMembers, membersfullName, shortUrl];
    cards.push(card);
  }
// End ★★★
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('list'); // ★★★
  var lastRow = cards.length;
  var column = cards[0].length;
  sheet.getRange(2,1,lastRow,column).setValues(cards);
}
function clear() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('list');
  sheet.getRange(2,1,20,4).clear()
}