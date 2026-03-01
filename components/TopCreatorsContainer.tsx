import { trpc } from '@/utils/trpc';
import TopCreators from './TopCreators';
import Loading from './Loading';
import { BriefMessage } from '@/app/page';

interface TopCreatorsContainerProps {
    selectedCampaignId: string;
    setCurrentBrief: React.Dispatch<React.SetStateAction<BriefMessage | null>>;
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
            setCurrentBrief(data);
            setIsBriefLoading(false);

        },
        onError: (err) => {
            alert("Error while generating AI brief. " + err.message);
            setIsBriefLoading(false);

        }
    });

    const handleGenerateBrief = (creatorId: string) => {
        if (!selectedCampaignId) return;
        setIsModalOpen(true);
        setCurrentBrief(null);
        setIsBriefLoading(true);

        try {
            generateBriefMutation.mutate({
                campaignId: selectedCampaignId,
                creatorId: creatorId,
            });
        } catch {
            console.error('Error while generating brief.');
        }
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
