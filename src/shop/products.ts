import {moneyBuy} from "./products/moneyBuy";
import {litrbolBuy} from "./products/litrbolBuy";
import {weekendBuy} from "./products/weekendBuy";
import {termBuy} from "./products/termBuy";
import {unpunishBuy} from "./products/unpunishBuy";

class Products {
    public id: string;
    public price: any;
    public name: string;
    public func: (product, sender, price, event) => void;
    constructor(id, name, price, func) {
        this.id = id;
        this.name = name
        this.price = price
        this.func = func
    }
}

export const products: Products[] = [
    new Products("money-1", "5.000.000$", [35, 35, 35], moneyBuy),
    new Products("money-2", "10.000.000$", [55, 50, 50], moneyBuy),
    new Products("money-3", "20.000.000$", [110, 100, 100], moneyBuy),
    new Products("money-4", "40.000.000$", [220, 200, -1], moneyBuy),
    new Products("litrbol", "Рандомно количество основных баллов", [160, 140, -1], litrbolBuy),
    new Products("weekend", "2 выходных дня", [-1, 140, 70], weekendBuy),
    new Products("norm", "-3 часа к норме", [70, 60, -1], weekendBuy),
    new Products("term-1", "-1 день к сроку", [90, 100, -1], termBuy),
    new Products("term-2", "-2 дня к сроку", [160, -1, -1], termBuy),
    new Products("unwarns", "Снять предупреждения", [40, 40, 30], unpunishBuy),
    new Products("unvigs", "Снять выговор", [90, 100, 70], unpunishBuy),
]