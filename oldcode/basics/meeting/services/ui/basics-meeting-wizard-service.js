(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'basics.meeting';
	angular.module(moduleName).service('basicsMeetingSidebarWizardService', BasicsMeetingSidebarWizardService);

	BasicsMeetingSidebarWizardService.$inject = ['_', '$q', '$rootScope','$injector', '$http', '$translate', '$timeout','platformDialogService', 'basicsMeetingMainService', 'basicsMeetingAttendeeService',
		'basicsCommonChangeStatusService', 'platformModalService', 'basicsLookupdataLookupDescriptorService', 'basicsMeetingCreateService', 'basicsLookupdataLookupDataService', 'msalAuthenticationCustomService'];

	function BasicsMeetingSidebarWizardService(_, $q, $rootScope, $injector, $http, $translate, $timeout,platformDialogService, basicsMeetingMainService, basicsMeetingAttendeeService,
		basicsCommonChangeStatusService, platformModalService, lookupDescriptorService, basicsMeetingCreateService, basicsLookupdataLookupDataService, msalService) {

		this.createMeeting = function createMeeting() {
			basicsMeetingCreateService.showCreateDialog();
		};

		this.synchronizeMeeting = function synchronizeMeeting() { // Wizard calls this method.
			this.synchronizeMeetingToOuterSystem(null, null, null);
		};

		this.synchronizeMeetingToOuterSystem = function synchronizeMeetingToOuterSystem(newMeetingItem, syncMeetingType,dataService) {
			try {
				let selectedItem = null;
				if (newMeetingItem) { // If true, sync meeting after creating new one.
					selectedItem = newMeetingItem;
				} else {
					selectedItem = basicsMeetingMainService.getSelected();
				}

				if (selectedItem) {
					let statusList = lookupDescriptorService.getData('MeetingStatus');
					let isPublished = _.get(_.find(statusList, {Id: selectedItem.MtgStatusFk}), 'IsPublished');
					if (isPublished) {
						let modalOption = {
							headerText$tr$: 'cloud.common.infoBoxHeader',
							bodyText: $translate.instant('basics.meeting.wizard.hasPublished'),
							showOkButton: true,
							showCancelButton: true,
							iconClass: 'info'
						};

						platformDialogService.showDialog(modalOption).then(function (result) {
							if (result.ok) {
								showSyncMeetingDialog(selectedItem, syncMeetingType);
							}
						});
					} else {
						showSyncMeetingDialog(selectedItem, syncMeetingType,dataService);
					}
				} else {
					let modalOption = {
						templateUrl: globals.appBaseUrl + 'basics.meeting/partials/synchronize-meeting.html',
						selectedItem: selectedItem
					};
					platformModalService.showDialog(modalOption);
				}
			} catch (e) {
				platformDialogService.showDialog({
					headerText$tr$: 'cloud.common.errorDialogTitle',
					bodyText: '<p>' + $translate.instant('basics.meeting.wizard.syncFailed') + '</p><p>' + (e.message ? e.message : '') + '</p>',
					showOkButton: true,
					iconClass: 'error',
				});
				throw e;
			}
		};

		function showSyncMeetingDialog(selectedItem, syncMeetingType,dataService) {
			let url = globals.webApiBaseUrl + 'basics/meeting/attendee/list?mainItemId=' + selectedItem.Id;
			$http.get(url).then(function (response) {
				if (response.data) {
					let attendeeItems = response.data;
					if (attendeeItems.length === 0) {
						platformDialogService.showDialog({
							headerText$tr$: 'cloud.common.infoBoxHeader',
							bodyText: $translate.instant('basics.meeting.wizard.attendNotFound'),
							showOkButton: true,
							iconClass: 'info'
						});
						return;
					}

					let emails = [];
					let noEmailUser = [];
					_.each(attendeeItems, function (attendee) {
						if (attendee.Email !== null && attendee.Email !== '') {
							emails.push(attendee.Email);
						} else {
							noEmailUser.push(attendee.FirstName + ' ' + attendee.FamilyName);
						}
					});
					if (emails.length === 0) {
						platformDialogService.showDialog({
							headerText$tr$: 'cloud.common.infoBoxHeader',
							bodyText: $translate.instant('basics.meeting.wizard.attendNoEmail'),
							showOkButton: true,
							iconClass: 'info'
						});
						return;
					}

					let client = msalService.client(globals.aad.office365ClientId);
					let request = {'scopes':['Calendars.ReadWrite','Files.ReadWrite']};
					client.isAuthenticated(null,request).then(r => {
						if (r.isAuthenticated) {
							syncMeetingAfterLogin(selectedItem, syncMeetingType, noEmailUser, dataService);
						} else {
							let meetingSidebarWizardService = $injector.get('basicsMeetingSidebarWizardService');
							meetingSidebarWizardService.syncMeetingItem = selectedItem;
							meetingSidebarWizardService.syncMeetingType = syncMeetingType;
							meetingSidebarWizardService.noEmailUser = noEmailUser;
							client.loginPopup(request).then(() => {
								let meetingSidebarWizardService = $injector.get('basicsMeetingSidebarWizardService'); // Synchronize meeting after login
								meetingSidebarWizardService.syncMeetingAfterLogin(meetingSidebarWizardService.syncMeetingItem, meetingSidebarWizardService.syncMeetingType, meetingSidebarWizardService.noEmailUser, dataService);
							}, () => {
								platformDialogService.showDialog({
									headerText$tr$: 'cloud.common.errorDialogTitle',
									bodyText: '<p>' + $translate.instant('basics.meeting.wizard.syncFailed') + '</p><p>' + $translate.instant('basics.meeting.wizard.acquireTokenFailed') + '</p>',
									showOkButton: true,
									iconClass: 'error'
								});
							});
						}
					});

				}
			});
		}

		function syncMeetingAfterLogin(selectedItem, syncMeetingType, noEmailUser,dataService) {
			if (syncMeetingType) {
				syncMeetingAsync(syncMeetingType, selectedItem, noEmailUser,dataService);
			} else {
				let modalOption = {
					templateUrl: globals.appBaseUrl + 'basics.meeting/partials/synchronize-meeting.html',
					selectedItem: selectedItem,
					noEmailUser: noEmailUser
				};
				platformModalService.showDialog(modalOption);
			}
		}
		this.syncMeetingAfterLogin = syncMeetingAfterLogin;

		function syncMeetingAsync(syncMeetingType, selectedItem, noEmailUser,dataService) {
			let data = {mainItemId: selectedItem.Id, syncMeetingType: syncMeetingType};
			$http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/meeting/wizard/syncMeeting',
				data: data,
				headers: {
					'x-request-office-byapi': globals.aad.resource.msGraph + '/v1.0'
				}
			}).then(function (result) {
				if (result && result.data) {
					let finalMessage;
					let iconClass;
					let header;

					if (result.config && result.config.data && result.config.data.syncMeetingType === '1' && !result.data.MtgUrl) { // Request synchronize online meeting, but generate offline meeting.
						header = 'cloud.common.errorDialogTitle';
						finalMessage = $translate.instant('basics.meeting.wizard.syncSuccessButHasNoOnlineURL');
						iconClass = 'error';
					} else {
						header = 'cloud.common.infoBoxHeader';
						finalMessage = noEmailUser.length > 0 ? $translate.instant('basics.meeting.wizard.partialUser') + ' ' + noEmailUser.toString() : $translate.instant('basics.meeting.wizard.syncSuccess');
						iconClass = 'info';
					}

					platformDialogService.showDialog({
						headerText$tr$: header,
						bodyText: finalMessage,
						showOkButton: true,
						iconClass: iconClass
					});
					if(dataService) {
						dataService.read();
					} else {
						basicsMeetingMainService.refresh();
					}
				} else {
					platformDialogService.showDialog({
						headerText$tr$: 'cloud.common.errorDialogTitle',
						bodyText: '<p>' + $translate.instant('basics.meeting.wizard.syncFailed') + '</p>',
						showOkButton: true,
						iconClass: 'error',
					});
				}
			});
		}
		this.syncMeetingAsync = syncMeetingAsync;

		let changeMeetingStatus = function changeMeetingStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: true,
					mainService: basicsMeetingMainService,
					statusField: 'MtgStatusFk',
					codeField: 'Code',
					descField: '',
					projectField: 'ProjectFk',
					title: 'basics.meeting.wizard.changeMeetingStatus',
					statusName: 'meeting',
					updateUrl: 'basics/meeting/wizard/changemeetingstatus',
					id: 1
				}
			);
		};

		this.changeMeetingStatus = changeMeetingStatus().fn;

		let changeAttendeeStatus = function changeAttendeeStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: basicsMeetingMainService,
					dataService: basicsMeetingAttendeeService,
					statusField: 'AttendeeStatusFk',
					projectField: '',
					title: 'basics.meeting.wizard.changeAttendeeStatus',
					statusName: 'attendee',
					updateUrl: 'basics/meeting/wizard/changeattendeestatus',
					id: 2
				}
			);
		};

		this.changeAttendeeStatus = changeAttendeeStatus().fn;
	}

})(angular);
