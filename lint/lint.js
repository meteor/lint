if (Meteor.is_client) {
  Template.source.get_source = function() {
    return Session.get('source');
  };

  Template.source.get_parse = function() {
    var source = Session.get('source');
    if (! source)
      return "";
    var parse = Ugliparse.parse(source);
    Session.set('parse', parse);
    return JSON.stringify(parse);
  };

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