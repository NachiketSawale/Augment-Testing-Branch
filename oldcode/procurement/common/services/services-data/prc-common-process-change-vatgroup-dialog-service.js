(function(angular) {
	'use strict';
	const moduleName = 'procurement.common';
	angular.module(moduleName).factory('prcCommonProcessChangeVatGroupDialog', [
		'$translate',
		'procurementContextService',
		'platformModuleStateService',
		function (
			$translate,
			procurementContextService,
			platformModuleStateService
		) {
			function showAskDialog(currentModuleName, service, data, entity, dialogId, callbackForRecalcuate) {
				let myDialogOptions = {
					headerText: $translate.instant('procurement.common.Warning'),
					bodyText: $translate.instant('procurement.common.changeVatGroupRecalBoqAndItem'),
					showYesButton: true,
					showNoButton: true,
					iconClass: 'ico-question',
					id: dialogId,
					dontShowAgain: true
				};

				let modState = platformModuleStateService.state(angular.module(currentModuleName));
				let modificationCount = modState.modifications ? modState.modifications.EntitiesCount : 0;
				procurementContextService.showDialogAndAgain(myDialogOptions).then(function (result) {
					if (result.yes) {
						if (service.vatGroupChanged) {
							service.vatGroupChanged.fire();
						}
						service.markItemAsModified(entity);
						if (entity.Version > 0 && Object.prototype.hasOwnProperty.call(entity, 'Id')) {
							service.update().then(function () {
								callbackForRecalcuate();
							});
						}
					} else {
						entity.BpdVatGroupFk = entity.originVatGroupFk;
						service.markItemAsModified(entity);
						if (!modificationCount) {
							data.doClearModifications(entity, data);
						}
					}
				});
			}
			return {
				showAskDialog: showAskDialog
			};
		}
	]);
})(angular);