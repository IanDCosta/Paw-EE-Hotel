import { Hotel } from "./app/shared/models/hotel";
import { Room } from "./app/shared/models/room";
import { Customer } from "./app/shared/models/customer";

export const sample_customers: Customer[] = [
    {
        _id: '01',
        name: "jose",
        email: "jose@email.com",
        password: "jose123",
        contact: "+351 123 456 789",
        address: "rua",
        role: "Customer",
        state: "Active"
    },
    {
        _id: '02',
        name: "andre",
        email: "andre@email.com",
        password: "andre123",
        contact: "+351 987 654 321",
        address: "rua",
        role: "Customer",
        state: "Active"
    }
]

export const sample_rooms: Room[] = [
    {
        _id: '01',
        roomNumber: 1,
        isVacant: true,
        typology: "big",
        dailyPrice: 10,
        capacity: 4,
        photoName: "assets/room1.jpg"
    },
    {
        _id: '02',
        roomNumber: 2,
        isVacant: true,
        typology: "medium",
        dailyPrice: 12,
        capacity: 3,
        photoName: "assets/room2.jpg"
    },
    {
        _id: '03',
        roomNumber: 3,
        isVacant: true,
        typology: "smaol",
        dailyPrice: 7,
        capacity: 2,
        photoName: "assets/room3.jpg"
    },
    {
        _id: '04',
        roomNumber: 4,
        isVacant: true,
        typology: "solo",
        dailyPrice: 5,
        capacity: 1,
        photoName: "assets/room4.jpg"
    },
    {
        _id: '05',
        roomNumber: 5,
        isVacant: true,
        typology: "luxury",
        dailyPrice: 20,
        capacity: 2,
        photoName: "assets/room2.jpg"
    }
    ]

export const sample_hotels: Hotel[] = [
{
    _id: '01',
    name: 'Pet Inn',
    address: "Rua Principal, 50",
    dailyPrice: 10,
    numberOfRooms: 5,
    photoName: "assets/hotel1.jpg"
},
{
    _id: '02',
    name: 'Recreio Canino',
    address: "Rua Secundaria, 60",
    dailyPrice: 12,
    numberOfRooms: 4,
    photoName: "assets/hotel2.jpg"
},
{
    _id: '03',
    name: 'Hotel Bom pra Cachorro',
    address: "Rua Secundaria, 60",
    dailyPrice: 12,
    numberOfRooms: 4,
    photoName: "assets/hotel3.jpg"
},
{
    _id: '04',
    name: 'Hotel Bichano',
    address: "Rua Secundaria, 60",
    dailyPrice: 12,
    numberOfRooms: 4,
    photoName: "assets/hotel2.jpg"
},
{
    _id: '05',
    name: 'Hotel Animal',
    address: "Rua Secundaria, 60",
    dailyPrice: 12,
    numberOfRooms: 4,
    photoName: "assets/hotel2.jpg"
},
{
    _id: '06',
    name: 'Hotel Macaquices',
    address: "Rua Secundaria, 60",
    dailyPrice: 12,
    numberOfRooms: 4,
    photoName: "assets/hotel2.jpg"
},
]