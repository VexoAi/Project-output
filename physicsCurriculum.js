// ==========================================================================
// PHYSICS CURRICULUM CONFIGURATION & DIALOGUES
// 18 Topics • 30-Second Multi-Phase Storyboards • Character Voices • Quizzes
// ==========================================================================

const CHARACTER_VOICES = {
    gone: { name: "G.One (Narrator)", emoji: "💙", pitch: 1.15, rate: 1.05, color: "#00f0ff" },
    raone: { name: "Ra.One (Narrator)", emoji: "💀", pitch: 0.82, rate: 1.12, color: "#ef4444" },
    teacher: { name: "Physics Teacher", emoji: "👨‍🏫", pitch: 1.0, rate: 1.02, color: "#38bdf8" }
};

const TOPIC_CONFIG = {
    inertia: {
        title: "1. LAW OF INERTIA (NEWTON 1ST)",
        sub: "ΣF = 0 ➔ CONSTANT VELOCITY (v = const)",
        level: "LVL 1 • 30s",
        quote: "An object at rest stays at rest, and an object in motion continues moving unless an external force acts on it!",
        dialogues: {
            p1: { speaker: "teacher", text: "Newton's First Law: An object at rest stays at rest until an external force is applied!" },
            p2: { speaker: "gone", text: "Inertia in action! Pushing the 500kg crate across frictionless glacier ice!" },
            p3: { speaker: "raone", text: "My 100kg hammer shattered! Frictionless velocity remains perfectly constant!" }
        }
    },
    fma: {
        title: "2. FORCE & ACCELERATION (F = ma)",
        sub: "ACCELERATION a = F / m",
        level: "LVL 2 • 30s",
        quote: "Acceleration is directly proportional to net force and inversely proportional to mass!",
        dialogues: {
            p1: { speaker: "teacher", text: "Newton's Second Law: Force equals mass times acceleration (F = ma)!" },
            p2: { speaker: "gone", text: "Rocket thrusters engaged! Lighter mass achieves massive acceleration at 25 m/s²!" },
            p3: { speaker: "raone", text: "Flattened under the 1000kg safe! Mass resists acceleration!" }
        }
    },
    action: {
        title: "3. ACTION & REACTION (NEWTON 3RD)",
        sub: "F_action = -F_reaction (EQUAL & OPPOSITE)",
        level: "LVL 3 • 30s",
        quote: "For every action, there is an equal and opposite reaction force!",
        dialogues: {
            p1: { speaker: "teacher", text: "Newton's Third Law: For every action, there is an equal and opposite reaction!" },
            p2: { speaker: "gone", text: "Firing cyan plasma beam! Notice the equal and opposite recoil power-slide!" },
            p3: { speaker: "raone", text: "Equal recoil blast! I am liquefying into a comic puddle!" }
        }
    },
    gravity: {
        title: "4. GRAVITY & FREE FALL (g = 9.8 m/s²)",
        sub: "F_g = mg • ACCELERATION INDEPENDENT OF MASS",
        level: "LVL 4 • 30s",
        quote: "All objects in a vacuum accelerate downward at the exact same rate: 9.8 m/s²!",
        dialogues: {
            p1: { speaker: "teacher", text: "Gravitational Acceleration: Earth accelerates all falling bodies at g = 9.8 m/s²!" },
            p2: { speaker: "gone", text: "Dropping apple and anvil from 20m tower! Both hit the ground simultaneously!" },
            p3: { speaker: "raone", text: "Boing! Trampoline recoil proves constant gravitational acceleration!" }
        }
    },
    momentum: {
        title: "5. CONSERVATION OF MOMENTUM (p = mv)",
        sub: "TOTAL MOMENTUM BEFORE = TOTAL AFTER",
        level: "LVL 5 • 30s",
        quote: "In a closed system, total momentum is conserved in every collision!",
        dialogues: {
            p1: { speaker: "teacher", text: "Law of Momentum Conservation: Total momentum p = mv is completely conserved!" },
            p2: { speaker: "gone", text: "Rocket skate collision! 100% velocity transfers elastically across the skatepark!" },
            p3: { speaker: "raone", text: "Spinning like a bowling pin! Momentum conserved perfectly!" }
        }
    },
    energy: {
        title: "6. WORK & KINETIC ENERGY (KE = ½mv²)",
        sub: "POTENTIAL ENERGY (mgh) ➔ KINETIC ENERGY (½mv²)",
        level: "LVL 6 • 30s",
        quote: "Energy cannot be created or destroyed, only converted from one form to another!",
        dialogues: {
            p1: { speaker: "teacher", text: "Conservation of Energy: Potential energy at the hill converts directly to kinetic energy!" },
            p2: { speaker: "gone", text: "Peak coaster speed! Kinetic energy powers smoothly through the 360 degree loop!" },
            p3: { speaker: "raone", text: "Tachometer maxed out! Mechanical energy is fully conserved!" }
        }
    },
    friction: {
        title: "7. FRICTION & DRAG FORCES (F_frict = μN)",
        sub: "OPPOSING RESISTANCE TO MOTION",
        level: "LVL 7 • 30s",
        quote: "Friction acts parallel to contacting surfaces in the direction opposing motion!",
        dialogues: {
            p1: { speaker: "teacher", text: "Frictional Resistance: Friction force F = μN always opposes motion!" },
            p2: { speaker: "gone", text: "Gliding effortlessly on ice (μ = 0.05), while wood and sand cause immense drag!" },
            p3: { speaker: "raone", text: "Sand friction and drag parachute brought me to an immediate halt!" }
        }
    },
    electricity: {
        title: "8. ELECTRICITY & CIRCUITS (V = IR)",
        sub: "OHM'S LAW • CURRENT I = V / R",
        level: "LVL 8 • 30s",
        quote: "Voltage pushes electric current through resistance following Ohm's Law V = IR!",
        dialogues: {
            p1: { speaker: "teacher", text: "Ohm's Law: Voltage pushes electric current through circuit resistance (V = IR)!" },
            p2: { speaker: "gone", text: "Knife switch closed! Electrons flow in a closed loop, powering the lightbulb!" },
            p3: { speaker: "raone", text: "ZAP! High voltage current flowing through the circuit!" }
        }
    },
    magnetism: {
        title: "9. MAGNETISM & MAGNETIC FIELDS",
        sub: "OPPOSITES ATTRACT • LIKES REPEL",
        level: "LVL 9 • 30s",
        quote: "Magnetic field lines flow from North to South, generating Lorentz forces on moving charges!",
        dialogues: {
            p1: { speaker: "teacher", text: "Magnetic Force: North and South opposite poles attract with powerful flux lines!" },
            p2: { speaker: "gone", text: "Electromagnet activated! Magnetic field curves attract iron shield!" },
            p3: { speaker: "raone", text: "Repelling magnetic poles send me into a dizzy 360 degree spin!" }
        }
    },
    doppler: {
        title: "10. SOUND WAVES & DOPPLER EFFECT",
        sub: "f' = f [v / (v ± v_source)]",
        level: "LVL 10 • 30s",
        quote: "The perceived pitch increases as a sound source approaches and decreases as it moves away!",
        dialogues: {
            p1: { speaker: "teacher", text: "Doppler Effect: Approaching sound waves compress, shifting to a higher frequency!" },
            p2: { speaker: "gone", text: "Siren sound ambulance speeding by! Concentric wavefronts compress in front!" },
            p3: { speaker: "raone", text: "High frequency wave compression shattered my resonant glass beaker!" }
        }
    },
    light: {
        title: "11. LIGHT REFRACTION & PRISMS",
        sub: "SNELL'S LAW: n₁ sin θ₁ = n₂ sin θ₂",
        level: "LVL 11 • 30s",
        quote: "Light bends when changing mediums and disperses into a continuous spectrum through prisms!",
        dialogues: {
            p1: { speaker: "teacher", text: "Snell's Law: Light bends at medium boundaries and disperses into 7 rainbow colors!" },
            p2: { speaker: "gone", text: "Triangular glass prism active! White laser beam split into 7 vibrant colors!" },
            p3: { speaker: "raone", text: "Dancing under the spectral rainbow in dark sunglasses!" }
        }
    },
    centripetal: {
        title: "12. CENTRIPETAL FORCE (Fc = mv² / r)",
        sub: "INWARD ACCELERATION IN CIRCULAR PATHS",
        level: "LVL 12 • 30s",
        quote: "Inward centripetal force continuously changes velocity direction, enabling circular orbits!",
        dialogues: {
            p1: { speaker: "teacher", text: "Centripetal Force: Inward radial force Fc = mv²/r enables 360 degree vertical loops!" },
            p2: { speaker: "gone", text: "Defying gravity! Inward radial vector arrow keeps velocity on circular track!" },
            p3: { speaker: "raone", text: "Inward acceleration verified around the vertical loop arena!" }
        }
    },
    buoyancy: {
        title: "13. ARCHIMEDES' BUOYANCY (Fb = ρVg)",
        sub: "BUOYANT FORCE EQUALS WEIGHT OF DISPLACED FLUID",
        level: "LVL 13 • 30s",
        quote: "An object submerged in a fluid experiences an upward buoyant force equal to the weight of fluid displaced!",
        dialogues: {
            p1: { speaker: "teacher", text: "Archimedes' Principle: Upward buoyant force Fb = ρVg keeps floating objects afloat!" },
            p2: { speaker: "gone", text: "Wooden block floats while heavy iron ball sinks in the hydrodynamics ocean tank!" },
            p3: { speaker: "raone", text: "Buoyancy verified with water displacement and rising bubbles!" }
        }
    },
    pendulum: {
        title: "14. SIMPLE PENDULUM & SHM",
        sub: "PERIOD T = 2π √(L / g) • PERIODIC HARMONIC MOTION",
        level: "LVL 14 • 30s",
        quote: "The period of a simple pendulum depends only on string length and gravitational acceleration!",
        dialogues: {
            p1: { speaker: "teacher", text: "Simple Harmonic Motion: Pendulum period T = 2π√(L/g) is independent of bob mass!" },
            p2: { speaker: "gone", text: "Oscillating smoothly through the grand Victorian clock tower with trapeze swing!" },
            p3: { speaker: "raone", text: "Periodic motion verified with harmonic restoring forces!" }
        }
    },
    pascal: {
        title: "15. PASCAL'S LAW & HYDRAULICS",
        sub: "P = F₁ / A₁ = F₂ / A₂ • PRESSURE TRANSMISSION",
        level: "LVL 15 • 30s",
        quote: "Pressure applied to an enclosed fluid is transmitted undiminished throughout the entire fluid!",
        dialogues: {
            p1: { speaker: "teacher", text: "Pascal's Law: Small force on small piston A1 effortlessly lifts heavy vehicle on piston A2!" },
            p2: { speaker: "gone", text: "Hydraulic multiplication! Lifting the entire 2000kg truck with fluid pressure!" },
            p3: { speaker: "raone", text: "Pascal's fluid pressure is transmitted undiminished in all directions!" }
        }
    },
    thermal: {
        title: "16. HEAT TRANSFER & THERMODYNAMICS",
        sub: "HEAT Q = mc ΔT • CONDUCTION & CONVECTION",
        level: "LVL 16 • 30s",
        quote: "Heat naturally flows from regions of higher temperature to lower temperature following the laws of thermodynamics!",
        dialogues: {
            p1: { speaker: "teacher", text: "Thermodynamics: Heat energy Q = mcΔT flows from hot boiling steam to colder matter!" },
            p2: { speaker: "gone", text: "Thermal conduction bar glowing red hot with expanding steam kettle!" },
            p3: { speaker: "raone", text: "Ouch! Heat flows directly into my gauntlet via thermal conduction!" }
        }
    },
    interference: {
        title: "17. WAVE INTERFERENCE & DOUBLE SLIT",
        sub: "CONSTRUCTIVE & DESTRUCTIVE INTERFERENCE",
        level: "LVL 17 • 30s",
        quote: "Overlapping coherent waves combine constructively to create bright fringes and destructively to create dark nodes!",
        dialogues: {
            p1: { speaker: "teacher", text: "Wave Interference: Coherent wave peaks align to produce bright constructive bands!" },
            p2: { speaker: "gone", text: "Double-slit wave diffraction confirmed with bright interference fringes!" },
            p3: { speaker: "raone", text: "Dark destructive nodes and bright constructive bands verified on screen!" }
        }
    },
    nuclear: {
        title: "18. MASS-ENERGY EQUIVALENCE (E = mc²)",
        sub: "EINSTEIN'S MASS-ENERGY & NUCLEAR FISSION",
        level: "LVL 18 • 30s",
        quote: "Mass and energy are interchangeable; a tiny amount of mass converts into colossal energy: E = mc²!",
        dialogues: {
            p1: { speaker: "teacher", text: "Einstein's Mass-Energy Equivalence: E = mc² powers the stars and nuclear reactions!" },
            p2: { speaker: "gone", text: "Mass converts directly into pure energy! H.A.R.T. Core resonance peak in tokamak chamber!" },
            p3: { speaker: "raone", text: "Colossal energy burst verified! Einstein's formula E = mc² mastered!" }
        }
    }
};

const QUIZ_DATA = {
    inertia: [
        {
            q: "What is Newton's First Law also commonly known as?",
            options: ["Law of Universal Gravitation", "Law of Inertia", "Law of Acceleration", "Law of Action & Reaction"],
            correct: 1,
            exp: "Newton's 1st Law is known as the Law of Inertia: objects resist changes in their state of motion unless acted upon by a net external force."
        },
        {
            q: "If the net external force on a moving object is zero (ΣF = 0), what happens to its velocity?",
            options: ["It accelerates rapidly", "It stops instantly", "It continues at constant velocity", "It reverses direction"],
            correct: 2,
            exp: "With zero net force, acceleration is zero, so velocity remains perfectly constant in magnitude and direction."
        }
    ],
    fma: [
        {
            q: "According to Newton's Second Law (F = ma), if force is kept constant while mass increases, acceleration will:",
            options: ["Increase proportionally", "Decrease", "Remain unchanged", "Drop to zero instantly"],
            correct: 1,
            exp: "Acceleration is inversely proportional to mass (a = F / m), so a larger mass accelerates more slowly under the same force."
        },
        {
            q: "A net force of 500 N is applied to a 20 kg mass. What is its acceleration?",
            options: ["10 m/s²", "25 m/s²", "50 m/s²", "100 m/s²"],
            correct: 1,
            exp: "Using a = F / m: a = 500 N / 20 kg = 25 m/s²."
        }
    ],
    action: [
        {
            q: "When G.One fires a cyan plasma blast forward, what direction is the reaction recoil force?",
            options: ["Upward", "Forward in the same direction", "Backward with equal magnitude", "Perpendicular to the blast"],
            correct: 2,
            exp: "Newton's Third Law: For every action, there is an equal and opposite reaction (F_action = -F_reaction)."
        },
        {
            q: "Action and reaction force pairs always act on:",
            options: ["The same single object", "Two different objects", "Only objects in vacuums", "Only moving objects"],
            correct: 1,
            exp: "Action and reaction forces act on two different interacting bodies, so they never cancel each other out."
        }
    ],
    gravity: [
        {
            q: "In a vacuum with no air resistance, dropping a 50kg anvil and an apple simultaneously from a 20m tower results in:",
            options: ["The anvil hits first", "The apple hits first", "Both hit the ground at the exact same instant", "The apple floats"],
            correct: 2,
            exp: "Near Earth's surface, all objects experience the exact same gravitational acceleration g = 9.8 m/s² regardless of mass."
        },
        {
            q: "What is the standard value of Earth's surface gravitational acceleration?",
            options: ["9.8 m/s²", "1.6 m/s²", "32.2 m/s²", "100 m/s²"],
            correct: 0,
            exp: "Standard Earth gravitational acceleration is g ≈ 9.8 m/s² directed downward toward Earth's center."
        }
    ],
    momentum: [
        {
            q: "What is the mathematical formula for linear momentum (p)?",
            options: ["p = ½ m v²", "p = m v", "p = F / m", "p = m g h"],
            correct: 1,
            exp: "Momentum is the product of mass and velocity: p = mv (measured in kg·m/s)."
        },
        {
            q: "In a closed system with no external forces, total momentum during an elastic collision is:",
            options: ["Completely lost to heat", "Doubled after impact", "Strictly conserved", "Reduced by half"],
            correct: 2,
            exp: "The Law of Conservation of Momentum states that total momentum before collision equals total momentum after."
        }
    ],
    energy: [
        {
            q: "At the highest peak of a rollercoaster hill before it drops, what form of energy is at its maximum?",
            options: ["Kinetic Energy (KE)", "Gravitational Potential Energy (PE)", "Thermal Energy", "Chemical Energy"],
            correct: 1,
            exp: "At maximum height h, Potential Energy PE = mgh is maximized. It converts into Kinetic Energy as the coaster descends."
        },
        {
            q: "If an object's speed doubles (2x), its kinetic energy (KE = ½mv²) will:",
            options: ["Double (2x)", "Stay the same", "Quadruple (4x)", "Increase by 8x"],
            correct: 2,
            exp: "Because kinetic energy depends on velocity squared (v²), doubling velocity multiplies KE by 2² = 4."
        }
    ],
    friction: [
        {
            q: "In which direction does friction force always act relative to the sliding surface?",
            options: ["In the same direction of motion", "Opposite to the direction of motion", "Perpendicular to the surface", "Straight downward"],
            correct: 1,
            exp: "Friction acts parallel to contacting surfaces in the direction directly opposing relative motion."
        },
        {
            q: "Which surface typically has the lowest coefficient of friction (μ)?",
            options: ["Dry Sand (μ = 0.8)", "Polished Wood (μ = 0.3)", "Glacier Ice (μ = 0.05)", "Rubber on Concrete (μ = 0.9)"],
            correct: 2,
            exp: "Smooth glacier ice provides minimal microscopic resistance, with μ ≈ 0.05 enabling effortless gliding."
        }
    ],
    electricity: [
        {
            q: "What is Ohm's Law formula relating Voltage (V), Current (I), and Resistance (R)?",
            options: ["V = I / R", "V = I × R", "I = V × R", "R = V × I"],
            correct: 1,
            exp: "Ohm's Law states V = I × R (Voltage equals Current multiplied by Resistance)."
        },
        {
            q: "What is required for continuous electric current to flow and power a lightbulb?",
            options: ["An open broken circuit", "A complete closed conductive loop", "Zero voltage source", "Infinite resistance"],
            correct: 1,
            exp: "Electrons require an unbroken closed conducting loop connecting the voltage source across the load."
        }
    ],
    magnetism: [
        {
            q: "Magnetic field lines outside a permanent magnet always flow from:",
            options: ["North pole to South pole", "South pole to North pole", "Center outward in circles", "Negative to positive"],
            correct: 0,
            exp: "By convention, magnetic flux lines emerge from the North pole and curve into the South pole."
        },
        {
            q: "When bringing two North poles (N - N) close together, they will:",
            options: ["Attract strongly", "Repel each other", "Neutralize completely", "Rotate without force"],
            correct: 1,
            exp: "Fundamental rule of magnetism: Like poles repel, and opposite poles attract."
        }
    ],
    doppler: [
        {
            q: "When an ambulance siren approaches you, what happens to the perceived sound pitch/frequency?",
            options: ["It decreases (lower pitch)", "It increases (higher pitch)", "It remains completely unchanged", "It vanishes"],
            correct: 1,
            exp: "As the sound source approaches, wavefronts compress together, increasing the perceived frequency and pitch."
        },
        {
            q: "The Doppler Effect occurs whenever there is:",
            options: ["High air temperature", "Relative motion between source and observer", "Complete silence in vacuum", "Zero wave speed"],
            correct: 1,
            exp: "Relative motion compresses wavefronts in front of the source and stretches them behind."
        }
    ],
    light: [
        {
            q: "When white laser light enters a triangular glass prism, why does it separate into 7 rainbow colors?",
            options: ["The glass dyes the light", "Different colors refract at different angles due to wavelength dispersion", "Light speed is infinite in glass", "Prisms emit ultraviolet rays"],
            correct: 1,
            exp: "Optical dispersion: higher frequency violet light refracts more strongly than red light, fanning into a spectrum."
        },
        {
            q: "What mathematical law governs the refraction of light at the boundary between two media?",
            options: ["Newton's Law", "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂", "Coulomb's Law", "Hooke's Law"],
            correct: 1,
            exp: "Snell's Law determines the angle of refraction based on the refractive indices n1 and n2."
        }
    ],
    centripetal: [
        {
            q: "In which direction does centripetal force point during circular vertical loops?",
            options: ["Tangential to the circle", "Radially inward toward the center", "Radially outward away from the center", "Straight upward"],
            correct: 1,
            exp: "Centripetal means 'center-seeking'; it constantly pulls velocity inward perpendicular to the motion path."
        },
        {
            q: "What is the formula for centripetal force (Fc)?",
            options: ["Fc = m v / r", "Fc = m v² / r", "Fc = ½ m v²", "Fc = m g h"],
            correct: 1,
            exp: "Centripetal force Fc = mv²/r provides the inward acceleration a_c = v²/r for circular motion."
        }
    ],
    buoyancy: [
        {
            q: "According to Archimedes' Principle, the upward buoyant force (Fb) on a submerged object equals:",
            options: ["The total weight of the object", "The weight of the fluid displaced by the object", "The surface area of the tank", "Zero in deep water"],
            correct: 1,
            exp: "Archimedes' Principle states that Fb = ρ_fluid × V_submerged × g (weight of displaced fluid)."
        },
        {
            q: "Why does a 50kg solid lead ball sink in water while a wooden block floats?",
            options: ["Lead is magnetic", "Lead density is greater than water, while wood density is less than water", "Wood repels gravity", "Lead dissolves in water"],
            correct: 1,
            exp: "An object floats if its average density is less than fluid density (ρ_wood < ρ_water), and sinks if denser."
        }
    ],
    pendulum: [
        {
            q: "The period of oscillation of a simple pendulum (T = 2π√(L/g)) depends primarily on:",
            options: ["The mass of the bob", "The length of the string and gravity", "The color of the pendulum", "The room temperature"],
            correct: 1,
            exp: "Simple pendulum period is independent of bob mass; it depends only on string length L and gravity g."
        },
        {
            q: "At the lowest point (equilibrium) of a swinging pendulum, which quantity is at its maximum?",
            options: ["Potential Energy", "Kinetic Energy and Speed", "Restoring Force", "String Tension is zero"],
            correct: 1,
            exp: "At the lowest point, all potential energy has converted into kinetic energy, maximizing speed."
        }
    ],
    pascal: [
        {
            q: "Pascal's Law states that pressure applied to an enclosed fluid is transmitted:",
            options: ["Only in the downward direction", "Undiminished in all directions throughout the fluid", "Only along the container walls", "Lost as friction"],
            correct: 1,
            exp: "Pascal's Principle: Pressure changes in an enclosed incompressible fluid are transmitted equally throughout."
        },
        {
            q: "How does a hydraulic lift raise a 2000kg truck using a small input force?",
            options: ["By multiplying force across a larger output piston area (F2 = F1 × A2/A1)", "By decreasing fluid pressure", "By creating new mass", "By eliminating gravity"],
            correct: 0,
            exp: "Because pressure P = F1/A1 = F2/A2 is equal, a larger area A2 yields a proportionally larger output force F2."
        }
    ],
    thermal: [
        {
            q: "Heat energy naturally flows from:",
            options: ["Cold bodies to hot bodies", "Regions of higher temperature to lower temperature", "Low pressure to high pressure", "Inside atoms outward only"],
            correct: 1,
            exp: "The 2nd Law of Thermodynamics states heat spontaneously transfers from higher temperature to lower temperature."
        },
        {
            q: "Heat transfer occurring directly through solid matter via molecular vibration is called:",
            options: ["Radiation", "Thermal Conduction", "Convection", "Nuclear fission"],
            correct: 1,
            exp: "Thermal conduction is the transfer of heat through stationary matter by physical contact."
        }
    ],
    interference: [
        {
            q: "In Young's Double-Slit experiment, bright bands on the detector screen are produced by:",
            options: ["Destructive interference", "Constructive interference (waves in phase)", "Total internal reflection", "Absorption"],
            correct: 1,
            exp: "Constructive interference occurs when wave crests align in phase (path difference = nλ), amplifying intensity."
        },
        {
            q: "Dark nodes on an interference pattern occur when overlapping waves are:",
            options: ["Completely in phase", "180° out of phase (crest meets trough)", "Polarized at 90°", "Amplified"],
            correct: 1,
            exp: "Destructive interference happens when wave peaks cancel troughs, resulting in zero net wave amplitude."
        }
    ],
    nuclear: [
        {
            q: "In Einstein's famous equation E = mc², what does the letter 'c' represent?",
            options: ["Speed of Sound", "Speed of Light in vacuum (3 × 10⁸ m/s)", "Centripetal acceleration", "Coulomb's constant"],
            correct: 1,
            exp: "c represents the universal speed of light (≈ 300,000,000 m/s). Because c² is enormous, tiny mass yields colossal energy."
        },
        {
            q: "What fundamental process converts mass directly into pure energy in the Sun and stars?",
            options: ["Chemical combustion", "Nuclear Fusion", "Mechanical friction", "Magnetic induction"],
            correct: 1,
            exp: "Nuclear fusion fuses light nuclei into heavier nuclei, releasing mass difference Δm as pure energy according to E = mc²."
        }
    ]
};

// Expose globally
if (typeof window !== "undefined") {
    window.CHARACTER_VOICES = CHARACTER_VOICES;
    window.TOPIC_CONFIG = TOPIC_CONFIG;
    window.QUIZ_DATA = QUIZ_DATA;
}
