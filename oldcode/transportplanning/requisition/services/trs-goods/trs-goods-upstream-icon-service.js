(function () {
	'use strict';
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('trsGoodsUpstreamItemIconService', ['$translate', function ($translate) {
		var service = {};

		var icons = [
			{
				id: 'parentUnit',
				res: 'control-icons ico-assignment',
				toolTip: 'transportplanning.requisition.trsGoods.assignFromUR'
			}];

		service.select = function (item) {
			if (item) {
				if (item.PpsUpstreamItemFk) {
					return icons[0].res;
				}
			}
		};

		service.selectTooltip = function (context) {
			if (context) {
				if (context.PpsUpstreamItemFk) {
					return $translate.instant(icons[0].toolTip);
				}
			}
		};

		service.getIcons = function () {
			return icons;
		};

		service.isCss = function () {
			return true;
		};

		return service;
	}]
	);
})();