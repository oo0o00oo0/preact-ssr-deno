import { useState } from "preact/hooks";

interface CounterProps {
  initialCounter: number;
}

export function Counter({ initialCounter }: CounterProps) {
  const [counter, setCounter] = useState(initialCounter);
  const [status, setStatus] = useState("");

  // Update counter display and show status
  const updateCounter = (newValue: number, message = "") => {
    setCounter(newValue);
    if (message) {
      setStatus(message);
      setTimeout(() => setStatus(""), 2000);
    }
  };

  // Make API call and handle response
  const apiCall = async (endpoint: string, method = "GET") => {
    console.log("apiCall", endpoint, method);
    try {
      setStatus("Updating...");

      const response = await fetch(`/api/counter${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateCounter(data.counter, "Updated!");
    } catch (error) {
      console.error("API call failed:", error);
      setStatus("Error updating counter");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <div class="counter-section">
      <h2>Server State Counter</h2>
      <div class="counter-display">
        <span id="counter-value">{counter}</span>
      </div>
      <div class="counter-controls">
        <button
          type="button"
          onClick={() => {
            console.log("Increment button clicked!");
            apiCall("/increment", "POST");
          }}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            console.log("Decrement button clicked!");
            apiCall("/decrement", "POST");
          }}
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            console.log("Reset button clicked!");
            apiCall("/reset", "POST");
          }}
        >
          Reset
        </button>
      </div>
      <div class="status">{status}</div>
    </div>
  );
}
