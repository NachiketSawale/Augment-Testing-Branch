/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateRecordListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic cardTemplate record entities.
	 **/

	angular.module(moduleName).controller('logisticCardTemplateRecordListController', LogisticCardTemplateRecordListController);

	LogisticCardTemplateRecordListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardTemplateRecordListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8614a7a865cb43628c4056226bf5ca52');
	}
})(angular);