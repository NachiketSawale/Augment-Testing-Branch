/**
 * Created by zwz on 8/30/2023.
 */
(function () {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('productionplanningItemUpstreamPackagesCreationWizardHandler', Handler);
	Handler.$inject = ['$http', '$q', '$translate', 'platformModalService', 'platformModuleNavigationService', 'basicsWorkflowInstanceService'];
	function Handler($http, $q, $translate, platformModalService, navigationService, basicsWorkflowInstanceService) {

		this.doCreateUpstreamPackages = (upstreamItemDataService, mainDataService, getPackageRequestFn) => {
			var selectedUpstreamItems = !_.isNil(upstreamItemDataService) ? upstreamItemDataService.getSelectedEntities() : null;
			var selectedItem = mainDataService.getSelected();
			selectedUpstreamItems = _.filter(selectedUpstreamItems, { PpsUpstreamItemFk: null, PpsUpstreamGoodsTypeFk: 1, PpsUpstreamTypeFk: 2, UpstreamResult: null });
			if (!_.isEmpty(selectedUpstreamItems) && !_.isNil(selectedItem)) {
				getPackageRequestFn(selectedItem, selectedUpstreamItems).then(packageRequest => {
					return $http.post(globals.webApiBaseUrl + 'procurement/package/ppsWizard/createPackageForPpsUpstreamItems', packageRequest).then(function (result) {
						var updatedUpstreamItems = result.data.UpstreamItems;
						var updatedEntities = [];
						_.forEach(updatedUpstreamItems, function (updateEntity) {
							var originalEntity = _.find(selectedUpstreamItems, { Id: updateEntity.Id });
							if (!_.isNil(originalEntity) && originalEntity.UpstreamResult !== updateEntity.PrcPackageFk) {
								originalEntity.UpstreamResult = updateEntity.PrcPackageFk;
								updatedEntities.push(originalEntity);
							}
						});
						var optionalPromise = $q.when(true);
						if (!_.isEmpty(updatedEntities)) {
							upstreamItemDataService.markEntitiesAsModified(updatedEntities);
							optionalPromise = mainDataService.update();
						}
						return optionalPromise.then(function () {
							var tranlsationObject = {
								pkg: result.data.PrcPackageCode
							};

							// region result dialog

							var resultMessage = $translate.instant('productionplanning.item.wizard.upstreamItemPrcPackage.resultMsg', tranlsationObject);

							var dialogOption = {
								windowClass: 'msgbox',
								iconClass: 'info',
								headerTextKey: 'productionplanning.item.wizard.upstreamItemPrcPackage.dialogTitle',
								bodyTextKey: resultMessage,
								customButtons: [{
									id: 'goToPackage',
									caption: 'productionplanning.item.wizard.upstreamItemPrcPackage.goToPackage',
									disabled: false,
									autoClose: false,
									cssClass: 'app-icons ico-test',
									fn: function (button, event, closeFn) {
										closeFn();
										navigationService.navigate({
											moduleName: 'procurement.package'
										}, _.map(result.data.UpstreamItems, 'PrcPackageFk'), 'PrcPackageFk');
									}
								}]
							};

							platformModalService.showDialog(dialogOption).then(() => triggerWorkflow(result), () => triggerWorkflow(result));
						});
					});
				});

			} else {
				platformModalService.showErrorBox('productionplanning.item.wizard.upstreamItemPrcPackage.noUpstreamSelection',
					'productionplanning.item.wizard.upstreamItemPrcPackage.dialogTitle');
			}
		};

		function triggerWorkflow(result) {
			if (result.status === 200) {
				const resultForUpstream = result;

				const description = 'PPS_Beschaffungspaket->Status_Produktionsbedarf';
				$http.post(globals.webApiBaseUrl + 'basics/workflow/template/byfilter', {
					'Pattern': description,
					'PageSize': 1,
					'PageNumber': 0,
					'UseCurrentClient': true,
					'UseCurrentProfitCenter': null,
					'IncludeNonActiveItems': null,
					'ProjectContextId': null,
					'PinningContext': [],
					'ExecutionHints': false
				}).then((workflowResult) => {
					if (workflowResult.status === 200) {
						const workflow = workflowResult.data.dtos.length > 0 ? workflowResult.data.dtos[0] : null;
						const upstreamItem = resultForUpstream.data.UpstreamItems && resultForUpstream.data.UpstreamItems[0] ? resultForUpstream.data.UpstreamItems[0] : null;
						if (workflow && upstreamItem) {
							basicsWorkflowInstanceService.startWorkflow(workflow.Id, upstreamItem.PrcPackageFk ? upstreamItem.PrcPackageFk : 0, JSON.stringify(upstreamItem));
						}
					}
				});
			}
		}
	}
})();