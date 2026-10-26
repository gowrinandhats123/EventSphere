
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";

const API = "http://localhost:5000/api/events";

function AddEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    venue: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadEvent = async () => {
      try {
        const response = await axios.get(`${API}/${id}`);
        const event = response.data;

        setForm({
          eventName: event.eventName || "",
          description: event.description || "",
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().slice(0, 10)
            : "",
          venue: event.venue || ""
        });
      } catch {
        setError("Could not load this event. Please try again.");
      }
    };

    loadEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (isEditing) {
        await axios.put(`${API}/${id}`, form);
      } else {
        await axios.post(API, {
          ...form,
          totalRegistrations: 0
        });
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="form-page">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <section className="event-form-card">
        <div className="form-icon">✿</div>

        <p className="eyebrow">MAKE SOMETHING MEMORABLE</p>

        <h1>{isEditing ? "Edit Event" : "Create an Event"}</h1>

        <p className="subtitle">
          {isEditing
            ? "Update your event details below."
            : "Add your event details below to get started."}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="eventName">Event Name</label>
          <input
            id="eventName"
            name="eventName"
            type="text"
            placeholder="e.g. Creative Minds Meetup"
            value={form.eventName}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us a little about your event..."
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          />

          <label htmlFor="eventDate">Event Date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={form.eventDate}
            onChange={handleChange}
            min={new Date().toLocaleDateString("en-CA")}
            required
          />

          <label htmlFor="venue">Venue</label>
          <input
            id="venue"
            name="venue"
            type="text"
            placeholder="e.g. Main Auditorium"
            value={form.venue}
            onChange={handleChange}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Event ✦"
                  : "Create Event ✦"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddEvent;
