/**
 * Created by csalopek on 14.08.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.extsys';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name scheduling.extsys
	 * @description
	 * Module definition of the scheduling extsys module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			// var wizardData = [];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'Calendar2ExternalDto', moduleSubModule: 'Scheduling.ExtSys'}
						]);
					}],
					loadServiceFunc: ['basicsConfigWizardSidebarService', function (/* basicsConfigWizardSidebarService */) {
						// basicsConfigWizardSidebarService.registerWizard(wizardData);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
