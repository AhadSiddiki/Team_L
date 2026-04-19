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

function Schedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advanced Filters State mirroring Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancelClick = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings((prev) => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to cancel booking.');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setFilterDate('');
  };

  // Apply all filters mapping over local state
  const filteredBookings = bookings.filter(b => {
    // 1. Search name
    if (searchQuery && b.Resource && !b.Resource.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // 2. Filter Category
    if (selectedType && b.Resource && b.Resource.type !== selectedType) return false;
    // 3. Filter Date
    if (filterDate && b.booking_date !== filterDate) return false;
    
    return true;
  });

  if (loading) return <div className="loading">Loading Schedules...</div>;

  return (
    <div>
      <h2>Current Schedules</h2>
      <p style={{ marginBottom: '1rem' }}>See who has booked what right now.</p>

      {/* Adding equivalent Advanced Filtering for the Schedules */}
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Find Bookings</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <input 
          type="text" 
          placeholder="Search by resource name..." 
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Booked On:</label>
          <CustomDatePicker 
            value={filterDate} 
            onChange={setFilterDate} 
          />
        </div>

        {/* Clear Filters Button conditionally rendered */}
        {(searchQuery || selectedType || filterDate) && (
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

      {filteredBookings.length === 0 ? (
        <p>No bookings found matching your criteria.</p>
      ) : (
        <div className="schedule-list">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card">
              <h3>{booking.Resource?.name || 'Unknown Resource'}</h3>
              <p><strong>Booked By:</strong> {booking.User?.name || 'Unknown'}</p>
              <p><strong>Date:</strong> {booking.booking_date}</p>
              <p><strong>Status:</strong> <span style={{ color: 'green' }}>{booking.status}</span></p>
              
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button 
                  className="btn-danger" 
                  onClick={() => handleCancelClick(booking.id)}
                >
                  Delete Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedule;
