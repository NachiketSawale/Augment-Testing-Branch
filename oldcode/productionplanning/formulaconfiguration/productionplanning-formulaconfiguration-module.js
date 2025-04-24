/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{ typeName: 'PpsFormulaDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{ typeName: 'PpsFormulaVersionDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{ typeName: 'PpsFormulaInstanceDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{ typeName: 'PpsParameterDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{ typeName: 'PpsParameterValueDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'}
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function(basicsLookupdataLookupDefinitionService){
						return basicsLookupdataLookupDefinitionService.load([
							'basicsDependentDataDomainCombobox'
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
