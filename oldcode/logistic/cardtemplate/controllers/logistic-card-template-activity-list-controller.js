/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic cardTemplate activity entities.
	 **/

	angular.module(moduleName).controller('logisticCardTemplateActivityListController', LogisticCardTemplateActivityListController);

	LogisticCardTemplateActivityListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardTemplateActivityListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0df6e4b981e146648d61eced666a6619');
	}
})(angular);