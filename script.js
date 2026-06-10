
// ------- ------- ------- ------- inputs & doc elements ------- ------- ------- ------- 
const doc = document;
const input = doc.getElementById('input-element')
const v0text = doc.getElementById('v_o-text')
const θtext = doc.getElementById('θ-text')
const v0slider = doc.getElementById('v_o-slider')
const launchBtn = doc.getElementById('launch-btn')
const snowball = doc.getElementById('snowball')
const snowman = doc.getElementById('snowman')
const xDisplay = doc.getElementById('x-display')
const rDisplay = doc.getElementById('r-display')

// ------- ------- ------- ------- vars ------- ------- ------- ------- 
let v0;
let vx0
let vy0
let theta;
let r;

// ------- ------- ------- ------- animation vars ------- ------- ------- ------- 
let animationID;
let launchDate;
let currentTime;
let slowFactor = 100;
let powerFactor = 2;
let snowballStart = {x: 5, y: 1500}
let snowballEnd = {x: 1000, y: 1500.00001}
let gravity = 9.8; 

// ------- ------- ------- ------- event listeners ------- ------- ------- ------- 
v0text.addEventListener('input', v0textChange)
v0slider.addEventListener('input', v0sliderChange)
θtext.addEventListener('input', θtextChange)
launchBtn.addEventListener('click', handleLaunch)


// ------- ------- ------- ------- functions ------- ------- ------- ------- 

function parseInputIntoInteger(input, bottomRange, topRange){
    let integer;
    
    if (input.value == ''){
        input.value = 0
        input.innerText = 0
        integer = 0;
    }
    else {
        integer = parseInt(input.value)
        switch (true){
            case (integer > topRange):
                integer = topRange;
                // console.log(`${integer} > ${topRange}!`)
                break;
            case (integer < bottomRange):
                integer = bottomRange;
                // console.log(`${integer} < ${bottomRange}!`)
                break;
        }
        input.value = integer;
        input.innerText = integer;
    }
    return integer;
}
function v0textChange(){
    v0 = parseInputIntoInteger(v0text, 0, 100)
    v0slider.value = v0;
    // cheatin'
    calcTheta(v0)
}

function v0sliderChange(){
    v0text.value = v0slider.value;
    v0 = v0slider.value;
    // cheatin'
    calcTheta(v0)
}

function θtextChange(){
    theta = parseInputIntoInteger(θtext, 0, 90)
    // cheatin'
    calcV0(theta)
}

function handleLaunch(){
    launchBtn.disabled = true;
    v0 = v0 * powerFactor;
    vx0 = v0 * Math.cos(theta * Math.PI / 180)
    vy0 = v0 * Math.sin(theta * Math.PI / 180) * -1 // because "up" is negative y px
    console.log(`launching! \n`,
        `vx0 = ${vx0} \n`,
        `vy0 = ${vy0} \n`,
        `θ = ${theta}º`,
    )
    snowball.style.left = `${snowballStart.x}px`
    snowball.style.top = `${snowballStart.y}px`
    launchDate = Date.now();

    animationID = requestAnimationFrame(launchLoop);
}
// ------- ------- ------- ------- on load ------- ------- ------- ------- 
function onLoad(){
    moveSnowman();
    defaultLoadOut();
}

function moveSnowman(){
    // 750 - 4080 (range = 3300)
    r = 750 + Math.random() * 3300
    // console.log(r)
    snowman.style.position = `absolute`
    snowman.style.left = `${r}px`
    snowman.style.top = `${snowballStart.y - 44}px`
    rDisplay.style.position = `absolute`
    rDisplay.style.left = `${r}px`
    rDisplay.style.top = `${snowballStart.y - 44 - 60}px`
    rDisplay.innerText = `R = ${Math.round(r / 4)}`
}

function defaultLoadOut(){ // dummy data 
    // pre-load v0
    v0text.value = 100;
    v0text.innerText = 100;

    // pre-load θ
    θtext.value = 45;

    // affect both of those
    v0textChange();
    θtextChange();
}

onLoad();

// ------- ------- ------- ------- animation ------- ------- ------- ------- 

const launchLoop = () => {
    currentTime = Date.now();
    
    let t = (currentTime - launchDate) / slowFactor;
    // x = x_0 + v_x0 * t;
    let x = snowballStart.x + vx0 * t;
    // y = y_0 + v_y0 * t + 1/2 a * t^2;
    let y = snowballStart.y + (vy0 * t) + (gravity / 2 * ((t) ** 2));
    // console.log(`∆t: ${t}, x: ${x}, y: ${y}`);
    if (
        // parsePixels(snowball.style.left) > snowballEnd.x
        // ||
        parsePixels(snowball.style.top) > snowballEnd.y
        
    ){
        cancelAnimationFrame(animationID);
        launchBtn.disabled = false;
        v0textChange();
        console.log(Math.abs(r - x))
        if (Math.abs(r - x) < 150){
            // console.log('within range!')
            alertMessage();
        }
        return;
    }
    else {
        snowball.style.left = `${x}px`
        snowball.style.top = `${y}px`
        xDisplay.innerText = `x: ${Math.round(x / 4)}`
    }
    
    animationID = requestAnimationFrame(launchLoop);
};

function parsePixels(pixelString){
    return parseFloat(pixelString.split('px')[0]);
}

// ------- ------- -------  lyin' cheatin' grand theft auto  ------- ------- ------- 

function calcTheta(v0){
    let angle = Math.asin((r / 4 * gravity) / (parseFloat(v0) ** 2)) * 180 / Math.PI / 2;
    console.log(`θ = ${angle}º`)
}

function calcV0(angle){
    let velocity = Math.sqrt((r * gravity) / Math.sin(2 * parseFloat(angle) * Math.PI / 180))
    console.log(`v0 = ${velocity / powerFactor}m/s`)
}


// ------- ------- ------- ------- snowman laments ------- ------- ------- ------- 

function alertMessage(){

    let laments = [
        'ouch!',
        'oof!',
        'wee bit chilly, innit!',
        'smells like carrots!',
        'ice to meet you!',
        'it\'s time to chill OOOUT!',
    ]
    let lamentIndex = Math.floor(Math.random() * laments.length);
    let lament = laments[lamentIndex];
    alert(lament)
}