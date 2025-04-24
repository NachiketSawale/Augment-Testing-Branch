/**
 * Created by zwz on 2023/10/23.
 */

(function () {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonDocumentCombineUIStandardService', PpsDocumentCombineUIStandardService);

	PpsDocumentCombineUIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningCommonTranslationService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'productionplanningCommonDocumentLayout',
		'ppsCommonGenericDocumentFromValuesHelper'];

	function PpsDocumentCombineUIStandardService(PlatformUIStandardConfigService,
	                                             productionplanningCommonTranslationService,
	                                             platformSchemaService,
	                                             platformUIStandardExtentService,
	                                             ppsDocumentLayout,
	                                             ppsCommonGenericDocumentFromValuesHelper) {

		let items = ppsCommonGenericDocumentFromValuesHelper.translatedFromValues.filter(e => e.id === 'DRW' || e.id === 'PRODUCTTEMPLATE'); // for drawing&template documents container

		let newAddition = _.cloneDeep(ppsDocumentLayout.addition);
		let originColumnConfig = newAddition.grid.find(e => e.id === 'origin');
		originColumnConfig.editorOptions.items = items;

		let masterAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsDocumentDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});
		masterAttributeDomains = masterAttributeDomains.properties;

		let service = new PlatformUIStandardConfigService(ppsDocumentLayout, masterAttributeDomains, productionplanningCommonTranslationService);

		platformUIStandardExtentService.extend(service, newAddition, masterAttributeDomains);

		service.getProjectMainLayout = function () {
			return ppsDocumentLayout;
		};

		return service;
	}
})();
