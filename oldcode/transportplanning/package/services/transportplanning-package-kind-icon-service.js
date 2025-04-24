/**
 * Created by lav on 1/24/2019.
 */
(function () {
	'use strict';
	var moduleName = 'transportplanning.package';

	/**
	 * @ngdoc service
	 * @name transportplanningPackageKindIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('transportplanningPackageKindIconService', ['$translate', '_', function ($translate, _) {
		var service = {};

		var icons = [
			{
				id: 'Delivery',
				res: 'control-icons ico-transport-delivery',
				toolTip: 'transportplanning.package.isDeliveryPkg',
			}, {
				id: 'ReturnOfDelivery',
				res: 'control-icons ico-transport-return',
				toolTip: 'transportplanning.package.isReturnPkg',
			}, {
				id: 'InternalRelocation',
				res: 'control-icons ico-transport-reloc-int',
				toolTip: 'transportplanning.package.internalReloc',
			}, {
				id: 'ExternalRelocation',
				res: 'control-icons ico-transport-reloc-ext',
				toolTip: 'transportplanning.package.externalReloc',
			},{
				id: 'Unknown',
				res: 'tlb-icons ico-warning',
				toolTip: 'transportplanning.package.none',
			}];

		service.select = function (item) {
			if (item) {
				var icon = _.find(icons, {'id': item.Kind});
				if (icon) {
					return icon.res;
				}
			}
		};

		service.selectTooltip = function (context) {
			if (context) {
				var icon = _.find(icons, {'id': context.Kind});
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
