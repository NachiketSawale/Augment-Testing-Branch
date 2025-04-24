/**
 * Created by zwz on 01/06/2023.
 */

(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningActualTimeRecordingWizardStep2ProductAssignmentService', Service);
	Service.$inject = ['$http', '$injector', '$q', '$translate', 'platformTranslateService', 'platformGridAPI',
		'platformModalService',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingDynamicConfigurationServiceFactory',
		'ppsActualTimeRecordingActionColumnServiceFactory',
		'ppsActualTimeRecordingAreaDataService',
		'ppsActualTimeRecordingProductAssignmentDataService',
		'ppsActualTimeRecordingTimeAssignmentDataService'];

	function Service($http, $injector, $q, $translate, platformTranslateService, platformGridAPI,
		platformModalService,
		uiServiceFactory,
		constantValues,
		dynamicConfigurationServiceFactory,
		actionColumnServiceFactory,
		dataService,
		prodctAssignmentDataService,
		assignmentDataService) {

		let service = {};


		service.initial = function initial($scope) {
			// init area grid of step2 advanced. temporary code ,to be refactored in the future
			const uiService = uiServiceFactory.getService(constantValues.area2);
			const dynamicConfigurationService = dynamicConfigurationServiceFactory.getService('78eefacac8424e70bfb230c3e830f4c3', uiService);
			const columnService = actionColumnServiceFactory.getService('78eefacac8424e70bfb230c3e830f4c3', dynamicConfigurationService, assignmentDataService.actionColFieldGeneratorFn);
			const actions = assignmentDataService.getActions();
			columnService.appendActionCols(actions);

		};

		service.isValid = function () {
			return angular.isFunction(service.isLoading) && !service.isLoading();
		};

		service.active = function (){
			// resize grid of area/product container for fixing issue about becoming "empty" when clicking "previous" and "next" button
			setTimeout(function () {
				platformGridAPI.grids.resize('78eefacac8424e70bfb230c3e830f4c3');
				platformGridAPI.grids.resize('c2604409c00442fcae74b8d8f7be843a');
			}, 200);
		};

		service.unActive = function () {
			let defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.getResult = function (){
			// return completeDto to save
			return {
				// ActualTimeReportToSave
				ActionAssignmentToSave: prodctAssignmentDataService.getActions(),
				CorrectionToSave: prodctAssignmentDataService.getModifiedCorrections()
			};
		};

		service.doUpdate = function doUpdate() {
			return prodctAssignmentDataService.update();
		};

		service.showUpdatedDialog = function showUpdatedDialog() {
			platformModalService.showDialog({
				headerTextKey: $translate.instant('productionplanning.item.wizard.actualTimeRecording.prodAssgnStepTitle'),
				bodyTextKey: $translate.instant('productionplanning.item.wizard.actualTimeRecording.finishProdAssgnUpdate'),
				iconClass: 'info'
			});
		};

		service.apply = function () {
			service.setLoadingStatus(true);
			return prodctAssignmentDataService.update().then(() => {
				service.setLoadingStatus(false);
				service.showUpdatedDialog();
			});
		};

		service.isDisabled = prodctAssignmentDataService.isDisabled;

		service.canApply = function () {
			// return true; // at the moment, always true. will check if really needs to update to DB on server side
			return angular.isFunction(service.isLoading) && !service.isLoading() && !service.isDisabled();
		};

		return service;
	}

})(angular);
