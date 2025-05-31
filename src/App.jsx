import "./App.css";
import { useState } from "react";
import axios from "axios";

const BEVERAGES = [
  { name: "Coca Cola", price: 20 },
  { name: "Tropicana", price: 20 },
  { name: "Red Bull", price: 120 },
  { name: "Lipton", price: 50 },
  { name: "Minute Maid", price: 25 },
];

const VEG_FOODS = [
  {
    name: "Punjabi Thali",
    price: 70,
    speciality: `1 Rich use of dairy: Heavy use of butter, cream, paneer, and ghee in almost every dish.\n2.Tandoori cooking: Naan, roti, and kebabs are often tandoor-cooked, giving them a smoky flavor.`,
  },
  {
    name: "Rajasthani Thali",
    price: 65,
    speciality: `1.Dry & spicy food: Due to water scarcity, dishes are often dry (e.g., Ker Sangri) and very spicy.\n2.Unique grains: Uses coarse grains like bajra and jowar instead of wheat or rice.`,
  },
  {
    name: "Awadhi Thali",
    price: 90,
    speciality: `1 Royal Nawabi influence: rich gravies (veg) come from Awadhi cuisine.\n2.Balanced spices: The food is subtly spiced, focusing more on aroma than heat.`,
  },
  {
    name: "Himachali Thali",
    price: 80,
    speciality: `1.Yogurt-based gravies: Dishes like madra are cooked in thick curd, giving them a tangy richness.\n2.Local grains & pulses: Includes foods like sepu vadi made from ground pulses, unique to the hills.`,
  },
];

const BANKS = ["HDFC", "AXIS", "SBI"];
const PAYMENT_MODES = ["DEBIT", "CREDIT", "NETBANKING"];

// CHANGE THIS to your Render backend URL:
const BACKEND_URL = "https://dailyfueel-backend.onrender.com";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("main"); // 'main' | 'beverage' | 'bank' | 'payment' | 'card' | 'thankyou' | 'netbanking' | 'veg' | 'customer' | 'reservation' | 'alert'
  const [selectedBeverage, setSelectedBeverage] = useState(BEVERAGES[0].name);
  const [quantity, setQuantity] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [mm, setMM] = useState("");
  const [yy, setYY] = useState("");
  const [cvv, setCVV] = useState("");
  const [nbUser, setNbUser] = useState("");
  const [nbPass, setNbPass] = useState("");
  const [selectedFood, setSelectedFood] = useState(VEG_FOODS[0].name);
  const [customerName, setCustomerName] = useState("");
  const [customerRegNo, setCustomerRegNo] = useState("");
  const [seatNumber, setSeatNumber] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const beverageObj = BEVERAGES.find((b) => b.name === selectedBeverage);
  const totalPrice = beverageObj ? beverageObj.price * quantity : "";
  const foodObj = VEG_FOODS.find((f) => f.name === selectedFood);

  // Helper to generate random seat number
  const generateSeatNumber = () => Math.floor(Math.random() * 100) + 1;

  // Reservation page
  if (loggedIn && page === "reservation" && reservation) {
    return (
      <div className="reservation-bg">
        <div className="reservation-content animate-fadein">
          <h2 className="reservation-title">RESERVATION DETAILS</h2>
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>RegNo</th>
                <th>SeatNo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{reservation.name}</td>
                <td>{reservation.regno}</td>
                <td>{reservation.seat}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Yes/No alert after payment
  if (showAlert) {
    return (
      <div className="alert-bg">
        <div className="alert-content animate-fadein">
          <div className="alert-title">Do you want to see your record?</div>
          <div className="alert-actions">
            <button
              className="alert-btn"
              onClick={() => {
                setShowAlert(false);
                setPage("reservation");
              }}
            >
              Yes
            </button>
            <button
              className="alert-btn"
              onClick={() => {
                setShowAlert(false);
                setPage("thankyou");
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "customer") {
    return (
      <div className="customer-bg">
        <div className="customer-content animate-fadein">
          <h2 className="customer-title">Enter Details</h2>
          <form
            className="customer-form"
            onSubmit={(e) => {
              e.preventDefault();
              setPage("bank");
            }}
          >
            <label className="customer-label">
              Name
              <input
                className="customer-input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </label>
            <label className="customer-label">
              RegNo
              <input
                className="customer-input"
                type="text"
                value={customerRegNo}
                onChange={(e) => setCustomerRegNo(e.target.value)}
                required
              />
            </label>
            <button className="customer-book-btn" type="submit">
              Book
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "veg") {
    return (
      <div className="veg-bg">
        <div className="veg-content">
          <h2 className="veg-title">CHOOSE YOUR FOOD TYPE</h2>
          <div className="veg-row">
            <select
              className="veg-listbox"
              size={6}
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
            >
              {VEG_FOODS.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
            <textarea
              className="veg-speciality"
              value={foodObj ? foodObj.speciality : ""}
              readOnly
            />
          </div>
          <div className="veg-actions">
            <button
              className="veg-next-btn"
              onClick={() => setPage("customer")}
            >
              Next
            </button>
            <input
              className="veg-price-input"
              type="text"
              value={foodObj ? `₹${foodObj.price}` : ""}
              readOnly
            />
            <span className="veg-price-label">PRICE IN RUPEE</span>
          </div>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "thankyou") {
    return (
      <div className="thankyou-bg">
        <div className="thankyou-content">
          <div className="thankyou-check">✓</div>
          <h2 className="thankyou-title">Your payment was successful</h2>
          <p className="thankyou-msg">
            Thank you for your payment. We will be in contact with more details
            shortly
          </p>
          {seatNumber && (
            <div className="thankyou-seat">
              your reserve seat number is <b>{seatNumber}</b>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loggedIn && page === "netbanking") {
    return (
      <div className="netbanking-bg">
        <div className="netbanking-warning">
          CARE: USERNAME AND PASSWORD ARE CASE SENSITIVE
        </div>
        <div className="netbanking-content animate-fadein">
          <form
            className="netbanking-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const seat = generateSeatNumber();
              setSeatNumber(seat);
              try {
                const response = await axios.post(
                  `${BACKEND_URL}/api/reservations`,
                  {
                    name: customerName,
                    regno: customerRegNo,
                    seat: seat,
                  }
                );
                if (response.data) {
                  setReservation(response.data);
                  setShowAlert(true);
                }
              } catch (error) {
                console.error("Error saving reservation:", error);
                alert("Failed to save reservation! Please try again.");
              }
            }}
          >
            <label className="netbanking-label">
              USER ID
              <input
                className="netbanking-input"
                type="text"
                value={nbUser}
                onChange={(e) => setNbUser(e.target.value)}
                required
              />
            </label>
            <label className="netbanking-label">
              PASSWORD
              <input
                className="netbanking-input"
                type="password"
                value={nbPass}
                onChange={(e) => setNbPass(e.target.value)}
                required
              />
            </label>
            <button className="netbanking-pay-btn" type="submit">
              PAY
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "card") {
    return (
      <div className="cardpay-bg">
        <div className="cardpay-content animate-fadein">
          <div className="cardpay-title">SECURITY:128 BIT SSL ENCRYPTION</div>
          <form
            className="cardpay-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const seat = generateSeatNumber();
              setSeatNumber(seat);
              try {
                const res = await axios.post(
                  `${BACKEND_URL}/api/reservations`,
                  {
                    name: customerName,
                    regno: customerRegNo,
                    seat,
                  }
                );
                setReservation(res.data);
              } catch (err) {
                alert("Failed to save reservation!");
                setReservation({
                  name: customerName,
                  regno: customerRegNo,
                  seat,
                });
              }
              setShowAlert(true);
            }}
          >
            <label className="cardpay-label">
              Card Number
              <input
                className="cardpay-input"
                type="text"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </label>
            <div className="cardpay-row">
              <label className="cardpay-label">
                MM
                <input
                  className="cardpay-input"
                  type="text"
                  maxLength={2}
                  value={mm}
                  onChange={(e) => setMM(e.target.value)}
                  required
                />
              </label>
              <label className="cardpay-label">
                YY
                <input
                  className="cardpay-input"
                  type="text"
                  maxLength={2}
                  value={yy}
                  onChange={(e) => setYY(e.target.value)}
                  required
                />
              </label>
              <label className="cardpay-label">
                CVV
                <input
                  className="cardpay-input"
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCVV(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="cardpay-actions">
              <button className="cardpay-pay-btn" type="submit">
                SECURILY PAY
              </button>
              <button
                className="cardpay-back-btn"
                type="button"
                onClick={() => setPage("payment")}
              >
                BACK
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "payment") {
    return (
      <div className="payment-bg">
        <div className="payment-content animate-fadein">
          <h2 className="payment-title">CHOOSE YOUR PAYMENT MODE</h2>
          <div className="payment-buttons">
            {PAYMENT_MODES.map((mode) => (
              <button
                className="payment-btn"
                key={mode}
                onClick={() => {
                  if (mode === "DEBIT" || mode === "CREDIT") setPage("card");
                  if (mode === "NETBANKING") setPage("netbanking");
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "bank") {
    return (
      <div className="bank-bg">
        <div className="bank-content animate-fadein">
          <h2 className="bank-title">CHOOSE YOUR BANK</h2>
          <div className="bank-buttons">
            {BANKS.map((bank) => (
              <button
                className="bank-btn"
                key={bank}
                onClick={() => setPage("payment")}
              >
                {bank}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loggedIn && page === "beverage") {
    return (
      <div className="beverage-bg">
        <div className="beverage-content">
          <h2 className="beverage-title">CHOOSE YOUR BEVERAGE</h2>
          <select
            className="beverage-listbox"
            size={5}
            value={selectedBeverage}
            onChange={(e) => setSelectedBeverage(e.target.value)}
          >
            {BEVERAGES.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          <div className="beverage-actions">
            <button
              className="beverage-pay-btn"
              onClick={() => setPage("bank")}
            >
              pay
            </button>
            <select
              className="beverage-qty-dropdown"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <input
              className="beverage-amount-input"
              type="text"
              placeholder=""
              value={totalPrice ? `₹${totalPrice}` : ""}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  }

  if (loggedIn) {
    return (
      <div className="welcome-bg">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome to Daily fuel!</h1>
          <p className="welcome-msg">Enjoy your meal journey 🚀</p>
          <div className="welcome-buttons">
            <button
              className="welcome-btn veg-btn"
              onClick={() => setPage("veg")}
            >
              Veg
            </button>
            <button
              className="welcome-btn beverage-btn"
              onClick={() => setPage("beverage")}
            >
              Beverage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2 className="login-title hotel-title">Daily fuel</h2>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          setLoggedIn(true);
        }}
      >
        <div className="login-row">
          <input
            className="login-input"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            required
          />
        </div>
        <div className="login-row">
          <input
            className="login-input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="login-button login-button-bold" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default App;
