const UNITIALIZED = -1;
const READY = 0;

const PENDING = 0;
const OPENED = 1;
const LOADED = 4;
const REJECTED = -1;


function DataSource(p) {
    var self = this;
    console.log('[DS] Created');

    this.type = "MASTER";


    this.id = new Date();

    this.state = PENDING;

    this.data;

    var listeners = {
        open: [],
        load: [],
        reject: [],
    };

    var promisse = p;

    var resolveCb = function(data) {
        console.log('[DS] resolveCb()');
        self.state = LOADED;
        self.data = data;

        dispatchCallback(listeners.load, [data]);
    };
    //private function
    var rejectCb = function() {
        console.log('[DS] rejectCb()');

        self.state = REJECTED;
    };

    this.fetch = function(options) {
        console.log('[DS] fetch');

        self.state = OPENED;
        dispatchCallback(listeners.open);

        p(resolveCb, rejectCb, options);
    };

    this.addListener = function(type, cb) {

        if (Object.keys(listeners).indexOf(type) === -1) {
            throw new Error('Cannot add event listener of type ', type);
        }

        listeners[type].push(cb);
        console.log('[DS] attached listener on'+type);

        if(type==='open' && self.state===OPENED){
            console.log('[DS] already opened, dispatching onopen imediatelly');
            dispatchCallback([cb]);
        }

        if(type==='load' && self.state===LOADED){
            console.log('[DS] already loaded, dispatching onload imediatelly');
            dispatchCallback([cb]);
        }

    };

    this.removeListener = function(type, cb){
		var i = listeners[type].indexOf(cb);
		if(i>-1){
			listeners[type].splice(i,1);
			console.log('[DS] listener removed', type, cb);
			return true;
		}
		else{
			console.error('[DS] listener not attached.', type, cb);
			return false;
		}
	};

    function dispatchCallback(callbacks, args) {
        console.log('[DS] dispatchCallback(',callbacks,', ',args,')');
        callbacks.forEach(function(cb) {
            cb.apply(self, args);
        });
    }
}
