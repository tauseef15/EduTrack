import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceStudent = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({ present: 0, absent: 0 });

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    // Set default month to current month on mount
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchAttendance(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchAttendance = async (month) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3000/api/student/attendance/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const filtered = res.data.attendance.filter((record) => {
        const m = new Date(record.date).getMonth() + 1;
        return String(m).padStart(2, "0") === month;
      });

      let present = 0,
        absent = 0;
      filtered.forEach((r) => {
        if (r.status === "Present") present++;
        else absent++;
      });

      setAttendance(filtered);
      setMonthlyStats({ present, absent });
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-orange-600">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Attendance
      </h1>

      {/* Month Dropdown */}
      <div className="flex gap-4 items-center mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-orange-300 p-2 rounded"
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Doughnut Chart */}
      {selectedMonth && (
        <div className="mb-6 flex justify-center bg-white p-10">
          {monthlyStats.present === 0 && monthlyStats.absent === 0 ? (
            <div style={{ width: 140, height: 140 }} className="relative">
              <Doughnut
                data={{
                  labels: [],
                  datasets: [
                    {
                      data: [1],
                      backgroundColor: ["#E5E7EB"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "85%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                  },
                  maintainAspectRatio: false,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                No Data
              </div>
            </div>
          ) : (
            <div style={{ width: 140, height: 140 }} className="flex flex-col items-center">
              <Doughnut
                data={{
                  labels: ["Present", "Absent"],
                  datasets: [
                    {
                      data: [monthlyStats.present, monthlyStats.absent],
                      backgroundColor: ["#34D399", "#F87171"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  cutout: "70%",
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                }}
              />
              <div className="text-xs mt-2 text-gray-600">
                Present: {monthlyStats.present} | Absent:{" "}
                {monthlyStats.absent}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attendance Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : selectedMonth && attendance.length === 0 ? (
        <p>No attendance records for this month.</p>
      ) : attendance.length > 0 ? (
        <div className="space-y-2">
          {(() => {
            const grouped = [];
            for (let i = 0; i < attendance.length; i += 10) {
              grouped.push(attendance.slice(i, i + 10));
            }
            return grouped.map((group, index) => (
              <div
                key={index}
                className="flex flex-wrap gap-4 p-3text-sm"
              >
                {group.map((record) => {
                  const day = new Date(record.date)
                    .getDate()
                    .toString()
                    .padStart(2, "0");
                  const status = record.status === "Present" ? "P" : "A";
                  const statusColor =
                    record.status === "Present"
                      ? "text-green-600"
                      : "text-red-600";
                  return (
                    <div
                      key={record._id}
                      className={`border-2 bg-orange-50 p-2 font-medium ${statusColor}`}
                    >
                      {day} - {status}
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      ) : null}
    </div>
  );
};

export default AttendanceStudent;
