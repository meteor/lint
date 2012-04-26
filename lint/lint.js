if (Meteor.is_client) {
  Template.source.get_source = function() {
    return Session.get('source');
  };

  Template.source.get_parse = function() {
    var source = Session.get('source');
    if (! source)
      return "";
    var parse = Ugliparse.parse(source);
    return parse;
  };

  Template.show_parse.rest = function(arg) {
    return (arg || this).slice(1);
  };

  Template.show_parse.children = function() {
    switch (this[0]) {
    case "toplevel":
      return this[1];
    case "stat": case "call":
      return this.slice(1);
    case "function":
      return this[3];
    default:
      return null;
    }
  };

  Template.show_parse.boxhead = function() {
    switch(this[0]) {
    case "function":
      return "function "+(this[1] || "")+"(" +
        this[2].join(', ') + ")";
    default:
      return this[0];
    }
  };

  Handlebars.registerHelper('first', function() {
    return this[0];
  });

  Handlebars.registerHelper('first_is', function(typ) {
    return this[0] === typ;
  });

  Handlebars.registerHelper('stringify', function(arg) {
    return JSON.stringify(arg);
  });

  Meteor.startup(function() {
    Meteor.call('get_file', 'files/deps.js', function(e, str) {
      if (e)
        throw e;
      Session.set('source', str);
    });
  });
}

if (Meteor.is_server) {

  var fs = __meteor_bootstrap__.require('fs');

  Meteor.methods({
    get_file: function(path) {
      return fs.readFileSync(path, 'utf8');
    }
  });
}