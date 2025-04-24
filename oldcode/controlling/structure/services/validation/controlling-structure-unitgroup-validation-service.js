/**
 * Created by janas on 02.12.2014.
 */


(function (angular) {

	'use strict';

	/**
	 * @ngdoc service
	 * @name controllingStructureGroupValidationService
	 * @description provides validation methods for controlling structure group instances
	 */
	angular.module('controlling.structure').factory('controllingStructureUnitgroupValidationService',
		['platformDataValidationService', function (platformDataValidationService) {

			var service = {};

			service.validateControllinggroupFk = function validateControllinggroupFk(entity, value) {
				return !platformDataValidationService.isEmptyProp(value);
			};

			service.validateControllinggroupdetailFk = function validateControllinggroupdetailFk(entity, value) {
				return !platformDataValidationService.isEmptyProp(value);
			};

			return service;
		}]);

})(angular);
