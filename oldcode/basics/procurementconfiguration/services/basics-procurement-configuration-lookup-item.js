/**
 * Created by wuj on 4/14/2015.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsprocurementconfigurationLookUpItems',
		['platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function (platformTranslateService, lookupDescriptorService) {
				var styleTypeItems = [
					{Id: 1, Description: 'Normal', Description$tr$: 'basics.procurementconfiguration.lookupItem.normal'},
					{Id: 2, Description: 'High Lighted', Description$tr$: 'basics.procurementconfiguration.lookupItem.highlighted'},
					{Id: 3, Description: 'Gray Out', Description$tr$: 'basics.procurementconfiguration.lookupItem.grayout'}
				];
				var totalTypeItems = [
					{Id: 1, Description: 'Budget', Description$tr$: 'basics.procurementconfiguration.lookupItem.budget'},
					{Id: 2, Description: 'Target Value', Description$tr$: 'basics.procurementconfiguration.lookupItem.targetValue'},
					{Id: 3, Description: 'Cost Planning', Description$tr$: 'basics.procurementconfiguration.lookupItem.costPlanning'},
					{Id: 4, Description: 'Contract Value', Description$tr$: 'basics.procurementconfiguration.lookupItem.contractValue'},
					{Id: 5, Description: 'Change Orders (approved)', Description$tr$: 'basics.procurementconfiguration.changeOrdersApproved'},
					{Id: 6, Description: 'Change Orders (not approved)', Description$tr$: 'basics.procurementconfiguration.lookupItem.changeOrdersNotApproved)'},
					{Id: 7, Description: 'Reserves', Description$tr$: 'basics.procurementconfiguration.lookupItem.reserves'},
					{Id: 8, Description: 'Contract Total (Contract Value + approved change orders)', Description$tr$: 'basics.procurementconfiguration.lookupItem.contractTotal'},
					{Id: 9, Description: 'Total (incl reserves)', Description$tr$: 'basics.procurementconfiguration.lookupItem.totalInclReserves'},
					{Id: 10, Description: 'Free Values', Description$tr$: 'basics.procurementconfiguration.lookupItem.freeValues'}
				];



				var lookUpItems = {
					'styleType': styleTypeItems,
					'totalType':totalTypeItems
				};

				// reloading translation tables
				platformTranslateService.translationChanged.register(function () {
					platformTranslateService.translateObject(styleTypeItems);
					platformTranslateService.translateObject(totalTypeItems);
				});

				lookupDescriptorService.attachData(lookUpItems);

				return lookUpItems;
			}]);
})(angular);
