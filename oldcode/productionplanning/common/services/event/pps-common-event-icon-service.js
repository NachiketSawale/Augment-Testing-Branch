/**
 * Created by anl on 8/28/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('productionplanningCommonEventIconService', ['$translate', function ($translate) {
			var service = {};

			var icons = [
				{
					id: 'parentUnit',
					res: 'control-icons ico-accordion-root',
					toolTip: 'productionplanning.common.event.parentUnit'
				}, {
					id: 'currentUnit',
					res: 'control-icons ico-accordion-grp',
					toolTip: 'productionplanning.common.event.currentUnit'
				}];

			service.select = function (item) {
				if (item) {
					var icon = _.find(icons, {'id': item.Belonging});
					if (icon) {
						return icon.res;
					}
				}
			};

			service.selectTooltip = function (context) {
				if (context) {
					var icon = _.find(icons, {'id': context.Belonging});
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