var CashableInfo = (function () {
    function CashableInfo(name, unitPrice) {
        this._name = name;
        this._unitPrice = unitPrice;
    }
    Object.defineProperty(CashableInfo.prototype, "itemName", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CashableInfo.prototype, "imageUrl", {
        get: function () { return "img/cashable-" + this._unitPrice + ".png"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CashableInfo.prototype, "unitPrice", {
        get: function () { return this._unitPrice; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CashableInfo.prototype, "numberBoxId", {
        get: function () { return "num_" + this.unitPrice; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CashableInfo.prototype, "sumTdId", {
        get: function () { return "sum_" + this.unitPrice; },
        enumerable: true,
        configurable: true
    });
    return CashableInfo;
}());
var cashables = [
    new CashableInfo("大きな福の菓子", 300),
    new CashableInfo("落下の実", 500),
    new CashableInfo("月の菓子", 1000),
    new CashableInfo("最中の菓子", 2000),
    new CashableInfo("山吹色の菓子", 5000),
    new CashableInfo("弾丸", 8000),
    new CashableInfo("社交場の入場券", 20000),
    new CashableInfo("インサイダー", 40000),
];
function toCommaSeparatedString(n) {
    return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
function loadNumCashable(cashable) {
    if (!localStorage) {
        return;
    }
    var s = localStorage.getItem("num_cashable_" + cashable.unitPrice);
    if (!s) {
        return 0;
    }
    return parseInt(s);
}
function saveNumCashable(cashable, value) {
    if (!localStorage) {
        return;
    }
    localStorage.setItem("num_cashable_" + cashable.unitPrice, value.toString());
}
function updateSumCashable() {
    var total = 0;
    for (var _i = 0, cashables_1 = cashables; _i < cashables_1.length; _i++) {
        var cashable = cashables_1[_i];
        var input = document.getElementById(cashable.numberBoxId);
        var num = parseInt(input.value);
        var sum = cashable.unitPrice * num;
        var td = document.getElementById(cashable.sumTdId);
        td.innerText = toCommaSeparatedString(sum);
        total += sum;
    }
    document.getElementById("total").innerText = toCommaSeparatedString(total);
}
function initializeSumCashable(ev) {
    var table = document.getElementById("main_table");
    var tBody = table.createTBody();
    tBody.id = "table_body";
    tBody.classList.add("stripe");
    var _loop_1 = function(cashable) {
        var row = tBody.insertRow();
        {
            var td = document.createElement("td");
            row.appendChild(td);
            var img = document.createElement("img");
            td.appendChild(img);
            img.src = cashable.imageUrl;
            img.alt = cashable.itemName;
        }
        {
            var td = document.createElement("td");
            row.appendChild(td);
            td.innerText = toCommaSeparatedString(cashable.unitPrice);
            td.style.textAlign = "right";
        }
        {
            var td = document.createElement("td");
            row.appendChild(td);
            td.appendChild(document.createTextNode("x "));
            var input_1 = document.createElement("input");
            td.appendChild(input_1);
            input_1.type = "text";
            input_1.name = "num";
            input_1.id = cashable.numberBoxId;
            input_1.value = loadNumCashable(cashable).toString();
            input_1.min = "0";
            input_1.max = "999";
            input_1.style.textAlign = "right";
            input_1.style.width = "3em";
            input_1.onchange = input_1.onkeyup = input_1.onmouseup = function (ev) {
                saveNumCashable(cashable, parseInt(input_1.value));
                updateSumCashable();
            };
            input_1.onwheel = function (ev) {
                if (0 < ev.deltaY) {
                    input_1.value = Math.max(parseInt(input_1.value) - 1, 0).toString();
                    ev.preventDefault();
                }
                else if (ev.deltaY < 0) {
                    input_1.value = Math.min(parseInt(input_1.value) + 1, 999).toString();
                    ev.preventDefault();
                }
                console.log(ev);
                saveNumCashable(cashable, parseInt(input_1.value));
                updateSumCashable();
            };
        }
        {
            var td = document.createElement("td");
            row.appendChild(td);
            td.id = cashable.sumTdId;
            td.style.textAlign = "right";
        }
    };
    for (var _i = 0, cashables_2 = cashables; _i < cashables_2.length; _i++) {
        var cashable = cashables_2[_i];
        _loop_1(cashable);
    }
    {
        var row = tBody.insertRow();
        row.style.backgroundColor = "#C0E0FF";
        {
            var td = document.createElement("td");
            row.appendChild(td);
            td.innerText = "合計";
            td.colSpan = 3;
            td.style.textAlign = "right";
        }
        {
            var td = document.createElement("td");
            row.appendChild(td);
            td.id = "total";
            td.style.fontWeight = "bold";
            td.style.textAlign = "right";
        }
    }
    updateSumCashable();
}
window.onload = initializeSumCashable;
