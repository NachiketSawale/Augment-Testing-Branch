(function () {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	basicsCustomizeModule.service('basicsCustomizeEditExternalConfigurationService', BasicsCustomizeEditExternalConfigurationService);

	BasicsCustomizeEditExternalConfigurationService.$inject = ['boqMainCrbLicenseService'];

	function BasicsCustomizeEditExternalConfigurationService(boqMainCrbLicenseService) {
		this.showDialog = function showDialog() {
			boqMainCrbLicenseService.start();
		};
	}
})();
