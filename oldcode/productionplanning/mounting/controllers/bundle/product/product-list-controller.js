/**
 * Created by waz on 1/11/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingUnassignedBundleProductListController', ProductionplanningMountingUnassignedBundleProductListController);
	ProductionplanningMountingUnassignedBundleProductListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningCommonProductUIStandardService',
		'transportplanningBundleValidationService',
		'productionplanningMountingUnassignedBundleProductDataService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];

	function ProductionplanningMountingUnassignedBundleProductListController($scope, gridControllerService,
		uiStandardService,
		validationService,
		dataService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {

		function createStatisUiService(uiStandardService) {
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			_.forEach(columns, function (o) {
				o.editor = null;
			});
			return {
				getStandardConfigForListView: function () {
					return {
						columns: columns
					};
				}
			};
		}

		var uiService = createStatisUiService(uiStandardService);
		var gridConfig = {initCalled: false, columns: []};

		gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();
	}
})(angular);