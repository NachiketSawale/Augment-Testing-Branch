/**
 * Created by sandu on 25.08.2015.
 */
(function(angular){

	'use strict';

	var moduleName = 'usermanagement.group';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name usermanagementGroupListController
     * @function
     *
     * @description
     * Controller for the  group list view
     **/
	angModule.controller('usermanagementGroupListController', usermanagementGroupListController);

	usermanagementGroupListController.$inject = ['$scope', 'usermanagementGroupMainService', 'usermanagementGroupDetailLayout', 'usermanagementGroupValidationService','platformGridControllerService','usermanagementGroupImportService' ,'usermanagementGroupSyncService','usermanagementMainAdsConfigService','$timeout','platformGridAPI','platformModuleNavigationService','$window','platformContextService'];

	function usermanagementGroupListController($scope, usermanagementGroupMainService, usermanagementGroupDetailLayout, usermanagementGroupValidationService,platformGridControllerService, usermanagementGroupImportService, usermanagementGroupSyncService, usermanagementMainAdsConfigService, $timeout, platformGridAPI, platformModuleNavigationService,$window,platformContextService){

		var myGridConfig = {initCalled: false, columns: []};

	    var toolbarItems = [
		    {
			    id: 't1',
			    caption: 'usermanagement.group.adButtons.adConfig',
			    type: 'item',
			    cssClass: 'tlb-icons ico-active-directory-config',
			    fn:  function(){
				    usermanagementMainAdsConfigService.showConfig();
			    }
		    },
		    {
			    id: 't2',
			    caption: 'usermanagement.group.adButtons.groupImport',
			    type: 'item',
			    cssClass: 'tlb-icons ico-active-directory-import',
			    fn:  function(){
				    usermanagementGroupImportService.showGroupImport();
			    }
		    },
		    {
			    id: 't3',
			    caption: 'usermanagement.group.adButtons.adDisco',
			    type: 'item',
			    cssClass: 'tlb-icons ico-active-directory-disconnect',
			    fn:  function(){
				    usermanagementGroupMainService.adDisconnect();
				    $scope.tools.update();
			    },
			    disabled: function(){
				    return !usermanagementGroupMainService.hasSelection()|| usermanagementGroupMainService.getSelected().DomainSID === null;
			    }
		    },
		    {
			    id: 't4',
			    caption: 'usermanagement.group.adButtons.groupSync',
			    type: 'item',
			    cssClass: 'tlb-icons ico-active-directory-sync',
			    fn:  function(){
					usermanagementMainAdsConfigService.getLdapParameters().then(function(response){
						var preValidation = response.showPreValidation === 'true';
						if(preValidation){
							usermanagementGroupSyncService.syncGroupsNoPreValidation();
						}else{
							usermanagementGroupSyncService.showGroupSync();
						}
					});
			    }
		    },
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
						iconClass: 'app-small-icons ico-users',
						caption: 'usermanagement.group.users',
						fn: function() {
							//https://rib-w1015.rib-software.com/iTWO4.0/Client/#api?company=901&module=businesspartner.main&ID=1000001
							//$window.open(globals.appBaseUrl + '#api?company='+signedInClientId+'&module=usermanagement.user', '_blank');
							platformModuleNavigationService.navigate({
								moduleName: 'usermanagement.user'});
						}
					}, {
						id: 'roles',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-users',
						caption: 'usermanagement.group.roles',
						fn: function(){
							platformModuleNavigationService.navigate({
								moduleName: 'usermanagement.right'});
						}
					},{
						id: 'clerk',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-clerk',
						caption: 'usermanagement.group.clerk',
						fn: function(){
							platformModuleNavigationService.navigate({
								moduleName: 'basics.clerk'});
						}
					},{
						id: 'company',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-company-structure',
						caption: 'usermanagement.group.company',
						fn: function(){
							platformModuleNavigationService.navigate({
								moduleName: 'basics.company'});
						}
					},{
						id: 'customizing',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-settings',
						caption: 'usermanagement.group.customizing',
						fn: function(){
							platformModuleNavigationService.navigate({
								moduleName: 'basics.customize'});
						}
					}]
				}
			}
	    ];

		platformGridControllerService.initListController($scope, usermanagementGroupDetailLayout, usermanagementGroupMainService,
			usermanagementGroupValidationService, myGridConfig);
	    platformGridControllerService.addTools(toolbarItems);

	    var updateTools = function () {
		    $timeout($scope.tools.update, 0, true);
	    };

	    platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);

	    $scope.$on('$destroy', function () {
		    platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateTools);
	    });
	}
})(angular);