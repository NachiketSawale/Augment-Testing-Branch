/**
 * Created by baf on 19.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateActivityDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic cardTemplate activity entities.
	 **/
	angular.module(moduleName).controller('logisticCardTemplateActivityDetailController', LogisticCardTemplateActivityDetailController);

	LogisticCardTemplateActivityDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardTemplateActivityDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ef003b81dcd2411a8bad42476fb2bf87');
	}

})(angular);