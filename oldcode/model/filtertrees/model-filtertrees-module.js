(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.filtertrees';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{ typeName: 'ModelFiltertreeNodeDto', moduleSubModule: 'Model.Filtertrees' }
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);