const Request = require('../models/Request');
const Hospital = require('../models/Hospital');
const { sortRequestsByPriority } = require('../services/priorityEngine');
const { findPotentialPeers } = require('../services/matchingEngine');

exports.createRequest = async (req, res, next) => {
  try {
    const { bloodType, units, urgency } = req.body;
    
    // Validate requester is a hospital
    const hospital = await Hospital.findOne({ userId: req.user.id });
    if (!hospital) return res.status(404).json({ message: 'Hospital profile not found for user' });

    const newRequest = new Request({
      requesterId: hospital._id,
      bloodType,
      units,
      urgency,
      status: 'OPEN'
    });

    await newRequest.save();

    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    next(error);
  }
};

exports.getPrioritizedRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ status: 'OPEN' }).populate('requesterId', 'name location');
    const sortedRequests = sortRequestsByPriority(requests);
    res.status(200).json(sortedRequests);
  } catch (error) {
    next(error);
  }
};

exports.matchRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate('requesterId');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const allHospitals = await Hospital.find();
    
    const potentialPeers = findPotentialPeers(
      request.requesterId, 
      allHospitals, 
      request.bloodType, 
      request.units
    );

    res.status(200).json({ request, potentialPeers });
  } catch (error) {
    next(error);
  }
};
