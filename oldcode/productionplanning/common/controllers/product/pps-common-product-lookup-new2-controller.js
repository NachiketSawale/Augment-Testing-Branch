/**
 * Created by anl on 10/16/2023.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('productionplanningCommonProductLookupNew2Controller', ProductLookupNew2Controller);

	ProductLookupNew2Controller.$inject = [
		'$scope', '$options',
		'productionPlanningCommonProductLookupNew2Service',
		'productionplanningCommonProductLookupNewDataService',
		'lookupConverterService',
		'lookupFilterDialogControllerService',
		'$modalInstance'];

	function ProductLookupNew2Controller(
		$scope, $options,
		productLookupNewService,
		productLookupNewDataService,
		lookupConverterService,
		lookupFilterDialogControllerService,
		$modalInstance) {

		var lookupOptions = productLookupNewService.getLookupOptions($scope);
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