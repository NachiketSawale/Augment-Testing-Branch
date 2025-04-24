/**
 * Created by leo on 11.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'scheduling.template';

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
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ActivityTemplateGroupDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'ActivityTemplateDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'EventTemplateDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'PerformanceRuleDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'ActivityTmpl2CUGrpDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'ActivityCriteriaDto', moduleSubModule: 'Scheduling.Template'},
							{typeName: 'ActivityTemplateDocumentDto', moduleSubModule: 'Scheduling.Template'}
						]);
					}],
					loadCatConfiguration: ['platformSchemaService', function (/* platformSchemaService */) {
					}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					initCharacteristicDataService: ['basicsCharacteristicDataServiceFactory', 'schedulingTemplateActivityTemplateService',
						function (basicsCharacteristicDataServiceFactory, schedulingTemplateActivityTemplateService) {
							basicsCharacteristicDataServiceFactory.getService(schedulingTemplateActivityTemplateService, 13);
						}
					]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
