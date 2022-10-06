import {eventHelp} from "./eventHelp";
import {eventForumAccept, eventForumDecline} from "./eventForum";
import {eventShop, eventShopBuy} from "./eventShop";

export class Event {
    public access: number;
    public name: string;
    public func: (msg, args, sender: any) => void;

    constructor(name, access, func) {
        this.name = name
        this.access = access
        this.func = func
    }
}

export const events: Event[] = [
    new Event("help", 0, eventHelp),
    new Event("faccept", 5, eventForumAccept),
    new Event("fdecline", 5, eventForumDecline),
    new Event("shop", 1, eventShop),
    new Event("buy", 1, eventShopBuy),
]

