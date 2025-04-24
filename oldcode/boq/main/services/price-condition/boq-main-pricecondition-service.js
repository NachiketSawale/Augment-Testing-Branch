/**
 * Created by xia on 5/17/2019.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainPriceconditionService
	 * @function
	 *
	 * @description
	 * boqMainPriceconditionService is the data service for all main related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainPriceconditionService', ['boqMainPriceconditionServiceFactory', 'boqMainService',
		function (priceConditionDataService, boqMainService) {

			var option = {
				parentModuleName: moduleName,
				priceConditionType: 'boq.main.boq',
				headerService: boqMainService,
				serviceName: 'boqMainPriceconditionService'
			};

			var service = priceConditionDataService.createService(boqMainService, option);

			return service;
		}]);
})();