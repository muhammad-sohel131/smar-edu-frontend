"use client";

import { Trophy, Medal, Award, Crown } from "lucide-react";

const leaderboardData = [
  { id: 1, name: "Alice Johnson", points: 980, level: "Gold", avatar: "/images/ins1.jpg" },
  { id: 2, name: "Michael Smith", points: 870, level: "Silver", avatar: "/images/ins2.jpg" },
  { id: 3, name: "Sophia Brown", points: 850, level: "Silver", avatar: "/images/ins3.jpg" },
  { id: 4, name: "James Wilson", points: 720, level: "Bronze", avatar: "/images/ins4.jpg" },
  { id: 5, name: "Emma Davis", points: 690, level: "Bronze", avatar: "/images/ins4.jpg" },
];

const podiumIcons = [
  { icon: <Crown className="w-7 h-7 text-[var(--color-accent)]" />, border: "border-[var(--color-accent)]", ring: "from-[var(--color-accent)] to-[var(--color-accent-special)]" },
  { icon: <Trophy className="w-7 h-7 text-[var(--color-primary)]" />, border: "border-[var(--color-primary)]", ring: "from-[var(--color-primary)] to-[var(--color-secondary)]" },
  { icon: <Medal className="w-7 h-7 text-[var(--color-secondary)]" />, border: "border-[var(--color-secondary)]", ring: "from-[var(--color-secondary)] to-[var(--color-accent-special)]" },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 sm:px-8 py-8">
      {/* Page Header Banner */}
      <div className="relative bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent-special)] rounded-2xl overflow-hidden mb-8 p-6 md:p-8">
        <div className="absolute inset-0">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-0.5">Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-white/80 text-sm mt-0.5">See how you rank among fellow learners</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((player, index) => {
          const pod = podiumIcons[index];
          return (
            <div
              key={player.id}
              className={`bg-white shadow-sm rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="mb-3">{pod.icon}</div>
              <div className={`relative p-0.5 rounded-full bg-gradient-to-br ${pod.ring} mb-3`}>
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover bg-white"
                />
              </div>
              <h2 className="font-semibold text-base text-[var(--color-text)]">{player.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{player.level} Level</p>
              <div className={`mt-3 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${pod.ring} text-white`}>
                {player.points} pts
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Table header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary)]/3 to-[var(--color-secondary)]/3">
          <h2 className="text-base font-bold text-[var(--color-text)]">Full Rankings</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-background)] border-b border-gray-100">
              <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</th>
              <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
              <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leaderboardData.map((player, index) => (
              <tr
                key={player.id}
                className="group hover:bg-[var(--color-primary)]/3 transition-colors duration-150"
              >
                <td className="py-4 px-5">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                    index === 0 ? "bg-[var(--color-accent)]/10 text-[var(--color-accent-special)]" :
                    index === 1 ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" :
                    index === 2 ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{player.name}</span>
                      <p className="text-xs text-gray-400">{player.level}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="font-bold text-[var(--color-primary)]">{player.points}</span>
                  <span className="text-xs text-gray-400 ml-1">pts</span>
                </td>
                <td className="py-4 px-5 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden max-w-[120px]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-500"
                        style={{ width: `${(player.points / 1000) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round((player.points / 1000) * 100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
