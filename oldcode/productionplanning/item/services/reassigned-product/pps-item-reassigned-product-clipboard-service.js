(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemReassignedProductClipboardService', ClipboardService);
	ClipboardService.$inject = ['productionplanningItemReassignedProductDataService',
		'productionplanningItemBundleDataService',
		'ppsCommonNotifyUpdatingService'];
	function ClipboardService(reassignedProductDataService,
		productionplanningItemBundleDataService,
		ppsCommonNotifyUpdatingService) {
		var service = {
			doCanPaste: doCanPaste,
			copy: copy,
			canDrag: canDrag,
			doPaste: doPaste
		};
		var clipboard = {data: null, type: null};

		function doCanPaste(canPastedContent) {
			if(canPastedContent.itemService.canMoveToRoot !== undefined && _.isFunction(canPastedContent.itemService.canMoveToRoot))
				return canPastedContent.itemService.canMoveToRoot();
			return false;
		}

		function copy(data, type) {
			clipboard.data = data;
			clipboard.type = type;
		}

		function canDrag() {
			var allowDrag = false;

			if (!ppsCommonNotifyUpdatingService.isUpdating()) {
				var dragItem = reassignedProductDataService.getSelected();
				if (!_.isNil(dragItem)) {
					allowDrag = _.isNil(dragItem.ParentId);
				}
			}

			return allowDrag;
		}

		function doPaste(pastedContent, selectedItem, type){
			if (pastedContent.type === 'ppsItemBundle') {
				pastedContent.itemService.moveToRoot();
			}
		}

		return service;
	}
})(angular);
