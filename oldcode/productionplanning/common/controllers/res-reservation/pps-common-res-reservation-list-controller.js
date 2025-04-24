/*global angular*/
(function (angular) {
	'use strict';

	var module = 'productionplanning.common';

	angular.module(module).controller('productionplanningCommonResRequisitionReservationListController', ListController);

	ListController.$inject = [
		'$scope', '$injector',
		'platformGridAPI',
		'platformGridControllerService',
		'platformPermissionService',
		'platformRuntimeDataService',
		'productionplanningCommonResourceReservationUIStandardService',
		'productionplanningCommonResReservationDataServiceFactory',
		'productionplanningActivityResReservationValidationService'];

	function ListController($scope, $injector,
							platformGridAPI,
							platformGridControllerService,
							platformPermissionService,
							platformRuntimeDataService,
							uiStandardService,
							dataServiceFactory,
							validationServiceBase) {

		var gridConfig = {initCalled: false, columns: []};

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataService = dataServiceFactory.getOrCreateService(serviceOptions);

		var validServ = validationServiceBase.getReservationValidationService(dataService);

		var parentService = $injector.get(serviceOptions.parentServiceName);

		function createUiService() {
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			var rows = _.cloneDeep(uiStandardService.getStandardConfigForDetailView().rows);
			if (parentService) {
				_.forEach(columns, function (o) {
					if (o.id === 'resourcefk') {
						o.editorOptions.lookupOptions.additionalFilters = [{
							getAdditionalEntity: parentService.getSelected,
							siteFk: 'SiteFk'
						}];
					}
				});
				_.forEach(rows, function(r){
					if(r.rid === 'resourcefk'){
						r.options.lookupOptions.additionalFilters = [{
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
					return {
						addValidationAutomatically: true,
						fid: 'resource.reservation.detailform',
						groups: _.clone(uiStandardService.getStandardConfigForDetailView().groups),
						rows: rows,
						showGrouping: true,
						version: '1.0.0'
					};
				}
			};
		}


		platformGridControllerService.initListController($scope, createUiService(), dataService, validServ, gridConfig);
		//set custom tools(with permission)
		function setPermission(tool, permission) {
			if (_.isString(tool.permission)) {
				var split = tool.permission.split('#');
				tool.permission = {};
				tool.permission[permission] = platformPermissionService.permissionsFromString(split[1]);
			}
		}

		var tool = {
			id: 'createResWithoutReq',
			caption: 'productionplanning.common.event.addReservationWithRequisition',
			type: 'item',
			iconClass: 'tlb-icons ico-add-extend',
			permission: '#c',
			fn: createRequisitionForReservation,
			disabled: function () {
				return !dataService.canCreate();
			}
		};
		var permission = $scope.getContentValue('permission');
		setPermission(tool, permission);
		$scope.tools.items.unshift(tool);

		function createRequisitionForReservation() {
			if (dataService !== null) {
				dataService.createItem().then(function (newReservation) {
					validServ.validateRequisitionFk(newReservation, 'Force validation pass', 'RequisitionFk');
					dataService.gridRefresh();
				});

			}
		}

	}
})(angular);