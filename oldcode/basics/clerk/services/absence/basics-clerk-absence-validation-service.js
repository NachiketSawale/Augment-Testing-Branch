/**
 * Created by baf on 09.09.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkAbsenceValidationService
	 * @description provides validation methods for clerk-absence instances
	 */
	var moduleName = 'basics.clerk';
	angular.module(moduleName).service('basicsClerkAbsenceValidationService', BasicsClerkAbsenceValidationService);

	BasicsClerkAbsenceValidationService.$inject = ['platformValidationServiceFactory', 'basicsClerkAbsenceService', 'platformDataValidationService'];

	function BasicsClerkAbsenceValidationService(platformValidationServiceFactory, basicsClerkAbsenceService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'ClerkAbsenceDto',
			moduleSubModule: 'Basics.Clerk'
		}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({
				typeName: 'ClerkAbsenceDto',
				moduleSubModule: 'Basics.Clerk'
			}),
			//periods: [ { from: 'AbsenceFrom', to: 'AbsenceTo'} ]
		},
		self,
		basicsClerkAbsenceService);

		this.validateAbsenceFrom = function validateStartDate(entity, value, model) {
			entity.AbsenceTo = value.clone().add('days', 1);
			return platformDataValidationService.validatePeriod(value, entity.AbsenceTo, entity, model, self, basicsClerkAbsenceService, 'AbsenceTo');
		};

		this.validateAbsenceTo = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.AbsenceFrom, value, entity, model, self, basicsClerkAbsenceService, 'AbsenceFrom');
		};
	}

})(angular);
