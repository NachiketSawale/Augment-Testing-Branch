/**
 * Created by baf on 28.12.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingResultValidationService
	 * @description provides validation methods for timekeeping recording result entities
	 */
	angular.module(moduleName).service('timekeepingRecordingResultValidationService', TimekeepingRecordingResultValidationService);

	TimekeepingRecordingResultValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingRecordingConstantValues', 'timekeepingRecordingResultDataService',
		'platformDataValidationService', 'basicsLookupdataLookupDataService','$http','$q'];

	function TimekeepingRecordingResultValidationService(platformValidationServiceFactory, timekeepingRecordingConstantValues, timekeepingRecordingResultDataService, platformDataValidationService, basicsLookupdataLookupDataService, $http, $q) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingRecordingConstantValues.schemes.result, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingRecordingConstantValues.schemes.result)
		},
		self,
		timekeepingRecordingResultDataService);

		this.asyncValidateProjectActionFk = function asyncValidateProjectActionFk(entity, value, model){
			if (value !== null){
				var lookupService = basicsLookupdataLookupDataService.registerDataProviderByType('ProjectAction');
				var options = {lookupType: 'ProjectAction', version: 3};
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingRecordingResultDataService);
				asyncMarker.myPromise =  lookupService.getItemByKey(value, options).then(function (item) {
					if (item && item.ProjectFk) {
						entity.ProjectFk = item.ProjectFk;
					} else {
						entity.ProjectFk = null;
					}
				});
			} else {
				entity.ProjectFk = null;
				return $q.when(true);
			}
			return  asyncMarker.myPromise;
		};

		this.validateHours = function validateHours(entity, value, model){
			if (!_.isNil(entity.FromTime) || !_.isNil(entity.ToTime)) {
				entity.FromTime = null;
				entity.ToTime = null;
			}
			return platformDataValidationService.finishValidation(true, entity, true, model, self, timekeepingRecordingResultDataService);
		}

	}
})(angular);
