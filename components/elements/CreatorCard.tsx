import { Creator } from "../TopCreators"

interface CreatorCardProps {
    item: Creator;
    onGenerateBrief: (creatorId: string) => void;
}

export default function CreatorCard({ item, onGenerateBrief }: CreatorCardProps) {
    {/* TODO: Create more components for SOC */ }
    return (
        <div key={item.creatorId} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-slate-800">@{item.username}</h3>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        %{item.totalScore} Match
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Niche Rapport</span>
                            <span>{item.scoreBreakdown.nicheMatch}/30</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${(item.scoreBreakdown.nicheMatch / 30) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Target Group (Country)</span>
                            <span>{item.scoreBreakdown.audienceCountryMatch}/20</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${(item.scoreBreakdown.audienceCountryMatch / 20) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <GenerateBriefButton creatorId={item.creatorId} onGenerateBrief={onGenerateBrief} />
        </div>
    )
}

function GenerateBriefButton({ creatorId, onGenerateBrief }: {
    creatorId: string;
    onGenerateBrief: (creatorId: string) => void;
}) {
    return (
        <button
            onClick={() => onGenerateBrief(creatorId)}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            <span>✨</span> Generate AI Brief
        </button>
    )
}