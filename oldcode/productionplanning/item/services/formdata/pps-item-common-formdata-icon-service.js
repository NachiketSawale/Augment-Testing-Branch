(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemCommonFormDataIconService', ['$translate', function ($translate) {
		var service = {};

		var icons = [
			{
				id: 'parentUnit',
				res: 'control-icons ico-accordion-root',
				toolTip: 'productionplanning.item.formData.parentUnit'
			}, {
				id: 'currentUnit',
				res: 'control-icons ico-accordion-grp',
				toolTip: 'productionplanning.item.formData.currentUnit'
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