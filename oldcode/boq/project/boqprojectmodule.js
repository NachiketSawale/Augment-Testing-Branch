// / <reference path='_references.js'/>
(function () {
	/* global globals */
	'use strict';

	var moduleName = 'boq.project';

	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule('boq.project');
		}
	]);

})();