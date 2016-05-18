function getDayOfWeekName(dayOfWeek: number) : string {
  switch (dayOfWeek) {
    case 0: return "日曜日";
    case 1: return "月曜日";
    case 2: return "火曜日";
    case 3: return "水曜日";
    case 4: return "木曜日";
    case 5: return "金曜日";
    case 6: return "土曜日";
  }
  return "？曜日";
}

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
    isManaBonusAllowed: boolean = true)
  {
    this._motivationConsumption = motivationConsumption;
    this._baseExp = baseExp;
    this._baseGold = baseGold;
    this._expBonusDay = expBonusDay;
    this._goldBonusDay = goldBonusDay;
    this._expBonusUnitType = expBonusUnitType;
    this._isManaBonusAllowed = isManaBonusAllowed;

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

  public get mode() : StageMode { return this._mode; }
  public get motivationConsumption() : number { return this._motivationConsumption; }
  public get baseExp() : number { return this._baseExp; }
  public get expBonusDay() : number { return this._expBonusDay; }
  public get expBonusUnitType() : UnitType { return this._expBonusUnitType; }
  public get isManaBonusAllowed() : boolean { return this._isManaBonusAllowed; }
  public get baseGold() : number { return this._baseGold; }
  public get goldBonusDay() : number { return this._goldBonusDay; }

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
    useDefenseBonus: boolean)
  {
    this._stageInfo = stageInfo;
    this._expBonusUnitType = expBonusUnitType;
    this._dayOfWeek = dayOfWeek;
    this._isDoubleExpBonusApplied = useDoubleExpBonus;

    // EXP
    {
      let expFactor: number = 1.0;
      // ユニット種別によるボーナス
      if ((this._expBonusUnitType != null) && (this._stageInfo.expBonusUnitType == this._expBonusUnitType)) {
        expFactor *= 1.2;
        this._isUnitTypeExpBonusApplied = true;
      } else {
        this._isUnitTypeExpBonusApplied = false;
      }
      // 曜日によるボーナス
      if (this._stageInfo.expBonusDay != null && this._stageInfo.expBonusDay == this._dayOfWeek) {
        expFactor *= 1.2;
        this._isExpBonusDay = true;
      } else {
        this._isExpBonusDay = false;
      }
      // 残マナボーナス
      if (useManaBonus && this._stageInfo.isManaBonusAllowed) {
        expFactor *= 1.2;
        this._isManaBonusApplied = true;
      } else {
        this._isManaBonusApplied = false;
      }
      // 二倍ボーナス
      if (useDoubleExpBonus) {
        expFactor *= 2.0;
      }

      this._finalExpFactor = expFactor;
      this._finalExp = this._stageInfo.baseExp * expFactor;
    }

    // Gold
    {
      let goldFactor: number = 1.0;
      // 曜日によるボーナス
      if (this._stageInfo.goldBonusDay != null && this._stageInfo.goldBonusDay == this._dayOfWeek) {
        goldFactor *= 1.2;
        this._isGoldBonusDay = true;
      } else {
        this._isGoldBonusDay = false;
      }
      // 拠点防衛ボーナス
      if (useDefenseBonus) {
        goldFactor *= 1.2;
      }
      this._finalGoldFactor = goldFactor;
    }

    this.expColorScaleRatio = null;
  }

  public get stageInfo() : StageInfo { return this._stageInfo; }
  public get isUnitTypeExpBonnusApplied() : boolean { return this._isUnitTypeExpBonusApplied; }
  public get isExpBonusDay() : boolean { return this._isExpBonusDay; }
  public get isManaBonusApplied() : boolean { return this._isManaBonusApplied; }
  public get isExpDoubleBonusApplied() : boolean { return this._isDoubleExpBonusApplied; }
  public get finalExpFactor() : number { return this._finalExpFactor; }
  public get finalExp() : number { return this._finalExp; }
  public get finalExpPerMotivation() : number { return this._finalExp / this._stageInfo.motivationConsumption; }
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
  let radio = <HTMLInputElement>radios[0];

  // 今日
  if (radio.value == "Today" && radio.checked) {
    return now.getDay();
  }

  // 今日じゃないなら明日
  let tomorrow: Date = now;
  tomorrow.setDate(now.getDate() + 1);
  return tomorrow.getDay();
}

function updateTable() : void {
  var 日: number = 0;
  var 月: number = 1;
  var 火: number = 2;
  var 水: number = 3;
  var 木: number = 4;
  var 金: number = 5;
  var 土: number = 6;
  var 無: number = null;
  // 全ステージのリスト
  let stages: StageInfo[] = [
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

    // N 4
    new StageInfo("N 4-1", 25, 2966, 2740, 月, 木, UnitType.Magic),
    new StageInfo("N 4-2", 25, 3004, 2760, 火, 金, UnitType.Melee),
    new StageInfo("N 4-3", 25, 3062, 2770, 水, 土, UnitType.Ranged),
    new StageInfo("N 4-4", 26, 3246, 2860, 木, 日, UnitType.Ranged),
    new StageInfo("N 4-5", 26, 3251, 2860, 金, 月, UnitType.Magic),
    new StageInfo("N 4-A", 25, 2971, 2790, 土, 火, UnitType.Melee),
    new StageInfo("N 4-B", 25, 3042, 2820, 日, 水, UnitType.Heavy),

    // H 4
    new StageInfo("H 4-1", 41, 5186, 4790, 金, 月, UnitType.Ranged),
    new StageInfo("H 4-2", 41, 5236, 4840, 土, 火, UnitType.Melee),
    new StageInfo("H 4-3", 41, 5250, 4740, 日, 水, UnitType.Magic),
    new StageInfo("H 4-4", 41, 5352, 4750, 月, 木, UnitType.Melee),
    new StageInfo("H 4-5", 42, 5535, 4830, 火, 金, UnitType.Heavy),
    new StageInfo("H 4-A", 41, 5234, 4780, 水, 土, UnitType.Ranged),
    new StageInfo("H 4-B", 41, 5229, 4900, 木, 日, UnitType.Magic),

    // 第一次闘弌治宝戦挙
    //new StageInfo("初級", 15, 1500, 1050, 無, 無, null, false),
    //new StageInfo("中級", 25, 2625, 3500, 無, 無, null, false),
    //new StageInfo("上級", 35, 3850, 6650, 無, 無, null, false),
    //new StageInfo("まつり", 40, 4400, 8000, 無, 無, null, false),
    //new StageInfo("ちまつり", 50, 5500, 9450, 無, 無, null, false),

    // 第二次闘弌治宝戦挙
    new StageInfo("初級", 15, 1500, 1050, 無, 無, null, false),
    new StageInfo("中級", 25, 2625, 3500, 無, 無, null, false),
    new StageInfo("上級", 35, 3850, 6650, 無, 無, null, false),
    new StageInfo("まつり", 40, 4400, 8000, 無, 無, null, false),
    new StageInfo("ちまつり", 50, 5500, 9450, 無, 無, null, false),
  ];

  // テーブルの行
  let records: TableRecord[] = [];
  {
    let expBonusUnitType = getSelectedExpBonusUnitType();
    let dayOfWeek: number = getSelectedDayOfWeek();
    let useManaBonus: boolean = true;
    let useDoubleExpBonus: boolean = (expBonusUnitType != null);  // 総理ランクEXP計算時は2倍を適用しない
    let useDefenseBonus: boolean = true;
    for (let stageInfo of stages) {
      let r = new TableRecord(stageInfo, expBonusUnitType, dayOfWeek, useManaBonus, useDoubleExpBonus, useDefenseBonus);
      records.push(r);
    }
  }
  // 経験値効率でソート
  records.sort(function (a: TableRecord, b: TableRecord) {
     return b.finalExpPerMotivation - a.finalExpPerMotivation;
  })

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

  // table を作成
  let table = <HTMLTableElement>document.getElementById("stages");
  let table_body = document.getElementById("stages_body");
  if (table_body != null) {
    table.removeChild(table_body)
  }
  let tBody = table.createTBody();
  tBody.id = "stages_body";
  tBody.classList.add("stripe")
  for (let r of records) {
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
      cell.innerText = getBonusDayLetter(r.stageInfo.expBonusDay);
      cell.innerText += r.isExpBonusDay ? " x1.2" : " ";
      cell.classList.add(r.isExpBonusDay ? "active_exp_bonus_day" : "inactive_exp_bonus_day")
    }
    // ユニット種別ボーナス
    {
      let cell = newRow.insertCell();

      let unitTypeElement = <HTMLSpanElement>document.createElement("span");
      cell.appendChild(unitTypeElement);
      unitTypeElement.innerText = getExpBonusUnitTypeLetter(r.stageInfo.expBonusUnitType);
      unitTypeElement.classList.add(getExpBonusUnitTypeClassName(r.stageInfo.expBonusUnitType));
      unitTypeElement.classList.add(r.isUnitTypeExpBonnusApplied ? "active_exp_bonus_unit_type" : "inactive_exp_bonus_unit_type")

      cell.innerHTML += r.isUnitTypeExpBonnusApplied ? " x1.2" : "";
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
      cell.innerText = r.finalExpPerMotivation.toFixed(2);
      cell.classList.add("final_exp_per_motivation");
      // カラースケール
      if (r.expColorScaleRatio != null) {
        function lerp(a: number, b: number, t: number) { return a * (1 - t) + b * t; }
        let colorR = lerp(255, 60, r.expColorScaleRatio).toFixed(0);
        let colorG = lerp(255, 240, r.expColorScaleRatio).toFixed(0);
        let colorB = lerp(255, 92, r.expColorScaleRatio).toFixed(0);
        cell.style.backgroundColor = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
      } else {
        cell.style.backgroundColor = "inherit";
      }
    }
    /*
    // Gold/M
    {
      let cell = newRow.insertCell();
      cell.innerText = r.finalGoldPerMotivation.toFixed(2);
    }
    */
  }
}

function initializeExpTable(ev: Event): void {
  let now: Date = new Date();

  {
    let todayRadio = <HTMLInputElement>document.getElementById("exp_bonus_day_today");
    todayRadio.innerText = "今日(" + getDayOfWeekName(now.getDay()) + ")";
  }

  {
    let tomorrowRadio = <HTMLInputElement>document.getElementById("exp_bonus_day_tomorrow");
    let tomorrow: Date = now;
    tomorrow.setDate(now.getDate() + 1);
    tomorrowRadio.innerText = "明日(" + getDayOfWeekName(tomorrow.getDay()) + ")";
  }

  updateTable();
}
window.onload = initializeExpTable;
