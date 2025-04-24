/**
 * Created by jes on 8/31/2016.
 */
/* global globals */
(function (angular, globals) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

})(angular, globals);