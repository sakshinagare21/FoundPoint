const express = require('express');
const route = express.Router();
const lostAndFoundController = require('../contoller/lostandfoundcontroller');
const upload = require('../config/uploads');

route.post(
  "/add",
  upload.single('images'),
  lostAndFoundController.addItem
);

route.get('/all', lostAndFoundController.getAllitem);

route.get('/getsingle/:_id', lostAndFoundController.getSingleProduct);
route.get('/user/:email', lostAndFoundController.getUserItems);
route.put(
  '/update/:_id',
 upload.single('images'),
  lostAndFoundController.updateItem
);

route.delete('/delete/:_id', lostAndFoundController.deleteItem);

// ✅ New routes for filtering by status
route.get('/lost', lostAndFoundController.getLostItems);
route.get('/found', lostAndFoundController.getFoundItems);

module.exports = route;
