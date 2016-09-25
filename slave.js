function SlaveDS(masters) {
	masters = Array.isArray(masters) ? masters : [masters];
	
	var self = this;

	/* @public properties */
	this.type = "SLAVE";

	//linked master DS's
	this.sources = [];

	this.id = Date.now();


	/* @private */


	var listeners = {
		open: [],
		load: [],
		reject: [],
		change: [],
	};

	var callbacks = {
		load: function(ds) {
			console.log('[Slave] callbacks.load Triggered');
			dispatchCallback(listeners.change, self.getData());

			for (var i = 0; i < self.sources.length; i++) {
				if (self.sources[i].state !== LOADED) return;
			}
			console.trace('[Slave] last callback, dispatch onload');
			dispatchCallback(listeners.load, self.getData());
		},
		open: function(ds) {
			console.log('[Slave] callbacks.open Triggered');
			dispatchCallback(listeners.change, self.getData());

			console.trace('[Slave] dispatch onopen');
			dispatchCallback(listeners.open, self.getData());
		},

	};




	this.init = function(){
		console.log('[Slave] init');

		//Attach events on master DS
		masters.forEach(function(ds) {
			self.linkMaster(ds);
		});
	};

	this.destroy = function(){
		console.log('[Slave] destroy');
		self.sources.forEach(function(ds) {
			self.unlinkMaster(ds);
		});
		self.sources = [];
	};

	/**
	 * This is used to link this Slave instance to a Master
	 * @param  {DataSource}   ds A master instance
	 */
	this.linkMaster = function(ds){
		console.log('[Slave] Linking to master DS');
		self.sources.push(ds);
		ds.addListener('load', callbacks.load);
		ds.addListener('open', callbacks.open);
		return self;
	};
	/**
	 * This is used to remove the link between this Slave and a Master
	 * @param  {DataSource}   ds A master instance
	 * @return {Boolean}      return the result if the unlink was successfull
	 */
	this.unlinkMaster = function(ds){
		var i = self.sources.indexOf(ds);
		if(i>-1){
			self.sources.splice(i, 1);
			ds.removeListener('load', callbacks.load);
			ds.removeListener('open', callbacks.open);
			console.log('[Slave] Unlinked from master DS');
			return true;
		}
		else{
			console.error('[Slave] not linked to this master DS');
			return false;
		}
	};

	/**
	 * fetch data
	 * @param  {Object}   options Arguments that will be passed to the Master promisse
	 */
	this.fetch = function(options) {
		console.log('[Slave] fetch()');

		if (self.isComplete()) {
			console.trace('[Slave] Everything complete, dispatch callback imediatelly');
			dispatchCallback(listeners.load, self.getData());
		} else {
			for (var i = 0, ds; i < self.sources.length; i++) {
				ds = self.sources[i];
				if (ds.state === PENDING) {
					console.trace('[Slave] Calling master fetch', ds);
					ds.fetch(options);
				} else {
					console.trace('[Slave] ds already opened');
				}
			}
		}
		return self;
	};

	/**
	 * Call fetch on all linked masters.
	 *
	 * NOTE: that this trigger events on all other slaves linked to those masters.
	 * @return {[type]}   [description]
	 */
	this.forceFetch = function(options) {
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
		return self;
	};

	/**
	 * Check if all linked masters are LOADED
	 * @return {Boolean}  All masters are loaded
	 */
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

	/**
	 * Get an array containing all the data returned by the Masters
	 * @return {Array}   Array of the data of each source
	 */
	this.getData = function() {
		return self.sources.map(function(ds) {
			return ds.data;
		});
	};

	/**
	 * add listeners to this slave instance to be notified when events happen
	 * @param  {String}   type The type of the event that the callback should be fired
	 * @param  {Function} cb   The callback function
	 */
	this.addListener = function(type, cb) {

		if (Object.keys(listeners).indexOf(type) === -1) {
            throw new Error('Cannot add event listener of type ', type);
        }

		listeners[type].push(cb);
		console.log('[Slave] added event listener on'+type);

		if(type==='open'){
			for (var i = 0; i < self.sources.length; i++) {
				if (self.sources[i].state===OPENED){
					console.log('[DS] already opened, dispatching cb imediatelly');
					dispatchCallback([cb]);
					break;
				}
			}
        }
        else if(type==='load'){
			if(self.isComplete()){
	            console.log('[DS] already loaded, dispatching cb imediatelly');
	            dispatchCallback([cb]);
			}
        }

	};

	/**
	 * remove a listeners from this slave instance
	 * @param  {String}   type The type of the event that the callback was registered to be fired
	 * @param  {Function} cb   The callback function
	 */
	this.removeListener = function(type, cb){
		var i = listeners[type].indexOf(cb);
		if(i>-1){
			listeners[type].splice(i,1);
			console.log('[DS] listener removed');
			return true;
		}
		else{
			console.error('[DS] listener not attached.');
			return false;
		}
	};


	/**
	 * private function used to dispatch events
	 * @param  {Array}   listeners Array of callback functions
	 * @param  {Array}   args      Arguments used to call the callbacks
	 */
	function dispatchCallback(listeners, args) {
		for (var cb, i = 0; i < listeners.length; i++) {
			cb = listeners[i++];
			cb.apply(self, args);
		}
	}



	self.init();
}
