import { Customer } from "./Customer";

export class Pet{
    _id!: string;
    name!: string;
    category!: string;
    race?: string;
    specialCare?: string;
    owner!: Customer;
    photoName!: string;
    vaccines?: string;
}