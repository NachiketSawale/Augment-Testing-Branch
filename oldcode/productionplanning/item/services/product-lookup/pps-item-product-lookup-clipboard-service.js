// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).service('productionplanningItemProductLookupClipBoardService', ProductLookupClipBoardService);

	ProductLookupClipBoardService.$inject = ['ppsCommonNotifyUpdatingService'];

	function ProductLookupClipBoardService(ppsCommonNotifyUpdatingService) {

		return {
			doCanPaste: () => false,
			canDrag: () => !ppsCommonNotifyUpdatingService.isUpdating(),
			copy:() => {}
		};
	}
})(angular);
