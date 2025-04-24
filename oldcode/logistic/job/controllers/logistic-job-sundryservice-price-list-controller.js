/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobSundryServicePriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job sundry service price entities.
	 **/

	angular.module(moduleName).controller('logisticJobSundryServicePriceListController', LogisticJobSundryServicePriceListController);

	LogisticJobSundryServicePriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobSundryServicePriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd7891ba1840c4b82959112b06d70afab');
	}
})(angular);