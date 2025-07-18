import { useEffect, useState } from "preact/hooks";

const Status = () => {
  const [status, setStatus] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    const handleStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    handleStatus();
  }, []);

  return (
    <>
      <div>Status: {status.join(", ")}</div>
      <div>
        <label>
          Filename:
          <input
            type="text"
            value={filename}
            placeholder="Enter filename..."
            onChange={(e) => setFilename(e.currentTarget.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Content:
          <textarea
            value={content}
            placeholder="Enter file content..."
            onChange={(e) => setContent(e.currentTarget.value)}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            const response = await fetch("/api/writeFile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename,
                content,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log("File written successfully:", result);
              setFilename("");
              setContent("");
            } else {
              console.error("Failed to write file");
            }
          } catch (error) {
            console.error("Error writing file:", error);
          }
        }}
      >
        Write File
      </button>
    </>
  );
};

export default Status;
