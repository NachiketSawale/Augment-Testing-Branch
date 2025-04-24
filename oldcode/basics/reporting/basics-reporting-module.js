(function (angular) {
	'use strict';

	var moduleName = 'basics.reporting';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							return platformSchemaService.getSchemas([
								{typeName: 'ReportDto', moduleSubModule: 'Basics.Reporting'},
								{typeName: 'ReportParameterDto', moduleSubModule: 'Basics.Reporting'},
								{typeName: 'ReportParameterValuesDto', moduleSubModule: 'Basics.Reporting'}
							]);
						}],

						'loadTranslation': ['platformTranslateService', 'basicsReportingSysContextItems', function (platformTranslateService, basicsReportingSysContextItems) {
							return platformTranslateService.registerModule([moduleName], true)
								.then(function () {
									platformTranslateService.translateObject(basicsReportingSysContextItems, ['description']);

									return true;
								});
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		])
		.run();

})(angular);