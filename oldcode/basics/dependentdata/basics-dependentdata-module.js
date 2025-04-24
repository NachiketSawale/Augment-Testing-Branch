(function (angular) {
	'use strict';

	var moduleName = 'basics.dependentdata';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService){
							return platformSchemaService.getSchemas([
								{ typeName: 'DependentDataDto', moduleSubModule: 'Basics.DependentData'},
								{ typeName: 'UserChartDto', moduleSubModule: 'Basics.DependentData'},
								{ typeName: 'UserChartSeriesDto', moduleSubModule: 'Basics.DependentData'},
								{ typeName: 'DependentDataColumnDto', moduleSubModule: 'Basics.DependentData'}
							]);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function(basicsLookupdataLookupDefinitionService){
							return basicsLookupdataLookupDefinitionService.load([
								'basicsDependentDataDomainCombobox',
								'basicsDependentDataModuleCombobox',
								'basicsDependentDataContainerCombobox'
							]);
						}]
					},
					'controller': 'basicsDependentDataController'
				};

				mainViewServiceProvider.registerModule(options);

			}
		]);

})(angular);