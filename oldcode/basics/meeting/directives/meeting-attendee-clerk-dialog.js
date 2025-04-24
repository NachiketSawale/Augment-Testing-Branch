/**
 * Created by chd on 4/20/2019.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular, globals */
	globals.lookups.filterAttendeeClerk = function () {
		let columns = [
			{id: 'code', name: 'Code', name$tr$: 'cloud.common.entityCode', field: 'Code', width: 100, sortable: true},
			{id: 'title', name: 'Title', name$tr$: 'basics.clerk.entityTitle', field: 'Title', width: 150, sortable: true},
			{id: 'description', name: 'Description', name$tr$: 'cloud.common.entityDescription', field: 'Description', width: 150, sortable: true},
			{id: 'firstname', name: 'First Name', name$tr$: 'cloud.common.contactFirstName', field: 'FirstName', width: 150, sortable: true},
			{id: 'familyname', name: 'Family Name', name$tr$: 'cloud.common.contactFamilyName', field: 'FamilyName', width: 150, sortable: true},
			{id: 'email', name: 'E-Mail', name$tr$: 'cloud.common.email', field: 'Email', width: 150, sortable: true},
			{id: 'telephonenumber', name: 'Phone Number', name$tr$: 'cloud.common.telephoneNumber', field: 'TelephoneNumber', width: 150, sortable: true},
			{id: 'telephonemobil', name: 'Mobile', name$tr$: 'cloud.common.mobile', field: 'TelephoneMobil', width: 150, sortable: true},
			{id: 'department', name: 'Department', name$tr$: 'cloud.common.entityDepartment', field: 'Department', width: 150, sortable: true},
			{id: 'company', name: 'Company', name$tr$: 'cloud.common.entityCompany', field: 'Company', width: 150, sortable: true},
			{id: 'address', name: 'Address', name$tr$: 'cloud.common.address', field: 'Address', width: 150, sortable: true},
			{id: 'signature', name: 'Signature', name$tr$: 'basics.clerk.entitySignature', field: 'Signature', width: 150, sortable: true},
			{id: 'remark', name: 'Remark', name$tr$: 'cloud.common.DocumentBackup_Remark', field: 'Remark', width: 150, sortable: true}
		];
		return {
			lookupOptions: {
				lookupType: 'clerk',
				valueMember: 'Id',
				version: 3,
				displayMember: 'Description',
				uuid: 'de78f3af42194c7ebd312ed0224fb6f4',
				width: '600px',
				height: '550px',
				dialogOptions: {
					id: 'bb0374df49b1447e853aa4be8df928e3',
					minHeight: '550px',
					template: '',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'basics.meeting/templates/meeting-attendee-look-up-dialog.html'
				},
				disableDataCaching: true,
				resizeable: true,
				columns: columns,
				pageOptions: {
					enabled: true,
					size: 100
				},
			}
		};
	};

	angular.module('basics.meeting').directive('meetingAttendeeClerkDialog', ['globals', 'BasicsLookupdataLookupDirectiveDefinition',
		function (globals, BasicsLookupdataLookupDirectiveDefinition) {

			let providerInfo = globals.lookups.filterAttendeeClerk();
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions, {
				controller: [
					'$scope',
					'$element',
					'cloudDesktopTeamsManagementService',
					'platformModalService',
					'$translate',
					'$http',
					'$q',
					function cloudClerkClerkDialogController(
						$scope,
						$element,
						cloudDesktopTeamsManagementService,
						platformModalService,
						$translate,
						$http,
						$q) {

						$scope.lookupOptions.dataProvider.getSearchList = function (value) {
							let request = {
								SearchValue: value.SearchText,
								ClerkIds: null,
								IsFromContext: false
							};
							let deferred = $q.defer();
							$http.post(globals.webApiBaseUrl + 'basics/meeting/wizard/attendeeclerklookup', request).then(function (res) {
								deferred.resolve({
									items: res.data,
									itemsFound: res.data.length,
									itemsRetrieved: res.data.length
								});
							});
							return deferred.promise;
						};

						let readOnly = false;
						if ($element[0] && $element[0].attributes && $element[0].attributes['data-readonly']) {
							readOnly = $element[0].attributes['data-readonly'].value === 'true';
						}

						if (!readOnly) {
							let execute = function (/* event, editValue */) {
								let chatURL = 'https://teams.microsoft.com/l/chat/0/0?users=';
								let displayItem = $scope.$$childTail.displayItem;
								let selectedItems = $scope.$$childTail.selectedItems; // If selectedItems is empty array, displayItem should not exist.
								let emails = [];
								if (displayItem && displayItem.Email) {
									emails.push(displayItem.Email);
								}
								if (selectedItems) {
									selectedItems.forEach(function (entity) {
										if (entity.Email && !emails.includes(entity.Email)) {
											emails.push(entity.Email);
										}
									});
								}
								if (emails.length) {
									emails = emails.length <= 50 ? emails : emails.slice(0, 50); // Only use the first 50 email addresses and ignore the rest.
									emails = emails.join(',');
									chatURL += emails;
									window.open(chatURL);
								} else {
									let title = $translate.instant('basics.clerk.teams.title');
									let msg = $translate.instant('basics.clerk.teams.clerkHasNoEmail');
									return platformModalService.showMsgBox(msg, title, 'error');
								}
							};

							let canExecute = function () {
								let selectedEntitys = $scope.$$childTail.selectedItems;
								if (selectedEntitys) { // selectedEntitys is defined
									for (let entity of selectedEntitys) {
										if (entity.Email) {
											return true;
										}
									}
									return false;
								} else { // selectedEntitys is not defined
									return $scope.$$childTail.displayItem && $scope.$$childTail.displayItem.Email;
								}
							};

							if (cloudDesktopTeamsManagementService.enableTeamsChatNavigation) {
								angular.extend($scope.lookupOptions, {
									extButtons: [
										{
											class: 'control-icons ico-teams',
											title :$translate.instant('basics.clerk.teams.chatInTeams'),
											execute: execute,
											canExecute: canExecute
										}
									]
								});
							}
						}
					}]
			});
		}
	]);

})(angular, globals);