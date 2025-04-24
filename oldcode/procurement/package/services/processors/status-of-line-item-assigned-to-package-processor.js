/**
 * Created by chi on 10/26/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	/**
     * @ngdoc service
     * @name procurementPackageStatusOfLineItemAssignedToPackageProcessor
     * @function
     *
     * @description
     * The procurementPackageStatusOfLineItemAssignedToPackageProcessor adds images according to base line item or referenced line item.
     */
	angular.module(moduleName).factory('procurementPackageStatusOfLineItemAssignedToPackageProcessor', ['$translate', function ($translate) {

		var service = {};

		service.processItem = function processItem(lineItem) {
			// insert Images to resource Item according to status
			if (lineItem) {
				if (lineItem.StatusOfLineItemAssignedToPackage === -1){
					lineItem.statusImage = 'ico-indicator4-0';
				}
				else if (lineItem.StatusOfLineItemAssignedToPackage === 0){
					lineItem.statusImage = 'ico-indicator4-1';
				}
				else {
					lineItem.statusImage = 'ico-indicator4-2';
				}
			}
		};

		service.select = function (lineItem) {
			if (lineItem) {
				var image = 'control-icons ';
				if (lineItem.StatusOfLineItemAssignedToPackage === -1){
					image += 'ico-indicator4-0';
				}
				else if (lineItem.StatusOfLineItemAssignedToPackage === 0){
					image += 'ico-indicator4-1';
				}
				else {
					image += 'ico-indicator4-2';
				}

				return image;
			}
		};

		service.isCss = function () {
			return true;
		};

		service.selectTooltip = function (lineItem) {
			if (lineItem) {
				if (lineItem.StatusOfLineItemAssignedToPackage === -1){
					return $translate.instant('procurement.package.notAssigned');
				}
				else if (lineItem.StatusOfLineItemAssignedToPackage === 0){
					return $translate.instant('procurement.package.partiallyAssigned');
				}
				else {
					return $translate.instant('procurement.package.totallyAssigned');
				}
			}
			return '';
		};

		return service;
	}]);
})(angular);