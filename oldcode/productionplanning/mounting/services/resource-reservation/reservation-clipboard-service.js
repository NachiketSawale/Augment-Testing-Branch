/**
 * Created by anl on 3/16/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).service('productionplanningMountingResReservationClipBoardService', ReservationClipBoardService);

	ReservationClipBoardService.$inject = ['productionplanningActivityResReservationClipBoardFactory'];

	function ReservationClipBoardService(resReservationClipBoardFactory) {

		var config = {
			actResReservationUUID: 'a9e90275f8de429db681448f6caefce3',
			trsReqResReservationUUID: 'cce4e1d048ca486da12d36d97ffedca7',
			module: moduleName
		};
		return resReservationClipBoardFactory.createService(config);
	}

})(angular);