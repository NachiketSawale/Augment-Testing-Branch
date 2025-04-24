/**
 * Created by leo on 12.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobSundryServicePriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job sundry service  entities.
	 **/
	angular.module(moduleName).controller('logisticJobSundryServicePriceDetailController', LogisticJobSundryServicePriceDetailController);

	LogisticJobSundryServicePriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobSundryServicePriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0d5b4fcb1a204c9ab52e75bec5561bde', 'logisticJobTranslationService');
	}

})(angular);