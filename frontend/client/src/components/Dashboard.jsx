import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomDatePicker = ({ value, onChange, placeholder = "DD-MM-YYYY" }) => {
  const dateInputRef = React.useRef(null);
  const displayValue = value ? value.split('-').reverse().join('-') : '';
  
  return (
    <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
      <input 
        type="date" 
        ref={dateInputRef}
        value={value} 
        onChange={e => onChange(e.target.value)}
        style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: 0, pointerEvents: 'none', zIndex: -1 
        }} 
      />
      <input 
        type="text" 
        placeholder={placeholder}
        value={displayValue}
        readOnly 
        onClick={() => {
          try { dateInputRef.current.showPicker(); } catch (err) { console.warn(err); }
        }}
        style={{ 
          padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', 
          background: 'white', width: '100%', cursor: 'pointer', zIndex: 1 
        }}
      />
    </div>
  );
};

function Dashboard() {
  const [resources, setResources] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // for booking form
  const [selectedResource, setSelectedResource] = useState(null);
  const [visitorName, setVisitorName] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResources();
    fetchAllBookings();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/resources');
      setResources(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setAllBookings(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault(); 
    
    if (!visitorName.trim() || !bookingDate) return;

    setBookingLoading(true);
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        resource_id: selectedResource.id,
        requested_by: visitorName, 
        booking_date: bookingDate
      });
      setMessage('Successfully booked!');
      // refresh local bookings to immediately hide this resource if date filter is active
      fetchAllBookings(); 
      setTimeout(() => {
        setSelectedResource(null); 
        setMessage('');
        setVisitorName('');
        setBookingDate('');
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Failed to book. Try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedDate('');
  };

  // Filter Logic natively keeping logic simple!
  const filteredResources = resources.filter(res => {
    if (searchQuery && !res.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedType && res.type !== selectedType) return false;
    
    // Check if the resource is booked on the specific date checking frontend local data
    if (selectedDate) {
      const isBooked = allBookings.some(b => b.resource_id === res.id && b.booking_date === selectedDate);
      if (isBooked) return false; 
    }
    return true;
  });

  if (loading) return <div className="loading">Fetching Resources... Please wait.</div>;

  return (
    <div>
      {/* Hero Section modified with higher font sizing and removed title */}
      <div className="hero">
        <p style={{ fontSize: '1.4rem', fontWeight: '600', maxWidth: '800px', lineHeight: '1.5' }}>
          Jahangirnagar University's official portal to seamlessly manage and book departmental resources, specialized computer labs, and equipment.
        </p>
      </div>

      {/* Advanced Filtering UI */}
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Find Resources</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <input 
          type="text" 
          placeholder="Search by name... (e.g. Lab)" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', minWidth: '200px' }}
        />
        <select 
          value={selectedType} 
          onChange={e => setSelectedType(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', minWidth: '150px' }}
        >
          <option value="">All Categories</option>
          <option value="Room">Room</option>
          <option value="Lab">Lab</option>
          <option value="Library">Library</option>
          <option value="Equipment">Equipment</option>
        </select>
        
        {/* The requested Date availability filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Available On:</label>
          <CustomDatePicker 
            value={selectedDate} 
            onChange={setSelectedDate} 
          />
        </div>

        {/* Clear Filters Button conditionally rendered */}
        {(searchQuery || selectedType || selectedDate) && (
          <button 
            type="button"
            className="btn-danger" 
            onClick={clearFilters}
            style={{ padding: '0.75rem 1rem', border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', borderRadius: '6px', fontWeight: 'bold', marginLeft: 'auto' }}
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Dynamic Grid Mapping */}
      <div className="resource-grid">
        {filteredResources.length === 0 ? <p>No resources found matching the criteria!</p> : null}
        
        {filteredResources.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.name}</h3>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Capacity:</strong> {item.capacity} people</p>
            
            <button 
              className="btn-primary"
              onClick={() => setSelectedResource(item)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedResource && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 999
        }}>
          <div className="card" style={{ width: '400px' }}>
            <h3>Booking: {selectedResource.name}</h3>
            <p>Fill out the form below</p>
            
            <form onSubmit={handleBooking} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  value={visitorName} 
                  onChange={(e) => setVisitorName(e.target.value)} 
                  placeholder="e.g. Ahad Siddiki"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Booking Date</label>
                <div style={{ width: '100%' }}>
                  <CustomDatePicker 
                    value={bookingDate} 
                    onChange={setBookingDate} 
                  />
                </div>
              </div>

              {message && <p style={{ color: message.includes('Success') ? 'green' : 'var(--danger)', marginBottom: '1rem', fontWeight: 'bold' }}>{message}</p>}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={bookingLoading || !visitorName || !bookingDate}
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Book'}
                </button>
                <button 
                  type="button" 
                  className="btn-danger" 
                  onClick={() => setSelectedResource(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="faq-section" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <h3>Frequently Asked Questions</h3>
        <p style={{ marginBottom: '1rem' }}>Everything you need to know about SpaceSync.</p>
        
        <details className="faq-item">
          <summary>Can I book a resource for multiple days?</summary>
          <p>Currently, bookings are handled on a single-day basis to ensure fair resource allocation for everyone.</p>
        </details>
        <details className="faq-item">
          <summary>How do I cancel my booking?</summary>
          <p>Navigate to the Schedules tab, locate your booking in the list, and click the 'Delete Booking' button.</p>
        </details>
        <details className="faq-item">
          <summary>Who is eligible to book resources?</summary>
          <p>All active students and faculty members of Jahangirnagar University have full access to these resources.</p>
        </details>
      </div>

    </div>
  );
}

export default Dashboard;
