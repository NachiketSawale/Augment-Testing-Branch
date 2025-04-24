// <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';
	/* global ,globals */
	/*
	 ** basics.materialLookup module is created.
	 */
	var moduleName = 'documents.main';

	angular.module(moduleName, ['documents.project']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'}
						]);
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]);

})(angular);