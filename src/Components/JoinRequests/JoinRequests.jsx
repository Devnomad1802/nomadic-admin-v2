import { useState } from "react";
import {
  useGetAdminJoinRequestsQuery,
  useAdminRevokeJoinRequestMutation,
} from "../../Redux/services/joinRequestsApi";

/* Admin oversight — Host-Approval Join Requests.
 * Read-only list with status filter + audited override revoke. Shows real data
 * only (no demo counts). Traveller contact info is never exposed by the API. */

const STATUSES = ["all", "pending", "call_scheduled", "approved", "declined", "expired", "revoked", "withdrawn", "booked"];

const badge = (s) => {
  const map = {
    pending: "#b7791f", call_scheduled: "#2b6cb0", approved: "#2f855a", declined: "#c53030",
    expired: "#718096", revoked: "#9b2c2c", withdrawn: "#718096", booked: "#2c5282",
  };
  return {
    background: (map[s] || "#718096") + "22",
    color: map[s] || "#718096",
    padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, textTransform: "capitalize",
  };
};

export default function JoinRequests() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAdminJoinRequestsQuery({ status, page, limit: 25 });
  const [revoke, { isLoading: revoking }] = useAdminRevokeJoinRequestMutation();

  const rows = data?.data || [];
  const total = data?.total || 0;

  const onRevoke = async (id) => {
    const note = window.prompt("Reason for revoking (audited):", "");
    if (note === null) return; // cancelled
    try {
      await revoke({ id, note }).unwrap();
    } catch (e) {
      alert(e?.data?.message || "Could not revoke.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: "0 0 4px" }}>Join Requests</h2>
      <p style={{ color: "#718096", marginTop: 0 }}>
        Oversight of host-approval booking requests across all hosts. Revoke is audited.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", cursor: "pointer",
              background: status === s ? "#1a202c" : "#fff", color: status === s ? "#fff" : "#1a202c",
              fontSize: 13, textTransform: "capitalize",
            }}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && <p style={{ color: "#c53030" }}>Couldn't load join requests.</p>}
      {!isLoading && !isError && rows.length === 0 && <p style={{ color: "#718096" }}>No {status === "all" ? "" : status} requests.</p>}

      {rows.length > 0 && (
        <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f7fafc", textAlign: "left" }}>
                <th style={{ padding: 12 }}>Trip</th>
                <th style={{ padding: 12 }}>Batch</th>
                <th style={{ padding: 12 }}>Party</th>
                <th style={{ padding: 12 }}>Status</th>
                <th style={{ padding: 12 }}>Expires</th>
                <th style={{ padding: 12 }}>Created</th>
                <th style={{ padding: 12 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} style={{ borderTop: "1px solid #edf2f7" }}>
                  <td style={{ padding: 12, fontFamily: "monospace", fontSize: 12 }}>{r.tripId}</td>
                  <td style={{ padding: 12 }}>#{(r.batchIndex ?? 0) + 1}</td>
                  <td style={{ padding: 12 }}>{r.partySize}</td>
                  <td style={{ padding: 12 }}><span style={badge(r.status)}>{r.status.replace("_", " ")}</span></td>
                  <td style={{ padding: 12 }}>{r.expiresAt ? new Date(r.expiresAt).toLocaleString("en-IN") : "—"}</td>
                  <td style={{ padding: 12 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                  <td style={{ padding: 12 }}>
                    {["pending", "call_scheduled", "approved"].includes(r.status) ? (
                      <button
                        disabled={revoking}
                        onClick={() => onRevoke(r._id)}
                        style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid #fc8181", background: "#fff5f5", color: "#c53030", cursor: "pointer", fontSize: 13 }}
                      >
                        Revoke
                      </button>
                    ) : (
                      <span style={{ color: "#a0aec0" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 25 && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: "6px 12px" }}>Prev</button>
          <span>Page {page} · {total} total</span>
          <button disabled={page * 25 >= total} onClick={() => setPage((p) => p + 1)} style={{ padding: "6px 12px" }}>Next</button>
        </div>
      )}
    </div>
  );
}
