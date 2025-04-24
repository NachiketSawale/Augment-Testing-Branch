/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutInputPhaseGroupValidationService
	 * @description provides validation methods for timekeeping layout inputPhaseGroup entities
	 */
	angular.module(moduleName).service('timekeepingLayoutInputPhaseGroupValidationService', TimekeepingLayoutInputPhaseGroupValidationService);

	TimekeepingLayoutInputPhaseGroupValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingLayoutConstantValues', 'timekeepingLayoutInputPhaseGroupDataService', 'platformDataValidationService'];

	function TimekeepingLayoutInputPhaseGroupValidationService(platformValidationServiceFactory, timekeepingLayoutConstantValues, timekeepingLayoutInputPhaseGroupDataService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingLayoutConstantValues.schemes.inputPhaseGroup, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingLayoutConstantValues.schemes.inputPhaseGroup)
		},
		self,
		timekeepingLayoutInputPhaseGroupDataService);

		self.validateDescriptionInfo = function (entity, value, model) {
			if(value !== null && value.Description === null)
			{
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingLayoutInputPhaseGroupDataService);
		};
	}
})(angular);
