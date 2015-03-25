var reporter = require('./reporter');
var runner = require('./runner');
var Test = require('./test-object.js');

module.exports = {
  runTests: function (tests) {
    // Decorate Test instances with an `onComplete` method to trigger the reporter and runner
    tests.forEach(function (test, index) {
      test.onComplete = function (didPass) {
        if (!didPass) {
          this.page.render('test/screenshots/' + index + '-FAIL.png');
        }

        reporter.report(this.description, didPass);
        runner.onTestComplete();
      };
    });

    runner.start(tests, function allTestsDone() {
      reporter.summarize();
    });
  },
  Test: Test
};
