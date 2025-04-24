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
	angular.module(moduleName).controller('logisticDispatchingRecordDetailController', LogisticDispatchingRecordDetailController);

	LogisticDispatchingRecordDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingRecordDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '029196d1c6e54602847114fa1f1ddccd', 'logisticDispatchingTranslationService');
	}

})(angular);