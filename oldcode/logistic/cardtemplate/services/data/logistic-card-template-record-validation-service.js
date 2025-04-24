/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateRecordValidationService
	 * @description provides validation methods for logistic cardTemplate record entities
	 */
	angular.module(moduleName).service('logisticCardTemplateRecordValidationService', LogisticCardTemplateRecordValidationService);

	LogisticCardTemplateRecordValidationService.$inject = ['_', '$q', 'platformValidationServiceFactory', 'platformDataValidationService', 'platformRuntimeDataService',
		'logisticCardTemplateRecordDataService', 'logisticCardTemplateConstantValues', 'resourceWorkOperationTypePlantFilterLookupDataService', 'logisticJobCardTemplateRecordProcessorService'];

	function LogisticCardTemplateRecordValidationService(_, $q, platformValidationServiceFactory, platformDataValidationService, platformRuntimeDataService,
		logisticCardTemplateRecordDataService, logisticCardTemplateConstantValues, resourceWorkOperationTypePlantFilterLookupDataService, logisticJobCardTemplateRecordProcessorService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticCardTemplateConstantValues.schemes.cardTemplateRecord, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardTemplateConstantValues.schemes.cardTemplateRecord)
		},
		self, logisticCardTemplateRecordDataService);

		function doValidateCardRecordFk(entity, value, model) {
			if (value === 0) {
				value = null;
			}
			var res = platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardTemplateRecordDataService);
			if (res === true || res && res.valid && !_.isString(value)) {
				logisticCardTemplateRecordDataService.setArticleInformation(entity);
			}
			return res;
		}

		self.validateAdditionalCardRecordFk = function validateArticleFk(entity, value, model) {
			return doValidateCardRecordFk(entity, value, model);
		};

		self.validateAdditionalJobCardRecordTypeFk = function validateAdditionalJobCardRecordTypeFk(entity, value /* , model */) {
			entity.JobCardRecordTypeFk = value;
			self.validateWorkOperationTypeFk(entity, entity.WorkOperationTypeFk, 'WorkOperationTypeFk');

			return true;
		};
		self.validateWorkOperationTypeFk = function validateWorkOperationTypeFk(entity, value, model) {
			var res;
			if(entity.JobCardRecordTypeFk === logisticCardTemplateConstantValues.type.plant) {
				res = platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardTemplateRecordDataService);
				let workOperationType = resourceWorkOperationTypePlantFilterLookupDataService.getItemById(value, {valueMember: 'Id'});
				if (workOperationType) {
					entity.WorkOperationIsHire = workOperationType .IsHire;
					entity.WorkOperationIsMinor = workOperationType.IsMinorEquipment;
					if(workOperationType.IsHire === true && entity.JobCardRecordTypeFk === logisticCardTemplateConstantValues.type.plant)
					{
						entity.Quantity= 1;
						logisticJobCardTemplateRecordProcessorService.processItem(entity);
						self.validateQuantity(entity, entity.Quantity, 'Quantity');
					}
				}
			} else {
				entity.WorkOperationTypeFk = null;

				platformDataValidationService.finishValidation(true, entity, value, model, self, logisticCardTemplateRecordDataService);
				res = true;
			}
			platformRuntimeDataService.applyValidationResult(res, entity, model);

			return res;
		};
	}
})(angular);
