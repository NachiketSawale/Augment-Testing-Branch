/**
 * Created by baf on 08.05.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainReferenceValidationService
	 * @description provides validation methods for change main reference entities
	 */
	angular.module(moduleName).service('changeMainReferenceValidationService', ChangeMainReferenceValidationService);

	ChangeMainReferenceValidationService.$inject = ['platformValidationServiceFactory', 'changeMainConstantValues', 'changeMainReferenceDataService'];

	function ChangeMainReferenceValidationService(platformValidationServiceFactory, changeMainConstantValues, changeMainReferenceDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(changeMainConstantValues.schemes.changeReference, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(changeMainConstantValues.schemes.changeReference)
		},
		self,
		changeMainReferenceDataService);

		this.validateAdditionalChangeAssignmentFk = function validateAdditionalChangeAssignmentFk(entity, value) {
			entity.ReferenceFk = value;
			entity.ChangeReferenceFk = value;
			self.validateChangeReferenceFk(entity, value, 'ChangeReferenceFk');

			return true;
		};
	}
})(angular);
