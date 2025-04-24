(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonBizPartnerValidationServiceFactory', ['$injector',
		'$q', '$http', '_', 'globals', 'platformDataValidationService', 'platformValidationServiceFactory',

		function ($injector, $q, $http, _, globals, platformDataValidationService, platformValidationServiceFactory) {

			var serviceCache = {};

			function createValidationService(dataService) {
				var service = {};

				// in daily DB, 0 is valid value for ID of table BPD_BUSINESSPARTNER;
				// in customer DB, 0 may be invalid.
				// for validation, we need to know if 0 is valid value as a businesspartner ID in advance.
				var zeroIsValidBpId = false;
				$http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getItem?mainItemId=0').then(function (result) {
					//zeroIsValidBpId = result.data.length > 0;
					zeroIsValidBpId = result.data && result.data.Id === 0;
				});

				platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'CommonBizPartnerDto',
					moduleSubModule: 'ProductionPlanning.Common'
				}, {
					mandatory: ['RoleFk', 'BusinessPartnerFk', 'SubsidiaryFk']
				}, service, dataService);

				service.validateSubsidiaryFk = function (entity, value, model) {
					if(value === 0){
						value = null;
					}
					var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					dataService.gridRefresh(); // there is strange thing that the UI is not updated after triggering validation of field SubsidiaryFk on validation-wizard dialog, so we have to do gridRefresh here
					return result;
				};

				// do mandatory validation first for field `BusinessPartnerFk`
				service.validateBusinessPartnerFk = function (entity, value, model) {
					// If value is 0 and O is invalid in the DB, then mandatory validation will not passed, and user will be require to enter a valid value for field BusinessPartnerFk on the UI.
					if(value === 0 && !zeroIsValidBpId)
					{
						value = null;
					}
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				};

				service.asyncValidateBusinessPartnerFk = asyncValidateBusinessPartnerFk;

				function asyncValidateBusinessPartnerFk(entity, value) {
					return applyAsyncFieldTest({Prj2BP: entity, NewBusinessPartner: value});
				}

				function applyAsyncFieldTest(validationSpec) {
					if (_.isNil(validationSpec.Prj2BP.SubsidiaryFk)) {
						validationSpec.Prj2BP.SubsidiaryFk = 0; // for project2bp validation, we need to set empty SubsidiaryFk of Prj2BP with 0
					}
					var defer = $q.defer();
					// if validation passed, entity.SubsidiaryFk will also be set meanwhile in server side.
					$http.post(globals.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec).then(function (result) {
						dataService.takeOver(result.data);
						defer.resolve(true);
					});

					return defer.promise;
				}

				return service;
			}

			function getService(dataService) {
				var key = dataService.getServiceName();
				if (!serviceCache[key]) {
					serviceCache[key] = createValidationService(dataService);
				}
				return serviceCache[key];
			}

			return {
				getService: getService
			};
		}
	]);
})(angular);
