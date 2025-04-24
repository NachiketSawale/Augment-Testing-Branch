/**
 * Created by anl on 6/28/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemSplitConfigurationController', Controller);
	Controller.$inject = [
		'$scope',
		'productionplanningItemSplitConfigurationService'];

	function Controller(
		$scope,
		itemSplitConfigurationService) {

		itemSplitConfigurationService.init($scope);

		itemSplitConfigurationService.registerFilters();

		$scope.$on('$destroy', function () {
			itemSplitConfigurationService.unregisterFilters();
		});
	}
})(angular);