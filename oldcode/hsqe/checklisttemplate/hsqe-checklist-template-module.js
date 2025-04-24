/*
 * Created by alm on 01.19.2021.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						platformSchemaService.initialize();

						return platformSchemaService.getSchemas([
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'HsqChkListTemplateDto', moduleSubModule: 'Hsqe.CheckListTemplate'},
							{typeName: 'HsqCheckListGroupDto', moduleSubModule: 'Hsqe.CheckListTemplate'},
							{typeName: 'HsqChkListTemplate2FormDto', moduleSubModule: 'Hsqe.CheckListTemplate'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
