function Box(opt) {
    var self = this;

    var el;
    this.ds;
    this.opt = opt;

    this.init = function(opt) {
        console.log('Box init', el);

        el = opt.el;
        self.ds = opt.ds;

        el.innerHTML = "\
        <h4>-</h4>\
        <input>\
        <button class='f'>FETCH</button>\
        <button class='ff'>FORCE FETCH</button>\
        ";

        self.ds.addListener('load', self.fetchComplete.bind(self));
        self.ds.addListener('open', self.loading.bind(self));

    };

    this.render = function() {
        console.log('Box render');


        var btn = el.querySelector('.f');
        var title = el.querySelector('h4');

        el.querySelector('.f').onclick = function(){
            console.log('Box btnclick');
            self.ds.fetch();
        };
        el.querySelector('.ff').onclick = function(){
            console.log('Box btnclick');
            self.ds.forceFetch();
        };


        title.innerHTML = opt.name;

        self.ds.fetch();

        return self;
    };


    this.fetchComplete = function(data = "", data2 = "") {
        console.log('Box fetchComplete');
        self.opt.el.querySelector('input').value = data + " | " + data2;
        el.classList.remove('loading');
    };
    this.loading = function(data) {
        console.log('Box loading');
        var input = self.opt.el.querySelector('input');
        input.value = 'loading...';
        el.classList.add('loading');
    };

    self.init(opt);
};
