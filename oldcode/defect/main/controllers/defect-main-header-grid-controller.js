/**
 * Created by jim on 5/3/2017.
 */
/* global ,  _ , moment */
(function (angular) {
	'use strict';

	var moduleName='defect.main';
	/**
	 * @ngdoc controller
	 * @name defectMainHeaderGridController
	 * @require $scope, platformGridControllerService, defectMainHeaderDataService, defectMainHeaderElementValidationService,  defectMainHeaderUIStandardService,
	 *          modelViewerStandardFilterService
	 * @description controller for contract header
	 */
	angular.module(moduleName).controller('defectMainHeaderGridController',
		['$scope', '$translate', 'platformGridControllerService', 'defectMainHeaderDataService',
			'defectMainHeaderElementValidationService', 'defectMainHeaderUIStandardService','cloudDesktopSidebarService','defectMainHeaderReadonlyProcessor',
			'bascisCommonClerkDataServiceFactory','defectMainClipboardService',
			'modelViewerStandardFilterService','modelViewerModelSelectionService','platformModalService','modelMainObjectSetConfigurationService','platformModalFormConfigService','basicsLookupdataLookupDescriptorService',
			'$injector','platformControllerExtendService','procurementContextService',
			'platformMenuListUtilitiesService',
			function ($scope, $translate, platformGridControllerService, defectMainHeaderDataService, defectMainHeaderElementValidationService, defectMainHeaderUIStandardService,
				cloudDesktopSidebarService, defectMainHeaderReadonlyProcessor,
				bascisCommonClerkDataServiceFactory, defectMainClipboardService,
				modelViewerStandardFilterService, modelViewerModelSelectionService, platformModalService, modelMainObjectSetConfigurationService, platformModalFormConfigService, basicsLookupdataLookupDescriptorService,
				$injector, platformControllerExtendService, moduleContext,
				platformMenuListUtilitiesService) {

				var gridConfig = {
					initCalled: false,
					columns: [],
					type:'modelMainObjectDataService',
					dragDropService: defectMainClipboardService,
					extendDraggedData: function (draggedData) {
						draggedData.modelDataSource = defectMainClipboardService.myDragdropAdapter;
					},
					cellChangeCallBack: onCellChangeCallBack
				};
				gridConfig.costGroupService = $injector.get('defectMainCostGroupService');
				moduleContext.setLeadingService(defectMainHeaderDataService);
				moduleContext.setMainService(defectMainHeaderDataService);

				platformGridControllerService.initListController($scope, defectMainHeaderUIStandardService, defectMainHeaderDataService, defectMainHeaderElementValidationService, gridConfig);

				var origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						return !!defectMainHeaderDataService.getSelected();
					}
					else {
						return origCanDrop.call($scope.ddTarget, info);
					}
				};

				var origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						let objectService = $injector.get('defectMainModelAnnoObjectLinkDataService');
						const annotations = objectService.getParentDataService().getSelectedEntities();
						if (!Array.isArray(annotations) || annotations.length !== 1) {
							return;
						}
						objectService.createObjectLinks(modelViewerModelSelectionService.getSelectedModelId(), info.draggedData.getDraggedObjectIds().objectIds).then(function () {
							objectService.load();
						});
					}
					else
					{
						origDrop.call($scope.ddTarget, info);
					}
				};

				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
					active: true
				}]);

				function onCellChangeCallBack(e) {
					var entity=e.item;
					defectMainHeaderReadonlyProcessor.handlerItemReadOnlyStatus(entity);
				}

				function costGroupLoaded(costGroupCatalogs){
					if(costGroupCatalogs.isForDetail === null || costGroupCatalogs.isForDetail === undefined){
						$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, defectMainHeaderUIStandardService, costGroupCatalogs,defectMainHeaderDataService,defectMainHeaderElementValidationService);
					}
				}

				defectMainHeaderDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				/* add costGroupService to mainService */
				if(!defectMainHeaderDataService.costGroupService){
					defectMainHeaderDataService.costGroupService = $injector.get('defectMainCostGroupService');
				}
				defectMainHeaderDataService.costGroupService.registerCellChangedEvent($scope.gridId);

				$scope.$on('$destroy', defectMainHeaderDataService.unregisterAll);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, defectMainHeaderDataService.getServiceName());

				const toolbarItems = [
					platformMenuListUtilitiesService.createToggleItemForObservable({
						value: defectMainHeaderDataService.updateModelSelection,
						toolsScope: $scope
					})
				];

				platformGridControllerService.addTools(toolbarItems);

				$scope.$on('$destroy', function () {
					defectMainHeaderDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
					defectMainHeaderDataService.costGroupService.unregisterCellChangedEvent($scope.gridId);
				});
			}]
	);
})(angular);
