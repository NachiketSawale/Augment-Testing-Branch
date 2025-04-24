
(function (angular) {

	'use strict';
	let controllingProjectControlsModule = angular.module('controlling.projectcontrols');

	controllingProjectControlsModule.factory('controllingProjectcontrolsContainerInformationService', [
		function () {
			let service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid() {
				let config = {};

				return config;
			};

			return service;
		}
	]);
})(angular);
