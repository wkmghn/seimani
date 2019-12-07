class CashableInfo {
    constructor(name, unitPrice) {
        this._name = name;
        this._unitPrice = unitPrice;
    }
    get itemName() { return this._name; }
    get imageUrl() { return "img/cashable-" + this._unitPrice + ".png"; }
    get unitPrice() { return this._unitPrice; }
    get numberBoxId() { return "num_" + this.unitPrice; }
    get sumTdId() { return "sum_" + this.unitPrice; }
}
const cashables = [
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
    let s = localStorage.getItem("num_cashable_" + cashable.unitPrice);
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
    let total = 0;
    for (let cashable of cashables) {
        let input = document.getElementById(cashable.numberBoxId);
        let num = parseInt(input.value);
        let sum = cashable.unitPrice * num;
        let td = document.getElementById(cashable.sumTdId);
        td.innerText = toCommaSeparatedString(sum);
        total += sum;
    }
    document.getElementById("total").innerText = toCommaSeparatedString(total);
}
function initializeSumCashable(ev) {
    let table = document.getElementById("main_table");
    let tBody = table.createTBody();
    tBody.id = "table_body";
    tBody.classList.add("stripe");
    for (let cashable of cashables) {
        let row = tBody.insertRow();
        {
            let td = document.createElement("td");
            row.appendChild(td);
            let img = document.createElement("img");
            td.appendChild(img);
            img.src = cashable.imageUrl;
            img.alt = cashable.itemName;
        }
        {
            let td = document.createElement("td");
            row.appendChild(td);
            td.innerText = toCommaSeparatedString(cashable.unitPrice);
            td.style.textAlign = "right";
        }
        {
            let td = document.createElement("td");
            row.appendChild(td);
            td.appendChild(document.createTextNode("x "));
            let input = document.createElement("input");
            td.appendChild(input);
            input.type = "text";
            input.name = "num";
            input.id = cashable.numberBoxId;
            input.value = loadNumCashable(cashable).toString();
            input.min = "0";
            input.max = "999";
            input.style.textAlign = "right";
            input.style.width = "3em";
            input.onchange = input.onkeyup = input.onmouseup = function (ev) {
                saveNumCashable(cashable, parseInt(input.value));
                updateSumCashable();
            };
            input.onwheel = function (ev) {
                if (0 < ev.deltaY) {
                    input.value = Math.max(parseInt(input.value) - 1, 0).toString();
                    ev.preventDefault();
                }
                else if (ev.deltaY < 0) {
                    input.value = Math.min(parseInt(input.value) + 1, 999).toString();
                    ev.preventDefault();
                }
                console.log(ev);
                saveNumCashable(cashable, parseInt(input.value));
                updateSumCashable();
            };
        }
        {
            let td = document.createElement("td");
            row.appendChild(td);
            td.id = cashable.sumTdId;
            td.style.textAlign = "right";
        }
    }
    {
        let row = tBody.insertRow();
        row.style.backgroundColor = "#C0E0FF";
        {
            let td = document.createElement("td");
            row.appendChild(td);
            td.innerText = "合計";
            td.colSpan = 3;
            td.style.textAlign = "right";
        }
        {
            let td = document.createElement("td");
            row.appendChild(td);
            td.id = "total";
            td.style.fontWeight = "bold";
            td.style.textAlign = "right";
        }
    }
    updateSumCashable();
}
window.onload = initializeSumCashable;
