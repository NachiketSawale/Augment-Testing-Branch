/**
 * Created by wui on 11/27/2015.
 */

(function(angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsLookupdataLookupApi', [
		function () {
			var appendedOptions = {}, lookupInstances = {}, service = {
				registerInstance: registerInstance,
				unregisterInstance: unregisterInstance,
				appendOptions: appendOptions,
				removeOptions: removeOptions,
				updateOptions: updateOptions,
				disableInput: disableInput,
				registerEvent: registerEvent,
				unregisterEvent: unregisterEvent
			};

			function registerInstance(key, instance) {
				if (!angular.isArray(lookupInstances[key])) {
					lookupInstances[key] = [];
				}
				lookupInstances[key].push(instance);
			}

			function unregisterInstance(key, instance) {
				if (angular.isArray(lookupInstances[key])) {
					var index = lookupInstances[key].indexOf(instance);
					if (index !== -1) {
						lookupInstances[key].splice(index, 1);
					}
					if (!lookupInstances[key].length) {
						delete lookupInstances[key];
					}
				}
			}

			function proxy(key, fn) {
				if (angular.isArray(lookupInstances[key])) {
					lookupInstances[key].forEach(fn);
				}
			}

			function appendOptions(key, options) {
				if (options) {
					appendedOptions[key] = options;
				}
				else {
					return appendedOptions[key];
				}
			}

			function removeOptions(key) {
				if (appendedOptions.hasOwnProperty(key)) {
					appendedOptions[key] = null;
					delete appendedOptions[key];
				}
			}

			function updateOptions(key, options) {
				var oldOptions = appendedOptions[key];
				if (angular.isObject(oldOptions)) {
					angular.extend(oldOptions, options);
				} else {
					appendOptions(key, options);
				}
			}

			function disableInput(key, value) {
				var setting = {disableInput: value};
				updateOptions(key, setting);
				proxy(key, function (instance) {
					instance.updateOptions(setting);
				});
			}

			function registerEvent(key, name, handler) {
				proxy(key, function (instance) {
					instance.registerEvent(name, handler);
				});
			}

			function unregisterEvent(key, name, handler) {
				proxy(key, function (instance) {
					instance.unregisterEvent(name, handler);
				});
			}

			return service;
		}
	]);

})(angular);