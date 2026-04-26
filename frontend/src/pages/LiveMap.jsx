import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const center = {
  lat: 10.7867, // Centered on Palakkad
  lng: 76.6548
};

const LiveMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB1JkeQ23w-eDptqcRH81WsHc_5XzgqF-M"
  });

  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get('/api/hospitals');
        const formattedHospitals = res.data.map(h => ({
          id: h._id,
          name: h.name,
          position: { lat: h.location.lat, lng: h.location.lng },
          status: 'NORMAL',
          inventory: h.inventory
        }));
        setHospitals(formattedHospitals);
      } catch (err) {
        console.error('Error fetching hospitals for map:', err);
      }
    };
    fetchHospitals();
  }, []);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    if (hospitals.length > 0) {
      hospitals.forEach(h => bounds.extend(h.position));
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [hospitals]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return <div className="p-8 text-center text-red-600 font-bold">Error loading Google Maps. Please check your API Key and Billing settings in GCP.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Live Blood Map</h1>
          <p className="text-gray-500">Real-time view of hospital network and critical requests.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span> Critical</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Urgent</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Normal</div>
        </div>
      </div>

      <div className="card flex-1 p-2 overflow-hidden shadow-lg border-gray-200 relative min-h-[500px]">
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 font-medium">Initializing Satellite Network...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
              ],
              disableDefaultUI: false,
              clickableIcons: true
            }}
          >
            {hospitals.map(hospital => (
              <Marker
                key={hospital.id}
                position={hospital.position}
                onClick={() => setSelectedHospital(hospital)}
                title={hospital.name}
              />
            ))}

            {selectedHospital && (
              <InfoWindow
                position={selectedHospital.position}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div className="p-4 min-w-[200px] font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                      <Droplets size={16} />
                    </div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight">{selectedHospital.name}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Network Status</span>
                      <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Emergency Load</span>
                      <span className="text-slate-900 uppercase tracking-widest">NORMAL</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mb-4">
                    {Object.entries(selectedHospital.inventory || {}).slice(0, 4).map(([type, count]) => (
                      <div key={type} className="bg-slate-50 border border-slate-100 p-1 rounded-md text-center">
                        <div className="text-[10px] font-black text-slate-900">{type}</div>
                        <div className="text-[8px] font-bold text-slate-400">{count}U</div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => alert('Opening peer communication...')}
                    className="w-full bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors"
                  >
                    CONTACT FACILITY
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default LiveMap;
