export default function RotorSettings({ index, rotor, onRotorTypeChange, onRotorPosChange }) {
    const types = ['I', 'II', 'III'];
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    return (
        <div className="bg-blue-300 p-4 rounded-lg">
            <h3 className="text-blue-900 font-bold mb-2">{['Left', 'Middle', 'Right'][index]} Rotor</h3>
            <div className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Type</label>
                    <select
                        value={rotor.type}
                        onChange={(e) => onRotorTypeChange(e, index)}
                        className="w-full bg-blue-200 border border-blue-300 rounded p-1"
                    >
                        {types.map(type => (
                            <option key={type} value={type}>Type {type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">Position</label>
                    <select
                        value={rotor.position}
                        onChange={(e) => onRotorPosChange(e, index)}
                        className="w-full bg-blue-200 border border-blue-300 rounded p-1"
                    >
                        {letters.map(letter => (
                            <option key={letter} value={letter}>{letter}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}