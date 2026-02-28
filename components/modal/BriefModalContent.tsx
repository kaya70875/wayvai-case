import Loading from '../Loading';
import Button from '../elements/Button';
import ReactMarkdown from 'react-markdown';

interface BriefModalContentProps {
    currentBrief: string;
    briefLoading: boolean;
    onClose: () => void;
}

export default function BriefModalContent({ currentBrief, briefLoading, onClose }: BriefModalContentProps) {
    return (
        <>
            <div className="p-8 overflow-y-auto">
                {briefLoading ? (
                    <div className="flex flex-col items-center py-12">
                        <Loading />
                        <p className="text-gray-900 text-sm animate-pulse">AI is analyzing influencer profiles...</p>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif text-lg">
                        <ReactMarkdown>{currentBrief}</ReactMarkdown>
                    </div>
                )}
            </div>

            <BriefModalButtons onClose={onClose} currentBrief={currentBrief} />
        </>
    )
}

function BriefModalButtons({ onClose, currentBrief }: {
    onClose: () => void;
    currentBrief: string;
}) {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentBrief);
        alert("Copied!");
    };

    return (
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-4">
            <Button variant='secondary' onClick={onClose}>Close</Button>
            <Button disabled={!currentBrief} onClick={copyToClipboard}>Copy</Button>
        </div>
    )
}
