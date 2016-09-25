function Box(opt) {
    var self = this;

    var id;
    this.ds;


    this.init = function(opt) {
        console.log('Box init', id);

        id = opt.id;
        self.ds = opt.ds;

        self.ds.addListener('load', self.fetchComplete);
        self.ds.addListener('open', self.loading);

        var btn = id.querySelector('button');
        btn.onclick = self.btnclick.bind(self);
    };

    this.render = function() {
        console.log('Box render');

        self.ds.fetch();

        return self;
    };

    this.btnclick = function() {
        console.log('Box btnclick');

        self.ds.fetch();

        return self;
    };

    this.fetchComplete = function(data = "", data2 = "") {
        console.log('Box fetchComplete');
        id.querySelector('input').value = data + " | " + data2;
    };
    this.loading = function(data) {
        console.log('Box loading');
        id.querySelector('input').value = 'loading...';
    };

    self.init(opt);
};
