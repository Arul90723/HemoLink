const Hospital = require('../models/Hospital');

exports.updateInventory = async (req, res, next) => {
  try {
    const { inventory } = req.body;
    
    const hospital = await Hospital.findOne({ userId: req.user.id });
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    hospital.inventory = { ...hospital.inventory, ...inventory };
    await hospital.save();

    res.status(200).json({ message: 'Inventory updated successfully', inventory: hospital.inventory });
  } catch (error) {
    next(error);
  }
};

exports.updateInventoryPublic = async (req, res, next) => {
  try {
    const { inventory } = req.body;
    // For demo, we update the first hospital in the system
    const hospital = await Hospital.findOne();
    if (!hospital) return res.status(404).json({ message: 'No hospital found' });

    hospital.inventory = { ...hospital.inventory, ...inventory };
    await hospital.save();

    res.status(200).json({ message: 'Inventory synced successfully', inventory: hospital.inventory });
  } catch (error) {
    next(error);
  }
};

exports.getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    next(error);
  }
};
