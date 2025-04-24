/**
 * Created by lav on 4/8/2020.
 */

/*global angular*/
// eslint-disable-next-line func-names
(function (angular) {

	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionTrsGoodsListController', ListController);

	ListController.$inject = [
		'$scope', 'platformContainerControllerService',
		'platformGridAPI',
		'transportplanningRequisitionMainService',
		'basicsCommonToolbarExtensionService',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'trsReq3DViewerService'];

	function ListController(
		$scope, platformContainerControllerService,
		platformGridAPI,
		requisitionMainService,
		basicsCommonToolbarExtensionService,
		referenceActionExtension,
		trsReq3DViewerService) {

		var moduleNameA = $scope.getContentValue('moduleName') || moduleName;
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleNameA, containerUid);

		var modCIS = platformContainerControllerService.getModuleInformationService(moduleNameA);
		var layInfo = modCIS.getContainerInfoByGuid(containerUid);
		var dataServ = platformContainerControllerService.getServiceByToken(layInfo.dataServiceName);

		basicsCommonToolbarExtensionService.insertBefore($scope, dataServ.createPreviewButtons($scope));

		const AddGoodsForSelectedModelObjectBtn = {
			id: 'addGoodsForSelectedModelObject',
			caption: 'transportplanning.requisition.trsGoods.addGoodsForSelectedModelObjects',
			type: 'item',
			iconClass: 'tlb-icons ico-new',
			fn: () => {
				const map = trsReq3DViewerService.getModelIdToObjectIdsMap();
				dataServ.createFromModelObjects(map);
			},
			disabled: () => {
				return !trsReq3DViewerService.isReady() ||
					!trsReq3DViewerService.hasSelectedModelObjects() ||
					!dataServ.parentService().getSelected();
			}
		};

		basicsCommonToolbarExtensionService.insertBefore($scope, AddGoodsForSelectedModelObjectBtn);

		//register cell changed
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataServ.onPropertyChanged(args.item, field);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function updateAssignedBundleRecords(assignedBundles) {
			var key = 'transportplanningBundleToRequisition';
			var assignedRecords = referenceActionExtension.getAssignedItemsRecord(key);
			var tmpBundles = [];
			_.each(assignedRecords, function (b) {
				var r = _.find(assignedRecords, function (record) {
					return record.Id === b.Id;
				});
				if(_.isNil(r)){
					r = b;
				}
				tmpBundles.push(r);
			});

			referenceActionExtension.clearAssignedItemsRecord(key);
			referenceActionExtension.recordAssignedItems(key, tmpBundles);
		}

		function onSelectionChanged() {
			var selected = dataServ.getSelected();
			if (selected) {
				//refresh the assigned bundle here
				var assignedBundles = _.map(_.filter(dataServ.getList(), function (item) {
					return !_.isNull(item.Good) & item.TrsGoodsTypeFk === 3;
				}), function (item) {
					return {Id: item.Good};
				});
				updateAssignedBundleRecords(assignedBundles);

				//refresh the assigned product here
				selected.IgnoredIds = _.map(_.filter(dataServ.getList(), function (item) {
					return !_.isNull(item.Good) & item.TrsGoodsTypeFk === 2;
				}), 'Good');
			}

			$scope.tools.update();
		}
		dataServ.registerSelectionChanged(onSelectionChanged);

		const updateTools = () => $scope.tools.update();
		trsReq3DViewerService.registerSelectionChanged(updateTools);

		function highlightModelObject() {
			const productIds = dataServ.getSelectedEntities().map(i => i.PpsProductFk);
			trsReq3DViewerService.selectModelObjects(productIds);
		}

		dataServ.registerSelectionChanged(highlightModelObject);
		trsReq3DViewerService.registerModelLoaded(highlightModelObject);

		// un-register on destroy
		// eslint-disable-next-line func-names
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			dataServ.unregisterSelectionChanged(onSelectionChanged);
			dataServ.unregisterSelectionChanged(highlightModelObject);
			trsReq3DViewerService.unregisterSelectionChanged(updateTools);
			trsReq3DViewerService.unregisterModelLoaded(highlightModelObject);
		});
	}

})(angular);
