# Central Preload Modules List

All preload modules in the application are supposed to be loaded eagerly right upon application start-up.
Once loaded, each preload module registers itself with the module manager service.

To make sure all of the preload modules are avilable from the start, they are all referenced in a single list right in the core application, `preloadModules`.
Any newly added preload modules must be added to this list.