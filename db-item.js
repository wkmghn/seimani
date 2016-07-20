"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (ItemCategory) {
    ItemCategory[ItemCategory["Senkyo"] = 0] = "Senkyo";
    ItemCategory[ItemCategory["Present"] = 1] = "Present";
    ItemCategory[ItemCategory["Special"] = 2] = "Special";
    ItemCategory[ItemCategory["Cashable"] = 3] = "Cashable";
})(exports.ItemCategory || (exports.ItemCategory = {}));
var ItemCategory = exports.ItemCategory;
var ItemInfo = (function () {
    function ItemInfo(category, rarity, name, id) {
        this._category = category;
        this._name = name;
        this._id = id;
    }
    Object.defineProperty(ItemInfo.prototype, "category", {
        get: function () { return this._category; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemInfo.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemInfo.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    return ItemInfo;
}());
exports.ItemInfo = ItemInfo;
var PresentItemInfo = (function (_super) {
    __extends(PresentItemInfo, _super);
    function PresentItemInfo() {
        _super.apply(this, arguments);
    }
    return PresentItemInfo;
}(ItemInfo));
exports.PresentItemInfo = PresentItemInfo;
var ItemDB;
(function (ItemDB) {
    var table = [
        new ItemInfo(ItemCategory.Senkyo, 1, "ライフアップ", ""),
        new ItemInfo(ItemCategory.Senkyo, 2, "初期マナアップ", ""),
        new ItemInfo(ItemCategory.Senkyo, 3, "ゴールドブースト", ""),
        new ItemInfo(ItemCategory.Senkyo, 4, "EXPブースト", ""),
        new ItemInfo(ItemCategory.Present, 3, "ひな鳥", ""),
        new ItemInfo(ItemCategory.Present, 3, "達磨", ""),
        new ItemInfo(ItemCategory.Present, 3, "囲碁一式", ""),
        new ItemInfo(ItemCategory.Present, 3, "撞球一式", ""),
        new ItemInfo(ItemCategory.Present, 3, "ぬいぐるみ", ""),
        new ItemInfo(ItemCategory.Present, 3, "貯金箱", ""),
        new ItemInfo(ItemCategory.Present, 2, "嵌め絵", ""),
        new ItemInfo(ItemCategory.Present, 2, "こけし", ""),
        new ItemInfo(ItemCategory.Present, 2, "紙風船", ""),
        new ItemInfo(ItemCategory.Present, 3, "書の掛け軸", ""),
        new ItemInfo(ItemCategory.Present, 3, "包丁一式", ""),
        new ItemInfo(ItemCategory.Present, 3, "文学の書", ""),
        new ItemInfo(ItemCategory.Present, 3, "総理のお礼状", ""),
        new ItemInfo(ItemCategory.Present, 3, "絵画", ""),
        new ItemInfo(ItemCategory.Present, 3, "三味線", ""),
        new ItemInfo(ItemCategory.Present, 2, "万年筆", ""),
        new ItemInfo(ItemCategory.Present, 3, "魔導の書", ""),
        new ItemInfo(ItemCategory.Present, 2, "枕", ""),
        new ItemInfo(ItemCategory.Present, 3, "音楽の書", ""),
        new ItemInfo(ItemCategory.Present, 2, "仙人掌", ""),
        new ItemInfo(ItemCategory.Present, 2, "湖底の主", ""),
        new ItemInfo(ItemCategory.Present, 3, "薔薇の花束", ""),
        new ItemInfo(ItemCategory.Present, 3, "花飾り", ""),
        new ItemInfo(ItemCategory.Present, 3, "硝子の靴", ""),
        new ItemInfo(ItemCategory.Present, 3, "指輪", ""),
        new ItemInfo(ItemCategory.Present, 3, "摸擬刀", ""),
        new ItemInfo(ItemCategory.Present, 2, "水晶玉", ""),
        new ItemInfo(ItemCategory.Present, 3, "扇子", ""),
        new ItemInfo(ItemCategory.Present, 3, "宝石", ""),
        new ItemInfo(ItemCategory.Present, 2, "貝殻", ""),
        new ItemInfo(ItemCategory.Present, 3, "ナイカクの羽根", ""),
        new ItemInfo(ItemCategory.Present, 2, "気合の鉢巻き", ""),
        new ItemInfo(ItemCategory.Present, 2, "幸せの四つ葉", ""),
        new ItemInfo(ItemCategory.Present, 3, "河に住む豚", ""),
        new ItemInfo(ItemCategory.Present, 3, "勝利のどんぶり", ""),
        new ItemInfo(ItemCategory.Present, 3, "宝の実", ""),
        new ItemInfo(ItemCategory.Present, 3, "炙り肉", ""),
        new ItemInfo(ItemCategory.Present, 3, "糖蜜の菓子", ""),
        new ItemInfo(ItemCategory.Present, 3, "焼き鳥", ""),
        new ItemInfo(ItemCategory.Present, 3, "滋養強壮のお重", ""),
        new ItemInfo(ItemCategory.Present, 3, "握り飯", ""),
        new ItemInfo(ItemCategory.Present, 3, "氷の菓子", ""),
        new ItemInfo(ItemCategory.Present, 3, "焼き魚", ""),
        new ItemInfo(ItemCategory.Present, 2, "松茸", ""),
        new ItemInfo(ItemCategory.Present, 3, "記念日の菓子", ""),
        new ItemInfo(ItemCategory.Present, 3, "片想いの菓子", ""),
        new ItemInfo(ItemCategory.Present, 2, "お寿司", ""),
        new ItemInfo(ItemCategory.Present, 2, "お茶", ""),
        new ItemInfo(ItemCategory.Present, 2, "お餅", ""),
        new ItemInfo(ItemCategory.Present, 2, "蜂蜜", ""),
        new ItemInfo(ItemCategory.Present, 3, "咖喱", ""),
        new ItemInfo(ItemCategory.Present, 2, "沢庵", ""),
        new ItemInfo(ItemCategory.Present, 2, "純米水「八解散」", ""),
        new ItemInfo(ItemCategory.Present, 2, "純米水「脱債」", ""),
        new ItemInfo(ItemCategory.Present, 3, "純米水「船中九策」", ""),
        new ItemInfo(ItemCategory.Present, 5, "特別純米水「圉権」", ""),
        new ItemInfo(ItemCategory.Present, 4, "特別純米水「新攻」", ""),
        new ItemInfo(ItemCategory.Present, 1, "たわし", ""),
        new ItemInfo(ItemCategory.Special, 8, "制服コスチューム", ""),
        new ItemInfo(ItemCategory.Cashable, 3, "山吹色の菓子", ""),
        new ItemInfo(ItemCategory.Cashable, 0, "大きな福の菓子", ""),
        new ItemInfo(ItemCategory.Cashable, 0, "落下の実", ""),
        new ItemInfo(ItemCategory.Cashable, 0, "月の菓子", ""),
        new ItemInfo(ItemCategory.Cashable, 0, "最中の菓子", ""),
        new ItemInfo(ItemCategory.Cashable, 0, "弾丸", ""),
        new ItemInfo(ItemCategory.Cashable, 0, "社交場の入場券", ""),
    ];
})(ItemDB || (ItemDB = {}));
