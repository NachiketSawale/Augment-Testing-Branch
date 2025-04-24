(function (angular) {
	'use strict';
	var tkRecordingModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name projectMainForProjectChangeContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	tkRecordingModule.service('timekeepingRecordingValdationContainerService', TimekeepingRecordingValdationContainerService);

	TimekeepingRecordingValdationContainerService.$inject = ['platformDynamicContainerServiceFactory', 'timekeepingRecordingValidationDataServiceFactory'];

	function TimekeepingRecordingValdationContainerService(platformDynamicContainerServiceFactory, timekeepingRecordingValidationDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Timekeeping.Recording', timekeepingRecordingValidationDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Timekeeping.Recording', timekeepingRecordingValidationDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);
