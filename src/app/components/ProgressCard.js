export default function ProgressCard() {
    return (
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card - Overall Progress with Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-600">
              <option>All Subjects</option>
              <option>Maths</option>
              <option>Science</option>
            </select>
          </div>
  
          {/* Donut Chart */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="#E5E7EB"
                strokeWidth="20"
                fill="none"
              />
              {/* Progress segments */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="#FBBF24"
                strokeWidth="20"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * 35) / 100}
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="#3B82F6"
                strokeWidth="20"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * 60) / 100}
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="#8B5CF6"
                strokeWidth="20"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * 80) / 100}
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="#EC4899"
                strokeWidth="20"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * 95) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-800">1000</div>
              <div className="text-sm text-gray-500">Total XP</div>
            </div>
          </div>
  
          {/* Legend */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">English 38%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-gray-600">Maths 30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">Science 22%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-gray-600">Social 10%</span>
              </div>
            </div>
          </div>
  
          <div className="mt-6 text-center text-teal-600 font-semibold">
            75%
          </div>
        </div>
  
        {/* Middle Card - Leaderboard */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">John Doe</div>
                <div className="text-sm text-gray-500">1500 XP</div>
              </div>
              <div className="text-2xl">🥇</div>
            </div>
  
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Sarah Smith</div>
                <div className="text-sm text-gray-500">1350 XP</div>
              </div>
              <div className="text-2xl">🥈</div>
            </div>
  
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center font-bold text-white">
                3
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Mike Johnson</div>
                <div className="text-sm text-gray-500">1200 XP</div>
              </div>
              <div className="text-2xl">🥉</div>
            </div>
  
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white">
                12
              </div>
              <div className="flex-1">
                <div className="font-semibold text-teal-600">You</div>
                <div className="text-sm text-gray-500">1000 XP</div>
              </div>
            </div>
          </div>
  
          <button className="w-full mt-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition font-semibold">
            View Full Leaderboard →
          </button>
        </div>
  
        {/* Right Card - Upcoming Challenges */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Challenges</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Math Quiz</div>
                  <div className="text-sm text-gray-600 mt-1">Algebra & Geometry</div>
                  <div className="text-xs text-gray-500 mt-2">Due: 2 days</div>
                </div>
                <div className="text-2xl">📐</div>
              </div>
            </div>
  
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Science Lab</div>
                  <div className="text-sm text-gray-600 mt-1">Physics Experiment</div>
                  <div className="text-xs text-gray-500 mt-2">Due: 5 days</div>
                </div>
                <div className="text-2xl">🔬</div>
              </div>
            </div>
  
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-800">English Essay</div>
                  <div className="text-sm text-gray-600 mt-1">Creative Writing</div>
                  <div className="text-xs text-gray-500 mt-2">Due: 1 week</div>
                </div>
                <div className="text-2xl">✍️</div>
              </div>
            </div>
          </div>
  
          <button className="w-full mt-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition font-semibold">
            View All Challenges →
          </button>
        </div>
  
        {/* Bottom Section - Weekly Progress Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Progress</h3>
            <div className="flex gap-2 text-sm">
              <button className="px-4 py-1 bg-teal-600 text-white rounded-lg">This Week</button>
              <button className="px-4 py-1 text-gray-600 hover:bg-gray-100 rounded-lg">This Month</button>
              <button className="px-4 py-1 text-gray-600 hover:bg-gray-100 rounded-lg">All Time</button>
            </div>
          </div>
  
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-4">
            {[
              { day: 'Mon', hours: 12, label: '12h' },
              { day: 'Tue', hours: 8, label: '8h' },
              { day: 'Wed', hours: 15, label: '15h' },
              { day: 'Thu', hours: 10, label: '10h' },
              { day: 'Fri', hours: 6, label: '6h' },
              { day: 'Sat', hours: 14, label: '14h' },
              { day: 'Sun', hours: 9, label: '9h' }
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-teal-600">{item.label}</div>
                <div 
                  className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                    i === 2 ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                  style={{ height: `${(item.hours / 15) * 100}%` }}
                />
                <div className="text-sm text-gray-600 font-medium">{item.day}</div>
              </div>
            ))}
          </div>
  
          <div className="mt-6 text-center">
            <span className="text-2xl font-bold text-teal-600">15 hours</span>
            <span className="text-gray-600 ml-2">of study this week</span>
            <span className="text-green-600 ml-2">↑ 25%</span>
          </div>
        </div>
      </div>
    );
  }