import { trpc } from "@/utils/trpc";
import Loading from "./Loading";

interface ChooseCampaingSectionProps {
    selectedCampaignId: string;
    setSelectedCampaignId: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChooseCampaingSection({ selectedCampaignId, setSelectedCampaignId }: ChooseCampaingSectionProps) {
    const { data: campaigns, isLoading } = trpc.matching.getAllCampaigns.useQuery();
    {/*TODO: Create a reusable dropdown menu component */ }
    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-slate-200 transition-all">
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Choose An Active Campaign
            </label>

            {isLoading ? (
                <div className="w-full md:w-1/2 flex-col gap-4 bg-slate-100 animate-pulse rounded-lg border border-slate-200 flex items-center px-3">
                    <Loading />
                </div>
            ) : (
                <select
                    className="w-full md:w-1/2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-white"
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                    <option value="">Choose a campaign</option>
                    {campaigns?.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.brand} - {c.objective}
                        </option>
                    ))}
                </select>
            )}

            {!isLoading && campaigns?.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">No active campaigns found.</p>
            )}
        </section>
    );
}