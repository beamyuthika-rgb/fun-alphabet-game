// ==========================================
// 1. ประกาศตัวแปรและดึงระบบ Elements หลัก
// ==========================================
let score = 0;
let timeLeft = 120; // จำกัดเวลาการเล่น 2 นาที (120 วินาที)
let gameTimer;
let currentMode = null;
let isAnimating = false; // ป้องกันเด็กเอามือปัดซ้ำช่วงที่โปรแกรมกำลังเฉลยคำตอบ 3 วินาที
let cursorX = 0, cursorY = 0;
let currentAudio = null; 

const handCursor = document.getElementById('handCursor');
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const flashOverlay = document.getElementById('flashOverlay');
const questionText = document.getElementById('questionText');

const bgm = document.getElementById('bgm');
const sfxCorrect = document.getElementById('sfx-correct');
const sfxWrong = document.getElementById('sfx-wrong');
const sfxFinish = document.getElementById('sfx-finish');

// ฐานข้อมูลคำถาม (คุณครูสามารถ Copy บรรทัดด้านในเพิ่มตัวอักษรต่อๆ กันให้ครบถึง Z ได้เลยครับ)
const alphabetData = [
    { upper: 'A', lower: 'a', nameThai: 'เอ', soundFile: 'sound_a_name.mp3', phonicFile: 'sound_a_phonic.mp3' },
    { upper: 'B', lower: 'b', nameThai: 'บี', soundFile: 'sound_b_name.mp3', phonicFile: 'sound_b_phonic.mp3' },
    { upper: 'C', lower: 'c', nameThai: 'ซี', soundFile: 'sound_c_name.mp3', phonicFile: 'sound_c_phonic.mp3' },
    { upper: 'D', lower: 'd', nameThai: 'ดี', soundFile: 'sound_d_name.mp3', phonicFile: 'sound_d_phonic.mp3' },
    { upper: 'E', lower: 'e', nameThai: 'อี', soundFile: 'sound_e_name.mp3', phonicFile: 'sound_e_phonic.mp3' },
    { upper: 'F', lower: 'f', nameThai: 'เอฟ', soundFile: 'sound_f_name.mp3', phonicFile: 'sound_f_phonic.mp3' },
    { upper: 'G', lower: 'g', nameThai: 'จี', soundFile: 'sound_g_name.mp3', phonicFile: 'sound_g_phonic.mp3' },
    { upper: 'H', lower: 'h', nameThai: 'เอช', soundFile: 'sound_h_name.mp3', phonicFile: 'sound_h_phonic.mp3' },
    { upper: 'I', lower: 'i', nameThai: 'ไอ', soundFile: 'sound_i_name.mp3', phonicFile: 'sound_i_phonic.mp3' },
    { upper: 'J', lower: 'j', nameThai: 'เจ', soundFile: 'sound_j_name.mp3', phonicFile: 'sound_j_phonic.mp3' },
    { upper: 'K', lower: 'k', nameThai: 'เค', soundFile: 'sound_k_name.mp3', phonicFile: 'sound_k_phonic.mp3' },
    { upper: 'L', lower: 'l', nameThai: 'แอล', soundFile: 'sound_l_name.mp3', phonicFile: 'sound_l_phonic.mp3' },
    { upper: 'M', lower: 'm', nameThai: 'เอ็ม', soundFile: 'sound_m_name.mp3', phonicFile: 'sound_m_phonic.mp3' },
    { upper: 'N', lower: 'n', nameThai: 'เอ็น', soundFile: 'sound_n_name.mp3', phonicFile: 'sound_n_phonic.mp3' },
    { upper: 'O', lower: 'o', nameThai: 'โอ', soundFile: 'sound_o_name.mp3', phonicFile: 'sound_o_phonic.mp3' },
    { upper: 'P', lower: 'p', nameThai: 'พี', soundFile: 'sound_p_name.mp3', phonicFile: 'sound_p_phonic.mp3' },
    { upper: 'Q', lower: 'q', nameThai: 'คิว', soundFile: 'sound_q_name.mp3', phonicFile: 'sound_q_phonic.mp3' },
    { upper: 'R', lower: 'r', nameThai: 'อาร์', soundFile: 'sound_r_name.mp3', phonicFile: 'sound_r_phonic.mp3' },
    { upper: 'S', lower: 's', nameThai: 'เอส', soundFile: 'sound_s_name.mp3', phonicFile: 'sound_s_phonic.mp3' },
    { upper: 'T', lower: 't', nameThai: 'ที', soundFile: 'sound_t_name.mp3', phonicFile:'sound_t_phonic.mp3' },
    { upper: 'U', lower: 'u', nameThai: 'ยู', soundFile: 'sound_u_name.mp3', phonicFile: 'sound_u_phonic.mp3' },
    { upper: 'V', lower: 'v', nameThai: 'วี', soundFile: 'sound_v_name.mp3', phonicFile: 'sound_v_phonic.mp3' },
    { upper: 'W', lower: 'w', nameThai: 'ดับเบิลยู', soundFile: 'sound_w_name.mp3', phonicFile: 'sound_w_phonic.mp3' },
    { upper: 'X', lower: 'x', nameThai: 'เอ็กซ์', soundFile: 'sound_x_name.mp3', phonicFile: 'sound_x_phonic.mp3' },
    { upper: 'Y', lower: 'y', nameThai: 'วาย', soundFile: 'sound_y_name.mp3', phonicFile: 'sound_y_phonic.mp3' },
    { upper: 'Z', lower: 'z', nameThai: 'แซด/ซี', soundFile: 'sound_z_name.mp3', phonicFile: 'sound_z_phonic.mp3' }

];

// ==========================================
// 2. ผูกฟังก์ชันปุ่มเมาส์คลิกหน้าหลัก (ทำงานทันทีแม้กล้องไม่โหลด)
// ==========================================
document.getElementById('mode1-btn').onclick = () => startGame(1);
document.getElementById('mode2-btn').onclick = () => startGame(2);
document.getElementById('mode3-btn').onclick = () => startGame(3);
document.getElementById('mode4-btn').onclick = () => startGame(4);
document.getElementById('homeBtn').onclick = () => location.reload();

// สั่งให้เพลงเล่นทันทีที่มีการขยับ/คลิกเมาส์ หรือเอามือแตะหน้าจอครั้งแรก (แก้ทางที่ Browser บล็อก)
function playBGMOnFirstInteract() {
    bgm.volume = 0.4; // ตั้งความดัง 40% กำลังน่ารักไม่หนวกหู
    bgm.play().then(() => {
        // ถ้าเพลงเล่นสำเร็จแล้ว ให้ลบระบบดักจับนี้ออกไป จะได้ไม่รันซ้ำซ้อน
        document.removeEventListener('click', playBGMOnFirstInteract);
        document.removeEventListener('touchstart', playBGMOnFirstInteract);
    }).catch(e => console.log("Waiting for user interaction..."));
}

// ฝังระบบดักจับไว้ที่หน้าเว็บ ถ้านักเรียนคลิกหรือทัชตรงไหนก็ตาม เพลงจะเปิดทันที
document.addEventListener('click', playBGMOnFirstInteract);
document.addEventListener('touchstart', playBGMOnFirstInteract);

// ==========================================
// 3. ระบบตรวจจับท่าทางมือ MediaPipe (เซฟตี้ด้วย try-catch)
// ==========================================
try {
    const videoElement = document.getElementById('videoElement');
    const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    
    hands.setOptions({
        maxNumHands: 1, // จับตำแหน่งแค่มือเดียวที่ขึ้นจอ
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    hands.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            handCursor.style.display = 'block';
            let indexFinger = results.multiHandLandmarks[0][8]; // ดึงพิกัดจุดปลายสุดของนิ้วชี้
            
            // แปลงพิกัดให้เข้ากับขนาดหน้าจอจริง (คำนวณกลับด้านเพื่อให้ตรงกับกระจกเงา)
            cursorX = (1 - indexFinger.x) * window.innerWidth;
            cursorY = indexFinger.y * window.innerHeight;
            
            handCursor.style.left = `${cursorX}px`;
            handCursor.style.top = `${cursorY}px`;

            checkHoverCollision(); // ส่งค่าไปเช็คการชนปุ่มต่างๆ
        } else {
            handCursor.style.display = 'none';
        }
    });

    const camera = new Camera(videoElement, {
        onFrame: async () => { await hands.send({image: videoElement}); },
        width: 640, height: 480
    });
    camera.start().catch(err => console.log("Webcam pending or blocked, mouse active."));

} catch (error) {
    console.error("MediaPipe failed to load, switching to pure mouse mode.", error);
}

// ==========================================
// 4. ระบบเช็คพิกัดมือลอยไปแช่บนวัตถุ (Hover Collision)
// ==========================================
let hoverTimer = 0; 
let hoveringElement = null;

function checkHoverCollision() {
    if (isAnimating) return; // ช่วงเฉลยค้างไว้ 3 วิ ห้ามคำนวณซ้ำ
    
    // ซ่อนจุดแดงแวบหนึ่งเพื่อหาวัตถุแท้จริงที่อยู่ข้างใต้พิกัดนิ้วชี้
    handCursor.style.display = 'none';
    let element = document.elementFromPoint(cursorX, cursorY);
    handCursor.style.display = 'block';

    if (element && (element.classList.contains('hitbox') || element.classList.contains('option-box') || element.id === 'replayBtn' || element.id === 'homeBtn')) {
        if (hoveringElement !== element) {
            hoveringElement = element;
            hoverTimer = Date.now(); // เริ่มตั้งนาฬิกาจับเวลาแช่มือ
        } else {
            // เด็กๆ ต้องเอานิ้วชี้ชี้ค้างไว้ที่วัตถุนั้นๆ นานเกิน 0.8 วินาที ถึงจะทำการคลิก (ป้องกันมือปัดผ่านแล้วลั่น)
            if (Date.now() - hoverTimer > 800) { 
                element.click(); 
                hoveringElement = null; 
            }
        }
    } else {
        hoveringElement = null;
    }
}

// ==========================================
// 5. ระบบตรรกะตัวเกม (Game Logic)
// ==========================================
function startGame(mode) {
    currentMode = mode;
    score = 0;
    timeLeft = 120;
    scoreDisplay.innerText = `Score: ${score}`;
    
        
    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    gameTimer = setInterval(updateTimer, 1000);
    nextQuestion();
}

function updateTimer() {
    timeLeft--;
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    timerDisplay.innerText = `Time: ${m}:${s < 10 ? '0' : ''}${s}`;
    if (timeLeft <= 0) endGame();
}

function nextQuestion() {
    isAnimating = false;
    flashOverlay.className = '';
    optionsContainer.innerHTML = '';
    
    // สุ่มหยิบอักษรเป้าหมายหลักมา 1 ตัว และสุ่มตัวลวงมาเพิ่มอีก 2 ตัว (รวมเป็น 3 ตัวเลือกแบบไม่ซ้ำ)
    let target = alphabetData[Math.floor(Math.random() * alphabetData.length)];
    let distractors = alphabetData.filter(d => d !== target).sort(() => 0.5 - Math.random()).slice(0, 2);
    let choices = [target, ...distractors].sort(() => 0.5 - Math.random()); // สลับสับเปลี่ยนตำแหน่งช้อยส์

    if (currentAudio) currentAudio.pause();
    const replayBtn = document.getElementById('replayBtn');

    // โครงสร้างขอบเขตโซนกว้าง-ยาวในการสุ่มลอยกล่องคำตอบครึ่งบน (แบ่งเป็น ซ้าย / กลาง / ขวา เพื่อกันกล่องลอยทับซ้อนกัน)
    let zones = [
        { minX: 5,  maxX: 22, minY: 10, maxY: 55 }, 
        { minX: 38, maxX: 52, minY: 10, maxY: 55 }, 
        { minX: 72, maxX: 85, minY: 10, maxY: 55 }  
    ];
    zones.sort(() => 0.5 - Math.random()); // สุ่มกระจายทิศทางกล่องสลับโซนกันในแต่ละข้อ

    // แสดงโจทย์คำสั่งคำถามเป็นภาษาอังกฤษตามโหมดที่เลือกเล่น
    if (currentMode === 1) { // Alphabet Name
        questionText.innerHTML = `Letter: "${target.nameThai}"`; // มีเขียนคำอ่านภาษาไทยตามเงื่อนไขหลักของคุณครู
        try {
            currentAudio = new Audio('assets/' + target.soundFile);
            currentAudio.play().catch(e => {});
        } catch(e) {}
        choices.forEach((choice, index) => createOption(choice, `${choice.upper}${choice.lower}`, target, zones[index]));
    } 
    else if (currentMode === 2) { // Uppercase
        questionText.innerHTML = `Find UPPERCASE of: ${target.lower}`;
        choices.forEach((choice, index) => createOption(choice, choice.upper, target, zones[index]));
    }
    else if (currentMode === 3) { // Lowercase
        questionText.innerHTML = `Find lowercase of: ${target.upper}`;
        choices.forEach((choice, index) => createOption(choice, choice.lower, target, zones[index]));
    }
    else if (currentMode === 4) { // Phonic Sound
        questionText.innerHTML = `Listen to Phonic Sound`;
        try {
            currentAudio = new Audio('assets/' + target.phonicFile);
            currentAudio.play().catch(e => {});
        } catch(e) {}
        choices.forEach((choice, index) => createOption(choice, `${choice.upper}${choice.lower}`, target, zones[index]));
    }

    // เปิด-ปิดการใช้งานแสดงปุ่มลำโพงฟังซ้ำ เฉพาะโหมด 1 และ โหมด 4 เท่านั้น
    if (currentMode === 1 || currentMode === 4) {
        replayBtn.style.display = 'inline-block'; 
        replayBtn.onclick = () => {
            if (currentAudio) { currentAudio.currentTime = 0; currentAudio.play().catch(e=>{}); }
        };
    } else {
        replayBtn.style.display = 'none'; 
    }
}

function createOption(choiceObj, displayContent, targetObj, zone) {
    let box = document.createElement('div');
    box.className = 'option-box';
    box.innerText = displayContent;
    
    // คำนวณพิกัดให้ตัวเลือกกระจายตัวอยู่ตามโซนแบบสุ่ม% ไม่ทับกัน
    let randomLeft = Math.floor(Math.random() * (zone.maxX - zone.minX + 1)) + zone.minX;
    let randomTop = Math.floor(Math.random() * (zone.maxY - zone.minY + 1)) + zone.minY;
    box.style.left = `${randomLeft}%`;
    box.style.top = `${randomTop}%`;
    
    box.onclick = () => checkAnswer(choiceObj === targetObj, box, targetObj);
    optionsContainer.appendChild(box);
}

function checkAnswer(isCorrect, selectedBox, targetObj) {
    if (isAnimating) return;
    isAnimating = true; // ล็อคระบบไม่ให้กดตัวอื่นแทรกได้ระหว่างแสดงผลลัพธ์
    
    const allBoxes = document.querySelectorAll('.option-box');

    if (isCorrect) {
        // --- กรณีที่เด็กตอบถูกต้อง ---
        try { sfxCorrect.currentTime = 0; sfxCorrect.play(); } catch(e){}
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        flashOverlay.className = 'flash-green'; // พื้นหลังกางแผ่แวบสีเขียวซ้อนขึ้นมาทันที
        questionText.innerText = "Correct!!";   // ปรับข้อความเป็นอังกฤษแจ้งว่าถูก
        
        allBoxes.forEach(box => {
            if (box !== selectedBox) box.classList.add('hidden'); // ข้อผิดจางหายไป
            else box.classList.add('correct'); // ข้อที่ถูกกลายเป็นกรอบสีเขียวค้างไว้
        });
    } else {
        // --- กรณีที่เด็กตอบผิดพลาด ---
        try { sfxWrong.currentTime = 0; sfxWrong.play(); } catch(e){}
        flashOverlay.className = 'flash-red'; // พื้นหลังกางแผ่แวบสีแดงซ้อนขึ้นมาทันที
        questionText.innerText = "Wrong!";
        
        allBoxes.forEach(box => {
            if (box === selectedBox) {
                box.classList.add('wrong'); // ข้อที่เด็กเลือกผิดจะกลายเป็นกรอบสีแดง
            } else if (box.innerText.includes(targetObj.upper) || box.innerText.includes(targetObj.lower)) {
                box.classList.add('correct'); // ข้อที่ถูกต้องจริงๆ จะเฉลยสว่างขึ้นเป็นกรอบสีเขียว
            } else {
                box.classList.add('hidden'); // ข้อที่ไม่ได้เลือกจะหายไป
            }
        });
    }

    // ค้างผลลัพธ์หน้าจอเฉลยถูกผิดไว้ 3 วินาทีเต็มๆ ก่อนทำการสุ่มเปลี่ยนข้อถัดไปโดยอัตโนมัติ
    setTimeout(() => {
        if (timeLeft > 0) nextQuestion();
    }, 3000);
}

function endGame() {
    clearInterval(gameTimer);
    isAnimating = true;
    try { bgm.pause(); sfxFinish.play(); } catch(e){}
    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');
    document.getElementById('finalScore').innerText = `Your Score: ${score}`;
}