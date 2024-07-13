import { Room } from "./Room";

export class Hotel{
    _id!: string;
    name!: string;
    address!: string;
    daylyPrice!: number;
    numberOfRooms!: number;
    rooms?: Room[];
    photoName!: string;
}