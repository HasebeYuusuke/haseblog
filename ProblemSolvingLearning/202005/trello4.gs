/************************************************************
 長谷部エンジニア養成所 - 勉強会サンプルコード
 URL: https://haseblog.org
 Date: 2020-05-14
 Copyright © 2020 haseblog. All rights reserved.

＜勉強会の課題＞
 「自分が参加しているカードのみ」スプレッドシートに出力してください。
*************************************************************/
/*
 * カード取得
 * @param  なし
 * @return なし
 */
function getCard() {
    var cards =[];
    // 開発者向けAPIキー
    var trelloKey = "5ce18caa0e83cc11caa2d336a4a7e390"; // ★★★
    // 開発者トークン
    var trelloToken = "10e30033441da463ed53d84c82b6dfbeea2ee78c8ae1490fa7f3c8edbc2f198c"; // ★★★
    // リストID
    var listId  = "5e99d1e7aee8c765d2c72850";
    // カード一覧取得
    var json = getCards(listId, trelloKey, trelloToken);
    // カード一覧分繰り返し
    for(var i = 0; i < json.length; i++){
      var name = json[i].name;
      var idMembers = json[i].idMembers;
      var membersfullName = [];
      var shortUrl = json[i].shortUrl;
      // メンバー分繰り返し
      for(var j = 0; j < idMembers.length; j++){
        // メンバー取得
        var json2 = getMembers(idMembers[j] , trelloKey, trelloToken);
        // メンバー名称が空でない場合
        if (json2.fullName !== "") {
          // 配列の末尾に追加する
          membersfullName.push(json2.fullName);
        }    
      }
      // 自タスクの場合（よっしー）
      if ( idMembers.indexOf("5e8b21ca44c3f0103dd58962") !== -1 ){      
        // カード情報を整形する
        var card = [i+1 ,name, idMembers, membersfullName.join(" - "), shortUrl];
        // 配列の末尾に追加する
        cards.push(card);
      }
    }
    // スプレッドシートに書き出し
    setSpreadsheet(cards);
  }
    
  /*
   * カード一覧を取得します
   * @param  {文字列} listId リストID
   * @param  {文字列} trelloKey 開発者向けAPIキー
   * @param  {文字列} trelloToken 開発者トークン
   * @return {JSON}  カード一覧APIの戻り値
   */
  function getCards(listId, trelloKey, trelloToken) {
    try {
      // 処理を1秒遅延させる(ミリ秒単位)
      Utilities.sleep(1000);
      // URL文字列を整形する
      var url = "https://trello.com/1/lists/" + listId + "/cards?key=" + trelloKey + "&token=" + trelloToken;
      // HTTPリクエストを送る
      var res = UrlFetchApp.fetch(url, {'method':'get','contentType':'application/json'});
      // JSONを読み込み、値を返す
      return JSON.parse(res);
    } catch (ex) {
      // ログ出力
      Logger.log("Message:" + ex.message + "\r\nUrl:" + url);
      // アラート出力
      SpreadsheetApp.getUi().alert("カード一覧APIでエラーが発生しました");
    }
  }
    
  /*
   * メンバーを取得します
   * @param  {文字列} idMembers メンバーID
   * @param  {文字列} trelloKey 開発者向けAPIキー
   * @param  {文字列} trelloToken 開発者トークン
   * @return {JSON}  メンバー取得APIの戻り値
   */
  function getMembers(idMembers, trelloKey, trelloToken) {
    try {
      // 処理を1秒遅延させる(ミリ秒単位)
      Utilities.sleep(1000);
      // URL文字列を整形する
      var url = "https://trello.com/1/members/" + idMembers + "?key=" + trelloKey + "&token=" + trelloToken;
      // HTTPリクエストを送る
      var res = UrlFetchApp.fetch(url, {'method':'get','contentType':'application/json'});
      // JSONを読み込み、値を返す
      return JSON.parse(res);
    } catch (ex) {
      // ログ出力
      Logger.log("Message:" + ex.message + "\r\nUrl:" + url);
      // アラート出力
      SpreadsheetApp.getUi().alert("メンバー取得APIでエラーが発生しました");
    }
  }
  
  /*
   * スプレッドシートにカード情報を設定する
   * @param  {配列} cards カード情報
   * @return なし
   */
  function setSpreadsheet(cards) {
    // アクティブなワークブックを指定する
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // シート名を指定してシートを取得する
    var sheet = spreadsheet.getSheetByName('list3'); // ★★★
    // 行番号, 列番号, 行数, 列数を指定し、カード情報を設定
    sheet.getRange(2, 1, cards.length, cards[0].length).setValues(cards);
  }
  
  /*
   * スプレッドシートの値をクリアします
   * @param  なし
   * @return なし
   */
  function clear() {
    // アクティブなワークブックを指定する
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // シート名を指定してシートを取得する
    var sheet = spreadsheet.getSheetByName('list3'); // ★★★
    // 行番号, 列番号, 行数, 列数を指定し、スプレッドシートの値をクリアする
    sheet.getRange(2, 1 , 20, 5).clear()
  }