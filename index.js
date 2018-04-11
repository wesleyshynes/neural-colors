var brain = require('brain.js');
var prompt = require('prompt');
var chalk = require('chalk');


var net = new brain.NeuralNetwork();


net.train([{input: { r: 0, g: 0, b: 0 }, output: { white: 1 }},
           {input: { r: 59, g: 59, b: 59 }, output: { white: 1 }},
           {input: { r: 255, g: 255, b: 255 }, output: { black: 1 }}]);
		   


var options = {
                            // Defaults values --> expected validation
      iterations: 20000,    // the maximum times to iterate the training data --> number greater than 0
      errorThresh: 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
      log: false,           // true to use console.log, when a function is supplied it is used --> Either true or a function
      logPeriod: 10,        // iterations between logging out --> number greater than 0
      learningRate: 0.3,    // scales with delta to effect training rate --> number between 0 and 1
      momentum: 0.1,        // scales with next layer's change value --> number between 0 and 1
      callback: null,       // a periodic call back that can be triggered while training --> null or function
      callbackPeriod: 10,   // the number of iterations through the training data between callback calls --> number greater than 0
      timeout: Infinity     // the max number of milliseconds to train for --> number greater than 0
}		   

		   
function entry(){
	console.log('What would you like to do?\n - exit\n -  train\n -  ask\n - random')
	prompt.get(['input'], function (err, result) {
		
		if(result.input=='exit'){
			process.exit()
		}
		
		if(result.input=='train'){
			train();
		}
		
		if(result.input=='random'){
			randomTrain();
		}
		
		if(result.input=='ask'){
			ask();
		}	
  });	
}

function train(){
	console.log('\nEnter rgb values and the color black or white for the text color')
	prompt.get(['r','g','b','color'], function (err, result) {
		console.log(result)
		let red = parseInt(result.r)
		let green = parseInt(result.g)
		let blue = parseInt(result.b)
		
		if( red == result.r && green == result.g && blue == result.b && (result.color=='black' || result.color=='white')){
			console.log('training...')
			//let options = {}
			let colorV = result.color
			let data = {
				input:{
					'r': red,
					'g': green,
					'b': blue
					},
					output:{ colorV:1 }}
			net.trainAsync(data, options)
			.then(res => {
			  console.log('values accepted')
			  entry();
			})
			.catch(err=> console.log(err));
			
		} else {
			console.log('bad input')
			entry();
		}
		
  });	
}

function ask(){
	prompt.get(['r','g','b'], function (err, result) {
		console.log(result)
		let red = parseInt(result.r)
		let green = parseInt(result.g)
		let blue = parseInt(result.b)
		
		if( red == result.r && green == result.g && blue == result.b ){
			console.log('running...')
			let data = {
					'r': red,
					'g': green,
					'b': blue
					}
			let output = net.run(data)
			console.log(output)
			console.log('\n\n')
			entry();
			
		} else {
			console.log('bad input')
			entry();
		}
		
  });	
}

function randomTrain(){
	let red = ~~(Math.random()*255)
	let green = ~~(Math.random()*255)
	let blue = ~~(Math.random()*255)
	
	console.log( chalk.rgb(255,255,255).bgRgb(red,green,blue)('white') )
	console.log('\nor\n')
	console.log( chalk.rgb(0,0,0).bgRgb(red,green,blue)('black') )
	
	prompt.get(['color'], function (err, result) {
		console.log(result)
		
		if( result.color=='black' || result.color=='white'){
			console.log('training...')
			//let options = {}
			let colorV = result.color
			let data = {
				input:{
					'r': red,
					'g': green,
					'b': blue
					},
					output:{ colorV:1 }}
			net.trainAsync(data, options)
			.then(res => {
			  console.log('values accepted')
			  entry();
			})
			.catch(err=> console.log(err));
			
		} else {
			console.log('bad input')
			entry();
		}
		
  });
	
	
}




entry();