/**
 * Created by joshi on 21.11.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ControlTowerConfigurationCommonService
	 * @function
	 *
	 * @description
	 * ControlTowerConfigurationCommonService is the data service for ControlTower configuration related common functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('mtwo.controltowerconfiguration').factory('mtwoControlTowerConfigurationCommonService', [
		function () {
			var service = {};
			// var CurrencyForeignFk = 0;

			service.onSelectionChanged = function () {
				// var col = arg.grid.getColumns()[arg.cell].field;
				// var selectedItem = arg.item;
				// var mainList = arg.grid.getData().getItems();
			};

			return service;
		}]);
})(angular);
