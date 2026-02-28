interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
}

export default function Modal({ children, onClose, title }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
                <header className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-2xl text-slate-800">{title}</h2>
                    <button onClick={() => onClose()} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                </header>
                {children}
            </div>
        </div>
    )
}
