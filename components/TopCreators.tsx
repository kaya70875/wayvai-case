import CreatorCard from "./elements/CreatorCard";

export interface Creator {
    creatorId: any;
    username: any;
    totalScore: number;
    scoreBreakdown: {
        nicheMatch: number;
        audienceCountryMatch: number;
        engagementWeight: number;
        hookMatch: number;
        brandSafetyPenalty: number;
    };
}

interface TopCreatorsProps {
    data: Creator[] | undefined;
    onGenerateBrief: (creatorId: string) => void;
};

export default function TopCreators({ data: topCreators, onGenerateBrief }: TopCreatorsProps) {
    return (
        <section className='top-creators grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {topCreators?.map((item: Creator) => (
                <CreatorCard item={item} onGenerateBrief={onGenerateBrief} />
            ))}
        </section>
    )
}
