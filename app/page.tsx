"use client";

import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function MatchingPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const { data: campaigns } = trpc.matching.getAllCampaigns.useQuery();
  const { data: topCreators, isLoading } = trpc.matching.getTopCreators.useQuery(
    { campaignId: selectedCampaignId ?? "" },
    { enabled: !!selectedCampaignId }
  );

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wayv AI - Campaign</h1>

      <section className="mb-8">
        <label className="block mb-2 font-medium">Choose A Campaign:</label>
        <select
          className="border p-2 rounded w-full max-w-md text-black"
          onChange={(e) => setSelectedCampaignId(e.target.value)}
        >
          <option value="">Choose....</option>
          {campaigns?.map((c) => (
            <option key={c.id} value={c.id}>{c.brand} - {c.objective}</option>
          ))}
        </select>
      </section>

      <section>
        {isLoading && <p>Loading matching influencers...</p>}

        {topCreators && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Influencer</th>
                  <th className="p-4">Total Score</th>
                  <th className="p-4">Score Summary</th>
                </tr>
              </thead>
              <tbody>
                {topCreators.map((item) => (
                  <tr key={item.creatorId} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">@{item.username}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.totalScore}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex gap-2 flex-wrap">
                        <span>Niche: {item.scoreBreakdown.nicheMatch}</span> |
                        <span>Audience: {item.scoreBreakdown.audienceCountryMatch}</span> |
                        <span>Stats: {item.scoreBreakdown.engagementWeight}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}