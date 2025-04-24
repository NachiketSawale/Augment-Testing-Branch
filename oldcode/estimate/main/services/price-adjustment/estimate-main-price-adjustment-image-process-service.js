

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainPriceAdjustmentImageProcess
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('estimate.main').factory('estimateMainPriceAdjustmentImageProcess', ['$translate', function () {

		let service = {};

		service.processItem = function processItem(item) {
			if (item) {
				item.StatusImage = 'control-icons ico-status-plus-minus-' + item.Status;
			}
		};

		service.select = function (item) {
			if (item) {
				return 'control-icons ico-status-plus-minus-' + item.Status;
			}
		};

		service.isCss = function () {
			return true;
		};

		return service;
	}]);

	angular.module('estimate.main').factory('estimateMainPriceAdjustmentTotalImageProcess', ['$translate', function () {

		let service = {};

		service.processItem = function processItem(item) {
			if (item&&item.Id==='Ur') {
				item.Quantity = 'control-icons ico-status-plus-minus-' + item.Status;
			}
		};

		service.select = function (item) {
			if (item && item.Id === 'Ur') {
				return 'control-icons ico-status-plus-minus-' + item.Status;
			}
		};

		service.isCss = function () {
			return true;
		};

		return service;
	}]);
})(angular);
