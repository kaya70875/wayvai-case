import { BriefMessage } from '@/app/page';
import Loading from '../Loading';
import Button from '../elements/Button';

interface BriefModalContentProps {
    currentBrief: BriefMessage | null;
    briefLoading: boolean;
    onClose: () => void;
}

export default function BriefModalContent({ currentBrief, briefLoading, onClose }: BriefModalContentProps) {
    if (briefLoading) {
        return (
            <div className="p-8 flex flex-col items-center py-20 bg-white">
                <Loading />
                <p className="mt-4 text-slate-500 text-sm animate-pulse font-medium">
                    AI is crafting your personalized brief...
                </p>
            </div>
        );
    }

    if (!currentBrief) return null;

    return (
        <>
            <div className="p-8 overflow-y-auto bg-white max-h-[70vh] custom-scrollbar space-y-8">
                <OutreachSection message={currentBrief.outreachMessage} />
                <IdeasSection ideas={currentBrief.contentIdeas} />
                <HooksSection hooks={currentBrief.hooks} />
            </div>

            <BriefModalButtons onClose={onClose} currentBrief={currentBrief} />
        </>
    );
}


function OutreachSection({ message }: { message: string }) {
    return (
        <section>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold mb-3">
                Suggested Outreach
            </h4>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm italic text-slate-800 leading-relaxed font-serif text-lg">
                &ldquo;{message}&rdquo;
            </div>
        </section>
    );
}

function IdeasSection({ ideas }: { ideas: string[] }) {
    return (
        <section>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold mb-3">
                5 Creative Content Ideas
            </h4>
            <div className="grid gap-3">
                {ideas?.map((idea, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors group">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            {index + 1}
                        </span>
                        <p className="text-slate-700 text-sm md:text-base">{idea}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function HooksSection({ hooks }: { hooks: string[] }) {
    return (
        <section>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-bold mb-3">
                3 High-Conversion Hooks
            </h4>
            <div className="flex flex-col gap-2">
                {hooks?.map((hook, index) => (
                    <div key={index} className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-sm font-medium italic relative overflow-hidden">
                        <span className="absolute left-0 top-0 h-full w-1 bg-amber-400 opacity-50"></span>
                        &ldquo;{hook}&rdquo;
                    </div>
                ))}
            </div>
        </section>
    );
}

function BriefModalButtons({ onClose, currentBrief }: {
    onClose: () => void;
    currentBrief: BriefMessage | null;
}) {
    const copyToClipboard = () => {
        if (!currentBrief) return;

        const formattedText = `
        [OUTREACH MESSAGE]
        ${currentBrief.outreachMessage}

        [CONTENT IDEAS]
        ${currentBrief.contentIdeas.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

        [HOOKS]
        ${currentBrief.hooks.map((h, idx) => `- ${h}`).join('\n')}
                `.trim();

        navigator.clipboard.writeText(formattedText);
        alert("Full brief copied to clipboard! Ready to send.");
    };

    return (
        <div className="p-6 border-t bg-slate-50 flex flex-col sm:flex-row justify-end items-center gap-4">
            <p className="text-[10px] text-slate-400 mr-auto order-last sm:order-first">
                Generated with DeepSeek JSON-Mode • Cached
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
                <Button variant='secondary' onClick={onClose} className="flex-1 sm:flex-none">Close</Button>
                <Button disabled={!currentBrief} onClick={copyToClipboard} className="flex-1 sm:flex-none">
                    Copy Brief
                </Button>
            </div>
        </div>
    );
}