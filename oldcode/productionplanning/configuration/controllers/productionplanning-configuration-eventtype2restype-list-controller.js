(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationEventtype2restypeListController', ListController);

    ListController.$inject = ['$scope', 'platformGridControllerService',
        'productionplanningConfigurationEventtype2restypeDataService',
        'productionplanningConfigurationEventtype2restypeUIStandardService',
		'productionplanningConfigurationEventtype2restypeValidationService',
		'platformGridAPI'];

    function ListController($scope, platformGridControllerService,
                            dataService,
                            uiStandardService,
	                        validationService,
	                        platformGridAPI) {

        var gridConfig = {
            initCalled: false,
            columns: []
        };

        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
    }
})(angular);
