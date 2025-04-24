(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).factory('transportplanningRequisitionToBeAssignedButtonService', ButtonService);

	ButtonService.$inject = [
		'$timeout',
		'$http',
		'$translate',
		'_',
		'platformGridAPI',
		'platformModalService',
		'transportplanningBundleButtonService',
		'basicsCommonReferenceControllerService',
		'transportplanningBundleDocumentDataProviderFactory',
		'basicsCommonToolbarExtensionService',
		'basicsLookupdataLookupDescriptorService'];

	function ButtonService(
		$timeout,
		$http,
		$translate,
		_,
		platformGridAPI,
		platformModalService,
		transportplanningBundleButtonService,
		referenceControllerService,
		documentDataProviderFactory,
		basicsCommonToolbarExtensionService,
		basicsLookupdataLookupDescriptorService) {

		function extendAssignButtons($scope, dataService) {
			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'assign',
				caption: 'transportplanning.unassignedBundle.assignToTrsRequisition',
				type: 'item',
				sort: -1001,
				iconClass: 'tlb-icons ico-assign-bundle',
				fn: function () {
					dataService.assignByButton();
				},
				disabled: function () {
					let selectedArray = dataService.getSelectedEntities();
					if (selectedArray.length === 0) {
						return true;
					}

					let parentSelected = dataService.parentService().getSelected();
					if (_.isNil(parentSelected)) {
						return true;
					}

					// check if it's a child node(child node cannot be assigned)
					if (!_.some(selectedArray, (item) => {
						return !item.nodeInfo || !item.nodeInfo.childrentrue;
					})) {
						return true;
					}

					if (!_.some(selectedArray, (item) => {
						return item.ProjectFk === parentSelected.ProjectFk;
					})) { // for bundle or product case, if the TrsRequisitionFk is not null, it cannot be assigned.
						return true;
					}

					if (_.some(selectedArray, (item) => {
						return !!item.TrsProductBundleFk;
					})) { // children of bundles disabled.
						return true;
					}

					// check status of the selected trsRequisition
					return dataService.parentService().isSelectedItemAccepted();
				}
			});
		}

		function extendCreateTrsReqButton($scope, dataService) {
			function updateTools() {
				if ($scope.tools) {
					$scope.tools.update();
				}
				// Only the grid events call the updateButtons function. This events are out of the
				// digest cycle of angular. Therefor we have to start an new digest.
				$timeout(function () {
					$scope.$apply();
				});
			}

			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'createNewTrsReq',
				caption: 'transportplanning.unassignedBundle.createTrsRequisition',
				type: 'item',
				iconClass: 'tlb-icons ico-rec-new',
				fn: function () {
					function showFailureDialog(data) {
						// show failure of creating trsReq dialog with
						let errorMsg = data.Message;
						platformModalService.showDialog({
							headerTextKey: 'cloud.common.errorMessage',
							bodyTextKey: errorMsg,
							iconClass: 'ico-error'
						});
					}

					let selectedEntities = _.clone(dataService.getSelectedEntities());
					let bundleIds = _.filter(_.map(selectedEntities, 'BundleId'), (e) => {
						return !!e;
					});
					let productIds = _.filter(_.map(selectedEntities, 'ProductId'), (e) => {
						return !!e;
					});
					//var ppsItemIds = _.map(selectedEntities, 'ItemFk');
					let ppsItemId = selectedEntities[0].PPSItemFk;
					let currentJobId = _.map(selectedEntities, 'CurrentLocationJobFk')[0];
					let postData = {
						ProductIds: productIds,
						BundleIds: bundleIds,
						PpsItemId: ppsItemId,
						CurrentJobId: currentJobId
					};

					$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/createbytobeassigned', postData).then(
						function (response) {
							if (response && response.data) {
								if (response.data.Result === true) {
									let needAssignedItems = selectedEntities;

									// create new trsRequisition , and assign selected bundles to this new trsRequisition
									if (response.data.TrsRequisition) {
										dataService.parentService().onCreatedTrsReq(response.data.TrsRequisition, function assignBundlesToTrsReq() {
											dataService.assignByButton();
										});
									}

									if (response.data.Site) {
										basicsLookupdataLookupDescriptorService.updateData('SiteNew', [response.data.Site]);
									}

									updateTools();
								} else {
									showFailureDialog(response.data);
								}
							}
						}
					);
				},
				disabled: function () {
					// check if parent container is trsReq container and parent container is active.
					var parentService = dataService.parentService();
					if (_.isNil(parentService)) {
						return true;
					}
					var isTrsReqDataService = parentService.isTrsReqDataService;
					if (!_.isFunction(isTrsReqDataService) || !isTrsReqDataService()) {
						return true;
					} else {
						var hasShowContainer = parentService.hasShowContainer;
						if (!_.isFunction(hasShowContainer) || !hasShowContainer()) {
							return true;
						}
					}

					var selectedEntities = dataService.getSelectedEntities();
					if (_.isNil(selectedEntities) || selectedEntities.length <= 0) {
						return true;
					}

					if (_.some(selectedEntities, (item) => {
						return !!item.TrsProductBundleFk;
					})) { // children of bundles disabled.
						return true;
					}

					// check if exists bundle‘s ItemFk is null
					if (_.some(selectedEntities, function (b) {
						return _.isNil(b.PPSItemFk);
					})) {
						return true;
					}

					// let ppsItemIds = new Set(_.map(selectedEntities, 'PPSItemFk'));
					// // check if bundles have different pps item
					// if (ppsItemIds.size > 1) {
					// 	return true;
					// }

					// check if the linked PU has a existed trsRequision event sequence
					return false;
				}
			});

			// add a divider before create-trsReq button
			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'd0',
				type: 'divider'
			});
		}

		function extendFilterButtons($scope, dataService) {
			// recover loadAll-button
			if (dataService.needShowLoadAllButton) {
				var item = _.find($scope.tools.items, {id: 'loadAll'});
				if (!item) {
					basicsCommonToolbarExtensionService.insertBefore($scope, {
						id: 'loadAll',
						caption: 'transportplanning.unassignedBundle.loadAll',
						type: 'item',
						value: true,
						sort: -1000,
						iconClass: 'tlb-icons ico-refresh',
						fn: function () {
							dataService.loadAll();
						}
					});
				}
			}

			function updateTools($scope) {
				if ($scope.tools) {
					$scope.tools.update();
				}
				// Only the grid events call the updateButtons function. This events are out of the
				// digest cycle of angular. Therefor we have to start an new digest.
				$timeout(function () {
					$scope.$apply();
				});
			}

			function doUpdateTools() {
				updateTools($scope);
			}

			dataService.getNeedAssignedDataService().parentService().registerSelectionChanged(doUpdateTools);

			function doUpdateTools2() {
				updateTools($scope);
			}

			dataService.parentService().registerSelectionChanged(doUpdateTools2);
			// remark: in Mounting Activity module, dataService.getNeedAssignedDataService().parentService() is `productionplanningActivityTrsRequisitionDataService`,
			// dataService.parentService() is `productionplanningActivityActivityDataService`.

			$scope.$on('$destroy', function () {
				dataService.getNeedAssignedDataService().parentService().unregisterSelectionChanged(doUpdateTools);
				dataService.parentService().unregisterSelectionChanged(doUpdateTools2);
			});

			dataService.registerEntityReadSuccessed(function (filterResult) {
				if (_.isNil($scope.tools)) {
					return; // fix TypeError: Cannot read property 'items' of null
				}

				var needShowLoadAllButton = filterResult.itemsFound > filterResult.itemsRetrieved || filterResult.RecordsFound > filterResult.RecordsRetrieved;
				var loadAllBtn = _.find($scope.tools.items, {id: 'loadAll'});
				if (needShowLoadAllButton) {
					if (!_.isNil(loadAllBtn)) {
						if (loadAllBtn.hideItem === true) {
							loadAllBtn.hideItem = false;
							$scope.tools.update();
						}
					} else {
						basicsCommonToolbarExtensionService.insertBefore($scope, {
							id: 'loadAll',
							caption: 'transportplanning.unassignedBundle.loadAll',
							type: 'item',
							value: true,
							sort: -1000,
							iconClass: 'tlb-icons ico-refresh',
							fn: function () {
								dataService.loadAll();
							}
						});
						$scope.tools.update();
					}
				} else {
					if (angular.isDefined(loadAllBtn) && loadAllBtn !== null) {
						loadAllBtn.hideItem = true;
						$scope.tools.update();
					}
					//else do nothing
				}

			});
		}

		return {
			addToolsUpdateOnSelectionChange: transportplanningBundleButtonService.addToolsUpdateOnSelectionChange,
			extendDocumentButtons: transportplanningBundleButtonService.extendDocumentButtons,
			extendReferenceButtons: transportplanningBundleButtonService.extendReferenceButtons,
			extendAssignButtons: extendAssignButtons,
			extendFilterButtons: extendFilterButtons,
			extendSelectionDialogButtons: transportplanningBundleButtonService.extendSelectionDialogButtons,
			extendMoveToRootButton: transportplanningBundleButtonService.extendMoveToRootButton,
			extendCreateTrsReqButton: extendCreateTrsReqButton
		};
	}
})(angular);
