(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingConditionConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingRTimeControllingConditionConstantValues provides definitions and constants frequently used in timekeeping recording module
	 */
	angular.module(moduleName).value('timekeepingTimeControllingConstantValues', {
		schemes: {
			report: {typeName: 'ReportDto', moduleSubModule: 'Timekeeping.Recording'},
			break: {typeName: 'TimekeepingBreakDto', moduleSubModule: 'Timekeeping.Recording'},
			verification:{typeName: 'EmpReportVerificationDto', moduleSubModule: 'Timekeeping.Recording'}

		},
		uuid: {
			container: {
				reportList: 'ed78f11aecf14c11be28f8399f4d4590',
				reportDetails: '4d7ec9a6539c447fbbea83b03c00b5d9',
				breakList:'36f4e73f15ab4fc283c9492dcd9fa50c',
				breakDetails:'9b148bd082fd4470831c6686a24db1e3',
				verificationList:'a6bf0eb6d1ca4e5cb945fef7fb3f6ab8',
				verificationDetails:'67045a0fa32d41fe92d0083d5997c49c',
			}
		},
		permissionUuid: {
			reports: 'f78bcdebfebc494392a7759e48e6b0ed',
			breaks: '5d34ff4e0bf347e3976e6ef2079bf91d',
			verifications: '2deddcc178a84cfebdfa8d7a094032bf'
		},
		rubricId: 94
	});
})(angular);
