(function () {
	'use strict';
	const moduleName = 'basics.customize';
	let basicsCustomizeModule = angular.module(moduleName);

	basicsCustomizeModule.service('basicsCustomizeCostGroupConfigurationService', BasicsCustomizeCostGroupConfigurationService);

	BasicsCustomizeCostGroupConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeCostGroupConfigurationService($injector) {
		this.showDialog = function showDialog(selected) {
			let confServ = $injector.get('projectMainCostGroupCatalogConfigurationService');
			let instServ = $injector.get('basicsCustomizeInstanceDataService');

			confServ.editCustomizeCostGroupConfiguration(selected, instServ);
		};
	}
})();
