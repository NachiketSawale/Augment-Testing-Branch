# App-Routing Module

This module provides the main routes for the application.

The special routes for initializing the application are declared statically.
They are dynamically complemented by a provider that injects more routes using the `ROUTES` injection token.
These additional routes are collected from the registered preload modules.

## Open Questions

Some architectural questions are still open with regard to this module.

### Where are the additional routes injected?

As of Angular 14, the official documentation just says that `ROUTES` is the injection token for routes, but does not explain where it is used and where the injected routes are actually registered.
Based upon observations, it seems the additional routes are just appended to the root routes tree, which is exactly what we want.

### Can the dynamic routes be moved to a separate module?

So far, we have been unsuccessful in moving the dynamic part of the routes tree into a separate module.
If this is required, some additional research and experimenting will be necessary.