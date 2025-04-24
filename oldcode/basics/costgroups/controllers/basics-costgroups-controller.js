/**
 * Created by joshi on 10.12.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.costgroups';
	/**
	 * @ngdoc controller
	 * @name basicsCostGroupsController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.costgroups module
	 **/
	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCostgroupsController',
		['$scope', 'platformTranslateService', 'platformNavBarService','platformMainControllerService', 'basicsCostgroupsTranslationService',
			'platformContextService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService', 'basicsCostGroupCatalogDataService',
			function ($scope, platformTranslateService, platformNavBarService, platformMainControllerService, basicsCostGroupsTranslationService,
					  platformContextService, basicsLookupdataLookupFilterService,
			          basicsLookupdataLookupDescriptorService, basicsCostGroupCatalogDataService) {

				platformTranslateService.registerModule(['cloud.common', moduleName]);

				var opt = {search: true, reports: true, wizards: true, auditTrail: 'd9c90d7e7e6f4c498c07425af42b1178'};
				var mc = {};

				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsCostGroupCatalogDataService, mc, basicsCostGroupsTranslationService, moduleName, opt);

				$scope.$on('$destroy', function () {
					//platformNavBarService.clearActions();
					platformMainControllerService.unregisterCompletely( basicsCostGroupCatalogDataService, sidebarReports, basicsCostGroupsTranslationService, opt);
				});
			}
		]);
})();