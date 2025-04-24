/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardRecordValidationService
	 * @description provides validation methods for logistic card record entities
	 */
	angular.module(moduleName).service('logisticCardRecordValidationService', LogisticCardRecordValidationService);

	LogisticCardRecordValidationService.$inject = ['_', '$q', '$translate', 'platformValidationServiceFactory', 'logisticCardConstantValues', 'logisticCardRecordDataService',
		'platformRuntimeDataService', 'platformDataValidationService', 'resourceWorkOperationTypePlantFilterLookupDataService', 'logisticJobCardRecordProcessorService'];

	function LogisticCardRecordValidationService(_, $q, $translate, platformValidationServiceFactory, logisticCardConstantValues, logisticCardRecordDataService,
		platformRuntimeDataService, platformDataValidationService, resourceWorkOperationTypePlantFilterLookupDataService, logisticJobCardRecordProcessorService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticCardConstantValues.schemes.record, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardConstantValues.schemes.record)
		},
		self,
		logisticCardRecordDataService);


		self.validateQuantity = function validateQuantity(entity, value, model) {
			if (!_.isNil(value)) {
				entity.DeliveredQuantity = value;
			}
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardRecordDataService);

			if (result === true || result && result.valid) {
				self.validateDeliveredQuantity(entity, value, 'DeliveredQuantity', self, logisticCardRecordDataService);
			}

			return result;
		};

		self.validateDeliveredQuantity = function validateDeliveredQuantity(entity, value, model) {
			if (!_.isNil(value)) {
				entity.AcceptedQuantity = value;
			}
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardRecordDataService);
			if (result === true || result && result.valid) {
				self.validateAcceptedQuantity(entity, value, 'AcceptedQuantity', self, logisticCardRecordDataService);
			}
			return result;
		};

		self.validateAcceptedQuantity = function validateAcceptedQuantity(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardRecordDataService);
		};

		self.validateAdditionalJobCardRecordTypeFk = function validateAdditionalJobCardRecordTypeFk(entity, value) {
			// Only plants can define a WorkOperationType
			var readonly = true;
			if (value !== 1) {
				entity.WorkOperationTypeFk = null;
			} else {
				readonly = false;
			}
			platformRuntimeDataService.readonly(entity, [{ field: 'WorkOperationTypeFk', readonly: readonly }]);

			// check Wot for mandatory
			var isMandatoryForWot = value === logisticCardConstantValues.types.record.plant;
			setWoTExternalToMandatoryIfPlantType(entity, value,'WorkOperationTypeFk', isMandatoryForWot);

			self.validateProcurementStructureFk(entity, entity.ProcurementStructureFk, 'ProcurementStructureFk');

			return true;
		};

		this.validateProcurementStructureFk = function validateProcurementStructureFk(entity, value, model) {
			var checkValue = value;
			if(_.isNil(checkValue) && _.isNil(entity.MaterialFk)) {
				checkValue = 1;// Value can be null, so we do validation with a value in order to get rid of old validation errors ...
			}

			platformDataValidationService.validateMandatory(entity, checkValue, model, self, logisticCardRecordDataService);
		};

		self.asyncValidateCardRecordFk = function validateArticleFk(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticCardRecordDataService);
			asyncMarker.myPromise = logisticCardRecordDataService.setArticleInformation(entity, value).then(function(result) {
				return platformDataValidationService.finishAsyncValidation(true, result, value, model, asyncMarker, self, logisticCardRecordDataService);
			});

			return asyncMarker.myPromise;
		};

		self.validateWorkOperationTypeFk = function validateWorkOperationTypeFk(entity, value, model) {
			return setWoTInternalToMandatoryIfPlantType(entity, value, model);
		};

		function setWoTExternalToMandatoryIfPlantType(entity, value, model, isMandatory) {
			var result = {apply: true, valid: false};
			result.valid = isMandatory && !entity.WorkOperationTypeFk?  result.valid = false : result.valid = true;
			result.error = isMandatory ? $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model}): result.error;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, logisticCardRecordDataService, logisticCardRecordDataService);
		}

		function setWoTInternalToMandatoryIfPlantType(entity, value, model) {
			var result = {apply: true, valid: false};
			var plant = logisticCardConstantValues.types.record.plant;
			let workOperationType = resourceWorkOperationTypePlantFilterLookupDataService.getItemById(value, {valueMember: 'Id'});
			if (workOperationType) {
				entity.WorkOperationIsHire = workOperationType .IsHire;
				entity.WorkOperationIsMinor = workOperationType.IsMinorEquipment;
				if(workOperationType.IsHire === true && entity.JobCardRecordTypeFk === plant)
				{
					entity.Quantity= 1;
					logisticJobCardRecordProcessorService.processItem(entity);
					self.validateQuantity(entity, entity.Quantity, 'Quantity');
				}
			}
			result.valid = entity.JobCardRecordTypeFk === plant && !value ? result.valid = false : result.valid = true;
			result.error = entity.JobCardRecordTypeFk === plant && !value ? $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model}): result.error;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, logisticCardRecordDataService, logisticCardRecordDataService);
			return result;
		}

	}
})(angular);
