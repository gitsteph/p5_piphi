var boundingBoxParamsObj;
var colorKeyArr;
var numRectsPerRow;
var pi_phi_manager;
var selected_value_to_visualize;
var titleText1Width;
var toggle_value;
var toggle;

var digits_to_display_default = 100;
var titleText2Width = 70;
var digitRectWidth = 50;

// note: removing the decimal points here, rendering separately
const pi_first_thousand_digits = '314159265358979323846264338327950288419716939937510582097494459230' + 
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
const phi_first_thousand_digits = '161803398874989484820458683436563811772030917980576286213544862270' + 
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


// TODO: create textfield to allow adjusting num digits to display
// TODO: swap snake_case parts to camelCase oops
function load_num_digits(num_digits, pi_thousand_arr, phi_thousand_arr) {
    let target_pi_arr = pi_thousand_arr.slice(0, num_digits);
    let target_phi_arr = phi_thousand_arr.slice(0, num_digits);
    return [target_pi_arr, target_phi_arr];
}

function togglePiPhi() {
    fill("white");
    stroke("orange");
    strokeWeight(2);
    rect(titleText1Width - 50, 10, 70, 60);
    [selected_value_to_visualize, toggle_value] = [toggle_value, selected_value_to_visualize];

    textSize(50);
    fill("magenta");
    stroke("orange");
    let titleText2 = text(selected_value_to_visualize, titleText1Width - 50, 50);

    render_display(selected_value_to_visualize);
}

function render_display(pi_or_phi) {
    target_piphi_arr = pi_phi_manager[pi_or_phi][1];
    let startingX = boundingBoxParamsObj["bbPosX"] + 10;
    let startingY = boundingBoxParamsObj["bbPosY"] + 10;

    for (let i=0; i < target_piphi_arr.length - 1; i++) {
        let targetDigit = int(target_piphi_arr[i]);
        if (i == 1) {
            // TODO: render `.` this separately
        };
        let targetColor = colorKeyArr[targetDigit];
        strokeWeight(3);
        stroke(targetColor);
        fill(targetColor);
        rect(startingX + i * (digitRectWidth + 8), startingY, digitRectWidth, digitRectWidth);

        // TO-DO: render digit inside rect

    }
}

function setup() {
    var canvasWidth = windowWidth * 0.95;
    var canvasHeight = windowHeight * 0.95;
    var canvas = createCanvas(canvasWidth, canvasHeight);
    cursor(CROSS);

    // create bounding box for display
    stroke("lightgrey");
    strokeWeight(10);
    let bbWidth = canvasWidth - 10;
    let bbHeight = canvasHeight - canvasHeight * 0.25;
    let bbPosX = 0;
    let bbPosY = 0 + canvasHeight * 0.2;
    boundingBoxParamsObj = {
        "bbWidth": bbWidth,
        "bbHeight": bbHeight,
        "bbPosX": bbPosX,
        "bbPosY": bbPosY
    };
    rect(
        boundingBoxParamsObj["bbPosX"] + 10,
        boundingBoxParamsObj["bbPosY"] - 5,
        boundingBoxParamsObj["bbWidth"],
        boundingBoxParamsObj["bbHeight"]
    );

    fill("black");
    strokeWeight(1);
    textSize(12);

    let metaBox = text(
        "(made with p5.js; sources: https://www.angio.net/pi/digits.html, https://www.goldennumber.net/phi-million-places/)",
        0,
        boundingBoxParamsObj["bbPosY"] + boundingBoxParamsObj["bbHeight"] + 20
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
    let pi_thousand_arr = pi_first_thousand_digits.split("");
    let phi_thousand_arr = phi_first_thousand_digits.split("");
    let target_piphi = load_num_digits(digits_to_display_default, pi_thousand_arr, phi_thousand_arr);
    let target_pi_arr = target_piphi[0];
    let target_phi_arr = target_piphi[1];
    pi_phi_manager = {
        "pi": [pi_thousand_arr, target_pi_arr],
        "phi": [phi_thousand_arr, target_phi_arr]
    };

    // randomly select pi or phi to default
    selected_value_to_visualize = random(Object.keys(pi_phi_manager));
    toggle_value = selected_value_to_visualize == "pi" ? "phi": "pi";

    // render display for selected value to visualize
    render_display(selected_value_to_visualize);

    fill("rgba(100%,0%,100%,0.5)");
    stroke("orange");
    strokeWeight(2);
    textSize(50);
    let titleText1 = text("patterns of: ", 0, 50);
    titleText1Width = textWidth(titleText1);
    fill("orange");
    textSize(25);
    let subtitleText = text("a small tool visualizing first pi/phi digits thru color", 0, 100);

    fill("white");
    rect(titleText1Width - 50, 10, 70, 60);

    strokeWeight(2);
    textSize(50);
    fill("magenta");
    stroke("orange");
    let titleText2 = text(selected_value_to_visualize, titleText1Width - 50, 50);

    toggle = createButton("toggle");
    toggle.position(titleText1Width - 50, 70);
    toggle.mousePressed(togglePiPhi);

    // TODO: create info textbox for selected digits within frame stats
}

function draw() {
    stroke("darkgray");
    strokeWeight(10);
    fill("white");
    rect(
        boundingBoxParamsObj["bbPosX"],
        boundingBoxParamsObj["bbPosY"],
        boundingBoxParamsObj["bbWidth"],
        boundingBoxParamsObj["bbHeight"]
    );
    numRectsPerRow = boundingBoxParamsObj["bbWidth"] / digitRectWidth;

    render_display(selected_value_to_visualize);
}
