(function () {
	'use strict';
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionPickupIconService', ['$translate', '_', function ($translate, _) {
			var service = {};

			var icons = [{
					id: true,
					res: 'control-icons ico-transport-return',
					toolTip: 'transportplanning.requisition.isPickup',
				}, {
					id: false,
					res: 'control-icons ico-transport-delivery',
					toolTip: 'transportplanning.requisition.isNotPickup',
				}];

			service.select = function (item) {
				if (item) {
					var icon = item.IsPickup ? icons[0] : icons[1];
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
