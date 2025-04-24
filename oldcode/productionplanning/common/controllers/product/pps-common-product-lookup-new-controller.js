/**
 * Created by anl on 5/10/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('productionplanningCommonProductLookupNewController', ProductLookupNewController);

	ProductLookupNewController.$inject = ['$scope', '$options',
		'productionPlanningCommonProductLookupNewService',
		'productionplanningCommonProductLookupNewDataService',
		'lookupConverterService',
		'lookupFilterDialogControllerService',
		'$modalInstance'];

	function ProductLookupNewController($scope, $options,
										productLookupNewService,
										productLookupNewDataService,
										lookupConverterService,
										lookupFilterDialogControllerService,
										$modalInstance) {

		var lookupOptions = productLookupNewService.getLookupOptions();
		lookupOptions.dataService = productLookupNewDataService;

		if ($options && $options.beforeInit) {
			$options.beforeInit(lookupOptions);
		}

		lookupConverterService.initialize($scope, lookupOptions);
		lookupFilterDialogControllerService.initFilterDialogController($scope, $modalInstance);

		if ($options && $options.afterInit) {
			$options.afterInit($scope);
		}
	}

})(angular);