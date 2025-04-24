/**
 * Created by rei on 27.03.2018.
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
	angular.module(moduleName).factory('usermanagementPortalInvitationWizardService', portalWizardService);

	portalWizardService.$inject = ['$q', 'businesspartnerMainContactDataService', 'businesspartnerContactDataService', 'usermanagementUserMainService',
		'procurementRfqMainService', 'procurementRfqBusinessPartnerService', 'platformModalService', '$http', '_'];

	function portalWizardService($q, businesspartnerMainContactDataService, businesspartnerContactDataService, usermanagementUserMainService,
		procurementRfqMainService, procurementRfqBusinessPartnerService,
		platformModalService, $http, _) { // jshint ignore:line

		var selectedItemInfo;

		/**
		 *
		 * @returns {{selectedItem, contactId, userId}|*}
		 */
		function selectedItem() {
			return selectedItemInfo;
		}

		/**
		 *
		 */
		function inviteSelectedBidder(options) { // jshint ignore:line

			selectedItemInfo = getPortalUser(options);
			if (!selectedItemInfo) {
				return ({error: 'Configuratation error'});
			}
			var dialogOption = {
				templateUrl: globals.appBaseUrl + 'usermanagement.user/templates/portal-invitation-wizard-dialog.html',
				headerTextKey: 'businesspartner.main.portal.wizard.invitationDialogTitle',
				width: '500px',
				height: '510px',
				resizeable: true,
				dataItem: selectedItemInfo
			};
			return platformModalService.showDialog(dialogOption).then(function () {
			});

		}

		/**
		 T     *
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 * if service returns null: >> there is no clerk fitting to login user having a Family Name and Email
		 * function data returned:  ClerkDto
		 *      {
		 *		    "Id": 1000203,
		 *		    "Description": "Rolf Eisenhut",
		 *		    "TitleFk": null,
		 *		    "FamilyName": "Eisenhut",
		 *		    "FirstName": "Rolf",
		 *		    "Code": "10",
		 *		    "UserFk": 142,
		 *		    "ValidFrom": null,
		 *		    "ValidTo": null,
		 *		    "CompanyFk": 1000196,
		 *		    "Title": null,
		 *		    "Email": "rei@rib.de",
		 *		  }
		 */
		function checkClerktoLoginUser() {
			return $http.get(globals.webApiBaseUrl + 'basics/clerk/checkclerktologinuser')
				.then(function (response) {
					return response.data;
				}, function (response) {
					return $q.reject(response.data);
				});
		}

		/**
		 * read portal access groups from backend
		 *
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		function readPortalAccessGroup() {

			return $http.post(globals.webApiBaseUrl + 'basics/customize/frmportalusergroup/list')
				.then(function (response) {
					return response.data;
				}, function (response) {
					return $q.reject(response.data);
				});
		}

		/**
		 * read portal access groups from backend
		 *
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		function getContactwithBpd(contactId) {

			return $http.get(globals.webApiBaseUrl + 'usermanagement/main/portal/getcontactwithbpd?contactid=' + contactId)
				.then(function (response) {
					return response.data;
				}, function (response) {
					return $q.reject(response.data);
				});
		}

		/**
		 * read portal access groups from backend
		 *
		 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
		 */
		function getContactwithBpdFromUserId(userId) {

			return $http.get(globals.webApiBaseUrl + 'usermanagement/main/portal/getcontactwithbpdbyuserid?userid=' + userId)
				.then(function (response) {
					return response.data;
				}, function (response) {
					return $q.reject(response.data);
				});
		}

		/**
		 *
		 * @param options
		 */
		function getPortalUser(options) {
			var selectedContactId;
			var selectedItem;
			var workflowTemplateId;
			var selectedUserId;
			var errMsg;
			if (options.WorkflowTemplateId) {
				workflowTemplateId = options.WorkflowTemplateId;
			} else {
				errMsg = 'Configuratation Error: <br>WorkflowTemplateId not define in Module Config, please define parameter WorkflowTemplateId there!';
				platformModalService.showErrorBox(errMsg, errMsg);
			}

			if (options.ContextType === 'bidder') {
				selectedItem = procurementRfqBusinessPartnerService.getSelected();
				if (selectedItem) {
					selectedContactId = selectedItem.ContactFk;
				}
				errMsg = 'usermanagement.user.wizards.noContactSelected';
			} else if (options.ContextType === 'contact') {
				selectedItem = businesspartnerContactDataService.getSelected();
				if (selectedItem) {
					selectedContactId = selectedItem.Id;
				}
				errMsg = 'usermanagement.user.wizards.noContactSelected';
			} else if (options.ContextType === 'bpcontact') {
				selectedItem = businesspartnerMainContactDataService.getSelected();
				if (selectedItem) {
					selectedContactId = selectedItem.Id;
				}
				errMsg = 'usermanagement.user.wizards.noContactSelected';
			} else if (options.ContextType === 'user') {
				selectedItem = usermanagementUserMainService.getSelected();
				if (selectedItem) {
					selectedUserId = selectedItem.Id;
				}
				errMsg = 'usermanagement.user.wizards.noUserSelected';
			} else {
				errMsg = 'Configuration issue: none of the required ContextType::= "user|bpcontact|contact|bidder" set.';
			}
			if (!selectedItem) {
				platformModalService.showErrorBox(errMsg, 'Bidder Invitation Wizard failed');
				return null;
			}
			if (!(selectedContactId || selectedUserId)) {
				platformModalService.showErrorBox(errMsg, 'Bidder Invitation Wizard failed');
				return null;
			}

			return {
				workflowTemplateId: workflowTemplateId,
				selectedItem: selectedItem,
				contactId: selectedContactId,
				userId: selectedUserId
			};
		}

		return {
			inviteSelectedBidder: inviteSelectedBidder,
			getPortalUser: getPortalUser,
			readPortalAccessGroup: readPortalAccessGroup,
			selectedItem: selectedItem,
			getContactwithBpd: getContactwithBpd,
			getContactwithBpdFromUserId: getContactwithBpdFromUserId,// rei added 16.11.18
			checkClerktoLoginUser: checkClerktoLoginUser // rei added 6.11.18
		};
	}
})(angular);
