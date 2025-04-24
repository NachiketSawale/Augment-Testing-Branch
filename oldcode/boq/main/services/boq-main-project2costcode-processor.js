/**
 * Created by mov on 07.29.2021.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqMainProject2CostCodeProcessor
	 * @function
	 *
	 * @description
	 * boqMainProject2CostCodeProcessor to process Project2CostCode
	 */

	angular.module('boq.main').factory('boqMainProject2CostCodeProcessor', [
		function () {

			var service = {};

			service.processItem = function processItem(boqItem) {
				if (boqItem.IsCustomProjectCostCode && boqItem.MdcCostCodeFk > 0){
					boqItem.MdcCostCodeFk = boqItem.MdcCostCodeFk * -1;
				}else if (boqItem.IsCustomProjectCostCode && boqItem.MdcCostCodeFk === null && boqItem.ProjectCostCodeFk > 0){
					boqItem.MdcCostCodeFk = boqItem.ProjectCostCodeFk * -1;
				}
			};

			return service;

		}]);
})(angular);
