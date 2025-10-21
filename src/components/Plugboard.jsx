export default function Plugboard({ plugboard, selectedPlug, handlePlugboardClick }) {
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    return (
        <div className="relative">
            <div className="grid grid-cols-6 gap-2">
                {letters.map(letter => {
                    const isPaired = plugboard.some(pair => pair.includes(letter));
                    const isSelected = selectedPlug === letter;
                    const pairIndex = plugboard.findIndex(pair => pair.includes(letter));
                    const colors = [
                        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
                        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
                        'bg-orange-500', 'bg-cyan-500'
                    ];
                    const txt_colors = [
                        'text-red-800', 'text-blue-800', 'text-green-800', 'text-yellow-800',
                        'text-purple-800', 'text-pink-800', 'text-indigo-800', 'text-teal-800',
                        'text-orange-800', 'text-cyan-800'
                    ];

                    return (
                        <button
                            key={letter}
                            onClick={() => handlePlugboardClick(letter)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10
                                        ${isPaired ? colors[pairIndex % colors.length] : 'bg-blue-200'}
                                        ${isPaired ? txt_colors[pairIndex % txt_colors.length] : 'text-blue-500'}
                                        ${isSelected ? 'ring-2 ring-white' : ''}
                                        transition-all`}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}