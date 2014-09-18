
var _picsTaken = 0;  
var take_picture ;
var events;
var image_interval;	// Image frequency
var image_count;	// Number of Images
var cameras;		// Camera Type FRONT/REAR
var button_state;	// Current Camera Start button state
var flash_state;	// Current Flash mode
/*
 * 1.Set the Timer interval
 * 2.Capture the Image
 * 3.Clear the Timer Interval
 */

function captureImage()
{
	timer = setInterval(function(){
		Ti.Media.takePicture();
		if((_picsTaken++ > image_count) || (button_state == 1) ){
		//   	alert('clear Interval');
			clearInterval(timer);
	        _picsTaken = 0;
	        Start_stop_capture();
	     }
	}, image_interval);
}

/*
 * 1. Change state of Camera Capture Button
 * 2. Start the camera to capture the Images
 */

function Start_stop_capture()
{
	if(button_state == 1)
	{
		button_state = 0;
		take_picture.title = 'Stop Picture';
		//Titanium.UI.View.keepScreenOn =true;
		Titanium.UI.View.keepScreenOn= true;
		if(flash_state)
			Ti.Media.setCameraFlashMode(  Ti.Media.CAMERA_FLASH_ON);
			
		captureImage();
		
	}
	else
	{
		button_state = 1;
		//Titanium.UI.View.keepScreenOn =false;
		Titanium.UI.View.keepScreenOn = false;
		if (flash_state)
			Ti.Media.setCameraFlashMode ( Ti.Media.CAMERA_FLASH_OFF);
		
		take_picture.title = 'Take Picture';
	}
}

/*
 * 1. camera overlay display camera view
 * 2. append the button over the camera overly
 * 3. button listener linked
 * 4. save the captured image into media storage
 */

function openCamera(){
Titanium.UI.View.keepScreenOn =true;
	var camera_overlay = Ti.UI.createView({
        top: 0,
        left: 0,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL
    });

	take_picture = Ti.UI.createButton({
    	height: Ti.UI.SIZE,
    	width: Ti.UI.SIZE,
    	bottom: 50,
    	title: 'Take Picture'
    });
    take_picture.addEventListener('click', function () {
    	Start_stop_capture();
    });
    camera_overlay.add(take_picture);
  
    // The actual show camera part
    Ti.Media.showCamera({
    	success:function(event)
        {
			Ti.Media.saveToPhotoGallery(event.media);
        },
        cancel:function(e)
        {
        },
        error:function(error)
        {
        },
        autohide: false,
        showControls: false,
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO ],
        overlay: camera_overlay, // The camera overlay being added to camera view
        whichCamera : cameras,	// Camera type assigned in camera show
        flashMode : false		// Flash Enable/Disable
    });
};

function doClickaq(e) {
    button_state= 1;
    events= null;
    openCamera();
}
/*
 * 1. this function called from Button click
 * 2. All the Input taken from HTML form
 * 3. Calculate the Camera Configurations and type
 * 4. Call camera show
 * 5. set the values in Camera Model 
 */

function ImageConfiguration (event) {

 image_interval = parseInt( $.picker_sec.getSelectedRow(0).title) * 1000 ;
 image_count = parseInt( $.picker_count.getSelectedRow(0).title);
 var avaikcameras = Ti.Media.availableCameras;
 
 /*
 var brightness = require('com.widbook.brightness'); // Third party for Brightness control
 alert('Window Bright level: ' + brightness.getWindowBrightLevel());
 alert('System Bright level: ' + brightness.getSystemBrightLevel() ); 
 */
// Select the Camera Type
 if ( $.picker_camera.getSelectedRow(0).title == "FRONT" )
 {
 	cameras = Ti.Media.CAMERA_FRONT;
 	image_count = image_count -2; 		// front camera captures additional of two images
 }
 else
 {
 	cameras = Ti.Media.CAMERA_REAR;
 }

// Select the Flash Mode
 if ( $.picker_flash.getSelectedRow(0).title == "ON" )
 {
 	flash_state = 1;
 }
 else
 {
 	flash_state = 0;
 }

var selectedparam = event.source;

    if (OS_ANDROID) {
		doClickaq();
    }
} 


$.index.open();
