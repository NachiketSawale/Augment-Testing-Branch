/*
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	angular.module(moduleName).service('timekeepingRecordingInputFormCrewService', TimekeepingRecordingInputFormCrewService);

	TimekeepingRecordingInputFormCrewService.$inject = ['$q'];

	function TimekeepingRecordingInputFormCrewService($q) {
		this.load = function loadCrew() {
			return $q.when(true);
		};
	}

})(angular);