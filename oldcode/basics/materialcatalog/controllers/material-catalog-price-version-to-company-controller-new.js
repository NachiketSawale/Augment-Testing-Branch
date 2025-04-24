/**
 * Created by chi on 6/2/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersion2CompanyControllerNew', basicsMaterialCatalogPriceVersion2CompanyController);

	basicsMaterialCatalogPriceVersion2CompanyController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialCatalogPriceVersionToCompanyUIStandardServiceNew',
		'basicsMaterialCatalogPriceVersion2CompanyServiceNew'];

	function basicsMaterialCatalogPriceVersion2CompanyController($scope, platformGridControllerService, basicsMaterialCatalogPriceVersionToCompanyUIStandardService,
		basicsMaterialCatalogPriceVersion2CompanyService) {

		var myGridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'CompanyFk',
			childProp: 'Companies',
			addValidationAutomatically: false,
			cellChangeCallBack: function cellChangeCallBack(arg) {
				basicsMaterialCatalogPriceVersion2CompanyService.fieldChangeCallBack(arg);
			}
		};

		platformGridControllerService.initListController($scope, basicsMaterialCatalogPriceVersionToCompanyUIStandardService, basicsMaterialCatalogPriceVersion2CompanyService, {}, myGridConfig);

		var removeItems = ['create', 'delete', 'createChild'];
		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item && removeItems.indexOf(item.id) === -1;
		});
	}
})(angular);