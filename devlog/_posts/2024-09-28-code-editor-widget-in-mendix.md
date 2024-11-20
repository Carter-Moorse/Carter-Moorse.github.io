Building a widget can be a fairly straight-forward process, but as I discovered with this scenario - it can quickly become tricky due to a minified 'black-box' of what Mendix does in the background.

Mendix widgets are built using React - a JavaScript framework. A beginner friendly starting point can easily be generated using the [Mendix Pluggable Widget Generator](https://www.npmjs.com/package/@mendix/generator-widget).

<img alt="Ace editor in Safari browser showing Mendix app" src="/assets/img/Screenshot-CodeEditorInBrowserAutoCompletion.png" width="100%" />

## Use case
Some of our Mendix projects have required usage of the [E-mail module with templates](https://marketplace.mendix.com/link/component/259); which allows you to write email templates in HTML, use string tokens to inject dynamic content, and send emails using a mail server connection. This is particularly usefull for app notifications.

The issue for us was trying to make the template writing process as simple as possible. With the default text area input, you lack the code highlighting, indentation, auto-completion and other easy functions you get with a code editor such as Visual Studio Code or Notepad++.

Luckily there are plenty of great JavaScript code editor libraries that are available that bring these features into a web-app.

## Starting the widget
For starters, I used the [Mendix Pluggable Widget Generator](https://www.npmjs.com/package/@mendix/generator-widget) to generate the widget folder structure and files. You can follow the Mendix documentation on how to [build Pluggable Web Widgets](https://docs.mendix.com/howto/extensibility/pluggable-widgets/).

I had chosen to go for the [Ace code editor](https://ace.c9.io) library. This has lots of features, and themes. Conveniently, there is also a [react-ace](https://github.com/securingsincity/react-ace) wrapper that makes building up/tearing down the Ace code editor easier in our case. We will also need to install [ace-builds](https://github.com/ajaxorg/ace-builds) library for tapping into the additional features.

``` bash
npm install react-ace ace-builds
```

Now we have our dependencies in order, we can implement the code...

[`src/CodeEditor.tsx`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/src/CodeEditor.tsx)

``` tsx
import { Component, ReactNode, createElement } from "react";
import AceEditor from "react-ace";

export default class CodeEditor extends Component<CodeEditorContainerProps> {
  onChange(newValue: string) {
    this.props.value.setValue(value)
  }

  render(): ReactNode {
    return <AceEditor
      name={this.props.name}
      style={this.props.style}
      className={this.props.class}
      mode={this.props.mode}
      theme={this.props.theme}
      height={this.props.height}
      width={this.props.width}
      value={this.props.value.value}
      defaultValue={this.props.value.value}
      debounceChangePeriod={100}
      onChange={this.onChange}
    />;
  }
}
```

We will also need to expose the widget properties to Mendix using the widget properties definition...

[`src/CodeEditor.xml`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/src/CodeEditor.xml)
```xml
<?xml version="1.0" encoding="utf-8"?>
<widget id="carterm.codeeditor.CodeEditor" pluginWidget="true" needsEntityContext="true"
  offlineCapable="true"
  supportedPlatform="Web"
  xmlns="http://www.mendix.com/widget/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.mendix.com/widget/1.0/ ../node_modules/mendix/custom_widget.xsd">
  <name>Code Editor</name>
  <description>Ace code editor, as a Mendix pluggable widget.</description>
  <icon />
  <properties>
    <propertyGroup caption="General">
      <propertyGroup caption="General">
        <property key="height" type="string" defaultValue="500px" required="true">
          <caption>Height</caption>
          <description>CSS height string</description>
        </property>
        <property key="width" type="string" defaultValue="500px" required="true">
          <caption>Width</caption>
          <description>CSS width string</description>
        </property>
        <property key="theme" type="enumeration" defaultValue="monokai">
          <caption>Theme</caption>
          <description></description>
          <enumerationValues>
            <enumerationValue key="github">Github</enumerationValue>
            <enumerationValue key="github_dark">Github Dark</enumerationValue>
            <enumerationValue key="monokai">Monokai</enumerationValue>
          </enumerationValues>
        </property>
        <property key="mode" type="enumeration" defaultValue="html">
          <caption>Language</caption>
          <description></description>
          <enumerationValues>
            <enumerationValue key="html">Html</enumerationValue>
            <enumerationValue key="javascript">Javascript</enumerationValue>
            <enumerationValue key="json">Json</enumerationValue>
            <enumerationValue key="markdown">Markdown</enumerationValue>
            <enumerationValue key="xml">XML</enumerationValue>
          </enumerationValues>
        </property>
      </propertyGroup>
      <propertyGroup caption="Data source">
        <property key="value" type="attribute">
          <caption>Attribute</caption>
          <description></description>
          <attributeTypes>
            <attributeType name="String"/>
          </attributeTypes>
        </property>
      </propertyGroup>
      <propertyGroup caption="Editability">
        <systemProperty key="Editability"/>
      </propertyGroup>
      <propertyGroup caption="Visibility">
        <systemProperty key="Visibility"/>
      </propertyGroup>
    </propertyGroup>
    <propertyGroup caption="Common">
      <systemProperty key="Name"/>
      <systemProperty key="TabIndex"/>
    </propertyGroup>
  </properties>
</widget>
```

We can now run the build command to build our widget...

``` bash
npm run build
```

You can create a new Mendix Project in the `./tests/testProject` folder. When the widget build command is executed, the widget package will automatically get added to the project for testing.

In my case, I have setup a basic example project. The widget appears in my test project...

<img alt="Code Editor widget in Studio Pro toolbox" src="/assets/img/Screenshot-StudioProWidgetInToolbox.png" width="100%" />

Here are my properties for the widget. I want to use the HTML syntax highlighting, and the Monokai theme - which is a dark theme...

<img alt="Code Editor widget properties in Studio Pro" src="/assets/img/Screenshot-StudioProWidgetProperties.png" width="100%" />

## The issue
<img alt="Ace editor in Safari browser showing Mendix app with console errors" src="/assets/img/Screenshot-CodeEditorInBrowserError.png" width="100%" />

It does seem to work as the widget is rendered but, we are missing our HTML syntax highlighting and our dark Monokai theme. You can see we are getting errors in the console. 

These additional features need to be loaded for the Ace editor to work. Lets add these in...

[`src/CodeEditor.tsx`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/src/CodeEditor.tsx)
```tsx
import { Component, ReactNode, createElement } from "react";
import AceEditor from "react-ace";
// Add additional features ...
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-html";

import { CodeEditorContainerProps } from "../typings/CodeEditorProps";

export default class CodeEditor extends Component<CodeEditorContainerProps> {
  onChange(newValue: string) {
    this.props.value.setValue(value)
  }

  render(): ReactNode {
    return <AceEditor
      name={this.props.name}
      style={this.props.style}
      className={this.props.class}
      mode={this.props.mode}
      theme={this.props.theme}
      height={this.props.height}
      width={this.props.width}
      value={this.props.value.value}
      defaultValue={this.props.value.value}
      debounceChangePeriod={100}
      onChange={this.onChange}
    />;
  }
}
```

We need to build the widget again running the build command in the console...
```bash
npm run build
```

That's better, we can see the HTML syntax highlighting and Monokai theme is working and we aren't getting any dramatic errors...

<img alt="Code Editor widget properties in Studio Pro" src="/assets/img/Screenshot-CodeEditorInBrowserStage1.png" width="100%" />

We could load all the required libraries for each theme, language and setting, but the build process will create a very large bundled file, that will need to load everytime the widget is used in the app. This will cause performance issues. In this use case, I want users to be able to configure properties of the widget such as theme and language within Mendix, and then let the widget properties decide what libraries to load.

## Overcoming the issue

### Creating the Rollup config

To achieve this, we needed to tell the bundler to just bundle the `ace-builds` files into the widget package directory, before it gets packaged.

As Mendix pluggable widget tools uses Rollup JS, this can be achieved by providing a custom configuration file in the directory of your project called `rollup.config.js`.

First we need to figure out how to select the files we wanted from the `node_modules` folder. Using the [Rollup configuration options documentation](https://rollupjs.org/configuration-options/#input), I found they had already provided an example of how to select input files using a glob pattern.

Here is my adaptation of that example to suit our needs...

[`rollup.config.js`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/rollup.config.js)

``` javascript
import { join } from "path";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";


// Get list of modules from 'ace-builds'
const files = Object.fromEntries(
  globSync("node_modules/ace-builds/src-min-noconflict/**/*.js").map(file => [
    // Remove the 'node_modules/ace-builds' path from the filepath. e.g.
    // 'node_module/ace-builds/src-noconflict/ace.js' becomes 'src-noconflict/ace.js'
    path.relative(
      "node_modules/ace-builds",
      file.slice(0, file.length - path.extname(file).length)
    ),
    // Expands the relative paths to absolute paths, so e.g.
    // 'src-noconflict/ace.js' becomes 'C:/.../node_module/ace-builds/src-noconflict/ace.js'
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

export default args => {
  const config = args.configDefaultConfig;

  // Use to debug the output files
  console.log(files);

  return config;
};
```

Using `console.log` allows us to see the output during the build script.

Now when we run `npm run build` in the console, we get a long console output (comments used as example)...

```
{
  'src-min-noconflict/worker-yaml': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/worker-yaml.js',
  'src-min-noconflict/worker-xquery': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/worker-xquery.js',
  'src-min-noconflict/worker-xml': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/worker-xml.js',
// workers...
  'src-min-noconflict/theme-xcode': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/theme-xcode.js',
  'src-min-noconflict/theme-vibrant_ink': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/theme-vibrant_ink.js',
  'src-min-noconflict/theme-twilight': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/theme-twilight.js',
// themes...
  'src-min-noconflict/mode-zig': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/mode-zig.js',
  'src-min-noconflict/mode-zeek': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/mode-zeek.js',
  'src-min-noconflict/mode-yaml': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/mode-yaml.js',
// modes...
  'src-min-noconflict/keybinding-vscode': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/keybinding-vscode.js',
  'src-min-noconflict/keybinding-vim': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/keybinding-vim.js',
  'src-min-noconflict/keybinding-sublime': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/keybinding-sublime.js',
// keybindings...
  'src-min-noconflict/ext-whitespace': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/ext-whitespace.js',
  'src-min-noconflict/ext-themelist': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/ext-themelist.js',
  'src-min-noconflict/ext-textarea': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/ext-textarea.js',
// extensions...
  'src-min-noconflict/ace': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/ace.js',
  'src-min-noconflict/snippets/zig': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/snippets/zig.js',
  'src-min-noconflict/snippets/zeek': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/snippets/zeek.js',
  'src-min-noconflict/snippets/yaml': '/Users/cartermoorse/Documents/GitHub/Mendix-CodeEditor/node_modules/ace-builds/src-min-noconflict/snippets/yaml.js',
// snippets...
}
```

The key is the output directory, the value is the input directory.

We just need to add these files to our Rollup configuration so they are bundled...

[`rollup.config.js`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/rollup.config.js)

``` javascript
import { join } from "path";
import { 
  sourcePath,
  widgetName,
  widgetPackage
} from "./node_modules/@mendix/pluggable-widgets-tools/configs/shared";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";


// Get list of modules from 'ace-builds'
const files = Object.fromEntries(
  globSync("node_modules/ace-builds/src-min-noconflict/**/*.js").map(file => [
    // Remove the 'node_modules/ace-builds' path from the filepath. e.g.
    // 'node_module/ace-builds/src-noconflict/ace.js' becomes 'src-noconflict/ace.js'
    path.relative(
      "node_modules/ace-builds",
      file.slice(0, file.length - path.extname(file).length)
    ),
    // Expands the relative paths to absolute paths, so e.g.
    // 'src-noconflict/ace.js' becomes 'C:/.../node_module/ace-builds/src-noconflict/ace.js'
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const outDir = join(sourcePath, "/dist/tmp/widgets/");
const outWidgetDir = join(widgetPackage.replace(/\./g, "/"), widgetName.toLowerCase());

export default args => {
  const config = args.configDefaultConfig;

  // Use to debug the output files
  // console.log(files);

  config.unshift({
    input: files,
    output: {
      format: "es",
      entryFileNames: "[name].js",
      dir: join(outDir, outWidgetDir)
    }
  });

  return config;
};
```

Once I had the files I wanted, I could add them to the Rollup config using `unshift()` which will append to the start of the `configDefaultConfig` array.

Now when we run the `npm run build` script, it should build the widget with the library packaged.
To see the results, you can navigate to `./dist/tmp/<author>/<widgetname>` in our project directory, and we can now see the files have loaded successfully...

<img alt="Temp folder with Ace library output" src="/assets/img/Screenshot-TmpFolderWithAceOutput.png" width="100%" />

Once that is done, it is just a case of getting Ace to load these files from their new location.

### Loading the JavaScript files
Now we have the files available at in our app, we can access them from the widget location.

Ace editor should load most of the files it needs, but expects you to load lib files for auto-completion, snippets, emmet and tab-stops.

To achieve this, I added a helper method for loading the required libraries...

[`src/CodeEditor.tsx`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/src/CodeEditor.tsx)

``` tsx
import { Component, ReactNode, createElement } from "react";
import AceEditor from "react-ace";

export default class CodeEditor extends Component<CodeEditorContainerProps> {
  // Base path to Ace lib files. In our case, it is now bundled in our widget.
  // Example: widgets/<author>/<widgetname>/src-min-noconflit
  static basePath = "widgets/carterm/codeeditor/src-min-noconflict";

  // Helper method for loading required library files, such as 
  loadAce(filename: string): Promise<HTMLScriptElement | null> {
    return new Promise((resolve) => {
      const location = CodeEditor.basePath + "/" + filename;
      const head = document.getElementsByTagName("head")[0];
      let script: HTMLScriptElement | null = document.querySelector("script[src=\"" + location + "\"]");
      if (script == null) {
        script = document.createElement("script");
        script.src = location;
        head.appendChild(script);
        script.onload = () => {
          script?.setAttribute("has-loaded", "true");
          resolve(script);
        }
      }
      else if (script.getAttribute("has-loaded") == "true") {
        resolve(script);
      }
    })
  }

  // render ...
}
```

I then pre-emtively load the Ace libraries, based on the widget properties set in Mendix. As users might not want all the features...

[`src/CodeEditor.tsx`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/src/CodeEditor.tsx)

``` tsx
import { Component, ReactNode, createElement, createRef, RefObject } from "react";
import AceEditor from "react-ace";

export default class CodeEditor extends Component<CodeEditorContainerProps> {
  editorRef: RefObject<AceEditor> = createRef();
  
  static basePath = "widgets/carterm/codeeditor/src-min-noconflict";

  loadModules() {
    const editor = this.editorRef.current?.editor;
    if (!editor) return;
  
    if (this.props.enableBasicAutocompletion ||
      this.props.enableLiveAutocompletion ||
      this.props.enableSnippets) {
        this.loadAce("ext-language_tools.js").then(() => editor.setOptions({
          "enableBasicAutocompletion": this.props.enableBasicAutocompletion,
          "enableLiveAutocompletion": this.props.enableLiveAutocompletion,
          "enableSnippets": this.props.enableSnippets
        }));
    }
    if (this.props.enableEmmet) {
      // Promise callback commented out due to TypeScript definition missing for "enableEmmet"
      this.loadAce("ext-emmet.js")//.then(() => editor.setOption("enableEmmet", this.props.enableEmmet));
    }
    if (this.props.useElasticTabstops) {
      // Promise callback commented out due to TypeScript definition missing for "useElasticTabstops"
      this.loadAce("ext-elastic_tabstops_lite.js")//.then(() => editor.setOption("useElasticTabstops", this.props.useElasticTabstops));
    }
  }

  componentDidMount(): void {
    this.loadModules();
  }

  componentDidUpdate(): void {
    this.loadModules();
  }
}
```

We can also tell Ace where its library files are located...

[`src/CodeEditor.tsx`](https://github.com/Carter-Moorse/Mendix-CodeEditor/blob/main/src/CodeEditor.tsx)
``` tsx
import { Component, ReactNode, createElement, createRef, RefObject } from "react";
import { config } from "ace-builds";
import AceEditor from "react-ace";

export default class CodeEditor extends Component<CodeEditorContainerProps{  
  static basePath = "widgets/carterm/codeeditor/src-min-noconflict";
  // ... widget code ...
}

config.set("packaged", true);
config.set("basePath", CodeEditor.basePath);
config.set("workerPath", CodeEditor.basePath);
config.set("modePath", CodeEditor.basePath);
config.set("themePath", CodeEditor.basePath);
```

## Testing the widget works
As you can see, now we have a working code editor in Mendix...

<img alt="Ace editor in Safari browser showing Mendix app" src="/assets/img/Screenshot-CodeEditorInBrowserAutoCompletion.png" width="100%" />

We can see in the developer tools where the library files are being located...

<img alt="Temp folder with Ace library output" src="/assets/img/Screenshot-CodeEditorInBrowserWithScriptsLoaded.png" width="100%" />

Any properties we change in Mendix are reflects what loads in the Mendix app.

To get the source code for the full project, go to the [Mendix-CodeEditor GitHub repo](https://github.com/Carter-Moorse/Mendix-CodeEditor). Thanks for reading!
