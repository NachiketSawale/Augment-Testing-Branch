// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('transportplanningRequisitionTrsGoodsClipBoardService', TrsGoodsClipBoardService);

	TrsGoodsClipBoardService.$inject = ['_'];

	function TrsGoodsClipBoardService(_) {
		var targetType = 'trsGoods';
		var unAssignBungleSourceType1 = 'trsRequisitionUnassignedBundle';
		var unAssignBungleSourceType2 = 'unassignedBundle';

		// eslint-disable-next-line no-unused-vars
		function doCanPaste(source, type, itemOnDragEnd, itemService) {

			let canCreate = !itemService.parentService().isSelectedItemAccepted();
			var selectedTrsReq = itemService.parentService().getSelected();

			if(source.type === 'ToBeAssigned' && canCreate){
				return _.some(source.data, (item) => {
					return item.ProjectFk === selectedTrsReq.ProjectFk;
				});
			}

			var selectedBundle = source.itemService.getSelected();

			if(_.isNil(selectedBundle)){
				return false;
			}
			if(_.isNil(selectedTrsReq)){
				return false;
			}
			if(selectedBundle.ProjectFk !== selectedTrsReq.ProjectFk){
				return false;
			}

			if ((source.type === unAssignBungleSourceType1 || source.type === unAssignBungleSourceType2) &&
				type === targetType && canCreate) {
				return !_.find(source.data, function (bundle) {
					return _.find(itemService.getList(), function (good) {
						return good.TrsGoodsTypeFk === 3 && good.Good === bundle.Id;
					});
				});
			}
			return false;
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) {
			var pastedData = _.clone(source.data);
			//Undefined itemOnDragEnd , create a new TrsGood
			if (pastedData && _.isArray(pastedData)) {
				if(source.type === 'ToBeAssigned'){
					source.itemService.assignByButton();
				}else{
					//Create TrsGood
					itemService.createItems(pastedData, 3, source.itemService.assignSelectedItemsToTrsRequisition);
				}
			}
		}

		return {
			canDrag: function () {
				return false;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);
