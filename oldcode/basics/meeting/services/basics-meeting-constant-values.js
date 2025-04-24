/**
 * Created by chd on 12/9/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.meeting';

	/**
	 * @ngdoc service
	 * @name basicsMeetingConstantValues
	 * @function
	 *
	 * @description
	 * basicsMeetingConstantValues provides definitions and constants frequently used in basics meeting module
	 */
	angular.module(moduleName).value('basicsMeetingConstantValues', {
		schemes: {
			meeting: {typeName: 'MtgHeaderDto', moduleSubModule: 'Basics.Meeting'},
			attendee: {typeName: 'MtgAttendeeDto', moduleSubModule: 'Basics.Meeting'},
			document: {typeName: 'MtgDocumentDto', moduleSubModule: 'Basics.Meeting'}
		},
		uuid: {
			container: {
				meetingList: '32e3c17bcd3f40d29772070f69e563c7',
				meetingDetail: '6457E5D68CA64A00A34D0E83E935773F',
				meetingAttendeeList: '58ed4703a9e242e8a2dae2e6a823a822',
				meetingAttendeeDetail: 'bb7dd4434019422fba91ff89d53a5e7a',
				meetingDocumentList: '4a764165f16f43b38cdd272bb51ed3a1',
				meetingDocumentDetail: '258b33bab3cd46648116526f26d56a7c'
			}
		},
		recurrence: {
			pattern: {
				daily: 0,
				weekly: 1,
				absoluteMonthly: 2,
				relativeMonthly: 3,
				absoluteYearly: 4,
				relativeYearly: 5
			},
			range: {
				endDate: 0,
				numbered: 1
			}

		}
	});
})(angular);
