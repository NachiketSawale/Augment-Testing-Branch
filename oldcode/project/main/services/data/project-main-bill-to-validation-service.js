/**
 * Created by baf on 15.05.2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainBillToValidationService
	 * @description provides validation methods for project main billTo entities
	 */
	angular.module(moduleName).service('projectMainBillToValidationService', ProjectMainBillToValidationService);

	ProjectMainBillToValidationService.$inject = ['_', '$http', '$translate', 'platformDataValidationService','platformValidationServiceFactory',
		'projectMainConstantValues', 'projectMainBillToDataService','platformRuntimeDataService', 'businessPartnerLogicalValidator'];

	function ProjectMainBillToValidationService(_, $http, $translate, platformDataValidationService, platformValidationServiceFactory,
		projectMainConstantValues, projectMainBillToDataService, platformRuntimeDataService, businessPartnerLogicalValidator) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.billTo, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.billTo),
				uniques: ['Code']
			},
			self,
			projectMainBillToDataService);

		let businessPartnerValidatorService = businessPartnerLogicalValidator.getService(
			{
				dataService: projectMainBillToDataService, // Required. Determine the data service relates to the validation service
				BusinessPartnerFk: 'BusinessPartnerFk', // Optional. Determine the field name of BusinessPartnerFk of the entity modified if the name is not the same with BusinessPartnerFk.
				SubsidiaryFk: 'SubsidiaryFk', // Optional. Determine the field name of SubsidiaryFk of the entity modified if the name is not the same with SubsidiaryFk.
				CustomerFk: 'CustomerFk', // Optional. Determine the field name of CustomerFk of the entity modified if the name is not the same with CustomerFk.
				needLoadDefaultSupplier: false, // Optional. Whether to load default Supplier or not. Default is true.
				needLoadDefaultCustomer: false,  // Optional. Whether to load default Customer or not. Default is false.
				needLoadDefaultSubsidiary: true,
				customerSearchRequest: { // Optional. Search request for Customer. The request values are sent to server side for query. if needed, user can define their own special search cases. Properties additionalParameters and filterKey are provided.
					additionalParameters: { // Optional. The default paramters are BusinessPartnerFk and SubsidiaryFk, if user want to change the request value of BusinessPartner or SubsidiaryFk, or add more parameters like SubledgerContextFk, user can provide additionalParameters as below:
						SubledgerContextFk: function (entity) { // Key is the name of the parameter. Value is the function in which the value is returned.
							return entity.SubledgerContextFk;
						}
					},
					filterKey: 'project-main-project-customer-filter' // Optional. the filterKey is the serverKey of the filter definition. Default is null.
				}
			}
		);
		this.validateAdditionalBusinessPartnerFk =  function validateAdditionalBusinessPartnerFk (entity, value) {
			const fields = [
				{field: 'SubsidiaryFk', readonly: !value },
				{field: 'CustomerFk', readonly: !value }
			];

			platformRuntimeDataService.readonly(entity, fields);
		};

		this.asyncValidateBusinessPartnerFk =  function asyncValidateBusinessPartnerFk(entity, value, model) {
			// TODO: due to the issue 136614, the backend logic needs to be recheck completely, till now no any changes from the server side
			entity.BusinessPartnerFk = (value !== undefined && value !== null) ? value : -1;

			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainBillToDataService);
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'project/main/billto/validate', entity).then(function (result) {
				if (result.data) {
					entity.CustomerFk = result.data.CustomerFk;
					entity.SubsidiaryFk = result.data.SubsidiaryFk;

				}
				businessPartnerValidatorService.businessPartnerValidator(entity, value, false, false);
				return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, projectMainBillToDataService);
			});

			return asyncMarker.myPromise;
		};

		this.validateQuantityPortion = function validateQuantityPortion(entity, value, model) {
			let items = projectMainBillToDataService.getList();
			if(value > 100.0) {
				return platformDataValidationService.finishValidation({
					apply: true,
					valid: false,
					error$tr$: 'project.main.errQuantityPortionToBig'
				}, entity, value, model, self, projectMainBillToDataService);
			} else {
				let sumOfQuantityPortion = value;

				_.forEach(items, function(item) {
					if(item.Id !== entity.Id) {
						sumOfQuantityPortion += item.QuantityPortion;
					}
				});
				_.forEach(items, function(item) {
					item.TotalQuantity = sumOfQuantityPortion;
					if(item.Id !== entity.Id) {
						projectMainBillToDataService.fireItemModified(item);
					}
				});

				if(sumOfQuantityPortion > 100.0) {
					entity.IsMarkedForTotalQuantityGreaterAsHundred = true;
					return platformDataValidationService.finishValidation({
						apply: true,
						valid: false,
						error$tr$: 'project.main.errQuantityTotalGreaterAsHundred'
					}, entity, value, model, self, projectMainBillToDataService);
				} else {
					_.forEach(items, function(item) {
						if(item.IsMarkedForTotalQuantityGreaterAsHundred) {
							item.IsMarkedForTotalQuantityGreaterAsHundred = false;
							platformDataValidationService.finishValidation({
								apply: true,
								valid: true
							}, item, item.QuantityPortion, model, self, projectMainBillToDataService);
						}
					});
				}
			}
			_.forEach(items, function(item) {
				platformRuntimeDataService.applyValidationResult({
						apply: true,
						valid: true
					},
					item, 'QuantityPortion');
				projectMainBillToDataService.fireItemModified(item);
			});

			return platformDataValidationService.finishValidation({
				apply: true,
				valid: true
			}, entity, value, model, self, projectMainBillToDataService);

		};

		this.validateTotalPercentage = function validateTotalPercentage(entity, value, model) {
			if(value > 100.0) {
				return platformDataValidationService.finishValidation({
					apply: true,
					valid: false,
					error$tr$: 'logistic.dispatching.errSerialPlantRecordWrongQuantity'
				}, entity, value, model, self, projectMainBillToDataService);
			}

		};
	}
})(angular);
