/**
 * Created by zwz on 7/15/2019.
 */
(function (angular) {
	'use strict';

	var module = 'productionplanning.common';

	angular.module(module).controller('productionplanningCommonProductParamNewListController', ListController);

	ListController.$inject = [
		'$scope', '$injector',
		'platformGridAPI',
		'platformGridControllerService',
		'productionplanningCommonProductParamUIStandardService',
		'productionplanningCommonProductParamDataServiceFactory',
		'productionplanningCommonProductParamValidationServiceFactory'];

	function ListController($scope, $injector,
							platformGridAPI,
							platformGridControllerService,
							uiStandardService,
							dataServiceFactory,
							validationService) {

		var gridConfig = {initCalled: false, columns: []};

		var serviceOptions = $scope.getContentValue('serviceOptions');// get serviceOptions from the module-container.json file

		var dataService = dataServiceFactory.getOrCreateService(serviceOptions);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService.getService({'dataService': dataService}), gridConfig);

	}
})(angular);