"use client";

import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function MatchingPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // 1. Tüm kampanyaları çek
  const { data: campaigns } = trpc.matching.getAllCampaigns.useQuery();

  // 2. Seçili kampanya için eşleşmeleri çek
  const { data: topCreators, isLoading } = trpc.matching.getTopCreators.useQuery(
    { campaignId: selectedCampaignId ?? "" },
    { enabled: !!selectedCampaignId } // Sadece kampanya seçiliyse çalıştır
  );

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wayv AI - Kampanya Eşleştirme</h1>

      {/* Kampanya Seçici */}
      <section className="mb-8">
        <label className="block mb-2 font-medium">Bir Kampanya Seçin:</label>
        <select
          className="border p-2 rounded w-full max-w-md text-black"
          onChange={(e) => setSelectedCampaignId(e.target.value)}
        >
          <option value="">Seçiniz...</option>
          {campaigns?.map((c) => (
            <option key={c.id} value={c.id}>{c.brand} - {c.objective}</option>
          ))}
        </select>
      </section>

      {/* Sonuç Tablosu */}
      <section>
        {isLoading && <p>Eşleşen influencerlar yükleniyor...</p>}

        {topCreators && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Influencer</th>
                  <th className="p-4">Toplam Skor</th>
                  <th className="p-4">Skor Dökümü</th>
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
                      {/* Ödevde istenen "Breakdown" kısmı burası */}
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