function ListView(opt) {
    var self = this;

    var el;
    var page = 0;

    this.ds;
    this.opt = opt;

    this.init = function(opt) {
        console.log('Box init', el);

        el = opt.el;
        self.ds = opt.ds;

        el.innerHTML = '\
        <h4>-</h4>\
        <button class="f">FETCH</button>\
        <button class="ff">FORCE FETCH</button>\
        <br>\
        <button class="prev">-</button>\
        <button class="next">+</button>\
        <br>\
        <select style="width:200px"></select>\
        ';

        self.ds.addListener('load', self.fetchComplete.bind(self));
        self.ds.addListener('open', self.loading.bind(self));

    };

    this.render = function() {
        console.log('Box render');


        var btn = el.querySelector('.f');
        var title = el.querySelector('h4');

        el.querySelector('.prev').onclick = function(){
            console.log('Box btnclick');
            self.ds.fetch(page--);
        };
        el.querySelector('.next').onclick = function(){
            console.log('Box btnclick');
            self.ds.fetch(page++);
        };


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
        var select = self.opt.el.querySelector('select');

        data.forEach(function(item, i){
            var option = document.createElement('option');
            option.text = item;
            option.value = i;
            select.add(option);
        });
        select.size = data.length;


        el.classList.remove('loading');
    };
    this.loading = function(data) {
        console.log('Box loading');
        var select = self.opt.el.querySelector('select');
        select.value = 'loading...';
        el.classList.add('loading');
    };

    self.init(opt);
};
