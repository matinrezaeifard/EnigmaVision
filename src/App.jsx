import React, { useState } from 'react';
import RotorCard from './components/RotorCard';
import RotorSettings from './components/RotorSettings';
import Plugboard from './components/Plugboard';
import Lampboard from './components/Lampboard';
import Keyboard from './components/Keyboard';
import { rotorWirings, rotorNotches, getRotor, PlugboardClass, EnigmaMachine } from './script';

export default function App() {
  const { useState, useRef, useEffect } = React;

  const [rotors, setRotors] = useState([
    { type: 'I', position: 'A', curPosition: 'A', locked: false },
    { type: 'II', position: 'A', curPosition: 'A', locked: false },
    { type: 'III', position: 'A', curPosition: 'A', locked: false }
  ]);
  const [plugboard, setPlugboard] = useState([]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeLamp, setActiveLamp] = useState(null);
  const [showRotorSettings, setShowRotorSettings] = useState(false);
  const [showPlugboard, setShowPlugboard] = useState(false);
  const [selectedPlug, setSelectedPlug] = useState(null);

  // ------------------------------
  // Rotor stepping animation logic
  // ------------------------------
  const stepRotor = (index, direction = 1) => {
    const newRotors = [...rotors];
    const rotor = newRotors[index];

    if (!rotor.locked) {
      if (!rotor.curPosition) {
        rotor.curPosition = rotor.position;
      }

      const rotorChars = rotorWirings[rotor.type].split('');
      const currentIndex = rotorChars.indexOf(rotor.curPosition);

      let nextIndex = (currentIndex + direction) % rotorChars.length;

      if (nextIndex < 0) {
        nextIndex = rotorChars.length - 1;
      }

      rotor.curPosition = rotorChars[nextIndex];
      setRotors(newRotors);
    }
  };

  // ------------------------------
  // Encryption logic (pure)
  // ------------------------------
  const encryptPure = (plain, rotorState, plugPairs) => {
    const [L, M, R] = rotorState.map(r => getRotor(r.type, r.position));
    const formattedPairs = plugPairs.map(p => p.join('')).join(' ');
    const plugged = new PlugboardClass(formattedPairs);
    const enigma = new EnigmaMachine(L, M, R, plugged);
    return enigma.encrypt(plain);
  };

  // ------------------------------
  // Handle keyboard and text input
  // ------------------------------
  const handleKeyPress = char => {
    if (/^[A-Za-z]$/.test(char)) {
      setInputText(prev => prev + char.toUpperCase());
    }
  };

  const handlePlugboardClick = letter => {
    if (!selectedPlug) {
      setSelectedPlug(letter);
      return;
    }

    if (selectedPlug === letter) {
      setSelectedPlug(null);
      return;
    }

    setPlugboard(prev => {
      let updated = [...prev];
      const existing = updated.findIndex(
        pair => pair.includes(selectedPlug) || pair.includes(letter)
      );
      if (existing !== -1) updated.splice(existing, 1);
      if (updated.length < 10) updated.push([selectedPlug, letter].sort());
      return updated;
    });

    setSelectedPlug(null);
  };

  // ------------------------------
  // Sync encryption via useEffect
  // ------------------------------
  const lastInputLengthRef = useRef(0);
  const initialRotorsRef = useRef(rotors.map(r => ({ ...r })));

  useEffect(() => {
    if (inputText === '') {
      setOutputText('');
      lastInputLengthRef.current = 0;
      // Reset rotors to initial positions
      setRotors(prev =>
        prev.map(rotor => ({
          ...rotor,
          curPosition: rotor.position
        }))
      );
      return;
    }

    const encrypted = encryptPure(inputText, rotors, plugboard);
    setOutputText(encrypted);

    const direction = inputText.length > lastInputLengthRef.current ? 1 : -1;

    // Step logic based on direction
    if (direction === 1) {
      const rightAtNotch = rotors[2].curPosition === rotorNotches[rotors[2].type];
      const middleAtNotch = rotors[1].curPosition === rotorNotches[rotors[1].type];

      stepRotor(2, 1);
      if (rightAtNotch) stepRotor(1, 1);
      if (middleAtNotch) stepRotor(0, 1);

      setActiveLamp(encrypted.slice(-1));
      setTimeout(() => setActiveLamp(null), 300);
    } else if (direction === -1) {
      if (inputText.length === 0) {
        setRotors(initialRotorsRef.current.map(r => ({ ...r })));
      } else {
        const rightAtNotch = rotors[2].curPosition === rotorNotches[rotors[2].type];
        const middleAtNotch = rotors[1].curPosition === rotorNotches[rotors[1].type];

        if (middleAtNotch) stepRotor(0, -1);
        if (rightAtNotch) stepRotor(1, -1);
        stepRotor(2, -1);
      }
    }

    lastInputLengthRef.current = inputText.length;
  }, [inputText, plugboard]);

  const onRotorTypeChange = (e, index) => {
    const selectedType = e.target.value;
    const newRotors = rotors.map((rotor, i) => ({
      ...rotor,
      type: i === index ? selectedType : rotor.type,
      curPosition: rotor.position
    }));
    setInputText('');
    setRotors(newRotors);
  }

  const onRotorPosChange = (e, index) => {
    const newRotors = [...rotors];
    newRotors[index].position = e.target.value;
    newRotors[index].curPosition = e.target.value;
    setInputText('');
    setRotors(newRotors);
  }

  const onRotorChange = (index) => {
    const newRotors = [...rotors];
    newRotors[index].locked = !newRotors[index].locked;
    setRotors(newRotors);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-blue-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i data-feather="lock" className="text-amber-400"></i>
            <h1 className="text-xl text-blue-900 font-bold">EnigmaVision</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowRotorSettings(!showRotorSettings);
                if (showPlugboard) setShowPlugboard(false);
              }}
              className="flex items-center space-x-1 bg-blue-300 hover:bg-blue-400 px-3 py-1 rounded-md transition"
            >
              <i data-feather="settings"></i>
              <span className="text-blue-900 hidden md:inline">Rotor Settings</span>
            </button>
            <button
              onClick={() => {
                setShowPlugboard(!showPlugboard);
                if (showRotorSettings) setShowRotorSettings(false);
              }}
              className="flex items-center space-x-1 bg-blue-300 hover:bg-blue-400 px-3 py-1 rounded-md transition"
            >
              <i data-feather="zap"></i>
              <span className="text-blue-900 hidden md:inline">Plugboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        {/* Rotor Visualization */}
        <div className="order-1 md:order-1 w-full md:w-1/4 flex justify-center">
          <div className="bg-blue-200 p-4 rounded-lg shadow-lg w-full">
            <h2 className="text-center text-blue-600 font-bold mb-4">Enigma Machine</h2>
            <div className="flex justify-between items-center mb-8">
              {rotors.map((rotor, index) => (
                <RotorCard
                  key={index}
                  rotor={rotor}
                  index={index}
                  onRotorChange={onRotorChange}
                />
              ))}
            </div>
            <Lampboard activeLamp={activeLamp} />
          </div>
        </div>

        {/* Input/Output */}
        <div className="order-3 md:order-2 w-full md:w-2/4">
          <div className="bg-blue-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <div className="flex-grow flex flex-col gap-4">
              <div>
                <label className="block text-blue-600 mb-2">Plaintext</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.toUpperCase())}
                  className="w-full h-32 bg-blue-700 text-blue-200 border border-blue-600 rounded p-2 font-mono"
                  placeholder="Type here..."
                />
              </div>
              <div>
                <label className="block text-blue-600 mb-2">Ciphertext</label>
                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-32 bg-blue-700 text-blue-200 border border-blue-600 rounded p-2 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard */}
        <div className="order-2 md:order-3 w-full md:w-1/4">
          <Keyboard handleKeyPress={handleKeyPress} />
        </div>
      </main>

      {/* Rotor Settings Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-1/3 bg-blue-700 shadow-xl z-100 drawer-transition ${showRotorSettings ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-blue-200 font-bold">Rotor Settings</h2>
            <button onClick={() => setShowRotorSettings(false)}>
              <i data-feather="x"></i>
            </button>
          </div>
          <div className="space-y-6">
            {rotors.map((rotor, index) => (
              <RotorSettings
                key={index}
                rotor={rotor}
                index={index}
                onRotorTypeChange={onRotorTypeChange}
                onRotorPosChange={onRotorPosChange}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Plugboard Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-1/3 bg-blue-700 shadow-xl z-100 drawer-transition ${showPlugboard ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-blue-200 font-bold">Plugboard</h2>
            <button onClick={() => setShowPlugboard(false)}>
              <i data-feather="x"></i>
            </button>
          </div>
          <Plugboard
            plugboard={plugboard}
            selectedPlug={selectedPlug}
            handlePlugboardClick={handlePlugboardClick}
          />
          <div className="mt-4 text-sm">
            <p className='text-blue-200'>{plugboard.length}/10 pairs connected</p>
            <button
              className='px-2 bg-blue-200 hover:bg-blue-300 text-blue-600 border border-blue-100 rounded-xl transition'
              onClick={() => { setSelectedPlug(null); setPlugboard([]); }}
            >
              delete all
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(showRotorSettings || showPlugboard) && (
        <div
          className="fixed inset-0 bg-blue-900/70 z-30"
          onClick={() => {
            setShowRotorSettings(false);
            setShowPlugboard(false);
          }}
        ></div>
      )}
    </div>
  );
}