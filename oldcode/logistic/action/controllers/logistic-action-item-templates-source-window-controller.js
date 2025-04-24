/**
 * Created by Shankar on 21.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionItemTemplatesSourceWindowController
	 * @function
	 *
	 * @description
	 * Controller for the source window of logistic Action Item Templates by Types
	 **/

	angular.module(moduleName).controller('logisticActionItemTemplatesSourceWindowController', LogisticActionItemTemplatesSourceWindowController);

	LogisticActionItemTemplatesSourceWindowController.$inject = ['$scope', 'logisticActionItemTemplateSourceWindowControllerService'];

	function LogisticActionItemTemplatesSourceWindowController($scope, logisticActionItemTemplateSourceWindowControllerService) {
		var uuid = $scope.getContainerUUID();
		logisticActionItemTemplateSourceWindowControllerService.initSourceFilterController($scope, uuid);
	}
})(angular);