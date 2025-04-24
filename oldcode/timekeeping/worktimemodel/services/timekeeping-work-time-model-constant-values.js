/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingWorkTimeModelConstantValues provides definitions and constants frequently used in timekeeping working time model module
	 */
	angular.module(moduleName).value('timekeepingWorkTimeModelConstantValues', {
		schemes: {
			workTimeModel: {typeName: 'WorkTimeModelDto', moduleSubModule: 'Timekeeping.WorkTimeModel'},
			derivation: {typeName: 'WorkTimeDerivationDto', moduleSubModule: 'Timekeeping.WorkTimeModel'},
			day: {typeName: 'WorkTimeModelDayDto', moduleSubModule: 'Timekeeping.WorkTimeModel'},
			dtl: {typeName: 'WorkTimeModelDtlDto', moduleSubModule: 'Timekeeping.WorkTimeModel'},
			ts2wtm:{typeName: 'TimeSymbol2WorkTimeModelDto', moduleSubModule:'Timekeeping.WorkTimeModel'}
		},
		uuid: {
			container: {
				workTimeModelList: '990a46ae64d74fa4ae226a74730c5ccf',
				workTimeModelDetails: 'ad495e8fb0ff4cf09296789ee58fd6af',
				workTimeDerivationList:'099dbd22e4334b27af27d080bee3dd65',
				workTimeDerivationDetails:'f9bd8c7b94a74663900f47f8a2a5bb9e',
				workTimeModelDayList:'2c97189d84574b82a555e20301529c1c',
				workTimeModelDayDetails:'e31e2637059e41d4a32856fb2126bdd5',
				workTimeModelDtlList:'b49b64d4b0204eb190350168633ef306',
				workTimeModelDtlDetails:'7a1e913380024d598a65902a6e24fc27',
				timeSymbol2WorkTimeModelList:'b3aa28b1d5db4b4b884679a95c3a32b8',
				timeSymbol2WorkTimeModelDetails:'79369d99b969492b830da0e62aea78bd'
			}
		}
	});
})(angular);
