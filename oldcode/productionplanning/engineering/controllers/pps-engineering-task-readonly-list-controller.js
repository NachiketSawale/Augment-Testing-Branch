/**
 * Created by zwz on 9/20/2019.
 */
(function (angular) {
	'use strict';
	/* globals angular */
	var module = 'productionplanning.engineering';

	angular.module(module).controller('productionplanningEngineeringTaskReadonlyListController', ListController);

	ListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'productionplanningEngineeringTaskUIStandardService',
		'productionplanningEngineeringTaskReadonlyDataServiceFactory'];

	function ListController($scope,
							platformGridControllerService,
							uiStandardService,
							dataServiceFactory) {

		var gridConfig = {initCalled: false, columns: []};

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataService = dataServiceFactory.getService(serviceOptions);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, null, gridConfig);
	}
})(angular);