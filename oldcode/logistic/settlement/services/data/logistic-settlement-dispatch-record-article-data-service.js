(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementDispatchRecordArticleDataService
	 * @description provides methods to access, create and update logistic job task article entity
	 */
	myModule.factory('logisticSettlementDispatchRecordArticleDataService', LogisticSettlementDispatchRecordArticleDataService);

	LogisticSettlementDispatchRecordArticleDataService.$inject = ['platformRecordArticleDataService'];

	function LogisticSettlementDispatchRecordArticleDataService(platformRecordArticleDataService) {

		return platformRecordArticleDataService.createDataService().service;
	}
})(angular);