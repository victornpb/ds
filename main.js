window.onload = function() {
	console.log("App started!");


	window.ds1 = new DataSource(function(resolve, reject) {
		console.log("GET1 triggered");
		// t1.value = new Date();
		setTimeout(function() {
			console.log("GET1 returned");
			resolve(s1_i.value);
		}, 3000);
	});
	s1_b.onclick = function() {
		ds1.fetch();
	};
	ds1.addListener('open', function(){
		s1_b.disabled = true;
		s1_c.classList.add('loading');
	});
	ds1.addListener('load', function(){
		s1_b.disabled = false;
		s1_c.classList.remove('loading');
	});



	window.ds2 = new DataSource(function(resolve, reject) {
		console.log("GET2 triggered");
		// t2.value = new Date();
		setTimeout(function() {
			console.log("GET2 returned");
			resolve(s2_i.value);
		}, 5000);
	});
	s2_b.onclick = function() {
		ds2.fetch();
	};
	ds2.addListener('open', function(){
		s2_b.disabled = true;
		s2_c.classList.add('loading');
	});
	ds2.addListener('load', function(){
		s2_b.disabled = false;
		s2_c.classList.remove('loading');
	});



	window.ds3 = new DataSource(function(resolve, reject) {
		console.log("GET3 triggered");
		// t3.value = new Date();
		setTimeout(function() {
			console.log("GET3 returned");
			resolve(s3_i.value);
		}, 7000);
	});
	s3_b.onclick = function() {
		ds3.fetch();
	};
	ds3.addListener('open', function(){
		s3_b.disabled = true;
		s3_c.classList.add('loading');
	});
	ds3.addListener('load', function(){
		s3_b.disabled = false;
		s3_c.classList.remove('loading');
	});


	window.ds4 = new DataSource(function(resolve, reject) {
		console.log("GET4 triggered");
		// t4.value = new Date();
		setTimeout(function() {
			console.log("GET4 returned");
			resolve(s4_i.value);
		}, 3000);
	});
	s4_b.onclick = function() {
		ds4.fetch();
	};
	ds4.addListener('open', function(){
		s4_b.disabled = true;
		s4_c.classList.add('loading');
	});
	ds4.addListener('load', function(){
		s4_b.disabled = false;
		s4_c.classList.remove('loading');
	});



	//creating fake views

	window.bb1 = new Box({
		el: b1,
		ds: new SlaveDS(ds1),
		name: "Box (1)",
	}).render();

	window.bb2 = new Box({
		el: b2,
		ds: new SlaveDS(ds1),
		name: "Box (1)",
	}).render();

	window.bb3 = new Box({
		el: b3,
		ds: new SlaveDS([ds1, ds2]),
		name: "Box (1,2)",
	}).render();

	window.bb4 = new Box({
		el: b4,
		ds: new SlaveDS([ds2]),
		name: "Box (2)",
	}).render();

	window.bb5 = new Box({
		el: b5,
		ds: new SlaveDS([ds3]),
		name: "Box (3)",
	}).render();


	//creating a slave with all DS just to have a global event
	window.s1 = new SlaveDS([ds1, ds2, ds3, ds4]);
	function monitor(){
		if(this.isLoading()) g1.innerHTML = "LOADING...";
		else g1.innerHTML = "DONE!";
	}
	// s1.addListener('open', monitor);
	s1.addListener('change', monitor);

}
