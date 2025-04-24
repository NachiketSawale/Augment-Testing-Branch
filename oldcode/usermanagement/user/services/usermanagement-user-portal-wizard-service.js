/**
 * Created by sandu on 07.12.2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementPortalWizardService
	 * @function
	 *
	 * @description
	 * portal wizard service
	 */
	angular.module(moduleName).service('usermanagementPortalWizardService', usermanagementPortalWizardService);

	usermanagementPortalWizardService.$inject = ['businesspartnerMainContactDataService', 'businesspartnerContactDataService', 'usermanagementUserMainService', 'platformModalService', '$http', '$log'];

	function usermanagementPortalWizardService(businesspartnerMainContactDataService, businesspartnerContactDataService, usermanagementUserMainService, platformModalService, $http, $log) {
		var service = {};

		service.unlinkPortalUsers = function unlinkPortalUsers(options) {
			if (options.ContextType === 'contact') {
				var selectedContacts = businesspartnerContactDataService.getSelectedEntities();
				var contactIds = [];
				_.each(selectedContacts, function (contact) {
					contactIds.push(contact.Id);
				});
				if (selectedContacts.length) {
					$http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbycontactids/', contactIds).then(function (data) {
						platformModalService.showMsgBox('usermanagement.user.wizards.unlinkSuccessfull', 'usermanagement.user.wizards.unlinkSuccessfull', 'info');
						return data.data;
					}, function (error) {
						$log.error(error);
					});
				} else {
					platformModalService.showErrorBox('usermanagement.user.wizards.noContactSelected', 'usermanagement.user.wizards.noContactSelected');
				}
			} else if (options.ContextType === 'bpcontact') {
				var selectedBpContacts = businesspartnerMainContactDataService.getSelectedEntities();
				var bppContactIds = [];
				_.each(selectedBpContacts, function (contact) {
					bppContactIds.push(contact.Id);
				});
				if (selectedBpContacts.length) {
					$http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbycontactids/', bppContactIds).then(function (data) {
						platformModalService.showMsgBox('usermanagement.user.wizards.unlinkSuccessfull', 'usermanagement.user.wizards.unlinkSuccessfull', 'info');
						return data.data;
					}, function (error) {
						$log.error(error);
					});
				} else {
					platformModalService.showErrorBox('usermanagement.user.wizards.noContactSelected', 'usermanagement.user.wizards.noContactSelected');
				}
			} else if (options.ContextType === 'user') {
				var selectedUsers = usermanagementUserMainService.getSelectedEntities();
				var userIds = [];
				_.each(selectedUsers, function (user) {
					userIds.push(user.Id);
				});
				if (selectedUsers.length) {
					$http.post(globals.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbyuserids/', userIds).then(function (data) {
						platformModalService.showMsgBox('usermanagement.user.wizards.unlinkSuccessfull', 'usermanagement.user.wizards.unlinkSuccessfull', 'info');
						return data.data;
					}, function (error) {
						$log.error(error);
					});
				} else {
					platformModalService.showErrorBox('usermanagement.user.wizards.noUserSelected', 'usermanagement.user.wizards.noUserSelected');
				}
			}
		};
		return service;
	}
})(angular);
