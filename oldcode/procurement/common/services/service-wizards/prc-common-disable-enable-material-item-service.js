/**
 * Created by jie on 2025.04.17
 */
(function (angular) {
	'use strict';

	const moduleName = 'procurement.common';
	angular.module(moduleName).factory('ProcurementCommonDisableEnabledService',
		['_', '$translate', 'platformModalService', 'procurementCommonPrcItemDataService',
			function (_, $translate, platformModalService, procurementCommonPrcItemDataService) {
				let service = {};

				service.execute = function execute() {
					let prcItemService = procurementCommonPrcItemDataService.getService();
					const selectedItems = prcItemService.getSelectedEntities();
					if (selectedItems.length === 0) {
						platformModalService.showMsgBox('Please select an Item', 'Info', 'ico-info');
					} else {
						selectedItems.forEach(e => {
							e.IsDisabled = !e.IsDisabled;
						})
						prcItemService.markEntitiesAsModified(selectedItems)
						const enabledItemNumbers = selectedItems.filter(e => !e.IsDisabled).map(e => e.Itemno);
						const disabledNumbers = selectedItems.filter(e => e.IsDisabled).map(e => e.Itemno);
						let updatedMsg;
						if (enabledItemNumbers.length > 0) {
							let enabledMsg = '[' + enabledItemNumbers.join(',') + ']';
							updatedMsg = $translate.instant('procurement.common.enabledListText', {enabledList: enabledMsg});
						}
						if (disabledNumbers.length > 0) {
							let disabledMsg = '[' + disabledNumbers.join(',') + ']';
							if (updatedMsg) {
								updatedMsg += $translate.instant('procurement.common.disabledListText', {disabledList: disabledMsg});
							} else {
								updatedMsg = $translate.instant('procurement.common.disabledListText', {disabledList: disabledMsg});
							}
						}
						let modalOptions = {
							headerText: $translate.instant('procurement.common.disableEnableMaterialTitle'),
							bodyText: $translate.instant('procurement.common.disableEnableMaterialMsg', {messageInfo: updatedMsg}),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}

				};
				return service;
			}]);
})(angular);