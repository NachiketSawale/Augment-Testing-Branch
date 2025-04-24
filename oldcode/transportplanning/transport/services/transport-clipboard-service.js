/**
 * Created by anl on 7/12/2018.
 */


(function (angular) {
	'use strict';

	/*global angular */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).service('transportplanningTransportClipBoardService', TransportClipBoardService);

	TransportClipBoardService.$inject = [];

	function TransportClipBoardService() {
		var basSiteFilter = 'site-leadingStructure';
		var sourceTrsGoods = 'sourceTrsGoods';
		var sourceTrsRoute = 'transportRoute';

		function doCanPaste(source, targetType, itemOnDragEnd, itemService) {
			if (source.type !== targetType) {
				switch (source.type) {
					case sourceTrsGoods:
						return !!itemOnDragEnd && source.itemService.canUpdateRoute(itemService, itemOnDragEnd);
					default:
						return source.type.indexOf('leadingStructure') > -1;
				}
			}
			return false;
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) {
			switch (source.type) {
				case sourceTrsGoods:
					source.itemService.updateRoute(itemService, itemOnDragEnd);
					break;
				default:
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
		}

		return {
			canDrag: function (type) {
				switch (type) {
					case sourceTrsGoods:
					case sourceTrsRoute:
						return true;
				}
				return false;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);
