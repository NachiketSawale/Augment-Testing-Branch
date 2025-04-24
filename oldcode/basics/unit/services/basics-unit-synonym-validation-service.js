(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsUnitSynonymValidationService
	 * @description provides validation methods for unit-synonym instances
	 */
	angular.module('basics.unit').service('basicsUnitSynonymValidationService', BasicsUnitSynonymValidationService);

	BasicsUnitSynonymValidationService.$inject = ['platformDataValidationService', 'basicsUnitSynonymService', 'basicsCommonCodeDescriptionSettingsService'];

	function BasicsUnitSynonymValidationService (platformDataValidationService, basicsUnitSynonymService, basicsCommonCodeDescriptionSettingsService) {
		var self = this;
		var codeMaxLength = -1;

		function assertCodeMaxLength() {
			if(codeMaxLength === -1) {
				var settings = basicsCommonCodeDescriptionSettingsService.getSettings([{typeName: 'UomEntity', modul: 'Basics.Unit'}]);
				codeMaxLength = settings[0].codeLength;
			}
		}

		this.validateSynonym = function (entity, value, model) {
			assertCodeMaxLength();
			if(value.length > codeMaxLength)
			{
				var result = platformDataValidationService.createErrorObject('cloud.common.Error_StringTooLong', { p_0: codeMaxLength });// jshint ignore:line
				return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsUnitSynonymService);
			}
			else
			{
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsUnitSynonymService.getList(), self, basicsUnitSynonymService);
			}
		};

		// Needs to be checked with PM, if the sysnonym must be unique over all data sets in synonym list
		// this.asyncValidateSynonym = function asyncValidateSynonym(entity, value, model) {
		// return platformDataValidationService.asyncValidateIsUnique(globals.webApiBaseUrl + 'basics/unit/synonym/isunique', entity, value, model, false, self, basicsUnitSynonymService);
		// };
	}
})(angular);
