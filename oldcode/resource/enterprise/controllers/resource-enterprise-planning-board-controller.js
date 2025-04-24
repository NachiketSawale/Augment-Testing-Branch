(function () {
	'use strict';

	var moduleName = 'resource.enterprise';

	angular.module(moduleName).controller('resourceEnterprisePlanningBoardController', ResourceEnterprisePlanningBoardController);

	ResourceEnterprisePlanningBoardController.$inject = ['$scope','moment','_', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'resourceEnterprisePlanningBoardResourceService', 'resourceEnterprisePlanningBoardRequisitionService', 'resourceEnterprisePlanningBoardReservationService',
		'resourceReservationPlanningBoardClipboardService', 'platformPlanningBoardGridUiConfigService', 'resourceRequisitionPlanningBoardDemandMappingService',
		'resourceReservationPlanningBoardAssignmentMappingService', 'resourceMasterPlanningBoardSupplierMappingService','resourceMasterPlanningBoardCustomConfigFactory', 'resourceCommonNavigationService'];

	function ResourceEnterprisePlanningBoardController($scope,moment, _, platformPlanningBoardDataService, calendarUtilitiesService,
		resourceEnterprisePlanningBoardResourceService, resourceEnterprisePlanningBoardRequisitionService, resourceEnterprisePlanningBoardReservationService,
		resourceReservationPlanningBoardClipboardService, platformPlanningBoardGridUiConfigService, resourceRequisitionPlanningBoardDemandMappingService,
		resourceReservationPlanningBoardAssignmentMappingService, resourceMasterPlanningBoardSupplierMappingService, resourceMasterPlanningBoardCustomConfigFactory, resourceCommonNavigationService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: 'f36034eeab0b465da740bc58f683b40d',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: 'be2f6945273a4c20aa20125bc5d1a60d',
				dataService: resourceEnterprisePlanningBoardResourceService,
				validationService: {},
				mappingService: resourceMasterPlanningBoardSupplierMappingService,
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService'),
				customSupplierConfig: resourceMasterPlanningBoardCustomConfigFactory.getConfig({uuid: 'f36034eeab0b465da740bc58f683b40d'}).validOnDueDateConfig(),
			},
			assignment: {
				uuid: '5113537befba4d0cb2d4d874f6b0bbc5',
				dataService: resourceEnterprisePlanningBoardReservationService,
				mappingService: resourceReservationPlanningBoardAssignmentMappingService
			},
			demand: {
				uuid: 'f057307eb3ac4ec18a27196bb5093fe1',
				dataService: resourceEnterprisePlanningBoardRequisitionService,
				mappingService: resourceRequisitionPlanningBoardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('resourceRequisitionUIStandardService'),
				dragDropService: resourceReservationPlanningBoardClipboardService,
				dragDropType: 'resourceRequisition'
			},
			toolbarConfig: {
				customTools: function () {
					const isFullyCoveredTools = resourceReservationPlanningBoardAssignmentMappingService.getCustomTools(resourceEnterprisePlanningBoardReservationService);
					const gotoDropdown = resourceCommonNavigationService.createNavigationItem();

					return new Promise((resolve, reject) => {
						const result = [
							...isFullyCoveredTools,
							gotoDropdown,
						];
						resolve(result);
					});
				}
			}
			/*
			toolbarConfig: {
				customTools: resourceReservationPlanningBoardAssignmentMappingService.getCustomTools(resourceEnterprisePlanningBoardReservationService)
			}
			 */

		}, $scope);

		function getUpdateNavigationButtonFunc(planningBoardSource) {
			return function () {
				resourceCommonNavigationService.updateNavigationItem(
					planningBoardSource,
					resourceEnterprisePlanningBoardResourceService,
					resourceEnterprisePlanningBoardReservationService,
					resourceEnterprisePlanningBoardRequisitionService
				);
			};
		}

		const supplierSelectionChangedFunc = getUpdateNavigationButtonFunc('supplier');
		const assignmentSelectionChangedFunc = getUpdateNavigationButtonFunc('assignment');
		const demandSelectionChangedFunc = getUpdateNavigationButtonFunc('demand');

		let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID('f36034eeab0b465da740bc58f683b40d');
		function onSettingChanged() {
			resourceEnterprisePlanningBoardRequisitionService.updateIsFullyCoveredSettings();
		}

		planningBoardDataService.registerOnSettingsChanged(onSettingChanged);

		resourceEnterprisePlanningBoardResourceService.registerSelectionChanged(supplierSelectionChangedFunc);
		resourceEnterprisePlanningBoardReservationService.registerSelectionChanged(assignmentSelectionChangedFunc);
		resourceEnterprisePlanningBoardRequisitionService.registerSelectionChanged(demandSelectionChangedFunc);

		$scope.$on('$destroy', function () {
			planningBoardDataService.unregisterOnSettingsChanged(onSettingChanged);
			resourceEnterprisePlanningBoardResourceService.unregisterSelectionChanged(supplierSelectionChangedFunc);
			resourceEnterprisePlanningBoardReservationService.unregisterSelectionChanged(assignmentSelectionChangedFunc);
			resourceEnterprisePlanningBoardRequisitionService.unregisterSelectionChanged(demandSelectionChangedFunc);
		});
	}
})();
