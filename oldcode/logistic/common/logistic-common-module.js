/**
 * Created by baf on 24.09.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.common';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Basic behaviour of logistic common module (it is not that much, as it provides mainly basics of other logisitc modules
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				moduleName: moduleName
			};
			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);