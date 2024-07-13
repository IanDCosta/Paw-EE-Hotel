import { Hotel } from "./Hotel";

export class Room{
    _id!: string;
    roomNumber!: string;
    isVacant!: boolean;
    hotel!: Hotel;
}