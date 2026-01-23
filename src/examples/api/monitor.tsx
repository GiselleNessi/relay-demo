// Monitor Example - Step 4 from Relay API Quickstart
// This component demonstrates how to monitor transaction status

import { useState, useEffect } from "react";

const RELAY_API_URL = "https://api.relay.link";

interface MonitorProps {
    requestId?: string; // Optional requestId from Execute step
}

export function MonitorExample({ requestId: propRequestId }: MonitorProps = {}) {
    const [requestId, setRequestId] = useState(propRequestId || "");
    
    // Update requestId if prop changes
    useEffect(() => {
        if (propRequestId) {
            setRequestId(propRequestId);
        }
    }, [propRequestId]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [polling, setPolling] = useState(false);
    const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

    const checkStatus = async () => {
        if (!requestId || requestId.trim() === "") {
            setError("Please enter a request ID");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${RELAY_API_URL}/intents/status/v3?requestId=${encodeURIComponent(requestId.trim())}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get status");
            }

            const data = await response.json();
            setStatus(data);
            console.log("Status received:", data);
        } catch (err: any) {
            setError(err.message);
            console.error("Status error:", err);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = () => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }

        setPolling(true);
        const interval = setInterval(() => {
            checkStatus();
        }, 1000); // Poll once per second

        setPollInterval(interval);
    };

    const stopPolling = () => {
        if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
        }
        setPolling(false);
    };

    useEffect(() => {
        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [pollInterval]);

    const getStatusColor = (statusValue: string) => {
        switch (statusValue?.toLowerCase()) {
            case "success":
                return "#4ade80";
            case "pending":
            case "waiting":
                return "#fbbf24";
            case "failed":
            case "refunded":
                return "#f87171";
            default:
                return "#a0a0a0";
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Step 3: Monitor</h2>
            <p>Use the status endpoint with the requestId to track status and confirm success. Poll this endpoint once per second. Use the requestId from Step 2 (Execute).</p>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                    Request ID:
                </label>
                <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value.trim())}
                    placeholder="0x20538510fd9eab7a90c3e54418f8f477bfef24d83c11955a8ca835e6154b59d3"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#1a1a1a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#e0e0e0",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    onClick={checkStatus}
                    disabled={loading || !requestId}
                    style={{
                        flex: 1,
                        padding: "15px 30px",
                        background: requestId ? "#4615C8" : "#666",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        cursor: loading || !requestId ? "not-allowed" : "pointer",
                        opacity: loading || !requestId ? 0.6 : 1
                    }}
                >
                    {loading ? "Checking..." : "Check Status"}
                </button>
                {!polling ? (
                    <button
                        onClick={startPolling}
                        disabled={!requestId}
                        style={{
                            flex: 1,
                            padding: "15px 30px",
                            background: requestId ? "#10b981" : "#666",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            cursor: requestId ? "pointer" : "not-allowed",
                            opacity: requestId ? 1 : 0.6
                        }}
                    >
                        Start Polling
                    </button>
                ) : (
                    <button
                        onClick={stopPolling}
                        style={{
                            flex: 1,
                            padding: "15px 30px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Stop Polling
                    </button>
                )}
            </div>

            {error && (
                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#3d1f1f",
                    border: "1px solid #5a2a2a",
                    borderRadius: "8px",
                    color: "#ff6b6b"
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {status && (
                <div style={{ marginTop: "30px" }}>
                    <h3>Status Response</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Status:</span>
                            <span style={{ 
                                color: getStatusColor(status.status || status.intent?.status), 
                                fontWeight: 600,
                                textTransform: "uppercase"
                            }}>
                                {status.status || status.intent?.status || "N/A"}
                            </span>
                        </div>
                        {status.intent?.requestId && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                <span style={{ color: "#a0a0a0" }}>Request ID:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {status.intent.requestId}
                                </span>
                            </div>
                        )}
                        {status.intent?.originTxHash && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                <span style={{ color: "#a0a0a0" }}>Origin Tx Hash:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {status.intent.originTxHash}
                                </span>
                            </div>
                        )}
                        {status.intent?.destinationTxHash && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                                <span style={{ color: "#a0a0a0" }}>Destination Tx Hash:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {status.intent.destinationTxHash}
                                </span>
                            </div>
                        )}
                    </div>

                    <details>
                        <summary style={{ color: "#4615C8", cursor: "pointer", padding: "10px", background: "#1a1a1a", borderRadius: "8px", marginBottom: "10px" }}>
                            View Full JSON Response
                        </summary>
                        <pre style={{
                            background: "#0D0C0D",
                            padding: "15px",
                            borderRadius: "8px",
                            overflowX: "auto",
                            color: "#e0e0e0",
                            fontSize: "0.85rem",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            {JSON.stringify(status, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
}
