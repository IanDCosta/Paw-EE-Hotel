export class GiftCard {
    _id!: string;
    description!: string;
    discount!: number;

    constructor(description: string, discount: number){
        this.description = description;
        this.discount = discount;
    }
}