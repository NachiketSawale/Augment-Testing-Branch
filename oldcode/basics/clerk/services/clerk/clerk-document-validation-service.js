/**
 * Created by pel on 3/21/2019.
 */
(function (angular) {
	'use strict';

	angular.module('basics.clerk').service('clerkDocumentValidationService', ClerkDocumentValidationService);

	ClerkDocumentValidationService.$inject = ['platformDataValidationService','clerkDocumentDataService'];

	function ClerkDocumentValidationService(platformDataValidationService, clerkDocumentDataService) {
		var self = this;
		self.validateClerkDocumentTypeFk = function validateClerkDocumentTypeFk  (entity, value, model) {
			if(value > 0) {
				return platformDataValidationService.validateMandatory(entity, value, 'ClerkDocumentTypeFk', self, clerkDocumentDataService);
			} else {
				var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'ClerkDocumentTypeFk'} );
				return platformDataValidationService.finishValidation(result, entity, value, 'ClerkDocumentTypeFk', self, clerkDocumentDataService);
			}
		};
	}

})(angular);

