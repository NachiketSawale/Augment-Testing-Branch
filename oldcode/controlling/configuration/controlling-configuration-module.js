
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName, ['ui.router', 'platform','cloud.common']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let options = {
				'moduleName': moduleName,
				'resolve': {
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}],
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						platformSchemaService.initialize();
						return platformSchemaService.getSchemas([
							{typeName: 'MdcContrColumnPropDefDto', moduleSubModule: 'Controlling.Configuration'},
							{typeName: 'MdcContrFormulaPropDefDto', moduleSubModule: 'Controlling.Configuration'},
							{typeName: 'MdcContrChartDto', moduleSubModule: 'Controlling.Configuration'},
							{typeName: 'MdcContrCompareconfigDto', moduleSubModule: 'Controlling.Configuration'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
