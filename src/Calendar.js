import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'leaflet/dist/leaflet.css';
import './Calendar.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const dashboardData = [
  { year: '2019', users: 1200, sales: 3000, revenue: 15000, profit: 3000 },
  { year: '2020', users: 1600, sales: 3500, revenue: 18000, profit: 4000 },
  { year: '2021', users: 2000, sales: 4000, revenue: 22000, profit: 5500 },
  { year: '2022', users: 2600, sales: 4800, revenue: 27000, profit: 7000 },
  { year: '2023', users: 3100, sales: 5600, revenue: 32000, profit: 8800 },
  { year: '2024', users: 3800, sales: 6300, revenue: 39000, profit: 11000 },
];


let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const activities = [
  { img: 'https://randomuser.me/api/portraits/women/1.jpg', name: 'User 1', desc: 'Liked something', time: '10:00 AM', status: 'like' },
  { img: 'https://randomuser.me/api/portraits/men/2.jpg', name: 'User 2', desc: 'Commented on a post', time: '10:30 AM', status: 'comment' },
  { img: 'https://randomuser.me/api/portraits/women/3.jpg', name: 'User 3', desc: 'Completed task', time: '11:00 AM', status: 'checked' },
  { img: 'https://randomuser.me/api/portraits/men/4.jpg', name: 'User 4', desc: 'Disliked content', time: '11:30 AM', status: 'dislike' },
];

const stats = [
  { browser: 'Chrome', percent: '45%', up: true },
  { browser: 'Firefox', percent: '25%', up: false },
  { browser: 'Safari', percent: '15%', up: true },
  { browser: 'Edge', percent: '10%', up: false },
  { browser: 'Others', percent: '5%', up: true },
];

const yearWiseData = [
  { year: '2019', users: 1200, sales: 2000 },
  { year: '2020', users: 1500, sales: 2500 },
  { year: '2021', users: 1800, sales: 3000 },
  { year: '2022', users: 2200, sales: 3500 },
  { year: '2023', users: 2700, sales: 4000 },
  { year: '2024', users: 3200, sales: 4800 },
];

export default function DashboardLayout() {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState({ lat: null, lng: null, error: null });
  const [showPermissionPopup, setShowPermissionPopup] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation({
            lat: null,
            lng: null,
            error: error.message,
          });
        }
      );
    } else {
      setLocation({
        lat: null,
        lng: null,
        error: 'Geolocation is not supported by this browser.',
      });
    }
  }, []);

  const requestLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
          });
          setShowPermissionPopup(false);
          setLoadingLocation(false);
        },
        (error) => {
          setLocation({
            lat: null,
            lng: null,
            error: error.message,
          });
          setShowPermissionPopup(false);
          setLoadingLocation(false);
        }
      );
    } else {
      setLocation({
        lat: null,
        lng: null,
        error: 'Geolocation is not supported by this browser.',
      });
      setShowPermissionPopup(false);
      setLoadingLocation(false);
    }
  };

  const denyLocation = () => {
    setLocation({ lat: null, lng: null, error: 'Location access denied by user.' });
    setShowPermissionPopup(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-card calendar-card">
          <Calendar value={date} onChange={setDate} />
        </div>

        <div className="dashboard-card activity-card">
          {activities.map((act, idx) => (
            <div key={idx} className="activity-item">
              <span className={`icon ${act.status}`}></span>
              <img src={act.img} className="avatar" alt="user" />
              <div>
                <strong>{act.name}</strong>
                <p className="desc">{act.desc}</p>
                <small className="time">{act.time}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card stats-card">
          <h5>Browser Stats</h5>
          {stats.map((s, idx) => (
            <div key={idx} className="stat-item">
              <span>{s.browser}</span>
              <span className={s.up ? 'text-up' : 'text-down'}>
                {s.percent} {s.up ? '↑' : '↓'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="map-fullwidth-container">
        <h5>Indian Office Locations</h5>
        <MapContainer
          center={[21.146633, 79.08886]}
          zoom={5}
          scrollWheelZoom={false}
          className="custom-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {[
            { name: 'Hyderabad', position: [17.385044, 78.486671] },
            { name: 'Mumbai', position: [19.07609, 72.877426] },
            { name: 'Delhi', position: [28.613939, 77.209023] },
            { name: 'Bangalore', position: [12.971599, 77.594566] },
            { name: 'Kolkata', position: [22.572645, 88.363892] },
          ].map((loc, idx) => (
            <Marker key={idx} position={loc.position}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="location-display" style={{ color: 'white', marginTop: '1rem', textAlign: 'center' }}>
        {location.error && <p>Error: {location.error}</p>}
        {!location.error && location.lat && location.lng && (
          <p>
            Your Current Location: Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
          </p>
        )}
        {!location.error && location.lat === null && location.lng === null && <p>Fetching location...</p>}
      </div>

      {showPermissionPopup && (
        <div className="permission-popup">
          <div className="popup-content">
            <h3>Allow Location Access</h3>
            <p>We would like to access your location to enhance your experience. Do you allow?</p>
            <div className="popup-buttons">
              <button onClick={requestLocation} className="btn-allow">Allow</button>
              <button onClick={denyLocation} className="btn-deny">Deny</button>
            </div>
          </div>
        </div>
      )}

      <div className="chart-container">
  <h5>Yearly Business Overview (2019–2024)</h5>
  <ResponsiveContainer width="100%" height={350}>
    <ComposedChart data={dashboardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="year" stroke="#ccc" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
      <Bar dataKey="users" barSize={20} fill="#8884d8" name="Total Users" />
      <Bar dataKey="profit" barSize={20} fill="#ffc658" name="Profit ($)" />
      <Line type="monotone" dataKey="sales" stroke="#00C49F" strokeWidth={2} name="Sales" />
      <Line type="monotone" dataKey="revenue" stroke="#FF8042" strokeWidth={2} name="Revenue ($)" />
    </ComposedChart>
  </ResponsiveContainer>
</div>

    </div>
  );
}
