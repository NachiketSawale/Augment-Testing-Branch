/**
 * Created by lav on 12/10/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItem2MdcMaterialLayout', Layout);

	Layout.$inject = ['productionplanningCommonLayoutHelperService'];

	function Layout(ppCommonLayoutHelperService) {
		return {
			'fid': 'productionplanning.item.ppsItem2MdcMaterialLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'addAdditionalColumns': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['mdcmaterialfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				'mdcmaterialfk': ppCommonLayoutHelperService.provideMaterialLookupOverload()
			}
		};
	}
})();

(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItem2MdcMaterialUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService', 'productionplanningItemTranslationService',
		'ppsItem2MdcMaterialLayout'];

	function UIStandardService(platformUIConfigInitService, productionplanningItemTranslationService,
							   layout) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: layout,
			dtoSchemeId: {
				moduleSubModule: 'ProductionPlanning.Item',
				typeName: 'PpsItem2MdcMaterialDto'
			},
			translator: productionplanningItemTranslationService
		});
	}
})();