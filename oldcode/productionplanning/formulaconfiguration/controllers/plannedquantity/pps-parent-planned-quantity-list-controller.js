(function () {
	/* global angular, _ */
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('ppsParentPlannedQuantityListController', PpsParentPlannedQuantityListController);
	PpsParentPlannedQuantityListController.$inject = ['$scope', 'platformGridAPI', 'platformGridControllerService', 'ppsParentPlannedQuantityUIStandardService', 'ppsPlannedQuantityDataServiceFactory','ppsPlannedQuantityValidationServiceFactory'];
	function PpsParentPlannedQuantityListController($scope, platformGridAPI, platformGridControllerService, uiStandardService, dataServiceFactory, validationServiceFactory) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			useFilter: true
		};
		var serviceOpt = $scope.getContentValue('serviceOption');
		var dataService = dataServiceFactory.getService(serviceOpt);
		var validationService = validationServiceFactory.getService(dataService);
		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		uiStandardService.handerRowChanged(dataService);
		// register cell changed
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataService.onPropertyChanged(args.item, field);
		};

		function onSelectedChanged(e, item) {
			if (item) {
				var plannedQty = dataServiceFactory.getService({serviceName:'productionplanning.header.plannedQuantity', parentService: 'productionplanningHeaderDataService', parentFilter:'PpsHeaderFk'});
				plannedQty.setSelected(item);
			}
		}

		var onReloadData = function (updateData){
			var  needReload = false;
			var oldItems = dataService.getList();

			if(updateData.EntitiesCount > 0 && !_.isNil(updateData.PpsPlannedQuantityToSave) && updateData.PpsPlannedQuantityToSave.length > 0){
				var hadAdd = _.find(updateData.PpsPlannedQuantityToSave, function (item){
					return _.isNil(item.PlannedQuantityFk) && _.findIndex(oldItems, {'Id': item.Id}) < 0;
				});
				needReload = hadAdd? true : false;
			}
			if(updateData.EntitiesCount > 0 && !_.isNil(updateData.PpsPlannedQuantityToDelete) && updateData.PpsPlannedQuantityToDelete.length > 0) {
				var hadDel = _.find(updateData.PpsPlannedQuantityToDelete, function (item){
					return _.isNil(item.PlannedQuantityFk) && _.findIndex(oldItems, {'Id': item.Id}) > 0;
				});
				needReload = hadDel? true : false;
			}

			if(needReload === true){
				dataService.load();
			}
		};

		var rootService = dataService;
		while(rootService.parentService() !== null) {
			rootService = rootService.parentService();
		}
		rootService.registerUpdateDone(onReloadData);


		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		dataService.registerSelectionChanged(onSelectedChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			dataService.unregisterSelectionChanged(onSelectedChanged);
			rootService.unregisterUpdateDone(onReloadData);
		});
	}
})();