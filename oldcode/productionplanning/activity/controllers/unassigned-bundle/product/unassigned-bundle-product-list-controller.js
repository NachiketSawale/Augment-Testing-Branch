/**
 * Created by anl on 2/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityUnassignedBundleProductListController', ProductionplanningMountingUnassignedBundleProductListController);
	ProductionplanningMountingUnassignedBundleProductListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningCommonProductUIStandardService',
		'transportplanningBundleValidationService',
		'productionplanningActivityUnassignedBundleProductDataService',
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