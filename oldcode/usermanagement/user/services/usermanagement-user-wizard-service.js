/**
 * Created by aljami on 25,04,2022
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementWizardService
	 * @function
	 *
	 * @description
	 * wizard service
	 */
	angular.module(moduleName).factory('usermanagementWizardService', usermanagementWizardService);

	usermanagementWizardService.$inject = ['usermanagementUserMainService', '$http', '_', 'platformDialogService'];

	function usermanagementWizardService(usermanagementUserMainService, $http, _, platformDialogService) { // jshint ignore:line

		function showBulkDisableWizard() {
			let selectedUsers = usermanagementUserMainService.getSelectedEntities();
			const exportModuleDialogConfig = {
				headerText$tr$: 'usermanagement.user.disableUserDialog.dialogTitle',
				headerText: 'Enable/Disable Users in Bulk',
				bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.user/templates/usermanagement-user-disable-users-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButton: false,
				resizeable: true,
				width: '400px',
				height: '300px',
				minWidth: '400px',
				minHeight: '300px',
				value: {
					selectedUsers: selectedUsers
				}
			};

			platformDialogService.showDialog(exportModuleDialogConfig);
		}

		return {
			showBulkDisableWizard: showBulkDisableWizard
		};
	}
})(angular);
