/**
 * Created by anl on 3/14/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).service('productionplanningActivityResReservationClipBoardService', ReservationClipBoardService);

	ReservationClipBoardService.$inject = ['productionplanningActivityResReservationClipBoardFactory'];

	function ReservationClipBoardService(resReservationClipBoardFactory) {

		var config = {
			actResReservationUUID: 'ff65929c43634e1791dba161302d98c6',
			trsReqResReservationUUID: 'd227d73d05a6406bad800e8c0dee7b46',
			module: moduleName
		};
		return resReservationClipBoardFactory.createService(config);
	}

})(angular);