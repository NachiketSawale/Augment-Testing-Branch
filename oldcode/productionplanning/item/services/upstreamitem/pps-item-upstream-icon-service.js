/**
 * Created by maj on 8/12/2021.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemUpstreamItemIconService', ['$translate', function ($translate) {
		var service = {};

		var icons = [
			{
				id: 'parentUnit',
				res: 'control-icons ico-accordion-root',
				toolTip: 'productionplanning.item.upstreamItem.parentUnit'
			}, {
				id: 'currentUnit',
				res: 'control-icons ico-accordion-grp',
				toolTip: 'productionplanning.item.upstreamItem.currentUnit'
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