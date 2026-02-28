import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import TopCreators from './TopCreators';
import Loading from './Loading';

interface TopCreatorsContainerProps {
    selectedCampaignId: string;
    setCurrentBrief: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsBriefLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopCreatorsContainer({ selectedCampaignId, setCurrentBrief, setIsModalOpen, setIsBriefLoading }: TopCreatorsContainerProps) {
    const { data: topCreators, isLoading: isMatchingLoading } = trpc.matching.getTopCreators.useQuery(
        { campaignId: selectedCampaignId },
        { enabled: !!selectedCampaignId }
    );

    const generateBriefMutation = trpc.brief.generateBrief.useMutation({
        onSuccess: (data) => {
            setCurrentBrief(data.brief);
        },
        onError: (err) => {
            alert("Error while generating AI brief. " + err.message);
        }
    });

    const handleGenerateBrief = (creatorId: string) => {
        if (!selectedCampaignId) return;
        setIsModalOpen(true);
        setCurrentBrief("");
        setIsBriefLoading(generateBriefMutation.isPending);

        generateBriefMutation.mutate({
            campaignId: selectedCampaignId,
            creatorId: creatorId,
        });

        setIsBriefLoading(generateBriefMutation.isPending);
    };

    return (
        <>
            {isMatchingLoading && (
                <Loading />
            )}

            {!selectedCampaignId && !isMatchingLoading && (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl text-slate-400">
                    Choose A Campaign To See Results.
                </div>
            )}

            <TopCreators data={topCreators} onGenerateBrief={handleGenerateBrief} />
        </>
    )
}
