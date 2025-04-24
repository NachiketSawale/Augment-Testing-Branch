/**
 * Created by lnb on 12/3/2014.
 */
(function (angular) {
	'use strict';

	/* globals globals */

	/*
	 ** procurement.contract module is created.
	 */
	var moduleName = 'qto.formula';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName,'qto.main'], true);
					}],
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						platformSchemaService.initialize();

						return platformSchemaService.getSchemas([
							{ typeName: 'QtoFormulaDto', moduleSubModule: 'Qto.Formula' },
							{ typeName: 'QtoFormulaUomDto', moduleSubModule: 'Qto.Formula' },
							{ typeName: 'QtoCommentDto', moduleSubModule: 'Qto.Formula' },
							{ typeName: 'QtoFormulaScriptTransDto', moduleSubModule: 'Qto.Formula' }
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function(basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'qtoFormulaGonimeterLookup',
							'qtoFormulaIconCombobox'
						]);
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]);

})(angular);