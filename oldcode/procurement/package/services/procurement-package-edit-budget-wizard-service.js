(function (angular) {
	'use strict';
	angular.module('procurement.package').factory('procurementPackageEditBudgetWizardService', [
		'_',
		'$injector',
		'procurementPackageDataService',
		'platformModalService',
		'$translate',
		'procurementCommonPrcItemDataService',
		'procurementContextService',
		function(
			_,
			$injector,
			headerService,
			platformModalService,
			$translate,
			commonItemDataService,
			moduleContext) {
			return {
				execute: function() {
					let header = headerService.getSelected();
					if (header === null || header === undefined) {
						return;
					}
					let isEditable = headerService.getBudgetEditingInProcurement();
					let budgetEditableValue = headerService.getBudgetEditingValueInProcurement();
					if (!isEditable && budgetEditableValue !== 3) {//system option 915 only 3 can via activate wizard
						return platformModalService.showDialog({
							headerTextKey: $translate.instant('procurement.package.wizard.editBudget.title'),
							bodyTextKey: $translate.instant('procurement.package.wizard.editBudget.unusable'),
							iconClass: 'ico-info'
						});
					} else {
						// activate prc item budget field editable
						headerService.setBudgetEditableInPrc(true, 3);
						const itemService = commonItemDataService.getService(headerService);
						if (itemService && _.isFunction(itemService.load)) {
							itemService.load();
						}

						// activate boq item budget field editable
						let boqService = $injector.get('prcBoqMainService').getService(moduleContext.getMainService());
						boqService.load();

						return platformModalService.showDialog({
							headerTextKey: $translate.instant('procurement.requisition.wizard.editBudget.title'),
							bodyTextKey: $translate.instant('procurement.requisition.wizard.editBudget.success'),
							iconClass: 'ico-info'
						});
					}
				}
			};
		}]);
})(angular);
