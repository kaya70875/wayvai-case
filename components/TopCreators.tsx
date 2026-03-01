import { TopCreator } from "@/types/types";
import CreatorCard from "./elements/CreatorCard";

interface TopCreatorsProps {
    data: TopCreator[] | undefined;
    onGenerateBrief: (creatorId: string) => void;
};

export default function TopCreators({ data: topCreators, onGenerateBrief }: TopCreatorsProps) {
    return (
        <section className='top-creators grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {topCreators?.map((item: TopCreator) => (
                <CreatorCard key={item.creatorId} item={item} onGenerateBrief={onGenerateBrief} />
            ))}
        </section>
    )
}
