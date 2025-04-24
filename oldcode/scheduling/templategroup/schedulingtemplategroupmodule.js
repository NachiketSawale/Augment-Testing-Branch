/**
 * Created by leo on 11.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.templategroup';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	/**
	 * @ngdoc module
	 * @name Scheduling.Template
	 * @description
	 * Module definition of the Scheduling module
	 **/
	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'ActivityTemplateGroupDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'ActivityTmplGrp2CUGrpDto', moduleSubModule: 'Scheduling.Template'}
						]);
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', function (basicsCompanyNumberGenerationInfoService) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('schedulingTemplateGroupNumberInfoService', 81).load();
					}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
