import Image from "next/image";
import { Edit } from 'lucide-react';
import ProgressCard from "./ProgressCard";
export default function DashboardScreen({user}) {
  return (
    <div className="min-h-screen p-6">
      <div className="bg-[#006188] rounded-2xl shadow-xl p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          
          {/* Left: Profile Image */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-300 border-4 border-white shadow-lg">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=SHAMS"
                alt="Profile"
                width={112}     // 28 * 4 = 112px
                height={112}
                className="w-full h-full object-cover"
              />
            </div>

            <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition">
              <Edit className="w-4 h-4 text-teal-700" />
            </button>
          </div>

          {/* Middle: User Details */}
          <div className="flex-1 text-white mt-4 md:mt-0">
            <h2 className="text-3xl font-bold mb-4">{user.name}</h2>
            <div className="space-y-3 text-lg">
              <div><span className="opacity-80">MENTOROID ID:</span> {user.id}</div>
              <div><span className="opacity-80">XP COIN:</span> 1000</div>
              <div><span className="opacity-80">SCHOOL NAME:</span> BD SCHOOL</div>
              <div><span className="opacity-80">CLASS:</span> 5</div>
              <div><span className="opacity-80">MOBILE NUMBER:</span> 8254895245</div>
            </div>
          </div>

          {/* Right: Badge Icons */}
          <div className="flex gap-3 flex-shrink-0 mt-4 md:mt-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-full border-4 border-white bg-teal-600 hover:bg-teal-500 transition cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
      <div>
          <ProgressCard />
      </div>
    </div>
  );
}
