/*
 * $Id: timekeeping-recording-input-form-controller.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	angular.module(moduleName).controller('timekeepingRecordingInputFormController', TimekeepingRecordingInputFormController);

	TimekeepingRecordingInputFormController.$inject = ['$scope', 'timekeepingRecordingInputFormService'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function TimekeepingRecordingInputFormController($scope, timekeepingRecordingInputFormService) {

		timekeepingRecordingInputFormService.initScope($scope);

		$scope.submit = function () {
			return timekeepingRecordingInputFormService.submit($scope);
		};

		timekeepingRecordingInputFormService.generateFormFromLayout($scope);
	}
})(angular);
