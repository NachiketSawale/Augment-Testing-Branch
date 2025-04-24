/**
 * Created by baf on 18.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic card record entities.
	 **/
	angular.module(moduleName).controller('logisticCardRecordDetailController', LogisticCardRecordDetailController);

	LogisticCardRecordDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardRecordDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '35eb529cbbc04fbaac20073663522425');
	}

})(angular);