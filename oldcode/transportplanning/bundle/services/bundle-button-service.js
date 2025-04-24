(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningBundleButtonService', ButtonService);

	ButtonService.$inject = [
		'$timeout',
		'$http',
		'$translate',
		'_',
		'platformGridAPI',
		'platformModalService',
		'basicsCommonReferenceControllerService',
		'transportplanningBundleDocumentDataProviderFactory',
		'basicsCommonToolbarExtensionService',
		'ppsCommonNotifyUpdatingService',
		'ppsDocumentToolbarButtonExtension'];

	function ButtonService($timeout,
						   $http,
						   $translate,
						   _,
						   platformGridAPI,
						   platformModalService,
						   referenceControllerService,
						   documentDataProviderFactory,
						   basicsCommonToolbarExtensionService,
						   ppsCommonNotifyUpdatingService,
						   ppsDocumentToolbarButtonExtension) {

		function addToolsUpdateOnSelectionChange($scope, dataService) {
			dataService.registerSelectionChanged(onSelectionChanged);

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onSelectionChanged);
			});

			function onSelectionChanged() {
				$scope.tools.update();
			}
		}

		function extendReferenceButtons($scope, dataService) {
			referenceControllerService.extendReferenceButtons($scope, dataService);
		}

		function extendAssignButtons($scope, dataService) {
			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'assign',
				caption: 'transportplanning.unassignedBundle.assignToTrsRequisition',
				type: 'item',
				sort: -1001,
				iconClass: 'tlb-icons ico-assign-bundle',
				fn: function () {
					dataService.assignSelectedItemsToTrsRequisition();
				},
				disabled: function () {
					var selected = dataService.getSelected();
					if(_.isNil(selected)){
						return true;
					}

					if(selected && selected.TrsRequisitionFk !== null){ // remark: if the selected bundle's TrsRequisitionFk is not null, it cannot be assigned.
						return true;
					}

					var parentSelected = dataService.getNeedAssignedDataService().parentService().getSelected();
					if(_.isNil(parentSelected)){
						return true;
					}
					if(parentSelected.ProjectFk !== selected.ProjectFk){
						return true;
					}

					return dataService.getNeedAssignedDataService().parentService().isSelectedItemAccepted();

					// return !dataService.hasSelection() || !dataService.getNeedAssignedDataService().parentService().hasSelection() ||
					// 	dataService.getNeedAssignedDataService().parentService().isSelectedItemAccepted();
				}
			});
		}

		function extendFilterButtons($scope, dataService) {
			// recover loadAll-button
			if(dataService.needShowLoadAllButton){
				var item = _.find($scope.tools.items,{id:'loadAll'});
				if (item === null) {
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

			function doUpdateTools(){
				updateTools($scope);
			}
			dataService.getNeedAssignedDataService().parentService().registerSelectionChanged(doUpdateTools);

			function doUpdateTools2(){
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
				if(_.isNil($scope.tools)){
					return; // fix TypeError: Cannot read property 'items' of null
				}

				var needShowLoadAllButton = filterResult.itemsFound > filterResult.itemsRetrieved;
				var loadAllBtn = _.find($scope.tools.items, {id: 'loadAll'});
				if (needShowLoadAllButton) {
					if (!_.isNil(loadAllBtn)) {
						if (loadAllBtn.hideItem === true) {
							loadAllBtn.hideItem = false;
							$scope.tools.update();
						}
					}
					else {
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
				}
				else {
					if (angular.isDefined(loadAllBtn) && loadAllBtn !== null) {
						loadAllBtn.hideItem = true;
						$scope.tools.update();
					}
					//else do nothing
				}

			});
		}
		// at the moment, extendSelectionDialogButtons is only used by bundle lookup
		function extendSelectionDialogButtons($scope, dataService) {
			var buttons = _.map(documentDataProviderFactory.ppsDocumentTypes, function (ppsDocumentType) {
				return ppsDocumentToolbarButtonExtension.createDocumentButtons(ppsDocumentType, $scope, dataService);
			});
			var previewButtons = _.map(buttons, 'previewButton');
			var downloadButtons = _.map(buttons, 'downloadButton');

			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 't111',
				sort: 112,
				caption: 'cloud.common.gridlayout',
				iconClass: 'tlb-icons ico-settings',
				type: 'item',
				fn: function () {
					platformGridAPI.configuration.openConfigDialog($scope.settings.gridId);
				}
			});

			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'downloadDocument',
				caption: 'transportplanning.bundle.downloadDocument',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-download',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: downloadButtons
				},
				disabled: function () {
					return _.reduce(downloadButtons, function (result, button) {
						return result && button.disabled();
					}, true);
				}
			});

			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'previewDocument',
				caption: 'transportplanning.bundle.previewDocument',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-preview-form',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: previewButtons
				},
				disabled: function () {
					return _.reduce(previewButtons, function (result, button) {
						return result && button.disabled();
					}, true);
				}
			});

			dataService.registerSelectionChanged(onSelectionChanged);

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onSelectionChanged);
			});

			function onSelectionChanged() {
				$scope.tools.update();
			}
		}

		function extendMoveToRootButton($scope, dataService) {
			basicsCommonToolbarExtensionService.insertBefore($scope, {
				id: 'moveToRoot',
				sort: 1,
				caption: 'productionplanning.item.moveToRoot',
				type: 'item',
				iconClass: 'tlb-icons ico-grid-row-start',
				fn: function () {
					dataService.moveToRoot();
				},
				disabled: function () {
					return ppsCommonNotifyUpdatingService.isUpdating() || !dataService.canMoveToRoot();
				}
			});
		}

		function hasDifferentPpsItem(bundles){
			var newlist = [];
			bundles.forEach(function(b){
				if(!_.find(newlist, {ItemFk: b.ItemFk})) {
					newlist.push(b);
					if(newlist.length > 1){
						return true;
					}
				}
			});
			return false;
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
					/*
					function showSuccessDialog(data) {
						var bundleCodesStr = '';
						if(data.Bundles.length === 1){
							bundleCodesStr = data.Bundles[0].Code;
						}
						else if (data.Bundles.length > 1){
							var bundleCodes = _.map(data.Bundles, 'Code');
							bundleCodesStr = bundleCodes.join(',');
						}

						var successText = $translate.instant('transportplanning.unassignedBundle.createTrsRequisitionSuccessfully')
							.replace('{0}', data.TrsRequisition.Code)
							.replace('{1}', bundleCodesStr);
						platformModalService.showDialog({
							headerTextKey: 'cloud.common.informationDialogHeader',
							bodyTextKey: successText,
							iconClass: 'info'
						});
					}
					*/

					function showFailureDialog(data) {
						// show failure of creating trsReq dialog with
						var errorMsg = data.Message;
						platformModalService.showDialog({
							headerTextKey: 'cloud.common.errorMessage',
							bodyTextKey: errorMsg,
							iconClass: 'ico-error'
						});
					}

					var selectedEntities = _.clone(dataService.getSelectedEntities());
					var bundleIds = _.map(selectedEntities, 'Id');
					//var ppsItemIds = _.map(selectedEntities, 'ItemFk');
					var ppsItemId = selectedEntities[0].ItemFk;
					var postData = {
						BundleIds: bundleIds,
						PpsItemId: ppsItemId
					};

					$http.post(globals.webApiBaseUrl+'transportplanning/requisition/createbybundles',postData).then(
						function (response) {
							if(response && response.data){
								if(response.data.Result === true){
									var needAssignedItems = selectedEntities;
									dataService.moveItem(selectedEntities); // remove selected bundles from unassign-bundles container

									// create new trsRequisition , and assign selected bundles to this new trsRequisition
									if(response.data.TrsRequisition){
										 dataService.parentService().onCreatedTrsReq(response.data.TrsRequisition, function assignBundlesToTrsReq() {
											 dataService.assignItemsToTrsRequisition(needAssignedItems);
										 });
									}

									//showSuccessDialog(response.data);
									// update data of selected bundles
									// if(response.data.Bundles){
									// 	_.each(selectedEntities, function (entity) {
									// 		var b = _.find(response.data.Bundles, {Id: entity.Id});
									// 		entity.TrsRequisitionFk = b.TrsRequisitionFk;
									// 	});
									// 	dataService.gridRefresh();
									// }
									updateTools();
								}
								else{
									showFailureDialog(response.data);
								}
							}
						}
					);
				},
				disabled: function () {
					// check if parent container is trsReq container and parent container is active.
					var parentService = dataService.parentService();
					if(_.isNil(parentService)){
						return true;
					}
					var isTrsReqDataService = parentService.isTrsReqDataService;
					if(!_.isFunction(isTrsReqDataService) || !isTrsReqDataService()){
						return true;
					}else {
						var hasShowContainer = parentService.hasShowContainer;
						if(!_.isFunction(hasShowContainer) || !hasShowContainer()){
							return true;
						}
					}

					var selectedEntities = dataService.getSelectedEntities();
					if(_.isNil(selectedEntities) || selectedEntities.length <= 0){
						return true;
					}

					// check if all selected bundles‘s TrsRequisitionFk is null
					if(_.some(selectedEntities,function (b) { return !_.isNil(b.TrsRequisitionFk);})){
						return true;
					}

					// check if exists bundle‘s ItemFk is null
					if(_.some(selectedEntities,function (b) { return _.isNil(b.ItemFk); })){
						return true;
					}
					// check if bundles have different pps item
					if(hasDifferentPpsItem(selectedEntities)){
						return true;
					}

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

		function extendDocumentButtons($scope, dataService) {
			return ppsDocumentToolbarButtonExtension.extendDocumentButtons(
				documentDataProviderFactory.ppsDocumentTypes, $scope, dataService);
		}

		return {
			addToolsUpdateOnSelectionChange: addToolsUpdateOnSelectionChange,
			extendDocumentButtons: extendDocumentButtons,
			extendReferenceButtons: extendReferenceButtons,
			extendAssignButtons: extendAssignButtons,
			extendFilterButtons: extendFilterButtons,
			extendSelectionDialogButtons: extendSelectionDialogButtons,
			extendMoveToRootButton: extendMoveToRootButton,
			extendCreateTrsReqButton: extendCreateTrsReqButton
		};
	}
})(angular);
