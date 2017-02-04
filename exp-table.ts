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
  (<HTMLInputElement>document.getElementById("only20")).checked = getBooleanFromLocalStorage("exp-table:OnlyTop20", true);
  (<HTMLInputElement>document.getElementById("separateEventStage")).checked = getBooleanFromLocalStorage("exp-table:SeparateEventStage", false);
}

function saveSettings() : void {
  if (!localStorage) { return; }

  localStorage.setItem("exp-table:Difficulty", (<HTMLSelectElement>document.getElementById("difficulty")).value);
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
  // 1, 2, 3, A, B, C, ...
  // イベントステージの場合は null
  private _stageLetter: string;
  private _isNumberedStage: boolean;
  // イベントステージの場合は null
  private _mode: StageMode;
  // イベントステージ以外では null
  private _eventStageName: string;
  private _isEventStage: boolean;
  private _motivationConsumption: number;
  private _baseExp: number;
  private _baseGold: number;
  // 0: 日, 1: 月, ..., 6: 土
  // null の場合はボーナス無し。undefined の場合はデータ無し。
  private _expBonusDay: number;
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
    expBonusDay: number,
    goldBonusDay: number,
    expBonusUnitType: UnitType,
    isManaBonusAllowed: boolean = true,
    isProtectionBonusAllowed: boolean = false)
  {
    this._motivationConsumption = motivationConsumption;
    this._baseExp = baseExp;
    this._baseGold = baseGold;
    this._expBonusDay = expBonusDay;
    this._goldBonusDay = goldBonusDay;
    this._expBonusUnitType = expBonusUnitType;
    this._isManaBonusAllowed = isManaBonusAllowed;
    this._isProtectionBonusAllowed = isProtectionBonusAllowed;

    if (5 == stageName.length && stageName[3] == "-") {
      this._districtLetter = stageName[2];
      this._stageLetter = stageName[4];
      switch (stageName[0]) {
        case "N":
          this._mode = StageMode.Normal;
          break;
        case "H":
          this._mode = StageMode.Hard;
          break;
        case "T":
          this._mode = StageMode.Twist;
          break;
      }
      this._eventStageName = null;
      this._isEventStage = false;
    } else {
      this._districtLetter = null;
      this._stageLetter = null;
      this._mode = null;
      this._eventStageName = stageName;
      this._isEventStage = true;
    }
    
    this._isNumberedStage = false;
    if (this._stageLetter != null && !isNaN(parseInt(this._stageLetter, 10))) {
      this._isNumberedStage = true;
    }
  }

  //============================================================================
  // PROPERTIES
  //============================================================================

  // N 1-1 形式
  public get fullName() : string {
    if (this._isEventStage) {
      return this._eventStageName;
    } else {
      return getStageModeLetter(this._mode) + " " + this._districtLetter + "-" + this._stageLetter;
    }
  }

  // 1-1 形式 (難易度部分を含まない)
  public get shortName() : string {
    if (this._isEventStage) {
      return this._eventStageName;
    } else {
      return this._districtLetter + "-" + this._stageLetter;
    }
  }

  // 選挙区番号。イベントステージの場合は null。
  public get district() : number { return this._districtLetter ? parseInt(this._districtLetter) : null; }
  public get mode() : StageMode { return this._mode; }
  public get motivationConsumption() : number { return this._motivationConsumption; }
  public get baseExp() : number { return this._baseExp; }
  public get expBonusDay() : number { return this._expBonusDay; }
  public get expBonusUnitType() : UnitType { return this._expBonusUnitType; }
  public get isManaBonusAllowed() : boolean { return this._isManaBonusAllowed; }
  public get baseGold() : number { return this._baseGold; }
  public get goldBonusDay() : number { return this._goldBonusDay; }
  public get isProtectionBonusAllowed() : boolean { return this._isProtectionBonusAllowed; }
  public get isNumberedStage() : boolean { return this._isNumberedStage; }
  public get isEventStage() : boolean { return this._eventStageName != null; }

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
      if (this._stageInfo.isNumberedStage && this._stageInfo.mode == StageMode.Normal) {
        // 週替わり育成キャンペーン対応。
        // 難易度ノーマルのナンバリングステージは常に経験値 1.3 倍。
        factors.push(1.3);
        this._isExpBonusDay = true;
        this._isSpecialExpBonusDay = true;
      } else if (this._stageInfo.expBonusDay != null && this._stageInfo.expBonusDay == this._dayOfWeek) {
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
    new StageInfo("N 2-1", 12,  523,  630, 月, 木, UnitType.Magic),
    new StageInfo("N 2-F", 12,  775,  580, 水, 月, UnitType.Magic),
    new StageInfo("N 2-G", 12,  802,  490, 木, 火, UnitType.Ranged),
    new StageInfo("N 2-H", 13,  862,  550, 金, 水, UnitType.Melee),
    new StageInfo("N 2-2", 12,  589,  630, 火, 金, UnitType.Ranged),
    new StageInfo("N 2-A", 13,  664,  890, 水, 土, UnitType.Heavy),
    new StageInfo("N 2-3", 13,  748,  900, 木, 日, UnitType.Melee),
    new StageInfo("N 2-B", 14,  843,  950, 金, 月, UnitType.Magic),
    new StageInfo("N 2-C", 15,  950,  810, 土, 火, null),
    new StageInfo("N 2-I", 13,  985,  670, 土, 木, UnitType.Heavy),
    new StageInfo("N 2-4", 16, 1142,  870, 日, 水, UnitType.Ranged),
    new StageInfo("N 2-D", 17, 1215, 1590, 月, 無, UnitType.Melee),
    new StageInfo("N 2-E", 18, 1292,  800, 火, 金, UnitType.Heavy),
    new StageInfo("N 2-J", 17, 1350, 1140, 日, 金, UnitType.Magic),
    new StageInfo("N 2-K", 17, 1371, 1100, 火, 日, UnitType.Magic),
    new StageInfo("N 2-5", 20, 1758, 1110, 水, 土, null),

    // H 2
    new StageInfo("H 2-1", 22, 1758, 1730, 日, 水, UnitType.Heavy),
    new StageInfo("H 2-F", 28, 2506, 2480, 月, 無, UnitType.Ranged),
    new StageInfo("H 2-G", 28, 2535, 2540, 火, 無, UnitType.Melee),
    new StageInfo("H 2-H", 28, 2570, 2480, 日, 水, UnitType.Heavy),
    new StageInfo("H 2-2", 23, 1870, 1800, 月, 木, UnitType.Ranged),
    new StageInfo("H 2-A", 24, 1989, 2830, 火, 金, UnitType.Melee),
    new StageInfo("H 2-3", 28, 2116, 2900, 水, 土, UnitType.Magic),
    new StageInfo("H 2-B", 29, 2251, 3070, 木, 日, UnitType.Ranged),
    new StageInfo("H 2-C", 29, 2395, 2140, 金, 月, null),
    new StageInfo("H 2-I", 29, 2696, 2600, 木, 無, UnitType.Magic),
    new StageInfo("H 2-4", 31, 2711, 2210, 土, 火, UnitType.Melee),
    new StageInfo("H 2-D", 36, 2884, 4280, 日, 無, UnitType.Heavy),
    new StageInfo("H 2-E", 36, 3068, 1860, 水, 木, UnitType.Magic),
    new StageInfo("H 2-J", 34, 3206, 3020, 金, 無, UnitType.Ranged),
    new StageInfo("H 2-K", 35, 3311, 3120, 土, 無, UnitType.Melee),
    new StageInfo("H 2-5", 36, 3264, 2430, 木, 金, null),

    // T 2
    new StageInfo("T 2-1", 37, 3826, 4130, 土, 金, UnitType.Heavy),
    new StageInfo("T 2-F", 37, 3795, 3980, 月, 日, UnitType.Magic),
    new StageInfo("T 2-G", 37, 3928, 3950, 火, 月, UnitType.Melee),
    new StageInfo("T 2-H", 38, 4124, 4060, 水, 火, UnitType.Ranged),
    new StageInfo("T 2-2", 38, 4059, 4220, 日, 土, UnitType.Ranged),
    new StageInfo("T 2-A", 38, 4000, 4250, 月, 日, UnitType.Melee),
    new StageInfo("T 2-3", 39, 4311, 4210, 火, 月, UnitType.Melee),
    new StageInfo("T 2-B", 40, 4288, 4500, 水, 火, UnitType.Heavy),
    new StageInfo("T 2-C", 40, 4338, 4260, 木, 水, UnitType.Melee),
    new StageInfo("T 2-I", 40, 4308, 4260, 木, 水, UnitType.Magic),
    new StageInfo("T 2-4", 40, 4373, 4320, 金, 木, UnitType.Ranged),
    new StageInfo("T 2-D", 40, 4397, 4430, 土, 金, UnitType.Magic),
    new StageInfo("T 2-E", 40, 4407, 4290, 日, 土, UnitType.Ranged),
    new StageInfo("T 2-J", 40, 4387, 4350, 金, 木, UnitType.Heavy),
    new StageInfo("T 2-K", 40, 4564, 4450, 土, 金, UnitType.Heavy),
    new StageInfo("T 2-5", 41, 4600, 4390, 日, 土, UnitType.Magic),

    // N 3
    new StageInfo("N 3-1", 19, 1799, 1940, 日, 金, UnitType.Ranged),
    new StageInfo("N 3-2", 19, 1815, 1960, 月, 土, UnitType.Melee),
    new StageInfo("N 3-A", 19, 1824, 2560, 火, 無, UnitType.Magic),
    new StageInfo("N 3-3", 20, 1931, 2050, 水, 月, UnitType.Heavy),
    new StageInfo("N 3-B", 20, 1963, 2670, 木, 無, UnitType.Melee),
    new StageInfo("N 3-C", 21, 2052, 2200, 金, 水, UnitType.Ranged),
    new StageInfo("N 3-4", 22, 2159, 2300, 土, 木, UnitType.Magic),
    new StageInfo("N 3-D", 22, 2167, 2200, 日, 金, UnitType.Heavy),
    new StageInfo("N 3-E", 23, 2282, 2440, 月, 土, UnitType.Ranged),
    new StageInfo("N 3-5", 24, 2450, 2530, 火, 日, null),
    new StageInfo("N 3-F", 19, 1810, 2000, 水, 月, UnitType.Heavy),
    new StageInfo("N 3-G", 21, 2081, 2170, 木, 火, UnitType.Ranged),

    // H 3
    new StageInfo("H 3-1", 37, 3920, 4070, 水, 月, UnitType.Melee),
    new StageInfo("H 3-2", 37, 3914, 4080, 木, 火, UnitType.Ranged),
    new StageInfo("H 3-A", 38, 4018, 4210, 金, 水, UnitType.Magic),
    new StageInfo("H 3-3", 38, 4072, 4190, 土, 木, UnitType.Ranged),
    new StageInfo("H 3-B", 39, 4157, 4370, 日, 金, UnitType.Melee),
    new StageInfo("H 3-C", 40, 4284, 4480, 月, 土, UnitType.Ranged),
    new StageInfo("H 3-4", 40, 4347, 4370, 火, 日, UnitType.Heavy),
    new StageInfo("H 3-D", 40, 4323, 4350, 水, 火, UnitType.Magic),
    new StageInfo("H 3-E", 40, 4343, 4540, 木, 水, UnitType.Heavy),
    new StageInfo("H 3-5", 41, 4579, 4460, 金, 木, null),
    new StageInfo("H 3-F", 37, 3928, 4250, 土, 金, UnitType.Melee),
    new StageInfo("H 3-G", 40, 4307, 4450, 日, 土, UnitType.Magic),

    // T 3
    new StageInfo("T 3-1", 41, 4890, 4600, 金, 木, UnitType.Melee),
    new StageInfo("T 3-2", 41, 5022, 4640, 土, 金, UnitType.Ranged),
    new StageInfo("T 3-A", 41, 4933, 4570, 日, 土, UnitType.Magic),
    new StageInfo("T 3-F", 41, 4955, 4780, 月, 日, UnitType.Magic),

    // N 4
    new StageInfo("N 4-1", 25, 2966, 2740, 月, 木, UnitType.Magic),
    new StageInfo("N 4-2", 25, 3004, 2760, 火, 金, UnitType.Melee),
    new StageInfo("N 4-3", 25, 3062, 2770, 水, 土, UnitType.Ranged),
    new StageInfo("N 4-4", 26, 3246, 2860, 木, 日, UnitType.Ranged),
    new StageInfo("N 4-5", 26, 3251, 2860, 金, 月, UnitType.Magic),
    new StageInfo("N 4-A", 25, 2971, 2790, 土, 火, UnitType.Melee),
    new StageInfo("N 4-B", 25, 3042, 2820, 日, 水, UnitType.Heavy),
    new StageInfo("N 4-C", 26, 3194, 2890, 月, 木, UnitType.Heavy),
    new StageInfo("N 4-D", 26, 3211, 2950, 火, 金, UnitType.Melee),
    new StageInfo("N 4-E", 25, 2982, 2720, 水, 土, UnitType.Ranged),
    new StageInfo("N 4-F", 25, 3050, 2750, 木, 日, UnitType.Ranged),

    // H 4
    new StageInfo("H 4-1", 41, 5186, 4790, 金, 月, UnitType.Ranged),
    new StageInfo("H 4-2", 41, 5236, 4840, 土, 火, UnitType.Melee),
    new StageInfo("H 4-3", 41, 5250, 4740, 日, 水, UnitType.Magic),
    new StageInfo("H 4-4", 41, 5352, 4750, 月, 木, UnitType.Melee),
    new StageInfo("H 4-5", 42, 5535, 4830, 火, 金, UnitType.Heavy),
    new StageInfo("H 4-A", 41, 5234, 4780, 水, 土, UnitType.Ranged),
    new StageInfo("H 4-B", 41, 5229, 4900, 木, 日, UnitType.Magic),
    new StageInfo("H 4-C", 41, 5272, 4830, 金, 月, UnitType.Heavy),
    new StageInfo("H 4-D", 42, 5454, 4770, 土, 火, UnitType.Magic),
    new StageInfo("H 4-E", 41, 5218, 4840, 日, 水, UnitType.Melee),
    new StageInfo("H 4-F", 41, 5248, 4820, 月, 木, UnitType.Ranged),

    // N 5
    new StageInfo("N 5-1", 26, 3550, 3120, 火, 金, UnitType.Ranged),
    new StageInfo("N 5-2", 26, 3630, 3130, 水, 土, UnitType.Melee),
    new StageInfo("N 5-3", 27, 3734, 3150, 木, 日, UnitType.Heavy),
    new StageInfo("N 5-4", 27, 3808, 3110, 金, 月, UnitType.Magic),
    new StageInfo("N 5-5", 27, 3835, 3090, 土, 火, UnitType.Ranged),
    new StageInfo("N 5-A", 26, 3515, 3040, 日, 水, UnitType.Magic),
    new StageInfo("N 5-B", 27, 3757, 3140, 月, 木, UnitType.Melee),
    new StageInfo("N 5-C", 27, 3828, 3130, 火, 金, UnitType.Heavy),
    new StageInfo("N 5-D", 27, 3822, 3110, 水, 土, UnitType.Ranged),
    new StageInfo("N 5-E", 26, 3557, 3130, 木, 日, UnitType.Melee),

    // H 5
    new StageInfo("H 5-1", 42, 6017, 5300, 土, 火, UnitType.Ranged),
    new StageInfo("H 5-2", 42, 6065, 5050, 日, 水, UnitType.Heavy),
    new StageInfo("H 5-3", 42, 6129, 5110, 月, 木, UnitType.Ranged),
    new StageInfo("H 5-4", 42, 6181, 5300, 火, 金, UnitType.Melee),
    new StageInfo("H 5-5", 43, 6409, 5270, 水, 土, UnitType.Heavy),
    new StageInfo("H 5-A", 42, 6030, 5300, 木, 日, UnitType.Magic),
    new StageInfo("H 5-B", 42, 6149, 5200, 金, 月, UnitType.Melee),
    new StageInfo("H 5-C", 42, 6131, 5000, 土, 火, UnitType.Magic),
    new StageInfo("H 5-D", 43, 6383, 5330, 日, 水, UnitType.Melee),
    new StageInfo("H 5-E", 42, 6037, 5060, 月, 木, UnitType.Magic),

    // N 6
    new StageInfo("N 6-1", 27, 4139, 3190, 水, 土, UnitType.Heavy),
    new StageInfo("N 6-2", 27, 4244, 3410, 木, 日, UnitType.Melee),
    new StageInfo("N 6-3", 27, 4282, 3400, 金, 月, UnitType.Magic),
    new StageInfo("N 6-4", 27, 4324, 3200, 土, 火, UnitType.Magic),
    new StageInfo("N 6-5", 28, 4522, 3420, 日, 水, UnitType.Ranged),
    new StageInfo("N 6-A", 27, 4201, 3270, 月, 木, UnitType.Heavy),
    new StageInfo("N 6-B", 27, 4177, 3210, 火, 金, UnitType.Melee),
    new StageInfo("N 6-C", 27, 4301, 3390, 水, 土, UnitType.Ranged),
    new StageInfo("N 6-D", 28, 4436, 3550, 木, 日, UnitType.Melee),
    new StageInfo("N 6-E", 27, 4218, 3430, 金, 月, UnitType.Ranged),

    // H 6
    new StageInfo("H 6-1", 43, 6964, 5370, 日, 水, UnitType.Magic),
    new StageInfo("H 6-2", 43, 6956, 5390, 月, 木, UnitType.Melee),
    new StageInfo("H 6-3", 43, 6979, 5330, 火, 金, UnitType.Ranged),
    new StageInfo("H 6-4", 43, 7117, 5360, 水, 土, UnitType.Heavy),
    new StageInfo("H 6-5", 44, 7265, 5500, 木, 日, UnitType.Heavy),
    new StageInfo("H 6-A", 43, 6882, 5360, 金, 月, UnitType.Ranged),
    new StageInfo("H 6-B", 43, 6999, 5390, 土, 火, UnitType.Magic),
    new StageInfo("H 6-C", 43, 7047, 5370, 日, 水, UnitType.Melee),
    new StageInfo("H 6-D", 44, 7213, 5470, 月, 木, UnitType.Magic),
    new StageInfo("H 6-E", 43, 6997, 5350, 火, 金, UnitType.Melee),

    // N 7
    new StageInfo("N 7-1", 28, 4765, 3470, 木, 日, UnitType.Ranged),
    new StageInfo("N 7-2", 28, 4864, 3460, 金, 月, UnitType.Melee),
    new StageInfo("N 7-3", 28, 4947, 3540, 土, 火, UnitType.Heavy),
    new StageInfo("N 7-4", 28, 4966, 3490, 日, 水, UnitType.Magic),
    new StageInfo("N 7-5", 28, 5016, 3520, 月, 木, UnitType.Melee),
    new StageInfo("N 7-A", 28, 4826, 3490, 火, 金, UnitType.Heavy),
    new StageInfo("N 7-B", 28, 4885, 3520, 水, 土, UnitType.Ranged),
    new StageInfo("N 7-C", 28, 4943, 3490, 木, 日, UnitType.Magic),
    new StageInfo("N 7-D", 28, 4988, 3530, 金, 月, UnitType.Ranged),
    new StageInfo("N 7-E", 28, 4860, 3510, 土, 火, UnitType.Melee),

    // H 7
    new StageInfo("H 7-1", 44, 7983, 5710, 月, 木, UnitType.Melee),
    new StageInfo("H 7-2", 44, 8037, 5700, 火, 金, UnitType.Magic),
    new StageInfo("H 7-3", 44, 8034, 5720, 水, 土, UnitType.Ranged),
    new StageInfo("H 7-4", 44, 8099, 5760, 木, 日, UnitType.Melee),
    new StageInfo("H 7-5", 45, 8286, 5880, 金, 月, UnitType.Magic),
    new StageInfo("H 7-A", 44, 7940, 5700, 土, 火, UnitType.Heavy),
    new StageInfo("H 7-B", 44, 7996, 5750, 日, 水, UnitType.Ranged),
    new StageInfo("H 7-C", 44, 8071, 5680, 月, 木, UnitType.Heavy),
    new StageInfo("H 7-D", 45, 8332, 5870, 火, 金, UnitType.Melee),
    new StageInfo("H 7-E", 44, 8009, 5740, 水, 土, UnitType.Magic),

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
    new StageInfo("初級", 30, 3500, 2100, 無, 無, null, false, false),
    new StageInfo("中級", 40, 4900, 5600, 無, 無, null, false, false),
    new StageInfo("上級", 50, 6400, 9500, 無, 無, null, false, false),
    new StageInfo("まつり", 80, 10600, 16000, 無, 無, null, false, false),
    new StageInfo("ちまつり", 100, 14000, 21000, 無, 無, null, false, false),
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
  records = records.filter(function(item, index) { return 0 < item.stageInfo.motivationConsumption; })

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
      let cell = newRow.insertCell();
      if (r.isSpecialExpBonusDay) {
        cell.innerText = "特 x1.3";
        cell.classList.add("special_exp_bonus_day")
      } else {
        cell.innerText = getBonusDayLetter(r.stageInfo.expBonusDay);
        cell.innerText += r.isExpBonusDay ? " x1.3" : " ";
        cell.classList.add(r.isExpBonusDay ? "active_exp_bonus_day" : "inactive_exp_bonus_day")
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
          let cell = row.cells.item(i);
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
