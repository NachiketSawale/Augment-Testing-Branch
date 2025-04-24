(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementDispatchRecordDataService
	 * @description provides methods to access, create and update logistic job task article entity
	 */
	myModule.factory('logisticSettlementDispatchRecordDataService', LogisticSettlementDispatchRecordDataService);

	LogisticSettlementDispatchRecordDataService.$inject = ['platformRecordArticleDataService'];

	function LogisticSettlementDispatchRecordDataService(platformRecordArticleDataService) {

		return platformRecordArticleDataService.createDataService().service;
	}
})(angular);