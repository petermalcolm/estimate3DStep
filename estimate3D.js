/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at estimate3D.html)
 */
function Estimate3D(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	
        this.aspectList = {};     // a pseudo-assoc.array for the estimation aspects
                                  // aspects are, length, width, height, etc...
                                  // lookup by name, eg aspectName['length'] = '11.0'
                                 
        this.negRect=new Image();
        this.posRect=new Image();

        
        this.click3Darray = [];   // the array that holds the user's clicks on the object

        this.estimateArray = [];  // the array that holds the user's estimates
        
        this.explanation = "";    // the user's explanation of process

	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
};

/**
 * This function appends a coordinate pair to the click3Darray.
 * The coordinate pair is (x,z) where these represent
 * the rotations around the x- and z-axes, respectively.
 */
Estimate3D.prototype.append3Dclick = function(xzPair) {
        // alert('called by thingiview');
        this.click3Darray.push(xzPair);
}

Estimate3D.prototype.appendEstimate = function(estimateFor, error) {
    var aspectLen = estimateFor.length;
    var abbrev = estimateFor.substr(0,1) + estimateFor.substr(aspectLen -1, 1);     // abbreviate to first and last letter
    // alert('Recording estimate for: '+ abbrev + ' as ' + error + ' error.');
    this.estimateArray.push([abbrev,error]);
}

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 */
Estimate3D.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		/*
		 * get the response from the latest state. the response variable is
		 * just provided as an example. you may use whatever variables you
		 * would like from the state object (look at estimate3DState.js)
		 */
		var latestResponse = latestState.response;
		
		//set the previous student work into the text area
		$('#studentResponseTextArea').val(latestResponse); 
        }
        

        thingiview = new Thingiview("viewer");
        thingiview.setObjectColor('#C0D8F0');
        thingiview.initScene();
        // thingiview.setShowPlane(true);
        // thingiview.loadArray(eval(document.getElementById('json').value));
        thingiview.loadArray(eval(this.content.figure)); 
        thingiview.setRotation(false);
        thingiview.setObjectColor('#CDFECD');       // green shapes
        // thingiview.setObjectColor('#ffffff');       // white shapes
        thingiview.setBackgroundColor('#ffffff');   // white background
                
        ///////////////// CODE FOR ESTI-GRAPHS ////////////////////////////
        // The idea is to create a lot of divs.
        // Inside the divs are little canvases.
        // Each canvas will hold the estimation area for a different aspect
        // of the figure on the screen
        
        var aspect;
        var that = this;  // alias the estimate3D object for reference in callbacks
        
        // TO DO - get rid of the onload functions.  Assume they have loaded by the time the user starts interaction
        
        this.negRect.onload = function (){
            // code here to render the negative rectangle
            // these draw dynamically in the ErrorBox canvases
            var aspectLocal;
            var aspectChild;
            for (aspectLocal in that.content.aspects) {
                if(that.content.aspects[aspectLocal][0] !== undefined){
                    aspectChild = that.content.aspects[aspectLocal][0];  // alias the aspect name
                    // var canvasLocal = document.getElementById(aspectChild+'ErrorBox');
                    // var contextLocal = canvasLocal.getContext('2d');
                    // contextLocal.drawImage(this,5,10,125,20);
                }
            }
        }
        
        this.posRect.onload = function (){
            // code here to render the negative rectangle
            // these draw dynamically in the ErrorBox canvases
            var aspectLocal;
            var aspectChild;
            for (aspectLocal in that.content.aspects) {
                if(that.content.aspects[aspectLocal][0] !== undefined){
                    aspectChild = that.content.aspects[aspectLocal][0];  // alias the aspect name
                    // var canvasLocal = document.getElementById(aspectChild+'ErrorBox');
                    // var contextLocal = canvasLocal.getContext('2d');
                    // contextLocal.drawImage(this,132,10,125,20);
                }
            }
        }
        
        this.negRect.src = "imgs/blue_orange.jpg";
        this.posRect.src = "imgs/orange_blue.jpg";
        
        
        // alert("number of aspects:" + this.content.aspects.length);
        // loop through the aspects of the figure that the user must estimate:
        
        for (aspect in this.content.aspects) {
            if(this.content.aspects[aspect][0] !== undefined){
                // alert(this.content.aspects[aspect][0]);
                var aspectName = this.content.aspects[aspect][0];
                var aspectValue = this.content.aspects[aspect][1];
                var aspectUnit = this.content.aspects[aspect][2];
                
                this.aspectList[aspectName]=aspectValue;        // add value to the list for later lookup
                this.aspectList[aspectName+'Unit']=aspectUnit;  // add unit as <aspect>Unit for lookup
                var required = "";
                var substitute = aspectName;
                if(aspectName=='volume'){ required = '* '; }
                if(aspectName=='pi'){ substitute = '&pi;'; }
                
                // first create a div specifying the name of the aspect:
                $('#estimationDiv').append(""
                    +"<div id ='" + aspectName + "Div'>"
                    + required
                    +"Estimate for: " + substitute + "<br />"         // mini-prompt
                    +"<input id ='" + aspectName + "Guess' type='text' />"// input text area
                    // button, with the name attribute set to the aspectName for later lookup:
                    +"<input id='" + aspectName + "Btn' name='" + aspectName + "' type='button' value='OK' />"
                    +"</div>"
                ); // end of new div
                
                // set button action
                $('#' + aspectName + 'Btn').bind('click', function() {
                    that.showError(this);
                });
                
                // a little canvas for just the red rectangle and the line:
                var estiCanvas=document.createElement('canvas'); // should be accessible through $('#'+aspectName+'Div > canvas')
                estiCanvas.width = 300;                          
                estiCanvas.height = 45;
                // estiCanvas.setAttribute('zIndex', this.content.aspects.length + aspect);  // a high z-index so we can draw below later
                estiCanvas.setAttribute('id', aspectName + 'ErrorBox');  // a high z-index so we can draw below later
                // estiCanvas.setAttribute("style","position: absolute; left: 0; top: 0;");
                var estiContext=estiCanvas.getContext('2d');
                estiContext.strokeStyle = '#f00'; // red box around +/-15% 
                estiContext.lineWidth = 4;
                estiContext.strokeRect(113,8,36,24);

                estiContext.strokeStyle = '#000'; // black line at exact answer
                estiContext.lineWidth = 3;
                estiContext.moveTo(131,3);
                estiContext.lineTo(131,38);
                estiContext.stroke();

                $('#' + aspectName + 'Div').append(estiCanvas);  //  add the canvas below the inputs
                
                $('#' + aspectName + 'Div').append("<div id='"+aspectName+"Show'><p>&nbsp;</p></div>");  // show exact if they're close
            } // end of aspect loop (if)
        } // end of aspect loop (for)
        
        $('#estimationDiv').append("<div id='explainDiv'><p>* Please explain in a few words how you estimated this volume</p>"
                                   + "<textarea id='studentResponseTextArea' rows='3' cols='40'></textarea>"
                                   + "</div><br />");  // provide a place for explanation
        
}; // end of render()

/**
 * This function shows the student an error-bar for his or her estimate
 * Optionally, it also shows 
 */ 

Estimate3D.prototype.showError = function(caller) {
    var srcAspect = caller.id.substr(0,caller.id.length - 3);               // a string with the name of the aspect (3 is 'Btn')
    var inputText = $('#' + srcAspect + 'Guess').attr('value');
    if(inputText == "") return;                                             // skip it if there's nothing doing
    var inputNum = parseFloat(inputText);                                   // convert to float, inputNum
    var actualNum = parseFloat(this.aspectList[srcAspect]);                 // and the actual, actualNum
    var canvasHandle = document.getElementById(srcAspect+'ErrorBox');
    var contextHandle = canvasHandle.getContext('2d');
    
    var error = (inputNum - actualNum)/actualNum;                           // error
    this.appendEstimate(srcAspect, error);                                       // method call to add to state for saving
    
    if(error == 0) {                                                        // code to say they got it
        $('#'+srcAspect+'Show').html('Exactly!  The actual '+ srcAspect +' is: ' + actualNum + ' ' + this.aspectList[srcAspect+'Unit'] + '.<br /><br /><br />');
        contextHandle.fillStyle = "rgb(255,255,255)";                       // white-over some
        contextHandle.fillRect(132,10,125,20);                              // entire positive region hidden
        contextHandle.fillRect(5,10,125,20);                                // entire negative region hidden
    }else if(error > -0.15 && error < 0.15) {                               // code to output the actual value if they're close:
        $('#'+srcAspect+'Show').html('Close enough!  The actual '+ srcAspect +' is: ' + actualNum + ' ' + this.aspectList[srcAspect+'Unit'] +  '.<br /><br /><br />');
    } else {
        $('#'+srcAspect+'Show').html('<p>&nbsp;</p>');
    }
                                                                            // code to show the bar:
    if(error < -1.0) { error = -1.0; }                                      // sanity check bound to +/-100%
    if(error > 1.0) { error = 1.0; }                                        // sanity check bound to +/-100%
    
    if(error < 0.0) {                                                       // negative error
        contextHandle.drawImage(this.negRect,5,10,125,20);
        contextHandle.fillStyle = "rgb(255,255,255)";                       // white-over some
        contextHandle.fillRect(132,10,125,20);                              // entire positive region hidden
        contextHandle.fillRect(5, 10, (1.0+error)*125.0, 20);
    } else if (error > 0.0) {                                               // positive error
        contextHandle.drawImage(this.posRect,132,10,125,20);
        contextHandle.fillStyle = "rgb(255,255,255)";                       // white-over some
        contextHandle.fillRect(5,10,125,20);                                // entire negative region hidden
        contextHandle.fillRect(132+error*125.0, 10, (1.0-error)*125.0, 20);
    }
    contextHandle.strokeStyle = '#f00';                                     // redraw red box around +/-15% 
    contextHandle.lineWidth = 4;
    contextHandle.strokeRect(113,8,36,24);

    contextHandle.strokeStyle = '#000';                                     // redraw black line at exact answer
    contextHandle.lineWidth = 3;
    contextHandle.moveTo(131,3);
    contextHandle.lineTo(131,38);
    contextHandle.stroke();
}

/**
 * This function retrieves the latest student work
 *
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Estimate3D.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at estimate3D.html).
 */
Estimate3D.prototype.save = function() {
    
	//get the answer the student wrote
	var response = $('#studentResponseTextArea').val();
	
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 */
        
	var estimate3DState = new Estimate3DState(response, estimate3D.click3Darray, estimate3D.estimateArray);
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', estimate3DState);

	//push the state object into this or object's own copy of states
	this.states.push(estimate3DState);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/estimate3D/estimate3D.js');
}