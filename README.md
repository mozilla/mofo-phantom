# mofo-phantom

Mofo Phantom is a npm module that includes the PhantomJS binary as well as lightweight assertions and a runner for functional testing. It's designed for quickly adding basic functional tests and is compatible with Travis.

## Integrating into your project

### Starting out

*Mofo Phantom is designed for projects already using npm.*

1. Run `npm install mofo-phantom --save-dev` in the root of your project.
2. Make a folder called `test` and add a new file to it called `run.js`.
3. Add this basic scaffolding to the `run.js` file:

    ```javascript
    var mofoPhantom = require('mofo-phantom');
	var Test = mofoPhantom.Test;
	
	mofoPhantom.runTests([]);
    ```

### Add a run tests command

Mofo Phantom comes with its own binary of PhantomJS so that you don't have to depend on a global install. Any task runner that can execute shell commands should be able to run your tests.

The basic command to run tests is `phantomjs test/run.js`.  If you're using npm as a task runner you can edit the `scripts` property of your `package.json` to add a `test` command like so:

```json
"scripts": {
  "test": "phantomjs test/run.js"
}
```

*Note:* Npm knows where to look for the local phantomjs binary, but if you're using another task runner, such as Gulp or Grunt, you'll need to point explicitly to the binary located at `node_modules/.bin/phantomjs`.

If you're using npm, then the command to run all tests will be `npm test`.

### Adding a test

Tests are added to the array passed to the `runTests` method of your `mofo-phantom` instance.

A test is an instance of the Test object, which looks like this:

```javascript
new Test(description, url, injectedJS, testBody)
```

- `description` - *String* - A description of test success. (eg: "Document has correct title.")
- `url` - *String* - The URL on which to run the test.
- `injectedJS` - *String* - A JS file containing code you wish to inject before tests run. Often this is a mock to simulate a state of your app.
- `testBody` - *Function* - This function contains code that defines your test. In order for your test to finish you must call `this.onComplete()` with a truthy or falsey value indicative of your final test result.

### Using Phantom in your tests

Within your `testBody` function `this.page` refers to Phantom's [web page module](http://phantomjs.org/api/webpage/), which operates in the context of the specified URL.

You will often use calls to `this.page.evalute()`, which allows you to run JS in the context of the page and return values to your test code.

For example:

```javascript
var stuffIsVisible = this.page.evaluate(function () {
  document.querySelector('[data-test-id="big-button"]').click();
  return document.querySelector('[data-test-id="yolo"]').clientHeight > 0;
});

this.onComplete(stuffIsVisible);
```

The code inside the function is run in the page's context and interacts with its DOM. In this case a button is clicked and the height of another element is returned to verify visibility.

Refer to [Phantom's documentation](http://phantomjs.org/api/webpage/) for the full API exposed by `this.page`.

#### Targeting elements

To target elements for testing it's recommended that you give them a data attribute `data-test-id` with a globally unique value. This data attribute should only be used within test scripts and *not* within your application's code.

### Example

For a complete example of adding `mofo-phantom` and a test to a project refer to [this pull request](https://github.com/gvn/yolo/pull/1/files).
