(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.common';
    var angModule = angular.module(moduleName);


    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('productionplanningCommonHeaderListController', ProductionplanningCommonHeaderListController);

    ProductionplanningCommonHeaderListController.$inject = ['$scope', '$injector', 'platformGridControllerService', 'productionplanningCommonHeaderMainServiceFactory',
        'productionplanningCommonHeaderUIStandardService', 'productionplanningCommonHeaderValidationService',
		'platformGridAPI'];
    function ProductionplanningCommonHeaderListController($scope, $injector, gridControllerService, dataServiceFactory, uiStandardService, validationService,
														  platformGridAPI)
    {
        var gridConfig = {initCalled: false, columns: []};

        // get environment variable from the module-container.json file
        var currentModuleName = $scope.getContentValue('currentModule');
        var parentServiceName = $scope.getContentValue('parentService');

        var foreignKey = $scope.getContentValue('foreignKey');

        var parentService =$injector.get(parentServiceName);

        var dataService = dataServiceFactory.getService(foreignKey,currentModuleName, parentService);

        validationService = validationService.getValidationService(dataService,currentModuleName);
        gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);


		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		}

        platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
    }
})();