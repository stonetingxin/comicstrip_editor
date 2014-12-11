/*  
 *  JavaScript Document:
 *  Comic Book JS scripts 
 *  
 *  Authors: Domonkos Horvath & Leonardo Lanzinger
*/

// canvas dimensions
var cWidth = 700;
var cHeight = 843;
var blueInkColor = '#00FFFF';       // BLUE INK color
var customSVGColor = '#0b0b0b';     // Loaded SVG shapes color

// canvas object
var canvas_1;

// set to true if layout is created
var layout = false;

// JSON array: history array
var JSON_array = new Array();
var redo_array = new Array();
event_on_canvas = true;

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
fabric.Object.prototype.cornerColor = '#b7e3ff';
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.borderOpacityWhenMoving = 0.8;

// BLEED AREA (what is this?)
fabric.Bleed = fabric.util.createClass(fabric.Rect, {

    type: 'Bleed',
    left: 9,
    top: 9, 
    fill: 'transparent',    
    width: cWidth - 19,
    height: cHeight - 19,
    stroke: 'rgba(208, 37, 37, 0.3)',
    strokeWidth: 1,  
    perPixelTargetFind: true,
    selectable: false,

    initialize: function(element, options) {
        this.callSuper('initialize', element, options);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    }
});

fabric.Bleed.fromObject = function(object, callback) {
    callback && callback(new fabric.Bleed());
};

fabric.Bleed.async = true;

var bleed = new fabric.Bleed();

canvas.add(bleed);

var lockedLayout = false;

// -----------------------------------------------------------------------------
// ------------------------- STARTING EXAMPLE FUNCTIONS ------------------------
// -----------------------------------------------------------------------------

// rectangle
var rect = new fabric.Rect({
  left: 230,
  top: 240, 
  fill: '#2feb53',    
  width: 50,
  height: 50,  
});

// put test object and panel on canvas
// addPanel(50,50,140,140);
canvas.add(rect);

// rectangle
var rect_2 = new fabric.Rect({
  left: 330,
  top: 440, 
  fill: '#ff0053',    
  width: 100,
  height: 100,  
});

canvas.add(rect_2);


// -----------------------------------------------------------------------------
// ------------------------- OBJECTS CREATION ----------------------------------
// -----------------------------------------------------------------------------

//Panel Object
fabric.Panel = fabric.util.createClass(fabric.Rect, {

    type: 'Panel',
    fill: 'transparent',
    stroke: '#0f0f0f',
    strokeWidth: 6,  
    hasRotatingPoint: false,
    perPixelTargetFind: true,  
    
    initialize: function(options) {
        options;
        // this.left = 100;
        // this.top = 100;
        // this.width = 60;
        // this.height = 60;
        this.callSuper('initialize', options);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    }
    ,

    _render: function(ctx) {
        this.callSuper('_render', ctx);
    }
});

fabric.Panel.fromObject = function(object, callback) {
    callback && callback(new fabric.Panel());
};

// fabric.Panel.on({'scaling': function(e) {
//     var obj = this,
//         w = obj.width * obj.scaleX,
//         h = obj.height * obj.scaleY,
//         s = obj.strokeWidth;

//     obj.set({
//         'height'     : h,
//         'width'      : w,
//         'scaleX'     : 1,
//         'scaleY'     : 1
//         });
//     }
// });

fabric.Panel.async = true;

var panelObjectTest = new fabric.Panel({
    left: 200,
    top: 300,    
    width: 50,
    height: 100
});

canvas.add(panelObjectTest);

// console.log("just created and added to canvas " + canvas.getObjects().length + " items");

createJSON();


//ADD PANEL FUNCTION
function addPanel(x, y, w, h) {

    var panelObject = new Panel({
        // left: x,
        // top: y,    
        // width: w,
        // height: h
    });
    
    canvas.add(panelObject);

    console.log('panel added: x - y - w - h: ' + x + ' ' + y + ' ' + w + ' ' + h);

};

// Calculate each panel size according to canvas size and gutter then add panels in defined row
function addPanelRow(sr, r, c) {
        var startRow = sr;    
        var rows = r;
        var columns = c;
        var gutter = 15; 
    
        var pWidth = (cWidth - 24 - (gutter * (columns + 1)))/columns;
        var pHeight = (cHeight - 24 - (gutter * (rows + 1)))/rows;
        
        for (i = 0; i < columns; i++) { 
            addPanel(
                9 + gutter + (gutter * i) + (pWidth * i), 
                9 + (gutter * startRow) + (pHeight * (startRow - 1)), 
                pWidth, 
                pHeight);
        }
};

// ADD LAYOUT (x (left) - y (top) - w - h)
function createLayout(preset) {
    checkLayout();
    if (!layout) { 
    
        console.log('pressed layout: ' + preset);
        switch(preset) {
        case 1:                 // 3x3x3 layout
            addPanelRow(1,3,3);
            addPanelRow(2,3,3);    
            addPanelRow(3,3,3);
            break;
        case 2:                 // 3x2x3 layout
            addPanelRow(1,3,3);
            addPanelRow(2,3,2);    
            addPanelRow(3,3,3);    
            break;
        case 3:                 // 2x1x3 layout
            addPanelRow(1,3,2);
            addPanelRow(2,3,1);    
            addPanelRow(3,3,3); 
            break;
        case 4:                 // 2x1x2 layout
            addPanelRow(1,3,2);
            addPanelRow(2,3,1);    
            addPanelRow(3,3,2); 
            break;
        case 5:                 // 0x1x2 layout
            addPanelRow(2,3,1);    
            addPanelRow(3,3,2); 
            break;
        case 6:                 // 2x2 layout
            addPanelRow(1,2,2);    
            addPanelRow(2,2,2); 
            break;  
        case 7:                 // 1x1 layout
            addPanelRow(1,2,1);    
            addPanelRow(2,2,1); 
            break;
        
        default:
        console.log('Undefined layout ' + preset);  
        }

        layout = true;
    }
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
            var circ = new fabric.Circle({ top: 140, left: 200, radius: 30, fill: '#212121' });
            canvas.add(circ);
            break;
    case "rectangle":
            var rect2 = new fabric.Rect({ top: 100, left: 100, width: 50, height: 50, fill: '#212121' }); 
            canvas.add(rect2);
            break; 
    case "triangle":
            var triang = new fabric.Triangle({ top: 200, left: 300, width: 70, height: 70, fill: '#212121' });
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
    if(canvas.getActiveGroup()){
      canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
      canvas.discardActiveGroup().renderAll();
    } else {
      canvas.remove(canvas.getActiveObject());
    }
};


// CLEAR CANVAS

function cleanCanvas() {
    canvas.clear()
    canvas.add(bleed);
    lockedLayout = false;
    $('#lockMessage').html('Lock');
    $('#lockIcon').removeClass('fa-unlock');
    $('#lockIcon').addClass('fa-lock');
    layout = false;
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
    var temp;
    var typeo;
    
     // If a group selected 
    if(canvas.getActiveGroup()){     
        canvas.getActiveGroup().forEachObject(function(o){ 
        temp = o;
        typeo = o.get('type'); 
        console.log(typeo);  
        switch(typeo) {
            case 'panel':
                console.log('Cannot change the color of panels');
                break;
            case 'path':    
                if(temp.stroke == blueInkColor){
                    temp.set({ stroke: customSVGColor}); 
                }
                else{
                    temp.set({ stroke: blueInkColor});
                }
                break;
            default:
                if(temp.getFill() == blueInkColor){
                    temp.setFill(customSVGColor); 
                }
                else{
                    temp.setFill(blueInkColor); 
                }    
          }
            //console.log('added blueink for: ' + typeo);
          
      }); 
    // If a single objct selected   
    } else {      
        temp = canvas.getActiveObject();
        typeo = canvas.getActiveObject().get('type');
        console.log('added blueink for: ' + typeo);
        switch(typeo) {
            case 'panel':
                console.log('Cannot change the color of panels');
                break;
            case 'path':
                if(temp.stroke == blueInkColor){
                    temp.set({ stroke: customSVGColor}); 
                }
                else{
                    temp.set({ stroke: blueInkColor});
                }
                    
                break;    
            default:
                if(temp.getFill() == blueInkColor){
                    temp.setFill(customSVGColor); 
                }
                else{
                    temp.setFill(blueInkColor); 
                    temp.set({ stroke: blueInkColor});
                }
        }           
    }
    canvas.renderAll();
}; // end of function

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
};

// CHECK IF LAYOUT HAS PANELS IN IT
function checkLayout() {
    layout = false;
    for (var i=0; i<canvas.getObjects().length; i++) {
        if (canvas.item(i).type == 'panel') {
            layout = true;        
        }
    }
}

// backspace deletes selected element
$('html').keyup(function(e){
    if(e.keyCode == 8) {
        removeSelected();
    }
}) ;

// -----------------------------------------------------------------------------
// ------------------------- DRAWING MODE --------------------------------------
// -----------------------------------------------------------------------------

function drawingMode(){
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

// CANVAS EVENT
canvas.on('path:created', function(e) {
    event_on_canvas = true;
});

canvas.on('object:modified', function(e) {
    event_on_canvas = true;
});

canvas.on('object:removed', function(e) {
    event_on_canvas = true;
});

canvas.on('canvas:cleared', function(e) {
    event_on_canvas = true;
});

canvas.on('mouse:up', function(e) {
    createJSON();
});

// PANEL SCALING KEEPS STROKEWIDTH THE SAME
/*
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
*/


// -----------------------------------------------------------------------------
// --------------------------- JSON ------------------------------------------
// -----------------------------------------------------------------------------

function createJSON() {
    if (event_on_canvas == true) {
        var json = JSON.stringify(canvas);
        JSON_array.push(json);
        event_on_canvas = false;
        // TODO: set redo button unavailable! ???
        console.log("created JSON");
        redo_array = [];
        // console.log("trying to render " + canvas.getObjects().length + " items");
        canvas.clear();
        renderJSON();
    }
}

function renderJSON() {
    // console.log("trying to render JSON");
    var json = JSON_array[JSON_array.length - 1];
    // console.log("JSON object:");
    // console.log(json);

    canvas.loadFromDatalessJSON(json, function() {

      canvas.renderAll.bind(canvas);

      // console.log("rendering " + canvas.getObjects().length + " items");

      // for (var i = 0; i < canvas.getObjects().length; i++) {
      //       console.log("logging item in JSON n " + i + ":");
      //       console.log(canvas.item[i]);
      // }
    },
    // logging function -> to delete
    function (o, object) {
    //     console.log("trying to load item");
    //     console.log(o);
    }
    );
}

function undo() {
    if (JSON_array.length > 1) {
        var redo = JSON_array.pop();
        redo_array.push(redo);
        renderJSON();
    }
}

function redo() {
    if (redo_array.length > 0) {
        var redo_json = redo_array.pop();
        JSON_array.push(redo_json);
        renderJSON();
    }
}


