(function (angular) {
	'use strict';

	/**
	 * @name productionplanningProductionsetListController
	 * @function
	 *
	 * */

	var moduleName = 'productionplanning.productionset';
	var ProductionsetModul = angular.module(moduleName);

	ProductionsetModul.controller('productionplanningProductionsetListController', ProductionsetListController);
	ProductionsetListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI', 'productionplanningProductionsetMainService',
		'$injector', 'ppsCommonLoggingHelper','basicsCommonToolbarExtensionService','productionplanningProductionsetGobacktoBtnsExtension'];

	function ProductionsetListController($scope, platformContainerControllerService,
	                                     platformGridAPI, dataService,
	                                     $injector, ppsCommonLoggingHelper,basicsCommonToolbarExtensionService, gobacktoBtnsExtension) {

		platformContainerControllerService.initController($scope, moduleName, '2581963f63944bdca59bec07f539cafb');

		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataService));

		// button for create log
		var schemaOption = {
			typeName: 'ProductionsetDto',
			moduleSubModule: 'ProductionPlanning.ProductionSet'
		};
		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 15, $injector.get('productionplanningProductionsetUIStandardService'),
			dataService, schemaOption, $injector.get('productionplanningProductionsetTranslationService'));

		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataService.onEntityPropertyChanged(args.item, field);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
	}


})(angular);