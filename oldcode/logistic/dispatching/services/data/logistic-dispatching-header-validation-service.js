/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	/* global globals, Platform */
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderValidationService
	 * @description provides validation methods for logistic dispatching header entities
	 */
	angular.module(moduleName).service('logisticDispatchingHeaderValidationService', LogisticDispatchingHeaderValidationService);

	LogisticDispatchingHeaderValidationService.$inject = ['_','$http', '$translate','platformValidationServiceFactory', 'platformContextService', 'basicsLookupdataLookupDataService',
		'logisticDispatchingHeaderDataService', 'basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService', 'platformDataValidationService', 'logisticDispatchingHeaderProcessorService',
		'$q', '$injector'];

	function LogisticDispatchingHeaderValidationService(_, $http, $translate, platformValidationServiceFactory, platformContextService, lookupDataService,
		logisticDispatchingHeaderDataService, basicsCompanyNumberGenerationInfoService, platformRuntimeDataService, platformDataValidationService, logisticDispatchingHeaderProcessorService,
		$q, $injector) {
		var self = this;
		var data = {
			completionEvent: new Platform.Messenger()
		};

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'DispatchHeaderDto',
			moduleSubModule: 'Logistic.Dispatching'
		}, {
			mandatory: ['Code', 'Job1Fk', 'Job2Fk', 'DispatchStatusFk', 'RubricCategoryFk', 'PriceTotal', 'IsSuccess', 'CompanyFk', 'DocumentDate'],
			uniques: ['Code'],
			periods: [
				{from: 'StartDate', to: 'EndDate'}
			]
		},
		self,
		logisticDispatchingHeaderDataService);

		self.asyncValidateRubricCategoryFk = function (entity, value) {
			if (!value) {
				value = 0;
			}
			if (entity.RubricCategoryFk !== value) {
				return $http.get(globals.webApiBaseUrl + 'logistic/dispatching/header/defaultstatus?rubricCategory=' + value).then(function (result) {
					if(_.isNumber(result.data)) {
						entity.DispatchStatusFk = result.data;
						self.validateAdditionalDispatchStatusFk(entity,null,'DispatchStatusFk',true);
						logisticDispatchingHeaderDataService.markItemAsModified(entity);
					}else {
						entity.DispatchStatusFk = null;
						self.validateAdditionalDispatchStatusFk(entity,null,'DispatchStatusFk',true);
					}

					return true;
				});
			}
			return $q.when(true);
		};

		self.validateAdditionalDispatchStatusFk = function (entity, value, model,isExternalCall) {
			if(isExternalCall){
				if(entity.DispatchStatusFk !== 0 && !_.isNil(entity.DispatchStatusFk)){
					return  removeMandatory(entity,model);
				} else {
					return  addMandatory(entity,model);
				}
			}
		};

		self.validateAdditionalRubricCategoryFk = function (entity, value, model) {
			if (entity.RubricCategoryFk !== value || entity.Version === 0) {
				var infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', value);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
					self.validateAdditionalCode(entity,null,'Code',true);
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
				} else {
					self.validateAdditionalCode(entity,null,'Code',true);
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
				}

				return platformDataValidationService.finishValidation(!_.isNil(value), entity, value, model, self, logisticDispatchingHeaderDataService);
			}
		};

		self.validateExchangeRate = function validateExchangeRate(entity, value) {
			var servItem = $injector.get('logisticDispatchingRecordDataService');
			servItem.recalculatePricePortions(value);
			if(entity.LoginCompanyCurrencyFk === entity.CurrencyFk) {
				platformRuntimeDataService.readonly(entity, [{field: 'ExchangeRate', readonly: true}]);
			}
			else{
				platformRuntimeDataService.readonly(entity, [{field: 'ExchangeRate', readonly: false}]);
			}
			return {
				valid: true,
				apply: true
			};
		};
		self.getAsyncCurrentRate = function getAsyncCurrentRate(foreingCurrencyFk, jobFk) {
			var exchangeRateUri = globals.webApiBaseUrl + 'logistic/dispatching/header/defaultrate';
			return $http({
				method: 'Post',
				url: exchangeRateUri,
				params: {
					CurrencyForeignFk: foreingCurrencyFk,
					JobFk: !_.isUndefined(jobFk) ? jobFk : null
				}
			}).then(function (response) {
				return response.data;
			});
		};
		self.validateCurrencyFk = function (entity) {
			logisticDispatchingHeaderProcessorService.processItem(entity);
		};

		self.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, value) {
			return value !== null ?
				self.getAsyncCurrentRate(value, entity.Job2Fk).then(function (exchangeRate) { // Job2Fk = receiving Job
					entity.ExchangeRate = exchangeRate === null ? 1 : exchangeRate;
					self.validateExchangeRate(entity, entity.ExchangeRate, 'ExchangeRate');
				}) :
				$q(function (res) {
					entity.ExchangeRate = 1;
					self.validateExchangeRate(entity, entity.ExchangeRate, 'ExchangeRate');
					return res(true);
				});
		};

		self.asyncReceivingProjectFk = function asyncReceivingProjectFk(entity) {
			var promises = [];
			if (entity.LoginCompanyCurrencyFk !== entity.CurrencyFk) {
				promises.push(self.getAsyncCurrentRate(entity.CurrencyFk, entity.Job2Fk).then(function (exchangeRate) {
					entity.ExchangeRate = exchangeRate === null ? 1 : exchangeRate;
					self.validateExchangeRate(entity, entity.ExchangeRate, 'ExchangeRate');
				}));
			}
			return $q.all(promises).then(function () {
				return true;
			});
		};

		self.validateAdditionalJob1Fk = function validateAdditionalJob1Fk(entity, value) {
			// set source-job-card-list by changing jobfk
			let logisticDispatchingContainerInfoService = $injector.get('logisticDispatchingContainerInformationService');
			let jobCardSourceDataService = logisticDispatchingContainerInfoService.getJobCardSourceWindowConfig().dataServiceName;
			jobCardSourceDataService.setSelectedFilter('jobFk', value, 'jobFk');

			let service = $injector.get('logisticJobDialogLookupPagingDataService');
			let selected = service.getSelected();
			if (selected) {
				entity.PerformingJobGroupFk = selected.JobGroupFk;
				entity.HasPerformingPoolJob = selected.IsPoolJob;
			}

			entity.Job1Fk = value;
			self.notifyEntityCompletion(value, entity.Job2Fk, entity);
		};

		self.validateAdditionalJob2Fk = function validateAdditionalJob2Fk(entity, value) {
			let service = $injector.get('logisticJobDialogLookupPagingDataService');
			let selected = service.getSelected();
			if (selected) {
				entity.ReceivingJobGroupFk = selected.JobGroupFk;
				entity.IncotermFk = selected.IncotermFk;
				entity.HasReceivingPoolJob = selected.IsPoolJob;
			}

			entity.Job2Fk = value;
			self.notifyEntityCompletion(entity.Job1Fk, value, entity);
		};

		self.asyncValidateJob2Fk = function asyncValidateJob2Fk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingHeaderDataService);
			let recValidationService = $injector.get('logisticDispatchingRecordValidationService');
			let allPromises = [
				recValidationService.recalculatePrices(entity, true, false),
				$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobid=' + value)
					.then(function (response){
						if(response && response.data && response.data.ClerkResponsibleFk !== null){
							entity.ClerkReceiverFk = response.data.ClerkResponsibleFk;
						}
					})
			];
			asyncMarker.myPromise = $q.all(allPromises).then(function() {
				return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, logisticDispatchingHeaderDataService);
			});

			return asyncMarker.myPromise;
		};
		self.asyncValidateJob1Fk = function asyncValidateJob1Fk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticDispatchingHeaderDataService);
			let recValidationService = $injector.get('logisticDispatchingRecordValidationService');
			let allPromises = [
				recValidationService.recalculatePrices(entity,true, true),
			];
			asyncMarker.myPromise = $q.all(allPromises).then(function() {
				return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, logisticDispatchingHeaderDataService);
			});

			return asyncMarker.myPromise;
		};

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			if(entity.Version === 0 || entity.Code !== value) {
				return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'logistic/dispatching/header/IsCodeUnique', entity, value, model).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, logisticDispatchingHeaderDataService);
				});
			}

			return $q.when(true);
		};

		self.validateAdditionalCode = function (entity, value, model,isExternalCall) {
			if(isExternalCall) {
				if (!_.isNil(entity.Code) && entity.Code !== '') {
					return removeMandatory(entity, model);
				}
				else {
					return addMandatory(entity, model);
				}
			}
		};

		self.registerCompletionCallback = function registerCompletionCallback(completeCallBackFn) {
			data.completionEvent.register(completeCallBackFn);
		};

		self.unregisterCompletionCallback = function unregisterCompletionCallback(completeCallBackFn) {
			data.completionEvent.unregister(completeCallBackFn);
		};

		self.notifyEntityCompletion = function notifyEntityCompletion(job1, job2, header) {
			if(header.Version === 0 && job1 && job2) {
				data.completionEvent.fire(null, header);
			}
		};

		function removeMandatory(entity, model){
			var result = {apply: true, valid: false};
			result.apply = true;
			result.valid = true;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, true, model, self, logisticDispatchingHeaderDataService);
			return result;
		}

		function addMandatory(entity, model) {
			var result = {apply: true, valid: false};
			result.apply = true;
			result.valid = false;
			result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, false, model, self, logisticDispatchingHeaderDataService);
			return result;
		}

	}
})(angular);
