/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyTreeController', BasicsCompanyTreeController);

	BasicsCompanyTreeController.$inject = ['$scope','platformContainerControllerService','platformTranslateService','basicsCompanyUIStandardService', 'platformModuleNavigationService'];
	function BasicsCompanyTreeController($scope, platformContainerControllerService, platformTranslateService, basicsCompanyUIStandardService, platformModuleNavigationService) {

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
						id: 'customizing',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-settings',
						caption: 'usermanagement.right.customizing',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'basics.customize'
							});
						}
					}]
				}
			}
		];

		platformTranslateService.translateGridConfig(basicsCompanyUIStandardService.getStandardConfigForListView().columns);
		platformContainerControllerService.initController($scope, moduleName, '50593FEEA9FE4280B36F72E27C8DFDA1');

		$scope.addTools(toolbarItems);
	}
})();