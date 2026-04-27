import Coupon from "../models/couponModel.js";
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js"


const getTickets = async (req, res) => {

    const myTickets = await Order.find({user: req.user._id}).populate('user').populate('event')

    if(!myTickets){
        res.status(404)
        throw new Error("Tickets Not Found!")
    }

    res.status(200).json(myTickets)

};

const getTicket = async (req, res) => {
console.log("USER ID:", req.user?._id) 
const myTicket = await Order.findById(req.params.tid).populate('user').populate('event')
 console.log("TICKETS:", myTickets) 

    if(!myTicket){
      console.log("NO TICKETS FOUND")
        res.status(404)
        throw new Error("Ticket Not Found!")
    }

    res.status(200).json(myTicket)
};

const bookTicket = async (req, res) => {
  const { numberOfSeats, couponCode } = req.body;

  let userId = req.user._id

    if(!numberOfSeats ){
        res.status(409)
        throw new Error("Kindly Select At least One Seat")
    }


  //Check if  event exists
  const eventId = req.params.eid;

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error("Event Not Found!");
  }

//   console.log(numberOfSeats);

  if (event.totalSeats < numberOfSeats || numberOfSeats > 5) {
      //Check if seats available
    res.status(409);
    throw new Error("Seats Not Available!");
  }

  //Check if user have already booked 5 seats : Todo//

  const allPreviousOrder = await Order.find({event : event._id})

  //Filter My Orders By Event
  const myOrders = allPreviousOrder.filter((order) => order.user.toString() == userId.toString())

  // Calculate Total Seats Booked

  let myExistingBookingSeats = myOrders
  .filter((order) => order.status != "cancelled")
  .reduce((acc, order) => acc + order.seats, 0)

 

  if( myExistingBookingSeats + parseInt(numberOfSeats) > 5 ){
    res.status(409)
    throw new Error(`Only 5 Seats Allowed Per User! ${5 - myExistingBookingSeats} Seats Available`)
  }

  //Check if request is coming with coupon
   let couponExists 
  if (couponCode) {
    //Check if coupon is valid
    couponExists = await Coupon.findOne({ couponCode });
    if (!couponExists){
        
        res.status(404);
        throw new Error("Coupon Not Exists");
    }
  }

  const totalBillAmount = couponCode ? (event.ticketPrice - (event.ticketPrice * couponExists.couponDiscount/100 )) * numberOfSeats : event.ticketPrice * numberOfSeats

  //Find User
   let user = await User.findById(userId)


  if(totalBillAmount > user.credits){
    res.status(409)
    throw new Error("Not Enough Credits!")
  }

  let order = await Order.create({
    user : req.user._id,
    event : eventId,
    seats : numberOfSeats,
    status : "confirmed",
    isDiscounted : couponCode ? true : false,
    billedAmount : totalBillAmount
  })


  // Decrease Available Seats
  let updatedSeats = event.totalSeats - numberOfSeats

  await Event.findByIdAndUpdate(event._id , {totalSeats : updatedSeats} , {new: true})

 // Decrease Credits
 
  await User.findByIdAndUpdate(userId,  {credits : user.credits - totalBillAmount} , {new : true})



  if(!order){
    res.status(409) 
    throw new Error("Order Not Accepted!")

  }

  res.status(201).json(order)



//   res.send("Ticket Booked")
};

const cancelTicket = async (req, res) => {
 let userId = req.user._id
  // Find Ticket
  const ticketId = req.params.tid
  
  let ticket = await Order.findById(ticketId)
  
  if(!ticket){
    res.status(404)
    throw new Error("Ticket Not Found!")
  }

  if(ticket.status == "cancelled"){
    res.status(400)
    throw new Error("Ticket Already Cancelled")
  }
  

  //Find User
   let user = await User.findById(userId)
   // Find Event 
   const event = await Event.findById(ticket.event)
   
   //Check Ticket Status
   if(ticket.status == "expired"){
     res.status(409)
     throw new Error("Ticket Already Expired")
    }
    
    
    
    
    // Increase Available Seats
    let updatedSeats = event.totalSeats + ticket.seats
    await Event.findByIdAndUpdate(event._id , {totalSeats : updatedSeats} , {new: true})
    

  // Increase Credits
 
  await User.findByIdAndUpdate(userId,  {credits : user.credits + ticket.billedAmount} , {new : true})



  const updatedTicket = await Order.findByIdAndUpdate(ticket._id, {status : "cancelled"})

  if(!updatedTicket){
    res.status(409)
    throw new Error("Ticket Not Cancelled")
  }

  res.status(200).json(updatedTicket)


  res.send("Ticket Cancelled");
};

const orderController = { bookTicket, cancelTicket, getTickets, getTicket };

export default orderController;
