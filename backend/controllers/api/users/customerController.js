const Customer = require('../../../models/customer')
const bcrypt = require('bcrypt');

var customerController = {}

customerController.getAllCustomers = async (req,res,next) =>{
    try {
        const customers = await Customer.find().exec();
        res.status(200).json(customers);
    } catch (error) {
        return res.status(500).json({error: "Could not retrieve customers."}) // Pass the error to the error handling middleware
    }
}

customerController.createCustomer = async (req,res,next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        await customer.save()
        res.status(200).json(customer);
        
    } catch(error) {
        return res.status(500).json({error: "Something wrong happened."})
    }

}

customerController.updateCustomer = async (req,res,next) => {
  
  try {
   const customer = await Customer.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email
    })

    await customer.save()
    res.json(customer)
  } catch(error) {
    next(error)
  }
}

customerController.deleteCustomer = async(req,res,next) => {

    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            // If the customer with the provided ID is not found
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        res.status(200).send(); // Send a success response with no content
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}

customerController.findCustomer = async(req,res,next) =>{
    try {
        const customer = await Customer.findById(req.params.id);

        if(!customer){
            return res.status(404).json({error: "Customer not found"});
        }
        res.status(200).json(customer);

    }catch(error){
        next(error)
    }
}

module.exports = customerController