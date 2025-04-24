/**
 * Created by zov on 5/17/2018.
 */

(function () {
	'use strict';

	var moduleName = 'transportplanning.transport';

	/**
	 * @ngdoc controller
	 * @name transportplanningTransportPlanningBoardController
	 * @requires
	 * @description
	 * #
	 * Controller for transport planning board
	 */
	angular.module(moduleName).controller('transportplanningTransportPlanningBoardController', planningboardController);
	planningboardController.$inject = ['$scope', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'_',
		'resourceRequisitionPlanningBoardServiceFactory', 'resourceMasterPlanningBoardServiceFactory',
		'resourceReservationPlanningBoardServiceFactory', '$injector',
		'resourceReservationPlanningBoardAssignmentMappingService',
		'platformPlanningBoardGridUiConfigService',
		'resourceRequisitionPlanningBoardDemandMappingService'];

	function planningboardController($scope, platformPlanningBoardDataService, calendarUtilitiesService,
		_,
		resourceRequisitionPlanningBoardServiceFactory, resourceMasterPlanningBoardServiceFactory,
		resourceReservationPlanningBoardServiceFactory, $injector,
		resourceReservationPlanningBoardAssignmentMappingService,
		platformPlanningBoardGridUiConfigService,
		resourceRequisitionPlanningBoardDemandMappingService,
		resourceMasterPlanningBoardSupplierMappingService) {

		/*
		 * create resource service
		 */
		var resourceService = resourceMasterPlanningBoardServiceFactory.createResourceService({
			initReadData: function initReadData(readData) {
				readData.ModuleName = moduleName;
			}
		});

		/*
		 * get resource ids
		 */
		var getResourceIdList = function () {
			return _.map(resourceService.getList(), function (resource) {
				return resource.Id;
			});
		};

		/*
		 * create requisition service container
		 */
		var resReqContainer = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function (readData) {
				readData.From = resReqContainer.data.filter.From;
				readData.To = resReqContainer.data.filter.To;
				readData.ResourceIdList = getResourceIdList();
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName
		});

		/*
		 * create reservation service container
		 */
		var resRsvContainer = resourceReservationPlanningBoardServiceFactory.createReservationService({
			initReadData: function (readData) {
				readData.From = resRsvContainer.data.filter.From;
				readData.To = resRsvContainer.data.filter.To;
				readData.ResourceIdList = getResourceIdList();
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			parentService: $injector.get('transportplanningTransportMainService')
		});

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '7ba2304725f04d6e968cee3e55fcd8fc',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '289a279b723847e0a29b3e81f4e8f6f2',
				dataService: resourceService,
				validationService: {},
				mappingService: resourceMasterPlanningBoardSupplierMappingService,
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService')
			},
			assignment: {
				dataService: resRsvContainer.service,
				mappingService: resourceReservationPlanningBoardAssignmentMappingService
			},
			demand: {
				uuid: 'fdbbe7d905e244ad892978d4b8459a85',
				dataService: resReqContainer.service,
				mappingService: resourceRequisitionPlanningBoardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('resourceRequisitionUIStandardService'),
				dragDropService: Object.create($injector.get('ppsMountingPlanningBoardRequisitionClipboardService')),
				dragDropType: 'resourceRequisition'
			}
		}, $scope);
	}
})();

