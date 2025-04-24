/**
 * Created by shen on 10/2/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.requisition';

	/**
	 * @ngdoc service
	 * @name recourceRequisitionitemRequisitionitemValidationService
	 * @description provides validation methods for recource requisitionitem requisitionitem entities
	 */
	angular.module(moduleName).service('resourceRequisitionItemValidationService', ResourceRequisitionItemValidationService);

	ResourceRequisitionItemValidationService.$inject = ['$injector', 'platformDataValidationService', 'platformValidationServiceFactory', 'resourceRequisitionConstantValues', 'resourceRequisitionItemDataService'];

	function ResourceRequisitionItemValidationService($injector, platformDataValidationService, platformValidationServiceFactory, resourceRequisitionConstantValues, resourceRequisitionItemDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			resourceRequisitionConstantValues.schemes.requisitionItem,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceRequisitionConstantValues.schemes.requisitionItem)
			},
			self,
			resourceRequisitionItemDataService
		);

		self.asyncValidateMaterialFk = function (entity, value, model) {

			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceRequisitionItemDataService);

			asyncMarker.myPromise = new Promise(function (resolve) {
				var res = platformDataValidationService.validateMandatory(entity, value, model, self, resourceRequisitionItemDataService);

				if (res === true || res && res.valid && !_.isString(value)) {
					entity.MaterialFk = value;

					resourceRequisitionItemDataService.asyncUpdateTransitionData(entity, value)
						.then(function () {
							// resourceRequisitionItemDataService.requisitionItemChanged(null, value);
							resolve();
						});

				} else {
					resolve();
				}
			});

			return asyncMarker.myPromise;
		};

	}
})(angular);
