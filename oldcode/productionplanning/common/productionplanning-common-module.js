(function (angular) {
	/* global angular, globals */
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'HeaderDto', moduleSubModule: 'ProductionPlanning.Header'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductParamDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'},
							{typeName: 'PpsCalendarForSiteDto', moduleSubModule: 'ProductionPlanning.Common'}
						]);
					}],
					loadCommonCustomColumns: ['ppsCommonCustomColumnsServiceFactory', function (customColumnsServiceFactory) {
						return customColumnsServiceFactory.initCommonCustomColumnsService();
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]);
})(angular);


