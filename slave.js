function SlaveDS(ds) {
	var self = this;

	this.id = Date.now();

	this.sources = Array.isArray(ds) ? ds : [ds];
	this.onfetch;
	this.onload;

	var listeners = {
		open: [],
		load: [],
		reject: [],
		change: [],
	};

	var loadCb = function(ds) {
		console.log('[Slave] loadCb Triggered');
		dispatchCallback(listeners.change, self.getData());

		for (var i = 0; i < self.sources.length; i++) {
			if (self.sources[i].state !== LOADED) return;
		}
		console.trace('[Slave] last callback, dispatch onload');
		dispatchCallback(listeners.load, self.getData());
	};
	var openCb = function(ds) {
		console.log('[Slave] openCb Triggered');
		dispatchCallback(listeners.change, self.getData());

		console.trace('[Slave] dispatch onopen');
		dispatchCallback(listeners.open, self.getData());
	};

	this.init = function(){
		console.log('[Slave] init');

		//Attach events on master DS
		self.sources.forEach(function(ds) {
			console.trace('[Slave] Attaching events to master DS');
			ds.addListener('load', loadCb);
			ds.addListener('open', openCb);
		});
	};

	this.fetch = function() {
		console.log('[Slave] fetch()');

		if (self.isComplete()) {
			console.trace('[Slave] Everything complete, dispatch callback imediatelly');
			dispatchCallback(listeners.load, self.getData());
		} else {
			for (var i = 0, ds; i < self.sources.length; i++) {
				ds = self.sources[i];
				if (ds.state === PENDING) {
					console.trace('[Slave] Calling master fetch', ds);
					ds.fetch();
				} else {
					console.trace('[Slave] ds already opened');
				}
			}
		}
	};

	this.forceFetch = function() {
		console.log('[Slave] forceFetch()');

		for (var i = 0, ds; i < self.sources.length; i++) {
			ds = self.sources[i];
			if (ds.state !== OPENED) {
				console.trace('[Slave] Calling master fetch', ds);
				ds.fetch();
			} else {
				console.trace('[Slave] ds already opened');
			}
		}

	};

	this.isComplete = function() {
		for (var i = 0; i < self.sources.length; i++) {
			if (self.sources[i].state !== LOADED) return false;
		}
		return true;
	};

	this.isLoading = function() {
		for (var i = 0; i < self.sources.length; i++) {
			if (self.sources[i].state !== OPENED) return true;
		}
		return false;
	};

	this.getData = function() {
		return self.sources.map(function(ds) {
			return ds.data;
		});
	};

	this.addListener = function(type, cb) {
		listeners[type].push(cb);

		if(type==='open'){
			for (var i = 0; i < self.sources.length; i++) {
				if (self.sources[i].state===OPENED){
					console.log('[DS] already opened, dispatching cb imediatelly');
					dispatchCallback([cb]);
					break;
				}
			}
        }

        if(type==='load'){
			if(self.isComplete()){
	            console.log('[DS] already loaded, dispatching cb imediatelly');
	            dispatchCallback([cb]);
			}
        }
	};

	function dispatchCallback(listeners, args) {
		listeners.forEach(function(cb) {
			cb.apply(self, args);
		});
	}



	self.init();
}
