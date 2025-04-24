(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobTaskArticleDataService
	 * @description provides methods to access, create and update logistic job task article entity
	 */
	myModule.factory('logisticJobTaskArticleDataService', LogisticJobTaskArticleDataService);

	LogisticJobTaskArticleDataService.$inject = ['platformRecordArticleDataService'];

	function LogisticJobTaskArticleDataService(platformRecordArticleDataService) {

		return platformRecordArticleDataService.createDataService().service;
	}
})(angular);
