
(function () {
	/* global _, globals */
	'use strict';
	const moduleName = 'hsqe.checklist';
	/**
	 * @ngdoc controller
	 * @name hsqeCheckListlistController
	 * @require $scope, platformGridControllerService, hsqeCheckListDataService, hsqeCheckListUIStandardService, hsqeCheckListValidationService
	 * @description controller for CheckList header
	 */
	angular.module(moduleName).controller('hsqeCheckListlistController',
		['$scope', '$translate', 'platformGridControllerService', 'hsqeCheckListDataService', 'hsqeCheckListUIStandardService', 'hsqeCheckListValidationService',
			'platformModalService',  'hsqeCheckListClipBoardService', 'procurementContextService', 'cloudDesktopSidebarService',
			'basicsLookupdataLookupDescriptorService', 'cloudDesktopPinningContextService', 'modelViewerMarkerService', 'modelViewerViewerRegistryService', 'modelViewerStandardFilterService','$injector','$http',
			function ($scope, $translate, gridControllerService, dataService, gridColumns, validationService, platformModalService,
				clipboardService, moduleContext, cloudDesktopSidebarService, basicsLookupdataLookupDescriptorService, cloudDesktopPinningContextService, modelViewerMarkerService,
				modelViewerViewerRegistryService, modelViewerStandardFilterService, $injector, $http) {
				moduleContext.setLeadingService(dataService);
				moduleContext.setMainService(dataService);
				let config = {
					initCalled: false,
					columns: [],
					type: 'modelMainObjectDataService',
					dragDropService: clipboardService,
					extendDraggedData: function (draggedData) {
						draggedData.modelDataSource = clipboardService.myDragdropAdapter;
						if (draggedData.sourceGrid && draggedData.sourceGrid.data) {
							_.forEach(draggedData.sourceGrid.data, function (item) {
								item.FileArchiveDocFk = 0;// Dev-2008 Use outlook canDrop
								if (item.DescriptionInfo && !item.DescriptionInfo.Description) {
									item.DescriptionInfo.Description = '';// null display null
									item.DescriptionInfo.Translated = '';// null display null
								}
							});
						}
					}
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, config);

				let origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						return !!dataService.getSelected();
					}
					else if (info.draggedData && info.draggedData.sourceGrid.type === 'hsqeCheckListGroupTemplateDataService') {
						if(info.draggedData.sourceGrid.data && info.draggedData.sourceGrid.data.length === 1){
							return info.draggedData.sourceGrid.data[0].IsGroup === false;
						}
						return true;
					}
					else if (info.draggedData && info.draggedData.sourceGrid.type === 'hsqeCheckListTemplateDataService') {
						return true;
					}
					else {
						return origCanDrop.call($scope.ddTarget, info);
					}
				};

				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
					active: true
				}]);

				let origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						let modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
						let checkListItem = dataService.getSelected();
						let objectIds = info.draggedData.getDraggedObjectIds().objectIds;
						const request = {
							ForeignParentTypeId: 'hsqe.checklist',
							ForeignParentId: {
								Id: checkListItem.Id
							},
							ModelId: modelViewerModelSelectionService.getSelectedModelId(),
							ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
						};
						$http.post(globals.webApiBaseUrl + 'model/annotation/objlink/createmany', request).then(function(){
							$injector.get('hsqeCheckListModelObjectDataService').load();
						});
					} else if (info.draggedData && info.draggedData.sourceGrid.type === 'hsqeCheckListGroupTemplateDataService') {
						if (info.draggedData.sourceGrid.data.length > 1 && _.find(info.draggedData.sourceGrid.data, {IsGroup: true})) {
							let bodyText = $translate.instant('hsqe.checklist.groupTemplate.createText');
							platformModalService.showYesNoDialog(bodyText, $translate.instant('hsqe.checklist.groupTemplate.createTitle'), 'yes')
								.then(function (result) {
									if (result.yes) {
										createItemByTemplate(info.draggedData.sourceGrid.data);
									}
								});
						} else {
							createItemByTemplate(info.draggedData.sourceGrid.data);
						}
					} else if (info.draggedData && info.draggedData.sourceGrid.type === 'hsqeCheckListTemplateDataService') {
						createItemByTemplate(info.draggedData.sourceGrid.data);
					} else {
						origDrop.call($scope.ddTarget, info);
					}
				};

				function createItemByTemplate(data){
					data.forEach(function (item) {
						if (dataService.createItemByTemplate) {
							dataService.createItemByTemplate(item);
						}
					});
				}

				let toolbarItems = [
					{
						id: 'ZoomToViewer',
						caption: 'project.inforequest.tlbZoomToViewer',
						type: 'check',
						iconClass: 'tlb-icons ico-zoom-to',
						fn: function(btnId, btn) {
							modelViewerMarkerService.setZoomToViewer(!btn.value);
						}
					}
				];

				gridControllerService.addTools(toolbarItems);

				let createChildBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'createDeepCopy';
				});
				$scope.tools.items.splice(createChildBtnIdx+1,0,{
					id: 'createSubChild',
					sort: 3,
					caption: 'hsqe.checklist.header.deepCopyToSubTip',
					type: 'item',
					iconClass: 'tlb-icons ico-sub-fld-new',
					disabled: function () {
						return !dataService.canCopy();
					},
					fn: function () {
						let itemSelected = dataService.getSelected();
						if (itemSelected){
							dataService.createSubDeepCopy();
						}
					}
				});
				$scope.tools.update();

				let isActionActive = false;
				let updateAction = function () {
					if (modelViewerViewerRegistryService.isViewerActive()) {
						if (!isActionActive) {
							dataService.setActionActive();
							isActionActive = true;
						}
					}
				};
				updateAction();
				modelViewerViewerRegistryService.onViewersChanged.register(updateAction);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());
				$scope.$on('$destroy', function () {
					modelViewerViewerRegistryService.onViewersChanged.unregister(updateAction);
				});
			}
		]);
})();
