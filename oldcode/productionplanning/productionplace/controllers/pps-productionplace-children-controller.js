(function () {
	'use strict';
	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).controller('ppsProdPlaceChildrenController', [
		'$scope',
		'platformGridControllerService',
		'ppsProductionPlaceDataServiceFactory',
		'ppsProductionPlaceChildrenUIService',
		'ppsProductionPlaceChildrenDataServiceFactory',
		'ppsProductionPlaceChildrenValidationServiceFactory',
		function ($scope,
			platformGridControllerService,
			prodPlaceDataServiceFactory,
			prodPlaceChildrenUIService,
			prodPlaceChildrenDataServiceFactory,
			prodPlaceChildrenValidationServiceFactory) {
			const parentServiceOptions = $scope.getContentValue('parentServiceOptions');
			const parentService = prodPlaceDataServiceFactory.getService(parentServiceOptions);
			const dataService = prodPlaceChildrenDataServiceFactory.getByParentService(parentService);
			const gridConfig = {
				initCalled: false,
				columns: [],
				sortOptions: {initialSortColumn: {field: 'Timestamp', id: 'timestamp'}, isAsc: false},
			};
			const validationService = prodPlaceChildrenValidationServiceFactory.getValidationService(dataService);
			platformGridControllerService.initListController($scope, prodPlaceChildrenUIService, dataService, validationService, gridConfig);
		}
	]);
})();