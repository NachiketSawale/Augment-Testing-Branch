(function (angular) {
	/* global globals,  */
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobValidationService
	 * @description provides validation methods for jobs
	 */
	var moduleName = 'logistic.job';
	angular.module(moduleName).service('logisticJobValidationService', LogisticJobValidationService);

	LogisticJobValidationService.$inject = ['_', '$q', '$translate', 'moment', '$injector', '$http', 'platformDataValidationService',
		'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'logisticJobDataService', 'logisticSettlementConstantValues',
		'platformValidationServiceFactory', 'basicsCompanyNumberGenerationInfoService', 'platformValidationRevalidationEntitiesFactory',
		'logisticJobReadonlyProcessorService'
	];

	function LogisticJobValidationService(_, $q, $translate, moment, $injector, $http, platformDataValidationService,
		platformRuntimeDataService, lookupDescriptorService, logisticJobDataService, logisticSettlementConstantValues,
		platformValidationServiceFactory, basicsCompanyNumberGenerationInfoService, platformValidationRevalidationEntitiesFactory,
		logisticJobReadonlyProcessorService
	) {
		var self = this;
		var schemeId = {
			typeName: 'JobDto',
			moduleSubModule: 'Logistic.Job'
		};
		platformValidationServiceFactory.addValidationServiceInterface(
			schemeId,
			{
				mandatory: ['LogisticContextFk', 'JobTypeFk', 'RubricCategoryFk', 'CompanyFk', 'IsLive', 'CalCalendarFk', 'IsProjectDefault', 'CurrencyFk']
			},

			self,
			logisticJobDataService);

		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			schemeId,
			{
				customValidations: [
					{
						model: 'SettledByTypeFk',
						revalidateGrid: [
							{model: 'PlantFk'},
							{model: 'PlantGroupFk'},
							{model: 'BusinessPartnerFk'},
							{model: 'CustomerFk'},
							{model: 'ControllingUnitFk'}
						],
						revalidateOnlySameEntity: true
					},
					{
						model: 'PlantFk',
						revalidateGrid: [{model: 'PlantGroupFk'}],
						revalidateOnlySameEntity: true
					},{
						model: 'PlantGroupFk',
						revalidateGrid: [{model: 'PlantFk'}],
						revalidateOnlySameEntity: true
					},{
						model: 'ControllingUnitFk',
						revalidateGrid: [{}],
						revalidateOnlySameEntity: true
					},{
						model: 'BusinessPartnerFk',
						revalidateGrid: [{}],
						revalidateOnlySameEntity: true
					},{
						model: 'CustomerFk',
						revalidateGrid: [{}],
						revalidateOnlySameEntity: true
					}],
				globals:{
					revalidateOnlySameEntity: true
				}
			},
			self,
			logisticJobDataService);


		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'logistic/job/IsCodeUnique', entity, value, model).then(function (response) {
				// response.apply = response;
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, logisticJobDataService);
			});
		};

		self.validateValidFrom = function (entity, value, model) {

			// Due to the following ALM "115567 - Logistic Job_The "End Warranty Date" message should appear
			// but it should allow the user to save the logistic job" The next line has been commented out.
			// The ALM is not completely fulfilled therefore we left the statement here.
			// A warning dialog is required for this task.
			// The framework still has to offer this functionality. Therefore, the validation on the End Warranty Date has been removed.
			// After the framework has provided the functionality, this function of the end warranty date validation can be embedded again.

			// platformDataValidationService.validatePeriodBetweenValidFromAndEndWarranty(validFromUTC, endWarrantyUTC, entity, model, self, logisticJobDataService, 'EndWarranty');
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, logisticJobDataService, 'ValidTo');
		};

		self.validateValidTo = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, logisticJobDataService, 'ValidFrom');
		};

		self.asyncValidateJobTypeFk = function (entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticJobDataService);
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/jobtype/instance', {Id: value})
				.then(function (response) {
					if (response && response.data && response.data.RubricCategoryFk) {
						entity.RubricCategoryFk = response.data.RubricCategoryFk;
					}
					var infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticJobNumberInfoService',35);

					if (infoService.hasToGenerateForRubricCategory(entity.RubricCategoryFk)) {
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
						entity.Code = infoService.provideNumberDefaultText(entity.RubricCategoryFk, entity.Code);
						// entity.Code = infoService.provideNumberDefaultText(entity.RubricCategoryFk, entity.Code);
					} else {
						// TODO: proper Code value reset
						//   Setting Code to '' violates current validation policy: "Code must not be empty"
						entity.Code = '';
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
					}
					let selectedJob = logisticJobDataService.getSelected();

					selectedJob.IsMaintenance = response.data.IsMaintenance;
					selectedJob.IsJointVenture = response.data.IsJointVenture;
					selectedJob.IsLoadingCostForBillingType = response.data.HasLoadingCost && response.data.IsJointVenture;
					if(!selectedJob.IsLoadingCostForBillingType){
						selectedJob.HasLoadingCost = false;
					}
					if(!response.data.IsJointVenture) {
						selectedJob.BillingJobFk = null;
					}
					logisticJobReadonlyProcessorService.processItem(entity);
					// return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, logisticJobDataService);
					platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', self, logisticJobDataService);
					return platformDataValidationService.finishValidation(!_.isNil(entity.RubricCategoryFk), entity, value, model, self, logisticJobDataService);

				});
			return asyncMarker.myPromise;
		};

		self.validateAdditionalPlantGroupFk = function validateAdditionalPlantGroupFk(entity, value, model) {
			if(logisticSettlementConstantValues.settledbytypes.Plant === entity.SettledByTypeFk){
				return self.validatePlantOrPlantGroupFkMandatory(entity,entity.PlantFk, value);
			}
			else{
				return platformDataValidationService.createSuccessObject();
			}
		};

		self.validatePlantOrPlantGroupFkMandatory = function validatePlantOrPlantGroupFkMandatory(entity, newPlantFk, newPlantGroupuFk) {
			if (platformDataValidationService.isEmptyProp(newPlantFk) && platformDataValidationService.isEmptyProp(newPlantGroupuFk)){
				return platformDataValidationService.createErrorObject(
					'logistic.job.emptyOrNullValueErrorMessage',
					{fieldName1: $translate.instant('logistic.job.plant'),fieldName2: $translate.instant('logistic.job.plantgroup')});
			}
			else{
				return platformDataValidationService.createSuccessObject();
			}
		};

		self.validateAdditionalPlantFk = function validateAdditionalPlantFk(entity, value, model) {
			if(logisticSettlementConstantValues.settledbytypes.Plant === entity.SettledByTypeFk){
				return self.validatePlantOrPlantGroupFkMandatory(entity,value,entity.PlantGroupFk);
			}
			else{
				return platformDataValidationService.createSuccessObject();
			}
		};

		self.validateAdditionalCustomerFk = function validateAdditionalCustomerFk(entity, value, model) {
			if (logisticSettlementConstantValues.settledbytypes.Customer === entity.SettledByTypeFk) {
				return platformDataValidationService.validateMandatory(entity, value, model, self, logisticJobDataService);
			}
			else {
				return platformDataValidationService.createSuccessObject();
			}
		};

		self.validateProjectFk = function (entity, value, model) {
			var fields = [
				{
					field: 'ControllingUnitFk',
					readonly: !value
				},
				{
					field: 'AddressPrjFk',
					readonly: !value
				}

			];
			platformRuntimeDataService.readonly(entity, fields);
			var ctxService = $injector.get('platformContextService');
			var clientId = ctxService.getContext().clientId;
			if (value) {
				var prjService = $injector.get('logisticProjectByLgmContextLookupDataService');
				var prj = prjService.getItemById(value, {lookupTyp: 'projectbylgmcontext'});
				entity.CompanyFk = prj ? prj.CompanyFk : clientId;
			} else {
				entity.CompanyFk = clientId;
			}

			if (value === 0) {
				return platformDataValidationService.validateMandatory(entity, null, model, self, logisticJobDataService);
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, logisticJobDataService);
		};

		self.validateAdditionalControllingUnitFk = function validateAdditionalControllingUnitFk(entity, value, model) {
			var valid = true;
			if(logisticSettlementConstantValues.settledbytypes.ControllingUnit === entity.SettledByTypeFk){
				valid = platformDataValidationService.validateMandatory(entity, value, model, self, logisticJobDataService);
			}
			if (!_.isUndefined(value) && !_.isNull(value)) {
				var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				var list = basicsLookupdataLookupDescriptorService.getData('controllingunit');
				var cu = _.find(list,{'Id':value});
				if (cu) {
					if (_.isNil(entity.Code)) {
						entity.Code = cu.Code;
					}
					if (_.isNil(entity.Description)) {
						entity.Description = cu.Description;
					}
				}
			}
			return valid;
		};

		self.validateCostCodePriceVersionFk = function (entity, value) {
			var versions = lookupDescriptorService.getData('CostCodePriceVersion');
			if (versions) {
				var version = versions[value];
				if (version) {
					entity.PriceListFk = version.PriceListFk;
				}
			}
		};

		self.validateCostCodePriceListFk = function (entity, value) {
			var versions = lookupDescriptorService.getData('CostCodePriceVersion');
			if (versions && entity.CostCodePriceVersionFk !== null) {
				var version = versions[entity.CostCodePriceVersionFk];
				if (version && value !== version.PriceListFk) {
					entity.CostCodePriceVersionFk = null;
				}
			}
		};

		self.validateAdditionalBusinessPartnerFk = function validateAdditionalBusinessPartnerFk(entity, value, model) {
			var valid = platformDataValidationService.createSuccessObject();
			if(logisticSettlementConstantValues.settledbytypes.Customer === entity.SettledByTypeFk){
				valid = platformDataValidationService.validateMandatory(entity, value, model, self, logisticJobDataService);
			}
			platformRuntimeDataService.readonly(entity, [
				{
					field: 'DeliveryAddressContactFk',
					readonly: !value
				}]);
			return valid;
		};

		self.asyncValidateAdditionalBusinessPartnerFk = function asyncValidateAdditionalBusinessPartnerFk(entity, value, model) {
			return applyAsyncFieldTest({Field2Validate: 1, NewIntValue: value, Job: entity, Model: model})
				.then(function (bizResult) {
					if((bizResult === true || bisResult.Valid) && logisticSettlementConstantValues.settledbytypes.Customer === entity.SettledByTypeFk) {
						return platformDataValidationService.validateMandatory(entity, entity.CustomerFk, 'CustomerFk', self, logisticJobDataService);
					}

					return bizResult;
				});
		};

		self.asyncValidatePlantFk = function (entity, value, model) {
			var defer = $q.defer();
			var plantId = {Id: value};
			var plantService = $injector.get('resourceEquipmentPlantDataService');
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, plantService);
			if (value !== null) {
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'resource/equipment/plantcomponent/listByParent', {PKey1: value})
					.then(function (response) {
						if (response && response.data && response.data.length) {
							const components = response.data;
							const allEndWarrantyDates = components.map(function (component) {
								return Date.parse(component.EndWarranty);
							});
							const validEndWarrantyDates = allEndWarrantyDates.filter(function (EndWarranty) {
								return !Number.isNaN(EndWarranty);
							});

							if (validEndWarrantyDates.length > 0) {
								var minEndWarranty = Math.min(validEndWarrantyDates);

								entity.EndWarranty = moment.utc(minEndWarranty);
							} else {
								// No warranty dates were set for this plantFk
								entity.EndWarranty = null;
							}
						}
					})
					.then(function () {
						return $http.post(globals.webApiBaseUrl + 'resource/equipment/plant/getbyid', plantId);
					})
					.then(function (response) {
						if (angular.isObject(response)) {

							entity.PlantGroupFk = response.data.PlantGroupFk;
						}
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, null, self, logisticJobDataService);
					});

			} else {
				entity.PlantGroupFk = null;
				defer.resolve(true);
				asyncMarker.myPromise = defer.promise;
			}

			return asyncMarker.myPromise;
		};

		function applyAsyncFieldTest(validationSpec) {
			if(_.isNil(validationSpec.NewIntValue)) {
				return $q.when(true);
			}
			var asyncMarker = platformDataValidationService.registerAsyncCall(validationSpec.Job, validationSpec.NewIntValue, validationSpec.Model, logisticJobDataService);
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/job/validate', validationSpec).then(function (result) {
				if (!result.data.ValidationResult) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'project.main.errors.thisIsAnUnknwonBusinessPartner',
						error$tr$param: {}
					}, validationSpec.Job, validationSpec.NewIntValue, validationSpec.Model, asyncMarker, self, logisticJobDataService);
				} else {
					logisticJobDataService.takeOver(result.data.Job);
					return platformDataValidationService.finishAsyncValidation(true, validationSpec.Job, validationSpec.NewIntValue, validationSpec.Model, asyncMarker, self, logisticJobDataService);
				}
			});

			return asyncMarker.myPromise;
		}
	}
})(angular);
