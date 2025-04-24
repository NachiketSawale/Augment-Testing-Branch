/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingValidationService
	 * @description provides validation methods for timekeeping recording recording entities
	 */
	angular.module(moduleName).service('timekeepingRecordingValidationService', TimekeepingRecordingValidationService);

	TimekeepingRecordingValidationService.$inject = ['_', 'platformValidationServiceFactory', 'timekeepingRecordingConstantValues', 'timekeepingRecordingDataService','basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService','platformDataValidationService'];

	function TimekeepingRecordingValidationService(_, platformValidationServiceFactory, timekeepingRecordingConstantValues, timekeepingRecordingDataService,basicsCompanyNumberGenerationInfoService,platformRuntimeDataService,platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingRecordingConstantValues.schemes.recording, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingRecordingConstantValues.schemes.recording)
		},
		self,
		timekeepingRecordingDataService);

		self.validateRubricCategoryFk = function (entity, value, model) {
			if (entity.RubricCategoryFk !== value || entity.Version === 0) {
				let infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('timekeepingRecordingNumberInfoService', value);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
					entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
				} else {
					entity.Code = '';
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
				}
				platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', self, timekeepingRecordingDataService);
				return platformDataValidationService.finishValidation(!_.isNil(entity.RubricCategoryFk), entity, value, model, self, timekeepingRecordingDataService);
			}
		};
	}
})(angular);
