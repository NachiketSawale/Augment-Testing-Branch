(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemTransportableListController', ppsItemTransportableListController);
	ppsItemTransportableListController.$inject = ['$scope', 'platformGridControllerService',
		'ppsItemTransportableUIStandardService', 'ppsItemTransportableDataService',
		'basicsCommonToolbarExtensionService', '$translate',
		'$timeout', 'transportplanningBundleButtonService'];

	function ppsItemTransportableListController($scope, platformGridControllerService,
															  uiStandardService, dataService,
															  basicsCommonToolbarExtensionService, $translate,
															  $timeout, buttonService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'ParentId',
			childProp: 'Children'
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);
		basicsCommonToolbarExtensionService.insertBefore($scope, [{
			id: 'createTrsRoute',
			caption: $translate.instant('transportplanning.requisition.wizard.wizardCreateTransport'),
			type: 'item',
			iconClass: 'tlb-icons ico-move-day',
			fn: function () {
				dataService.createTransport();
			},
			disabled: function () {
				return !dataService.canSelectedTransport();
			}
		}]);

		function updateTools() {
			if ($scope.tools) {
				$scope.tools.update();
			}
			// Only the grid events call the updateButtons function. This events are out of the
			// digest cycle of angular. Therefor we have to start an new digest.
			$timeout(function () {
				$scope.$apply();
			});
		}

		dataService.registerSelectedEntitiesChanged(updateTools);
		buttonService.extendDocumentButtons($scope, dataService);

		$scope.$on('$destroy', function () {
			dataService.unregisterSelectedEntitiesChanged(updateTools);
		});
	}

})(angular);
