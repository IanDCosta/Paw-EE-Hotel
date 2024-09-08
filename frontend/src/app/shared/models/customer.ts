export class Customer {
  _id!: string;
  name!: string;
  email!: string;
  password!: string;
  contact!: string;
  address!:string;
  role!: 'Customer';
  state!: 'Active';
  
  constructor(email:string, password:string, name:string, contact:string, address:string) {
    //this._id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.contact = contact;
    this.address = address;
  }
}

export enum State {
  Active = 'Active',
  Inactive = 'Inactive',
}
