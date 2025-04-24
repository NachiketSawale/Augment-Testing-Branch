/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingConditionConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingRecordingConditionConstantValues provides definitions and constants frequently used in timekeeping recording module
	 */
	angular.module(moduleName).value('timekeepingRecordingConstantValues', {
		schemes: {
			recording: {typeName: 'RecordingDto', moduleSubModule: 'Timekeeping.Recording'},
			report: {typeName: 'ReportDto', moduleSubModule: 'Timekeeping.Recording'},
			sheet: {typeName: 'SheetDto', moduleSubModule: 'Timekeeping.Recording'},
			result: {typeName: 'TimekeepingResultDto', moduleSubModule: 'Timekeeping.Recording'},
			break: {typeName: 'TimekeepingBreakDto', moduleSubModule: 'Timekeeping.Recording'},
			validation: {typeName: 'TimekeepingValidationDto', moduleSubModule: 'Timekeeping.Period'},
			verification:{typeName: 'EmpReportVerificationDto', moduleSubModule: 'Timekeeping.Recording'}
		},
		uuid: {
			container: {
				recordingList: '1682021f88cb489c9edb67fd77ba0500',
				recordingDetails: 'e252166b26c249da88abd3165e45e651',
				reportList: 'f78bcdebfebc494392a7759e48e6b0ed',
				reportDetails: '9e6540d3c380465cb8e8c7afa0a2a98a',
				resultList: 'd8ee0744ffac416a871546728e6e82bb',
				resultDetails: 'd4c21ec117cd4795aa6604ae56fea840',
				sheetList: 'a99560462228495790fa8a2cb66f3fe3',
				sheetDetails: 'bc3f46599d584250baa1b35db1c361ad',
				breakList:'5d34ff4e0bf347e3976e6ef2079bf91d',
				breakDetails:'39574ea27504449187506297fbd24e10',
				verificationList:'2deddcc178a84cfebdfa8d7a094032bf',
				verificationDetails:'67045a0fa32d41fe92d0083d5997c49c',
			}
		},
		permissionUuid: {
			recordings: '1682021f88cb489c9edb67fd77ba0500',
			reports: 'f78bcdebfebc494392a7759e48e6b0ed',
			results: 'd8ee0744ffac416a871546728e6e82bb',
			sheets: 'a99560462228495790fa8a2cb66f3fe3',
			breaks: '5d34ff4e0bf347e3976e6ef2079bf91d',
			verifications: '2deddcc178a84cfebdfa8d7a094032bf'
		},
		rubricId: 94
	});

})(angular);
