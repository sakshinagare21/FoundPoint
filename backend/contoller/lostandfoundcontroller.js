const lostandfounditem = require('../model/lostandfounditem');
const fs = require('fs');
const path = require('path');

// Get all items
exports.getAllitem = async (req, res) => {
  try {
    const data = await lostandfounditem.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};

// Get a single item by ID
exports.getSingleProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await lostandfounditem.findById(_id);
    if (!data) {
      return res.status(404).json({ message: "Items Not Found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};

// Get items by user email
exports.getUserItems = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const items = await lostandfounditem.find({ userEmail: email });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a new item
exports.addItem = async (req, res) => {
  try {
    const { Name, description, status, question, location, userEmail } = req.body;

    // Optional: check if user with that email exists
    const user = await require('../model/logsign').findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    const itemAdd = new lostandfounditem({
      Name,
      description,
      status,
      question,
      location,
      userEmail,
      images:req.file.filename
    });

    // Handle image upload
    
    await itemAdd.save();
    res.status(200).json({ message: "Lost or Found item added successfully", item: itemAdd });
  } catch (error) {
    res.status(400).json({ message: "Server Error", error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { _id } = req.params;
    const { Name, description, status, question, location } = req.body;

    // Check if the item exists in the database
    const existingItem = await lostandfounditem.findById(_id);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedData = { Name, description, status, question, location };

    // Helper function to delete old files
    const deleteOldFile = (filePath) => {
      if (!filePath) return;

      // Clean the file path (remove any leading slashes)
      const normalizedPath = path.resolve(__dirname, "..", "uploads", "documents", filePath);
      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath);
        console.log("Deleted:", normalizedPath);
      } else {
        console.log("File not found:", normalizedPath);
      }
    };

    // Handle image upload
    if (req.files && req.files["images"]) {
      // Delete old image if it exists
      if (existingItem.images) {
        deleteOldFile(existingItem.images);
      }

      // Add new single image
      updatedData.images = req.files["images"][0].filename;
    }

    // Log the updated data for debugging
    console.log("Updated data:", updatedData);

    // Update the item in the database
    const updatedItem = await lostandfounditem.findByIdAndUpdate(_id, updatedData, { new: true });

    // If no item was updated, log an error
    if (!updatedItem) {
      return res.status(500).json({ message: "Failed to update item" });
    }

    // Return the updated item details
    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error in updateItem:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { _id } = req.params;

    const deleteItem = await lostandfounditem.findByIdAndDelete(_id);
    if (!deleteItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const deleteOldFile = (filePath) => {
      if (!filePath) return;

      const normalizedPath = path.resolve(__dirname, "..", "uploads", "documents", filePath);
      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath);
        console.log("Deleted:", normalizedPath);
      } else {
        console.log("File not found:", normalizedPath);
      }
    };

    // Delete associated image
    if (deleteItem.images) {
      deleteOldFile(deleteItem.images);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all lost items
exports.getLostItems = async (req, res) => {
  try {
    const lostItems = await lostandfounditem.find({ status: "Lost" });
    res.status(200).json(lostItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all found items
exports.getFoundItems = async (req, res) => {
  try {
    const foundItems = await lostandfounditem.find({ status: "Found" });
    res.status(200).json(foundItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};