/**
 * Created by lnb on 8/28/2015.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name packagePackage2HeaderCommomItemsProcessor
	 * @function
	 *
	 * @description
	 * For add extra properties to package2header help to add use containers in procurement common
	 */

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('platform').factory('PackagePackage2HeaderCommonItemsProcessor', [function () {
		return function (parentService) {
			var self = this;
			var defineProp = function (item, prop, packageProp) {
				var getter = function () {
					var parentItem = _.find(parentService.getList(), {Id: item.PrcPackageFk});
					return _.get(parentItem, packageProp);
				};
				var setter = function (value) {
					var parentItem = _.find(parentService.getList(), {Id: item.PrcPackageFk});
					_.set(parentItem, packageProp, value);
				};
				Object.defineProperty(item, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			};

			var deleteProp = function (item, prop) {
				// eslint-disable-next-line no-prototype-builtins
				if (item.hasOwnProperty(prop)) {
					delete item[prop];
				}
			};

			self.processItem = function processItem(item) {
				// item.ControllingUnitFk = item.ReqHeaderEntity.ControllingUnitFk;   //for general.MdcControllingunitFk nullable
				// item.MaterialCatalogFk = item.ReqHeaderEntity.MaterialCatalogFk; //for filter in procurement-common-item-mdcmaterial-filter
				// item.ExchangeRate = item.ReqHeaderEntity.ExchangeRate;//price condition recalcuation

				defineProp(item, 'TaxCodeFk', 'TaxCodeFk');
				defineProp(item, 'ProjectFk', 'ProjectFk');
				defineProp(item, 'CurrencyFk', 'CurrencyFk');
				defineProp(item, 'ExchangeRate', 'ExchangeRate');
				item.PackageFk = item.PrcPackageFk;
			};

			self.revertProcessItem = function revertProcessItem(item) {
				// remove the properties only for sub containers calculation.
				deleteProp(item, 'ControllingUnitFk');
				deleteProp(item, 'TaxCodeFk');
				deleteProp(item, 'ProjectFk');
				deleteProp(item, 'ReqHeaderEntity');
				deleteProp(item, 'MaterialCatalogFk');
				deleteProp(item, 'ExchangeRate');
				deleteProp(item, 'BpdBusinesspartnerFk');
				deleteProp(item, 'PackageFk');
			};
		};
	}]);
})(angular);