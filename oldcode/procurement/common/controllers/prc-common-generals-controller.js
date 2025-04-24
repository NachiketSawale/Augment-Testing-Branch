(function (angular) {
	'use strict';

	angular.module('procurement.common').controller('procurementCommonGeneralsListController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonGeneralsDataService',
			'procurementCommonGeneralsValidationService', 'procurementCommonGeneralsUIStandardService',
			'procurementCommonHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, moduleContext, gridControllerService, dataServiceFactory, validationService,
				gridColumns, procurementCommonHelperService) {

				var gridConfig = {initCalled: false, columns: []},
					dataService = dataServiceFactory.getService(moduleContext.getMainService());

				var generalItemService = dataServiceFactory.getService();

				function updateTools() {
					$scope.tools.update();
				}

				if (generalItemService.updateToolsEvent) {
					generalItemService.updateToolsEvent.register(updateTools);
				}

				validationService = validationService(dataService);
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				generalItemService.setToolItems($scope.tools.items);
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
					if (generalItemService.updateToolsEvent) {
						generalItemService.updateToolsEvent.unregister(updateTools);
					}
				});
			}]
	);

})(angular);