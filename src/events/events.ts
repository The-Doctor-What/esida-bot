import {eventShop, eventShopBuy} from "./shopEvent";
import {eventHelp} from "./helpEvent";
import {eventForumAccept, eventForumDecline} from "./forumEvent";
import {deleteEventAccept, deleteEventDecline} from "./deleteEvent";

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
    new Event("shop", 2, eventShop),
    new Event("buy", 2, eventShopBuy),
    new Event("deleteaccept", 666, deleteEventAccept),
    new Event("deletedecline", 666, deleteEventDecline),
]