function getFromLocalStorage(name: string, notFoundValue: string = null) : string {
  if (!localStorage) { return notFoundValue; }

  let item = localStorage.getItem(name);
  if (item) {
    return item;
  } else {
    return notFoundValue;
  }
}

function getBooleanFromLocalStorage(name: string, notFoundValue: boolean) : boolean {
  let str = getFromLocalStorage(name);
  if (str) {
    return str == "0" ? false : true;
  } else {
    return notFoundValue;
  }
}

function loadSettings() : void {
  if (!localStorage) { return; }

  (<HTMLSelectElement>document.getElementById("difficulty")).value = getFromLocalStorage("exp-table:Difficulty", "All");
  (<HTMLInputElement>document.getElementById("includeExtraStage")).checked = getBooleanFromLocalStorage("exp-table:IncludeExtraStage", true);
  (<HTMLInputElement>document.getElementById("only20")).checked = getBooleanFromLocalStorage("exp-table:OnlyTop20", true);
  (<HTMLInputElement>document.getElementById("separateEventStage")).checked = getBooleanFromLocalStorage("exp-table:SeparateEventStage", false);
}

function saveSettings() : void {
  if (!localStorage) { return; }

  localStorage.setItem("exp-table:Difficulty", (<HTMLSelectElement>document.getElementById("difficulty")).value);
  localStorage.setItem("exp-table:IncludeExtraStage", (<HTMLInputElement>document.getElementById("includeExtraStage")).checked ? "1" : "0");
  localStorage.setItem("exp-table:OnlyTop20", (<HTMLInputElement>document.getElementById("only20")).checked ? "1" : "0");
  localStorage.setItem("exp-table:SeparateEventStage", (<HTMLInputElement>document.getElementById("separateEventStage")).checked ? "1" : "0");
}

function getDayOfWeekLetter(dayOfWeek: number) : string {
  switch (dayOfWeek) {
    case 0: return "日";
    case 1: return "月";
    case 2: return "火";
    case 3: return "水";
    case 4: return "木";
    case 5: return "金";
    case 6: return "土";
  }
  return "？";
}

// function getDayOfWeekName(dayOfWeek: number) : string {
//   switch (dayOfWeek) {
//     case 0: return "日曜日";
//     case 1: return "月曜日";
//     case 2: return "火曜日";
//     case 3: return "水曜日";
//     case 4: return "木曜日";
//     case 5: return "金曜日";
//     case 6: return "土曜日";
//   }
//   return "？曜日";
// }

function getBonusDayLetter(dayOfWeek: number) : string {
  if (dayOfWeek === undefined) {
    return "？";
  }
  if (dayOfWeek == null) {
    return "--";
  }
  switch (dayOfWeek) {
    case 0: return "日";
    case 1: return "月";
    case 2: return "火";
    case 3: return "水";
    case 4: return "木";
    case 5: return "金";
    case 6: return "土";
  }
  return "？";
}

// ステージ難易度
enum StageMode
{
  Normal,
  Hard,
  Twist,
}

function getStageModeLetter(mode: StageMode) : string {
  switch (mode) {
    case StageMode.Normal: return "N";
    case StageMode.Hard: return "H";
    case StageMode.Twist: return "T";
  }
  return "?";
}

function getStageModeClassName(mode: StageMode) : string {
  switch (mode) {
    case StageMode.Normal: return "stage_mode_normal";
    case StageMode.Hard: return "stage_mode_hard";
    case StageMode.Twist: return "stage_mode_twist";
  }
}

// ステージカテゴリ
enum StageCategory
{
  Numbered,
  Alphabetical,
  Extra,
  Event,
}

// ユニット種別
enum UnitType
{
  Melee,
  Ranged,
  Magic,
  Heavy,
}

function parseUnitType(s: string) : UnitType {
  switch (s) {
    case "Melee": return UnitType.Melee;
    case "Ranged": return UnitType.Ranged;
    case "Magic": return UnitType.Magic;
    case "Heavy": return UnitType.Heavy;
  }
  return null;
}

function getExpBonusUnitTypeClassName(unitType: UnitType) : string {
  if (unitType == null) {
    return null;
  }
  switch (unitType) {
    case UnitType.Melee: return "unit_type_melee";
    case UnitType.Ranged: return "unit_type_ranged";
    case UnitType.Magic: return "unit_type_magic";
    case UnitType.Heavy: return "unit_type_heavy";
  }
}

function getExpBonusUnitTypeLetter(unitType: UnitType) : string {
  if (unitType == null) {
    return "--";
  }
  switch (unitType) {
    case UnitType.Melee: return "近";
    case UnitType.Ranged: return "射";
    case UnitType.Magic: return "魔";
    case UnitType.Heavy: return "重";
  }
}

class StageInfo
{
  //============================================================================
  // VARIABLES
  //============================================================================

  // 1, 2, 3, 4, ...
  // イベントステージの場合は null
  private _districtLetter: string;
  // 難易度部分を含まない名前。
  // 1-1, 2-A, 3-EX1, まつり級, ...
  private _name: string;
  // 1, 2, 3, A, B, C, ...
  // イベントステージの場合は null
  //private _stageLetter: string;
  private _category: StageCategory;
  //private _isNumberedStage: boolean;
  // イベントステージの場合は null
  private _mode: StageMode;
  // イベントステージ以外では null
  //private _eventStageName: string;
  //private _isEventStage: boolean;
  private _motivationConsumption: number;
  private _baseExp: number;
  private _baseGold: number;
  // 0: 日, 1: 月, ..., 6: 土
  // 空の場合はボーナス無し。undefined の場合はデータ無し。
  private _expBonusDays: number[];
  private _goldBonusDay: number;
  // null の場合はボーナス無し。
  private _expBonusUnitType: UnitType;
  // 残マナによる経験値ボーナスが可能なステージか
  private _isManaBonusAllowed: boolean;
  // 地盤維持によるゴールドボーナスが可能なステージか
  private _isProtectionBonusAllowed: boolean;

  //============================================================================
  // CONSTRUCTOR
  //============================================================================

  // stageName: "N 1-1", "H 2-A", "T 3-5", ...
  public constructor(
    stageName: string,
    motivationConsumption: number,
    baseExp: number,
    baseGold: number,
    expBonusDays: number[],
    goldBonusDay: number,
    expBonusUnitType: UnitType,
    isManaBonusAllowed: boolean = true,
    isProtectionBonusAllowed: boolean = false)
  {
    this._motivationConsumption = motivationConsumption;
    this._baseExp = baseExp;
    this._baseGold = baseGold;
    this._expBonusDays = expBonusDays;
    this._goldBonusDay = goldBonusDay;
    this._expBonusUnitType = expBonusUnitType;
    this._isManaBonusAllowed = isManaBonusAllowed;
    this._isProtectionBonusAllowed = isProtectionBonusAllowed;

    if (0 <= ["N", "H", "T"].indexOf(stageName[0])) {
      // Numbered, Alphabetical or Extra
      this._districtLetter = stageName[2];
      switch (stageName[0]) {
        case "N": this._mode = StageMode.Normal; break;
        case "H": this._mode = StageMode.Hard; break;
        case "T": this._mode = StageMode.Twist; break;
      }
      if (stageName.length == 5) {
        // Numbered or Alphabetical
        if (isNaN(parseInt(stageName[4], 10))) {
          this._category = StageCategory.Alphabetical;
        } else {
          this._category = StageCategory.Numbered;
        }
      }
      else {
        // Extra
        this._category = StageCategory.Extra;
      }
      // "N " などを切り落とす
      this._name = stageName.slice(2);
    } else {
      // Event
      this._districtLetter = null;
      this._mode = null;
      this._category = StageCategory.Event;
      this._name = stageName;
    }
  }

  //============================================================================
  // PROPERTIES
  //============================================================================

  // N 1-1 形式
  public get fullName() : string {
    if (this._category == StageCategory.Event) {
      return this._name;
    } else {
      return getStageModeLetter(this._mode) + " " + this._name;
    }
  }

  // 1-1 形式 (難易度部分を含まない)
  public get shortName() : string {
    if (this._category == StageCategory.Event) {
      return this._name;
    } else {
      return this._name;
    }
  }

  // 選挙区番号。イベントステージの場合は null。
  public get district() : number { return this._districtLetter ? parseInt(this._districtLetter) : null; }
  public get category() : StageCategory { return this._category; }
  public get mode() : StageMode { return this._mode; }
  public get motivationConsumption() : number { return this._motivationConsumption; }
  public get baseExp() : number { return this._baseExp; }
  public get expBonusDays() : number[] { return this._expBonusDays; }
  public get expBonusUnitType() : UnitType { return this._expBonusUnitType; }
  public get isManaBonusAllowed() : boolean { return this._isManaBonusAllowed; }
  public get baseGold() : number { return this._baseGold; }
  public get goldBonusDay() : number { return this._goldBonusDay; }
  public get isProtectionBonusAllowed() : boolean { return this._isProtectionBonusAllowed; }
  public get isNumberedStage() : boolean { return this._category == StageCategory.Numbered; }
  public get isEventStage() : boolean { return this._category == StageCategory.Event; }

  //============================================================================
  // METHODS
  //============================================================================

}

class TableRecord
{
  private _stageInfo: StageInfo;
  private _expBonusUnitType: UnitType;
  private _dayOfWeek: number;
  private _isManaBonusApplied: boolean;

  private _isUnitTypeExpBonusApplied: boolean;
  private _isExpBonusDay: boolean;
  // 育成キャンペーンによる経験値 1.3 倍対象か？曜日合致で 1.3 倍の場合は false。
  private _isSpecialExpBonusDay: boolean;
  private _isDoubleExpBonusApplied: boolean;
  private _finalExpFactor: number;
  private _finalExp: number;

  private _isGoldBonusDay: boolean;
  private _finalGoldFactor: number;

  // dayOfWeek: 曜日 (0 = 日, 1 = 月, ..., 6 = 土)
  public constructor(
    stageInfo: StageInfo,
    expBonusUnitType: UnitType,
    dayOfWeek: number,
    useManaBonus: boolean,
    useDoubleExpBonus: boolean,
    useProtectionBonus: boolean)
  {
    this._stageInfo = stageInfo;
    this._expBonusUnitType = expBonusUnitType;
    this._dayOfWeek = dayOfWeek;
    this._isDoubleExpBonusApplied = useDoubleExpBonus;

    // EXP
    {
      // 適用される倍率を列挙して、最後にまとめて乗算する。
      // 適用順が異なると最終経験値が微妙にずれるので注意。
      let factors: number[] = [];

      // 曜日によるボーナス
      if (this._stageInfo.expBonusDays != null && (0 <= this._stageInfo.expBonusDays.indexOf(this._dayOfWeek))) {
        // 曜日合致による普通の経験値 1.3 倍
        factors.push(1.3);
        this._isExpBonusDay = true;
      } else {
        this._isExpBonusDay = false;
      }
      // 残マナボーナス
      if (useManaBonus && this._stageInfo.isManaBonusAllowed) {
        factors.push(1.2);
        this._isManaBonusApplied = true;
      } else {
        this._isManaBonusApplied = false;
      }
      // 二倍ボーナス
      if (useDoubleExpBonus) {
        factors.push(2.0);
      }
      // ユニット種別によるボーナス
      if ((this._expBonusUnitType != null) && (this._stageInfo.expBonusUnitType == this._expBonusUnitType)) {
        factors.push(1.3);
        this._isUnitTypeExpBonusApplied = true;
      } else {
        this._isUnitTypeExpBonusApplied = false;
      }

      // 最終値を計算
      let finalFactor: number = 1.0;
      let finalExp: number = this._stageInfo.baseExp;
      for (let factor of factors) {
        finalFactor *= factor;
        finalExp = Math.floor(finalExp * factor);
      }

      this._finalExpFactor = finalFactor;
      this._finalExp = finalExp;
    }

    // Gold
    {
      let goldFactor: number = 1.0;
      // 曜日によるボーナス
      if (this._stageInfo.goldBonusDay != null && this._stageInfo.goldBonusDay == this._dayOfWeek) {
        goldFactor *= 1.3;
        this._isGoldBonusDay = true;
      } else {
        this._isGoldBonusDay = false;
      }
      // 地盤維持ボーナス
      if (useProtectionBonus && this._stageInfo.isProtectionBonusAllowed) {
        goldFactor *= 1.2;
      }
      this._finalGoldFactor = goldFactor;
    }

    this.expColorScaleRatio = null;
  }

  public get stageInfo() : StageInfo { return this._stageInfo; }
  public get isUnitTypeExpBonnusApplied() : boolean { return this._isUnitTypeExpBonusApplied; }
  public get isExpBonusDay() : boolean { return this._isExpBonusDay; }
  public get isSpecialExpBonusDay() : boolean { return this._isSpecialExpBonusDay; }
  public get isManaBonusApplied() : boolean { return this._isManaBonusApplied; }
  public get isExpDoubleBonusApplied() : boolean { return this._isDoubleExpBonusApplied; }
  public get finalExpFactor() : number { return this._finalExpFactor; }
  public get finalExp() : number { return this._finalExp; }
  public get finalExpPerMotivation() : number { return this._finalExp / this._stageInfo.motivationConsumption; }
  public get isGoldBonusDay() : boolean { return this._isGoldBonusDay; }
  public get finalGoldPerMotivation() : number { return this._stageInfo.baseGold * this._finalGoldFactor / this._stageInfo.motivationConsumption; }
  public expColorScaleRatio : number;  // 0..1, or null
}

// 総理が選択されている場合は null を返す。
function getSelectedExpBonusUnitType() : UnitType {
  let radios = document.getElementsByName("exp_bonus_unit_type");
  for (let i: number = 0; i < radios.length; ++i) {
    let radio = <HTMLInputElement>radios[i];
    if (radio.checked) {
      if (radio.value == "Souri") {
        return null;
      } else {
        return parseUnitType(radio.value);
      }
    }
  }
  return null;
}

function getSelectedDayOfWeek() : number {
  let now: Date = new Date();
  let radios = document.getElementsByName("exp_bonus_day");
  for (let index in radios) {
    let radio = <HTMLInputElement>(radios[index]);
    if (radio.checked) {
      return parseInt(radio.value);
    }
  }

  // 曜日が選択されていない。テキトウな値を返す。
  return 0;
}

// 曜日選択ラジオボタンのラベルを設定する。
// "(今日)" の位置を更新するために、初期化時以外にも呼び出される。
function setDayOfWeekSelectorLabels() : void {
  let now: Date = new Date();
  for (let i = 0; i < 7; ++i) {
    let labelNodeID = "exp_bonus_day_" + i;
    let labelNode = document.getElementById(labelNodeID);
    labelNode.innerText = getDayOfWeekLetter(i);
    if (i == now.getDay()) {
      labelNode.innerText += "(今日)";
      labelNode.style.fontWeight = "bold";
    } else {
      labelNode.style.fontWeight = "inherit";
    }
  }
}

var stages: StageInfo[];
function initializeStageList() {
  var 日: number = 0;
  var 月: number = 1;
  var 火: number = 2;
  var 水: number = 3;
  var 木: number = 4;
  var 金: number = 5;
  var 土: number = 6;
  var 無: number = null;
  // 全ステージのリスト
  stages = [
    // N 2
    new StageInfo("N 2-1", 12, 1803,  630, [月,金], 木, UnitType.Magic),
    new StageInfo("N 2-F", 12, 1915,  580, [水,金], 月, UnitType.Magic),
    new StageInfo("N 2-G", 12, 1905,  490, [月,木], 火, UnitType.Ranged),
    new StageInfo("N 2-H", 13, 2065,  550, [日,金], 水, UnitType.Melee),
    new StageInfo("N 2-2", 12, 1815,  630, [火,水], 金, UnitType.Ranged),
    new StageInfo("N 2-A", 13, 2025,  890, [日,水], 土, UnitType.Heavy),
    new StageInfo("N 2-3", 13, 2067,  900, [木,土], 日, UnitType.Melee),
    new StageInfo("N 2-B", 14, 2245,  950, [火,金], 月, UnitType.Magic),
    new StageInfo("N 2-C", 15, 2400,  810, [月,土], 火, null),
    new StageInfo("N 2-I", 13, 2098,  670, [水,土], 木, UnitType.Heavy),
    new StageInfo("N 2-4", 16, 2575,  870, [日,金], 水, UnitType.Ranged),
    new StageInfo("N 2-D", 17, 2474, 1590, [月,火], 無, UnitType.Melee),
    new StageInfo("N 2-E", 18, 2912,  800, [火,木], 金, UnitType.Heavy),
    new StageInfo("N 2-J", 17, 2769, 1140, [日,木], 金, UnitType.Magic),
    new StageInfo("N 2-K", 17, 2763, 1100, [火,土], 日, UnitType.Magic),
    new StageInfo("N 2-5", 20, 3293, 1110, [日,水], 土, UnitType.Melee),

    // H 2
    new StageInfo("H 2-1", 22, 3690, 1730, [日,金], 水, UnitType.Heavy),
    new StageInfo("H 2-F", 28, 4720, 2480, [日,月], 無, UnitType.Ranged),
    new StageInfo("H 2-G", 28, 4771, 2540, [火,金], 無, UnitType.Melee),
    new StageInfo("H 2-H", 28, 4785, 2480, [日,土], 水, UnitType.Heavy),
    new StageInfo("H 2-2", 23, 3814, 1800, [月,土], 木, UnitType.Ranged),
    new StageInfo("H 2-A", 24, 4057, 2830, [月,火], 金, UnitType.Melee),
    new StageInfo("H 2-3", 28, 4612, 2900, [月,水], 土, UnitType.Magic),
    new StageInfo("H 2-B", 29, 4820, 3070, [火,木], 日, UnitType.Ranged),
    new StageInfo("H 2-C", 29, 4861, 2140, [水,金], 月, null),
    new StageInfo("H 2-I", 29, 4947, 2600, [火,木], 無, UnitType.Magic),
    new StageInfo("H 2-4", 31, 5318, 2210, [木,土], 火, UnitType.Melee),
    new StageInfo("H 2-D", 36, 6011, 4280, [日,月], 無, UnitType.Heavy),
    new StageInfo("H 2-E", 36, 6086, 1860, [日,水], 木, UnitType.Magic),
    new StageInfo("H 2-J", 34, 5792, 3020, [水,金], 無, UnitType.Ranged),
    new StageInfo("H 2-K", 35, 5980, 3120, [水,土], 無, UnitType.Melee),
    new StageInfo("H 2-5", 36, 6105, 2430, [木,土], 金, UnitType.Magic),

    // T 2
    new StageInfo("T 2-1", 37, 6121, 4130, [月,土], 金, UnitType.Heavy),
    new StageInfo("T 2-F", 37, 6072, 3980, [月,水], 日, UnitType.Magic),
    new StageInfo("T 2-G", 37, 6284, 3950, [火,金], 月, UnitType.Melee),
    new StageInfo("T 2-H", 38, 6598, 4060, [水,土], 火, UnitType.Ranged),
    new StageInfo("T 2-2", 38, 6494, 4220, [日,火], 土, UnitType.Ranged),
    new StageInfo("T 2-A", 38, 6400, 4250, [月,水], 日, UnitType.Melee),
    new StageInfo("T 2-3", 39, 6897, 4210, [日,火], 月, UnitType.Melee),
    new StageInfo("T 2-B", 40, 6860, 4500, [水,木], 火, UnitType.Heavy),
    new StageInfo("T 2-C", 40, 6940, 4260, [木,土], 水, UnitType.Melee),
    new StageInfo("T 2-I", 40, 6892, 4260, [木,金], 水, UnitType.Magic),
    new StageInfo("T 2-4", 40, 6996, 4320, [月,金], 木, UnitType.Ranged),
    new StageInfo("T 2-D", 40, 7035, 4430, [月,土], 金, UnitType.Magic),
    new StageInfo("T 2-E", 40, 7051, 4290, [日,木], 土, UnitType.Ranged),
    new StageInfo("T 2-J", 40, 7019, 4350, [日,金], 木, UnitType.Heavy),
    new StageInfo("T 2-K", 40, 7302, 4450, [火,土], 金, UnitType.Heavy),
    new StageInfo("T 2-5", 41, 7360, 4390, [日,火], 土, UnitType.Magic),

    // N 3
    new StageInfo("N 3-1", 19, 3114, 1940, [日,月], 金, UnitType.Ranged),
    new StageInfo("N 3-2", 19, 3141, 1960, [月,木], 土, UnitType.Melee),
    new StageInfo("N 3-A", 19, 3158, 2560, [月,火], 無, UnitType.Magic),
    new StageInfo("N 3-3", 20, 3344, 2050, [水,金], 月, UnitType.Heavy),
    new StageInfo("N 3-B", 20, 3398, 2670, [日,木], 無, UnitType.Melee),
    new StageInfo("N 3-C", 21, 3553, 2200, [金,土], 水, UnitType.Ranged),
    new StageInfo("N 3-4", 22, 3737, 2300, [水,土], 木, UnitType.Magic),
    new StageInfo("N 3-D", 22, 3752, 2200, [日,木], 金, UnitType.Heavy),
    new StageInfo("N 3-E", 23, 3949, 2440, [月,火], 土, UnitType.Ranged),
    new StageInfo("N 3-5", 24, 4238, 2530, [火,金], 日, UnitType.Magic),
    new StageInfo("N 3-F", 19, 3127, 2000, [水,土], 月, UnitType.Heavy),
    new StageInfo("N 3-G", 21, 3599, 2170, [日,木], 火, UnitType.Ranged),
    new StageInfo("N 3-H", 19, 3137, 1980, [火,金], 水, UnitType.Melee),
    new StageInfo("N 3-I", 21, 3584, 2220, [水,土], 木, UnitType.Melee),

    // H 3
    new StageInfo("H 3-1", 37, 6334, 4070, [水,金], 月, UnitType.Melee),
    new StageInfo("H 3-2", 37, 6325, 4080, [日,木], 火, UnitType.Ranged),
    new StageInfo("H 3-A", 38, 6493, 4210, [月,金], 水, UnitType.Magic),
    new StageInfo("H 3-3", 38, 6580, 4190, [火,土], 木, UnitType.Ranged),
    new StageInfo("H 3-B", 39, 6716, 4370, [日,月], 金, UnitType.Melee),
    new StageInfo("H 3-C", 40, 6924, 4480, [月,金], 土, UnitType.Ranged),
    new StageInfo("H 3-4", 40, 7027, 4370, [火,水], 日, UnitType.Heavy),
    new StageInfo("H 3-D", 40, 6985, 4350, [水,土], 火, UnitType.Magic),
    new StageInfo("H 3-E", 40, 7018, 4540, [日,木], 水, UnitType.Heavy),
    new StageInfo("H 3-5", 41, 7397, 4460, [金,土], 木, UnitType.Heavy),
    new StageInfo("H 3-F", 37, 6346, 4250, [火,土], 金, UnitType.Melee),
    new StageInfo("H 3-G", 40, 6959, 4450, [日,木], 土, UnitType.Magic),
    new StageInfo("H 3-H", 37, 6357, 4110, [月,木], 日, UnitType.Melee),
    new StageInfo("H 3-I", 40, 6988, 4390, [火,水], 月, UnitType.Ranged),

    // T 3
    new StageInfo("T 3-1", 41, 7090, 4600, [火,金], 木, UnitType.Melee),
    new StageInfo("T 3-2", 41, 7281, 4640, [水,土], 金, UnitType.Ranged),
    new StageInfo("T 3-3", 41, 7435, 0, [月, 金], 日, UnitType.Heavy),
    new StageInfo("T 3-A", 41, 7152, 4570, [日,木], 土, UnitType.Magic),
    new StageInfo("T 3-F", 41, 7184, 4780, [月,土], 日, UnitType.Magic),

    // N 4
    new StageInfo("N 4-1", 25, 4211, 2740, [月,火], 木, UnitType.Magic),
    new StageInfo("N 4-2", 25, 4265, 2760, [月,火], 金, UnitType.Melee),
    new StageInfo("N 4-3", 25, 4348, 2770, [日,水], 土, UnitType.Ranged),
    new StageInfo("N 4-4", 26, 4609, 2860, [木,土], 日, UnitType.Ranged),
    new StageInfo("N 4-5", 26, 4616, 2860, [日,金], 月, UnitType.Magic),
    new StageInfo("N 4-A", 25, 4218, 2790, [金,土], 火, UnitType.Melee),
    new StageInfo("N 4-B", 25, 4319, 2820, [日,土], 水, UnitType.Heavy),
    new StageInfo("N 4-C", 26, 4535, 2890, [月,水], 木, UnitType.Heavy),
    new StageInfo("N 4-D", 26, 4559, 2950, [火,木], 金, UnitType.Melee),
    new StageInfo("N 4-E", 25, 4234, 2720, [火,水], 土, UnitType.Ranged),
    new StageInfo("N 4-F", 25, 4331, 2750, [月,木], 日, UnitType.Ranged),
    new StageInfo("N 4-G", 26, 4551, 2870, [木,金], 月, UnitType.Heavy),
    new StageInfo("N 4-H", 26, 4596, 2920, [水,土], 火, UnitType.Melee),

    // H 4
    new StageInfo("H 4-1", 41, 7208, 4790, [金,土], 月, UnitType.Ranged),
    new StageInfo("H 4-2", 41, 7278, 4840, [日,土], 火, UnitType.Melee),
    new StageInfo("H 4-3", 41, 7297, 4740, [日,火], 水, UnitType.Magic),
    new StageInfo("H 4-4", 41, 7439, 4750, [月,金], 木, UnitType.Melee),
    new StageInfo("H 4-5", 42, 7678, 4830, [月,火], 金, UnitType.Heavy),
    new StageInfo("H 4-A", 41, 7275, 4780, [火,水], 土, UnitType.Ranged),
    new StageInfo("H 4-B", 41, 7268, 4900, [木,金], 日, UnitType.Magic),
    new StageInfo("H 4-C", 41, 7328, 4830, [金,土], 月, UnitType.Heavy),
    new StageInfo("H 4-D", 42, 7581, 4770, [水,土], 火, UnitType.Magic),
    new StageInfo("H 4-E", 41, 7253, 4840, [日,木], 水, UnitType.Melee),
    new StageInfo("H 4-F", 41, 7294, 4820, [日,月], 木, UnitType.Ranged),
    new StageInfo("H 4-G", 41, 7367, 4710, [火,水], 金, UnitType.Melee),
    new StageInfo("H 4-H", 42, 7607, 4810, [水,木], 土, UnitType.Ranged),

    // N 5
    new StageInfo("N 5-1", 26, 4544, 3120, [日,火], 金, UnitType.Ranged),
    new StageInfo("N 5-2", 26, 4646, 3130, [水,金], 土, UnitType.Melee),
    new StageInfo("N 5-3", 27, 4779, 3150, [木,土], 日, UnitType.Heavy),
    new StageInfo("N 5-4", 27, 4874, 3110, [水,金], 月, UnitType.Magic),
    new StageInfo("N 5-5", 27, 4908, 3090, [木,土], 火, UnitType.Ranged),
    new StageInfo("N 5-A", 26, 4499, 3040, [日,火], 水, UnitType.Magic),
    new StageInfo("N 5-B", 27, 4808, 3140, [日,月], 木, UnitType.Melee),
    new StageInfo("N 5-C", 27, 4899, 3130, [月,火], 金, UnitType.Heavy),
    new StageInfo("N 5-D", 27, 4892, 3110, [水,金], 土, UnitType.Ranged),
    new StageInfo("N 5-E", 26, 4552, 3130, [木,土], 日, UnitType.Melee),

    // H 5
    new StageInfo("H 5-1", 42, 7641, 5300, [木,土], 火, UnitType.Ranged),
    new StageInfo("H 5-2", 42, 7702, 5050, [日,月], 水, UnitType.Heavy),
    new StageInfo("H 5-3", 42, 7783, 5110, [日,月], 木, UnitType.Ranged),
    new StageInfo("H 5-4", 42, 7849, 5300, [火,水], 金, UnitType.Melee),
    new StageInfo("H 5-5", 43, 8139, 5270, [水,金], 土, UnitType.Heavy),
    new StageInfo("H 5-A", 42, 7658, 5300, [火,木], 日, UnitType.Magic),
    new StageInfo("H 5-B", 42, 7809, 5200, [金,土], 月, UnitType.Melee),
    new StageInfo("H 5-C", 42, 7786, 5000, [水,土], 火, UnitType.Magic),
    new StageInfo("H 5-D", 43, 8106, 5330, [日,木], 水, UnitType.Melee),
    new StageInfo("H 5-E", 42, 7666, 5060, [月,金], 木, UnitType.Magic),

    // N 6
    new StageInfo("N 6-1", 27, 4842, 3190, [日,水], 土, UnitType.Heavy),
    new StageInfo("N 6-2", 27, 4965, 3410, [木,土], 日, UnitType.Melee),
    new StageInfo("N 6-3", 27, 5009, 3400, [火,金], 月, UnitType.Magic),
    new StageInfo("N 6-4", 27, 5059, 3200, [月,土], 火, UnitType.Magic),
    new StageInfo("N 6-5", 28, 5290, 3420, [日,木], 水, UnitType.Ranged),
    new StageInfo("N 6-A", 27, 4915, 3270, [月,金], 木, UnitType.Heavy),
    new StageInfo("N 6-B", 27, 4887, 3210, [日,火], 金, UnitType.Melee),
    new StageInfo("N 6-C", 27, 5032, 3390, [月,水], 土, UnitType.Ranged),
    new StageInfo("N 6-D", 28, 5190, 3550, [水,木], 日, UnitType.Melee),
    new StageInfo("N 6-E", 27, 4935, 3430, [金,土], 月, UnitType.Ranged),
    new StageInfo("N 6-EX1", 35, 7503, 4760, [日,土], 火, UnitType.Ranged),
    new StageInfo("N 6-EX2", 35, 7508, 4750, [日,木], 水, UnitType.Magic),
    new StageInfo("N 6-EX3", 35, 7515, 4760, [金,土], 木, UnitType.Heavy),
    new StageInfo("N 6-EX4", 35, 7520, 4740, [月,火], 金, UnitType.Magic),
    new StageInfo("N 6-EX5", 35, 7511, 4760, [日,水], 土, UnitType.Heavy),

    // H 6
    new StageInfo("H 6-1", 43, 8008, 5370, [日,木], 水, UnitType.Magic),
    new StageInfo("H 6-2", 43, 7999, 5390, [月,水], 木, UnitType.Melee),
    new StageInfo("H 6-3", 43, 8025, 5330, [月,火], 金, UnitType.Ranged),
    new StageInfo("H 6-4", 43, 8184, 5360, [日,水], 土, UnitType.Heavy),
    new StageInfo("H 6-5", 44, 8354, 5500, [火,木], 日, UnitType.Heavy),
    new StageInfo("H 6-A", 43, 7914, 5360, [金,土], 月, UnitType.Ranged),
    new StageInfo("H 6-B", 43, 8048, 5390, [水,土], 火, UnitType.Magic),
    new StageInfo("H 6-C", 43, 8104, 5370, [日,木], 水, UnitType.Melee),
    new StageInfo("H 6-D", 44, 8294, 5470, [月,金], 木, UnitType.Magic),
    new StageInfo("H 6-E", 43, 8046, 5350, [火,土], 金, UnitType.Melee),
    new StageInfo("H 6-EX1", 55, 12067, 7710, [月,水], 土, UnitType.Ranged),
    new StageInfo("H 6-EX2", 55, 12080, 7730, [水,木], 日, UnitType.Heavy),
    new StageInfo("H 6-EX3", 55, 12096, 7700, [日,土], 月, UnitType.Melee),
    new StageInfo("H 6-EX4", 55, 12102, 7710, [水,土], 火, UnitType.Magic),
    new StageInfo("H 6-EX5", 55, 12111, 7720, [日,火], 水, UnitType.Heavy),

    // N 7
    new StageInfo("N 7-1", 28, 5193, 3470, [月,木], 日, UnitType.Ranged),
    new StageInfo("N 7-2", 28, 5301, 3460, [木,金], 月, UnitType.Melee),
    new StageInfo("N 7-3", 28, 5392, 3540, [水,土], 火, UnitType.Heavy),
    new StageInfo("N 7-4", 28, 5412, 3490, [日,金], 水, UnitType.Magic),
    new StageInfo("N 7-5", 28, 5467, 3520, [月,火], 木, UnitType.Melee),
    new StageInfo("N 7-A", 28, 5260, 3490, [日,火], 金, UnitType.Heavy),
    new StageInfo("N 7-B", 28, 5324, 3520, [火,水], 土, UnitType.Ranged),
    new StageInfo("N 7-C", 28, 5387, 3490, [月,木], 日, UnitType.Magic),
    new StageInfo("N 7-D", 28, 5436, 3530, [火,金], 月, UnitType.Ranged),
    new StageInfo("N 7-E", 28, 5297, 3510, [水,土], 火, UnitType.Melee),
    new StageInfo("N 7-F", 28, 5310, 3550, [日,土], 水, UnitType.Ranged),
    new StageInfo("N 7-EX1", 35, 7539, 4730, [月,水], 木, UnitType.Heavy),
    new StageInfo("N 7-EX2", 35, 7535, 4740, [火,土], 金, UnitType.Melee),
    new StageInfo("N 7-EX3", 35, 7540, 4720, [火,水], 土, UnitType.Ranged),
    new StageInfo("N 7-EX4", 35, 7530, 4760, [日,木], 月, UnitType.Melee),
    new StageInfo("N 7-EX5", 35, 7536, 4780, [金,土], 日, UnitType.Magic),

    // H 7
    new StageInfo("H 7-1", 44, 8541, 5710, [月,金], 木, UnitType.Melee),
    new StageInfo("H 7-2", 44, 8599, 5700, [火,土], 金, UnitType.Magic),
    new StageInfo("H 7-3", 44, 8596, 5720, [水,金], 土, UnitType.Ranged),
    new StageInfo("H 7-4", 44, 8665, 5760, [水,木], 日, UnitType.Melee),
    new StageInfo("H 7-5", 45, 8866, 5880, [木,金], 月, UnitType.Magic),
    new StageInfo("H 7-A", 44, 8495, 5700, [金,土], 火, UnitType.Heavy),
    new StageInfo("H 7-B", 44, 8555, 5750, [日,土], 水, UnitType.Ranged),
    new StageInfo("H 7-C", 44, 8635, 5680, [月,火], 木, UnitType.Heavy),
    new StageInfo("H 7-D", 45, 8915, 5870, [日,火], 金, UnitType.Melee),
    new StageInfo("H 7-E", 44, 8569, 5740, [日,水], 土, UnitType.Magic),
    new StageInfo("H 7-F", 44, 8580, 5730, [月,木], 日, UnitType.Ranged),
    new StageInfo("H 7-EX1", 55, 12092, 7740, [月,金], 月, UnitType.Melee),
    new StageInfo("H 7-EX2", 55, 12120, 7690, [火,土], 火, UnitType.Ranged),
    new StageInfo("H 7-EX3", 55, 12116, 7720, [火,木], 月, UnitType.Magic),
    new StageInfo("H 7-EX4", 55, 12131, 7700, [月,土], 金, UnitType.Heavy),
    new StageInfo("H 7-EX5", 55, 12133, 7730, [水,木], 土, UnitType.Melee),

    // N 8
    new StageInfo("N 8-1", 28, 5593, 3630, [火,金], 月, UnitType.Heavy),
    new StageInfo("N 8-2", 28, 5693, 3640, [月,土], 火, UnitType.Magic),
    new StageInfo("N 8-3", 29, 5940, 3770, [日,土], 水, UnitType.Ranged),
    new StageInfo("N 8-4", 29, 6073, 3780, [月,水], 木, UnitType.Heavy),
    new StageInfo("N 8-5", 29, 6069, 3790, [月,火], 金, UnitType.Melee),
    new StageInfo("N 8-A", 28, 5692, 3630, [火,水], 土, UnitType.Ranged),
    new StageInfo("N 8-B", 29, 5980, 3810, [木,金], 日, UnitType.Melee),
    new StageInfo("N 8-C", 29, 6007, 3780, [日,金], 月, UnitType.Magic),
    new StageInfo("N 8-D", 29, 6098, 3720, [水,土], 火, UnitType.Melee),
    new StageInfo("N 8-E", 28, 5705, 3590, [日,木], 水, UnitType.Ranged),
    new StageInfo("N 8-EX1", 35, 7525, 4790, [月,金], 木, UnitType.Ranged),
    new StageInfo("N 8-EX2", 35, 7531, 4770, [火,木], 金, UnitType.Heavy),
    new StageInfo("N 8-EX3", 35, 7560, 0, [水, 金], 土, UnitType.Magic),
    new StageInfo("N 8-EX4", 35, 7566, 0, [月, 木], 日, UnitType.Melee),
    new StageInfo("N 8-EX5", 35, 7562, 0, [水, 金], 月, UnitType.Melee),
    new StageInfo("N 8-6", 30, 6119, 3850, [], null, null),

    // H 8
    new StageInfo("H 8-1", 45, 9474, 6030, [火,木], 金, UnitType.Magic),
    new StageInfo("H 8-2", 45, 9580, 6080, [水,金], 土, UnitType.Ranged),
    new StageInfo("H 8-3", 45, 9577, 6110, [木,土], 日, UnitType.Heavy),
    new StageInfo("H 8-4", 45, 9590, 6080, [日,金], 月, UnitType.Melee),
    new StageInfo("H 8-5", 46, 9917, 6220, [金,土], 火, UnitType.Magic),
    new StageInfo("H 8-A", 45, 9531, 6080, [日,火], 水, UnitType.Ranged),
    new StageInfo("H 8-B", 45, 9520, 6090, [月,水], 木, UnitType.Melee),
    new StageInfo("H 8-C", 45, 9583, 6060, [月,火], 金, UnitType.Heavy),
    new StageInfo("H 8-D", 46, 9832, 6210, [月,水], 土, UnitType.Magic),
    new StageInfo("H 8-E", 45, 9490, 6070, [木,土], 日, UnitType.Melee),
    new StageInfo("H 8-EX1", 55, 12111, 7680, [木,金], 月, UnitType.Ranged),
    new StageInfo("H 8-EX2", 55, 12134, 7700, [日,土], 火, UnitType.Magic),
    new StageInfo("H 8-EX3", 55, 12155, 7760, [日,金], 水, UnitType.Heavy),
    new StageInfo("H 8-EX4", 55, 12170, 0, [月, 火], 木, UnitType.Melee),
    new StageInfo("H 8-EX5", 55, 12165, 0, [日, 火], 金, UnitType.Ranged),
    new StageInfo("H 8-6", 47, 10000, 6280, [日,水], 土, UnitType.Heavy),

    // 第一次闘弌治宝戦挙
    // 第二次闘弌治宝戦挙
    //new StageInfo("初級", 15, 1500, 1050, 無, 無, null, false, false),
    //new StageInfo("中級", 25, 2625, 3500, 無, 無, null, false, false),
    //new StageInfo("上級", 35, 3850, 6650, 無, 無, null, false, false),
    //new StageInfo("まつり", 40, 4400, 8000, 無, 無, null, false, false),
    //new StageInfo("ちまつり", 50, 5500, 9450, 無, 無, null, false, false),

    // 第三次闘弌治宝戦挙
    // 異臣英雄伝
    // 異臣英雄伝 改
    // 戦慄の狩超戦挙
    // 異臣英雄伝 改 退散の妖刀編
    // 暴闘海産狩超戦挙
    // 第四次闘弌治宝戦挙
    // 悪閃狩超戦挙
    // 晩秋の刻制戦挙
    // 悪戯狩超戦挙
    //new StageInfo("初級", 30, 3210, 2100, 無, 無, null, false, false),
    //new StageInfo("中級", 40, 4480, 5600, 無, 無, null, false, false),
    //new StageInfo("上級", 50, 5750, 9500, 無, 無, null, false, false),
    //new StageInfo("まつり", 80, 9440, 16000, 無, 無, null, false, false),
    //new StageInfo("ちまつり", 100, 12500, 21000, 無, 無, null, false, false),

    // 害貨獲得戦挙
    // 害貨獲得戦挙II
    //new StageInfo("小地獄", 30, 2000, 2400, 無, 無, null, false, false),
    //new StageInfo("中地獄", 50, 3500, 7000, 無, 無, null, false, false),
    //new StageInfo("大地獄", 80, 6000, 16000, 無, 無, null, false, false),
    //new StageInfo("超地獄", 150, 15000, 33000, 無, 無, null, false, false),
    // 天国の獲得ゴールドは不定だが、Gold/M を Infinity 表示にしたいので 1 ってことで。
    //new StageInfo("天国", 0, 5000, 1, 無, 無, null, false, false),

    // 混沌の大狩超選挙
    // 新年の刻制戦挙
    //new StageInfo("初級", 30, 3500, 2100, 無, 無, null, false, false),
    //new StageInfo("中級", 40, 4900, 5600, 無, 無, null, false, false),
    //new StageInfo("上級", 50, 6400, 9500, 無, 無, null, false, false),
    //new StageInfo("まつり", 80, 10600, 16000, 無, 無, null, false, false),
    //new StageInfo("ちまつり", 100, 14000, 21000, 無, 無, null, false, false),

    // 害貨獲得戦挙III
    //new StageInfo("小地獄", 30, 2400, 2400, 無, 無, null, false, false),
    //new StageInfo("中地獄", 50, 3900, 7000, 無, 無, null, false, false),
    //new StageInfo("大地獄", 80, 6600, 16000, 無, 無, null, false, false),
    // 天国の獲得ゴールドは不定だが、Gold/M を Infinity 表示にしたいので 1 ってことで。
    //new StageInfo("天国", 0, 5000, 1, 無, 無, null, false, false),

    // 春分の狩超戦挙
    //new StageInfo("初級", 30, 3500, 4200, 無, 無, null, false, false),
    //new StageInfo("中級", 40, 4900, 5600, 無, 無, null, false, false),
    //new StageInfo("上級", 50, 6400, 9500, 無, 無, null, false, false),
    //new StageInfo("まつり", 80, 10600, 16000, 無, 無, null, false, false),
    //new StageInfo("ちまつり", 100, 14000, 21000, 無, 無, null, false, false),

    // 新緑の刻制戦挙
    // 荒梅雨の狩超戦挙
    // 緋色の刻制戦挙
    //new StageInfo("初級", 30, 3500, 2100, [無], 無, null, false, false),
    //new StageInfo("中級", 40, 4900, 5600, [無], 無, null, false, false),
    //new StageInfo("上級", 50, 6400, 9500, [無], 無, null, false, false),
    //new StageInfo("まつり", 80, 10600, 16000, [無], 無, null, false, false),
    //new StageInfo("ちまつり", 100, 14000, 21000, [無], 無, null, false, false),

    // 害貨獲得戦挙Ⅳ
    //new StageInfo("小地獄", 30, 2000, 2400, 無, 無, null, false, false),
    //new StageInfo("中地獄", 50, 3500, 7000, 無, 無, null, false, false),
    //new StageInfo("大地獄", 80, 6000, 16000, 無, 無, null, false, false),
    // 天国の獲得ゴールドは不定だが、Gold/M を Infinity 表示にしたいので 1 ってことで。
    //new StageInfo("天国", 0, 5000, 1, 無, 無, null, false, false),

    // 籠の中の三羽ガラス　第三羽　コルネ・イノウエ編
    //new StageInfo("初級", 30, 4500, 2100, [無], 無, null, false, false),
    //new StageInfo("中級", 40, 6200, 5600, [無], 無, null, false, false),
    //new StageInfo("上級", 50, 8000, 9500, [無], 無, null, false, false),
    //new StageInfo("まつり", 80, 13200, 16000, [無], 無, null, false, false),
    //new StageInfo("ちまつり", 100, 17000, 21000, [無], 無, null, false, false),

    // アリシアの懐刀
    //new StageInfo("小地獄", 30, 3500, 2400, [無], 無, null, false, false),
    //new StageInfo("中地獄", 50, 6000, 7000, [無], 無, null, false, false),
    //new StageInfo("大地獄", 80, 10000, 16000, [無], 無, null, false, false),
    //new StageInfo("天国", 0, 5000, 70000, [無], 無, null, false, false),
  ];
}

function updateTable() : void {
  // イベントステージを分離表示するか？
  let separateEventStages: boolean = (<HTMLInputElement>document.getElementById("separateEventStage")).checked;
  // テーブルの行
  let records: TableRecord[] = [];
  {
    let expBonusUnitType = getSelectedExpBonusUnitType();
    let dayOfWeek: number = getSelectedDayOfWeek();
    let useManaBonus: boolean = true;
    let useDoubleExpBonus: boolean = (expBonusUnitType != null);  // 総理ランクEXP計算時は2倍を適用しない
    let useProtectionBonus: boolean = true;
    for (let stageInfo of stages) {
      let r = new TableRecord(stageInfo, expBonusUnitType, dayOfWeek, useManaBonus, useDoubleExpBonus, useProtectionBonus);
      records.push(r);
    }
  }
  // 経験値効率でソート
  records.sort(function (a: TableRecord, b: TableRecord) {
     return b.finalExpPerMotivation - a.finalExpPerMotivation;
  })

  // イベントステージを分ける
  let separatedEventStageRecords: TableRecord[] = [];
  if (separateEventStages) {
    separatedEventStageRecords = records.filter(function(item, index) { return item.stageInfo.isEventStage; });
    //records = records.filter(function(item, index) { return !item.stageInfo.isEventStage; })
  }

  // 消費モチベがゼロのステージを除外する
  // (EXP/Mが無限大になって常に表示されて邪魔なので。イベントステージの分離表示に含まれる分には構わない。)
  records = records.filter(function(item, index) { return 0 < item.stageInfo.motivationConsumption; });

  // EX ステージを除外
  if (!(<HTMLInputElement>document.getElementById("includeExtraStage")).checked) {
    records = records.filter(function(item, index) { return item.stageInfo.category != StageCategory.Extra; });
  }

  // 難易度によるフィルタを適用
  {
    let selectedDifficulty = (<HTMLSelectElement>document.getElementById("difficulty")).value;
    if (selectedDifficulty == "All") {
      // フィルタ不要
    } else {
      /*
       * 難易度と選挙区の組みあせを適当な数値に変換し、その数値を比較してソートする。
       */
      let lhs = parseInt(selectedDifficulty[1]);
      switch (selectedDifficulty[0]) {
        case 'N': break;
        case 'H': lhs += 0.5; break;
        case 'T': lhs += 2.25; break;  // T2 が N4 と H4 の間に来る程度のオフセット
      }
      // フィルタ関数
      let filter = function(element : TableRecord, index, array) {
        let rhs = element.stageInfo.district;
        if (rhs == null) {
          return true;  // イベントステージの場合。フィルタを通しておく。
        }
        switch (element.stageInfo.mode) {
          case StageMode.Normal: break;
          case StageMode.Hard: rhs += 0.5; break;
          case StageMode.Twist: rhs += 2.25; break;  // T2 が N4 と H4 の間に来る程度のオフセット
        }
        return lhs >= rhs;
      }
      // フィルタを適用
      records = records.filter(filter);
    }
  }

  // カラースケール値を計算する
  {
    let maxFinalExpPerMotivation = records[0].finalExpPerMotivation;
    let minFinalExpPerMotivation = records[Math.min(10, records.length) - 1].finalExpPerMotivation;  // 上位10ステージまでを色付け (records が空の場合は考慮しない)
    for (let record of records) {
      if (minFinalExpPerMotivation <= record.finalExpPerMotivation) {
        let linearRatio = (record.finalExpPerMotivation - minFinalExpPerMotivation) / (maxFinalExpPerMotivation - minFinalExpPerMotivation);
        record.expColorScaleRatio = Math.pow(linearRatio, 1.5);
      } else {
        record.expColorScaleRatio = null;
      }
    }
  }

  // 必要なら件数を制限
  if (20 < records.length && (<HTMLInputElement>document.getElementById("only20")).checked) {
    records = records.slice(0, 20);
  }

  // table を作成
  let table = <HTMLTableElement>document.getElementById("stages");
  let table_body = document.getElementById("stages_body");
  if (table_body != null) {
    table.removeChild(table_body)
  }
  let tBody = table.createTBody();
  tBody.id = "stages_body";
  tBody.classList.add("stripe")
  let selectedDayOfWeek = getSelectedDayOfWeek();
  let insertRow = function(r: TableRecord): HTMLTableRowElement {
    let newRow = tBody.insertRow();
    // ステージ名
    {
      let cell = newRow.insertCell();
      cell.innerText = r.stageInfo.fullName;
      cell.classList.add("stage_name");
      cell.classList.add(getStageModeClassName(r.stageInfo.mode));
    }
    // 消費モチベ
    {
      let cell = newRow.insertCell();
      cell.innerText = r.stageInfo.motivationConsumption.toString();
      cell.classList.add("motivation_consumption")
    }
    // 基本EXP
    {
      let cell = newRow.insertCell();
      cell.innerText = r.stageInfo.baseExp.toString();
      cell.classList.add("base_exp");
    }
    // 曜日ボーナス
    {
      let bonudDaysCell = newRow.insertCell();
      bonudDaysCell.style.borderRightWidth = "0px";

      let scaleCell = newRow.insertCell();
      scaleCell.style.borderLeftWidth = "0px";
      scaleCell.style.paddingLeft = "0px";

      if (r.isSpecialExpBonusDay) {
        bonudDaysCell.innerText = "特";
        bonudDaysCell.classList.add("special_exp_bonus_day");
        scaleCell.innerText = "x1.3";
        scaleCell.classList.add("special_exp_bonus_day");
      } else {
        // 曜日の文字
        for (let expBonusDay of r.stageInfo.expBonusDays) {
          let dayOfWeekElement = <HTMLSpanElement>document.createElement("span");
          bonudDaysCell.appendChild(dayOfWeekElement);
          dayOfWeekElement.innerText = getBonusDayLetter(expBonusDay);
          if (expBonusDay == selectedDayOfWeek) {
            dayOfWeekElement.classList.add("active_exp_bonus_day")
          } else {
            dayOfWeekElement.classList.add("inactive_exp_bonus_day")
          }
        }

        // 倍率
        if (r.isExpBonusDay) {
          scaleCell.innerHTML = "x1.3";
          scaleCell.classList.add("active_exp_bonus_day")
        } else {
          scaleCell.innerHTML = "";
          scaleCell.classList.add("inactive_exp_bonus_day")
        }
      }
    }
    // ユニット種別ボーナス
    {
      let cell = newRow.insertCell();

      let unitTypeElement = <HTMLSpanElement>document.createElement("span");
      cell.appendChild(unitTypeElement);
      unitTypeElement.innerText = getExpBonusUnitTypeLetter(r.stageInfo.expBonusUnitType);
      unitTypeElement.classList.add(getExpBonusUnitTypeClassName(r.stageInfo.expBonusUnitType));
      unitTypeElement.classList.add(r.isUnitTypeExpBonnusApplied ? "active_exp_bonus_unit_type" : "inactive_exp_bonus_unit_type")

      cell.innerHTML += r.isUnitTypeExpBonnusApplied ? " x1.3" : "";
    }
    // 2倍ボーナス
    {
      let cell = newRow.insertCell();
      cell.innerText = r.isExpDoubleBonusApplied ? "x2.0" : "";
      cell.style.textAlign = "center";
    }
    // 残マナボーナス
    {
      let cell = newRow.insertCell();
      cell.innerText = r.isManaBonusApplied ? "x1.2" : (r.stageInfo.isManaBonusAllowed ?  "--" : "--");
      if (!r.isManaBonusApplied) {
        cell.classList.add("inactive_mana_bonus");
      }
      cell.style.textAlign = "center";
    }
    // 最終補正倍率
    {
      let cell = newRow.insertCell();
      cell.innerText = "x" + r.finalExpFactor.toFixed(2);
      cell.style.textAlign = "center";
    }
    // 最終EXP
    {
      let cell = newRow.insertCell();
      cell.innerText = r.finalExp.toFixed(0);
      cell.classList.add("final_exp");
    }
    // EXP/M
    {
      let cell = newRow.insertCell();
      if (isFinite(r.finalExpPerMotivation)) {
        cell.innerText = r.finalExpPerMotivation.toFixed(2);
      } else {
        cell.innerText = "Infinity";
      }
      cell.classList.add("final_exp_per_motivation");
      // カラースケール
      if (r.expColorScaleRatio != null) {
        function lerp(a: number, b: number, t: number) { return a * (1 - t) + b * t; }
        let colorR = lerp(255, 60, r.expColorScaleRatio).toFixed(0);
        let colorG = lerp(255, 240, r.expColorScaleRatio).toFixed(0);
        let colorB = lerp(255, 92, r.expColorScaleRatio).toFixed(0);
        cell.style.backgroundColor = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
        cell.style.borderTopWidth = "1px";
        cell.style.borderBottomWidth = "1px";
      } else {
        cell.style.backgroundColor = "inherit";
      }
    }
    // Gold/M
    {
      {
        let cell = newRow.insertCell();
        cell.classList.add("final_gold_per_motivation");
        cell.style.borderRightWidth = "0px";
        if (0 < r.finalGoldPerMotivation) {
          if (isFinite(r.finalGoldPerMotivation)) {
            cell.innerText = r.finalGoldPerMotivation.toFixed(2);
          } else {
            cell.innerText = "Infinity";
          }
        } else {
          cell.innerText = "？";
        }
      }
      {
        let cell = newRow.insertCell();
        cell.style.borderLeftWidth = "0px";
        cell.style.paddingLeft = "0px";
        cell.classList.add(r.isGoldBonusDay ? "active_exp_bonus_day" : "inactive_exp_bonus_day");
        cell.innerText = getBonusDayLetter(r.stageInfo.goldBonusDay);
      }
    }
    return newRow;
  }

  // イベントステージの分離表示が有効なら、先に出力
  if (separatedEventStageRecords) {
    for (let r of separatedEventStageRecords) {
      let row = insertRow(r);
      // 分離されたイベントステージと他のステージの境目に線を引く
      if (separatedEventStageRecords[separatedEventStageRecords.length - 1] == r) {
        for (let i = 0; i < row.cells.length; ++i) {
          let cell = <HTMLTableCellElement>(row.cells.item(i));
          cell.style.borderBottom = "solid 2px #c0c0c0";
        }
      }
    }
  }
  // 全行を出力
  for (let r of records) {
    insertRow(r);
  }

  // 難易度が All 以外なら、難易度選択コンボボックスの色を変えておく
  {
    let combo = <HTMLSelectElement>(document.getElementById("difficulty"));
    if (combo.value == "All") {
      combo.style.backgroundColor = null;
    } else {
      combo.style.backgroundColor = "#DDEEFF";
    }
  }

  // ページ表示時と曜日が変わっているかもしれないので、ラベルを再設定する
  setDayOfWeekSelectorLabels();
  saveSettings();
}

function initializeExpTable(ev: Event): void {
  initializeStageList();

  // 曜日選択ラジオボタンの初期化
  setDayOfWeekSelectorLabels();
  // 今日の曜日を選択状態にする
  {
    let now = new Date();
    let radio = <HTMLInputElement>document.getElementById("exp_bonus_day_radio_" + now.getDay());
    radio.checked = true;
  }

  // 難易度選択コンボボックス
  {
    let combo = <HTMLSelectElement>document.getElementById("difficulty");
    let addOption = function(label: string, value: string, foreColor: string) {
      let option = <HTMLOptionElement>combo.appendChild(document.createElement("option"));
      option.innerText = label;
      option.style.color = foreColor;
      option.style.backgroundColor = "white";
      let valueAttr = document.createAttribute("value");
      valueAttr.value = value;
      option.attributes.setNamedItem(valueAttr);
    }
    addOption("すべての難易度", "All", "inherit");
    addOption("H7 まで (推奨Lv 71-75)", "H7", "#E08000");
    addOption("N7 まで (推奨Lv 61-65)", "N7", "inherit");
    addOption("H6 まで (推奨Lv 66-70)", "H6", "#E08000");
    addOption("N6 まで (推奨Lv 56-60)", "N6", "inherit");
    addOption("H5 まで (推奨Lv 61-65)", "H5", "#E08000");
    addOption("T3 まで (推奨Lv 55-57)", "T3", "#FF0040");
    addOption("N5 まで (推奨Lv 51-55)", "N5", "inherit");
    addOption("H4 まで (推奨Lv 56-60)", "H4", "#E08000");
    addOption("T2 まで (推奨Lv 45-55)", "T2", "#FF0040");
    addOption("N4 まで (推奨Lv 46-50)", "N4", "inherit");
    addOption("H3 まで (推奨Lv 45-55)", "H3", "#E08000");
    addOption("N3 まで (推奨Lv 31-45)", "N3", "inherit");
    addOption("H2 まで (推奨Lv 30-40)", "H2", "#E08000");
    addOption("N2 まで (推奨Lv 15-30)", "N2", "inherit");
  }

  // 『イベントステージを分離表示』チェックボックス
  {
    // イベントステージがあるか？
    let existsEventStage = false;
    for (let stageInfo of stages) {
      if (stageInfo.isEventStage) {
        existsEventStage = true;
        break;
      }
    }
    // イベントステージが無いなら非表示にする
    if (!existsEventStage) {
      let checkBox = <HTMLInputElement>document.getElementById("separateEventStage");
      let parentLabel = checkBox.parentElement;
      checkBox.style.visibility = "hidden";
      parentLabel.style.visibility = "hidden";
    }
  }

  loadSettings();
  updateTable();
}
window.onload = initializeExpTable;
