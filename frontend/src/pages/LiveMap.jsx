import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Droplets, MapPin, Activity, Phone, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '75vh'
};

const center = {
  lat: 10.7867, // Palakkad, Kerala
  lng: 76.6548
};

const LiveMap = () => {
  const navigate = useNavigate();
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
          contact: h.contact || "0471-223344",
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
    if (hospitals.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      hospitals.forEach(h => bounds.extend(h.position));
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [hospitals]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 rounded-[3rem] p-12 border-2 border-red-100 mx-4">
       <Activity size={64} className="text-primary mb-6" />
       <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase">Satellite Link Failure</h2>
       <p className="text-slate-500 font-bold text-center max-w-md">The Google Maps API key provided is restricted or billing is not enabled. Please verify your GCP configuration.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform">
             <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <MapPin size={32} className="text-primary" /> Live Network Map
          </h1>
          <p className="text-slate-400 text-sm font-bold mt-2">REAL-TIME SATELLITE COORDINATION ACROSS REGIONAL FACILITIES</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex gap-6">
           <div className="flex items-center gap-2 font-black text-[10px] text-slate-500 uppercase tracking-widest">
             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]"></span> Active Nodes: {hospitals.length}
           </div>
           <div className="flex items-center gap-2 font-black text-[10px] text-slate-500 uppercase tracking-widest border-l border-slate-100 pl-6">
             <Shield size={18} className="text-primary" /> Network Secure
           </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative group">
        {!isLoaded ? (
          <div className="w-full h-[75vh] flex flex-col items-center justify-center bg-slate-50">
             <div className="w-16 h-16 border-4 border-red-100 border-t-primary rounded-full animate-spin mb-6"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Establishing Orbital Link...</p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
                { featureType: "all", elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] }
              ],
              disableDefaultUI: false,
              clickableIcons: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false
            }}
          >
            {hospitals.map(h => (
              <Marker
                key={h.id}
                position={h.position}
                onClick={() => setSelectedHospital(h)}
                icon={{
                  url: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            ))}

            {selectedHospital && (
              <InfoWindow
                position={selectedHospital.position}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div className="p-5 min-w-[280px] bg-white rounded-3xl font-sans">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-none">{selectedHospital.name}</h3>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mt-1">Verified Node</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Contact</span>
                        <span className="text-[10px] font-black text-slate-900 flex items-center gap-1"><Phone size={12}/> {selectedHospital.contact}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mb-6">
                    {Object.entries(selectedHospital.inventory || {}).map(([type, count]) => (
                      <div key={type} className="bg-white border-2 border-slate-100 p-2 rounded-xl text-center group-hover:border-primary transition-all">
                        <div className="text-[10px] font-black text-slate-900">{type}</div>
                        <div className={`text-[8px] font-black ${count < 5 ? 'text-primary' : 'text-slate-400'}`}>{count}U</div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => alert('Coordinating emergency transfer...')}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl active:scale-95"
                  >
                    ESTABLISH TRANSFER
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-tight">Active Transfers</h4>
            <div className="text-4xl font-black text-primary">12</div>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Emergency routing in progress</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-tight">Total Units Saved</h4>
            <div className="text-4xl font-black text-slate-900">842</div>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Verified network impact</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-tight">Response Avg</h4>
            <div className="text-4xl font-black text-green-500">14m</div>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Optimization successful</p>
         </div>
      </div>
    </div>
  );
};

export default LiveMap;
