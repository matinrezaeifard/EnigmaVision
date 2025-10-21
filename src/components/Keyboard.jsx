export default function Keyboard({ handleKeyPress }) {
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    return (
        <div className="bg-blue-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-center text-blue-200 font-bold mb-4">Keyboard</h2>
            <div className="space-y-2">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                        {row.map(char => (
                            <button
                                key={char}
                                onClick={() => handleKeyPress(char)}
                                className="w-8 h-10 bg-blue-700 hover:bg-blue-600 text-blue-200 rounded flex items-center justify-center font-bold transition"
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}