/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/*
	 ** model.simulation module is created.
	 */
	const moduleName = 'model.simulation';

	angular.module(moduleName, []);

	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const options = {
				'moduleName': moduleName
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
