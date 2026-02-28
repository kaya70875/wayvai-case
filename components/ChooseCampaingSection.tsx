import { trpc } from "@/utils/trpc";

interface ChooseCampaingSectionProps {
    selectedCampaignId: string;
    setSelectedCampaignId: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChooseCampaingSection({ selectedCampaignId, setSelectedCampaignId }: ChooseCampaingSectionProps) {
    const { data: campaigns } = trpc.matching.getAllCampaigns.useQuery();

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Choose An Active Campaign
            </label>
            <select
                className="w-full md:w-1/2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
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
        </section>
    )
}
