/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'awp.main';
	const mainModule = angular.module(moduleName);

	mainModule.factory('awpProjectMainListDataService',
		['_', '$injector', 'projectCommonListDataServiceFactory',
			function (_, $injector, projectCommonListDataServiceFactory) {

				let serviceOption = {
					module : mainModule,
					moduleName : moduleName,
					serviceName : 'awpProjectMainListDataService',
					updateUrl : 'awp/main/',
					displayModuleName : 'cloud.desktop.moduleDisplayNameAdvancedWorkPackaging',
				};

				return projectCommonListDataServiceFactory.createService(serviceOption);
			}
		]);
})(angular);