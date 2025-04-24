/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTimekeepingGroupValidationService
	 * @description provides validation methods for basics company timekeepingGroup entities
	 */
	angular.module(moduleName).service('basicsCompanyTimekeepingGroupValidationService', BasicsCompanyTimekeepingGroupValidationService);

	BasicsCompanyTimekeepingGroupValidationService.$inject = ['$q', '$http', '$translate', 'platformDataValidationService', 'platformModalService', 'platformValidationServiceFactory', 'basicsCompanyConstantValues', 'basicsCompanyTimekeepingGroupDataService' ];

	function BasicsCompanyTimekeepingGroupValidationService( $q, $http, $translate, platformDataValidationService, platformModalService, platformValidationServiceFactory, basicsCompanyConstantValues, basicsCompanyTimekeepingGroupDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(basicsCompanyConstantValues.schemes.timekeepingGroup, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(basicsCompanyConstantValues.schemes.timekeepingGroup)
		}, self, basicsCompanyTimekeepingGroupDataService);

		self.validateIsDefault = function (entity, value) {
			return self.validateIsDefault(entity, value);
		};

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(basicsCompanyTimekeepingGroupDataService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
						basicsCompanyTimekeepingGroupDataService.markItemAsModified(item);
					});
				basicsCompanyTimekeepingGroupDataService.markItemAsModified(entity);
				basicsCompanyTimekeepingGroupDataService.gridRefresh();
			}
			return { apply: value, valid: true };
		};

	}
})(angular);

