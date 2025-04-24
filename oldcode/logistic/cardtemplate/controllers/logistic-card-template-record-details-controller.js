/**
 * Created by baf on 19.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic cardTemplate record entities.
	 **/
	angular.module(moduleName).controller('logisticCardTemplateRecordDetailController', LogisticCardTemplateRecordDetailController);

	LogisticCardTemplateRecordDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardTemplateRecordDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c392eb6e54564b0da8a27a4e67876ea2');
	}

})(angular);