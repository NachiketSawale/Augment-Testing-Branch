/**
 * Created by chd on 4/20/2019.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular, globals */
	globals.lookups.filterAttendeeContact = function () {
		let columns = [
			{id: 'FirstName', field: 'FirstName', name: 'FirstName', name$tr$: 'businesspartner.main.firstName', width: 100, sortable: true},
			{id: 'FamilyName', field: 'FamilyName', name: 'FamilyName', name$tr$: 'businesspartner.main.familyName', width: 100, sortable: true},
			{id: 'Title', field: 'Title', name: 'Title', name$tr$: 'businesspartner.main.title', width: 100, sortable: true},
			{id: 'Telephone1', field: 'Telephone1', name: 'Telephone', name$tr$: 'businesspartner.main.telephoneNumber', width: 100, sortable: true},
			{id: 'Telephone2', field: 'Telephone2', name: 'Other Tel.', name$tr$: 'businesspartner.main.telephoneNumber2', width: 100, sortable: true},
			{id: 'Telefax', field: 'Telefax', name: 'Telefax', name$tr$: 'businesspartner.main.telephoneFax', width: 100, sortable: true},
			{id: 'Mobile', field: 'Mobile', name: 'Mobile', name$tr$: 'businesspartner.main.mobileNumber', width: 100, sortable: true},
			{id: 'Internet', field: 'Internet', name: 'Internet', name$tr$: 'businesspartner.main.internet', width: 100, sortable: true},
			{id: 'Email', field: 'Email', name: 'Email', name$tr$: 'businesspartner.main.email', width: 100, sortable: true},
			{id: 'Description', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 120, sortable: true},
			{id: 'AddressLine', field: 'AddressLine', name: 'Address', name$tr$: 'cloud.common.entityAddress', width: 120, sortable: true},
			{id: 'ContactRoleFk', field: 'ContactRoleFk', name: 'Role', name$tr$: 'businesspartner.main.role', width: 120, sortable: true, formatter: 'lookup', formatterOptions: {lookupSimpleLookup: true, lookupModuleQualifier: 'businesspartner.contact.role', displayMember: 'Description', valueMember: 'Id'}
		}];
		return {
			lookupOptions: {
				version: 3,
				uuid: '44673f5e8d484fb2bf254762107f0e1c',
				lookupType: 'contact',
				valueMember: 'Id',
				displayMember: 'FullName',
				width: '800px',
				height: '650px',
				dialogOptions: {
					id: 'd491efa6544741469c6640ff61f5d30a',
					minHeight: '650px',
					template: '',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'basics.meeting/templates/meeting-attendee-look-up-dialog.html'
				},
				resizeable: true,
				disableDataCaching: true,
				pageOptions: {
					enabled: true,
					size: 100
				},
				columns: columns
			}
		};
	};

	angular.module('basics.meeting').directive('meetingAttendeeContactDialog', ['globals', 'BasicsLookupdataLookupDirectiveDefinition',
		function (globals, BasicsLookupdataLookupDirectiveDefinition) {

			let providerInfo = globals.lookups.filterAttendeeContact();
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions, {
				controller: ['$scope', '$element', 'cloudDesktopTeamsManagementService', 'platformModalService', '$translate', '$http', '$q',
					function ($scope, $element, cloudDesktopTeamsManagementService, platformModalService, $translate, $http, $q) {

						$scope.lookupOptions.dataProvider.getSearchList = function (value) {
							let searchRequest = {
								AdditionalParameters: {},
								FilterKey: 'meeting-attendee-contact-filter',
								SearchFields: ['FullName', 'FirstName', 'FamilyName', 'Telephone1', 'Telephone2', 'Telefax', 'Mobile', 'Email', 'ContactRoleFk'],
								SearchText: value.SearchText,
								TreeState: {StartId: null, Depth: null},
							};
							let deferred = $q.defer();
							$http.post(globals.webApiBaseUrl + 'basics/lookupdata/masternew/getsearchlist?lookup=contact', searchRequest).then(function (res) {
								deferred.resolve({
									items: res.data.SearchList,
									itemsFound: res.data.RecordsFound,
									itemsRetrieved: res.data.RecordsRetrieved
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
									let msg = $translate.instant('basics.clerk.teams.contactHasNoEmail');
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
											title : $translate.instant('basics.clerk.teams.chatInTeams'),
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