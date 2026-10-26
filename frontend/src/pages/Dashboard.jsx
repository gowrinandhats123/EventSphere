
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/events";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const filteredEvents = events.filter((event) =>
  event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API);
      setEvents(response.data);
      setError("");
    } catch {
      setError("Unable to load events. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      setEvents((previous) =>
        previous.filter((event) => event._id !== id)
      );
    } catch {
      alert("Could not delete the event. Please try again.");
    }
  };

  return (
    <main className="dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR EVENT SPACE</p>
          <h1>Event Dashboard <span>✦</span></h1>
          <p className="subtitle">
            All your events, beautifully organised in one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/add-event")}
        >
          + Add New Event
        </button>
      </div>

      <section className="stats-card">
        <div className="stat-icon">✿</div>
        <div>
          <p>Total Events</p>
          <h2>{events.length}</h2>
        </div>
        <div className="stat-note">Your events at a glance ♡</div>
      </section>

      <section className="events-section">
        
<input
  type="text"
  className="search-input"
  placeholder="Search events by name..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

        <div className="section-heading">
          <div>
            <h2>All Events</h2>
            <p>Manage your upcoming and past events.</p>
          </div>
          <span className="event-count">
  {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
</span>
        </div>

        {loading ? (
          <p className="message">Loading your events...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌷</div>
            <h3>Your event story starts here!</h3>
            <p>Create your first event to see it listed here.</p>
            <button
              className="primary-btn"
              onClick={() => navigate("/add-event")}
            >
              Create an Event
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Venue</th>
                  <th>Registrations</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr key={event._id}>
                    <td>
                      <span className="event-id">
                        #{String(index + 1).padStart(3, "0")}
                      </span>
                    </td>
                    <td className="event-name">{event.eventName}</td>
                    <td>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td>{event.venue}</td>
                    <td>
                      <span className="registration-badge">
                        {event.totalRegistrations ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/edit-event/${event._id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteEvent(event._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
