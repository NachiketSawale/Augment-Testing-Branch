/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardValidationService
	 * @description provides validation methods for logistic card card entities
	 */
	angular.module(moduleName).service('logisticCardValidationService', LogisticCardValidationService);

	LogisticCardValidationService.$inject = ['_', '$http', 'platformValidationServiceFactory', 'logisticCardConstantValues', 'logisticCardDataService', 'platformDataValidationService', 'platformRuntimeDataService', '$injector','logisticCardActivityDataService'];

	function LogisticCardValidationService(_, $http, platformValidationServiceFactory, logisticCardConstantValues, logisticCardDataService, platformDataValidationService, platformRuntimeDataService, $injector,logisticCardActivityDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticCardConstantValues.schemes.card, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardConstantValues.schemes.card),
			uniques: ['Code']
		},
		self,
		logisticCardDataService);

		let readyForDispatchingStates = {};
		let defaultDispatchingStatesByRubricCategory = {};
		InitReadyForDispatchingStates(readyForDispatchingStates, defaultDispatchingStatesByRubricCategory);

		function InitReadyForDispatchingStates(readyFors, defaults){
			var lookup = $injector.get('basicsLookupdataSimpleLookupService');
			lookup.getList({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.customize.jobcardstatus',
				filter: {
					customBoolProperty: 'ISREADYFORDISPATCHING',
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
				}
			}).then(function (response) {
				if(response) {
					_.forEach(response, function(state) {
						if(state.Isreadyfordispatching) {
							readyFors[state.Id] = true;
						}
						if(state.isDefault) {
							defaults[state.BasRubricCategoryFk] = state.Id;
						}
					});
				}
			});
		}

		function isJobCardStatusReadyForDispatching(state) {
			return readyForDispatchingStates[state];
		}

		function getJobCardStatusDefault(rubricCat) {
			return defaultDispatchingStatesByRubricCategory[rubricCat];
		}

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'logistic/card/card/IsCodeUnique', entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, logisticCardDataService);
			});
		};

		self.validateActualStart = function (entity, value, model){
			if (entity.WorkOperationTypeFk && isJobCardStatusReadyForDispatching(entity.JobCardStatusFk)){
				return platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardDataService);
			}
		};

		self.validateActualFinish = function (entity, value, model){
			if (entity.WorkOperationTypeFk && isJobCardStatusReadyForDispatching(entity.JobCardStatusFk)){
				return platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardDataService);
			}
		};

		self.validateWorkOperationTypeFk = function (entity, value) {
			var validResult = {apply: true, valid: true, error: ''};
			if (value  && isJobCardStatusReadyForDispatching(entity.JobCardStatusFk)) {
				var res = platformDataValidationService.validateMandatory(entity, entity.ActualStart, 'ActualStart', self, logisticCardDataService);
				platformRuntimeDataService.applyValidationResult(res, entity, 'ActualStart');
				res = platformDataValidationService.validateMandatory(entity, entity.ActualFinish, 'ActualFinish', self, logisticCardDataService);
				platformRuntimeDataService.applyValidationResult(res, entity, 'ActualFinish');
			} else {
				platformDataValidationService.removeFromErrorList(entity, 'ActualFinish', self, logisticCardDataService);
				platformRuntimeDataService.applyValidationResult(validResult, entity, 'ActualFinish');
				platformDataValidationService.removeFromErrorList(entity, 'ActualStart', self, logisticCardDataService);
				platformRuntimeDataService.applyValidationResult(validResult, entity, 'ActualStart');
			}
			return validResult;
		};

		self.validateJobCardTemplateFk = function (entity, value) {
			entity.IsJobCardTemplateAssigned = !!value;
		};

		self.asyncValidateJobCardTemplateFk = function asyncValidateJobCardTemplateFk(entity, value, model) {
			return $http.post(globals.webApiBaseUrl + 'logistic/cardtemplate/cardtemplate/instance', { Id: value }).then(function (result) {
				if (result.data !== undefined) {
					entity.RubricCategoryFk = result.data.RubricCategoryFk;
				}
				return { apply: true, valid: true };
			},
				function ( /* 'error' */) {
					return { apply: true, valid: true };
				});
		};



		self.validateAdditionalJobFk = function (entity, value) {
			var jobs = $injector.get('basicsLookupdataLookupDescriptorService').getData('logisticJob');
			var job = _.find(jobs, function (j) {
				return j.Id === value;
			});
			if(entity.JobFk !== value){
				let actList = logisticCardActivityDataService.getList().filter(function (actElement) {
					return actElement.JobCardFk === entity.Id;
				});
				_.forEach(actList, function (item) {
					item.ProjectFk = job.ProjectFk;
				});
			}
			if(job){
				entity.PlantFk = job.PlantFk;
			}
			return {apply: true, valid: true};
		};

		self.validateRubricCategoryFk = function (entity, value, model) {
			if (entity.RubricCategoryFk !== value) {
				entity.JobCardStatusFk = getJobCardStatusDefault(value);
				platformDataValidationService.validateMandatory(entity, entity.JobCardStatusFk, 'JobCardStatusFk', self, logisticCardDataService);
			}
			if(entity.Version === 0) {
				const basicsCompanyNumberGenerationInfoService = $injector.get('basicsCompanyNumberGenerationInfoService');
				const infoService =  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticCardNumberInfoService',value);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
					entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
				} else {
					entity.Code = '';
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
				}
				platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', self, logisticCardDataService);


				return platformDataValidationService.finishValidation(!_.isNil(entity.RubricCategoryFk), entity, value, model, self, logisticCardDataService);
			}

			return true;
		};
}
})(angular);
