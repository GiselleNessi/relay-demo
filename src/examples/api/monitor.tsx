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

    const getStatusClass = (statusValue: string) => {
        switch (statusValue?.toLowerCase()) {
            case "success":
                return "status-success";
            case "pending":
            case "waiting":
                return "status-pending";
            case "failed":
            case "refunded":
                return "status-failed";
            default:
                return "status-default";
        }
    };

    const statusValue = status?.status || status?.intent?.status || "N/A";

    const codeSnippet = `const res = await fetch(
  \`https://api.relay.link/intents/status/v3?requestId=\${requestId}\`
);
const data = await res.json();`;

    return (
        <div className="example-page">
            <h2 className="example-title">API: Monitor</h2>
            <p className="example-description">
                GET <code>/intents/status/v3?requestId=...</code> to track status. Use requestId from Execute. Run the code below.
            </p>

            <div className="example-snippet-box">
                <pre className="example-pre">{codeSnippet}</pre>
            </div>

            <div className="example-field">
                <label className="example-label">Request ID</label>
                <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value.trim())}
                    placeholder="0x..."
                    className="example-input"
                />
            </div>

            <div className="example-button-group">
                <button
                    onClick={checkStatus}
                    disabled={loading || !requestId}
                    className={`example-run-button ${!requestId ? "example-run-button-disabled" : ""}`}
                >
                    {loading ? "Checking..." : "Check Status"}
                </button>
                {!polling ? (
                    <button
                        onClick={startPolling}
                        disabled={!requestId}
                        className={`example-run-button example-run-button-secondary ${!requestId ? "example-run-button-disabled" : ""}`}
                    >
                        Start Polling
                    </button>
                ) : (
                    <button
                        onClick={stopPolling}
                        className="example-run-button example-run-button-danger"
                    >
                        Stop Polling
                    </button>
                )}
            </div>

            {error && (
                <div className="example-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {status && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Status Response</h3>
                    <div className="example-result-box">
                        <div className="example-result-row">
                            <span className="example-result-label">Status:</span>
                            <span className={`example-result-value ${getStatusClass(statusValue)}`}>
                                {statusValue}
                            </span>
                        </div>
                        {status.intent?.requestId && (
                            <div className="example-result-row">
                                <span className="example-result-label">Request ID:</span>
                                <span className="example-result-value mono">
                                    {status.intent.requestId}
                                </span>
                            </div>
                        )}
                        {status.intent?.originTxHash && (
                            <div className="example-result-row">
                                <span className="example-result-label">Origin Tx Hash:</span>
                                <span className="example-result-value mono">
                                    {status.intent.originTxHash}
                                </span>
                            </div>
                        )}
                        {status.intent?.destinationTxHash && (
                            <div className="example-result-row">
                                <span className="example-result-label">Destination Tx Hash:</span>
                                <span className="example-result-value mono">
                                    {status.intent.destinationTxHash}
                                </span>
                            </div>
                        )}
                    </div>

                    <details className="example-details">
                        <summary className="example-details-summary">View Full JSON Response</summary>
                        <pre className="example-pre">{JSON.stringify(status, null, 2)}</pre>
                    </details>
                </div>
            )}
        </div>
    );
}
