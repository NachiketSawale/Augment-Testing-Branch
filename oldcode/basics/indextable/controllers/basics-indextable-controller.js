/**
 * Created by xia on 5/8/2019.
 */
(function () {
	'use strict';

	let moduleName = 'basics.indextable';

	angular.module(moduleName).controller('basicsIndextableController', BasicsIndexTableController);

	BasicsIndexTableController.$inject = ['$scope', 'platformMainControllerService', 'basicsIndexHeaderService',
		'basicsIndextableTranslationService'];

	function BasicsIndexTableController($scope, platformMainControllerService, basicsIndexHeaderService, basicsIndextableTranslationService) {

		let options = {search: true, reports: false, auditTrail: 'a0b5cea0981f4424a2d779d2b985d3a8'};

		let sidebarReports = platformMainControllerService.registerCompletely($scope, basicsIndexHeaderService,
			{}, basicsIndextableTranslationService, moduleName, options);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(basicsIndexHeaderService, sidebarReports, basicsIndextableTranslationService, options);
		});
	}
})();
