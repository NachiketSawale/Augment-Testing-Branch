/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	var moduleName = 'sales.common';
	/**
	 * @ngdoc service
	 * @name salesCommonLineItemStatusProcessor
	 * @function
	 *
	 * @description
	 * The salesCommonLineItemStatusProcessor adds images according to base line item or referenced line item.
	 */
	angular.module(moduleName).factory('salesCommonLineItemStatusProcessor', ['$translate', function ($translate) {

		var service = {};

		service.processItem = function processItem(lineItem) {
			// insert Images to resource Item according to status
			if (lineItem) {
				lineItem.statusImage = 'ico-indicator4-2';
			}
		};

		service.select = function (lineItem) {
			if (lineItem) {
				var image = 'control-icons ico-indicator4-2';
				return image;
			}
		};

		service.isCss = function () {
			return true;
		};

		service.selectTooltip = function (lineItem) {
			if (lineItem) {
				// TODO: move translation to common part or create separate for sales
				return $translate.instant('procurement.package.totallyAssigned');
			}
			return '';
		};

		return service;
	}]);
})(angular);