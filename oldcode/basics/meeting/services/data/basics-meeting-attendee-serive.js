/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {
	/* global globals */
	'use strict';
	let basicsMeetingModule = angular.module('basics.meeting');

	basicsMeetingModule.factory('basicsMeetingAttendeeService', ['$injector', 'platformDataServiceFactory', 'basicsMeetingMainService', 'basicsMeetingAttendeeReadonlyProcessor',

		function ($injector, platformDataServiceFactory, parentService, basicsMeetingAttendeeReadonlyProcessor) {
			let basicsMeetingAttendeeServiceOption = {
				flatLeafItem: {
					module: basicsMeetingModule,
					serviceName: 'basicsMeetingAttendeeService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/meeting/attendee/', endCreate: 'createnew' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/meeting/attendee/', endRead: 'list'},
					entityRole: {
						leaf: {
							itemName: 'MtgAttendee',
							parentService: parentService
						}
					},
					translation: {
						uid: 'basicsMeetingAttendeeService',
						title: 'basics.meeting.attendee'
					},
					dataProcessor: [basicsMeetingAttendeeReadonlyProcessor],
					presenter: {
						list: {
							handleCreateSucceeded: function initCreationData(newData) {
								let selectedItem = parentService.getSelected();
								if (selectedItem) {
									newData.MtgHeaderFk = selectedItem.Id;
								}
							}
						}
					},
					actions: {
						delete: {}, create: 'flat',
						canCreateCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						},
						canDeleteCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(basicsMeetingAttendeeServiceOption);
			return serviceContainer.service;
		}]);
})(angular);
