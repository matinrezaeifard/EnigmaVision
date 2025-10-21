export default function Lampboard({ activeLamp }) {
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    return (
        <div className="grid grid-cols-7 gap-1">
            {letters.map(letter => (
                <div
                    key={letter}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                                ${letter === activeLamp ? 'lamp-active bg-amber-300 text-amber-600' : 'bg-blue-700 text-blue-900'}`}
                >
                    {letter}
                </div>
            ))}
        </div>
    );
}