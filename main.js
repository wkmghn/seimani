function getDayOfWeekName(dayOfWeek) {
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
function getDayOfWeekLetter(dayOfWeek) {
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
var StageMode;
(function (StageMode) {
    StageMode[StageMode["Normal"] = 0] = "Normal";
    StageMode[StageMode["Hard"] = 1] = "Hard";
    StageMode[StageMode["Twist"] = 2] = "Twist";
})(StageMode || (StageMode = {}));
function getStageModeLetter(mode) {
    switch (mode) {
        case StageMode.Normal: return "N";
        case StageMode.Hard: return "H";
        case StageMode.Twist: return "T";
    }
    return "?";
}
function getStageModeClassName(mode) {
    switch (mode) {
        case StageMode.Normal: return "stage_mode_normal";
        case StageMode.Hard: return "stage_mode_hard";
        case StageMode.Twist: return "stage_mode_twist";
    }
}
var UnitType;
(function (UnitType) {
    UnitType[UnitType["Melee"] = 0] = "Melee";
    UnitType[UnitType["Ranged"] = 1] = "Ranged";
    UnitType[UnitType["Magic"] = 2] = "Magic";
    UnitType[UnitType["Heavy"] = 3] = "Heavy";
})(UnitType || (UnitType = {}));
function parseUnitType(s) {
    switch (s) {
        case "Melee": return UnitType.Melee;
        case "Ranged": return UnitType.Ranged;
        case "Magic": return UnitType.Magic;
        case "Heavy": return UnitType.Heavy;
    }
    return null;
}
function getExpBonusUnitTypeClassName(unitType) {
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
function getExpBonusUnitTypeLetter(unitType) {
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
var StageInfo = (function () {
    function StageInfo(stageName, motivationConsumption, baseExp, baseGold, expBonusDay, goldBonusDay, expBonusUnitType, isManaBonusAllowed) {
        if (isManaBonusAllowed === void 0) { isManaBonusAllowed = true; }
        this._districtLetter = stageName[2];
        this._stageLetter = stageName[4];
        this._motivationConsumption = motivationConsumption;
        this._baseExp = baseExp;
        this._baseGold = baseGold;
        this._expBonusDay = expBonusDay;
        this._goldBonusDay = goldBonusDay;
        this._expBonusUnitType = expBonusUnitType;
        this._isManaBonusAllowed = isManaBonusAllowed;
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
    }
    Object.defineProperty(StageInfo.prototype, "fullName", {
        get: function () {
            return getStageModeLetter(this._mode) + " " + this._districtLetter + "-" + this._stageLetter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "shortName", {
        get: function () {
            return this._districtLetter + "-" + this._stageLetter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "motivationConsumption", {
        get: function () {
            return this._motivationConsumption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "baseExp", {
        get: function () { return this._baseExp; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "expBonusDay", {
        get: function () {
            return this._expBonusDay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "expBonusUnitType", {
        get: function () {
            return this._expBonusUnitType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "isManaBonusAllowed", {
        get: function () { return this._isManaBonusAllowed; },
        enumerable: true,
        configurable: true
    });
    return StageInfo;
}());
var TableRecord = (function () {
    function TableRecord(stageInfo, expBonusUnitType, dayOfWeek, useManaBonus, useDoubleExpBonus) {
        this._stageInfo = stageInfo;
        this._expBonusUnitType = expBonusUnitType;
        this._dayOfWeek = dayOfWeek;
        this._isDoubleExpBonusApplied = useDoubleExpBonus;
        var expFactor = 1.0;
        if (this._stageInfo.expBonusUnitType == this._expBonusUnitType) {
            expFactor *= 1.2;
            this._isUnitTypeExpBonusApplied = true;
        }
        else {
            this._isUnitTypeExpBonusApplied = false;
        }
        if (this._stageInfo.expBonusDay != null && this._stageInfo.expBonusDay == this._dayOfWeek) {
            expFactor *= 1.2;
            this._isExpBonusDay = true;
        }
        else {
            this._isExpBonusDay = false;
        }
        if (useManaBonus && this._stageInfo.isManaBonusAllowed) {
            expFactor *= 1.2;
            this._isManaBonusApplied = true;
        }
        else {
            this._isManaBonusApplied = false;
        }
        if (useDoubleExpBonus) {
            expFactor *= 2.0;
        }
        this._finalExpFactor = expFactor;
        this._finalExp = this._stageInfo.baseExp * expFactor;
        this.colorScaleRatio = 0.0;
    }
    Object.defineProperty(TableRecord.prototype, "stageInfo", {
        get: function () { return this._stageInfo; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "isUnitTypeExpBonnusApplied", {
        get: function () { return this._isUnitTypeExpBonusApplied; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "isExpBonusDay", {
        get: function () { return this._isExpBonusDay; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "isManaBonusApplied", {
        get: function () { return this._isManaBonusApplied; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "isExpDoubleBonusApplied", {
        get: function () { return this._isDoubleExpBonusApplied; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "finalExpFactor", {
        get: function () { return this._finalExpFactor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "finalExp", {
        get: function () { return this._finalExp; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "finalExpPerMotivation", {
        get: function () { return this._finalExp / this._stageInfo.motivationConsumption; },
        enumerable: true,
        configurable: true
    });
    return TableRecord;
}());
function getSelectedExpBonusUnitType() {
    var radios = document.getElementsByName("exp_bonus_unit_type");
    for (var i = 0; i < radios.length; ++i) {
        var radio = radios[i];
        if (radio.checked) {
            return parseUnitType(radio.value);
        }
    }
    return null;
}
function getSelectedDayOfWeek() {
    var now = new Date();
    var radios = document.getElementsByName("exp_bonus_day");
    var radio = radios[0];
    if (radio.value == "Today" && radio.checked) {
        return now.getDay();
    }
    var tomorrow = now;
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.getDay();
}
function updateTable() {
    var 日 = 0;
    var 月 = 1;
    var 火 = 2;
    var 水 = 3;
    var 木 = 4;
    var 金 = 5;
    var 土 = 6;
    var 無 = null;
    var stages = [
        new StageInfo("N 2-1", 12, 523, 630, 月, 木, UnitType.Magic),
        new StageInfo("N 2-F", 12, 775, 580, 水, 月, UnitType.Magic),
        new StageInfo("N 2-G", 12, 802, 490, 木, 火, UnitType.Ranged),
        new StageInfo("N 2-H", 13, 862, 550, 金, 水, UnitType.Melee),
        new StageInfo("N 2-2", 12, 589, 630, 火, 金, UnitType.Ranged),
        new StageInfo("N 2-A", 13, 664, 890, 水, 土, UnitType.Heavy),
        new StageInfo("N 2-3", 13, 748, 900, 木, 日, UnitType.Melee),
        new StageInfo("N 2-B", 14, 843, 950, 金, 月, UnitType.Magic),
        new StageInfo("N 2-C", 15, 950, 810, 土, 火, null),
        new StageInfo("N 2-I", 13, 985, 670, 土, 木, UnitType.Heavy),
        new StageInfo("N 2-4", 16, 1142, 870, 日, 水, UnitType.Ranged),
        new StageInfo("N 2-D", 17, 1215, 1590, 月, 無, UnitType.Melee),
        new StageInfo("N 2-E", 18, 1292, 800, 火, 金, UnitType.Heavy),
        new StageInfo("N 2-J", 17, 1350, 1140, 日, 金, UnitType.Magic),
        new StageInfo("N 2-K", 17, 1371, 1100, 火, 日, UnitType.Magic),
        new StageInfo("N 2-5", 20, 1758, 1110, 水, 土, null),
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
        new StageInfo("N 4-1", 25, 2966, 2740, 月, 木, UnitType.Magic),
        new StageInfo("N 4-2", 25, 3004, 2760, 火, 金, UnitType.Melee),
        new StageInfo("N 4-3", 25, 3062, 2770, null, 土, UnitType.Ranged),
    ];
    var records = [];
    var expBonusUnitType = getSelectedExpBonusUnitType();
    var dayOfWeek = getSelectedDayOfWeek();
    var useManaBonus = true;
    var useDoubleExpBonus = true;
    for (var _i = 0, stages_1 = stages; _i < stages_1.length; _i++) {
        var stageInfo = stages_1[_i];
        var r = new TableRecord(stageInfo, expBonusUnitType, dayOfWeek, useManaBonus, useDoubleExpBonus);
        records.push(r);
    }
    records.sort(function (a, b) {
        return b.finalExpPerMotivation - a.finalExpPerMotivation;
    });
    {
        var maxFinalExpPerMotivation = records[0].finalExpPerMotivation;
        var minFinalExpPerMotivation = records[Math.min(10, records.length) - 1].finalExpPerMotivation;
        for (var _a = 0, records_1 = records; _a < records_1.length; _a++) {
            var record = records_1[_a];
            if (minFinalExpPerMotivation < record.finalExpPerMotivation) {
                var linearRatio = (record.finalExpPerMotivation - minFinalExpPerMotivation) / (maxFinalExpPerMotivation - minFinalExpPerMotivation);
                record.colorScaleRatio = Math.pow(linearRatio, 1.5);
            }
            else {
                record.colorScaleRatio = 0.0;
            }
        }
    }
    var table = document.getElementById("stages");
    var table_body = document.getElementById("stages_body");
    if (table_body != null) {
        table.removeChild(table_body);
    }
    var tBody = table.createTBody();
    tBody.id = "stages_body";
    for (var _b = 0, records_2 = records; _b < records_2.length; _b++) {
        var r = records_2[_b];
        var newRow = tBody.insertRow();
        {
            var cell = newRow.insertCell();
            cell.innerText = r.stageInfo.fullName;
            cell.classList.add("stage_name");
            cell.classList.add(getStageModeClassName(r.stageInfo.mode));
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.stageInfo.motivationConsumption.toString();
            cell.classList.add("motivation_consumption");
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.stageInfo.baseExp.toString();
            cell.classList.add("base_exp");
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = getDayOfWeekLetter(r.stageInfo.expBonusDay);
            cell.innerText += r.isExpBonusDay ? " x1.2" : " ";
            cell.classList.add(r.isExpBonusDay ? "active_exp_bonus_day" : "inactive_exp_bonus_day");
        }
        {
            var cell = newRow.insertCell();
            var unitTypeElement = document.createElement("span");
            cell.appendChild(unitTypeElement);
            unitTypeElement.innerText = getExpBonusUnitTypeLetter(r.stageInfo.expBonusUnitType);
            unitTypeElement.classList.add(getExpBonusUnitTypeClassName(r.stageInfo.expBonusUnitType));
            unitTypeElement.classList.add(r.isUnitTypeExpBonnusApplied ? "active_exp_bonus_unit_type" : "inactive_exp_bonus_unit_type");
            cell.innerHTML += r.isUnitTypeExpBonnusApplied ? " x1.2" : "";
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.isExpDoubleBonusApplied ? "x2.0" : "";
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.isManaBonusApplied ? "x1.2" : "";
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = "x" + r.finalExpFactor.toFixed(2);
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.finalExp.toFixed(0);
            cell.classList.add("final_exp");
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.finalExpPerMotivation.toFixed(2);
            cell.classList.add("final_exp_per_motivation");
            if (0 < r.colorScaleRatio) {
                function lerp(a, b, t) { return a * (1 - t) + b * t; }
                var colorR = lerp(255, 60, r.colorScaleRatio).toFixed(0);
                var colorG = lerp(255, 240, r.colorScaleRatio).toFixed(0);
                var colorB = lerp(255, 92, r.colorScaleRatio).toFixed(0);
                cell.style.backgroundColor = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
            }
            else {
                cell.style.backgroundColor = "inherit";
            }
        }
    }
}
function initialize(ev) {
    var now = new Date();
    {
        var todayRadio = document.getElementById("exp_bonus_day_today");
        todayRadio.innerText = "今日(" + getDayOfWeekName(now.getDay()) + ")";
    }
    {
        var tomorrowRadio = document.getElementById("exp_bonus_day_tomorrow");
        var tomorrow = now;
        tomorrow.setDate(now.getDate() + 1);
        tomorrowRadio.innerText = "明日(" + getDayOfWeekName(tomorrow.getDay()) + ")";
    }
    updateTable();
}
window.onload = initialize;
