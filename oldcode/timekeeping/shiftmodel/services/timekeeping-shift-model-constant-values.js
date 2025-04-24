/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingShiftConditionConstantValues provides definitions and constants frequently used in timekeeping shift module
	 */
	angular.module(moduleName).value('timekeepingShiftModelConstantValues', {
		schemes: {
			shift: {typeName: 'ShiftDto', moduleSubModule: 'Timekeeping.ShiftModel'},
			workingTime: {typeName: 'ShiftWorkingTimeDto', moduleSubModule: 'Timekeeping.ShiftModel'},
			exceptionDay: {typeName: 'ExceptionDayDto', moduleSubModule: 'Timekeeping.ShiftModel'},
			shift2Group: {typeName: 'Shift2GroupDto', moduleSubModule: 'Timekeeping.ShiftModel'},
			break:{typeName: 'ShiftBreakDto', moduleSubModule: 'Timekeeping.ShiftModel'}
		},
		uuid: {
			container: {
				shiftList: 'c271fb74bb5c4e7dbfadc1222f1bb8ef',
				shiftDetails: '3f8b36e4b22441e7a994dd85e610567f',
				workingTimeList: '370d136ef46d4c13a7b3ce9bf8b1e5e4',
				workingTimeDetails: 'dd118689baf94608808fad8c942b565f',
				exceptionDayList: '4188c8efe29248c2a36840edc530b71f',
				exceptionDayDetails: 'f95528f510124a91a6195954d746ee60',
				shift2GroupList: '7809c35d6f0840fe83d3637f62d41138',
				shift2GroupDetails: '2da1e64a72a64ffca12dd12c1968e88b',
				shiftBreakList:'e0004627cb3846fc9071394d96e52702',
				shiftBreakDetails:'0de2fa1dac2c409980fd98dd96063391'
			}
		}
	});
})(angular);
