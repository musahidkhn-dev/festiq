import Coupon from "../models/couponModel.js";
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const getAllUsers = async (req, res) => {
  const users = await User.find();

  if (!users) {
    res.status(404);
    throw new Error("Users Not Found!");
  }

  res.status(200).json(users);
};

const updateUser = async (req, res) => {

  let  {isActive, credits} = req.body
  
  const userId = req.params.uid;

  let user = await User.findById(userId)

  if(!user){
    res.status(404)
    throw new Error('User Not Found!')
  }

  let updatedUser

  if(credits){
    
   updatedUser = await User.findByIdAndUpdate(userId, {credits : user.credits + parseInt(credits)}, {
    new: true,
  });
  }else{
    
   updatedUser = await User.findByIdAndUpdate(userId, {isActive : isActive}, {
    new: true,
  });
  }




  if (!updatedUser) {
    res.status(409);
    throw new Error("User Not Updated");
  }

  res.status(200).json(updatedUser);
};

const getAllEvents = async (req, res) => {
  const events = await Event.find().populate(`user`);

  if (!events) {
    res.status(404);
    throw new Error("Events Not Found!");
  }

  res.status(200).json(events);
};

const updateEvents = async (req, res) => {
  const eventId = req.params.eid;

  const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
    new: true,
  }).populate("user");

  if (!updateEvents) {
    res.status(409);
    throw new Error("Event Not Updated");
  }

  res.status(200).json(updatedEvent);
};

const getAllRatings = (req, res) => {
  res.send("All Ratings!");
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find();

  if (!orders) {
    res.status(404);
    throw new Error("Order Not Found!");
  }

  res.status(200).json(orders);
};

const createCoupon = async (req, res) => {
  const { couponCode, couponDiscount } = req.body;

  if (!couponCode || !couponDiscount) {
    res.status(409);
    throw new Error("Please Fill All Details!");
  }

  // Check if coupon is already exist
  const couponExist = await Coupon.findOne({ couponCode });

  if (couponExist) {
    res.status(409);
    throw new Error("Coupon Already Exist!");
  }

  const newCoupon = await Coupon.create({ couponCode, couponDiscount });

  if (!newCoupon) {
    res.status(404);
    throw new Error("Coupon Not Found!");
  }

  res.status(200).json(newCoupon);
};
const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find();

  if (!coupons) {
    res.status(4040);
    throw new Error("Coupons Not Found!");
  }

  res.status(200).json(coupons);
};

const updateCoupon = async (req, res) => {
  const updatedCoupon = await Coupon.findByIdAndUpdate(
    req.params.cid,
    req.body,
    { new: true },
  );

  if (!updateCoupon) {
    res.status(409);
    throw new Error("Coupon Not Updated!");
  }

  res.status(200).json(updateCoupon);
};
const adminController = {
  getAllUsers,
  updateUser,
  getAllEvents,
  getAllOrders,
  getAllCoupons,
  getAllRatings,
  updateEvents,
  createCoupon,
  updateCoupon,
};

export default adminController;
