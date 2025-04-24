/// <reference path="_references.js" />

(function (angular, globals) {
	'use strict';

	/*
	 ** Cloud.Desktop module is created.
	 */
	var moduleName = 'cloud.common';

	var appCloudCommon = angular.module(moduleName, ['ui.router', 'cfp.hotkeys']);
	globals.modules.push(moduleName);
})(angular, globals);