/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyUtilisableGroupValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('basicsCompanyUtilisableGroupValidationService', BasicsCompanyUtilisableGroupValidationService);

	BasicsCompanyUtilisableGroupValidationService.$inject = ['platformDataValidationService','basicsCompanyUtilisableGroupService'];

	function BasicsCompanyUtilisableGroupValidationService(platformDataValidationService, basicsCompanyUtilisableGroupService) {
		var self = this;

		this.validateGroupFk = function validateGroupFk(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsCompanyUtilisableGroupService.getList(), self, basicsCompanyUtilisableGroupService);
		};


	}
})(angular);