# flux-base

This package is currently in **BETA**

## Overview
This is a node package that contains an implementation of the flux pattern as described by facebook here: [flux](https://facebook.github.io/flux/docs/overview.html)
This package is designed to work with [ECMAScript 6](https://github.com/lukehoban/es6features/blob/master/README.md) classes.

## Guide

To install this package execute the following command in the console from within your project.
```
npm install --save flux-base
```

This package is a collection of classes that correspond to each of the items defined in the flux pattern.
A short description of each class in this package is below.  See the API section for more detailed information on each class.

- `Page` - Ties together all of the different parts of an application.  There should only ever be one instance on a page.
- `View` - Corresponds to a flux component.
- `ControllerView` - Controls one or more Views on the page.
- `Store` - Contains all of the business logic for managing data.
- `PageBuilder` - Used on the server side to generate pages.

### Example Application

What follows is an example of an application built using this package.  
For my example I will create an application that allows a user to log questions with a subject and body input.
Note that you will need to use a bundle and transpiler package such as [build-bundle](https://www.npmjs.com/package/build-bundle) or [browserify](https://www.npmjs.com/package/browserify) to transpile from ECMAScript 6 and deliver your code to the client which is not shown
 in the examples.

#### Store
The first thing I like to do is define the store for my application.  For this example the store is simply going to save and retrieve data from memory but normally a store would communicate with some kind of backend service.
Below is code that I've put in a file named `QuestionStore.js`:
```JavaScript
import Flux from `flux-base`;

class QuestionStore extends Flux.Store {
  constructor() {
    super();
    this.mQuestions = [];
    this.mQuesitonIdNext = 0;
  }

  getQuestions() {
    return this.mQuestions;
  }

  actionAddQuestion(details) {
    this.mQuestions.push({
      id: ++this.mQuestionIdNext,
      subject: details.subject,
      body: details.body
    });
    
    this.emitChange(); // notify any listeners of a change
  }
}

export default QuestionStore;
```

As you can see above the QuestionStore class code is pretty simple.  There is a getQuestions function which is used to retrieve data and an actionAddQuestion function which is used to update data.
The name given to the actionAddQuestion function has significance as it begins with the text `action`.  Any function defined in a Store class that begins with the text action will be called automatically by the dispatcher when the lower camel case version of the text that follows action is set in `actionType`.
For my example this function gets executed whenever a dispatch is sent with the actionType set to `addQuestion`.

Another thing to note is that after the data in the store has been updated the `emitChange` function is called.  This function is called to notify listeners of any changes and is defined in the Flux.Store class that my QuestionStore class extends.

#### View
Now that I have my Store defined I'm going to define what will be displayed for UI on the page.  To do this I'm going to break up the different parts of my display into a couple of different views.
First up I'll write the view for displaying questions that have been added.  This code will be in a file called `QuestionListView.jsx`:
```JSX
import Flux from 'flux-base';
import React from 'react'; // required to be in scope for JSX parsing

class QuestionListView extends Flux.View {
  render() {
    return (
      <div>
        {this.props.questions.map((question) => {
          return (
            <div key={question.id}>
              <b>{question.subject}</b> - {question.body}
            </div>
          );
        })}
      </div>
    );
  }
}

export default QuestionListView;
```
As you can see, this class extends Flux.View which in turn extends React.Component which means all of your views will be React.Components and will behave the same way, such as how the render function is used.
The only thing this class expects is a property named questions which will contain a collection of question objects.  
Each question gets rendered into it's own div element that displays the question subject and body.
Now that I've defined the view for displaying questions I'll define the view for adding questions in a file named `QuestionAddView.jsx`:
```JSX
import Flux from 'flux-base';
import React from 'react';

class QuestionAddView extends Flux.View {
  constructor(props) {
    super(props);

    // setup event handlers bound to this class instance
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSubjectChange = this.handleValueChange.bind(this, 'subject');
    this.handleBodyChange = this.handleValueChange.bind(this, 'body');
  }

  handleAddClick() {
    // dispatch an addQuestion event
    this.page.dispatcher.dispatch({
      actionType: 'addQuestion',
      subject: this.state.subject,
      body: this.state.body
    });
    
    // clear out inputs after creating question
    this.setState({
      subject: '',
      body: ''
    });
  }

  render() {
    return (
      <div>
        <form>
          <div><b>Subject:</b></div>
          <div><input type="text" onChange={this.handleSubjectChange} value={this.state.subject}</input></div>
          <div><b>Body:</b></div>
          <div><input type="text" onChange={this.handleBodyChange} value={this.state.body}</input></div>
          <div><button type="button" onClick={this.handleAddClick}>Add</button></div>
        </form>
      </div>
    );
  }
}

export default QuestionAddView;
```
There are a number of things going on in the code above.  First, the user input is being stored in the local state of the view.  
The handleValueChange function from the Flux.View class is being used to tie the value from the input boxes to properties on the state so they can be referenced 
when the add button is clicked.  You'll also notice that the handleAddClick function is dispatching a message using the page.dispatcher property.  The page property is also 
defined in Flux.View and references the current singleton instance of the Page class.

#### ControllerView
Now that I've defined all of the views I'll need I can create a class that will bring them together to be displayed.  I'll do this with a ControllerView I'll define in a file named `QuestionControllerView.jsx`:
```JSX
import Flux from 'flux-base';
import React from 'react';
import QuestionList from './questionListView';
import QuestionAdd from './questionAddView';

class QuestionControllerView extends Flux.ControllerView {
  constructor(props) {
    super(props);
    this.state = { questions: this.props.store.getQuestions() }; // initialize state with default
    this.addStore(this.props.store);
  }

  handleStoreChange() {
    this.setState({ questions: this.props.store.getQuestions() }); // update state with changed questions list
  }

  render() {
    return (
      <div>
        <QuestionAdd />
        <QuestionList questions={this.store.questions} />
      </div>
    );
  }
}

export default QuestionControllerView;
```
As you can see the QuestionControllerView class extends the Flux.ControllerView class which in turn extends the React.Component class which means all of your ControllerViews will be React.Components and will behave the same way, such as how the render function is used.
In this class I've brought together the QuestionAddView and QuestionListView views and I am displaying the one on top of the other.  This class also expects a store property that will have a getQuestions function defined for it.
By using the addStore function defined in Flux.ControllerView and passing the store that is passed in as a property it hooks up an event listener to the store that will call the handeStoreChange function whenever the store is changed.
You can see that the handleStoreChange function is being overridden to update the state with the new collection of questions when the store is changed.

#### Page

Now that I have all the parts needed for my application the last thing to do is to bring it all together within a custom Page class.  
I'll do this in a file named `QuestionPage.js`:
```JavaScript
import Flux from 'flux-base';
import QuestionStore from './questionStore';
import QuestionController from './questionControllerView';

class QuestionPage extends Flux.Page {
  constructor(options) {
    super(options);
    this.mStore = new QuestionStore();
  }

  getComponent() {
    return QuestionController;
  }

  getProps() {
    return { store: this.mStore };
  }
}

export default QuestionPage;
```
This is all that is needed to define my application.  The last thing to do is to create an instance of the QuestionPage and call the load function like so:
```JavaScript
const page = new QuestionPage();
page.load();
```
When the page is loaded an istance of the component returned from the getComponent function will be created and the properties returned from the getProps function will be passed to the newly created component.
That's all there is to it.  Both the question list and question add views will be displayed and when a user adds a new question it will be immediately displayed.

### Master Detail Pages

The Page class supports a form of master-detail page composition.  By using inheritance you can create detail pages that extend master pages and combine content.
For example lets say I have defined a class named MasterPage which extends Flux.Page and returns the following component when the getComponent function is called:
```
<div>
  <div>Top</div>
  {this.props.children}
  <div>Bottom</div>
</div>
```
Now if define a class named DetailPage which extends the MasterPage class and returns the following component when it's getComponent function is called:
```
<div>Details</div>
```
The following text will be displayed when the DetailPage is loaded:
```
Top
Details
Bottom
```
This is because the special children property of the component will be rendered with any component defined in a sub-classed page.  In this way you can create master pages that
contain common UI such as menus and footer and have them be re-used throught your code using inheritance.

### Application Routing

The Page class also supports routing which will allow you to create pages with multiple views that don't require downloading new content from the server.
To enable routing you simply need to define functions that begin with the text `route`.  The text that follows will be mapped to the same url in lower camel case so that when a user navigates to that value preceeded by the `#/` symbols it
will execute that function.  For example lets say I have an html page at `//example/myPage.html` which has loaded an instance of Flux.Page which defined the following function:
```JavaScript
routeMyExample() {
  console.log('hello');
}
```
The text 'hello' will be printed to the console if the user navigates to `//example/myPage.html#/myExample`.

Routing can also include parameters.  Simply define parameters in your function and they will be populated by the values that appear in order between slashes(/).
For example lets say I define the following function in a class that extends Flux.Page:
```JavaScript
routeMyExample(pOne, pTwo) {
  console.log(pOne);
  console.log(pTwo);
}
```
If the user were to navigate to `//example/myPage.html#/myExample/hello/world` then the following would be printed to the console:
```
hello
world
```
There is a special parameter name if you want to capture the entire url from the current postion.  If you name a parameter `any` and it is the last
parameter in your defined list of parameters then it will contain all of the remaining url characters including slashes(/).  
For example lets say I define the following function in a class that extends Flux.Page:
```JavaScript
routeMyExample(pOne, pTwo, any) {
  console.log(pOne);
  console.log(pTwo);
  console.log(any);
}
```
If the user were to navigate to `//example/myPage.html#/myExample/hello/world/x/y/z` then the following would be printed to the console:
```
hello
world
x/y/z
```

If a user navigates to a url that doesn't have any routing defined for it the Flux.Page.route function will be executed which will simply re-render page by default.
Now that you know how to map a url value to execute a specific function you will want to know how to render a new view in your page.  This is done with the `render`
function defined in the Flux.Page class.  By default the render function gets called with no parameters when the page is loaded.  When this happens the render 
function will render the component returned from the getComponent function if there is one.

If you want to render a component that is different from the one returned by getComponent you can pass it into the render function along with optional properties.
When you pass in a component to be rendered it will take the place of the component returned from getComponent.  For example take the following code which is defined on the page found at `//example/myPage.html`:
```JavaScript
import Flux from 'flux-base';
import FirstView from './firstView';
import SecondView from './secondView';

class ExamplePage extends Flux.Page {
  getComponent() {
    return FirstView;
  }

  getProps() {
    return { input: 1 };
  }

  routeSecond(num) {
    this.render(SecondView, { number: num });
  }
}

export default ExamplePage;
```

When `//example/myPage.html` is first loaded it will display the FirstView component with input set to 1 for it's properties.  If the user were to
then navigate to `//example/myPage.html#/second/8` the SecondView component will be displayed with number set to 8 for it's properties.

## API

### Page
Type: `Class`

Abstract class definition of a page.  
Page classes aren't used directly but rather custom classes extend the Page class and contain the logic to render content in a client browser.
Only one instance of a class that extends Page should be loaded at a time or unpredicatable results may occur.

#### Page.constructor(options)
Type: `Constructor`

The constructor for the page class.  Any classes that extend the Page class should pass the options parameter through.

#### options
Type: `Object`

Options for the Page class.

##### options.title
Type: `String`

Optional parameter.  When provided the browser will display the given title.

##### options.containerId
Type: `String` Default: `page-body-content`

Optional parameter that is the id of the DOMElement that components should be rendered into.  By default this is 'page-body-content'.

##### options.isBrowserContext
Type: `Boolean`

Optional parameter that when defined will indicate if the Page is running within the context of a browser or a server.  By default the Page will
determine this on it's own but this option can be useful when creating unit tests and you want to override the default behavior.

#### Page.current
Type: `Page`

This is a static property that holds the singleton instance of the Page for an application.  It gets set when the Page is first instantiated so
any code that depends on it must be run after the page has been created or within the contructor of a class that extends the Page class.
Whenever a new Page is instantiated it will override this property so having multiple Pages in an application may have unpredictible results.

#### Page.dispatcher
Type: `Dispatcher`

This is a property on the object that will be an instance of Dispatcher as defined in the [Flux](https://www.npmjs.com/package/flux) package.

#### Page.isBrowserContext
Type: `Boolean`

This is a property that indicates if the current code being run is within the context of a client browser.

#### Page.title
Type: `String`

This is a property that corresponds to the title displayed in the browser.  It can be both read from and updated.

#### Page.load()
Type: `Function`

This function is called to load the page into the browser.

#### Page.route()
Type: `Function`

This function is called when the page is first loaded or a url is navigated to for which there is no mapping defined.  By default this
function will call the render function which will re-render the default component.  Override this method to provide custom logic.

#### Page.render(component, props)
Type: `Function`

The render function is used to build the elements that are displayed to a user.  When in the browser context it will render the elements to the DOMElement.
When not in browser context the html text that represents the elements to be rendered in a DOMElement will be returned instead.

##### component
Type: `View`

This is an optional parameter.  When provided it will along with any components returned from the getComponent function defined on super classes will 
be rendered.  If it's not provided then the component returned from calling the getComponent function along with any components returned from the getComponent function defined on super classes
will be rendered.

##### props

This is an optional parameter and is only used when the component parameter has been defined.  When provided it will be used in the rendering of the component.

### View
Type: `Class`

The View class extends the React.Component class and adds additonal functionality for sub classes.  
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### View.page
Type: `Page`

This property is a convenience and returns the value from Page.current.

#### View.handleValueChange(name, event)
Type: `Function`

This function is used to map the value property of a DOMElement to a property in the state of the View.  
This is achieved by attaching an event listener using the bind function and specifying the name of the property on the state object to store the value.
For example to sync the text with the this.state.xyz property in a View you could do the following:
```
<input type="text" onChange={this.handleValueChange.bind(this, 'xyz')} />
``` 

##### name
Type: `String`

The name of the property to store the value in on the state.

##### event
Type: `Event`

The event that is emitted when the DOMElement is changed.

### ControllerView
Type: `Class`

The ControllerView class extends the React.Component class and adds additional functionality for sub classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### ControllerView.handleStoreChange()
Type: `Function`

This function is called whenever a Store that has been added has emitted a change event.  By default it does nothing.  Override this function
to provide logic to be executed when a Store has been changed.  Note that if the ControllerView is not mounted this function will not be called
event if a Store has been changed.

#### ControllerView.addStore(store)
Type: `Function`

Add a Store to change changes on.  When a Store that has been added emits a change event the handleStoreChange function will be called.
The same Store can only be added once.  Trying to add the same Store more than once will have no effect.

##### store
Type: `Store`

The store to add to the ControllerView for tracking.

#### ControllerView.removeStore(store)
Type: `Function`

Remove a store that was previously added.

##### store
Type: `Store`

The store to remove.

#### ControllerView.removeAllStores()
Type: `Function`

Remove all Stores that were previously added.

### Store
Type: `Class`

This class is a base class for all Store classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### Store.page
Type: `Page`

This property is a convenience and returns the value from Page.current.

#### Store.onChange(func)
Type: `Function`

Register an event listener with this class that will be called whenever the emitChange function is called.

##### func
Type: `Function`

The function to call when the emitChange function is called.

#### Store.offChange(func)
Type: `Function`

Unregister an event listener that was previously registered with the onChange function.

##### func
Type: `Function`

The function that was previously passed into the onChange function.

#### Store.emitChange
Type: `Function`

This function will call any functions that have been registered with the onChange function.  It should be called by sub classes whenever the data in the Store is changed.

### PageBuilder
Type: `Class`

This class is intended to be used on the server to render Pages on the server to be delivered to client browsers.

#### PageBuilder.styleSheets
Type: `String or String[]`

A property that contains the style sheet tags that should be included in the page.

#### PageBuilder.scripts
Type: `String or String[]`

A property that contains the script tags that should be included in the page.

#### PageBuilder.renderToString(page)
Type: `Function`

Generate a string that contains the given page's rendered content as the body of an html page.  
The resulting html contains a DOMElement with an id of page-body-content that the page needs to be rendered into.

##### page
Type: `Page`

The page to render into the html text. 