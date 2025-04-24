(function (angular) {
	'use strict';

	var moduleName = 'object.project';
	/* global globals */

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	/**
	 * @ngdoc module
	 * @name object.project
	 * @description
	 * Module definition of the object module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'HeaderDto', moduleSubModule: 'Object.Project'},// important in project-main-module.js
							{typeName: 'LevelDto', moduleSubModule: 'Object.Project'},// important in project-main-module.js
							{typeName: 'HeaderDocumentDto', moduleSubModule: 'Object.Project'}// important in project-main-module.js
						]);
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]);
})(angular);