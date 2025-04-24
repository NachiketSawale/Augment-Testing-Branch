# **Creation of this documentation**

# Table of contents
1. [Codebase](#codebase)
2. [Create a local instance](#local)

## <a name="codebase"></a>Codebase for this documentation
The code base for this documentation is the **daily build** of this branch, which is generated once every evening.
Committed changes only become visible in the documentation through this build.

To be able to quickly check if the changes are as intended, you have to create a local instance and call it with the browser.

## <a name="local"></a>Create a local instance of the documentation
To create a local instance of the documentation two npm scripts can be used. These scripts must be executed in the root directory of the project. This can be done in any shell, e.g. powershell or webstorm terminal.

1. **npm run compodoc** - creates the documentation files in */libs/documentation/compodoc/index.html*
2. **npm run compodoc-serve** - creates and serves the generated documentation at http://127.0.0.1:8080
