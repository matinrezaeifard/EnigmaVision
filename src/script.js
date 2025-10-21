// The alphabet used in the Enigma machine
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Standard rotor wirings for the Enigma I machine
const rotorWirings = {
    I: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    II: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    III: "BDFHJLCPRTXVZNYEIWGAKMUSQO"
};

// Notches in the rotorWirings for stepping
const rotorNotches = {
    I: "Q",
    II: "E",
    III: "V"
};

// Reflector wiring (reflects the signal back through the rotorWirings)
const reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

// Rotor class to define rotor behavior
class Rotor {
    constructor(wiring, notch, position = "A") {
        this.wiring = wiring; // Wiring of the rotor
        this.notch = notch;   // The notch position for stepping
        this.position = position; // Current position of the rotor
    }

    // Forward pass through the rotor (encryption)
    forward(c) {
        const index = (alphabet.indexOf(c) + this.offset()) % 26;
        const encoded = this.wiring[index];
        return alphabet[(alphabet.indexOf(encoded) - this.offset() + 26) % 26];
    }

    // Backward pass through the rotor (decryption)
    backward(c) {
        const index = (alphabet.indexOf(c) + this.offset()) % 26;
        const decodedIndex = this.wiring.indexOf(alphabet[index]);
        return alphabet[(decodedIndex - this.offset() + 26) % 26];
    }

    // Calculate offset based on the current position
    offset() {
        return alphabet.indexOf(this.position);
    }

    // Step the rotor by one position
    step() {
        this.position = alphabet[(this.offset() + 1) % 26];
    }

    // Check if the rotor is at its notch position
    atNotch() {
        return this.position === this.notch;
    }

    // Clone the rotor with the current settings
    clone() {
        return new Rotor(this.wiring, this.notch, this.position);
    }
}

// PlugboardClass class to handle letter swaps
class PlugboardClass {
    constructor(pairsText) {
        this.mapping = {}; // Object to store swaps

        const used = new Set(); // Set to track used letters
        const pairs = pairsText.trim().toUpperCase().split(/\s+/);

        // Iterate over each pair and create the mapping
        for (const pair of pairs) {
            if (pair.length !== 2) continue;

            const [a, b] = pair;
            // Check if the letters are already used
            if (used.has(a) || used.has(b)) continue;

            // Add swap to mapping and mark letters as used
            this.mapping[a] = b;
            this.mapping[b] = a;
            used.add(a);
            used.add(b);
        }
    }

    // Swap letters if they exist in the mapping
    swap(c) {
        return this.mapping[c] || c;
    }
}

// Enigma machine class to manage encryption
class EnigmaMachine {
    constructor(rotorLeft, rotorMiddle, rotorRight, plugboard) {
        this.left = rotorLeft.clone();
        this.middle = rotorMiddle.clone();
        this.right = rotorRight.clone();
        this.plugboard = plugboard;
    }

    // Step all the rotorWirings as needed
    stepRotors() {
        if (this.middle.atNotch()) {
            this.middle.step();
            this.left.step();
        }
        if (this.right.atNotch()) {
            this.middle.step();
        }
        this.right.step();
    }

    // Encrypt a single character
    encryptChar(c) {
        if (!alphabet.includes(c)) return c; // Ignore non-alphabet characters

        this.stepRotors();

        // Pass through plugboard (input)
        c = this.plugboard.swap(c);

        // Pass through all rotorWirings (forward)
        c = this.right.forward(c);
        c = this.middle.forward(c);
        c = this.left.forward(c);

        // Reflect signal back through reflector
        c = reflector[alphabet.indexOf(c)];

        // Pass back through rotorWirings (backward)
        c = this.left.backward(c);
        c = this.middle.backward(c);
        c = this.right.backward(c);

        // Pass through plugboard (output)
        c = this.plugboard.swap(c);

        return c;
    }

    // Encrypt the entire text
    encrypt(text) {
        let output = "";
        for (let c of text.toUpperCase()) {
            output += this.encryptChar(c);
        }
        return output;
    }
}

// Function to create a rotor based on selection
function getRotor(name, position) {
    return new Rotor(rotorWirings[name], rotorNotches[name], position);
}

export { rotorWirings, rotorNotches, getRotor, PlugboardClass, EnigmaMachine };