// JavaScript Document
// Comic Book JS scripts - Domonkos Horvath

var cWidth = 598;
var cHeight = 843;

// CREATE THE FABRIC CANVAS
var canvas_1;

canvas_1 = document.createElement("canvas"); // CREATE CANVAS TAG
canvas_1.id = "c";                           // SET CANVAS ID
document.getElementById("canvasgoeshere").appendChild(canvas_1);    // Add canvas to container in HTML

canvas = new fabric.Canvas(canvas_1.id);    // Set up Fabric canvas from the canvas tag
canvas.backgroundColor = '#fff';            // CUSTOM BACKGROUND
canvas.selection = true;                    // DISABLE GROUP SELECTION
canvas.selectionColor = 'rgba(155, 154, 154, 0.3)';
canvas.selectionBorderColor = 'rgba(62, 62, 62, 0.3)';
canvas.selectionLineWidth = 1;


canvas.isDrawingMode = false;
canvas.setHeight(cHeight);                  // Set Height
canvas.setWidth(cWidth);                    // Set Width
    


// CUSTOMIZATIONS FOR ALL OBJECT
fabric.Object.prototype.cornerSize = 6;
fabric.Object.prototype.borderColor = '#25abff';
fabric.Object.prototype.cornerColor = '#25abff';
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.borderOpacityWhenMoving = 0.8;


// BLEED AREA
var bleeding = new fabric.Rect({
  left: 9,
  top: 9, 
  fill: 'transparent',    
  width: 579,
  height: 825,
  stroke: 'rgba(255, 56, 56, 0.42)',
  strokeWidth: 1,  
  perPixelTargetFind: true,
  selectable: false
});
canvas.add(bleeding);


// ------------------------- OBJECTS ------------------------

//SINGLE PANEL
var panel = new fabric.Rect({
    left: 100,
    top: 100, 
    fill: 'transparent',    
    width: 100,
    height: 100,
    stroke: '#0f0f0f',
    strokeWidth: 6,  
    hasRotatingPoint: false,
    perPixelTargetFind: true
});

//ADD PANEL FUNCTION
function addPanel(x, y, w, h) {
    var panel = new fabric.Rect({
    left: x,
    top: y, 
    fill: 'transparent',    
    width: w,
    height: h,
    stroke: '#0f0f0f',
    strokeWidth: 6,  
    hasRotatingPoint: false,
    perPixelTargetFind: true
    });
    
    canvas.add(panel);
    
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
}

// TEST RECTANGLE
var rect = new fabric.Rect({
  left: 100,
  top: 100, 
  fill: '#e03939',    
  width: 50,
  height: 50,  
});

var rect2 = new fabric.Rect({ top: 100, left: 100, width: 50, height: 50, fill: '#212121' });   
var circ = new fabric.Circle({ top: 140, left: 200, radius: 75, fill: '#212121' });
var triang = new fabric.Triangle({ top: 200, left: 300, width: 100, height: 100, fill: '#212121' });


// ------------------------- ADD OBJECTS TO THE CANVAS ------------------------

// TEST OBJECTS
canvas.add(rect);
canvas.add(panel);

// ADD LAYOUT (x (left) - y (top) - w - h)
function createLayout(clicked_id) {
    console.log('pressed layout');
    
            addPanel(18, 18, 180, 263);
            addPanel(207, 18, 180, 263);
            addPanel(397, 18, 180, 263);
            
            addPanel(18, 290, 180, 263);
            addPanel(207, 290, 180, 263);
            addPanel(397, 290, 180, 263);
            
            addPanel(18, 562, 180, 263);
            addPanel(207, 562, 180, 263);
            addPanel(397, 562, 180, 263);
    /*
    switch(clicked_id) {
    case "l333":
            addPanel(18, 18, 181, 263);
            addPanel(208, 18, 181, 263);
            addPanel(398, 18, 181, 263);
            
            addPanel(18, 290, 181, 263);
            addPanel(208, 290, 181, 263);
            addPanel(398, 290, 181, 263);
            
            addPanel(18, 562, 181, 263);
            addPanel(208, 562, 181, 263);
            addPanel(398, 562, 181, 263);
            break;
    case "l222":
            
            break; 
    case "l022":

            break;
    case "l212":

            break;
    default:
    }
    */
}

// SVG FROM LOCAL FILE
function addShape(shapeName) {
    console.log('adding shape', shapeName);
    var coord = getRandomLeftTop();
    
    fabric.Image.fromURL('./assets/svg/' + shapeName + '.svg', function(oImg) {
        
      oImg.set({
        left: coord.left,
        top: coord.top,
        fill: '#25abff',   
      })    
        
      canvas.add(oImg);
    });
  };



// FABRIC OBJECT

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
}

// -------------------------   MANIPULATION   ------------------------

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
    canvas.add(bleeding);
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

var colorSet = '#00FFFF';

function blueInking(){
    var temp = canvas.getActiveObject();
    var typeo = canvas.getActiveObject().get('type');

    console.log('pressed blueink' + typeo);
    temp.setFill(colorSet);
    canvas.renderAll();
}




// BLUE INK SVG (NOT FINISHED)
function svgblueink() {
    var typeo = canvas.getActiveObject().get('type');
  fabric.loadSVGFromURL('../scripts/svg/' + typeo + '.svg', function(objects, options) {
    var shape = fabric.util.groupSVGElements(objects, options);
    shape.set({
      left: 165,
      top: 100,
      width: 295,
      height: 40
    });
    if (shape.isSameColor && shape.isSameColor() || !shape.paths) {
      shape.setFill(colorSet);
    }
    else if (shape.paths) {
      for (var i = 0; i < shape.paths.length; i++) {
        shape.paths[i].setFill(colorSet);
      }
    }
    canvas.add(shape);
    canvas.renderAll();
  }); 
};

// FABRIC DRAWING 

//('#testbutton').click(proba);

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


// ------------------------- EVENTS ------------------------

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



