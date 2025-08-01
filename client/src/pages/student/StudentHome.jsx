import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentHome = () => {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, announceRes, testRes, resultRes, attendanceRes] =
          await Promise.all([
            axios.get("https://edutrack-qldm.onrender.com/api/student/profile", { headers }),
            axios.get("https://edutrack-qldm.onrender.com/api/student/announcements", {
              headers,
            }),
            axios.get("https://edutrack-qldm.onrender.com/api/student/tests", { headers }),
            axios.get("https://edutrack-qldm.onrender.com/api/student/results", { headers }),
            axios.get("https://edutrack-qldm.onrender.com/api/student/attendance/all", {
              headers,
            }),
          ]);

        setProfile(profileRes.data);
        setAnnouncements(announceRes.data);
        setTests(testRes.data.tests);
        setResults(resultRes.data.results);

        const records = attendanceRes.data.attendance;
        let present = 0;
        let absent = 0;
        records.forEach((rec) => {
          if (rec.status === "Present") present++;
          else absent++;
        });
        setAttendanceStats({ present, absent });
      } catch (error) {
        console.error("Error fetching student home data:", error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Greeting + Avatar */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Welcome,{" "}
          <span className="text-orange-600">{profile?.name || "Student"}</span>{" "}
          👋
        </h1>
      </div>

      {/* Profile Info Cards */}
      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Card
            title="Classroom"
            value={
              profile.classrooms?.name || profile.classrooms?.[0]?.name || "N/A"
            }
          />
          <Card title="Roll Number" value={profile.rollNo || "N/A"} />
          <div className="hidden lg:block">
            <Card title="Email" value={profile.email || "N/A"} />
          </div>
        </div>
      )}
      <div className="block lg:hidden">
      <Card title="Email" value={profile.email || "N/A"} />
      </div>

      {/* Attendance + Announcements */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 bg-white p-3 rounded shadow">
          <Section title="🎯 Attendance Overview">
            <div className="flex flex-col items-center">
              {attendanceStats.present === 0 && attendanceStats.absent === 0 ? (
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
                    No data
                  </div>
                </div>
              ) : (
                <div style={{ width: 140, height: 140 }}>
                  <Doughnut
                    data={{
                      labels: ["Present", "Absent"],
                      datasets: [
                        {
                          data: [
                            attendanceStats.present,
                            attendanceStats.absent,
                          ],
                          backgroundColor: ["#34D399", "#F87171"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      cutout: "70%",
                      plugins: {
                        legend: { display: false },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              )}
              <div className="text-xs mt-2 text-gray-600">
                Present: {attendanceStats.present} | Absent:{" "}
                {attendanceStats.absent}
              </div>
            </div>
          </Section>
        </div>

        <div className="w-full md:w-1/2 bg-white p-3 rounded shadow">
          <Section title="📢 Announcements">
            <div className="h-[200px] overflow-y-auto space-y-2 text-sm pr-2 custom-scrollbar">
              {announcements.length > 0 ? (
                announcements.map((a) => (
                  <div
                    key={a._id}
                    className="border p-2 rounded shadow text-sm bg-white"
                  >
                    <p className="font-semibold">{a.title}</p>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{a.message}</p>
                      <p className="text-xs text-gray-500 text-right min-w-[120px]">
                        {a.classroom?.name} <br />
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs md:text-sm text-gray-500">No active announcements.</p>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Upcoming Tests */}
      <Section title="📘 Upcoming Tests">
        <div className="min-h-[100px] space-y-2 text-sm">
          {tests.length === 0 ? (
            <p className="text-gray-500">No tests available.</p>
          ) : (
            tests.map((test) => (
              <div key={test._id} className="bg-white p-3 rounded shadow">
                <p className="font-semibold">{test.title}</p>
                <p className="font-semibold">{test.subject}</p>
                <p className="text-xs text-gray-500">
                  Date: {new Date(test.testDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* Results */}
      <Section title="📊 Your Results">
        <div className="min-h-[100px] space-y-2 text-sm">
          {results.length === 0 ? (
            <p className="text-gray-500">No results uploaded yet.</p>
          ) : (
            results.map((res) => (
              <div key={res._id} className="bg-white p-3 rounded shadow">
                <p className="font-semibold">
                  {res.test.title} - {res.test.subject}
                </p>
                <p>
                  Marks: {res.marksObtained}/{res.test.totalMarks}
                </p>
              </div>
            ))
          )}
        </div>
      </Section>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-md sm:text-lg font-medium text-gray-800 break-words">
      {value}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-0">
    <h2 className="text-md md:text-lg font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

export default StudentHome;
