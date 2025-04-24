/**
 * Created by Shankar on 04.04.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteSettledListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatching note settled entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchingNoteSettledListController', LogisticDispatchingNoteSettledListController);

	LogisticDispatchingNoteSettledListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingNoteSettledListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e71d60628bda47aa87290aa609fbd1ef');
	}
})(angular);