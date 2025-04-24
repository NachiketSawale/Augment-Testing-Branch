(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningConfigurationEventTypeSlotListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService', 'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningConfigurationEventTypeSlotDataService',
		'productionplanningConfigurationEventTypeSlotUIStandardService',
		'productionplanningConfigurationEventTypeSlotValidationService',
		'ppsEntityConstant'];

	function ListController($scope, platformGridControllerService, platformGridAPI,
	                        basicsLookupdataLookupDescriptorService,
	                        dataService,
	                        uiStandardService,
	                        validationService,
	                        ppsEntityConstant) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'EventTypeSlotList'
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onCellChange(e, args) {
			const col = args.grid.getColumns()[args.cell].field;
			// set Show On(PpsEntityFk) to PPS Product if Source(PpsEntityRefFk) is PPS Product.
			if (col === 'PpsEntityRefFk' && (args.item.PpsEntityRefFk === ppsEntityConstant.PPSProduct || args.item.PpsEntityRefFk === ppsEntityConstant.FabricationUnit)) {
				args.item.PpsEntityFk = ppsEntityConstant.PPSProduct;
				if (args.item.PpsEntityRefFk === ppsEntityConstant.FabricationUnit && !_.isNil(args.item.PpsEventTypeFk)) {
					const type = basicsLookupdataLookupDescriptorService.getLookupItem('EventType', args.item.PpsEventTypeFk);
					if (type.PpsEntityFk !== ppsEntityConstant.PPSProduct) {
						args.item.PpsEventTypeFk = null;
					}
				}
				platformGridAPI.grids.refresh($scope.gridId, true);
			}
		}

		$scope.$on('$destroy', () => {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);