/**
 * Created by sandu on 17.07.2017.
 */

(function (angular) {

	'use strict';

	const moduleName = 'usermanagement.right';

	/**
	 * @ngdoc service
	 * @name usermanagementRightWizardService
	 * @function
	 *
	 * @description
	 * copy role wizard service
	 */
	angular.module(moduleName).service('usermanagementRightWizardService', usermanagementRightWizardService);

	usermanagementRightWizardService.$inject = ['_', 'globals', '$translate', 'usermanagementRightMainService', 'platformModalService', '$http', '$log','$rootScope', 'usermanagementRightService', 'platformListSelectionDialogService', 'platformDialogService'];

	function usermanagementRightWizardService(_, globals, $translate, usermanagementRightMainService, platformModalService, $http, $log, $rootScope, usermanagementRightService, listSelectionDialogService, platformDialogService) {
		const service = {};

		service.copyRole = function copyRole() {
			const selectedRole = usermanagementRightMainService.getSelected();

			if (selectedRole) {
				processInputDialog(selectedRole);
			} else {
				platformModalService.showErrorBox('usermanagement.right.errorNoSelectionEnter', 'usermanagement.right.errorNoSelection');
			}
		};

		service.assignRights = function (){
			let selectedRoles = usermanagementRightMainService.getSelectedEntities();
			const assignRightsDialogConfig = {
				headerText$tr$: 'usermanagement.right.dialogAssignRight.dialogTitle',
				headerText: 'Assign Rights to Selected Roles',
				bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.right/templates/usermanagement-right-bulk-assign-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButton: false,
				resizeable: true,
				width: 'max',
				height: '600px',
				minWidth: '700px',
				minHeight: '600px',
				buttons: [],
				value: {
					selectedRoles: selectedRoles,
					dialogRole: 'assignment'
				}
			};

			platformDialogService.showDialog(assignRightsDialogConfig);

		};

		service.deleteRights = function (){
			let selectedRoles = usermanagementRightMainService.getSelectedEntities();
			const deleteRightsDialogConfig = {
				headerText$tr$: 'usermanagement.right.dialogDeleteRight.dialogTitle',
				headerText: 'Delete Rights from Selected Roles',
				bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.right/templates/usermanagement-right-bulk-assign-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButton: false,
				resizeable: true,
				width: 'max',
				height: '600px',
				minWidth: '700px',
				minHeight: '600px',
				buttons: [],
				value: {
					selectedRoles: selectedRoles,
					dialogRole: 'delete'
				}
			};

			platformDialogService.showDialog(deleteRightsDialogConfig);

		};

		service.assignCategory = function (){
			let selectedRoles = usermanagementRightMainService.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'basics/customize/frmaccessrolecategory/list').then(function (result){
				const categories = [
					{
						Id: -1,
						Name: 'None (Remove Category)'
					}
				];

				categories.push(...result.data);
				const assignCategoryDialogConfig = {
					headerText$tr$: 'usermanagement.right.dialogAssignCategory.dialogTitle',
					headerText: 'Assign Category to Selected Roles',
					bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.right/templates/usermanagement-right-bulk-assign-category-dialog.html',
					showCancelButton: false,
					showNoButton: false,
					showOkButton: false,
					resizeable: true,
					width: '400px',
					height: '300px',
					minWidth: '400px',
					minHeight: '300px',
					buttons: [],
					value: {
						selectedRoles: selectedRoles,
						categories: categories
					}
				};

				platformDialogService.showDialog(assignCategoryDialogConfig);
			});

		};

		function processInputDialog(selectedRole) {
			$rootScope.userInput = {
				Name: '',
				Description: ''

			};
			const modalOptions = {
				headerTextKey: 'usermanagement.right.copyRoleDialogHeader',
				showCancelButton: true,
				showOkButton: true,
				bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.right/templates/usermanagement-right-copyrole-dialog.html'
			};

			return platformModalService.showDialog(modalOptions).then(function (result) {
				if (result.ok) {
					copySelectedRole(selectedRole, $rootScope.userInput);
				}
			});
		}

		function copySelectedRole(selectedRole, input) {
			const data = {
				RoleId: selectedRole.Id,
				RoleName: input.Name,
				RoleDescription: input.Description
			};

			if(data.RoleName){
				$http.post(globals.webApiBaseUrl + 'usermanagement/main/role/copy/', data).then(function (data) {
					platformModalService.showMsgBox('usermanagement.right.copyRoleInfoSuccessful', 'usermanagement.right.copyRoleInfo', 'info');
					return data.data;
				}, function (error) {
					$log.error(error);
				});
			}else{
				platformModalService.showErrorBox('usermanagement.right.noRoleNameEntered', 'usermanagement.right.noRoleName');
			}
		}
		return service;
	}
})(angular);