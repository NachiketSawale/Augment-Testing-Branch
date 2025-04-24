/**
 * Created by baf on 12.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupAccountValidationService
	 * @description provides validation methods for resource equipmentGroup account entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupAccountValidationService', ResourceEquipmentGroupAccountValidationService);

	ResourceEquipmentGroupAccountValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupAccountDataService'];

	function ResourceEquipmentGroupAccountValidationService(platformValidationServiceFactory, resourceEquipmentGroupConstantValues, resourceEquipmentGroupAccountDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentGroupConstantValues.schemes.groupAccount, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.groupAccount)
			},
			self,
			resourceEquipmentGroupAccountDataService);

		self.validateAdditionalLedgerContextFk = function validateAdditionalLedgerContextFk(entity, value, model) {

			if (entity.LedgerContextFk !== value) {
				entity.Account01Fk = null;
				entity.Account02Fk = null;
				entity.Account03Fk = null;
				entity.Account04Fk = null;
				entity.Account05Fk = null;
				entity.Account06Fk = null;
			}
		};
	}
})(angular);
