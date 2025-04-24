(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'basics.site';
	angular.module(moduleName).controller('basicSite2ClerkListController', [
		'$scope', 'platformGridControllerService',
		'basSiteClerkDataService',
		'basSiteClerkUIService',
		'basSiteClerkValidationService',
		function ($scope, platformGridControllerService,
		          dataServ,
		          uiStandardServ,
		          validationServ) {
			var gridConfig = {initCalled: false, columns: []};
			platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);
		}
	]);
})();