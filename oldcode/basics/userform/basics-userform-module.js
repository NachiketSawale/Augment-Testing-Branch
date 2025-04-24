(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.userform';

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
								{typeName: 'FormDto', moduleSubModule: 'Basics.UserForm'},
								{typeName: 'FormFieldDto', moduleSubModule: 'Basics.UserForm'},
								{typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'}
							]);

						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'basicsUserformRubricCombobox',
								'basicsUserformLookupQualifierCombobox',
								'basicsUserformProcessingtypeCombobox',
								'basicsUserformFieldtypeCombobox',
								'basicsUserformWorkflowTemplateCombobox'
							]);
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);

})(angular);
