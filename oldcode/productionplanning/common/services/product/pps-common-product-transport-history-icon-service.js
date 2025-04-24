(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonProductTransportHistoryIconService', ['$translate', function ($translate) {
			var service = {};

		var icons = [{
			id: true,
			res: 'control-icons ico-transport-return',
			toolTip: 'productionplanning.common.product.incoming',
		}, {
			id: false,
			res: 'control-icons ico-transport-delivery',
			toolTip: 'productionplanning.common.product.outgoing',
		}];

		service.select = function (item) {
			if (item) {
				var icon = item.IsIncoming ? icons[0] : icons[1];
				if (icon) {
					return icon.res;
				}
			}
		};

		service.selectTooltip = function (context) {
			if (context) {
				var icon = context.IsPickup ? icons[0] : icons[1];
				if (icon) {
					return $translate.instant(icon.toolTip);
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