var boundingBoxParamsObj;
var colorKeyArr;
var coreSketch;
var digitRectWidth;
var numCols;
var numRows;
var piPhiManager;
var selectedValToVisualize;
var numDigitsInput;
var titleText1Width;
var toggleVal;
var toggle;
var visibleDigitsBool;
var visibleDigitsToggle;

var cellPadding = 5;
var digitsToDisplayDefault = 100;
var titleText2Width = 70;

// note: removing the decimal points here, rendering separately
const piFirstThousandDigits = '314159265358979323846264338327950288419716939937510582097494459230' + 
'7816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102' + 
'7019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603' + 
'4861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133' + 
'0530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749' + 
'5673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392' + 
'1717629317675238467481846766940513200056812714526356082778577134275778960917363717872146844090122495' + 
'3430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999' + 
'9983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387' + 
'5288658753320838142061717766914730359825349042875546873115956286388235378759375195778185778053217122' + 
'68066130019278766111959092164201989';
const phiFirstThousandDigits = '161803398874989484820458683436563811772030917980576286213544862270' + 
'5260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389086' + 
'5959395829056383226613199282902678806752087668925017116962070322210432162695486262963136144381497587' + 
'0122034080588795445474924618569536486444924104432077134494704956584678850987433944221254487706647809' + 
'1588460749988712400765217057517978834166256249407589069704000281210427621771117778053153171410117046' + 
'6659914669798731761356006708748071013179523689427521948435305678300228785699782977834784587822891109' + 
'7625003026961561700250464338243776486102838312683303724292675263116533924731671112115881863851331620' + 
'3840052221657912866752946549068113171599343235973494985090409476213222981017261070596116456299098162' + 
'9055520852479035240602017279974717534277759277862561943208275051312181562855122248093947123414517022' + 
'3735805772786160086883829523045926478780178899219902707769038953219681986151437803149974110692608867' + 
'429622675756052317277752035361393';


function load_num_digits(numDigits, piThousandArr, phiThousandArr) {
    let targetPiArr = piThousandArr.slice(0, numDigits);
    let targetPhiArr = phiThousandArr.slice(0, numDigits);
    return [targetPiArr, targetPhiArr];
}

function togglePiPhi() {
    fill("white");
    stroke("orange");
    strokeWeight(4);
    rect(titleText1Width - 50, 10, 70, 60);
    [selectedValToVisualize, toggleVal] = [toggleVal, selectedValToVisualize];

    textSize(50);
    fill("magenta");
    stroke("orange");
    strokeWeight(4);

    let titleText2 = text(selectedValToVisualize, titleText1Width - 50, 50);

    render_display(selectedValToVisualize);
}

function toggleVisibleDigits() {
    visibleDigitsBool = !visibleDigitsBool;
}

function insertNumDigits() {
    let numDigitsInt = Math.min(1000, parseInt(this.value()));
    let targetArr = load_num_digits(numDigitsInt, piFirstThousandDigits, phiFirstThousandDigits);
    piPhiManager["pi"][1] = targetArr[0];
    piPhiManager["phi"][1] = targetArr[1];
    digitRectWidth = calculateDigitRectWidth(numDigitsInt);
}

function render_display(pi_or_phi) {
    let targetPiPhiArr = piPhiManager[pi_or_phi][1];
    let startingX = boundingBoxParamsObj["bbPosX"] + cellPadding;
    let startingY = boundingBoxParamsObj["bbPosY"] + cellPadding;

    var targetDigitIndex = 0;
    for (let rowIndex=0; rowIndex < numRows; rowIndex++) {
        for (let colIndex=0; colIndex < numCols; colIndex++) {
            if (targetDigitIndex >= targetPiPhiArr.length) {
                return;
            }

            let targetDigit = int(targetPiPhiArr[targetDigitIndex]);
            let targetColor = colorKeyArr[targetDigit];

            strokeWeight(3);
            stroke(targetColor);
            fill(targetColor);

            let targetPosX = startingX + colIndex * (digitRectWidth + cellPadding);
            let targetPosY = startingY + rowIndex * (digitRectWidth + cellPadding);
            // TODO: color gradient edges for stroke
            rect(targetPosX, targetPosY, digitRectWidth, digitRectWidth);
            if (targetDigitIndex == 1) {
                // render `.` this separately
                stroke("navy");
                fill("cyan");
                strokeWeight(5);
                textSize(40);
                let periodText = text(".", targetPosX - (cellPadding * 9 / 10), targetPosY + digitRectWidth);   
            };

            // render digit inside rect
            if (visibleDigitsBool) {
                stroke("navy");
                strokeWeight(4);
                fill("white");
                textSize(20);

                let digitText = text(
                    targetDigit,
                    targetPosX + (digitRectWidth * 1 / 3),
                    targetPosY + (digitRectWidth * 2 / 3)
                );
            }

            targetDigitIndex++;
        }
    }
}

function calculateDigitRectWidth(numDigits) {
    let minW = 3;
    let maxW = 1000;
    for (let w = minW; w < maxW; w++) {
        let maxRects = Math.floor(boundingBoxParamsObj["bbWidth"] / w) * Math.floor(boundingBoxParamsObj["bbHeight"] / w);
        if (maxRects < numDigits) {
            return w - 1 - cellPadding;
        }
    }
}

function setup() {
    var canvasWidth = windowWidth * 0.95;
    var canvasHeight = windowHeight * 0.95;
    coreSketch = select('#coreSketch');
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(coreSketch);
    cursor(CROSS);

    // create bounding box for display
    stroke("lightgrey");
    strokeWeight(2);
    let bbWidth = canvasWidth - 10;
    let bbHeight = canvasHeight - canvasHeight * 0.3;
    let bbPosX = 0;
    let bbPosY = 0 + canvasHeight * 0.23;
    boundingBoxParamsObj = {
        "bbWidth": bbWidth,
        "bbHeight": bbHeight,
        "bbPosX": bbPosX,
        "bbPosY": bbPosY
    };
    rect(
        boundingBoxParamsObj["bbPosX"] + 8,
        boundingBoxParamsObj["bbPosY"] - 5,
        boundingBoxParamsObj["bbWidth"],
        boundingBoxParamsObj["bbHeight"]
    );

    digitRectWidth = calculateDigitRectWidth(digitsToDisplayDefault);

    // create legend container
    stroke("magenta");
    let legendWidth = (digitRectWidth / 2 + cellPadding) * 10;
    rect(
        boundingBoxParamsObj["bbWidth"] - legendWidth,
        boundingBoxParamsObj["bbPosY"] + boundingBoxParamsObj["bbHeight"] + 5,
        legendWidth,
        (digitRectWidth / 2 + cellPadding)
    );

    // TODO: populate legend
    // TODO: number toggle
    // TODO: flexbox (https://github.com/processing/p5.js/wiki/Positioning-your-canvas)

    noStroke();
    fill("black");
    textSize(12);

    let metaBox1 = text(
        "[read across rows & wrap down columns]",
        0,
        boundingBoxParamsObj["bbPosY"] - 10
    );

    let metaBox2 = text(
        "sources: https://www.angio.net/pi/digits.html, https://www.goldennumber.net/phi-million-places/",
        0,
        boundingBoxParamsObj["bbPosY"] + boundingBoxParamsObj["bbHeight"] + 20
    );
    let metaBox3 = text(
        "made with p5.js",
        boundingBoxParamsObj["bbPosX"],
        boundingBoxParamsObj["bbPosY"] + boundingBoxParamsObj["bbHeight"] + 30
    );

    // index is used to correspond to digit; e.g. colorKeyArr[0] returns the color for all `0` digits
    colorKeyArr = [
        "darkslategray",
        "red",
        "orange",
        "yellow",
        "green", 
        "aquamarine",
        "blue",
        "indigo",
        "purple",
        "magenta"
    ];

    // load digits of pi & phi into arrays
    let piThousandArr = piFirstThousandDigits.split("");
    let phiThousandArr = phiFirstThousandDigits.split("");
    let targetPiPhi = load_num_digits(digitsToDisplayDefault, piThousandArr, phiThousandArr);
    let targetPiArr = targetPiPhi[0];
    let targetPhiArr = targetPiPhi[1];
    piPhiManager = {
        "pi": [piThousandArr, targetPiArr],
        "phi": [phiThousandArr, targetPhiArr]
    };

    // randomly select pi or phi to default
    selectedValToVisualize = random(Object.keys(piPhiManager));
    toggleVal = selectedValToVisualize == "pi" ? "phi": "pi";

    // render display for selected value to visualize
    render_display(selectedValToVisualize);

    fill("rgba(100%,0%,100%,0.5)");
    stroke("orange");
    strokeWeight(2);
    textSize(50);
    let titleText1 = text("patterns of: ", 0, canvasHeight / 12);
    titleText1Width = textWidth(titleText1);
    fill("orange");
    textSize(25);
    let subtitleText = text("a small tool visualizing first pi/phi digits thru color", 0, canvasHeight * 2 / 11);

    fill("white");
    strokeWeight(4);
    rect(titleText1Width - 50, canvasHeight / 50, 70, 60);

    textSize(50);
    fill("magenta");
    stroke("orange");
    let titleText2 = text(selectedValToVisualize, titleText1Width - 50, canvasHeight / 12);

    toggle = select("#toggle");
    toggle.position(titleText1Width, 65);
    toggle.mousePressed(togglePiPhi);

    visibleDigitsToggle = select("#visibleDigitsToggle");
    visibleDigitsToggle.position(boundingBoxParamsObj["bbWidth"] / 2, boundingBoxParamsObj["bbPosY"] + boundingBoxParamsObj["bbHeight"] + 25);
    visibleDigitsToggle.mousePressed(toggleVisibleDigits);

    // select num digits to display
    noStroke();
    textSize(14);
    numDigitsInput = select("#numDigits");
    numDigitsInput.position(30, 65);  // TODO: change this to not be hard-coded
    numDigitsInput.input(insertNumDigits);
    let numDigitsInputText2 = text("first digits", 14 + numDigitsInput.width, 75);
    textSize(10);
    fill("black");
    let numDigitsInputText3 = text("(max: 1000)", 14 + numDigitsInput.width, 85);

    visibleDigitsBool = false;
    // EXTRA TODO: render small histogram
}

function draw() {
    stroke("darkgray");
    strokeWeight(2);
    fill("white");
    rect(
        boundingBoxParamsObj["bbPosX"],
        boundingBoxParamsObj["bbPosY"],
        boundingBoxParamsObj["bbWidth"],
        boundingBoxParamsObj["bbHeight"]
    );

    // numRectsPerRow corresponds conceptually to num cols
    let numRectsPerRow = Math.floor(boundingBoxParamsObj["bbWidth"] / (digitRectWidth + cellPadding));
    numCols = numRectsPerRow;

    // numRectsPerCol corresponds conceptually to num rows
    let numRectsPerCol = Math.floor(boundingBoxParamsObj["bbHeight"] / (digitRectWidth + cellPadding));
    numRows = numRectsPerCol;

    render_display(selectedValToVisualize);
}
