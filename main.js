window.onload = function() {
	console.log("App started!");


	window.ds1 = new DataSource(function(resolve, reject) {
		console.log("GET1 triggered");
		// t1.value = new Date();
		setTimeout(function() {
			console.log("GET1 returned");
			resolve(t1.value);
		}, 5000);
	});

	window.ds2 = new DataSource(function(resolve, reject) {
		console.log("GET2 triggered");
		// t2.value = new Date();
		setTimeout(function() {
			console.log("GET2 returned");
			resolve(t2.value);
		}, 5000);
	});

	b1.onclick = function() {
		ds1.fetch();
	};
	b2.onclick = function() {
		ds2.fetch();
	};

	window.b1 = new Box({
		id: comp1,
		ds: new SlaveDS(ds1)
	}).render();

	window.b2 = new Box({
		id: comp2,
		ds: new SlaveDS(ds1)
	}).render();

	window.b3 = new Box({
		id: comp3,
		ds: new SlaveDS([ds1, ds2])
	}).render();

}
