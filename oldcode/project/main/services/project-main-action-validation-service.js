/**
 * Created by cakiral on 05.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainActionValidationService
	 * @description provides validation methods for project main action entities
	 */
	angular.module(moduleName).service('projectMainActionValidationService', ProjectMainActionValidationService);

	ProjectMainActionValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainActionDataService', 'platformDataValidationService',
		'basicsLookupdataLookupDataService'];

	function ProjectMainActionValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainActionDataService, platformDataValidationService,
	                                            basicsLookupdataLookupDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.action, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.action)
		},
		self,
		projectMainActionDataService);

		this.asyncValidateActivityFk = function validateActivityFkImpl(entity, value, model){
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainActionDataService);
			var lookupService = basicsLookupdataLookupDataService.registerDataProviderByType('SchedulingActivityNew');
			var options = {lookupType: 'SchedulingActivityNew', version: 3};

			asyncMarker.myPromise = lookupService.getItemByKey(value, options).then(function(item) {
				if (item) {
					entity.ControllingUnitFk = item.ControllingUnitFk;
				}
				return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, projectMainActionDataService);
			});

			return asyncMarker.myPromise;
		};
	}
})(angular);
