const UNITIALIZED = -1;
const READY = 0;

const PENDING = 0;
const OPENED = 1;
const LOADED = 4;
const REJECTED = -1;


function DataSource(p) {
    var self = this;
    console.log('[DS] Created');

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
        console.log('[DS] fetch()');

        self.state = OPENED;
        dispatchCallback(listeners.open);

        p(resolveCb, rejectCb, options);
    };

    this.addListener = function(type, cb) {
        console.log('[DS] addListener() for '+type);

        if (Object.keys(listeners).indexOf(type) === -1) {
            throw new Error('Cannot add event listener of type ', type);
        }

        listeners[type].push(cb);

        if(type==='open' && self.state===OPENED){
            console.log('[DS] already opened, dispatching cb imediatelly');
            dispatchCallback([cb]);
        }

        if(type==='load' && self.state===LOADED){
            console.log('[DS] already loaded, dispatching cb imediatelly');
            dispatchCallback([cb]);
        }

    };

    function dispatchCallback(callbacks, args) {
        console.log('[DS] dispatchCallback()');
        callbacks.forEach(function(cb) {
            cb.apply(self, args);
        });
    }
}
