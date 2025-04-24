/**
 * Created by baf on 19.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic cardTemplate cardTemplate entities.
	 **/
	angular.module(moduleName).controller('logisticCardTemplateDetailController', LogisticCardTemplateDetailController);

	LogisticCardTemplateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardTemplateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '29cad0ea85ce4611b194e118fb0c350f');
	}

})(angular);