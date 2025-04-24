/**
 * Created by anl on 8/19/2020.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemGroupCreationController', GroupCreationController);

	GroupCreationController.$inject = [
		'$scope',
		'productionplanningItemGroupCreationService'];

	function GroupCreationController(
		$scope,
		groupCreationService) {

		groupCreationService.initialize($scope);

	}

})(angular);