(function (angular) {
	'use strict';
	/* global angular, _ */
	let moduleName = 'transportplanning.transport';

	angular.module(moduleName).service('trsRouteSettlementConvertableImageService',
		['$translate', function ($translate) {
			let service = {};

			let icons = [
				{
					id: 0,
					res: 'control-icons ico-grid-validation',
					toolTip: 'transportplanning.transport.wizard.badComponent'
				},
				{
					id: 1,
					res: 'control-icons ico-grid-ok',
					toolTip: 'transportplanning.transport.wizard.goodComponent'
				}];

			service.select = function (item) {
				if (item) {
					var icon = _.find(icons, {'id': item.Convertable});
					if (icon) {
						return icon.res;
					}
				}
			};

			service.selectTooltip = function (context) {
				if (context) {
					var icon = _.find(icons, {'id': context.Convertable});
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
})(angular);