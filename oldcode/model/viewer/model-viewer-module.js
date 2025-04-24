/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/*
	 ** model.viewer module is created.
	 */
	const moduleName = 'model.viewer';
	const languageModuleName = 'cloud.common';

	angular.module(moduleName, [languageModuleName, 'platform', 'basics.common']);

	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const options = {
				moduleName: moduleName
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
