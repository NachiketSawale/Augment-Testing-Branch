/**
 * Created by leo on 11.04.2019.
 */
(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordArticleDataService
	 * @description provides methods to access, create and update logistic dispatching record item entity
	 */
	myModule.factory('logisticDispatchingRecordArticleDataService', LogisticDispatchingRecordArticleDataService);

	LogisticDispatchingRecordArticleDataService.$inject = ['platformRecordArticleDataService'];

	function LogisticDispatchingRecordArticleDataService(platformRecordArticleDataService) {

		return platformRecordArticleDataService.createDataService().service;
	}
})(angular);
