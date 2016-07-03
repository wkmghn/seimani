function getFromLocalStorage(name, notFoundValue) {
    if (notFoundValue === void 0) { notFoundValue = null; }
    if (!localStorage) {
        return notFoundValue;
    }
    var item = localStorage.getItem(name);
    if (item) {
        return item;
    }
    else {
        return notFoundValue;
    }
}
function getBooleanFromLocalStorage(name, notFoundValue) {
    var str = getFromLocalStorage(name);
    if (str) {
        return str == "0" ? false : true;
    }
    else {
        return notFoundValue;
    }
}
function loadSettings() {
    if (!localStorage) {
        return;
    }
    document.getElementById("difficulty").value = getFromLocalStorage("exp-table:Difficulty", "All");
    document.getElementById("only20").checked = getBooleanFromLocalStorage("exp-table:OnlyTop20", true);
    document.getElementById("separateEventStage").checked = getBooleanFromLocalStorage("exp-table:SeparateEventStage", false);
}
function saveSettings() {
    if (!localStorage) {
        return;
    }
    localStorage.setItem("exp-table:Difficulty", document.getElementById("difficulty").value);
    localStorage.setItem("exp-table:OnlyTop20", document.getElementById("only20").checked ? "1" : "0");
    localStorage.setItem("exp-table:SeparateEventStage", document.getElementById("separateEventStage").checked ? "1" : "0");
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
function getBonusDayLetter(dayOfWeek) {
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
    function StageInfo(stageName, motivationConsumption, baseExp, baseGold, expBonusDay, goldBonusDay, expBonusUnitType, isManaBonusAllowed, isProtectionBonusAllowed) {
        if (isManaBonusAllowed === void 0) { isManaBonusAllowed = true; }
        if (isProtectionBonusAllowed === void 0) { isProtectionBonusAllowed = false; }
        this._motivationConsumption = motivationConsumption;
        this._baseExp = baseExp;
        this._baseGold = baseGold;
        this._expBonusDay = expBonusDay;
        this._goldBonusDay = goldBonusDay;
        this._expBonusUnitType = expBonusUnitType;
        this._isManaBonusAllowed = isManaBonusAllowed;
        this._isProtectionBonusAllowe = isProtectionBonusAllowed;
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
        }
        else {
            this._districtLetter = null;
            this._stageLetter = null;
            this._mode = null;
            this._eventStageName = stageName;
            this._isEventStage = true;
        }
    }
    Object.defineProperty(StageInfo.prototype, "fullName", {
        get: function () {
            if (this._isEventStage) {
                return this._eventStageName;
            }
            else {
                return getStageModeLetter(this._mode) + " " + this._districtLetter + "-" + this._stageLetter;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "shortName", {
        get: function () {
            if (this._isEventStage) {
                return this._eventStageName;
            }
            else {
                return this._districtLetter + "-" + this._stageLetter;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "district", {
        get: function () { return this._districtLetter ? parseInt(this._districtLetter) : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "mode", {
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "motivationConsumption", {
        get: function () { return this._motivationConsumption; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "baseExp", {
        get: function () { return this._baseExp; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "expBonusDay", {
        get: function () { return this._expBonusDay; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "expBonusUnitType", {
        get: function () { return this._expBonusUnitType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "isManaBonusAllowed", {
        get: function () { return this._isManaBonusAllowed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "baseGold", {
        get: function () { return this._baseGold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "goldBonusDay", {
        get: function () { return this._goldBonusDay; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "isProtectionBonusAllowed", {
        get: function () { return this._isProtectionBonusAllowe; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "isEventStage", {
        get: function () { return this._eventStageName != null; },
        enumerable: true,
        configurable: true
    });
    return StageInfo;
}());
var TableRecord = (function () {
    function TableRecord(stageInfo, expBonusUnitType, dayOfWeek, useManaBonus, useDoubleExpBonus, useProtectionBonus) {
        this._stageInfo = stageInfo;
        this._expBonusUnitType = expBonusUnitType;
        this._dayOfWeek = dayOfWeek;
        this._isDoubleExpBonusApplied = useDoubleExpBonus;
        {
            var factors = [];
            if (this._stageInfo.expBonusDay != null && this._stageInfo.expBonusDay == this._dayOfWeek) {
                factors.push(1.2);
                this._isExpBonusDay = true;
            }
            else {
                this._isExpBonusDay = false;
            }
            if (useManaBonus && this._stageInfo.isManaBonusAllowed) {
                factors.push(1.2);
                this._isManaBonusApplied = true;
            }
            else {
                this._isManaBonusApplied = false;
            }
            if (useDoubleExpBonus) {
                factors.push(2.0);
            }
            if ((this._expBonusUnitType != null) && (this._stageInfo.expBonusUnitType == this._expBonusUnitType)) {
                factors.push(1.2);
                this._isUnitTypeExpBonusApplied = true;
            }
            else {
                this._isUnitTypeExpBonusApplied = false;
            }
            var finalFactor = 1.0;
            var finalExp = this._stageInfo.baseExp;
            for (var _i = 0, factors_1 = factors; _i < factors_1.length; _i++) {
                var factor = factors_1[_i];
                finalFactor *= factor;
                finalExp = Math.floor(finalExp * factor);
            }
            this._finalExpFactor = finalFactor;
            this._finalExp = finalExp;
        }
        {
            var goldFactor = 1.0;
            if (this._stageInfo.goldBonusDay != null && this._stageInfo.goldBonusDay == this._dayOfWeek) {
                goldFactor *= 1.2;
                this._isGoldBonusDay = true;
            }
            else {
                this._isGoldBonusDay = false;
            }
            if (useProtectionBonus && this._stageInfo.isProtectionBonusAllowed) {
                goldFactor *= 1.2;
            }
            this._finalGoldFactor = goldFactor;
        }
        this.expColorScaleRatio = null;
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
    Object.defineProperty(TableRecord.prototype, "isGoldBonusDay", {
        get: function () { return this._isGoldBonusDay; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRecord.prototype, "finalGoldPerMotivation", {
        get: function () { return this._stageInfo.baseGold * this._finalGoldFactor / this._stageInfo.motivationConsumption; },
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
            if (radio.value == "Souri") {
                return null;
            }
            else {
                return parseUnitType(radio.value);
            }
        }
    }
    return null;
}
function getSelectedDayOfWeek() {
    var now = new Date();
    var radios = document.getElementsByName("exp_bonus_day");
    for (var index in radios) {
        var radio = (radios[index]);
        if (radio.checked) {
            return parseInt(radio.value);
        }
    }
    return 0;
}
function setDayOfWeekSelectorLabels() {
    var now = new Date();
    for (var i = 0; i < 7; ++i) {
        var labelNodeID = "exp_bonus_day_" + i;
        var labelNode = document.getElementById(labelNodeID);
        labelNode.innerText = getDayOfWeekLetter(i);
        if (i == now.getDay()) {
            labelNode.innerText += "(今日)";
            labelNode.style.fontWeight = "bold";
        }
        else {
            labelNode.style.fontWeight = "inherit";
        }
    }
}
var stages;
function initializeStageList() {
    var 日 = 0;
    var 月 = 1;
    var 火 = 2;
    var 水 = 3;
    var 木 = 4;
    var 金 = 5;
    var 土 = 6;
    var 無 = null;
    stages = [
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
        new StageInfo("T 2-E", 40, 4407, 0, 日, 土, UnitType.Ranged),
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
        new StageInfo("N 4-1", 25, 2966, 2740, 月, 木, UnitType.Magic),
        new StageInfo("N 4-2", 25, 3004, 2760, 火, 金, UnitType.Melee),
        new StageInfo("N 4-3", 25, 3062, 2770, 水, 土, UnitType.Ranged),
        new StageInfo("N 4-4", 26, 3246, 2860, 木, 日, UnitType.Ranged),
        new StageInfo("N 4-5", 26, 3251, 2860, 金, 月, UnitType.Magic),
        new StageInfo("N 4-A", 25, 2971, 2790, 土, 火, UnitType.Melee),
        new StageInfo("N 4-B", 25, 3042, 2820, 日, 水, UnitType.Heavy),
        new StageInfo("N 4-C", 26, 3194, 2890, 月, 木, UnitType.Heavy),
        new StageInfo("H 4-1", 41, 5186, 4790, 金, 月, UnitType.Ranged),
        new StageInfo("H 4-2", 41, 5236, 4840, 土, 火, UnitType.Melee),
        new StageInfo("H 4-3", 41, 5250, 4740, 日, 水, UnitType.Magic),
        new StageInfo("H 4-4", 41, 5352, 4750, 月, 木, UnitType.Melee),
        new StageInfo("H 4-5", 42, 5535, 4830, 火, 金, UnitType.Heavy),
        new StageInfo("H 4-A", 41, 5234, 4780, 水, 土, UnitType.Ranged),
        new StageInfo("H 4-B", 41, 5229, 4900, 木, 日, UnitType.Magic),
        new StageInfo("H 4-C", 41, 5272, 4830, 金, 月, UnitType.Heavy),
        new StageInfo("N 5-1", 26, 3550, 3120, 火, 金, UnitType.Ranged),
        new StageInfo("N 5-2", 26, 3630, 3130, 水, 土, UnitType.Melee),
        new StageInfo("N 5-3", 27, 3734, 3150, 木, 日, UnitType.Heavy),
        new StageInfo("N 5-4", 27, 3808, 3110, 金, 月, UnitType.Magic),
        new StageInfo("N 5-5", 27, 3835, 3090, 土, 火, UnitType.Ranged),
        new StageInfo("N 5-A", 26, 3515, 3040, 日, 水, UnitType.Magic),
        new StageInfo("H 5-1", 42, 6017, 5300, 土, 火, UnitType.Ranged),
        new StageInfo("H 5-2", 42, 6065, 5050, 日, 水, UnitType.Heavy),
        new StageInfo("H 5-3", 42, 6129, 5110, 月, 木, UnitType.Ranged),
        new StageInfo("H 5-4", 42, 6181, 5300, 火, 金, UnitType.Melee),
        new StageInfo("H 5-5", 43, 6409, 5270, 水, 土, UnitType.Heavy),
        new StageInfo("H 5-A", 42, 6030, 5300, 木, 日, UnitType.Magic),
        new StageInfo("初級", 30, 3210, 2100, 無, 無, null, false, false),
        new StageInfo("中級", 40, 4480, 5600, 無, 無, null, false, false),
        new StageInfo("上級", 50, 5750, 9500, 無, 無, null, false, false),
        new StageInfo("まつり", 80, 9440, 16000, 無, 無, null, false, false),
        new StageInfo("ちまつり", 100, 12500, 21000, 無, 無, null, false, false),
    ];
}
function updateTable() {
    var records = [];
    {
        var expBonusUnitType = getSelectedExpBonusUnitType();
        var dayOfWeek = getSelectedDayOfWeek();
        var useManaBonus = true;
        var useDoubleExpBonus = (expBonusUnitType != null);
        var useProtectionBonus = true;
        for (var _i = 0, stages_1 = stages; _i < stages_1.length; _i++) {
            var stageInfo = stages_1[_i];
            var r = new TableRecord(stageInfo, expBonusUnitType, dayOfWeek, useManaBonus, useDoubleExpBonus, useProtectionBonus);
            records.push(r);
        }
    }
    records.sort(function (a, b) {
        return b.finalExpPerMotivation - a.finalExpPerMotivation;
    });
    var separatedEventStageRecords = [];
    {
        var separateEventStages = document.getElementById("separateEventStage").checked;
        if (separateEventStages) {
            separatedEventStageRecords = records.filter(function (item, index) { return item.stageInfo.isEventStage; });
        }
    }
    {
        var selectedDifficulty = document.getElementById("difficulty").value;
        if (selectedDifficulty == "All") {
        }
        else {
            var lhs_1 = parseInt(selectedDifficulty[1]);
            switch (selectedDifficulty[0]) {
                case 'N': break;
                case 'H':
                    lhs_1 += 0.5;
                    break;
                case 'T':
                    lhs_1 += 2.25;
                    break;
            }
            var filter = function (element, index, array) {
                var rhs = element.stageInfo.district;
                if (rhs == null) {
                    return true;
                }
                switch (element.stageInfo.mode) {
                    case StageMode.Normal: break;
                    case StageMode.Hard:
                        rhs += 0.5;
                        break;
                    case StageMode.Twist:
                        rhs += 2.25;
                        break;
                }
                return lhs_1 >= rhs;
            };
            records = records.filter(filter);
        }
    }
    {
        var maxFinalExpPerMotivation = records[0].finalExpPerMotivation;
        var minFinalExpPerMotivation = records[Math.min(10, records.length) - 1].finalExpPerMotivation;
        for (var _a = 0, records_1 = records; _a < records_1.length; _a++) {
            var record = records_1[_a];
            if (minFinalExpPerMotivation <= record.finalExpPerMotivation) {
                var linearRatio = (record.finalExpPerMotivation - minFinalExpPerMotivation) / (maxFinalExpPerMotivation - minFinalExpPerMotivation);
                record.expColorScaleRatio = Math.pow(linearRatio, 1.5);
            }
            else {
                record.expColorScaleRatio = null;
            }
        }
    }
    if (20 < records.length && document.getElementById("only20").checked) {
        records = records.slice(0, 20);
    }
    var table = document.getElementById("stages");
    var table_body = document.getElementById("stages_body");
    if (table_body != null) {
        table.removeChild(table_body);
    }
    var tBody = table.createTBody();
    tBody.id = "stages_body";
    tBody.classList.add("stripe");
    var insertRow = function (r) {
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
            cell.innerText = getBonusDayLetter(r.stageInfo.expBonusDay);
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
            cell.style.textAlign = "center";
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = r.isManaBonusApplied ? "x1.2" : (r.stageInfo.isManaBonusAllowed ? "--" : "--");
            if (!r.isManaBonusApplied) {
                cell.classList.add("inactive_mana_bonus");
            }
            cell.style.textAlign = "center";
        }
        {
            var cell = newRow.insertCell();
            cell.innerText = "x" + r.finalExpFactor.toFixed(2);
            cell.style.textAlign = "center";
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
            if (r.expColorScaleRatio != null) {
                function lerp(a, b, t) { return a * (1 - t) + b * t; }
                var colorR = lerp(255, 60, r.expColorScaleRatio).toFixed(0);
                var colorG = lerp(255, 240, r.expColorScaleRatio).toFixed(0);
                var colorB = lerp(255, 92, r.expColorScaleRatio).toFixed(0);
                cell.style.backgroundColor = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
                cell.style.borderTopWidth = "1px";
                cell.style.borderBottomWidth = "1px";
            }
            else {
                cell.style.backgroundColor = "inherit";
            }
        }
        {
            {
                var cell = newRow.insertCell();
                cell.classList.add("final_gold_per_motivation");
                cell.style.borderRightWidth = "0px";
                if (0 < r.finalGoldPerMotivation) {
                    cell.innerText = r.finalGoldPerMotivation.toFixed(2);
                }
                else {
                    cell.innerText = "？";
                }
            }
            {
                var cell = newRow.insertCell();
                cell.style.borderLeftWidth = "0px";
                cell.style.paddingLeft = "0px";
                cell.classList.add(r.isGoldBonusDay ? "active_exp_bonus_day" : "inactive_exp_bonus_day");
                cell.innerText = getBonusDayLetter(r.stageInfo.goldBonusDay);
            }
        }
        return newRow;
    };
    if (separatedEventStageRecords) {
        for (var _b = 0, separatedEventStageRecords_1 = separatedEventStageRecords; _b < separatedEventStageRecords_1.length; _b++) {
            var r = separatedEventStageRecords_1[_b];
            var row = insertRow(r);
            if (separatedEventStageRecords[separatedEventStageRecords.length - 1] == r) {
                for (var i = 0; i < row.cells.length; ++i) {
                    var cell = row.cells.item(i);
                    cell.style.borderBottom = "solid 2px #c0c0c0";
                }
            }
        }
    }
    for (var _c = 0, records_2 = records; _c < records_2.length; _c++) {
        var r = records_2[_c];
        insertRow(r);
    }
    {
        var combo = (document.getElementById("difficulty"));
        if (combo.value == "All") {
            combo.style.backgroundColor = null;
        }
        else {
            combo.style.backgroundColor = "#DDEEFF";
        }
    }
    setDayOfWeekSelectorLabels();
    saveSettings();
}
function initializeExpTable(ev) {
    initializeStageList();
    setDayOfWeekSelectorLabels();
    {
        var now = new Date();
        var radio = document.getElementById("exp_bonus_day_radio_" + now.getDay());
        radio.checked = true;
    }
    {
        var combo_1 = document.getElementById("difficulty");
        var addOption = function (label, value, foreColor) {
            var option = combo_1.appendChild(document.createElement("option"));
            option.innerText = label;
            option.style.color = foreColor;
            option.style.backgroundColor = "white";
            var valueAttr = document.createAttribute("value");
            valueAttr.value = value;
            option.attributes.setNamedItem(valueAttr);
        };
        addOption("すべての難易度", "All", "inherit");
        addOption("H5 まで (推奨Lv 61-65)", "H5", "#E08000");
        addOption("N5 まで (推奨Lv 51-55)", "N5", "inherit");
        addOption("H4 まで (推奨Lv 56-60)", "H4", "#E08000");
        addOption("T2 まで (推奨Lv 45-53)", "T2", "#FF0040");
        addOption("N4 まで (推奨Lv 46-50)", "N4", "inherit");
        addOption("H3 まで (推奨Lv 45-55)", "H3", "#E08000");
        addOption("N3 まで (推奨Lv 31-45)", "N3", "inherit");
        addOption("H2 まで (推奨Lv 30-40)", "H2", "#E08000");
        addOption("N2 まで (推奨Lv 15-30)", "N2", "inherit");
    }
    {
        var existsEventStage = false;
        for (var _i = 0, stages_2 = stages; _i < stages_2.length; _i++) {
            var stageInfo = stages_2[_i];
            if (stageInfo.isEventStage) {
                existsEventStage = true;
                break;
            }
        }
        if (!existsEventStage) {
            var checkBox = document.getElementById("separateEventStage");
            var parentLabel = checkBox.parentElement;
            checkBox.style.visibility = "hidden";
            parentLabel.style.visibility = "hidden";
        }
    }
    loadSettings();
    updateTable();
}
window.onload = initializeExpTable;
