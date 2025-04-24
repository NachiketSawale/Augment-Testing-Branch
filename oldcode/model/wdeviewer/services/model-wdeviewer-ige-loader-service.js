/* global Module, ENV */
var Module = (typeof Module !== 'undefined' ? Module : {});

(function (angular, globals, Module) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerIgeLoaderService', ['$q',
		function ($q) {
			var service = {}, baseUrl = globals.appBaseUrl + (window.crossOriginIsolated ? 'model-ige/' : 'model-ige/nop/');
			var promise1, promise2;

			Module.locateFile = function (path, prefix) {
				return baseUrl + path;
			};

			Module.preRun = Module.preRun || [];

			Module.preRun.push(function () {
				ENV.SDL_EMSCRIPTEN_KEYBOARD_ELEMENT = '#canvas';
				ENV.IGE_INDEXEDDB_HOUSEKEEPING_PATH = baseUrl + 'indexeddb_housekeeping.js';
			});

			Module.mainScriptUrlOrBlob = (function (module) {
				return baseUrl + 'ige.js';
			})();

			function loadScript(name) {
				var deferred = $q.defer();

				$.getScript(baseUrl + name).done(function (script, textStatus) {
					deferred.resolve(true);
				}).fail(function (jqxhr, settings, exception) {
					// deferred.reject(false);
				});

				return deferred.promise;
			}

			function isIgeReady() {
				var deferred = $q.defer();

				Module.onRuntimeInitialized = function () {
					deferred.resolve(true);
				};

				return deferred.promise;
			}

			service.loadEngine = function () {
				if (_.isNil(promise1)) {
					promise1 = isIgeReady();
				}

				if (_.isNil(promise2)) {
					promise2 = loadScript('ige.js');
				}

				return $q.all([promise1, promise2]);
			};

			return service;
		}
	]);

// eslint-disable-next-line no-global-assign
})(angular, globals, Module);