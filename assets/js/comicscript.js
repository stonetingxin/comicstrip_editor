/*  
 *  JavaScript Document:
 *  Comic Book JS scripts 
 *  
 *  Authors: Domonkos Horvath & Leonardo Lanzinger
*/

// canvas dimensions
var cWidth = 598;
var cHeight = 843;
var blueInkColor = '#00FFFF';       // BLUE INK color
var customSVGColor = '#747474';     // Loaded SVG shapes color

// canvas object
var canvas_1;

canvas_1 = document.createElement("canvas");                        // CREATE CANVAS TAG
canvas_1.id = "c";                                                  // SET CANVAS ID
document.getElementById("canvasgoeshere").appendChild(canvas_1);    // Add canvas to container in HTML

canvas = new fabric.Canvas(canvas_1.id);    // Set up Fabric canvas from the canvas tag
canvas.backgroundColor = '#fff';            // CUSTOM BACKGROUND

//Enable group selection
canvas.selection = true;                    
canvas.selectionColor = 'rgba(155, 154, 154, 0.3)';
canvas.selectionBorderColor = 'rgba(62, 62, 62, 0.3)';
canvas.selectionLineWidth = 1;

canvas.isDrawingMode = false;               // Drawing off
canvas.setHeight(cHeight);                  // Set Height
canvas.setWidth(cWidth);                    // Set Width
    
initAligningGuidelines(canvas);             // Initialitzing Align guidelines

// customization for all objects
fabric.Group.prototype.hasControls = false  // Group controls disabled
fabric.Object.prototype.cornerSize = 9;
fabric.Object.prototype.borderColor = '#25c4ff';
fabric.Object.prototype.cornerColor = '#25c4ff';
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.borderOpacityWhenMoving = 0.8;

// BLEED AREA (what is this?)
var bleed = new fabric.Rect({
  left: 9,
  top: 9, 
  fill: 'transparent',    
  width: cWidth - 19,
  height: cHeight - 19,
  stroke: 'rgba(208, 37, 37, 0.3)',
  strokeWidth: 1,  
  perPixelTargetFind: true,
  selectable: false
});
canvas.add(bleed);

var lockedLayout = false;

// -----------------------------------------------------------------------------
// ------------------------- STARTING EXAMPLE FUNCTIONS ------------------------
// -----------------------------------------------------------------------------

//  single panel
var panel = new fabric.Rect({
    left: 100,
    top: 100, 
    fill: 'transparent',    
    width: 100,
    height: 100,
    stroke: '#0f0f0f',
    strokeWidth: 6,  
    hasRotatingPoint: false,
    perPixelTargetFind: true,
    type: "panel"
});

// rectangle
var rect = new fabric.Rect({
  left: 230,
  top: 240, 
  fill: '#e03939',    
  width: 50,
  height: 50,  
});

// Rectangle, Circle, Triangle (used in addFobject() function)
var rect2 = new fabric.Rect({ top: 100, left: 100, width: 50, height: 50, fill: '#212121' });   
var circ = new fabric.Circle({ top: 140, left: 200, radius: 75, fill: '#212121' });
var triang = new fabric.Triangle({ top: 200, left: 300, width: 100, height: 100, fill: '#212121' });


// put test object and panel on canvas
canvas.add(rect);
canvas.add(panel);

// -----------------------------------------------------------------------------
// ------------------------- OBJECTS CREATION ----------------------------------
// -----------------------------------------------------------------------------
//ADD PANEL FUNCTION
function addPanel(x, y, w, h) {
    var panelObject = new fabric.Rect({
        left: x,
        top: y, 
        fill: 'transparent',    
        width: w,
        height: h,
        stroke: '#0f0f0f',
        strokeWidth: 6,  
        hasRotatingPoint: false,
        perPixelTargetFind: true,
        type: "panel"
    });
    
    canvas.add(panelObject);
    
    panelObject.on({'scaling': function(e) {
        var obj = this,
            w = obj.width * obj.scaleX,
            h = obj.height * obj.scaleY,
            s = obj.strokeWidth;

        obj.set({
            'height'     : h,
            'width'      : w,
            'scaleX'     : 1,
            'scaleY'     : 1
            });
        }
    });
};


// ADD LAYOUT (x (left) - y (top) - w - h)
function createLayout(preset) {
    console.log('pressed layout');
    if (preset == 1) {                  // 3x3 template
        addPanel(18, 18, 180, 263);
        addPanel(207, 18, 180, 263);
        addPanel(397, 18, 180, 263);
        
        addPanel(18, 290, 180, 263);
        addPanel(207, 290, 180, 263);
        addPanel(397, 290, 180, 263);
        
        addPanel(18, 562, 180, 263);
        addPanel(207, 562, 180, 263);
        addPanel(397, 562, 180, 263);
    }
    /* Add more presets: 
        e.g:
        else if(preset==2) then 
            addPanels()
            ...
    */
};

// ADD SVG SHAPE (WORKING)
function addShape(shapeName) {
    
    var colorSet = customSVGColor;          // CHANGE COLOR OF SVG 
    var coord = getRandomLeftTop();
    var url = "./assets/svg/" + shapeName + ".svg";
    
    // LOAD SVG FROM URL
    fabric.loadSVGFromURL(url, function(objects, options) {

      var loadedObject = fabric.util.groupSVGElements(objects, options);

      loadedObject.set({
        left: coord.left,
        top: coord.top,
        perPixelTargetFind: true  
      })
      .setCoords();
        
        if (loadedObject.isSameColor && loadedObject.isSameColor() || !loadedObject.paths) {
        loadedObject.setFill(colorSet);
        }
        else if (loadedObject.paths) {
            for (var i = 0; i < loadedObject.paths.length; i++) {
            loadedObject.paths[i].setFill(colorSet);
            } 
        }
        
      console.log('adding shape: ' + shapeName + ', paths lenght: ' + loadedObject.paths.length);    
      canvas.add(loadedObject);
      canvas.renderAll();    
    });
};

// ADD FABRIC OBJECT
function addFobject(clicked_id) {
    switch(clicked_id) {
    case "circle":
            canvas.add(circ);
            break;
    case "rectangle":
            canvas.add(rect2);
            break; 
    case "triangle":
            canvas.add(triang);
            break;
    default:
    }
};

// -----------------------------------------------------------------------------
// -------------------------   OBJECTS MANIPULATION   --------------------------
// -----------------------------------------------------------------------------

// SELECT ALL OBJECTS ON THE CANVAS
function selectAllObjects(){
    var objs = canvas.getObjects().map(function(o) {
    return o.set('active', true);
    });

    var group = new fabric.Group(objs, {
    originX: 'center', 
    originY: 'center'
    });

    canvas._activeObject = null;
    canvas.setActiveGroup(group.setCoords()).renderAll();
 }

// DELETE OBJECT
function removeSelected() {
    var activeObject = canvas.getActiveObject();
    canvas.remove(activeObject);
  };

// CLEAR CANVAS

function cleanCanvas() {
    canvas.clear()
    canvas.add(bleed);
  };

// LAYER MANAGEMENT
function layerManagement(clicked_id){
    
    var activeObject = canvas.getActiveObject();
    switch(clicked_id) {
    case "backward":
            canvas.sendBackwards(activeObject);
            break;
    case "forward":
            canvas.bringForward(activeObject);
            break; 
    case "sendback":
            canvas.sendToBack(activeObject);
            break;
    case "bringfront":
            canvas.bringToFront(activeObject);
            break;
    default:
    }
};

// BLUE INKING
function blueInking(){
    var temp = canvas.getActiveObject();
    var typeo = canvas.getActiveObject().get('type');

    console.log('added blueink for: ' + typeo);
    temp.setFill(blueInkColor);
    canvas.renderAll();
}

// LOCK LAYOUT
function lockLayout() {
    if (!lockedLayout) {    // lock it        
        for (var i=0; i<canvas.getObjects().length; i++) {
            if (canvas.item(i).type == 'panel') {
                canvas.item(i).selectable = false;
            }
        }
        lockedLayout = true;
        $('#lockMessage').html('Unlock');
        $('#lockIcon').removeClass('fa-lock');
        $('#lockIcon').addClass('fa-unlock');
    }
    else {                  // unlock it
        for (var i=0; i<canvas.getObjects().length; i++) {
            if (canvas.item(i).type == 'panel') {
                canvas.item(i).selectable = true;
            }
        }
        lockedLayout = false;
        $('#lockMessage').html('Lock');
        $('#lockIcon').removeClass('fa-unlock');
        $('#lockIcon').addClass('fa-lock');
    }
}

// -----------------------------------------------------------------------------
// ------------------------- DRAWING MODE --------------------------------------
// -----------------------------------------------------------------------------

//('#testbutton').click(proba);

// what is proba?
function proba(){
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        $('#proba').text('Exit drawing mode');
        $('#proba').addClass('btn-danger');
        $('#drawingOptions').show();
    }
    else {
        $('#proba').text('Enter drawing mode');
        $('#proba').removeClass('btn-danger');
        $('#drawingOptions').hide();
    } 
};

// -----------------------------------------------------------------------------
// --------------------------- EVENTS ------------------------------------------
// -----------------------------------------------------------------------------

// PANEL SCALING KEEPS STROKEWIDTH THE SAME
panel.on({'scaling': function(e) {
        var obj = this,
            w = obj.width * obj.scaleX,
            h = obj.height * obj.scaleY,
            s = obj.strokeWidth;

             obj.set({
            'height'     : h,
            'width'      : w,
            'scaleX'     : 1,
            'scaleY'     : 1
            });
         }
     });



