import { useState } from "react";
import { injectDocuments } from "../api/injestion.js";


export default function Inject() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  async function handleInject() {

    setLoading(true);
    setMessage("");

    try {

      const result = await injectDocuments();

      setMessage(
        `${result.message} Documents: ${result.documents}, Chunks: ${result.chunks}`
      );

    } catch (error) {

      setMessage(
        error.message || "Failed to inject documents."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div>

      <button
        onClick={handleInject}
        disabled={loading}
      >
        {loading ? "Injecting..." : "Inject Documents"}
      </button>

      {message && (
        <p>
          {message}
        </p>
      )}

    </div>
  );
}