/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingItemListController
	 * @function
	 *
	 * @description
	 * Controller for the item list view of a selected billing (header) entity.
	 **/
	angular.module(moduleName).controller('salesBillingItemListController',
		['$scope', '$translate', '$injector', 'platformContainerControllerService', 'platformGridControllerService',
			function ($scope, $translate, $injector, platformContainerControllerService, platformGridControllerService) {
				platformContainerControllerService.initController($scope, moduleName, 'EB36FDA6B4DE4965B4E98EC012D0506B');

				var tools = [{
					id: 'Item Numbering Configuration',
					caption: $translate.instant('sales.billing.itemNoConfigDlgTitle'),
					type: 'item',
					iconClass: 'tlb-icons ico-settings-doc',
					fn: function () {
						$injector.get('salesBillingItemService').showItemNumberingConfigDialog();
					},
					disabled: false
				}];
				platformGridControllerService.addTools(tools);

				$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtItemMainSerivce($injector.get('salesBillingItemService'));
				$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtItemContainerScope($scope);
				$scope.$on('$destroy', function () {
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtItemMainSerivce(null);
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtItemContainerScope(null);
				});
			}
		]);
})();
