var model = {
    cats: [
        {
            name: 'Anne',
            src: 'images/anne.jpg',
            url: 'https://www.flickr.com/photos/bigtallguy/434164568'
        },
        {
            name: 'Bros',
            src: 'images/bros.jpg',
            url: 'https://www.flickr.com/photos/xshamx/4154543904'
        },
        {
            name: 'Gatto',
            src: 'images/gatto.jpg',
            url: 'https://www.flickr.com/photos/kpjas/22252709'
        },
        {
            name: 'Mary',
            src: 'images/mary.jpg',
            url: 'https://www.flickr.com/photos/malfet/1413379559'
        },
        {
            name: 'Tiger',
            src: 'images/tiger.jpg',
            url: 'https://www.flickr.com/photos/onesharp/9648464288'
        }
    ],
    clicks: function () {
        var clicks = [];
        var i = 0;
        model.cats.forEach(function () {
            clicks[i] = 0;
            i++;
        });
        return clicks;
    }
};

var catsListView = {
    init: function() {
        this.render();

        //changes cats
        $("div#nav").on("click", "a.cat", function(event) {
            octopus.setCat(this.id);
            catView.render();
            adminView.render();
            event.preventDefault();
        });
    },
    render: function() {
        var nav, cats, i;
        nav = $("div#nav");
        nav.empty();
        cats = nav.append('<ul></ul>').find('ul');
        i = 0;
        octopus.getCats().forEach(function(cat) {
            cats.append(
                '<li>' +
                '<a href="" title="' + cat.name + '" class= "cat" id="' + i + '">' +
                cat.name +
                '</a>' +
                '</li>'
            );
            i += 1;
        });
    }
};

var catView = {
    init: function() {
        this.render();

        //increments clicks
        $("img#cat").click(function() {
            octopus.incrementClicks(octopus.getCat());
            catView.render();
        });
    },
    //renders the cat
    render: function () {
        var catKey, catName, catFilename, catClicks;
        catKey = octopus.getCat();
        if (catKey === null) {
            return;
        }
        catName = octopus.getCats()[catKey].name;
        catFilename = octopus.getCats()[catKey].src;
        catClicks = octopus.getClicks()[catKey];
        //show current cat and clicks
        $("p#name").html(catName);
        $("img#cat").attr("src", catFilename);
        $("span#clicks").html(catClicks);
    }
};

var adminView = {
    init: function () {
        this.render();

        var adminButton, adminForm;
        adminButton = $("button#admin");
        adminForm = $("form#catDetails");

        //toggle admin
        adminButton.click(function(event) {
            octopus.toggleAdmin();
            adminView.render();
            event.preventDefault();
        });

        //cancel admin
        adminForm.on("click", "button#cancel", function(event) {
            octopus.setAdmin(false);
            adminView.render();
            event.preventDefault();
        });

        //submit admin
        adminForm.submit(function(event) {
            var $inputs, cat, cats, catDetails, clicks, click;
            // get all the inputs into an array.
            $inputs = $('form#catDetails :input');
            cat = octopus.getCat();
            cats = octopus.getCats();
            catDetails = cats[cat];

            $inputs.each(function() {
                catDetails[this.name] = $(this).val();
            });
            cats[cat] = catDetails;
            octopus.setCats(cats);

            clicks = octopus.getClicks();
            click = parseInt($("input#adminClicks").val());
            clicks[cat] = click;
            octopus.setClicks(clicks);

            catsListView.render();
            catView.render();

            event.preventDefault();
        });
    },
    //renders the admin
    render: function () {
        var admin, form, catKey, catDetails, catClicks;
        admin = octopus.getAdmin();
        form = $("form#catDetails");
        form.empty();
        if (admin === false) {
            return;
        }
        catKey = octopus.getCat();
        catDetails = octopus.getCats()[catKey];
        catClicks = octopus.getClicks()[catKey];
        //create the inputs, cancel and submit
        form.append(
            '<p>Name <input type="text" name="name" value="' + catDetails.name + '"></p>' +
            '<p></p>URL <input type="text" name="url" value="' + catDetails.url + '"></p>' +
            '<p># Clicks <input type="text" id="adminClicks" name="clicks" value="' + catClicks + '"></p>' +
            '<p>' +
                '<button id="cancel">Cancel</button>' +
                '<input type="submit" value="Save">' +
            '</p>'
        );
    }
};

var octopus = {
    init: function () {
        if (typeof localStorage.cats === "undefined") {
            var cats = model.cats;
            this.setCats(cats);
        }
        if (typeof localStorage.clicks === "undefined") {
            var clicks = model.clicks();
            this.setClicks(clicks);
        }
        if (typeof localStorage.cat === "undefined") {
            this.setCat(null);
        }
        if (typeof localStorage.admin === "undefined") {
            this.setAdmin(false);
        }
        catsListView.init();
        catView.init();
        adminView.init();
    },
    setCats: function (cats) {
        localStorage.cats = JSON.stringify(cats);
    },
    getCats: function () {
        return JSON.parse(localStorage.cats);
    },
    setClicks: function (clicks) {
        localStorage.clicks = JSON.stringify(clicks);
    },
    getClicks: function () {
        return JSON.parse(localStorage.clicks);
    },
    setCat: function (cat) {//cat is the current cat selected by the user
        localStorage.cat = JSON.stringify(cat);
    },
    getCat: function () {
        return JSON.parse(localStorage.cat);
    },
    toggleAdmin: function() {
        var admin = this.getAdmin();
        if (admin === false) {
            admin = true;
        } else {
            admin = false;
        }
        this.setAdmin(admin);
    },
    setAdmin: function (admin) {
        localStorage.admin = JSON.stringify(admin);
    },
    getAdmin: function () {
        return JSON.parse(localStorage.admin);
    },
    incrementClicks: function (catIdValue) {
        var clicks = this.getClicks();
        clicks[catIdValue] += 1;
        this.setClicks(clicks);
    }
};

$(document).ready(function(){
    octopus.init();
});