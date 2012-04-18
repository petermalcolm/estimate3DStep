/*
 * the scripts that are always necessary regardless of whether the
 * user is using the vle, authoring tool, or grading tool
 */
var coreScripts = [
	'vle/node/estimate3D/Estimate3DNode.js',
	'vle/node/estimate3D/estimate3DEvents.js'
];

//the scripts used in the vle
var studentVLEScripts = [
	'vle/node/estimate3D/estimate3D.js',
	'vle/node/estimate3D/estimate3DState.js',
	'vle/jquery/js/jquery-1.6.1.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js',
        
        'vle/node/estimate3D/stlScripts/plane.js',        // render planes for STLs
        'vle/node/estimate3D/stlScripts/Three.js',        // render 3-D objects
        'vle/node/estimate3D/stlScripts/thingiview.js'   // render STLs
    //     'vle/node/estimate3D/stlScripts/thingiloader.js'  // load STLs - this file gets loaded dynamically (?)
        
];

//the scripts used in the authoring tool
var authorScripts = [
	'vle/node/estimate3D/authorview_estimate3D.js',
        
        'vle/node/estimate3D/stlScripts/plane.js',      // render planes for STLs
        'vle/node/estimate3D/stlScripts/Three.js',      // render 3-D objects
        'vle/node/estimate3D/stlScripts/thingiview.js'  // render STLs        
];

//the scripts used in the grading tool
var gradingScripts = [
	'vle/node/estimate3D/estimate3DState.js'
];

//dependencies when a file requires another file to be loaded before it
var dependencies = [
	{child:"vle/node/estimate3D/Estimate3DNode.js", parent:["vle/node/Node.js"]},
        
        {child:"vle/node/estimate3D/stlScripts/plane.js", parent:["vle/node/estimate3D/stlScripts/Three.js"]},
        {child:"vle/node/estimate3D/stlScripts/thingiview.js", parent:["vle/node/estimate3D/stlScripts/Three.js"]},
        {child:"vle/node/estimate3D/stlScripts/thingiloader.js", parent:["vle/node/estimate3D/stlScripts/thingiview.js"]}
        
];

var nodeClasses = [
	{nodeClass:'display', nodeClassText:'Estimate3D'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreScripts);
scriptloader.addScriptToComponent('estimate3D', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);

componentloader.addNodeClasses('Estimate3DNode', nodeClasses);

var css = [
       	"vle/node/estimate3D/estimate3D.css"
];

scriptloader.addCssToComponent('estimate3D', css);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/estimate3D/estimate3DTemplate.e3',
		nodeExtension:'e3'
	}
];

componentloader.addNodeTemplateParams('Estimate3DNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/estimate3D/setup.js');
};