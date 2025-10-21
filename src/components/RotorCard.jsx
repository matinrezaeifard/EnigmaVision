export default function RotorCard({ rotor, index, onRotorChange }) {
    return (
        <div className="flex flex-col items-center">
            <div className={`relative w-16 h-32 bg-blue-700 rounded-lg shadow-md mb-2 flex items-center justify-center ${rotor.locked ? 'opacity-70' : ''}`}>
                <div className="text-2xl text-blue-900 font-bold">{rotor.curPosition}</div>
                <div className="absolute text-blue-900 bottom-2 text-xs">{rotor.type}</div>
                <button
                    onClick={() => onRotorChange(index)}
                    className="absolute top-1 right-1"
                >
                    <i data-feather={rotor.locked ? "lock" : "unlock"} className="w-4 h-4"></i>
                </button>
            </div>
            <div className="text-xs text-blue-600">{['Left', 'Middle', 'Right'][index]}</div>
        </div>
    );
}
