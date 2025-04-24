/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic cardTemplate cardTemplate entities.
	 **/

	angular.module(moduleName).controller('logisticCardTemplateListController', LogisticCardTemplateListController);

	LogisticCardTemplateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardTemplateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e0fffc91d92b4bdda85c9f39679f417c');
	}
})(angular);