/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement  entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementListController', LogisticSettlementListController);

	LogisticSettlementListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f766b788850241e9a338eb411dafbd79');
	}
})(angular);