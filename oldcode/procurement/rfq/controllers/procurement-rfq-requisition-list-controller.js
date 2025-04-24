(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqRequisitionListController
	 * @requires $scope,platformGridControllerService
	 * @description
	 * #
	 * Controller for rfq requisition container
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqRequisitionListController',
		['$scope', 'platformGridControllerService', 'procurementRfqRequisitionUIStandardService', 'procurementRfqRequisitionService', 'procurementRfqRequisitionValidationService','_','procurementRfqDragDropService',
			function ($scope, platformGridControllerService, columnsService, dataService, validationService,_,procurementRfqDragDropService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'Pid',
					childProp: 'Children',
					enableDraggableGroupBy: false,
					type: 'requisitions',
					dragDropService: procurementRfqDragDropService
				};

				platformGridControllerService.initListController($scope, columnsService, dataService, validationService, myGridConfig);
			}
		]);
})(angular);
