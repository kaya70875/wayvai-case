"use client";

import { useState } from "react";
import MainHeader from "../components/MainHeader";
import ChooseCampaingSection from "@/components/ChooseCampaingSection";
import TopCreatorsContainer from "@/components/TopCreatorsContainer";
import Modal from "@/components/modal/Modal";
import BriefModalContent from "@/components/modal/BriefModalContent";

export default function MatchingPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <MainHeader />
        <ChooseCampaingSection selectedCampaignId={selectedCampaignId} setSelectedCampaignId={setSelectedCampaignId} />
        <TopCreatorsContainer selectedCampaignId={selectedCampaignId} setCurrentBrief={setCurrentBrief} setIsModalOpen={setIsModalOpen} setIsBriefLoading={setBriefLoading} />

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} title="Collaboration Brief">
            <BriefModalContent currentBrief={currentBrief} onClose={() => setIsModalOpen(false)} briefLoading={briefLoading} />
          </Modal>
        )}
      </div>
    </main>
  );
}