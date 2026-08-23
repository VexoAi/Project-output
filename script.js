// ======================================================
// SMART TEACHER CHARACTER INTERACTIVE ENGINE
// ======================================================

// State Management
const state = {
    pose: 'idle',           // idle, teach_board, talk_gestures, wave, point_up, explain, read, write, laptop_desk, backpack_pose, thumbs_up, walk
    expression: 'happy',    // happy, talking, surprised, nervous, sad, focused
    objects: {
        book: false,
        pointer: false,
        pen: false,
        laptop: false,
        backpack: false,
        plant: false,
        desk: false
    },
    isListening: false,
    isSpeaking: false,
    talkFrame: 0,
    talkInterval: null
};

// Global Session & First-Command Tracking
let activeSessionId = 0;
let activeLessonTimer = null;
let isFirstCommandExecuted = false;

// SVG Character Template Render Engine Elements
let characterContainer = null;
let deskOverlay = null;
let equippedSummaryList = null;
let currentGestureName = null;

// Speech Recognition & Synthesis Init
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let speechRestartTimeout = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;
}

// Render Character SVG
function renderCharacter() {
    characterContainer = characterContainer || document.getElementById('character-container');
    deskOverlay = deskOverlay || document.getElementById('desk-overlay');
    equippedSummaryList = equippedSummaryList || document.getElementById('equippedObjectsList');
    currentGestureName = currentGestureName || document.getElementById('currentGestureName');

    const isSitting = state.pose === 'laptop_desk';
    const isTeaching = state.pose === 'teach_board';
    const isWriting = state.pose === 'write';
    const hasBackpack = state.objects.backpack || state.pose === 'backpack_pose';
    const hasBook = state.objects.book || state.pose === 'read' || state.pose === 'explain' || isTeaching;
    const hasPointer = state.objects.pointer || state.pose === 'explain' || isTeaching;
    const hasPen = state.objects.pen || isWriting;
    const hasLaptop = state.objects.laptop || state.pose === 'laptop_desk';
    const hasDesk = state.objects.desk || state.pose === 'laptop_desk';
    const hasPlant = state.objects.plant;

    // Control Whiteboard visibility based on teaching state
    const whiteboardEl = document.getElementById('whiteboard');
    if (whiteboardEl) {
        if (isTeaching || isWriting || state.pose === 'explain' || state.pose === 'talk_gestures' || state.pose === 'present_front') {
            whiteboardEl.classList.add('visible-board');
        }
    }

    // Toggle container classes for animations
    if (characterContainer) {
        characterContainer.className = 'character-wrapper';
        if (state.pose === 'idle') characterContainer.classList.add('idle-anim');
        if (state.pose === 'wave') characterContainer.classList.add('wave-active');
        if (isWriting) characterContainer.classList.add('writing-active');
        if (isTeaching) characterContainer.classList.add('teaching-board-active');
        if (state.pose === 'talk_gestures' || state.pose === 'present_front') characterContainer.classList.add('presenting-frontal-active');
    }

    // Build SVG
    const svgHTML = `
    <svg class="teacher-svg" viewBox="0 0 500 650" style="overflow: visible;" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- Skin Gradient -->
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffdbac"/>
                <stop offset="100%" stop-color="#f1c27d"/>
            </linearGradient>
            
            <!-- Hair Gradient -->
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#2d2d2d"/>
                <stop offset="100%" stop-color="#121212"/>
            </linearGradient>

            <!-- Shirt Gradient -->
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#e2e8f0"/>
            </linearGradient>

            <!-- Tie Gradient -->
            <linearGradient id="tieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1e3a8a"/>
                <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>

            <!-- Pants Gradient -->
            <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>

            <!-- Shoe Gradient -->
            <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#5c3a21"/>
                <stop offset="100%" stop-color="#362112"/>
            </linearGradient>

            <!-- Book Cover Gradient -->
            <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1d4ed8"/>
                <stop offset="100%" stop-color="#1e3a8a"/>
            </linearGradient>

            <!-- Soft Drop Shadow -->
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" flood-opacity="0.3"/>
            </filter>

            <!-- Glowing Laser Pointer Filter -->
            <filter id="laserGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <!-- Floor Shadow -->
        <ellipse cx="250" cy="${isSitting ? '580' : '620'}" rx="${isSitting ? '140' : '105'}" ry="14" fill="rgba(0,0,0,0.35)" />

        <!-- FULL CHARACTER BODY -->
        <g id="teacher-full-character">

        <!-- BACKPACK (Rendered Behind/On Back if Equipped) -->
        ${hasBackpack ? `
        <g id="backpack-bg" filter="url(#shadow)">
            <rect x="175" y="240" width="150" height="180" rx="30" fill="#2563eb"/>
            <rect x="195" y="260" width="110" height="130" rx="15" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/>
            <path d="M 210 240 Q 250 200 290 240" stroke="#1e40af" stroke-width="12" fill="none" stroke-linecap="round"/>
        </g>
        ` : ''}

        <!-- LOWER BODY / LEGS -->
        <g id="lower-body">
            ${isSitting ? `
                <!-- Seated Legs Pose -->
                <rect x="190" y="450" width="45" height="110" rx="10" fill="url(#pantsGrad)"/>
                <rect x="265" y="450" width="45" height="110" rx="10" fill="url(#pantsGrad)"/>
                <path d="M 180 550 L 235 550 C 240 575 175 580 180 550 Z" fill="url(#shoeGrad)"/>
                <path d="M 260 550 L 315 550 C 320 575 255 580 260 550 Z" fill="url(#shoeGrad)"/>
            ` : isTeaching ? `
                <!-- Full Backside Standing Legs with Back Pockets -->
                <rect x="200" y="425" width="45" height="175" rx="10" fill="url(#pantsGrad)"/>
                <rect x="255" y="425" width="45" height="175" rx="10" fill="url(#pantsGrad)"/>
                <path d="M 208 438 L 238 438 L 238 468 L 223 476 L 208 468 Z" fill="none" stroke="#334155" stroke-width="2"/>
                <path d="M 262 438 L 292 438 L 292 468 L 277 476 L 262 468 Z" fill="none" stroke="#334155" stroke-width="2"/>
                <path d="M 195 590 L 245 590 C 248 615 192 615 195 590 Z" fill="url(#shoeGrad)"/>
                <path d="M 255 590 L 305 590 C 308 615 252 615 255 590 Z" fill="url(#shoeGrad)"/>
                <line x1="220" y1="590" x2="220" y2="608" stroke="#1c1917" stroke-width="2"/>
                <line x1="280" y1="590" x2="280" y2="608" stroke="#1c1917" stroke-width="2"/>
            ` : state.pose === 'walk' ? `
                <!-- Walking Legs Pose -->
                <g transform="rotate(-15, 250, 430)">
                    <rect x="205" y="430" width="40" height="160" rx="12" fill="url(#pantsGrad)"/>
                    <path d="M 200 580 L 250 580 C 255 605 190 605 200 580 Z" fill="url(#shoeGrad)"/>
                </g>
                <g transform="rotate(18, 250, 430)">
                    <rect x="255" y="430" width="40" height="160" rx="12" fill="url(#pantsGrad)"/>
                    <path d="M 255 580 L 305 580 C 310 605 245 605 255 580 Z" fill="url(#shoeGrad)"/>
                </g>
            ` : `
                <!-- Normal Standing Legs -->
                <rect x="205" y="430" width="40" height="170" rx="12" fill="url(#pantsGrad)"/>
                <rect x="255" y="430" width="40" height="170" rx="12" fill="url(#pantsGrad)"/>
                <path d="M 195 590 L 245 590 C 250 615 185 615 195 590 Z" fill="url(#shoeGrad)"/>
                <path d="M 255 590 L 305 590 C 310 615 245 615 255 590 Z" fill="url(#shoeGrad)"/>
            `}
        </g>

        <!-- UPPER BODY / TORSO -->
        <g id="upper-body" filter="url(#shadow)">
            ${isTeaching ? `
                <!-- Clean White Shirt Back (No Tie / No Front Buttons) -->
                <path d="M 180 220 L 320 220 L 330 420 L 170 420 Z" fill="url(#shirtGrad)"/>
                <path d="M 180 250 Q 250 258 320 250" stroke="#cbd5e1" stroke-width="2" fill="none"/>
                <line x1="250" y1="255" x2="250" y2="420" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="8,6"/>
                <rect x="170" y="415" width="160" height="16" fill="#1e1e1e"/>
                <rect x="210" y="415" width="6" height="16" fill="#334155"/>
                <rect x="290" y="415" width="6" height="16" fill="#334155"/>
                <path d="M 215 220 C 235 228, 265 228, 285 220 L 295 222 L 250 212 L 205 222 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
            ` : `
                <!-- Normal Frontal Shirt -->
                <path d="M 185 240 L 315 240 L 330 430 L 170 430 Z" fill="url(#shirtGrad)"/>
                <line x1="250" y1="240" x2="250" y2="430" stroke="#cbd5e1" stroke-width="2"/>
                <circle cx="250" cy="300" r="3" fill="#94a3b8"/>
                <circle cx="250" cy="340" r="3" fill="#94a3b8"/>
                <circle cx="250" cy="380" r="3" fill="#94a3b8"/>
                <rect x="275" y="270" width="28" height="32" rx="3" fill="none" stroke="#cbd5e1" stroke-width="2"/>
                <rect x="170" y="420" width="160" height="16" fill="#1e1e1e"/>
                <rect x="238" y="417" width="24" height="22" fill="#d97706" rx="2"/>
                <rect x="242" y="421" width="16" height="14" fill="#fbbf24" rx="1"/>
                <polygon points="215,240 250,265 230,240" fill="#e2e8f0"/>
                <polygon points="285,240 250,265 270,240" fill="#e2e8f0"/>
                <polygon points="242,248 258,248 263,390 250,405 237,390" fill="url(#tieGrad)"/>
            `}
        </g>

        <!-- LEFT ARM -->
        <g id="left-arm">
            ${isTeaching ? `
                <!-- Left Hand Holding Book at Left Hip (Back View) -->
                <path d="M 185 225 Q 140 280 165 345" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <circle cx="165" cy="345" r="15" fill="url(#skinGrad)"/>
            ` : state.pose === 'talk_gestures' || state.pose === 'present_front' ? `
                <!-- Natural Conversational Left Arm with Open Explaining Hand -->
                <path d="M 185 240 Q 135 285 175 315" stroke="url(#shirtGrad)" stroke-width="28" fill="none" stroke-linecap="round"/>
                <circle cx="175" cy="315" r="14" fill="url(#skinGrad)"/>
                <path d="M 170 308 C 180 302, 188 312, 178 322" stroke="#d97706" stroke-width="2" fill="none"/>
            ` : state.pose === 'read' ? `
                <!-- Reading Book Pose Left Arm -->
                <path d="M 185 240 Q 150 320 220 330" stroke="url(#shirtGrad)" stroke-width="32" fill="none" stroke-linecap="round"/>
                <circle cx="220" cy="330" r="16" fill="url(#skinGrad)"/>
            ` : state.pose === 'explain' || hasBook ? `
                <!-- Holding Book under left arm -->
                <path d="M 185 240 Q 145 310 200 340" stroke="url(#shirtGrad)" stroke-width="32" fill="none" stroke-linecap="round"/>
                <circle cx="200" cy="340" r="16" fill="url(#skinGrad)"/>
            ` : `
                <!-- Relaxed Left Arm -->
                <path d="M 185 240 L 160 360" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <circle cx="160" cy="370" r="15" fill="url(#skinGrad)"/>
            `}
        </g>

        <!-- OBJECT: BOOK (Rendered for teaching or reading) -->
        ${hasBook && !isTeaching && state.pose !== 'talk_gestures' && state.pose !== 'present_front' ? `
            ${state.pose === 'read' ? `
                <!-- Open Book in Hands -->
                <g transform="translate(200, 280)" filter="url(#shadow)">
                    <path d="M 0 20 Q 50 0 100 20 L 100 80 Q 50 60 0 80 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
                    <path d="M 100 20 Q 150 0 200 20 L 200 80 Q 150 60 100 80 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
                    <path d="M -5 22 Q 50 2 100 22 L 100 85 Q 50 65 -5 85 Z" fill="url(#bookGrad)" opacity="0.4"/>
                    <line x1="20" y1="35" x2="80" y2="35" stroke="#94a3b8" stroke-width="2"/>
                    <line x1="20" y1="45" x2="75" y2="45" stroke="#94a3b8" stroke-width="2"/>
                    <line x1="20" y1="55" x2="85" y2="55" stroke="#94a3b8" stroke-width="2"/>
                    <line x1="120" y1="35" x2="180" y2="35" stroke="#94a3b8" stroke-width="2"/>
                    <line x1="120" y1="45" x2="175" y2="45" stroke="#94a3b8" stroke-width="2"/>
                </g>
            ` : `
                <!-- Closed Book held under Left Arm -->
                <g transform="translate(145, 300) rotate(10)" filter="url(#shadow)">
                    <rect x="0" y="0" width="70" height="95" rx="5" fill="url(#bookGrad)"/>
                    <rect x="62" y="0" width="8" height="95" fill="#f8fafc"/>
                    <rect x="15" y="20" width="40" height="6" fill="#fbbf24" rx="2"/>
                    <line x1="15" y1="40" x2="45" y2="40" stroke="#93c5fd" stroke-width="3"/>
                </g>
            `}
        ` : ''}

        <!-- RIGHT ARM & HELD OBJECTS (Pointer / Pen / Gestures) -->
        <g id="right-arm">
            ${isTeaching ? `
                <!-- Articulated Flexible Teaching Arm with Natural Elbow Curve -->
                <g id="pointer-arm-group" class="teaching-arm-flexible">
                    <path d="M 310 230 C 335 252, 362 258, 395 246 C 418 238, 432 226, 442 216" stroke="url(#shirtGrad)" stroke-width="28" fill="none" stroke-linecap="round"/>
                    <path d="M 436 210 L 446 222" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
                    
                    <!-- Wrist & Hand Gripping Pointer Stick -->
                    <circle cx="446" cy="214" r="14" fill="url(#skinGrad)"/>
                    <path d="M 444 206 C 452 208, 454 216, 448 222" stroke="#d97706" stroke-width="2" fill="none"/>
                    
                    <!-- Flexible Extended Teacher Pointer Stick -->
                    <g id="pointer-stick-element" transform="translate(440, 210) rotate(-8)">
                        <rect x="0" y="-4" width="225" height="7" rx="3" fill="#854d0e" stroke="#713f12" stroke-width="1"/>
                        <rect x="0" y="-5" width="42" height="9" rx="3" fill="#451a03"/>
                        <polygon points="225,-5 242,0 225,5" fill="#fbbf24"/>
                        <circle cx="244" cy="0" r="7" fill="#00e5ff" filter="url(#laserGlow)"/>
                        <circle cx="244" cy="0" r="3" fill="#ffffff"/>
                    </g>
                </g>
            ` : state.pose === 'talk_gestures' || state.pose === 'present_front' ? `
                <!-- Natural Conversational Right Arm with Open Gesturing Hand -->
                <path d="M 315 240 Q 365 285 325 315" stroke="url(#shirtGrad)" stroke-width="28" fill="none" stroke-linecap="round"/>
                <circle cx="325" cy="315" r="14" fill="url(#skinGrad)"/>
                <path d="M 320 308 C 330 302, 338 312, 328 322" stroke="#d97706" stroke-width="2" fill="none"/>
            ` : state.pose === 'wave' ? `
                <!-- Waving Arm -->
                <path d="M 315 240 Q 360 170 340 120" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <g transform="translate(340, 110)">
                    <circle cx="0" cy="0" r="16" fill="url(#skinGrad)"/>
                    <rect x="-12" y="-18" width="6" height="16" rx="3" fill="url(#skinGrad)"/>
                    <rect x="-5" y="-22" width="6" height="20" rx="3" fill="url(#skinGrad)"/>
                    <rect x="2" y="-20" width="6" height="18" rx="3" fill="url(#skinGrad)"/>
                    <rect x="9" y="-16" width="5" height="14" rx="3" fill="url(#skinGrad)"/>
                </g>
            ` : state.pose === 'point_up' ? `
                <!-- Pointing Up Arm -->
                <path d="M 315 240 Q 370 200 360 120" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <g transform="translate(360, 110)">
                    <circle cx="0" cy="10" r="15" fill="url(#skinGrad)"/>
                    <rect x="-3" y="-18" width="7" height="24" rx="3" fill="url(#skinGrad)"/>
                </g>
            ` : state.pose === 'explain' || hasPointer ? `
                <!-- Holding Pointer Arm -->
                <path d="M 315 240 Q 380 280 400 240" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <circle cx="400" cy="240" r="16" fill="url(#skinGrad)"/>
                <g transform="translate(390, 240) rotate(-35)">
                    <rect x="0" y="-4" width="140" height="8" rx="2" fill="#854d0e"/>
                    <polygon points="140,-6 155,0 140,6" fill="#fbbf24"/>
                </g>
            ` : isWriting || hasPen ? `
                <!-- Writing Arm Extended Toward Board with Marker -->
                <path d="M 315 240 Q 380 200 430 170" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <circle cx="430" cy="170" r="15" fill="url(#skinGrad)"/>
                <g transform="translate(420, 160) rotate(15)">
                    <rect x="0" y="0" width="10" height="42" rx="3" fill="#1e293b"/>
                    <polygon points="0,42 10,42 5,54" fill="#00e5ff"/>
                </g>
            ` : state.pose === 'thumbs_up' ? `
                <!-- Thumbs Up Arm -->
                <path d="M 315 240 Q 370 270 375 230" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <g transform="translate(375, 220)">
                    <circle cx="0" cy="8" r="14" fill="url(#skinGrad)"/>
                    <rect x="-3" y="-14" width="8" height="18" rx="4" fill="url(#skinGrad)"/>
                </g>
            ` : state.pose === 'read' ? `
                <!-- Reading Arm Right -->
                <path d="M 315 240 Q 350 320 280 330" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <circle cx="280" cy="330" r="16" fill="url(#skinGrad)"/>
            ` : `
                <!-- Relaxed Right Arm -->
                <path d="M 315 240 L 340 360" stroke="url(#shirtGrad)" stroke-width="30" fill="none" stroke-linecap="round"/>
                <circle cx="340" cy="370" r="15" fill="url(#skinGrad)"/>
            `}
        </g>

        <!-- HEAD & HAIR (FULL BACK OR FRONT VIEW) -->
        <g id="head-group" filter="url(#shadow)">
            ${isTeaching ? `
                <!-- Neck turned towards right -->
                <rect x="236" y="180" width="34" height="42" fill="url(#skinGrad)" rx="6"/>

                <!-- Head Base in Side Profile facing Right -->
                <ellipse cx="258" cy="165" rx="46" ry="52" fill="url(#skinGrad)"/>
                <path d="M 248 118 C 272 118, 296 130, 296 150 C 296 170, 286 190, 258 202 C 238 202, 222 188, 220 165 Z" fill="url(#skinGrad)"/>

                <!-- Snug Pompadour Hair Fitted to Skull -->
                <path d="M 218 180 C 210 155, 212 125, 228 102 C 242 82, 268 80, 288 88 C 304 95, 310 110, 300 125 C 288 120, 274 122, 262 130 L 260 158 L 250 158 L 252 136 C 240 142, 230 158, 224 180 Z" fill="url(#hairGrad)"/>
                <path d="M 240 100 Q 268 90 292 98" stroke="#3a3a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M 248 114 Q 272 106 295 116" stroke="#3a3a3a" stroke-width="2" fill="none" stroke-linecap="round"/>

                <!-- Left Ear (Side Profile) -->
                <ellipse cx="244" cy="165" rx="8" ry="12" fill="url(#skinGrad)"/>
                <path d="M 244 161 C 241 164, 241 168, 244 171" stroke="#d97706" stroke-width="2" fill="none"/>

                <!-- Eyebrow (Side Profile) -->
                <path d="M 276 135 Q 288 128 298 134" stroke="#121212" stroke-width="3.5" fill="none" stroke-linecap="round"/>

                <!-- Eye looking Right at Whiteboard -->
                <ellipse cx="288" cy="150" rx="7" ry="7" fill="#ffffff"/>
                <circle cx="291" cy="150" r="3.8" fill="#1e293b"/>
                <circle cx="292.5" cy="148.5" r="1.5" fill="#ffffff"/>

                <!-- Glasses (Side Profile with temple arm to ear) -->
                <rect x="278" y="139" width="20" height="20" rx="4.5" fill="none" stroke="#000000" stroke-width="3"/>
                <line x1="244" y1="148" x2="278" y2="148" stroke="#000000" stroke-width="3"/>
                <line x1="281" y1="143" x2="290" y2="152" stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>

                <!-- Nose (Side Profile pointing to Board) -->
                <path d="M 296 150 Q 306 160 298 165" stroke="#d97706" stroke-width="2.2" fill="none" stroke-linecap="round"/>

                <!-- Mouth / Smile (Side Profile) -->
                ${state.expression === 'talking' || (state.isSpeaking && state.talkFrame % 2 === 0) ? `
                    <path d="M 280 176 Q 292 192 299 176 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
                    <path d="M 283 177 Q 292 181 298 177" fill="#ffffff"/>
                ` : `
                    <path d="M 280 178 Q 292 188 298 178" stroke="#7f1d1d" stroke-width="2.8" fill="none" stroke-linecap="round"/>
                    <path d="M 282 179 Q 292 186 297 179 Z" fill="#ffffff" opacity="0.85"/>
                `}
            ` : `
                <!-- Neck -->
                <rect x="232" y="200" width="36" height="45" fill="url(#skinGrad)" rx="8"/>

                <!-- Hair Back -->
                <path d="M 185 150 Q 250 70 315 150 L 315 180 L 185 180 Z" fill="url(#hairGrad)"/>

                <!-- Face Base -->
                <ellipse cx="250" cy="165" rx="55" ry="60" fill="url(#skinGrad)"/>

                <!-- Ears -->
                <ellipse cx="193" cy="168" rx="10" ry="14" fill="url(#skinGrad)"/>
                <ellipse cx="307" cy="168" rx="10" ry="14" fill="url(#skinGrad)"/>

                <!-- Hair Top Styling (Smart Pompadour) -->
                <path d="M 180 150 C 180 80, 230 65, 270 70 C 310 75, 325 100, 320 150 C 300 120, 270 120, 250 125 C 220 130, 200 125, 180 150 Z" fill="url(#hairGrad)"/>

                <!-- EYEBROWS -->
                <g id="eyebrows">
                    ${state.expression === 'surprised' ? `
                        <path d="M 215 130 Q 230 115 245 130" stroke="#121212" stroke-width="4" fill="none" stroke-linecap="round"/>
                        <path d="M 255 130 Q 270 115 285 130" stroke="#121212" stroke-width="4" fill="none" stroke-linecap="round"/>
                    ` : state.expression === 'sad' || state.expression === 'nervous' ? `
                        <path d="M 215 130 Q 230 140 245 130" stroke="#121212" stroke-width="4" fill="none" stroke-linecap="round"/>
                        <path d="M 255 130 Q 270 140 285 130" stroke="#121212" stroke-width="4" fill="none" stroke-linecap="round"/>
                    ` : state.expression === 'focused' ? `
                        <path d="M 215 135 L 245 140" stroke="#121212" stroke-width="4" stroke-linecap="round"/>
                        <path d="M 255 140 L 285 135" stroke="#121212" stroke-width="4" stroke-linecap="round"/>
                    ` : `
                        <path d="M 215 135 Q 230 128 245 135" stroke="#121212" stroke-width="4" fill="none" stroke-linecap="round"/>
                        <path d="M 255 135 Q 270 128 285 135" stroke="#121212" stroke-width="4" fill="none" stroke-linecap="round"/>
                    `}
                </g>

                <!-- EYES -->
                <g id="eyes">
                    <ellipse cx="230" cy="152" rx="11" ry="9" fill="#ffffff"/>
                    <ellipse cx="270" cy="152" rx="11" ry="9" fill="#ffffff"/>
                    <circle cx="231" cy="152" r="5" fill="#1e293b"/>
                    <circle cx="271" cy="152" r="5" fill="#1e293b"/>
                    <circle cx="229" cy="150" r="2" fill="#ffffff"/>
                    <circle cx="269" cy="150" r="2" fill="#ffffff"/>
                </g>

                <!-- GLASSES -->
                <g id="glasses">
                    <rect x="212" y="140" width="36" height="24" rx="6" fill="none" stroke="#000000" stroke-width="3.5"/>
                    <rect x="252" y="140" width="36" height="24" rx="6" fill="none" stroke="#000000" stroke-width="3.5"/>
                    <line x1="248" y1="150" x2="252" y2="150" stroke="#000000" stroke-width="3.5"/>
                    <line x1="195" y1="148" x2="212" y2="148" stroke="#000000" stroke-width="3.5"/>
                    <line x1="288" y1="148" x2="305" y2="148" stroke="#000000" stroke-width="3.5"/>
                    <line x1="216" y1="144" x2="228" y2="156" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                    <line x1="256" y1="144" x2="268" y2="156" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                </g>

                <!-- NOSE -->
                <path d="M 250 155 Q 247 168 252 170" stroke="#d97706" stroke-width="2.5" fill="none" stroke-linecap="round"/>

                <!-- MOUTH -->
                <g id="mouth">
                    ${state.expression === 'talking' || (state.isSpeaking && state.talkFrame % 2 === 0) ? `
                        <path d="M 235 180 Q 250 198 265 180 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
                        <path d="M 240 181 Q 250 185 260 181" fill="#ffffff"/>
                    ` : state.expression === 'surprised' ? `
                        <ellipse cx="250" cy="184" rx="8" ry="11" fill="#991b1b"/>
                    ` : state.expression === 'sad' ? `
                        <path d="M 235 188 Q 250 178 265 188" stroke="#7f1d1d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                    ` : state.expression === 'nervous' ? `
                        <path d="M 235 184 Q 242 188 250 182 T 265 186" stroke="#7f1d1d" stroke-width="3" fill="none" stroke-linecap="round"/>
                        <path d="M 295 135 C 295 130, 300 135, 300 140 C 300 143, 297 145, 295 145 C 293 145, 290 143, 290 140 Z" fill="#38bdf8"/>
                    ` : `
                        <path d="M 232 180 Q 250 195 268 180" stroke="#7f1d1d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                        <path d="M 235 181 Q 250 194 265 181 Z" fill="#ffffff" opacity="0.8"/>
                    `}
                </g>
            `}
        </g>
    </svg>
    `;

    if (characterContainer) {
        characterContainer.innerHTML = svgHTML;
    }

    // Render Desk & Objects Overlay (Laptop, Plant, Desk)
    if (deskOverlay) {
        if (hasDesk || hasLaptop || hasPlant) {
            deskOverlay.classList.remove('hidden');
            deskOverlay.innerHTML = `
                <div style="position: relative; width: 440px; height: 160px; display: flex; align-items: flex-end; justify-content: center;">
                    ${hasPlant ? `
                        <!-- Potted Plant Object -->
                        <div style="position: absolute; left: 15px; bottom: 85px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
                            <svg width="60" height="90" viewBox="0 0 60 90">
                                <polygon points="10,50 50,50 42,90 18,90" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
                                <rect x="6" y="44" width="48" height="8" rx="2" fill="#e2e8f0"/>
                                <path d="M 30 45 Q 10 20 0 25 Q 15 40 30 45 Z" fill="#16a34a"/>
                                <path d="M 30 45 Q 20 5 30 0 Q 38 20 30 45 Z" fill="#22c55e"/>
                                <path d="M 30 45 Q 50 15 60 22 Q 45 38 30 45 Z" fill="#15803d"/>
                            </svg>
                        </div>
                    ` : ''}

                    ${hasLaptop ? `
                        <!-- Laptop Object -->
                        <div style="position: absolute; right: 40px; bottom: 85px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5));">
                            <svg width="110" height="80" viewBox="0 0 110 80">
                                <rect x="15" y="0" width="80" height="55" rx="4" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
                                <rect x="20" y="5" width="70" height="45" rx="2" fill="#0284c7"/>
                                <text x="30" y="30" fill="#ffffff" font-size="10" font-family="sans-serif" font-weight="bold">SMART AI</text>
                                <polygon points="0,58 110,58 100,75 10,75" fill="#e2e8f0"/>
                                <polygon points="10,60 100,60 92,72 18,72" fill="#94a3b8"/>
                            </svg>
                        </div>
                    ` : ''}

                    ${hasDesk ? `
                        <!-- Teacher Desk -->
                        <svg width="440" height="100" viewBox="0 0 440 100" style="filter: drop-shadow(0 10px 15px rgba(0,0,0,0.6));">
                            <polygon points="0,0 440,0 420,30 20,30" fill="#78350f"/>
                            <rect x="20" y="25" width="400" height="15" fill="#451a03"/>
                            <rect x="40" y="40" width="20" height="60" fill="#292524"/>
                            <rect x="380" y="40" width="20" height="60" fill="#292524"/>
                            <rect x="60" y="40" width="320" height="40" fill="#1c1917" opacity="0.5"/>
                        </svg>
                    ` : ''}
                </div>
            `;
        } else {
            deskOverlay.classList.add('hidden');
            deskOverlay.innerHTML = '';
        }
    }

    updateUIState();
}

// Update Active UI States
function updateUIState() {
    // Current Gesture Title
    const poseIcons = {
        idle: 'IDLE 🧍',
        wave: 'WAVING 👋',
        point_up: 'POINTING UP ☝️',
        explain: 'EXPLAINING 🪄',
        read: 'READING 📖',
        laptop_desk: 'WORKING AT DESK 💻',
        backpack_pose: 'READY WITH BACKPACK 🎒',
        thumbs_up: 'THUMBS UP 👍',
        walk: 'WALKING 🚶',
        write: 'WRITING ON BOARD 🖊️',
        teach_board: 'TEACHING ON BOARD 👨‍🏫',
        talk_gestures: 'PRESENTING 🎙️',
        present_front: 'PRESENTING 🎙️'
    };
    if (currentGestureName) {
        currentGestureName.textContent = poseIcons[state.pose] || state.pose.toUpperCase();
    }

    // Equipped Objects Summary
    const activeObjects = [];
    if (state.objects.book || state.pose === 'read' || state.pose === 'explain') activeObjects.push('Book 📘');
    if (state.objects.pointer || state.pose === 'explain') activeObjects.push('Pointer 🪄');
    if (state.objects.pen || state.pose === 'write') activeObjects.push('Pen 🖊️');
    if (state.objects.laptop || state.pose === 'laptop_desk') activeObjects.push('Laptop 💻');
    if (state.objects.backpack || state.pose === 'backpack_pose') activeObjects.push('Backpack 🎒');
    if (state.objects.plant) activeObjects.push('Plant 🪴');
    if (state.objects.desk || state.pose === 'laptop_desk') activeObjects.push('Desk 🪑');

    if (equippedSummaryList) {
        equippedSummaryList.textContent = activeObjects.length > 0 ? activeObjects.join(', ') : 'None';
    }

    // Update Object Button Active States
    document.querySelectorAll('.obj-btn[data-obj]').forEach(btn => {
        const objKey = btn.getAttribute('data-obj');
        if (objKey !== 'reset' && state.objects[objKey]) {
            btn.classList.add('equipped');
        } else {
            btn.classList.remove('equipped');
        }
    });

    // Update Pose Button Active States
    document.querySelectorAll('.pose-btn').forEach(btn => {
        if (btn.getAttribute('data-pose') === state.pose) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Expression Button Active States
    document.querySelectorAll('.expr-btn').forEach(btn => {
        if (btn.getAttribute('data-expr') === state.expression) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Speak Functionality with Lip Sync & Safety Timeout
function speak(text, onEndCallback = null) {
    if (!('speechSynthesis' in window)) {
        if (onEndCallback) onEndCallback();
        return;
    }

    try {
        window.speechSynthesis.cancel();
    } catch (e) {}

    state.isSpeaking = true;

    // Start mouth animation loop
    if (state.talkInterval) clearInterval(state.talkInterval);
    state.talkInterval = setInterval(() => {
        state.talkFrame++;
        renderCharacter();
    }, 120);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Try to pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Male')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) utterance.voice = preferredVoice;
    }

    let finished = false;
    const finishSpeech = () => {
        if (finished) return;
        finished = true;
        state.isSpeaking = false;
        if (state.talkInterval) {
            clearInterval(state.talkInterval);
            state.talkInterval = null;
        }
        renderCharacter();
        if (onEndCallback) onEndCallback();
    };

    utterance.onend = finishSpeech;
    utterance.onerror = (err) => {
        console.warn("Speech synthesis error:", err);
        finishSpeech();
    };

    // Safety timeout to prevent freeze if browser audio engine hangs
    const safetyTimeout = Math.max(3500, (text.length / 10) * 1000 + 2500);
    setTimeout(() => {
        if (state.isSpeaking && !finished) {
            finishSpeech();
        }
    }, safetyTimeout);

    try {
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.warn("Speech synthesis speak error:", e);
        finishSpeech();
    }
}

// Emergency Stop Action Immediately Function
function stopAllActions(message = "Action stopped immediately.") {
    console.log("⏹️ STOPPED ALL ACTIONS:", message);

    // 1. Immediately increment active session token to invalidate all pending promises, slide loops and timers
    activeSessionId++;

    if (activeLessonTimer) {
        clearTimeout(activeLessonTimer);
        activeLessonTimer = null;
    }

    // 2. Stop speech synthesis immediately
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
        } catch(e){}
    }
    state.isSpeaking = false;
    if (state.talkInterval) {
        clearInterval(state.talkInterval);
        state.talkInterval = null;
    }

    // 3. Reset character pose, expressions & held accessories
    state.pose = 'idle';
    state.expression = 'happy';
    for (let k in state.objects) state.objects[k] = false;

    renderCharacter();

    // 4. Update UI Status & Whiteboard
    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = message;

    const transcriptEl = document.getElementById('speechTranscript');
    if (transcriptEl) {
        transcriptEl.classList.add('hidden');
        transcriptEl.textContent = '';
    }

    updateWhiteboard("⏹️ Action Stopped", "<p>All actions, speech narration, and presentations stopped immediately. Teacher is standing ready.</p>", "Ready");
}

// Whiteboard Content Updates
function updateWhiteboard(title, contentHTML, topicName = "Educational Presentation") {
    const whiteboardEl = document.getElementById('whiteboard');
    if (whiteboardEl) whiteboardEl.classList.add('visible-board');
    const topicEl = document.getElementById('boardTopic');
    if (topicEl) topicEl.textContent = `Topic: ${topicName}`;
    const boardContent = document.getElementById('boardContent');
    if (boardContent) {
        boardContent.innerHTML = `
            <div class="active-presentation">
                <h3>${title}</h3>
                ${contentHTML}
            </div>
        `;
    }
}

// Comprehensive Curriculum Topics Database
const CURRICULUM_TOPICS = {
    newton: {
        title: "🔬 Physics: Newton's Third Law",
        topicName: "Newton's Third Law of Motion",
        headerText: "Law of Action and Reaction: F_AB = -F_BA",
        points: [
            "✨ 1. For every action, there is an equal and opposite reaction.",
            "✨ 2. Forces always occur in matched action-reaction pairs.",
            "✨ 3. Rocket Propulsion: Downward gas exhaust pushes rocket upward.",
            "✨ 4. Walking Mechanics: Foot pushes ground back; ground pushes foot forward."
        ],
        spokenIntro: "Topic: Newton's Third Law of Motion.",
        spokenPoints: [
            "Point one: For every action, there is an equal and opposite reaction.",
            "Point two: Forces always occur in matched action-reaction pairs acting on different bodies.",
            "Point three: In rocket propulsion, downward high-speed exhaust gas pushes the rocket upward into space.",
            "Point four: When walking, your foot pushes backward against the ground, and the ground pushes you forward."
        ],
        spokenOutro: "Newton's third law lesson complete."
    },
    voice: {
        title: "📝 English Grammar: Active & Passive Voice",
        topicName: "Active & Passive Voice (4 Key Rules)",
        headerText: "Sentence Structure Transformation Rules",
        points: [
            "✨ 1. Active Voice: Subject performs action (e.g., 'The teacher explains the lesson').",
            "✨ 2. Passive Voice: Subject receives action (e.g., 'The lesson is explained by the teacher').",
            "✨ 3. Structure: Object + Auxiliary Verb (be) + Past Participle (V3) + by Subject.",
            "✨ 4. Usage: Emphasizes the action or result when the doer is unknown or less important."
        ],
        spokenIntro: "Topic: Active and Passive Voice.",
        spokenPoints: [
            "Line one: In active voice, the subject performs the action, for example: The teacher explains the lesson.",
            "Line two: In passive voice, the subject receives the action, for example: The lesson is explained by the teacher.",
            "Line three: The sentence structure transforms to object, plus auxiliary verb, plus past participle verb three, plus by subject.",
            "Line four: Passive voice is used to emphasize the action or outcome rather than the actor."
        ],
        spokenOutro: "Active and passive voice lesson complete."
    },
    siet: {
        title: "🏛️ Sri Shakthi Institute of Engineering & Technology",
        topicName: "SIET Coimbatore (Autonomous)",
        headerText: "Sri Shakthi Institute of Engineering & Technology (SIET)",
        points: [
            "✨ 1. Autonomous Institution: Premier engineering campus in Coimbatore, Tamil Nadu, accredited with distinguished academic excellence.",
            "✨ 2. Innovation Ecosystem: State-of-the-art incubation hubs, Artificial Intelligence research centers, and advanced robotics labs.",
            "✨ 3. Top-Tier Placements: Exceptional career track records with premier multinational tech leaders and core engineering industries.",
            "✨ 4. Hackathon & Research Culture: Actively championing Smart India Hackathons, startup entrepreneurship, and comprehensive student leadership."
        ],
        spokenIntro: "Welcome to Sri Shakthi Institute of Engineering and Technology, Coimbatore.",
        spokenPoints: [
            "First: Sri Shakthi Institute of Engineering and Technology is a premier autonomous institution in Coimbatore, dedicated to world-class engineering education and transformative innovation.",
            "Second: The campus features state of the art technology incubation, artificial intelligence centers, and advanced robotics research laboratories.",
            "Third: SIET boasts top tier placement records with premier global technology enterprises and core engineering industries.",
            "Fourth: The institution actively champions national hackathons, startup entrepreneurship, and holistic student excellence."
        ],
        spokenOutro: "Sri Shakthi Institute of Engineering and Technology overview complete."
    },
    vijay: {
        title: "🌟 Thalapathy Vijay: Cinema to Leadership",
        topicName: "Thalapathy Vijay's Journey",
        headerText: "Journey from Cinema Superstar to Tamizhaga Vettri Kazhagam (TVK)",
        points: [
            "✨ 1. Early Debut & Rise: Debuted in 1992, rising through relentless hard work to become Tamil cinema's 'Thalapathy'.",
            "✨ 2. Blockbuster Legacy: Delivered historic cinema inspiring millions with social responsibility and youth empowerment.",
            "✨ 3. Grassroots Social Welfare: Spearheaded Vijay Makkal Iyakkam, providing free education, student honors, and relief aid.",
            "✨ 4. Political Era (TVK 2024): Founded Tamizhaga Vettri Kazhagam championing secular social justice and transparent governance.",
            "✨ 5. Vision for Tamil Nadu: Dedicated to grassroots public leadership and progressive development for the future."
        ],
        spokenIntro: "Topic: Thalapathy Vijay's Journey from Cinema to Public Leadership.",
        spokenPoints: [
            "First: Entering cinema in 1992, Vijay overcame immense early hurdles through relentless discipline and perseverance, rising to become the beloved Thalapathy of millions.",
            "Second: Through historic blockbuster cinema spanning three decades, his films championed education, social responsibility, and youth empowerment.",
            "Third: Beyond cinema, his welfare organization Vijay Makkal Iyakkam conducted extensive grassroots service, honoring top students, establishing night study centers, and providing medical relief.",
            "Fourth: In 2024, he officially launched his political party, Tamizhaga Vettri Kazhagam, dedicated to secular social justice, equality, and corruption-free governance.",
            "Fifth: His inspiring journey reflects dedication to public service, championing progressive reforms for the future of Tamil Nadu."
        ],
        spokenOutro: "Thalapathy Vijay journey presentation complete."
    },
    ww1: {
        title: "🌍 World War I: The Great War (1914 - 1918)",
        topicName: "World War 1 (1914 - 1918)",
        headerText: "The Great War: Causes, Course, and Global Transformation",
        points: [
            "✨ 1. Outbreak (1914): Sparked on June 28, 1914, by the assassination of Archduke Franz Ferdinand in Sarajevo.",
            "✨ 2. Major Alliances: Allied Powers (Britain, France, Russia, USA) vs Central Powers (Germany, Austria-Hungary, Ottoman Empire).",
            "✨ 3. New Warfare Technologies: Dominated by extensive trench warfare, tanks, chemical poison gas, and military aircraft.",
            "✨ 4. Armistice & Treaty of Versailles: Hostilities ended on November 11, 1918, followed by the Treaty of Versailles in 1919.",
            "✨ 5. Global Aftermath: Dissolved four great empires, reshaped world borders, and established the League of Nations."
        ],
        spokenIntro: "Topic: World War One, The Great War from 1914 to 1918.",
        spokenPoints: [
            "First: The war was ignited on June 28, 1914, following the assassination of Archduke Franz Ferdinand in Sarajevo, triggering complex European alliances.",
            "Second: The conflict divided nations into the Allied Powers led by Britain, France, Russia, and later the United States, against the Central Powers of Germany, Austria-Hungary, and the Ottoman Empire.",
            "Third: World War One introduced modern industrialized warfare, characterized by brutal trench warfare, tanks, poisonous gas, and tactical military aviation.",
            "Fourth: Fighting concluded on November 11, 1918 with the Armistice, formally concluded by the historic Treaty of Versailles in 1919.",
            "Fifth: The global aftermath dissolved four major empires, redrew world boundaries, and fundamentally transformed twentieth-century geopolitics."
        ],
        spokenOutro: "World War One history lesson complete."
    },
    periodic: {
        title: "🧪 Chemistry: The Periodic Table of Elements",
        topicName: "The Periodic Table of Elements",
        headerText: "Organizational Framework of 118 Chemical Elements",
        points: [
            "✨ 1. Overview: Systematically arranges 118 chemical elements by increasing atomic number and electron configurations.",
            "✨ 2. Historical Origin: First published in 1869 by Dmitri Mendeleev, successfully predicting undiscovered elements.",
            "✨ 3. Structure: Comprises 7 horizontal Periods and 18 vertical Groups sharing similar valence electrons.",
            "✨ 4. Major Families: Classified into Alkali Metals, Transition Metals, Halogens, Noble Gases, and Rare Earth Lanthanides.",
            "✨ 5. Scientific Impact: Serves as the universal roadmap for understanding chemical reactions and modern materials science."
        ],
        spokenIntro: "Topic: The Periodic Table of Chemical Elements.",
        spokenPoints: [
            "First: The Periodic Table systematically organizes all 118 known chemical elements in order of increasing atomic number and electron structure.",
            "Second: First published in 1869 by Dmitri Mendeleev, its periodic framework remarkably predicted the properties of undiscovered elements.",
            "Third: The table is structured into seven horizontal periods and eighteen vertical groups that exhibit similar valence electrons and chemical reactivity.",
            "Fourth: Elements are categorized into distinct families, including Alkali metals, Transition metals, Halogens, and unreactive Noble gases.",
            "Fifth: It serves as the foundational universal framework across chemistry, materials engineering, and modern molecular science."
        ],
        spokenOutro: "Periodic table chemistry lesson complete."
    },
    math: {
        title: "📐 Mathematics: The Pythagorean Theorem",
        topicName: "Pythagorean Theorem (a² + b² = c²)",
        headerText: "Fundamental Geometric Law of Right-Angled Triangles",
        points: [
            "✨ 1. Theorem: In any right-angled triangle, hypotenuse squared equals the sum of squares of the other two sides (a² + b² = c²).",
            "✨ 2. Hypotenuse: The longest side directly opposite the 90-degree right angle.",
            "✨ 3. Pythagorean Triples: Integer solutions such as (3, 4, 5) and (5, 12, 13).",
            "✨ 4. Real-world Applications: Essential for navigation, civil architecture, computer graphics, and physics vectors."
        ],
        spokenIntro: "Topic: The Pythagorean Theorem in Mathematics.",
        spokenPoints: [
            "Point one: The Pythagorean Theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides, a squared plus b squared equals c squared.",
            "Point two: The hypotenuse is always the longest side, positioned directly opposite the ninety-degree right angle.",
            "Point three: Common integer sets known as Pythagorean triples include three, four, five, and five, twelve, thirteen.",
            "Point four: This theorem forms the mathematical bedrock for architecture, satellite navigation, computer vision, and coordinate geometry."
        ],
        spokenOutro: "Pythagorean theorem mathematics lesson complete."
    },
    photosynthesis: {
        title: "🌿 Biology: Plant Photosynthesis",
        topicName: "Photosynthesis & Solar Energy Conversion",
        headerText: "Chemical Reaction: 6CO₂ + 6H₂O + Light ➔ C₆H₁₂O₆ + 6O₂",
        points: [
            "✨ 1. Core Process: Green plants convert solar light energy into chemical glucose.",
            "✨ 2. Chlorophyll: Green pigment inside chloroplasts that captures photons.",
            "✨ 3. Raw Materials: Absorbs carbon dioxide from air and water from soil roots.",
            "✨ 4. Life Sustaining Byproduct: Produces pure oxygen essential for planetary life."
        ],
        spokenIntro: "Topic: Photosynthesis and the Plant Energy Cycle.",
        spokenPoints: [
            "Point one: Photosynthesis is the biological process by which green plants transform sunlight into vital chemical glucose energy.",
            "Point two: The green pigment chlorophyll, located inside plant chloroplasts, absorbs light photons to power the reaction.",
            "Point three: Plants absorb water through their roots and carbon dioxide from the surrounding air through microscopic leaf pores.",
            "Point four: As a crucial byproduct, photosynthesis generates oxygen, maintaining the breathable atmosphere for all animal life on Earth."
        ],
        spokenOutro: "Photosynthesis biology lesson complete."
    },
    ai: {
        title: "🤖 Computer Science: AI & Robotics",
        topicName: "Artificial Intelligence & Robotics",
        headerText: "Machine Learning, Neural Networks & Autonomous Systems",
        points: [
            "✨ 1. Artificial Intelligence: Computational systems designed to perform tasks requiring human-like intelligence.",
            "✨ 2. Deep Learning: Multilayered neural networks modeled after the human brain's synaptic pathways.",
            "✨ 3. Natural Language Processing: Enables machines to listen, understand, and converse naturally in human languages.",
            "✨ 4. Autonomous Robotics: Integrating computer vision and sensor feedback for real-world decision-making."
        ],
        spokenIntro: "Topic: Artificial Intelligence and Robotics.",
        spokenPoints: [
            "Point one: Artificial Intelligence empowers computer systems to perceive, reason, learn, and solve complex real-world problems.",
            "Point two: Deep learning architectures utilize artificial neural networks inspired by biological brain neurons to recognize intricate patterns.",
            "Point three: Natural language processing and voice synthesis enable seamless conversational intelligence, powering interactive platforms like VoxSim AI.",
            "Point four: Autonomous robotics unites computer vision, sensor fusion, and adaptive control to transform modern medicine, space exploration, and automated industry."
        ],
        spokenOutro: "Artificial intelligence overview complete."
    }
};

// Welcome to Interactive Class (Character in frontal talking posture with moving hands like CM Vijay)
function welcomeInteractiveClass() {
    if (activeLessonTimer) clearTimeout(activeLessonTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const currentSessionId = ++activeSessionId;
    isFirstCommandExecuted = true;

    // Update command input placeholder to general prompt mode
    const cmdInput = document.getElementById('commandInput');
    if (cmdInput) cmdInput.placeholder = "Ask teacher or type any topic...";

    // 1. Facing front in conversational talking stance with open gesturing hands on left side of board (exact same as CM Vijay!)
    state.pose = 'talk_gestures';
    state.expression = 'happy';
    state.objects.pointer = false;
    state.objects.book = false;
    renderCharacter();

    // 2. Whiteboard welcome presentation banner
    const welcomeHTML = `
        <div class="voxsim-presentation-box">
            <div class="voxsim-hero-banner" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.45) 0%, rgba(15, 23, 42, 0.9) 100%); border-color: rgba(99, 102, 241, 0.5);">
                <span class="voxsim-badge" style="background: rgba(99, 102, 241, 0.25); color: #a5b4fc; border-color: rgba(99, 102, 241, 0.5);">✨ INTERACTIVE AI CLASSROOM</span>
                <h3 class="voxsim-heading" style="color: #ffffff;">👋 Welcome to Our Interactive Classroom!</h3>
                <p class="voxsim-tagline" style="color: #fbbf24;">"Your AI Voice-Guided STEM & Project Learning Instructor"</p>
            </div>
            <div class="active-point-presentation">
                <div class="active-slide-card slide-fade-in" style="border-color: #6366f1; box-shadow: 0 0 22px rgba(99, 102, 241, 0.35);">
                    <div class="active-slide-text" style="color: #f8fafc; font-size: 1rem;">
                        🎓 <strong>Teacher is ready!</strong> Ask me any question, click a curriculum topic, explore Sri Shakthi College & VoxSim AI, or toggle 3D accessories!
                    </div>
                </div>
            </div>
        </div>
    `;

    updateWhiteboard("👋 Welcome to Class!", welcomeHTML, "Interactive Classroom");

    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = "Welcoming classroom...";

    const welcomeSpeech = "Hello! Welcome to our interactive classroom! I am your AI Smart Teacher, ready to present lessons, solve equations, and demonstrate simulations with you.";

    speak(welcomeSpeech, () => {
        if (activeSessionId !== currentSessionId) return;
        state.pose = 'idle';
        renderCharacter();
        if (speechStatus) speechStatus.textContent = "Ready for your next instruction!";
    });
}

// Whiteboard Lesson Presentation & Auto-Return Execution Engine (Used for Newton's 3rd Law, World War 1, etc.)
// The teacher TURNS BACKWARD FACING THE BOARD, equips laser pointer stick & textbook, and highlights points sequentially
function teachBoardLesson(lessonConfig = null) {
    if (activeLessonTimer) clearTimeout(activeLessonTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const currentSessionId = ++activeSessionId;
    isFirstCommandExecuted = true;

    const lesson = lessonConfig || CURRICULUM_TOPICS.newton;
    const totalPoints = lesson.points.length;

    // 1. Teacher turns backward to face whiteboard and equips laser pointer + book
    state.pose = 'teach_board';
    state.expression = 'happy';
    state.objects.pointer = true;
    state.objects.book = true;
    renderCharacter();

    // 2. Render initial whiteboard presentation stage
    const initialHTML = `
        <p id="board-lesson-header" style="font-size: 1.05rem; color: #00e5ff; font-weight: bold; margin-bottom: 10px;">${lesson.headerText}</p>
        <div class="active-point-presentation" id="point-presentation-box">
            <div class="slide-counter-badge">Overview</div>
            <div class="active-slide-card slide-fade-in" id="active-slide-card">
                <div class="active-slide-text">✨ ${lesson.spokenIntro}</div>
            </div>
        </div>
    `;

    updateWhiteboard(lesson.title, initialHTML, lesson.topicName);

    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = `Teaching: ${lesson.topicName}`;

    // 3. Sequentially speak intro -> each point fades in, speaks with laser pointer, fades out -> next point displays
    speak(lesson.spokenIntro, () => {
        if (activeSessionId !== currentSessionId) return;
        let pointIndex = 0;

        function showNextPoint() {
            if (activeSessionId !== currentSessionId) return;

            if (pointIndex < totalPoints) {
                const currentIdx = pointIndex;
                const pointText = lesson.points[currentIdx];
                const spokenText = lesson.spokenPoints[currentIdx];
                pointIndex++;

                const cardBox = document.getElementById('point-presentation-box');
                if (cardBox) {
                    const oldCard = document.getElementById('active-slide-card');
                    if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                    setTimeout(() => {
                        if (activeSessionId !== currentSessionId) return;

                        cardBox.innerHTML = `
                            <div class="slide-counter-badge">Point ${currentIdx + 1} of ${totalPoints}</div>
                            <div class="active-slide-card slide-fade-in" id="active-slide-card">
                                <div class="active-slide-text">${pointText}</div>
                            </div>
                        `;

                        speak(spokenText, () => {
                            if (activeSessionId !== currentSessionId) return;
                            activeLessonTimer = setTimeout(showNextPoint, 400);
                        });
                    }, 240);
                } else {
                    speak(spokenText, () => {
                        if (activeSessionId !== currentSessionId) return;
                        activeLessonTimer = setTimeout(showNextPoint, 400);
                    });
                }
            } else {
                // All points completed: show summary card then return
                const cardBox = document.getElementById('point-presentation-box');
                if (cardBox) {
                    const oldCard = document.getElementById('active-slide-card');
                    if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                    setTimeout(() => {
                        if (activeSessionId !== currentSessionId) return;

                        cardBox.innerHTML = `
                            <div class="slide-counter-badge" style="border-color:#10b981; color:#10b981; background:rgba(16,185,129,0.15);">✔ Complete</div>
                            <div class="active-slide-card slide-fade-in" style="border-color:#10b981; box-shadow:0 0 22px rgba(16,185,129,0.35);">
                                <div class="active-slide-text" style="color:#6ee7b7; font-weight:600; text-align:center;">🎉 ${lesson.topicName} — Lesson Complete!</div>
                            </div>
                        `;

                        const outroText = lesson.spokenOutro || `${lesson.topicName} lesson complete!`;
                        speak(outroText, () => {
                            if (activeSessionId !== currentSessionId) return;
                            state.pose = 'idle';
                            state.objects.pointer = false;
                            state.objects.book = false;
                            renderCharacter();

                            if (speechStatus) speechStatus.textContent = "Lesson finished! Ready for next command.";
                        });
                    }, 240);
                } else {
                    if (activeSessionId !== currentSessionId) return;
                    state.pose = 'idle';
                    state.objects.pointer = false;
                    state.objects.book = false;
                    renderCharacter();
                }
            }
        }

        showNextPoint();
    });
}

// Special Presentation: Sri Shakthi Institute of Engineering & Technology
// Character stands facing front in natural conversational talking stance with open gesturing hands (exact same as CM Vijay & VoxSim AI)
function presentSietCollege() {
    if (activeLessonTimer) clearTimeout(activeLessonTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const currentSessionId = ++activeSessionId;
    isFirstCommandExecuted = true;

    // 1. Character faces forward in natural talking stance with conversational gesturing hands
    state.pose = 'talk_gestures';
    state.expression = 'happy';
    state.objects.pointer = false;
    state.objects.book = false;
    renderCharacter();

    const lesson = CURRICULUM_TOPICS.siet;
    const totalPoints = lesson.points.length;

    // 2. Render SIET banner on Whiteboard
    const initialHTML = `
        <div class="voxsim-presentation-box">
            <div class="voxsim-hero-banner" style="background: linear-gradient(135deg, rgba(14, 116, 144, 0.5) 0%, rgba(15, 23, 42, 0.85) 100%); border-color: rgba(6, 182, 212, 0.4);">
                <span class="voxsim-badge" style="background: rgba(6, 182, 212, 0.2); color: #22d3ee; border-color: rgba(6, 182, 212, 0.4);">COIMBATORE • AUTONOMOUS CAMPUS</span>
                <h3 class="voxsim-heading" style="color:#ffffff;">🏛️ Sri Shakthi Institute of Engineering & Technology</h3>
                <p class="voxsim-tagline" style="color: #67e8f9;">"Innovate, Incubate, and Excel in Engineering & AI"</p>
            </div>
            <div class="active-point-presentation" id="siet-presentation-box">
                <div class="slide-counter-badge" style="border-color:#06b6d4; color:#22d3ee; background:rgba(6, 182, 212, 0.15);">Intro</div>
                <div class="active-slide-card slide-fade-in" id="active-slide-card" style="border-color:#06b6d4; box-shadow:0 0 20px rgba(6,182,212,0.3);">
                    <div class="active-slide-text" style="color:#f0fdfa;">🏛️ ${lesson.spokenIntro}</div>
                </div>
            </div>
        </div>
    `;

    updateWhiteboard(lesson.title, initialHTML, lesson.topicName);

    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = "Presenting: Sri Shakthi Institute of Engineering & Technology...";

    // 3. Sequential speech with dynamic natural human talking gestures & smooth fading milestones
    speak(lesson.spokenIntro, () => {
        if (activeSessionId !== currentSessionId) return;
        let pointIndex = 0;

        function showNextSietSlide() {
            if (activeSessionId !== currentSessionId) return;

            if (pointIndex < totalPoints) {
                const currentIdx = pointIndex;
                const pointText = lesson.points[currentIdx];
                const spokenText = lesson.spokenPoints[currentIdx];
                pointIndex++;

                const cardBox = document.getElementById('siet-presentation-box');
                if (cardBox) {
                    const oldCard = document.getElementById('active-slide-card');
                    if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                    setTimeout(() => {
                        if (activeSessionId !== currentSessionId) return;

                        cardBox.innerHTML = `
                            <div class="slide-counter-badge" style="border-color:#06b6d4; color:#22d3ee; background:rgba(6, 182, 212, 0.15);">Highlight ${currentIdx + 1} of ${totalPoints}</div>
                            <div class="active-slide-card slide-fade-in" id="active-slide-card" style="border-color:#06b6d4; box-shadow:0 0 20px rgba(6,182,212,0.3);">
                                <div class="active-slide-text" style="color:#f0fdfa;">${pointText}</div>
                            </div>
                        `;

                        speak(spokenText, () => {
                            if (activeSessionId !== currentSessionId) return;
                            activeLessonTimer = setTimeout(showNextSietSlide, 350);
                        });
                    }, 240);
                } else {
                    speak(spokenText, () => {
                        if (activeSessionId !== currentSessionId) return;
                        activeLessonTimer = setTimeout(showNextSietSlide, 350);
                    });
                }
            } else {
                // Completed: show summary then return
                const cardBox = document.getElementById('siet-presentation-box');
                if (cardBox) {
                    const oldCard = document.getElementById('active-slide-card');
                    if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                    setTimeout(() => {
                        if (activeSessionId !== currentSessionId) return;

                        cardBox.innerHTML = `
                            <div class="slide-counter-badge" style="border-color:#10b981; color:#10b981; background:rgba(16,185,129,0.15);">✔ Complete</div>
                            <div class="active-slide-card slide-fade-in" style="border-color:#10b981; box-shadow:0 0 22px rgba(16,185,129,0.35);">
                                <div class="active-slide-text" style="color:#6ee7b7; font-weight:600; text-align:center;">🎉 Sri Shakthi Institute Overview Complete!</div>
                            </div>
                        `;

                        const outro = lesson.spokenOutro || "Sri Shakthi College overview complete.";
                        speak(outro, () => {
                            if (activeSessionId !== currentSessionId) return;
                            state.pose = 'idle';
                            state.objects.pointer = false;
                            state.objects.book = false;
                            renderCharacter();
                            if (speechStatus) speechStatus.textContent = "Sri Shakthi College presentation finished! Ready for next command.";
                        });
                    }, 240);
                } else {
                    if (activeSessionId !== currentSessionId) return;
                    state.pose = 'idle';
                    state.objects.pointer = false;
                    state.objects.book = false;
                    renderCharacter();
                }
            }
        }

        showNextSietSlide();
    });
}

// Special Project Presentation: VoxSim AI (SIH 2025)
function presentVoxSimProject() {
    if (activeLessonTimer) clearTimeout(activeLessonTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const currentSessionId = ++activeSessionId;
    isFirstCommandExecuted = true;

    // 1. Character faces normal frontal position in natural conversational talking stance with open gesturing hands
    state.pose = 'talk_gestures';
    state.expression = 'happy';
    state.objects.pointer = false;
    state.objects.book = false;
    renderCharacter();

    // 2. Render VoxSim AI Presentation Container on Whiteboard
    const whiteboardEl = document.getElementById('whiteboard');
    if (whiteboardEl) whiteboardEl.classList.add('visible-board');
    const topicEl = document.getElementById('boardTopic');
    if (topicEl) topicEl.textContent = "Topic: VoxSim AI (SIH 2025)";

    const boardContent = document.getElementById('boardContent');
    if (boardContent) {
        boardContent.innerHTML = `
            <div class="voxsim-presentation-box">
                <div class="voxsim-hero-banner" id="voxsim-hero">
                    <span class="voxsim-badge">SIH 2025 • SMART EDUCATION</span>
                    <h3 class="voxsim-heading">⚡ VoxSim AI: AI Learning & Simulation Platform</h3>
                    <p class="voxsim-tagline">"Turn One Voice Prompt into a Working World"</p>
                </div>
                <div class="active-point-presentation" id="voxsim-slide-stage"></div>
            </div>
        `;
    }

    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = "Presenting: VoxSim AI (SIH 2025)...";

    // 3. Sequential speech with animated fading slides and natural conversational hand gestures
    const slidesData = [
        {
            badge: "Topic Intro",
            html: `<div class="active-slide-card slide-fade-in" id="active-slide-card"><div class="active-slide-text">⚡ <strong>VoxSim AI:</strong> AI Learning & Simulation Platform for Smart India Hackathon 2025.</div></div>`,
            text: "Topic: VoxSim AI, AI Learning and Simulation Platform."
        },
        {
            badge: "Overview • Team Innovexa",
            html: `<div class="active-slide-card slide-fade-in" id="active-slide-card"><div class="vcard-header">🎙️ Voice In • Visual Intelligence Out</div><div class="active-slide-text">Converts natural speech into structured scenes, live narration, interactive objects, and learning simulations in real-time.</div></div>`,
            text: "Welcome to VoxSim AI, our flagship platform developed for Smart India Hackathon 2025 by Team Innovexa. VoxSim AI turns a single voice prompt into a working visual world."
        },
        {
            badge: "5-Step Architecture Pipeline",
            html: `
                <div class="voxsim-pipeline-container slide-fade-in" id="active-slide-card" style="display:flex;">
                    <div class="voxsim-step-node vstep-active"><span class="vstep-icon">🎙️</span><span class="vstep-label">Capture</span></div>
                    <div class="vstep-arrow">➔</div>
                    <div class="voxsim-step-node vstep-active"><span class="vstep-icon">🧠</span><span class="vstep-label">Understand</span></div>
                    <div class="vstep-arrow">➔</div>
                    <div class="voxsim-step-node vstep-active"><span class="vstep-icon">📖</span><span class="vstep-label">Plan</span></div>
                    <div class="vstep-arrow">➔</div>
                    <div class="voxsim-step-node vstep-active"><span class="vstep-icon">🎥</span><span class="vstep-label">Generate</span></div>
                    <div class="vstep-arrow">➔</div>
                    <div class="voxsim-step-node vstep-active"><span class="vstep-icon">🔒</span><span class="vstep-label">Lock Step</span></div>
                </div>
            `,
            text: "Our core workflow operates on a five step pipeline: Voice Capture, Intent Understanding, Scene Planning, Real-time Generation, and a Deliberate Lock Step that prevents accidental overrides."
        },
        {
            badge: "Core Architecture",
            html: `<div class="active-slide-card slide-fade-in" id="active-slide-card"><div class="vcard-header">🔒 Deliberate Lock Step Engine</div><div class="active-slide-text">Combines Voice Activity Detection, Speech Recognition, Intent Engine, and asynchronous Simulation Generator with an automated Quiz Engine.</div></div>`,
            text: "The technical architecture combines Voice Activity Detection, Speech Recognition, an Intent Engine, and an asynchronous Simulation Generator coupled with an automated Quiz Engine."
        },
        {
            badge: "Sector Learning Loops",
            html: `<div class="active-slide-card slide-fade-in" id="active-slide-card"><div class="vcard-header">🏫 Multi-Sector Impact</div><div class="active-slide-text">5-min interactive quizzes for schools, tailored departmental modules for colleges, and safe pre-action experiment testing for research.</div></div>`,
            text: "Every sector gets its own learning loop: five minute interactive reinforcement quizzes for schools, customized departmental modules for colleges, and safe pre-action experiment testing for research."
        },
        {
            badge: "Team Innovexa • SIH 2025",
            html: `<div class="active-slide-card slide-fade-in" id="active-slide-card" style="border-color:#fbbf24; box-shadow:0 0 20px rgba(251,191,36,0.3);"><div class="vcard-header" style="color:#fbbf24;">👥 Team Innovexa Developers</div><div class="active-slide-text" style="color:#fef3c7;">Eirik Rozar R J • Brangin R G • Dharani A • Adthiya R • Deepika S • Deva dharshini</div></div>`,
            text: "Developed by Eirik Rozar, Brangin, Dharani, Adthiya, Deepika, and Deva dharshini, VoxSim AI safely empowers education from spoken idea to real-world simulation."
        },
        {
            badge: "✔ Presentation Complete",
            html: `<div class="active-slide-card slide-fade-in" id="active-slide-card" style="border-color:#10b981; box-shadow:0 0 22px rgba(16,185,129,0.35);"><div class="active-slide-text" style="color:#6ee7b7; font-weight:600; text-align:center;">🎉 VoxSim AI Presentation Complete!</div></div>`,
            text: "VoxSim AI project presentation complete."
        }
    ];

    let slideIdx = 0;
    function showNextVoxSimSlide() {
        if (activeSessionId !== currentSessionId) return;

        if (slideIdx < slidesData.length) {
            const slide = slidesData[slideIdx];
            slideIdx++;

            const stage = document.getElementById('voxsim-slide-stage');
            if (stage) {
                const oldCard = document.getElementById('active-slide-card');
                if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                setTimeout(() => {
                    if (activeSessionId !== currentSessionId) return;

                    stage.innerHTML = `
                        <div class="slide-counter-badge">${slide.badge}</div>
                        ${slide.html}
                    `;

                    speak(slide.text, () => {
                        if (activeSessionId !== currentSessionId) return;
                        activeLessonTimer = setTimeout(showNextVoxSimSlide, 400);
                    });
                }, 240);
            } else {
                speak(slide.text, () => {
                    if (activeSessionId !== currentSessionId) return;
                    activeLessonTimer = setTimeout(showNextVoxSimSlide, 400);
                });
            }
        } else {
            if (activeSessionId !== currentSessionId) return;
            state.pose = 'idle';
            state.objects.pointer = false;
            state.objects.book = false;
            renderCharacter();

            if (speechStatus) speechStatus.textContent = "VoxSim AI presentation finished! Ready for next command.";
        }
    }

    showNextVoxSimSlide();
}

// Special Presentation: Thalapathy Vijay Journey
function presentVijayJourney() {
    if (activeLessonTimer) clearTimeout(activeLessonTimer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const currentSessionId = ++activeSessionId;
    isFirstCommandExecuted = true;

    // 1. Character faces forward in normal straight pose with natural conversational open gesturing hands
    state.pose = 'talk_gestures';
    state.expression = 'happy';
    state.objects.pointer = false;
    state.objects.book = false;
    renderCharacter();

    const lesson = CURRICULUM_TOPICS.vijay;
    const totalPoints = lesson.points.length;

    // 2. Render initial whiteboard frame
    const initialHTML = `
        <p id="board-lesson-header" style="font-size: 1.05rem; color: #fbbf24; font-weight: bold; margin-bottom: 10px;">${lesson.headerText}</p>
        <div class="active-point-presentation" id="vijay-presentation-box">
            <div class="slide-counter-badge" style="border-color:#fbbf24; color:#fbbf24; background:rgba(251,191,36,0.15);">Intro</div>
            <div class="active-slide-card slide-fade-in" id="active-slide-card" style="border-color:#fbbf24; box-shadow:0 0 20px rgba(251,191,36,0.3);">
                <div class="active-slide-text" style="color:#fef3c7;">🌟 ${lesson.spokenIntro}</div>
            </div>
        </div>
    `;

    updateWhiteboard(lesson.title, initialHTML, lesson.topicName);

    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = "Presenting: Thalapathy Vijay's Journey...";

    // 3. Sequential speech with dynamic natural human talking gestures & smooth fading milestones
    speak(lesson.spokenIntro, () => {
        if (activeSessionId !== currentSessionId) return;
        let pointIndex = 0;

        function showNextMilestone() {
            if (activeSessionId !== currentSessionId) return;

            if (pointIndex < totalPoints) {
                const currentIdx = pointIndex;
                const pointText = lesson.points[currentIdx];
                const spokenText = lesson.spokenPoints[currentIdx];
                pointIndex++;

                const cardBox = document.getElementById('vijay-presentation-box');
                if (cardBox) {
                    const oldCard = document.getElementById('active-slide-card');
                    if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                    setTimeout(() => {
                        if (activeSessionId !== currentSessionId) return;

                        cardBox.innerHTML = `
                            <div class="slide-counter-badge" style="border-color:#fbbf24; color:#fbbf24; background:rgba(251,191,36,0.15);">Milestone ${currentIdx + 1} of ${totalPoints}</div>
                            <div class="active-slide-card slide-fade-in" id="active-slide-card" style="border-color:#fbbf24; box-shadow:0 0 20px rgba(251,191,36,0.3);">
                                <div class="active-slide-text" style="color:#fef3c7;">${pointText}</div>
                            </div>
                        `;

                        speak(spokenText, () => {
                            if (activeSessionId !== currentSessionId) return;
                            activeLessonTimer = setTimeout(showNextMilestone, 350);
                        });
                    }, 240);
                } else {
                    speak(spokenText, () => {
                        if (activeSessionId !== currentSessionId) return;
                        activeLessonTimer = setTimeout(showNextMilestone, 350);
                    });
                }
            } else {
                // Completed: show summary then return
                const cardBox = document.getElementById('vijay-presentation-box');
                if (cardBox) {
                    const oldCard = document.getElementById('active-slide-card');
                    if (oldCard) oldCard.className = 'active-slide-card slide-fade-out';

                    setTimeout(() => {
                        if (activeSessionId !== currentSessionId) return;

                        cardBox.innerHTML = `
                            <div class="slide-counter-badge" style="border-color:#10b981; color:#10b981; background:rgba(16,185,129,0.15);">✔ Complete</div>
                            <div class="active-slide-card slide-fade-in" style="border-color:#10b981; box-shadow:0 0 22px rgba(16,185,129,0.35);">
                                <div class="active-slide-text" style="color:#6ee7b7; font-weight:600; text-align:center;">🎉 Thalapathy Vijay's Journey — Presentation Complete!</div>
                            </div>
                        `;

                        const outro = lesson.spokenOutro || "Thalapathy Vijay presentation complete.";
                        speak(outro, () => {
                            if (activeSessionId !== currentSessionId) return;
                            state.pose = 'idle';
                            state.objects.pointer = false;
                            state.objects.book = false;
                            renderCharacter();
                            if (speechStatus) speechStatus.textContent = "Thalapathy Vijay presentation finished! Ready for next command.";
                        });
                    }, 240);
                } else {
                    if (activeSessionId !== currentSessionId) return;
                    state.pose = 'idle';
                    state.objects.pointer = false;
                    state.objects.book = false;
                    renderCharacter();
                }
            }
        }

        showNextMilestone();
    });
}

// Natural Language Command Processing Engine
function processCommand(rawText) {
    const text = rawText.toLowerCase().trim();
    console.log("Processing Command:", text);

    const speechStatus = document.getElementById('speechStatus');
    if (speechStatus) speechStatus.textContent = `Action: "${rawText}"`;

    if (activeLessonTimer) clearTimeout(activeLessonTimer);

    // 1. Emergency Stop Check
    if (text === 'stop' || text.includes('stop action') || text.includes('stop speech') || text.includes('stop teaching') || text.includes('halt') || text.includes('freeze') || text.includes('pause') || text.includes('cancel') || text.includes('silence') || text.includes('shut up') || text.includes('quiet')) {
        stopAllActions("Action stopped immediately by command.");
        return;
    }

    // 2. Clear / Reset / Stand / Idle
    if (text.includes('clear') || text.includes('remove all') || text.includes('reset') || text === 'idle' || text.includes('stand') || text.includes('put down') || text.includes('store') || text.includes('take off')) {
        stopAllActions("Standing ready for your next instruction!");
        return;
    }

    // 3. First-Command Welcome Greeting Check & Explicit Welcome Triggers
    if (!isFirstCommandExecuted && (text === '' || text.includes('start') || text.includes('begin') || text.includes('hello') || text.includes('hi') || text.includes('welcome') || text.includes('hey') || text.includes('class') || text.includes('interactive'))) {
        welcomeInteractiveClass();
        return;
    }

    if (text.includes('welcome') || text.includes('wave') || text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('good morning') || text.includes('greet')) {
        welcomeInteractiveClass();
        return;
    }

    // 4. Specific Curriculum Topics & Projects Detection
    // Sri Shakthi College: Faces FRONT in conversational stance (like CM Vijay & VoxSim AI)
    if (text.includes('sri shakthi') || text.includes('siet') || text.includes('shakthi college') || text.includes('shakthi') || text.includes('shakti') || text.includes('coimbatore college') || text.includes('our college') || text.includes('college')) {
        presentSietCollege();
        return;
    }

    // VoxSim AI SIH 2025: Faces FRONT in conversational stance
    if (text.includes('voxsim') || text.includes('project') || text.includes('our project') || text.includes('sih') || text.includes('hackathon') || text.includes('innovexa')) {
        presentVoxSimProject();
        return;
    }

    // Thalapathy Vijay: Faces FRONT in conversational stance
    if (text.includes('vijay') || text.includes('cm vijay') || text.includes('tvk') || text.includes('thalapathy')) {
        presentVijayJourney();
        return;
    }

    // World War 1: Turns BACKWARD facing the board with laser pointer & book (like Newton's Law)
    if (text.includes('world war') || text.includes('ww1') || text.includes('ww 1') || text.includes('great war') || text.includes('1914') || text.includes('history') || text.includes('war')) {
        teachBoardLesson(CURRICULUM_TOPICS.ww1);
        return;
    }

    // Newton's Third Law: Turns BACKWARD facing the board with laser pointer & book
    if (text.includes('newton') || text.includes('third law') || text.includes('3rd law') || text.includes('action and reaction') || text.includes('action reaction') || text.includes('physics')) {
        teachBoardLesson(CURRICULUM_TOPICS.newton);
        return;
    }

    // Active & Passive Voice: Turns BACKWARD facing the board
    if (text.includes('active and passive') || text.includes('passive voice') || text.includes('active voice') || text.includes('grammar') || text.includes('english') || text.includes('voice')) {
        teachBoardLesson(CURRICULUM_TOPICS.voice);
        return;
    }

    // Periodic Table: Turns BACKWARD facing the board
    if (text.includes('periodic table') || text.includes('periodic') || text.includes('elements') || text.includes('chemistry') || text.includes('mendeleev')) {
        teachBoardLesson(CURRICULUM_TOPICS.periodic);
        return;
    }

    // Mathematics Pythagorean Theorem: Turns BACKWARD facing the board
    if (text.includes('math') || text.includes('pythagoras') || text.includes('pythagorean') || text.includes('algebra') || text.includes('triangle') || text.includes('geometry')) {
        teachBoardLesson(CURRICULUM_TOPICS.math);
        return;
    }

    // Photosynthesis: Turns BACKWARD facing the board
    if (text.includes('photosynthesis') || text.includes('biology') || text.includes('sunlight') || text.includes('chlorophyll')) {
        teachBoardLesson(CURRICULUM_TOPICS.photosynthesis);
        return;
    }

    // AI & Robotics: Turns BACKWARD facing the board
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('robotics') || text.includes('machine learning') || text.includes('neural')) {
        teachBoardLesson(CURRICULUM_TOPICS.ai);
        return;
    }

    // 5. General Pose & Action Commands
    isFirstCommandExecuted = true;
    let responseSpeech = "";
    let whiteboardTitle = "";
    let whiteboardHTML = "";

    if (text.includes('teacher teaches') || text.includes('teacher teach') || text.includes('teaches') || text.includes('teach') || text.includes('lesson') || text.includes('lecture') || text.includes('board')) {
        teachBoardLesson(CURRICULUM_TOPICS.newton);
        return;
    } else if (text.includes('present') || text.includes('speech') || text.includes('talk to class') || text.includes('speak front')) {
        state.pose = 'talk_gestures';
        state.expression = 'happy';
        responseSpeech = "Addressing the classroom directly!";
        whiteboardTitle = "🎙️ Classroom Presentation";
        whiteboardHTML = `<p>Welcome students! Let's explore today's learning objectives together.</p>`;
    } else if (text.includes('point up') || text.includes('point_up') || text === 'point' || text.includes('point high') || text.includes('look up')) {
        state.pose = 'point_up';
        state.expression = 'focused';
        responseSpeech = "Pointing out the most important concepts!";
        whiteboardTitle = "☝️ Key Highlight";
        whiteboardHTML = `<p>Always remember the core fundamentals when solving complex problems!</p>`;
    } else if (text.includes('explain') || text.includes('pointer') || text.includes('stick') || text.includes('point stick')) {
        state.pose = 'explain';
        state.expression = 'happy';
        state.objects.pointer = true;
        responseSpeech = "Holding my pointer stick ready to explain!";
        whiteboardTitle = "🪄 Interactive Explanation";
        whiteboardHTML = `<p>Let's break down this topic into clear, easy-to-understand steps.</p>`;
    } else if (text.includes('read') || text.includes('book') || text.includes('chapter') || text.includes('textbook')) {
        state.pose = 'read';
        state.expression = 'focused';
        state.objects.book = true;
        responseSpeech = "Reading from chapter 4 page 12. Knowledge is power!";
        whiteboardTitle = "📖 Chapter Reading";
        whiteboardHTML = `<p><em>"The secret of getting ahead is getting started."</em> — Mark Twain</p>`;
    } else if (text.includes('write') || text.includes('pen') || text.includes('draw') || text.includes('marker') || text.includes('notes')) {
        state.pose = 'write';
        state.expression = 'focused';
        state.objects.pen = true;
        responseSpeech = "Turning to the board and writing down key highlights.";
        whiteboardTitle = "🖊️ Whiteboard Notes";
        whiteboardHTML = `<p>Writing notes: Step 1 • Step 2 • Step 3 • Key Takeaways & Conclusion</p>`;
    } else if (text.includes('sit') || text.includes('laptop') || text.includes('desk') || text.includes('type') || text.includes('table') || text.includes('computer')) {
        state.pose = 'laptop_desk';
        state.expression = 'happy';
        state.objects.laptop = true;
        state.objects.desk = true;
        responseSpeech = "Sitting at my desk and typing on my laptop!";
        whiteboardTitle = "💻 Computer Lab Workspace";
        whiteboardHTML = `<p>Preparing lecture notes, digital slides, and interactive programming code!</p>`;
    } else if (text.includes('backpack') || text.includes('bag')) {
        state.pose = 'backpack_pose';
        state.expression = 'happy';
        state.objects.backpack = true;
        responseSpeech = "Got my backpack ready for school!";
        whiteboardTitle = "🎒 Ready for Class";
        whiteboardHTML = `<p>All textbooks, stationery, and assignments packed.</p>`;
    } else if (text.includes('plant') || text.includes('pot') || text.includes('flower')) {
        state.objects.plant = true;
        responseSpeech = "Placed a nice green plant on the desk!";
        whiteboardTitle = "🪴 Classroom Decor";
        whiteboardHTML = `<p>Fresh green potted plant placed on the classroom desk.</p>`;
    } else if (text.includes('thumb') || text.includes('good') || text.includes('great') || text.includes('awesome') || text.includes('yes') || text.includes('appreciate') || text.includes('perfect') || text.includes('well done')) {
        state.pose = 'thumbs_up';
        state.expression = 'happy';
        responseSpeech = "Great job! Keep up the fantastic effort!";
        whiteboardTitle = "👍 Great Job!";
        whiteboardHTML = `<p>Excellent work on completing the assignment and participating in class!</p>`;
    } else if (text.includes('walk') || text.includes('run') || text.includes('move') || text.includes('stroll')) {
        state.pose = 'walk';
        state.expression = 'happy';
        responseSpeech = "Walking across the classroom floor.";
        whiteboardTitle = "🚶 Active Classroom";
        whiteboardHTML = `<p>Teacher is walking across the room to inspect student projects.</p>`;
    } 
    // 6. Expressions
    else if (text.includes('surprised') || text.includes('shocked') || text.includes('wow') || text.includes('amazing')) {
        state.expression = 'surprised';
        responseSpeech = "Wow, that is remarkable insight!";
    } else if (text.includes('sad') || text.includes('sorry') || text.includes('cry') || text.includes('unhappy')) {
        state.expression = 'sad';
        responseSpeech = "Oh no, let's review that problem together and get it right.";
    } else if (text.includes('nervous') || text.includes('hard') || text.includes('sweat') || text.includes('difficult')) {
        state.expression = 'nervous';
        responseSpeech = "Phew, that was a tough question, but we can do it together!";
    } else if (text.includes('talking') || text.includes('talk') || text.includes('speak')) {
        state.expression = 'talking';
        responseSpeech = "Discussing the core principles with the classroom.";
    } else if (text.includes('focused') || text.includes('focus') || text.includes('think') || text.includes('analyze')) {
        state.expression = 'focused';
        responseSpeech = "Analyzing the equation carefully.";
    } else if (text.includes('happy') || text.includes('smile') || text.includes('smiling') || text.includes('laugh')) {
        state.expression = 'happy';
        responseSpeech = "Always happy to teach and learn together!";
    } 
    // 7. Intelligent Conversational Fallback (Student Queries)
    else {
        state.pose = 'talk_gestures';
        state.expression = 'talking';

        if (text.includes('who are you') || text.includes('what is your name')) {
            responseSpeech = "I am Smart Teacher AI, your interactive animated classroom teacher equipped with voice synthesis, whiteboard presentations, and STEM simulation lessons!";
        } else if (text.includes('how are you')) {
            responseSpeech = "I am feeling great and energized to teach! What topic would you like to explore today?";
        } else if (text.includes('what can you do') || text.includes('help')) {
            responseSpeech = "I can present curriculum lessons on the whiteboard, hold books and laser pointers, sit at my laptop desk, write notes, and respond to your voice commands!";
        } else {
            responseSpeech = `I heard: "${rawText}". I am ready to teach, demonstrate, or present this topic for you!`;
        }

        whiteboardTitle = "💬 Student Query";
        whiteboardHTML = `
            <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 10px; padding: 12px 16px;">
                <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 4px;">Student Asked:</p>
                <p style="color: #00e5ff; font-weight: 600; font-size: 1rem; margin-bottom: 8px;">"${rawText}"</p>
                <p style="color: #e2e8f0; font-size: 0.92rem;">${responseSpeech}</p>
            </div>
        `;
    }

    renderCharacter();
    if (whiteboardTitle) updateWhiteboard(whiteboardTitle, whiteboardHTML);
    speak(responseSpeech, () => {
        if (state.expression === 'talking') {
            state.expression = 'happy';
            renderCharacter();
        }
    });
}

// Setup Event Listeners & UI Controls
function initUIControls() {
    const micBtn = document.getElementById('micButton');
    const stopBtn = document.getElementById('stopButton');
    const sidebarStopBtn = document.getElementById('sidebarStopBtn');
    const speechStatus = document.getElementById('speechStatus');
    const transcriptEl = document.getElementById('speechTranscript');

    // Emergency Stop Button Listeners
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            stopAllActions("Action stopped immediately.");
        });
    }

    if (sidebarStopBtn) {
        sidebarStopBtn.addEventListener('click', () => {
            stopAllActions("Action stopped immediately.");
        });
    }

    // Global Keydown Listeners (Space = Mic Toggle, Escape = Emergency Stop)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            e.preventDefault();
            stopAllActions("Action stopped immediately by Esc key.");
        } else if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            if (micBtn) micBtn.click();
        }
    });

    // Speech Recognition Setup
    if (recognition && micBtn) {
        recognition.onstart = () => {
            state.isListening = true;
            micBtn.classList.add('listening');
            if (speechStatus) speechStatus.textContent = "Listening... Speak now!";
            if (transcriptEl) {
                transcriptEl.classList.remove('hidden');
                transcriptEl.textContent = "🎙️ Listening for your voice command...";
            }
        };

        recognition.onend = () => {
            // Auto-restart if user has listening mode activated
            if (state.isListening) {
                if (speechRestartTimeout) clearTimeout(speechRestartTimeout);
                speechRestartTimeout = setTimeout(() => {
                    if (state.isListening) {
                        try {
                            recognition.start();
                        } catch(e) {}
                    }
                }, 150);
            } else {
                micBtn.classList.remove('listening');
                if (speechStatus && speechStatus.textContent.includes('Listening')) {
                    speechStatus.textContent = "Ready";
                }
                if (transcriptEl) {
                    setTimeout(() => {
                        if (!state.isListening) transcriptEl.classList.add('hidden');
                    }, 2500);
                }
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const liveSpokenText = (finalTranscript || interimTranscript).trim();

            if (liveSpokenText) {
                if (transcriptEl) {
                    transcriptEl.classList.remove('hidden');
                    transcriptEl.textContent = `🎙️ Heard: "${liveSpokenText}"`;
                }
                if (speechStatus) {
                    speechStatus.textContent = `Hearing: "${liveSpokenText}"`;
                }
            }

            if (finalTranscript.trim()) {
                const command = finalTranscript.trim();
                console.log("Voice Command Detected:", command);
                processCommand(command);
            }
        };

        recognition.onerror = (e) => {
            console.warn("Speech Recognition Error:", e.error);
            if (e.error === 'no-speech') {
                return; // Normal pause in speaking, stay active
            }
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
                state.isListening = false;
                micBtn.classList.remove('listening');
                if (speechStatus) speechStatus.textContent = "Mic permission required. Click mic to allow.";
            } else if (e.error !== 'aborted') {
                if (speechStatus) speechStatus.textContent = `Mic: ${e.error}`;
            }
        };

        micBtn.addEventListener('click', () => {
            if (state.isListening) {
                // Immediate hard cutoff of microphone
                state.isListening = false;
                if (speechRestartTimeout) {
                    clearTimeout(speechRestartTimeout);
                    speechRestartTimeout = null;
                }
                try {
                    recognition.abort();
                } catch(e) {
                    try { recognition.stop(); } catch(err){}
                }
                micBtn.classList.remove('listening');
                if (speechStatus) speechStatus.textContent = "Mic stopped";
                if (transcriptEl) transcriptEl.classList.add('hidden');
            } else {
                try {
                    state.isListening = true;
                    micBtn.classList.add('listening');
                    if (speechStatus) speechStatus.textContent = "Listening... Speak now!";
                    if (transcriptEl) {
                        transcriptEl.classList.remove('hidden');
                        transcriptEl.textContent = "🎙️ Listening for your voice command...";
                    }
                    recognition.start();
                } catch(e) {
                    console.warn("Recognition start error:", e);
                    state.isListening = false;
                    micBtn.classList.remove('listening');
                }
            }
        });
    }

    // Form Text Command Submit
    const textForm = document.getElementById('text-command-form');
    const textInput = document.getElementById('commandInput');
    if (textForm && textInput) {
        textForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = textInput.value.trim();
            if (val) {
                if (speechStatus) speechStatus.textContent = `Command: "${val}"`;
                processCommand(val);
                textInput.value = '';
            }
        });
    }

    // Pose Buttons Click Listeners
    document.querySelectorAll('.pose-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pose-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetPose = btn.getAttribute('data-pose');
            if (targetPose === 'teach_board') {
                teachBoardLesson();
            } else if (targetPose === 'talk_gestures') {
                state.pose = 'talk_gestures';
                renderCharacter();
                speak("Presenting directly to the classroom.");
            } else if (targetPose === 'wave') {
                welcomeInteractiveClass();
            } else {
                if (activeLessonTimer) clearTimeout(activeLessonTimer);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                
                state.pose = targetPose;
                let poseResponse = "";

                if (targetPose === 'point_up') {
                    poseResponse = "Pointing out the most important concepts!";
                } else if (targetPose === 'explain') {
                    state.objects.pointer = true;
                    poseResponse = "Holding my pointer stick ready to explain!";
                } else if (targetPose === 'read') {
                    state.objects.book = true;
                    poseResponse = "Reading from chapter 4 page 12!";
                } else if (targetPose === 'write') {
                    state.objects.pen = true;
                    poseResponse = "Turning to the board with pen to write notes!";
                } else if (targetPose === 'laptop_desk') {
                    state.objects.laptop = true;
                    state.objects.desk = true;
                    poseResponse = "Sitting at my desk and typing on my laptop!";
                } else if (targetPose === 'backpack_pose') {
                    state.objects.backpack = true;
                    poseResponse = "Got my backpack ready for class!";
                } else if (targetPose === 'thumbs_up') {
                    poseResponse = "Great job! Keep up the fantastic effort!";
                } else if (targetPose === 'walk') {
                    poseResponse = "Walking across the classroom floor.";
                } else if (targetPose === 'idle') {
                    for (let k in state.objects) state.objects[k] = false;
                    poseResponse = "Standing ready for your instruction.";
                }

                renderCharacter();
                if (poseResponse) speak(poseResponse);
            }
        });
    });

    // Accessories Buttons Click Listeners
    document.querySelectorAll('.obj-btn[data-obj]').forEach(btn => {
        btn.addEventListener('click', () => {
            const objKey = btn.getAttribute('data-obj');
            if (objKey === 'reset') {
                for (let k in state.objects) state.objects[k] = false;
                state.pose = 'idle';
                renderCharacter();
                speak("All accessories put away.");
                return;
            }

            state.objects[objKey] = !state.objects[objKey];

            if (objKey === 'laptop' || objKey === 'desk') {
                if (state.objects[objKey]) state.pose = 'laptop_desk';
            } else if (objKey === 'backpack') {
                if (state.objects[objKey]) state.pose = 'backpack_pose';
            } else if (objKey === 'pen') {
                if (state.objects[objKey]) state.pose = 'write';
            } else if (objKey === 'book') {
                if (state.objects[objKey] && state.pose === 'idle') state.pose = 'read';
            } else if (objKey === 'pointer') {
                if (state.objects[objKey] && state.pose === 'idle') state.pose = 'explain';
            }

            renderCharacter();
            const msg = state.objects[objKey] ? `Equipped ${objKey}!` : `Put away ${objKey}.`;
            speak(msg);
        });
    });

    // Expression Buttons Click Listeners
    document.querySelectorAll('.expr-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.expr-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const expr = btn.getAttribute('data-expr');
            state.expression = expr;
            renderCharacter();

            if (expr === 'happy') speak("Feeling positive and enthusiastic!");
            else if (expr === 'surprised') speak("Wow, that is remarkable insight!");
            else if (expr === 'nervous') speak("Phew, quite an interesting challenge!");
            else if (expr === 'sad') speak("Let's review this together.");
            else if (expr === 'focused') speak("Analyzing the problem carefully.");
            else if (expr === 'talking') speak("Explaining with active expression.");
        });
    });

    // Subject Lessons & Project Chips Click Listeners
    document.querySelectorAll('.lesson-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const topicKey = btn.getAttribute('data-topic');
            if (topicKey === 'voxsim') {
                presentVoxSimProject();
            } else if (topicKey === 'vijay') {
                presentVijayJourney();
            } else if (topicKey === 'siet') {
                presentSietCollege();
            } else if (topicKey === 'ww1') {
                teachBoardLesson(CURRICULUM_TOPICS.ww1);
            } else if (CURRICULUM_TOPICS[topicKey]) {
                teachBoardLesson(CURRICULUM_TOPICS[topicKey]);
            }
        });
    });

    // Guide Items Click Listeners
    document.querySelectorAll('.guide-item').forEach(item => {
        item.addEventListener('click', () => {
            const trigger = item.querySelector('.cmd-trigger');
            if (trigger) {
                const cmdText = trigger.textContent.replace(/["\/]/g, ' ').split(' or ')[0].trim();
                processCommand(cmdText);
            }
        });
    });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderCharacter();
        initUIControls();
        
        // Initial Whiteboard Welcome Setup
        updateWhiteboard(
            "👋 Welcome! Say \"Hi\" to start", 
            `<div style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6;">
                <p style="color: #67e8f9; font-weight: bold; margin-bottom: 6px;">✨ Smart Teacher Voice AI Ready</p>
                <p>Say or type <strong style="color: #00e5ff;">"Hi"</strong> in the command bar below to begin your interactive classroom experience!</p>
            </div>`,
            "Interactive Classroom"
        );
    } catch (err) {
        console.error("Initialization error:", err);
    }
    
    // Warm up speech synthesis voices
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
    }
});

// Also trigger immediate initialization in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    try {
        renderCharacter();
        initUIControls();
    } catch(e){}
}
