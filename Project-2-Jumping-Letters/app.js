document.addEventListener('DOMContentLoaded', () => {
    const letters = document.querySelectorAll('.letters span');
    const randomBtn = document.getElementById('randomBtn');
    const resetBtn = document.getElementById('resetBtn');
    const bgColorPicker = document.getElementById('bgColor');
    const body = document.body;
    
    // Set initial background color
    updateBackground(bgColorPicker.value);
    
    // Letter click handler
    letters.forEach(letter => {
        // Click event
        letter.addEventListener('click', (e) => {
            activateLetter(e.target);
        });
        
        // Keyboard event for accessibility
        letter.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateLetter(e.target);
            }
        });
    });
    
    // Random jump button
    randomBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * letters.length);
        activateLetter(letters[randomIndex]);
    });
    
    // Reset all letters
    resetBtn.addEventListener('click', () => {
        letters.forEach(letter => {
            letter.classList.remove('active');
            // Force reflow to reset animation
            void letter.offsetWidth;
        });
    });
    
    // Background color picker
    bgColorPicker.addEventListener('input', (e) => {
        updateBackground(e.target.value);
    });
    
    function activateLetter(letter) {
        // Remove active class first to reset animation
        letter.classList.remove('active');
        
        // Force reflow to reset animation
        void letter.offsetWidth;
        
        // Add active class to trigger animation
        letter.classList.add('active');
        
        // Remove active class after animation completes
        setTimeout(() => {
            letter.classList.remove('active');
        }, 1500);
    }
    
    function updateBackground(color) {
        // Create a slightly darker version for gradient
        const darkerColor = shadeColor(color, -20);
        body.style.background = `linear-gradient(135deg, ${color}, ${darkerColor})`;
    }
    
    // Helper function to shade a color
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3), 16);
        let G = parseInt(color.substring(3,5), 16);
        let B = parseInt(color.substring(5,7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  

        R = Math.round(R);
        G = Math.round(G);
        B = Math.round(B);

        const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
        const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
        const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }
});





























// const letters = document.querySelectorAll(".letters span");

// letters.forEach((letter)=>{

//     letter.addEventListener("click",(e)=>{
//         e.target.classList.add("active");
//     });
// });