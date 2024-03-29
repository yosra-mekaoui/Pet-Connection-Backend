const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upgrade = require("../models/upgrade");
const user = require("../models/user");

const app = express();
const upload = multer({ dest: "public/upgrades/" });

 

const upgradeUser = (req, res) => {
 
    // ======== VERIFICATION FILE ===================================

     const file = req.files["file"][0];
    if (!file) {
        return res.status(400).json({ error: "Please select a file 1" });
    }
    const oldPath = path.join(__dirname, "..", file.path);
    const extension = path.extname(file.originalname);
    const newPath = path.join(
    __dirname,
    "..",
    "public",
    "upgrades",
    `${req.body.user}${file.filename}`
    );

    // Rename the file to its original name with extension
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload the file" });
      }
    })
        
      
      // ======== LOGO ===================================

    const logo = req.files["logo"][0];
    if (!logo) {
        return res.status(400).json({ error: "Please select a file2" });
    }
    const oldPath2 = path.join(__dirname, "..", logo.path);
    const extension2 = path.extname(logo.originalname);
    const newPath2 = path.join(
    __dirname,
    "..",
    "public",
    "associations",
    `${req.body.user}${logo.filename}`
    );

    // Rename the file to its original name with extension
    fs.rename(oldPath2, newPath2, (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload the file" });
    }
      
      
      
      
      
        
        const { name, user, type, latitude, longitude, bio } = req.body;
        Upgrade.create({
          name: name,
          user: user,
          file: `${req.body.user}${file.filename}`,
          logo: `${req.body.user}${logo.filename}`,
          type: type,
          latitude: latitude,
          longitude: longitude,
          bio : bio
        }).then((upgrade) => {
          res.send(upgrade);
        });
    
    });
};


const getAllUpgrades = (req, res) => {
    try {
      Upgrade.find({}).then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
    } 
}



const deleteUpgrade = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const upgrade = await Upgrade.findById(id);
    if (!upgrade) {
      return res.status(404).json({ message: "Upgrade not found." });
    }

    // Delete user
    await Upgrade.findByIdAndRemove(id);

    res.json({ message: "Upgrade deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const changeType = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const us = await user.findById(id);
    if (!us) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete user
    await us.update({
      role: req.body.type,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      bio: req.body.bio,
      association : req.body.association
    });

    res.json({ message: "User upgraded to " + req.body.type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllAssociations = async (req, res) => {
  try {
    user.find({role : "Association"}).then((result) => {
      res.send(result);
    });   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  upgradeUser,
  getAllUpgrades,
  deleteUpgrade,
  changeType,
  getAllAssociations,
}; 