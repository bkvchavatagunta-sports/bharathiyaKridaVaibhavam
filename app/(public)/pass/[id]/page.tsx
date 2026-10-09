import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import Image from "next/image";
import PrintButton from "./PrintButton";
import { format } from "date-fns"; // We will create this

export default async function PassPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const reg = await prisma.registration.findUnique({
    where: { id: resolvedParams.id },
    include: { event: true, user: true }
  });

  if (!reg) notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="print:hidden mb-6">
        <PrintButton />
      </div>

      <div 
        id="printable-pass"
        className="bg-white w-full max-w-2xl border-2 border-primary shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none"
      >
        {/* Pass Header */}
        <div className="bg-primary text-primary-foreground p-6 flex justify-between items-center border-b-4 border-yellow-500">
          <div>
            <h1 className="text-3xl font-black tracking-widest">BKV SPORT PASS</h1>
            <p className="text-sm font-medium opacity-90 uppercase tracking-widest mt-1">Bharatiya Krida Vaibhavam</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase opacity-80 font-bold tracking-widest mb-1">Registration ID</p>
            <p className="text-2xl font-mono font-black bg-white text-primary px-4 py-1 rounded-md">{reg.registrationNo}</p>
          </div>
        </div>

        {/* Event Info */}
        <div className="p-8 border-b-2 border-dashed border-gray-200 bg-gray-50 flex gap-6 items-center">
           <div className="w-24 h-24 relative rounded-xl overflow-hidden border-2 border-primary shrink-0 hidden sm:block">
             <Image src={reg.event.bannerImage} alt="Event" fill className="object-cover" />
           </div>
           <div>
             <h2 className="text-2xl font-black text-gray-900">{reg.event.title}</h2>
             <div className="text-gray-600 font-medium mt-1 flex flex-wrap gap-x-4">
               <span>🗓️ {format(reg.event.startDate, 'dd/MM/yyyy')}</span>
               <span>📍 {reg.event.venue}</span>
             </div>
           </div>
        </div>

        {/* Registration Info */}
        <div className="p-8">
          <div className="flex justify-between items-end border-b pb-4 mb-6">
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Participant Details</h3>
            <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
              reg.paymentStatus === "FREE" ? "bg-gray-100 text-gray-800 border-gray-300" :
              reg.paymentStatus === "VERIFIED" ? "bg-green-100 text-green-800 border-green-300" : 
              reg.paymentStatus === "REJECTED" ? "bg-red-100 text-red-800 border-red-300" :
              "bg-yellow-100 text-yellow-800 border-yellow-300"
            }`}>
              Entry Fee: {
                reg.paymentStatus === "FREE" ? "Free" :
                reg.paymentStatus === "VERIFIED" ? "Paid" : 
                reg.paymentStatus === "REJECTED" ? "Not Paid" :
                "Pending (Admin Confirmation)"
              }
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
            <div>
              <p className="text-gray-500 font-bold uppercase text-xs mb-1">Category</p>
              <p className="font-black text-lg text-gray-900">{reg.sportSubCategory} ({reg.event.sportType})</p>
            </div>
            {!reg.isTeamRegistration && (
              <div>
                <p className="text-gray-500 font-bold uppercase text-xs mb-1">Participant Name</p>
                <p className="font-black text-lg text-gray-900">{reg.user.name}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 font-bold uppercase text-xs mb-1">Location</p>
              <p className="font-bold text-gray-800">{reg.user.village || 'N/A'}</p>
            </div>
            {!reg.isTeamRegistration && (
              <div>
                <p className="text-gray-500 font-bold uppercase text-xs mb-1">Age & Gender</p>
                <p className="font-bold text-gray-800">{reg.age} Yrs / {reg.gender}</p>
              </div>
            )}
          </div>

          {reg.isTeamRegistration && (
            <div className="mt-8">
              <p className="text-gray-500 font-bold uppercase text-xs mb-2 border-b pb-2">Team Roster: {reg.teamName}</p>
              <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                <div><span className="font-bold text-gray-500">Captain:</span> <span className="font-black text-gray-900">{reg.captainName}</span></div>
                <div><span className="font-bold text-gray-500">Vice Capt:</span> <span className="font-black text-gray-900">{reg.viceCaptainName}</span></div>
                {reg.coachName && <div className="col-span-2"><span className="font-bold text-gray-500">Coach:</span> <span className="font-black text-gray-900">{reg.coachName}</span></div>}
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Squad List ({reg.playerNames.length})</p>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-800">
                  {reg.playerNames.map((name, i) => (
                    <span key={i} className="bg-white px-2 py-1 rounded border shadow-sm">{i+1}. {name}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center pt-8 border-t border-dashed">
             <p className="text-xs text-gray-500 font-medium">Please present this pass at the registration desk on the day of the event.</p>
             <p className="text-[10px] text-gray-400 mt-1">Generated electronically by BHARATIYA KRIDA VAIBHAVAM • {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
