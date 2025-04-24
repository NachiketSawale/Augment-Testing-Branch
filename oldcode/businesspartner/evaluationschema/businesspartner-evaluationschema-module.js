(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.evaluationschema';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Business Partner Main states are defined in this config block.
	 */
	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (platformLayoutService) {
				let options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							platformSchemaService.initialize();

							return platformSchemaService.getSchemas([
								{typeName: 'EvaluationSchemaDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'},
								{typeName: 'EvaluationSchemaIconDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'},
								{typeName: 'EvaluationGroupDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'},
								{typeName: 'EvaluationGroupIconDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'},
								{typeName: 'EvaluationSubgroupDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'},
								{typeName: 'EvaluationItemDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'}
							]);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'businessPartnerEvaluationSchemaIconCombobox'
							]);
						}]
					},
					'controller': 'businesspartnerEvaluationschemaController'
				};
				platformLayoutService.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService',
			function ($injector, naviService) {
				naviService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (item, triggerField) {
							$injector.get('businesspartnerEvaluationschemaHeaderService').registerNavi(item, triggerField);
							naviService.getNavFunctionByModule(moduleName)(item);
						}
					}
				);
			}]);

})(angular, globals);