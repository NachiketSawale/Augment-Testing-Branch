(function () {
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).constant('procurementCopyMode', {
		NoRestrictions: 1,
		CurrentPackageOnly: 2,
		OnlyAllowedCatalogs: 3,
		NoRestrictions4StandardUser: 4
	});
})();