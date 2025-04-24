
(function (angular) {
	'use strict';
	let controllingConfigurationModule = angular.module('controlling.configuration');

	controllingConfigurationModule.factory('controllingConfigurationContainerInformationService', [
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
