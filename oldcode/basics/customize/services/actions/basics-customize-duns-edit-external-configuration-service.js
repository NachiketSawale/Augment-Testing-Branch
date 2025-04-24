(function () {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	basicsCustomizeModule.service('basicsCustomizeDunsEditExternalConfigurationService',
		BasicsCustomizeEditExternalConfigurationService);

	BasicsCustomizeEditExternalConfigurationService.$inject = ['businessPartnerDunsExternalService'];

	function BasicsCustomizeEditExternalConfigurationService(businessPartnerDunsExternalService) {
		this.showDialog = function showDialog() {
			businessPartnerDunsExternalService.start();
		};
	}
})();