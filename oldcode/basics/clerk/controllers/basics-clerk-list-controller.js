/**
 * Created by baf on 04.09.2014.
 */
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.clerk';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of clerk entities.
	 **/
	angModule.controller('basicsClerkListController', BasicsClerkListController);

	BasicsClerkListController.$inject = [
		'$scope','platformContainerControllerService','platformTranslateService','basicsClerkUIStandardService', 'platformModuleNavigationService',
		'basicsClerkMainService'
	];
	function BasicsClerkListController(
		$scope, platformContainerControllerService, platformTranslateService, basicsClerkUIStandardService, platformModuleNavigationService,
		basicsClerkMainService
	) {

		let toolbarItems = [

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
		platformTranslateService.translateGridConfig(basicsClerkUIStandardService.getStandardConfigForListView().columns);
		platformContainerControllerService.initController($scope, moduleName, 'F01193DF20E34B8D917250AD17A433F1');
		$scope.addTools(toolbarItems);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			sort: 1,
			items: [
				{
					id: 'ac',
					caption: 'basics.clerk.copyClerkGroupTitle',
					type: 'item',
					iconClass: 'tlb-icons ico-copy-group',
					fn: basicsClerkMainService.copyClerkGroup,
				}
			]
		});
	}
})();


