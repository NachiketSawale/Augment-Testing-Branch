(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceReservationValidationService
	 * @description provides validation methods for reservation
	 */
	var moduleName='resource.reservation';
	angular.module(moduleName).service('resourceReservationValidationService', ResourceReservationValidationService);

	ResourceReservationValidationService.$inject = ['$http','resourceReservationValidationServiceFactory', 'resourceReservationDataService', 'platformDataValidationService','platformValidationServiceFactory'];

	function ResourceReservationValidationService($http,resourceReservationValidationServiceFactory, resourceReservationDataService, platformDataValidationService, platformValidationServiceFactory) {
		resourceReservationValidationServiceFactory.createReservationValidationService(this, resourceReservationDataService);

		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface({

			typeName: 'ReservationDto',
			moduleSubModule: 'Resource.Reservation'
		},
			{
				mandatory: ['RequisitionTypeFk', 'Code']
			},
			self,
			resourceReservationDataService);


		self.asyncValidateRequisitionFk = function (entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceReservationDataService);
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'basics/lookupdata/masternew/getitembykey?lookup=resourcerequisition', { Id: value })
				.then(function (response) {
					if (response && response.data && response.data.Code) {
						entity.Code = response.data.Code;
						self.asyncValidateCode(entity, entity.Code, model);
					}
					platformDataValidationService.ensureNoRelatedError(entity, model, ['Code'], self, resourceReservationDataService);
					return platformDataValidationService.validateMandatory(entity, value, 'RequisitionFk', self, resourceReservationDataService);
				});
			return asyncMarker.myPromise;
		};

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'resource/reservation/IsCodeUnique', entity, value, model).then(function (response) {
				// response.apply = response;
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourceReservationDataService);
			});
		};

	}
})(angular);
