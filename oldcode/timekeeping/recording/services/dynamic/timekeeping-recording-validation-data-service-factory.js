(function (angular) {
	'use strict';

	var moduleName = 'timekeeping.recording';
	var tkRecordingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingValidationDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	tkRecordingModule.service('timekeepingRecordingValidationDataServiceFactory', TimekeepingRecordingValidationDataServiceFactory);

	TimekeepingRecordingValidationDataServiceFactory.$inject = ['_', 'platformDynamicDataServiceFactory', 'timekeepingRecordingDataService'];

	function TimekeepingRecordingValidationDataServiceFactory(_, platformDynamicDataServiceFactory, timekeepingRecordingDataService) {
		var instances = {};

		this.createDataService = function createDataService(templInfo) {
			var moduleInfo = {
				instance: tkRecordingModule,
				name: 'Timekeeping.Recording',
				postFix: 'BelongsToRecordingDataService',
				translationKey: 'timekeeping.recording.tranlationsIdValidations',
				readEndPoint: 'listbyrecording',
				parentService: timekeepingRecordingDataService,
				filterName: 'recordingId',
				itemName: 'Validations'
			};

			var dsName = platformDynamicDataServiceFactory.getDataServiceName(templInfo, moduleInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = platformDynamicDataServiceFactory.createDataService(templInfo, moduleInfo);
				instances[dsName] = srv;
			}

			return srv;
		};
	}
})(angular);
