/**
 * Created by chd on 04/02/2022.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsCreateMeetingController',
		['_', '$scope', '$q', '$http', '$translate','$timeout', 'moment', 'platformTranslateService', 'platformDataValidationService',
			'basicsMeetingMainService', 'platformDialogService', 'platformModalService', 'basicsMeetingCreateService', 'basicsLookupdataLookupDescriptorService', 'basicsMeetingSidebarWizardService', '$element',
			function (_, $scope, $q, $http, $translate, $timeout,moment, platformTranslateService, platformDataValidationService,
				basicsMeetingMainService, platformDialogService, platformModalService, basicsMeetingCreateService, lookupDescriptorService, basicsMeetingSidebarWizardService, $element) {

				$scope.options = $scope.$parent.modalOptions;

				let syncOption = [
					{id: 0, value: $translate.instant('basics.meeting.notSync')},
					{id: 1, value: $translate.instant('basics.meeting.msTeamMeeting')},
					{id: 2, value: $translate.instant('basics.meeting.msCalendarMeeting')}
				];

				let isPopupOpened = false;
				let isValueAdded = [false, false, false, false];
				function eventHandlerFactory(idx) { // Fixed some issues of multi-select lookup
					return [
						{
							name: 'onPopupOpened',
							handler: function () {
								isPopupOpened = true;
							}
						},
						{
							name: 'onPopupClosed',
							handler: function () {
								isPopupOpened = false;
								$element.find('input')[idx].value = null;  // The number idx is sortOrder.
							}
						},
						{
							name: 'onInitialized',
							handler: function () { // Fixed the cursor (focus) jumping issue
								let input = $element.find('input').slice(idx, idx + 1);
								input.on('focus', function () {
									if (!input[0].value && isPopupOpened) {
										input.blur();
									}
								});
							}
						},
						{
							name: 'onEditValueChanged',
							handler: function (e, args) {
								if (args.selectedItems.length > 0) {
									isValueAdded[idx - 9] = true;
								}
								if (!isPopupOpened) { // Sometimes the lookup window may not pop up. In this case, the search text can be deleted.
									$element.find('input')[idx].value = null;
								}
							}
						},
						{
							name: 'onInputGroupClick',
							handler: function () { // Fixed the issue: double-clicking is required to focus.
								isValueAdded.remove(idx - 9);
								if (isValueAdded.indexOf(true) !== -1) {
									isValueAdded = [false, false, false, false];
									$element.find('input').slice(idx, idx + 1).focus();
								}
							}
						}
					]
				}

				$scope.formOptions = {
					'fid': 'basics.meeting.createMeetingModal',
					'version': '1.1.0',
					showGrouping: true,
					title$tr$: '',

					groups: [
						{
							gid: 'meeting',
							header: $translate.instant('basics.meeting.entityMeetingTitle'),
							header$tr$: $translate.instant('basics.meeting.entityMeetingTitle'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'required',
							header: $translate.instant('basics.meeting.requiredAttendee'),
							header$tr$: $translate.instant('basics.meeting.requiredAttendee'),
							isOpen: true,
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'optional',
							header: $translate.instant('basics.meeting.optionalAttendee'),
							header$tr$: $translate.instant('basics.meeting.optionalAttendee'),
							isOpen: true,
							visible: true,
							sortOrder: 3
						}
					],
					rows: [
						{
							gid: 'meeting',
							rid: 'code',
							label$tr$: 'cloud.common.entityCode',
							model: 'Code',
							required: true,
							readonly: true,
							type: 'code',
							sortOrder: 1,
							asyncValidator: function (entity, code, model) {
								let defer = $q.defer();
								let url = globals.webApiBaseUrl + 'basics/meeting/isuniquecode?code=' + code;
								$http.get(url).then(function (result) {
									defer.resolve(!result.data ? platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()}) : true);
								});
								return defer.promise;
							}
						},
						{
							gid: 'meeting',
							rid: 'title',
							label$tr$: 'basics.meeting.title',
							model: 'Title',
							type: 'description',
							sortOrder: 2
						},
						{
							gid: 'meeting',
							rid: 'type',
							label$tr$: 'cloud.common.entityType',
							type: 'directive',
							model: 'TypeFk',
							directive: 'basics-meeting-type-combobox',
							sortOrder: 3,
							options: {
								'showClearButton': false
							}
						},
						{
							gid: 'meeting',
							rid: 'location',
							label$tr$: 'cloud.common.AddressTokenDesc_Location',
							model: 'Location',
							type: 'comment',
							maxLength: 252,
							sortOrder: 4
						},
						{
							gid: 'meeting',
							rid: 'url',
							label$tr$: 'basics.meeting.meetingUrl',
							model: 'URL',
							type: 'url',
							sortOrder: 5
						},
						{
							gid: 'meeting',
							rid: 'isimportance',
							label$tr$: 'basics.meeting.isHighImportance',
							model: 'IsImportance',
							type: 'boolean',
							sortOrder: 6
						},
						{
							gid: 'meeting',
							rid: 'projectfk',
							label$tr$: 'cloud.common.entityProject',
							model: 'ProjectFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: true,
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											basicsMeetingCreateService.setContextInfo(args.selectedItem);
										}
									}]

								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							},
							sortOrder: 7
						},
						{
							gid: 'meeting',
							rid: 'clerkfk',
							label$tr$: 'basics.meeting.entityMeetingResp',
							label: 'Responsible',
							type: 'directive',
							model: 'ClerkFk',
							sortOrder: 8,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							}
						},
						{
							gid: 'required',
							rid: 'requiredClerkItems',
							sortOrder: 9,
							type: 'directive',
							model: 'RequiredClerkItems',
							directive: 'meeting-attendee-clerk-dialog',
							label$tr$: 'basics.meeting.entityClerk',
							readonly: false,
							options: {
								displayMember: 'Description',
								showClearButton: true,
								multipleSelection: true,
								events: [{
									name: 'onEditValueChanged',
									handler: function (e, args) {
										let arr = args.selectedItems.map(function (item) {
											return item.Id;
										});
										basicsMeetingCreateService.setRequiredClerks(arr);
									}
								}, ...eventHandlerFactory(9)]
							}
						},
						{
							gid: 'required',
							rid: 'requiredContactItems',
							sortOrder: 10,
							type: 'directive',
							model: 'RequiredContactItems',
							directive: 'meeting-attendee-contact-dialog',
							label$tr$: 'basics.meeting.bpContact',
							readonly: false,
							options: {
								displayMember: 'FullName',
								showClearButton: true,
								multipleSelection: true,
								events: [{
									name: 'onEditValueChanged',
									handler: function (e, args) {
										let arr = args.selectedItems.map(function (item) {
											return item.Id;
										});
										basicsMeetingCreateService.setRequiredContacts(arr);
									}
								}, ...eventHandlerFactory(10)]
							}
						},
						{
							gid: 'optional',
							rid: 'optionalClerkItems',
							sortOrder: 11,
							type: 'directive',
							model: 'OptionalClerkItems',
							directive: 'meeting-attendee-clerk-dialog',
							label$tr$: 'basics.meeting.entityClerk',
							readonly: false,
							options: {
								displayMember: 'Description',
								showClearButton: true,
								multipleSelection: true,
								events: [{
									name: 'onEditValueChanged',
									handler: function (e, args) {
										let arr = args.selectedItems.map(function (item) {
											return item.Id;
										});
										basicsMeetingCreateService.setOptionalClerks(arr);
									}
								}, ...eventHandlerFactory(11)]
							}
						},
						{
							gid: 'optional',
							rid: 'optionalContactItems',
							sortOrder: 12,
							type: 'directive',
							model: 'OptionalContactItems',
							directive: 'meeting-attendee-contact-dialog',
							label$tr$: 'basics.meeting.bpContact',
							readonly: false,
							options: {
								displayMember: 'FullName',
								showClearButton: true,
								multipleSelection: true,
								events: [{
									name: 'onEditValueChanged',
									handler: function (e, args) {
										let arr = args.selectedItems.map(function (item) {
											return item.Id;
										});
										basicsMeetingCreateService.setOptionalContacts(arr);
									}
								}, ...eventHandlerFactory(12)]
							}
						}
					]
				};

				let typeFk = 1;
				let defaultTypeItems = _.filter(lookupDescriptorService.getData('MeetingType'), {IsDefault: true});
				if (angular.isArray(defaultTypeItems) && defaultTypeItems.length >= 1) {
					typeFk = defaultTypeItems[0].Id;
				}

				$scope.meetingItem = {
					Code: $translate.instant('cloud.common.isGenerated'),
					Title: '',
					StartTime: null,
					EndTime: null,
					Location: '',
					URL: '',
					ProjectFk: $scope.options.project ? $scope.options.project.id : null,
					TypeFk: typeFk,
					RequiredClerkItems: [],
					RequiredContactItems: [],
					OptionalClerkItems: [],
					OptionalContactItems: [],
					IsImportance: false,
					ClerkFK: null,
					SyncMeetingType: 0,
					Recurrence : null
				};
				// extend ContextData
				if($scope.options.contextData) {
					$scope.meetingItem = angular.extend($scope.meetingItem, $scope.options.contextData);
				}

				// translate form config.
				platformTranslateService.translateFormConfig($scope.formOptions);

				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: $scope.formOptions,
					showButtons:[],
					validationMethod: function () {
					}
				};

				$scope.modalOptionsError = {
					rt$hasError: hasError,
					rt$errorText: null
				};

				$scope.setTools = function(tools){
					$scope.tools = tools;
				};

				let startDate = moment(Date.now());
				let endDate = angular.copy(startDate);
				endDate.add(30, 'm');

				$scope.modalOptions = {
					isLoading: false,
					isRecurring: false,
					isAllDay: false,
					syncMeetingType: '0',
					startDate: startDate,
					startTime: startDate,
					endDate: endDate,
					endTime: endDate,
					showTime: true,
					syncOption: syncOption,
					headerText: $translate.instant('basics.meeting.wizard.createMeeting'),
					recurringButtonText: $translate.instant('basics.meeting.wizard.makeRecurring'),
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					isValid: function isValid() {
						return $scope.meetingItem.Code !== '' && $scope.modalOptions.startDate && $scope.modalOptions.startTime
							&& $scope.modalOptions.endDate && $scope.modalOptions.endTime && !$scope.modalOptionsError.rt$hasError();
					}
				};

				$scope.modalOptions.isEveryWeekday = false;
				$scope.modalOptions.recurring = function onRecurring() {
					let modalOption = {
						templateUrl: globals.appBaseUrl + 'basics.meeting/partials/Recurrence-meeting-dialog.html',
						recurrence : $scope.meetingItem.Recurrence,
						startDate: $scope.modalOptions.startDate,
						endDate : $scope.modalOptions.endDate,
						startTime: $scope.modalOptions.startTime,
						endTime: $scope.modalOptions.endTime,
						isAllDay: $scope.modalOptions.isAllDay,
						isEveryWeekday: $scope.modalOptions.isEveryWeekday
					};
					platformModalService.showDialog(modalOption).then(function (result){
						if (result.data){
							if (result.data.endTime && result.data.startTime){
								$scope.modalOptions.startDate = result.data.startDate;
								$scope.modalOptions.startTime = result.data.startTime;
								$scope.modalOptions.endDate = moment(result.data.endDate.format('YYYY-MM-DD'));
								$scope.modalOptions.endTime = moment(result.data.endTime);
							}
							$scope.meetingItem.Recurrence = result.data.recurrence;
							$scope.modalOptions.isEveryWeekday = result.data.isEveryWeekday;

							if ($scope.modalOptions.isAllDay){
								$scope.modalOptions.isAllDay = result.data.isAllDay;
							}

							if (result.data.recurrence) {
								$scope.modalOptions.isRecurring = true;
								$scope.modalOptions.recurringButtonText = $translate.instant('basics.meeting.wizard.editRecurring');
							}else {
								$scope.modalOptions.isRecurring = false;
								$scope.modalOptions.recurringButtonText = $translate.instant('basics.meeting.wizard.makeRecurring');
							}
						}
					});
				};

				$scope.modalOptions.onAllDateClick = function onAllDateClick() {
					if ($scope.modalOptions.isAllDay) {
						let date = new Date('12:00');
						let utcString = date.toUTCString();
						$scope.modalOptions.startTime = new Date(utcString).getHours() + ':' + new Date(utcString).getMinutes() + ':00';
						$scope.modalOptions.endTime = $scope.modalOptions.startTime;
						$scope.modalOptions.endDate = $scope.modalOptions.startDate;
					}
				};

				$scope.modalOptions.ok = function onOK() {
					$scope.modalOptions.isLoading = true;
					processDateTime();
					$scope.meetingItem.SyncMeetingType = $scope.modalOptions.syncMeetingType;
					$scope.meetingItem.TimeZone = {TimeZoneIanaId: Intl.DateTimeFormat().resolvedOptions().timeZone,  // get time zone iana id
						TimeZoneOffSet: new Date().getTimezoneOffset()};
					function createMeeting() {
						let request = $scope.meetingItem;
						$http.post(globals.webApiBaseUrl + 'basics/meeting/wizard/createmeeting', request).then(function (reloadData) {
							if (reloadData.data) {
								$scope.modalOptions.isLoading = false;
								$scope.$close($scope.meetingItem);
								let modalOptions = {
									headerText$tr$: 'cloud.common.infoBoxHeader',
									bodyText: $translate.instant('basics.meeting.wizard.createMeetingSuccess'),
									showOkButton: true,
									iconClass: 'info'
								};

								platformDialogService.showDialog(modalOptions);
								if($scope.options.dataService) {
									$scope.options.dataService.read();
								} else {
									basicsMeetingMainService.onCreateFromWizardSucceeded(reloadData.data);
								}
								return reloadData.data;
							}
						}).then(function (newMeetingItem) {
							if (newMeetingItem && $scope.modalOptions.syncMeetingType !== '0') {
								basicsMeetingSidebarWizardService.synchronizeMeetingToOuterSystem(newMeetingItem, $scope.modalOptions.syncMeetingType,$scope.options.dataService);
							}
						}).finally(function () {
							$scope.modalOptions.isLoading = false;
							$scope.modalOptions.close();
						});
					}

					let request = $scope.meetingItem;
					$http.post(globals.webApiBaseUrl + 'basics/meeting/wizard/createmeeting', request).then(function (reloadData) {
						if (reloadData && reloadData.data) {
							if (reloadData.data.Id) {
								$scope.modalOptions.isLoading = false;
								$scope.$close($scope.meetingItem);
								let modalOptions = {
									headerText$tr$: 'cloud.common.infoBoxHeader',
									bodyText: $translate.instant('basics.meeting.wizard.createMeetingSuccess'),
									showOkButton: true,
									iconClass: 'info'
								};

								platformDialogService.showDialog(modalOptions);
								if($scope.options.dataService) {
									$scope.options.dataService.read();
								} else {
									basicsMeetingMainService.onCreateFromWizardSucceeded(reloadData.data);
								}
								return reloadData.data;
							} else {
								let meetingDates = reloadData.data;
								for (let meetingTime of meetingDates) {
									meetingTime.StartTime = meetingTime.StartTime.replace('T', ' ').replace('Z', '');
									meetingTime.StartTime = moment(meetingTime.StartTime).utc().format('YYYY-MM-DD HH:mm');
									meetingTime.EndTime = meetingTime.EndTime.replace('T', ' ').replace('Z', '');
									meetingTime.EndTime = moment(meetingTime.EndTime).utc().format('YYYY-MM-DD HH:mm');
								}
								return meetingDates;
							}
						}
					}).then(function (data) {
						if (data) {
							if (data.Id) { // The 'data' is a new meeting item.
								if ($scope.modalOptions.syncMeetingType !== '0') {
									basicsMeetingSidebarWizardService.synchronizeMeetingToOuterSystem(data, $scope.modalOptions.syncMeetingType,$scope.options.dataService);
								}
							} else { // The 'data' is meeting dates.
								$scope.meetingItem.RecurrenceMeetingDates = data;
								createMeeting();
							}
						}
					}).finally(function () {
						$scope.modalOptions.isLoading = false;
						$scope.modalOptions.close();
					});
				};

				$scope.modalOptions.toggleOpen = function () {
					$scope.modalOptions.showTime = !$scope.modalOptions.showTime;
				};

				$scope.modalOptions.close = function onCancel() {
					$scope.$close(false);
				};

				$scope.modalOptions.cancel = $scope.modalOptions.close;

				function processDateTime() {
					if (moment.isMoment($scope.modalOptions.startDate) && $scope.modalOptions.startDate.isValid()) {
						let startDate = $scope.modalOptions.startDate.format('YYYY-MM-DD');
						if (moment.isMoment($scope.modalOptions.startTime) && $scope.modalOptions.startTime.isValid()) {
							let startTime = $scope.modalOptions.startTime.format('HH:mm');
							startDate = startDate + ' ' + startTime;
						}
						startDate = moment(startDate);
						$scope.meetingItem.StartTime = moment.utc(startDate).format('YYYY-MM-DD HH:mm');
					}

					if (moment.isMoment($scope.modalOptions.endDate) && $scope.modalOptions.endDate.isValid()) {
						let endDate = $scope.modalOptions.endDate.format('YYYY-MM-DD');
						if (moment.isMoment($scope.modalOptions.endTime) && $scope.modalOptions.endTime.isValid()) {
							let endTime = $scope.modalOptions.endTime.format('HH:mm');
							endDate = endDate + ' ' + endTime;
						}
						let end = moment(endDate);
						$scope.meetingItem.EndTime = moment.utc(end).format('YYYY-MM-DD HH:mm');
					}
				}

				function hasError() {
					if ($scope.modalOptions.startDate && $scope.modalOptions.endDate) {
						if ($scope.modalOptions.startDate.isSame($scope.modalOptions.endDate, 'd')) {
							if ($scope.modalOptions.startTime && $scope.modalOptions.endTime) {
								let durationTime = _.round(moment.duration(moment($scope.modalOptions.endTime).diff(moment($scope.modalOptions.startTime))).asMinutes(), 0);
								if (durationTime < 0) {
									$scope.modalOptionsError.rt$errorText = $translate.instant('cloud.common.Error_EndDateTooEarlier');
									return true;
								}
							}
							return false;
						}
						else if ($scope.modalOptions.startDate > $scope.modalOptions.endDate) {
							$scope.modalOptionsError.rt$errorText = $translate.instant('cloud.common.Error_EndDateTooEarlier');
							return true;
						}
					}
					return false;
				}
			}]);
})(angular);