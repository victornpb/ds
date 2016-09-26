function BoxView(opt) {
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
        <button class='f'>FETCH</button>\
        <button class='ff'>FORCE FETCH</button>\
        <br>\
        <textarea>\
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


    this.fetchComplete = function() {
        console.log('Box fetchComplete');

        var args = Array.from(arguments);

        self.opt.el.querySelector('textarea').value = args.join(',');
        el.classList.remove('loading');
    };
    this.loading = function(data) {
        console.log('Box loading');
        var textarea = self.opt.el.querySelector('textarea');
        textarea.value = 'loading...';
        el.classList.add('loading');
    };

    self.init(opt);
};
