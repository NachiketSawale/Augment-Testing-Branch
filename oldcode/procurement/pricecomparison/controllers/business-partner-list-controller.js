/**
 * Created by jes on 3/24/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonBusinessPartnerListController', businessPartnerListController);

	businessPartnerListController.$inject = [
		'_',
		'$scope',
		'platformGridControllerService',
		'procurementPriceComparisonBusinessPartnerDataService',
		'businessPartnerMainBusinessPartnerUIStandardService'
	];

	function businessPartnerListController(
		_,
		$scope,
		platformGridControllerService,
		procurementPriceComparisonBusinessPartnerDataService,
		businessPartnerMainBusinessPartnerUIStandardService
	) {

		// workaround to make everything in this container readonly
		var uiStandardService = {
			getStandardConfigForListView: function () {
				var listConfig = _.cloneDeep(businessPartnerMainBusinessPartnerUIStandardService.getStandardConfigForListView());
				_.forEach(listConfig.columns, function (column) {
					column.editor = null;
				});
				return listConfig;
			},
			getStandardConfigForDetailView: angular.noop,
			getDtoScheme: businessPartnerMainBusinessPartnerUIStandardService.getDtoScheme
		};

		platformGridControllerService.initListController($scope, uiStandardService, procurementPriceComparisonBusinessPartnerDataService, {}, {});
	}

})(angular);