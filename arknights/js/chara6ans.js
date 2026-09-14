/* ------最終更新日設定------ */
// 変数設定
const last = new Date(document.lastModified);
const year = last.getFullYear();
const month = last.getMonth() + 1;
const date = last.getDate();

// 最終更新日変更
// 月・日の値を修正した後に格納する変数を用意する
let fixedMonth = month;
let fixedDate = date;
// 月の値が10より小さい場合は先頭に「0」を追加
if (month < 10) {
  fixedMonth = "0" + month;
}
// 日の値が10より小さい場合は先頭に「0」を追加
if (date < 10) {
  fixedDate = "0" + date;
}

// 表示用のテキストを作成 例: 2024年2月8日
const viewDateText = year + "年" + month + "月" + date + "日";
// データ用の文字列を作成 例: 2024-02-08
const datetimeText = year + "-" + fixedMonth + "-" + fixedDate;

// 更新日の表示先のHTML要素「time」タグを取得
const target = document.getElementById('modified_date');
// timeタグの内容を上書きする 例: 2024年2月8日
target.textContent = viewDateText;
// timeタグのdatetime属性を追加する 例: 2024-02-08
target.setAttribute("datetime", datetimeText);


// インプットボックス変数宣言
const inputBox = document.getElementById("inputBox");

/* ------タイマー設定------ */
// 変数設定
const time = document.getElementById('timer');
let startTime;
let stopTime = 0;
let timeoutID;
let firstStart = false
let isStart = false

// タイマーの設定
function displayTime() {
  const currentTime = new Date(Date.now() - startTime + stopTime);
  const h = String(currentTime.getHours() - 9).padStart(2, '0');
  const m = String(currentTime.getMinutes()).padStart(2, '0');
  const s = String(currentTime.getSeconds()).padStart(2, '0');

  time.textContent = `${h}:${m}:${s}`;
  timeoutID = setTimeout(displayTime, 10);
}

inputBox.addEventListener('click', function () {
  if (!firstStart) {
    firstStart = true;
    isStart = true;
    startTime = Date.now();
    displayTime();
  }
});

time.addEventListener('click', function () {
  if (!isStart) {
    isStart = true;
    // stopButton.disabled = false;
    // resetButton.disabled = true;
    startTime = Date.now();
    displayTime();
  } else if (isStart) {
    isStart = false;
    clearTimeout(timeoutID);
    stopTime += (Date.now() - startTime);
  }
});



let numerator = document.getElementById('numerator');
let n = 0;

const result = document.getElementById('result');
let ansList = [];







// 外部ファイルの読み込み
let memberList = [];
let notFound = [];
let denominator = document.getElementById('denominator');
async function loadData() {
  try {
    // notFound.jsonを読みに行く
    const response = await fetch('./json/character.json');
    if (!response.ok) throw new Error('ファイルの読み込みに失敗しました');

    memberList = await response.json();
    notFound = memberList.map((item, index) => ({
      id: index + 1,    // 1から始まるIDを振る
      ...item           // 元の name や keywords を展開する
    }));

    // 読み込み完了後に準備を整える
    inputBox.disabled = false;
    inputBox.placeholder = "キャラクター名を入力";
    console.log("読み込み完了:", notFound.length, "件");
    // console.log(notFound);
    denominator.innerHTML = notFound.length

  } catch (error) {
    console.error("エラー:", error);
    alert("データの読み込みに失敗しました。サーバーを確認してください。");
  }
}

// 並び替え
function updateDisplay() {
  // 一旦グリッドの中身を空にする
  result.innerHTML = "";

  // 正解済みリストをID順に並び替える
  ansList.sort((a, b) => a.id - b.id);

  // 並び替えたリストを画面に表示
  ansList.forEach(member => {
    // ①ボックス全体
    const ansBox = document.createElement('div');
    ansBox.className = 'ansGridItem';
    // ansBox.id = ;
    // ②テキスト
    const ansName = document.createElement('div')
    ansName.className = 'ansDisplay';
    ansName.textContent = member.name;
    // ③画像
    const ansImg = document.createElement('div')
    ansImg.className = 'ansDisplay'
    let img_element = document.createElement('img');
    img_element.src = './img/6staricon/' + member.img + '.png';
    img_element.width = 100;
    img_element.height = 100;

    result.appendChild(ansBox);
    ansBox.appendChild(ansName);
    ansBox.appendChild(ansImg);
    ansImg.appendChild(img_element);

  });
}

// 判定処理
inputBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const inputValue = inputBox.value.trim().replace(/\s+/g, "");
    if (inputValue === "") return;

    const ansNum = notFound.findIndex(member =>
      member.keywords.some(k => k.replace(/\s+/g, "") === inputValue)
    );

    //  配列に含まれているかチェック
    if (ansNum !== -1) {
      // 答えを抽出
      const ans = notFound[ansNum];
      // 元配列から消去・解答リストに追加
      notFound = notFound.filter((_, index) => index !== ansNum);
      ansList.push(ans);
      // 画面に追記する
      updateDisplay();

      // カウントを増やす
      n++;
      numerator.innerHTML = n;
    } else if (inputValue == "すべて") {
      //デバッグ用
      const all = notFound
      ansList = notFound
      updateDisplay();
    }

    // 入力欄を空にする
    inputBox.value = "";
  }
});

loadData();
