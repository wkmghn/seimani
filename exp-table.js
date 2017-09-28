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
    document.getElementById("includeExtraStage").checked = getBooleanFromLocalStorage("exp-table:IncludeExtraStage", true);
    document.getElementById("only20").checked = getBooleanFromLocalStorage("exp-table:OnlyTop20", true);
    document.getElementById("separateEventStage").checked = getBooleanFromLocalStorage("exp-table:SeparateEventStage", false);
}
function saveSettings() {
    if (!localStorage) {
        return;
    }
    localStorage.setItem("exp-table:Difficulty", document.getElementById("difficulty").value);
    localStorage.setItem("exp-table:IncludeExtraStage", document.getElementById("includeExtraStage").checked ? "1" : "0");
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
var StageCategory;
(function (StageCategory) {
    StageCategory[StageCategory["Numbered"] = 0] = "Numbered";
    StageCategory[StageCategory["Alphabetical"] = 1] = "Alphabetical";
    StageCategory[StageCategory["Extra"] = 2] = "Extra";
    StageCategory[StageCategory["Event"] = 3] = "Event";
})(StageCategory || (StageCategory = {}));
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
    function StageInfo(stageName, motivationConsumption, baseExp, baseGold, expBonusDays, goldBonusDay, expBonusUnitType, isManaBonusAllowed, isProtectionBonusAllowed) {
        if (isManaBonusAllowed === void 0) { isManaBonusAllowed = true; }
        if (isProtectionBonusAllowed === void 0) { isProtectionBonusAllowed = false; }
        this._motivationConsumption = motivationConsumption;
        this._baseExp = baseExp;
        this._baseGold = baseGold;
        this._expBonusDays = expBonusDays;
        this._goldBonusDay = goldBonusDay;
        this._expBonusUnitType = expBonusUnitType;
        this._isManaBonusAllowed = isManaBonusAllowed;
        this._isProtectionBonusAllowed = isProtectionBonusAllowed;
        if (0 <= ["N", "H", "T"].indexOf(stageName[0])) {
            this._districtLetter = stageName[2];
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
            if (stageName.length == 5) {
                if (isNaN(parseInt(stageName[4], 10))) {
                    this._category = StageCategory.Alphabetical;
                }
                else {
                    this._category = StageCategory.Numbered;
                }
            }
            else {
                this._category = StageCategory.Extra;
            }
            this._name = stageName.slice(2);
        }
        else {
            this._districtLetter = null;
            this._mode = null;
            this._category = StageCategory.Event;
            this._name = stageName;
        }
    }
    Object.defineProperty(StageInfo.prototype, "fullName", {
        get: function () {
            if (this._category == StageCategory.Event) {
                return this._name;
            }
            else {
                return getStageModeLetter(this._mode) + " " + this._name;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "shortName", {
        get: function () {
            if (this._category == StageCategory.Event) {
                return this._name;
            }
            else {
                return this._name;
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
    Object.defineProperty(StageInfo.prototype, "category", {
        get: function () { return this._category; },
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
    Object.defineProperty(StageInfo.prototype, "expBonusDays", {
        get: function () { return this._expBonusDays; },
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
        get: function () { return this._isProtectionBonusAllowed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "isNumberedStage", {
        get: function () { return this._category == StageCategory.Numbered; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageInfo.prototype, "isEventStage", {
        get: function () { return this._category == StageCategory.Event; },
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
            if (this._stageInfo.expBonusDays != null && (0 <= this._stageInfo.expBonusDays.indexOf(this._dayOfWeek))) {
                factors.push(1.3);
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
                factors.push(1.3);
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
                goldFactor *= 1.3;
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
    Object.defineProperty(TableRecord.prototype, "isSpecialExpBonusDay", {
        get: function () { return this._isSpecialExpBonusDay; },
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
        new StageInfo("N 2-1", 12, 1803, 630, [月, 金], 木, UnitType.Magic),
        new StageInfo("N 2-F", 12, 1915, 580, [水, 金], 月, UnitType.Magic),
        new StageInfo("N 2-G", 12, 1905, 490, [月, 木], 火, UnitType.Ranged),
        new StageInfo("N 2-H", 13, 2065, 550, [日, 金], 水, UnitType.Melee),
        new StageInfo("N 2-2", 12, 1815, 630, [火, 水], 金, UnitType.Ranged),
        new StageInfo("N 2-A", 13, 2025, 890, [日, 水], 土, UnitType.Heavy),
        new StageInfo("N 2-3", 13, 2067, 900, [木, 土], 日, UnitType.Melee),
        new StageInfo("N 2-B", 14, 2245, 950, [火, 金], 月, UnitType.Magic),
        new StageInfo("N 2-C", 15, 2400, 810, [月, 土], 火, null),
        new StageInfo("N 2-I", 13, 2098, 670, [水, 土], 木, UnitType.Heavy),
        new StageInfo("N 2-4", 16, 2575, 870, [日, 金], 水, UnitType.Ranged),
        new StageInfo("N 2-D", 17, 2474, 1590, [月, 火], 無, UnitType.Melee),
        new StageInfo("N 2-E", 18, 2912, 800, [火, 木], 金, UnitType.Heavy),
        new StageInfo("N 2-J", 17, 2769, 1140, [日, 木], 金, UnitType.Magic),
        new StageInfo("N 2-K", 17, 2763, 1100, [火, 土], 日, UnitType.Magic),
        new StageInfo("N 2-5", 20, 3293, 1110, [日, 水], 土, UnitType.Melee),
        new StageInfo("H 2-1", 22, 3690, 1730, [日, 金], 水, UnitType.Heavy),
        new StageInfo("H 2-F", 28, 4720, 2480, [日, 月], 無, UnitType.Ranged),
        new StageInfo("H 2-G", 28, 4771, 2540, [火, 金], 無, UnitType.Melee),
        new StageInfo("H 2-H", 28, 4785, 2480, [日, 土], 水, UnitType.Heavy),
        new StageInfo("H 2-2", 23, 3814, 1800, [月, 土], 木, UnitType.Ranged),
        new StageInfo("H 2-A", 24, 4057, 2830, [月, 火], 金, UnitType.Melee),
        new StageInfo("H 2-3", 28, 4612, 2900, [月, 水], 土, UnitType.Magic),
        new StageInfo("H 2-B", 29, 4820, 3070, [火, 木], 日, UnitType.Ranged),
        new StageInfo("H 2-C", 29, 4861, 2140, [水, 金], 月, null),
        new StageInfo("H 2-I", 29, 4947, 2600, [火, 木], 無, UnitType.Magic),
        new StageInfo("H 2-4", 31, 5318, 2210, [木, 土], 火, UnitType.Melee),
        new StageInfo("H 2-D", 36, 6011, 4280, [日, 月], 無, UnitType.Heavy),
        new StageInfo("H 2-E", 36, 6086, 1860, [日, 水], 木, UnitType.Magic),
        new StageInfo("H 2-J", 34, 5792, 3020, [水, 金], 無, UnitType.Ranged),
        new StageInfo("H 2-K", 35, 5980, 3120, [水, 土], 無, UnitType.Melee),
        new StageInfo("H 2-5", 36, 6105, 2430, [木, 土], 金, UnitType.Magic),
        new StageInfo("T 2-1", 37, 6121, 4130, [月, 土], 金, UnitType.Heavy),
        new StageInfo("T 2-F", 37, 6072, 3980, [月, 水], 日, UnitType.Magic),
        new StageInfo("T 2-G", 37, 6284, 3950, [火, 金], 月, UnitType.Melee),
        new StageInfo("T 2-H", 38, 6598, 4060, [水, 土], 火, UnitType.Ranged),
        new StageInfo("T 2-2", 38, 6494, 4220, [日, 火], 土, UnitType.Ranged),
        new StageInfo("T 2-A", 38, 6400, 4250, [月, 水], 日, UnitType.Melee),
        new StageInfo("T 2-3", 39, 6897, 4210, [日, 火], 月, UnitType.Melee),
        new StageInfo("T 2-B", 40, 6860, 4500, [水, 木], 火, UnitType.Heavy),
        new StageInfo("T 2-C", 40, 6940, 4260, [木, 土], 水, UnitType.Melee),
        new StageInfo("T 2-I", 40, 6892, 4260, [木, 金], 水, UnitType.Magic),
        new StageInfo("T 2-4", 40, 6996, 4320, [月, 金], 木, UnitType.Ranged),
        new StageInfo("T 2-D", 40, 7035, 4430, [月, 土], 金, UnitType.Magic),
        new StageInfo("T 2-E", 40, 7051, 4290, [日, 木], 土, UnitType.Ranged),
        new StageInfo("T 2-J", 40, 7019, 4350, [日, 金], 木, UnitType.Heavy),
        new StageInfo("T 2-K", 40, 7302, 4450, [火, 土], 金, UnitType.Heavy),
        new StageInfo("T 2-5", 41, 7360, 4390, [日, 火], 土, UnitType.Magic),
        new StageInfo("N 3-1", 19, 3114, 1940, [日, 月], 金, UnitType.Ranged),
        new StageInfo("N 3-2", 19, 3141, 1960, [月, 木], 土, UnitType.Melee),
        new StageInfo("N 3-A", 19, 3158, 2560, [月, 火], 無, UnitType.Magic),
        new StageInfo("N 3-3", 20, 3344, 2050, [水, 金], 月, UnitType.Heavy),
        new StageInfo("N 3-B", 20, 3398, 2670, [日, 木], 無, UnitType.Melee),
        new StageInfo("N 3-C", 21, 3553, 2200, [金, 土], 水, UnitType.Ranged),
        new StageInfo("N 3-4", 22, 3737, 2300, [水, 土], 木, UnitType.Magic),
        new StageInfo("N 3-D", 22, 3752, 2200, [日, 木], 金, UnitType.Heavy),
        new StageInfo("N 3-E", 23, 3949, 2440, [月, 火], 土, UnitType.Ranged),
        new StageInfo("N 3-5", 24, 4238, 2530, [火, 金], 日, UnitType.Magic),
        new StageInfo("N 3-F", 19, 3127, 2000, [水, 土], 月, UnitType.Heavy),
        new StageInfo("N 3-G", 21, 3599, 2170, [日, 木], 火, UnitType.Ranged),
        new StageInfo("N 3-H", 19, 3137, 1980, [火, 金], 水, UnitType.Melee),
        new StageInfo("N 3-I", 21, 3584, 2220, [水, 土], 木, UnitType.Melee),
        new StageInfo("H 3-1", 37, 6334, 4070, [水, 金], 月, UnitType.Melee),
        new StageInfo("H 3-2", 37, 6325, 4080, [日, 木], 火, UnitType.Ranged),
        new StageInfo("H 3-A", 38, 6493, 4210, [月, 金], 水, UnitType.Magic),
        new StageInfo("H 3-3", 38, 6580, 4190, [火, 土], 木, UnitType.Ranged),
        new StageInfo("H 3-B", 39, 6716, 4370, [日, 月], 金, UnitType.Melee),
        new StageInfo("H 3-C", 40, 6924, 4480, [月, 金], 土, UnitType.Ranged),
        new StageInfo("H 3-4", 40, 7027, 4370, [火, 水], 日, UnitType.Heavy),
        new StageInfo("H 3-D", 40, 6985, 4350, [水, 土], 火, UnitType.Magic),
        new StageInfo("H 3-E", 40, 7018, 4540, [日, 木], 水, UnitType.Heavy),
        new StageInfo("H 3-5", 41, 7397, 4460, [金, 土], 木, UnitType.Heavy),
        new StageInfo("H 3-F", 37, 6346, 4250, [火, 土], 金, UnitType.Melee),
        new StageInfo("H 3-G", 40, 6959, 4450, [日, 木], 土, UnitType.Magic),
        new StageInfo("H 3-H", 37, 6357, 4110, [月, 木], 日, UnitType.Melee),
        new StageInfo("H 3-I", 40, 6988, 4390, [火, 水], 月, UnitType.Ranged),
        new StageInfo("T 3-1", 41, 7090, 4600, [火, 金], 木, UnitType.Melee),
        new StageInfo("T 3-2", 41, 7281, 4640, [水, 土], 金, UnitType.Ranged),
        new StageInfo("T 3-A", 41, 7152, 4570, [日, 木], 土, UnitType.Magic),
        new StageInfo("T 3-F", 41, 7184, 4780, [月, 土], 日, UnitType.Magic),
        new StageInfo("N 4-1", 25, 4211, 2740, [月, 火], 木, UnitType.Magic),
        new StageInfo("N 4-2", 25, 4265, 2760, [月, 火], 金, UnitType.Melee),
        new StageInfo("N 4-3", 25, 4348, 2770, [日, 水], 土, UnitType.Ranged),
        new StageInfo("N 4-4", 26, 4609, 2860, [木, 土], 日, UnitType.Ranged),
        new StageInfo("N 4-5", 26, 4616, 2860, [日, 金], 月, UnitType.Magic),
        new StageInfo("N 4-A", 25, 4218, 2790, [金, 土], 火, UnitType.Melee),
        new StageInfo("N 4-B", 25, 4319, 2820, [日, 土], 水, UnitType.Heavy),
        new StageInfo("N 4-C", 26, 4535, 2890, [月, 水], 木, UnitType.Heavy),
        new StageInfo("N 4-D", 26, 4559, 2950, [火, 木], 金, UnitType.Melee),
        new StageInfo("N 4-E", 25, 4234, 2720, [火, 水], 土, UnitType.Ranged),
        new StageInfo("N 4-F", 25, 4331, 2750, [月, 木], 日, UnitType.Ranged),
        new StageInfo("N 4-G", 26, 4551, 2870, [木, 金], 月, UnitType.Heavy),
        new StageInfo("N 4-H", 26, 4596, 2920, [水, 土], 火, UnitType.Melee),
        new StageInfo("H 4-1", 41, 7208, 4790, [金, 土], 月, UnitType.Ranged),
        new StageInfo("H 4-2", 41, 7278, 4840, [日, 土], 火, UnitType.Melee),
        new StageInfo("H 4-3", 41, 7297, 4740, [日, 火], 水, UnitType.Magic),
        new StageInfo("H 4-4", 41, 7439, 4750, [月, 金], 木, UnitType.Melee),
        new StageInfo("H 4-5", 42, 7678, 4830, [月, 火], 金, UnitType.Heavy),
        new StageInfo("H 4-A", 41, 7275, 4780, [火, 水], 土, UnitType.Ranged),
        new StageInfo("H 4-B", 41, 7268, 4900, [木, 金], 日, UnitType.Magic),
        new StageInfo("H 4-C", 41, 7328, 4830, [金, 土], 月, UnitType.Heavy),
        new StageInfo("H 4-D", 42, 7581, 4770, [水, 土], 火, UnitType.Magic),
        new StageInfo("H 4-E", 41, 7253, 4840, [日, 木], 水, UnitType.Melee),
        new StageInfo("H 4-F", 41, 7294, 4820, [日, 月], 木, UnitType.Ranged),
        new StageInfo("H 4-G", 41, 7367, 4710, [火, 水], 金, UnitType.Melee),
        new StageInfo("H 4-H", 42, 7607, 4810, [水, 木], 土, UnitType.Ranged),
        new StageInfo("N 5-1", 26, 4544, 3120, [日, 火], 金, UnitType.Ranged),
        new StageInfo("N 5-2", 26, 4646, 3130, [水, 金], 土, UnitType.Melee),
        new StageInfo("N 5-3", 27, 4779, 3150, [木, 土], 日, UnitType.Heavy),
        new StageInfo("N 5-4", 27, 4874, 3110, [水, 金], 月, UnitType.Magic),
        new StageInfo("N 5-5", 27, 4908, 3090, [木, 土], 火, UnitType.Ranged),
        new StageInfo("N 5-A", 26, 4499, 3040, [日, 火], 水, UnitType.Magic),
        new StageInfo("N 5-B", 27, 4808, 3140, [日, 月], 木, UnitType.Melee),
        new StageInfo("N 5-C", 27, 4899, 3130, [月, 火], 金, UnitType.Heavy),
        new StageInfo("N 5-D", 27, 4892, 3110, [水, 金], 土, UnitType.Ranged),
        new StageInfo("N 5-E", 26, 4552, 3130, [木, 土], 日, UnitType.Melee),
        new StageInfo("H 5-1", 42, 7641, 5300, [木, 土], 火, UnitType.Ranged),
        new StageInfo("H 5-2", 42, 7702, 5050, [日, 月], 水, UnitType.Heavy),
        new StageInfo("H 5-3", 42, 7783, 5110, [日, 月], 木, UnitType.Ranged),
        new StageInfo("H 5-4", 42, 7849, 5300, [火, 水], 金, UnitType.Melee),
        new StageInfo("H 5-5", 43, 8139, 5270, [水, 金], 土, UnitType.Heavy),
        new StageInfo("H 5-A", 42, 7658, 5300, [火, 木], 日, UnitType.Magic),
        new StageInfo("H 5-B", 42, 7809, 5200, [金, 土], 月, UnitType.Melee),
        new StageInfo("H 5-C", 42, 7786, 5000, [水, 土], 火, UnitType.Magic),
        new StageInfo("H 5-D", 43, 8106, 5330, [日, 木], 水, UnitType.Melee),
        new StageInfo("H 5-E", 42, 7666, 5060, [月, 金], 木, UnitType.Magic),
        new StageInfo("N 6-1", 27, 4842, 3190, [日, 水], 土, UnitType.Heavy),
        new StageInfo("N 6-2", 27, 4965, 3410, [木, 土], 日, UnitType.Melee),
        new StageInfo("N 6-3", 27, 5009, 3400, [火, 金], 月, UnitType.Magic),
        new StageInfo("N 6-4", 27, 5059, 3200, [月, 土], 火, UnitType.Magic),
        new StageInfo("N 6-5", 28, 5290, 3420, [日, 木], 水, UnitType.Ranged),
        new StageInfo("N 6-A", 27, 4915, 3270, [月, 金], 木, UnitType.Heavy),
        new StageInfo("N 6-B", 27, 4887, 3210, [日, 火], 金, UnitType.Melee),
        new StageInfo("N 6-C", 27, 5032, 3390, [月, 水], 土, UnitType.Ranged),
        new StageInfo("N 6-D", 28, 5190, 3550, [水, 木], 日, UnitType.Melee),
        new StageInfo("N 6-E", 27, 4935, 3430, [金, 土], 月, UnitType.Ranged),
        new StageInfo("N 6-EX1", 35, 7503, 4760, [日, 土], 火, UnitType.Ranged),
        new StageInfo("H 6-1", 43, 8008, 5370, [日, 木], 水, UnitType.Magic),
        new StageInfo("H 6-2", 43, 7999, 5390, [月, 水], 木, UnitType.Melee),
        new StageInfo("H 6-3", 43, 8025, 5330, [月, 火], 金, UnitType.Ranged),
        new StageInfo("H 6-4", 43, 8184, 5360, [日, 水], 土, UnitType.Heavy),
        new StageInfo("H 6-5", 44, 8354, 5500, [火, 木], 日, UnitType.Heavy),
        new StageInfo("H 6-A", 43, 7914, 5360, [金, 土], 月, UnitType.Ranged),
        new StageInfo("H 6-B", 43, 8048, 5390, [水, 土], 火, UnitType.Magic),
        new StageInfo("H 6-C", 43, 8104, 5370, [日, 木], 水, UnitType.Melee),
        new StageInfo("H 6-D", 44, 8294, 5470, [月, 金], 木, UnitType.Magic),
        new StageInfo("H 6-E", 43, 8046, 5350, [火, 土], 金, UnitType.Melee),
        new StageInfo("H 6-EX1", 55, 12067, 7710, [月, 水], 土, UnitType.Ranged),
        new StageInfo("N 7-1", 28, 5193, 3470, [月, 木], 日, UnitType.Ranged),
        new StageInfo("N 7-2", 28, 5301, 3460, [木, 金], 月, UnitType.Melee),
        new StageInfo("N 7-3", 28, 5392, 3540, [水, 土], 火, UnitType.Heavy),
        new StageInfo("N 7-4", 28, 5412, 3490, [日, 金], 水, UnitType.Magic),
        new StageInfo("N 7-5", 28, 5467, 3520, [月, 火], 木, UnitType.Melee),
        new StageInfo("N 7-A", 28, 5260, 3490, [日, 火], 金, UnitType.Heavy),
        new StageInfo("N 7-B", 28, 5324, 3520, [火, 水], 土, UnitType.Ranged),
        new StageInfo("N 7-C", 28, 5387, 3490, [月, 木], 日, UnitType.Magic),
        new StageInfo("N 7-D", 28, 5436, 3530, [火, 金], 月, UnitType.Ranged),
        new StageInfo("N 7-E", 28, 5297, 3510, [水, 土], 火, UnitType.Melee),
        new StageInfo("N 7-F", 28, 5310, 3550, [日, 土], 水, UnitType.Ranged),
        new StageInfo("N 7-EX1", 35, 7539, 4730, [月, 水], 木, UnitType.Heavy),
        new StageInfo("N 7-EX2", 35, 7535, 4740, [火, 土], 金, UnitType.Melee),
        new StageInfo("H 7-1", 44, 8541, 5710, [月, 金], 木, UnitType.Melee),
        new StageInfo("H 7-2", 44, 8599, 5700, [火, 土], 金, UnitType.Magic),
        new StageInfo("H 7-3", 44, 8596, 5720, [水, 金], 土, UnitType.Ranged),
        new StageInfo("H 7-4", 44, 8665, 5760, [水, 木], 日, UnitType.Melee),
        new StageInfo("H 7-5", 45, 8866, 5880, [木, 金], 月, UnitType.Magic),
        new StageInfo("H 7-A", 44, 8495, 5700, [金, 土], 火, UnitType.Heavy),
        new StageInfo("H 7-B", 44, 8555, 5750, [日, 土], 水, UnitType.Ranged),
        new StageInfo("H 7-C", 44, 8635, 5680, [月, 火], 木, UnitType.Heavy),
        new StageInfo("H 7-D", 45, 8915, 5870, [日, 火], 金, UnitType.Melee),
        new StageInfo("H 7-E", 44, 8569, 5740, [日, 水], 土, UnitType.Magic),
        new StageInfo("H 7-F", 44, 8580, 5730, [月, 木], 日, UnitType.Ranged),
        new StageInfo("H 7-EX1", 55, 12092, 7740, [月, 金], 月, UnitType.Melee),
        new StageInfo("H 7-EX2", 55, 12120, 7690, [火, 土], 火, UnitType.Ranged),
        new StageInfo("N 8-1", 28, 5593, 3630, [火, 金], 月, UnitType.Heavy),
        new StageInfo("N 8-2", 28, 5693, 3640, [月, 土], 火, UnitType.Magic),
        new StageInfo("N 8-3", 29, 5940, 3770, [日, 土], 水, UnitType.Ranged),
        new StageInfo("N 8-4", 29, 6073, 3780, [月, 水], 木, UnitType.Heavy),
        new StageInfo("N 8-5", 29, 6069, 3790, [月, 火], 金, UnitType.Melee),
        new StageInfo("N 8-A", 28, 5692, 3630, [火, 水], 土, UnitType.Ranged),
        new StageInfo("N 8-B", 29, 5980, 3810, [木, 金], 日, UnitType.Melee),
        new StageInfo("N 8-C", 29, 6007, 3780, [日, 金], 月, UnitType.Magic),
        new StageInfo("N 8-D", 29, 6098, 3720, [水, 土], 火, UnitType.Melee),
        new StageInfo("N 8-E", 28, 5705, 3590, [日, 木], 水, UnitType.Ranged),
        new StageInfo("N 8-EX1", 35, 7525, 4790, [月, 金], 木, UnitType.Ranged),
        new StageInfo("N 8-EX2", 35, 7531, 4770, [火, 木], 金, UnitType.Heavy),
        new StageInfo("N 8-EX3", 35, 7560, 0, [水, 金], undefined, UnitType.Magic),
        new StageInfo("N 8-6", 30, 6119, 3850, [], null, null),
        new StageInfo("H 8-1", 45, 9474, 6030, [火, 木], 金, UnitType.Magic),
        new StageInfo("H 8-2", 45, 9580, 6080, [水, 金], 土, UnitType.Ranged),
        new StageInfo("H 8-3", 45, 9577, 6110, [木, 土], 日, UnitType.Heavy),
        new StageInfo("H 8-4", 45, 9590, 6080, [日, 金], 月, UnitType.Melee),
        new StageInfo("H 8-5", 46, 9917, 6220, [金, 土], 火, UnitType.Magic),
        new StageInfo("H 8-A", 45, 9531, 6080, [日, 火], 水, UnitType.Ranged),
        new StageInfo("H 8-B", 45, 9520, 6090, [月, 水], 木, UnitType.Melee),
        new StageInfo("H 8-C", 45, 9583, 6060, [月, 火], 金, UnitType.Heavy),
        new StageInfo("H 8-D", 46, 9832, 6210, [月, 水], 土, UnitType.Magic),
        new StageInfo("H 8-E", 45, 9490, 6070, [木, 土], 日, UnitType.Melee),
        new StageInfo("H 8-EX1", 55, 12111, 7680, [木, 金], 月, UnitType.Ranged),
        new StageInfo("H 8-EX2", 55, 12134, 7700, [日, 土], 火, UnitType.Magic),
        new StageInfo("H 8-EX3", 55, 12155, 7760, [日, 金], 水, UnitType.Heavy),
        new StageInfo("H 8-6", 47, 10000, 6280, [日, 水], 土, UnitType.Heavy),
        new StageInfo("初級", 30, 4500, 2100, [無], 無, null, false, false),
        new StageInfo("中級", 40, 6200, 5600, [無], 無, null, false, false),
        new StageInfo("上級", 50, 8000, 9500, [無], 無, null, false, false),
        new StageInfo("まつり", 80, 13200, 16000, [無], 無, null, false, false),
        new StageInfo("ちまつり", 100, 17000, 21000, [無], 無, null, false, false),
    ];
}
function updateTable() {
    var separateEventStages = document.getElementById("separateEventStage").checked;
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
    if (separateEventStages) {
        separatedEventStageRecords = records.filter(function (item, index) { return item.stageInfo.isEventStage; });
    }
    records = records.filter(function (item, index) { return 0 < item.stageInfo.motivationConsumption; });
    if (!document.getElementById("includeExtraStage").checked) {
        records = records.filter(function (item, index) { return item.stageInfo.category != StageCategory.Extra; });
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
    var selectedDayOfWeek = getSelectedDayOfWeek();
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
            var bonudDaysCell = newRow.insertCell();
            bonudDaysCell.style.borderRightWidth = "0px";
            var scaleCell = newRow.insertCell();
            scaleCell.style.borderLeftWidth = "0px";
            scaleCell.style.paddingLeft = "0px";
            if (r.isSpecialExpBonusDay) {
                bonudDaysCell.innerText = "特";
                bonudDaysCell.classList.add("special_exp_bonus_day");
                scaleCell.innerText = "x1.3";
                scaleCell.classList.add("special_exp_bonus_day");
            }
            else {
                for (var _i = 0, _a = r.stageInfo.expBonusDays; _i < _a.length; _i++) {
                    var expBonusDay = _a[_i];
                    var dayOfWeekElement = document.createElement("span");
                    bonudDaysCell.appendChild(dayOfWeekElement);
                    dayOfWeekElement.innerText = getBonusDayLetter(expBonusDay);
                    if (expBonusDay == selectedDayOfWeek) {
                        dayOfWeekElement.classList.add("active_exp_bonus_day");
                    }
                    else {
                        dayOfWeekElement.classList.add("inactive_exp_bonus_day");
                    }
                }
                if (r.isExpBonusDay) {
                    scaleCell.innerHTML = "x1.3";
                    scaleCell.classList.add("active_exp_bonus_day");
                }
                else {
                    scaleCell.innerHTML = "";
                    scaleCell.classList.add("inactive_exp_bonus_day");
                }
            }
        }
        {
            var cell = newRow.insertCell();
            var unitTypeElement = document.createElement("span");
            cell.appendChild(unitTypeElement);
            unitTypeElement.innerText = getExpBonusUnitTypeLetter(r.stageInfo.expBonusUnitType);
            unitTypeElement.classList.add(getExpBonusUnitTypeClassName(r.stageInfo.expBonusUnitType));
            unitTypeElement.classList.add(r.isUnitTypeExpBonnusApplied ? "active_exp_bonus_unit_type" : "inactive_exp_bonus_unit_type");
            cell.innerHTML += r.isUnitTypeExpBonnusApplied ? " x1.3" : "";
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
            if (isFinite(r.finalExpPerMotivation)) {
                cell.innerText = r.finalExpPerMotivation.toFixed(2);
            }
            else {
                cell.innerText = "Infinity";
            }
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
                    if (isFinite(r.finalGoldPerMotivation)) {
                        cell.innerText = r.finalGoldPerMotivation.toFixed(2);
                    }
                    else {
                        cell.innerText = "Infinity";
                    }
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
                    var cell = (row.cells.item(i));
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
