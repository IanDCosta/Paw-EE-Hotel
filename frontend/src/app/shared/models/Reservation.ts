import { Customer } from "./Customer";
import { Hotel } from "./Hotel";
import { Pet } from "./Pet";
import { Room } from "./Room";

export interface Location{
    hotel: Hotel;
    room: Room;
}

export class Reservation{
    _id!: string;
    code!: string;
    location?: Location;
    dateBegin!: Date;
    dateEnd!: Date;
    pet!: Pet;
    customer!: Customer;
    dailyPrice?: Number;
    state!: State;
}

export enum State{
    Pending = "Pending",
    Confirmed = "Confirmed",
    Paid = "Paid",
    Cancelled = "Cancelled"
}