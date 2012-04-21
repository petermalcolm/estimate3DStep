/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at estimate3D.html)
 */
function Estimate3D(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	
        this.aspectList = {};    // a pseudo-assoc.array for the estimation aspects
                                 // aspects are, length, width, height, etc...
        
        this.click3Darray = [];  // the array that holds the user's clicks on the object
        
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
                
        ///////////////// CODE FOR ESTI-GRAPHS ////////////////////////////
        // The idea is to create a lot of divs.
        // Inside the divs are little canvases.
        // Each canvas will hold the estimation area for a different aspect
        // of the figure on the screen
        
        var negRect=new Image();
        var posRect=new Image();
        
        negRect.onload = function (){
            // code here to render the negative rectangle
    // STOPPED HERE -- THIS CODE DOES NOTHING SO FAR
            // the goal is to draw these dynamically in the ErrorBox canvases
            //$('div[name*="ErrorBox"]') // hopefully, a wrapped set of the canvas elements
        }
        posRect.onload = function (){
            // code here to render the positive rectangle
        }
        
        negRect.src = "imgs/blue_orange.jpg";
        posRect.src = "imgs/orange_blue.jpg";
        
        // alert("number of aspects:" + this.content.aspects.length);
        // loop through the aspects of the figure that the user must estimate:
        
        var aspect;
        
        for (aspect in this.content.aspects) {
            if(this.content.aspects[aspect][0] !== undefined){
                // alert(this.content.aspects[aspect][0]);
                var aspectName = this.content.aspects[aspect][0];
                var aspectValue = this.content.aspects[aspect][1];
                
                this.aspectList[aspectName]=aspectValue;        // add to the list for later lookup
                
                // first create a div specifying the name of the aspect:
                $('#estimationDiv').append(""
                    +"<div id ='" + aspectName + "Div'>"
                    +"Estimate for: " + aspectName + "<br />"         // mini-prompt
                    +"<input id ='" + aspectName + "Guess' type='text' />"// input text area
                    // button, with the name attribute set to the aspectName for later lookup:
                    +"<input id='" + aspectName + "Btn' name='" + aspectName + "' type='button' value='OK' />"
                    +"</div>"
                ); // end of new div
                
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
                estiContext.strokeRect(100,8,60,24);

                estiContext.strokeStyle = '#000'; // black line at exact answer
                estiContext.lineWidth = 3;
                estiContext.moveTo(131,3);
                estiContext.lineTo(131,38);
                estiContext.stroke();

                
                $('#' + aspectName + 'Div').append(estiCanvas);
                
            }
        }
        
        
        /*
        $('#estimationDiv').append(

        ""
        +"<img width='125' height='20' src='imgs/blue_orange.jpg' clip-path='url(#negClip)' />"
        +"<img width='125' height='20' src='imgs/orange_blue.jpg' clip-path='url(#negClip)' />"
        
        +"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='40px'>"


        // the line representing the correct region - note stroke is centered at x-coord
        +"<line x1 = '131' y1 = '3' x2 = '131' y2 = '38' stroke = 'black' stroke-width = '3'/>"

        // the red rectangle around +/-15%:
        +"<rect id='errorRect' x='100' y='8' width='60' height='24' fill-opacity='0' stroke='red' stroke-width='4' />"


        +"</svg>"
        ); // end definition of gradientId
        */
        
}; // end of render()

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
        
	var estimate3DState = new Estimate3DState(response, estimate3D.click3Darray);
	
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