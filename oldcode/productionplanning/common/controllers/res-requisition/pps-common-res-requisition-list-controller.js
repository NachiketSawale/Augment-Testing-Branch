(function (angular) {
	'use strict';
	/* globals angular */
	var module = 'productionplanning.common';

	angular.module(module).controller('productionplanningCommonResRequisitionListController', ListController);

	ListController.$inject = [
		'$scope', '$injector',
		'platformGridAPI',
		'platformGridControllerService',
		'resourceRequisitionUIStandardService',
		'productionplanningCommonResRequisitionDataServiceFactory',
		'productionplanningResourceRequisitionValidationServiceBase',
		'basicsCommonReferenceControllerService'];

	function ListController($scope, $injector,
							platformGridAPI,
							platformGridControllerService,
							uiStandardService,
							dataServiceFactory,
							validationService,
							referenceControllerService) {

		var gridConfig = {initCalled: false, columns: []};

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataService = dataServiceFactory.getOrCreateService(serviceOptions);

		var parentService = $injector.get(serviceOptions.parentServiceName);

		function createUiService() {
			$injector.get('resourceRequisitionContainerInformationService'); // trigger the filter registration, like resource-master-filter3.
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			if (parentService) {
				_.forEach(columns, function (o) {
					if (o.id === 'resourcefk') {
						o.editorOptions.lookupOptions.additionalFilters = [{
							getAdditionalEntity: parentService.getSelected,
							siteFk: 'SiteFk'
						}];
					}
				});
			}
			return {
				getStandardConfigForListView: function () {
					return {
						addValidationAutomatically: true,
						columns: columns
					};
				},
				getStandardConfigForDetailView: function () {
					return _.clone(uiStandardService.getStandardConfigForDetailView());
				}
			};
		}

		platformGridControllerService.initListController($scope, createUiService(), dataService, validationService.getRequisitionValidationService(dataService), gridConfig);

		referenceControllerService.extendReferenceButtons($scope, dataService);

	}
})(angular);