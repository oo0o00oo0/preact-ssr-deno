import { useEffect, useState } from "preact/hooks";
import { useStore } from "../store/useStore.ts";

interface CounterProps {
  initialCounter: number;
}

export function Counter({ initialCounter }: CounterProps) {
  const {
    counter,
    setCounter,
    isLoading,
    setIsLoading,
  } = useStore();

  const [status, setStatus] = useState("");

  // Initialize counter from props
  useEffect(() => {
    setCounter(initialCounter);
  }, [initialCounter, setCounter]);

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
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="counter-section">
      <h2>Server State Counter {isLoading && "(Loading...)"}</h2>
      <div class="counter-display">
        <span id="counter-value">{counter}</span>
      </div>
      <div class="counter-controls">
        <button
          type="button"
          onClick={() => apiCall("/increment", "POST")}
          disabled={isLoading}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => apiCall("/decrement", "POST")}
          disabled={isLoading}
        >
          -
        </button>
        <button
          type="button"
          onClick={() => apiCall("/reset", "POST")}
          disabled={isLoading}
        >
          Reset
        </button>
      </div>
      <div class="status">{status}</div>
    </div>
  );
}
