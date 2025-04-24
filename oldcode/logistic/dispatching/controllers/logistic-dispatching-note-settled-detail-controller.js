/**
 * Created by Shankar on 04.04.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteSettledDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching note settled entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingNoteSettledDetailController', LogisticDispatchingNoteSettledDetailController);

	LogisticDispatchingNoteSettledDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingNoteSettledDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c08a0c8e08f24cd2bc8db520d277e4dc');
	}

})(angular);