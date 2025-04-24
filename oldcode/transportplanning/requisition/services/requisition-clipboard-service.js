/**
 * Created by anl on 7/12/2018.
 */


(function (angular) {
	'use strict';

	/*global angular */
	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('transportplanningRequisitionClipBoardService', TrsRequisitionClipBoardService);

	TrsRequisitionClipBoardService.$inject = [];

	function TrsRequisitionClipBoardService() {
		var basSiteFilter = 'site-leadingStructure';

		function doCanPaste(source) {
			return source.type.indexOf('leadingStructure') > -1;
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) {
			var pastedData = angular.copy(source.data);
			if (itemOnDragEnd && source.data && _.isArray(source.data)) {

				if (source.type.indexOf('leadingStructure')) {
					var list = source.type.split(',');
					var filterType = list[0];
					switch (filterType) {
						case basSiteFilter: {
							itemOnDragEnd.SiteFk = pastedData[0].Id;
						}
							break;
					}
					defaultHandler(itemService.updateActivityForFilterDragDrop(itemOnDragEnd));   // callback on success
				}
			}
		}

		return {
			canDrag: function () {
				return true;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);