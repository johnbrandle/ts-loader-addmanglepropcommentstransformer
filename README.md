# ts-loader-addmanglepropcommentstransformer: auto property mangle comments

Automatically added Terser `@__MANGLE_PROP__` comments to class members. 

## Overview

The transformer operates by scanning all member declarations (methods, properties, getters, setters) in .ts source. If a member has an explicit access modifier (public, private, protected) and its name does not start with an underscore (_), a synthetic leading comment @__MANGLE_PROP__ is added to that member.

## Installation

```
npm install --save-dev ts-loader-addmanglepropcommentstransformer
```

In your webpack config file, include the following code:

```javascript
const addManglePropCommentsTransformer = require('ts-loader-addmanglepropcommentstransformer');

// ...

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: (program) => ({
            before: [addManglePropCommentsTransformer(program)]
          })
        }
      }
    ]
  },

  optimization: 
    {
        // ...
        minimizer:[new TerserPlugin({terserOptions:
            {
                mangle:
                {
                    properties:
                    {
                        regex: /^_[a-zA-Z_$][0-9a-zA-Z_$]*$/ //mangle any property that begins with an underscore
                    }, 
                    // ...
                }, 
                // ...
            },
        })],
    }
};
```

## Disclaimer

Not heavily tested. Contributions welcome.
