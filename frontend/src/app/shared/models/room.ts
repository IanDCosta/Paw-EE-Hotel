export class Room{
    _id!:string;
    roomNumber!:number;
    isVacant!: true;
    typology!:string;
    dailyPrice!:number;
    capacity!:number;
    photoName!:string | null | undefined;

    constructor(roomNumber:number, typology:string, dailyPrice:number, capacity:number, photoName:string | null | undefined){
        this.roomNumber = roomNumber;
        this.typology = typology;
        this.dailyPrice = dailyPrice;
        this.capacity = capacity;
        this.photoName = photoName;
    }
}