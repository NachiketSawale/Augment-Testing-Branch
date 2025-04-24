(function () {

	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc controller
	 * @name basicsCustomizeTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the entity types
	 **/
	angular.module(moduleName).controller('basicsCustomizeTypeListController',
		['$scope', 'platformGridControllerService', 'basicsCustomizeTypeDataService', 'basicsCustomizeConfigurationService', 'platformModuleNavigationService', 'basicsCustomizeEmailServerConfigurationService',
			function ($scope, platformGridControllerService, basicsCustomizeTypeDataService, basicsCustomizeConfigurationService, platformModuleNavigationService, basicsCustomizeEmailServerConfigurationService) {

				var toolbarItems = [

					{
						caption: 'usermanagement.user.goto',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-goto',
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: [{
								id: 'users',
								type: 'item',
								disabled: false,
								caption: 'usermanagement.right.users',
								iconClass: 'app-small-icons ico-users',
								fn: function () {
									platformModuleNavigationService.navigate({
										moduleName: 'usermanagement.user'
									});
								}
							}, {
								id: 'groups',
								type: 'item',
								disabled: false,
								iconClass: 'app-small-icons ico-groups',
								caption: 'usermanagement.right.groups',
								fn: function () {
									platformModuleNavigationService.navigate({
										moduleName: 'usermanagement.group'
									});
								}
							}, {
								id: 'roles',
								type: 'item',
								disabled: false,
								iconClass: 'app-small-icons ico-users',
								caption: 'usermanagement.user.roles',
								fn: function(){
									platformModuleNavigationService.navigate({
										moduleName: 'usermanagement.right'
									});
								}
							}, {
								id: 'clerk',
								type: 'item',
								disabled: false,
								iconClass: 'app-small-icons ico-clerk',
								caption: 'usermanagement.right.clerk',
								fn: function () {
									platformModuleNavigationService.navigate({
										moduleName: 'basics.clerk'
									});
								}
							}, {
								id: 'company',
								type: 'item',
								disabled: false,
								iconClass: 'app-small-icons ico-company-structure',
								caption: 'usermanagement.right.company',
								fn: function () {
									platformModuleNavigationService.navigate({
										moduleName: 'basics.company'
									});
								}
							}]
						}
					}
				];

				var myGridConfig = { initCalled: false, columns: [] };

				platformGridControllerService.initListController($scope, basicsCustomizeConfigurationService, basicsCustomizeTypeDataService, null, myGridConfig);
				platformGridControllerService.addTools(toolbarItems);
			}
		]);
})();
