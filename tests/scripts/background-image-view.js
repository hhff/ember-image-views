var get = Ember.get, set = Ember.set;

var testRemoteSrc = 'https://raw.github.com/emberjs/website/master/source/images/tomster-sm.png',
    testSrcInvalid = 'fake-invalid-src';

var appendView = function(view) {
  Ember.run(function() { view.appendTo('#qunit-fixture'); });
},
afterRender = function(callback) {
  Ember.run.scheduleOnce('afterRender', null, callback);
}

//-----------------------------------------------------------

module('Ember.BackgroundImageView');

test('can create background image view', function() {
  var view = Ember.BackgroundImageView.create();
  ok( view, 'BackgroundImageView created' );
});

test('can create via handlebars helper', function() {
  var view = Ember.View.create({
    template: Ember.Handlebars.compile(Ember.String.fmt('{{background-image src="%@"}}', [testRemoteSrc]))
  });

  appendView(view);

  var imgViews = view.$().find('div');
  equal(imgViews.length, 1, 'helper rendered an instance of the view');
  equal(imgViews.css('background-image'), 'url('+testRemoteSrc+')', 'src attribute rendered as background-image');
});

asyncTest('loaded state triggered', 5, function() {
  var view = Ember.BackgroundImageView.create({
    src: testRemoteSrc
  });

  view.on('didLoad', function() {
    ok( true, 'didLoad event triggered' );
    ok( !view.get('isLoading'), 'not in loading state' );
    ok( !view.get('isError'), 'not in error state' );
    afterRender(function() {
      ok( !view.$().hasClass(view.get('loadingClassName')), 'view does not have loading class' );
      ok( !view.$().hasClass(view.get('errorClassName')), 'view does not have error class' );
    });
    start();
  });

  appendView(view);
});

asyncTest('error state triggered', 5, function() {
  var view = Ember.BackgroundImageView.create({
    src: testSrcInvalid
  });

  view.on('becameError', function() {
    ok( true, 'becameError event triggered' );
    ok( view.get('isError'), 'in error state' );
    ok( !view.get('isLoading'), 'not in loading state' );
    afterRender(function() {
      ok( view.$().hasClass(view.get('errorClassName')), 'view has error class' );
      ok( !view.$().hasClass(view.get('loadingClassName')), 'view does not have loading class' );
    });
    start();
  });

  appendView(view);
});
