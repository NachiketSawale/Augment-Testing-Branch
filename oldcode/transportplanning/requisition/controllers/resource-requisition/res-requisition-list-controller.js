/**
 * Created by waz on 11/15/2017.
 */

(function (angular) {
	'use strict';

	var module = 'transportplanning.requisition';

	angular
		.module(module)
		.controller('transportplanningRequisitionResRequisitionListController', TransportplanningRequisitionResRequisitionListController);
	TransportplanningRequisitionResRequisitionListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'resourceRequisitionUIStandardService',
		'productionplanningResourceRequisitionValidationServiceBase',
		'transportplanningRequisitionResRequisitionDataService',
		'transportplanningRequisitionMainService',
		'basicsCommonReferenceControllerService',
		'productionplanningCommonActivityDateshiftService',
		'basicsCommonToolbarExtensionService'];

	function TransportplanningRequisitionResRequisitionListController(
		$scope,
		platformGridControllerService,
		uiStandardService,
		validationService,
		dataService,
		parentService,
		referenceControllerService,
		activityDateshiftService,
		basicsCommonToolbarExtensionService) {

		function createUiService() {
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			if (parentService) {
				_.forEach(columns, function (o) {
					if (o.id === 'projectfk') {
						o.editor = null;
					}
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
					return uiStandardService.getStandardConfigForDetailView();
				}
			};
		}

		var gridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, createUiService(uiStandardService), dataService,
			validationService.getRequisitionValidationService(dataService), gridConfig);

		var initDateshiftConfig = {tools: [{id: 'fullshift', value: true}, {id: 'dateshiftModes', value: 'self', hidden: true}], configId: 'resource.requisition'};
		activityDateshiftService.initializeDateShiftController(module, dataService, $scope, initDateshiftConfig, dataService.dateshiftId);

		referenceControllerService.extendReferenceButtons($scope, dataService);
	}
})(angular);
