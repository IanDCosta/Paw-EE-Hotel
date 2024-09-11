import { Customer } from "./customer";
import { GiftCard } from "./giftCard";
import { Room } from "./room";

export class Reservation{
    _id!:string;
    observations?:string;
    room!:Room;
    dateBegin!:Date;
    dateEnd!:Date;
    occupants!: Occupant[];
    customer!:Customer;
    giftCard?:GiftCard;
    dailyPrice!:number;
    state!:"Pending";

    constructor(room:Room, dateBegin:Date, dateEnd:Date, customer:Customer, dailyPrice:number){
        //this.code = code;
        this.room = room;
        this.dateBegin = dateBegin;
        this.dateEnd = dateEnd;
        this.occupants = [];
        this.customer;
        this.dailyPrice;
    }
}

export interface Occupant{
    name:string;
    age:number;
}

export enum State {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Paid = 'Paid',
    Cancelled = 'Cancelled'
  }