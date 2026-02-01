import { useState, useEffect } from "react";
import "./ElderDashboard.css";
import { getDueMedications } from "../../services/api";

export default function ElderDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSOS, setShowSOS] = useState(false);
  const [listening, setListening] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [done, setDone] = useState({
    morningMeds: false,
    walk: false,
    lunch: false,
    eveningMeds: false,
  });
  
  /* REMINDER STATES */
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [lastAlerted, setLastAlerted] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkReminders = async () => {
        try {
            const dueList = await getDueMedications();
            if (dueList && dueList.length > 0) {
                 const key = `${dueList[0]._id}-${dueList[0].dueTime}`;
                 if (key !== lastAlerted) {
                     setReminders(dueList);
                     setShowReminderModal(true);
                     setLastAlerted(key);
                     playSound();
                 }
            }
        } catch (e) {
            console.error("Polling error", e);
        }
    };
    
    // Check initially and then every 45s
    const timeout = setTimeout(checkReminders, 2000); 
    const interval = setInterval(checkReminders, 45000);
    
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [lastAlerted]);

  // 3. HELPERS
  const playSound = () => {
     try {
       const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
       audio.play().catch(e => console.log("Audio autoplay blocked:", e));
     } catch (e) {}
  };

  const markDone = (key) => {
    setDone((prev) => ({ ...prev, [key]: true }));
  };

  const time = currentTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const date = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // 4. RENDER
  return (
    <div className="elder-container">
      <div className="elder-shell">
        {/* TOP BAR */}
        <div className="elder-top">
          <div>
            <h1>{time}</h1>
            <p className="date">{date}</p>
          </div>

          {/* MIC BUTTON */}
          <button
            className={`mic ${listening ? "listening" : ""}`}
            onClick={() => setListening(true)}
            aria-label="Voice input"
          >
            🎤
          </button>
        </div>

        {/* STATUS */}
        {done.morningMeds && (
          <div className="elder-card success subtle">
            ✓ Morning medicine taken
          </div>
        )}

        {/* ROUTINE */}
        <div className="elder-card">
          <h3>Today's Routine</h3>

          <div className="routine-row">
            <RoutineItem
              label="Morning Meds"
              icon="💊"
              done={done.morningMeds}
              onClick={() => markDone("morningMeds")}
            />
            <RoutineItem
              label="Walk"
              icon="🚶"
              done={done.walk}
              onClick={() => markDone("walk")}
            />
            <RoutineItem
              label="Lunch"
              icon="🍽️"
              done={done.lunch}
              onClick={() => markDone("lunch")}
            />
            <RoutineItem
              label="Evening Meds"
              icon="💊"
              done={done.eveningMeds}
              onClick={() => markDone("eveningMeds")}
            />
          </div>
        </div>

        {/* CALL RELATIVE */}
        <button className="call-btn" onClick={() => setShowCall(true)}>
          📞 Call Relative
        </button>

        {showCall && (
          <Modal onClose={() => setShowCall(false)}>
            <h2>Call Relative</h2>
            <p className="modal-sub">Do you want to call your relative?</p>

            <button className="call-now">
              Call Now
            </button>

            <button className="cancel" onClick={() => setShowCall(false)}>
              Cancel
            </button>
          </Modal>
        )}

      </div>

      {/* SOS FLOATING */}
      <button className="sos-btn" onClick={() => setShowSOS(true)}>
        SOS
      </button>

      {/* SOS MODAL */}
      {showSOS && (
        <Modal onClose={() => setShowSOS(false)}>
          <h2>Emergency Call</h2>
          <p className="modal-sub">Calling Relative</p>
          <button className="call-now">Call Now</button>
          <button className="cancel" onClick={() => setShowSOS(false)}>
            Cancel
          </button>
        </Modal>
      )}

      {/* REMINDER MODAL */}
      {showReminderModal && (
        <Modal onClose={() => setShowReminderModal(false)}>
          <div className="voice-ring" style={{background: '#f59e0b', animation: 'none', boxShadow: '0 0 0 10px #fcd34d'}}></div>
          <h2>Medication Reminder</h2>
          <p className="modal-sub">
            It's time to take your: <br/>
            {reminders.map(m => <strong key={m._id}>{m.name} ({m.dosage})<br/></strong>)}
          </p>
          <button className="call-now" style={{background: '#10b981'}} onClick={() => setShowReminderModal(false)}>
            I Took It
          </button>
          <button className="cancel" onClick={() => setShowReminderModal(false)}>
            Remind Later
          </button>
        </Modal>
      )}

      {/* VOICE MODAL */}
      {listening && (
        <Modal onClose={() => setListening(false)}>
          <div className="voice-ring"></div>
          <h2>Listening…</h2>
          <p className="modal-sub">
            Say “I took my medicine” or “Call my relative”
          </p>
          <button className="cancel" onClick={() => setListening(false)}>
            Stop Listening
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function RoutineItem({ label, icon, done, onClick }) {
  return (
    <div
      className={`routine-item ${done ? "done" : ""}`}
      onClick={!done ? onClick : undefined}
    >
      <div className="routine-icon">{done ? "✓" : icon}</div>
      <span>{label}</span>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal premium"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
