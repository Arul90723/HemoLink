/**
 * Matching Engine
 * Logic: Haversine formula to find distance between two coordinates in km.
 */

// Haversine formula
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

exports.findPotentialPeers = (sourceHospital, allHospitals, requestedBloodType, requestedUnits) => {
  const peers = allHospitals
    .filter(hospital => hospital._id.toString() !== sourceHospital._id.toString()) // Exclude self
    .filter(hospital => {
      // Check inventory
      const availableUnits = hospital.inventory[requestedBloodType];
      return availableUnits >= requestedUnits;
    })
    .map(hospital => {
      const distance = getDistanceFromLatLonInKm(
        sourceHospital.location.lat,
        sourceHospital.location.lng,
        hospital.location.lat,
        hospital.location.lng
      );
      return {
        hospital,
        distance
      };
    });

  // Sort by distance ascending
  return peers.sort((a, b) => a.distance - b.distance);
};
