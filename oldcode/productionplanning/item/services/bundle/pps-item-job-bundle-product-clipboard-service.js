// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).service('productionplanningItemJobBundleProductClipBoardService', ProductLookupClipBoardService);

	ProductLookupClipBoardService.$inject = ['_','ppsCommonNotifyUpdatingService','productionplanningItemJobBundleDataService'];

	function ProductLookupClipBoardService(_,ppsCommonNotifyUpdatingService,productionplanningItemJobBundleDataService) {

		function doCanPaste(sourcePastedContent) {
			if (sourcePastedContent.type === 'Product') {
				return !ppsCommonNotifyUpdatingService.isUpdating() && productionplanningItemJobBundleDataService.getSelected();
			}
			return false;
		}

		function doPaste(pastedContent){
			pastedContent.itemService.assignByButton();
		}

		return {
			doCanPaste: doCanPaste,
			canDrag: () => false,
			doPaste: doPaste
		};
	}
})(angular);
