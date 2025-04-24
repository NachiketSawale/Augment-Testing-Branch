/**
 * Created by baf on 30.01.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching record entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingRecordMaterialDetailController', LogisticDispatchingRecordDetailController);

	LogisticDispatchingRecordDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingRecordDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'decede4f457e429fa8b57caf46a44717', 'logisticDispatchingTranslationService');
	}

})(angular);