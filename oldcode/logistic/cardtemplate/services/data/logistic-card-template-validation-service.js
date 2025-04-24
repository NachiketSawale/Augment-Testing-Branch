/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateValidationService
	 * @description provides validation methods for logistic cardTemplate cardTemplate entities
	 */
	angular.module(moduleName).service('logisticCardTemplateValidationService', LogisticCardTemplateValidationService);

	LogisticCardTemplateValidationService.$inject = ['_', '$injector','platformValidationServiceFactory', 'logisticCardTemplateConstantValues', 'logisticCardTemplateDataService','platformDataValidationService'];

	function LogisticCardTemplateValidationService(_, $injector, platformValidationServiceFactory, logisticCardTemplateConstantValues, logisticCardTemplateDataService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticCardTemplateConstantValues.schemes.cardTemplate, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticCardTemplateConstantValues.schemes.cardTemplate)
		},
		self,
		logisticCardTemplateDataService);


		self.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value, model) {
			if(entity.Version === 0) {
				setDefaultForRubricCategoryFk(entity);
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, logisticCardTemplateDataService);
		};

		function setDefaultForRubricCategoryFk(entity) {
			var service = $injector.get('basicsLookupdataSimpleLookupService');
			var jobCardAreaLookup = service.getData({
				lookupModuleQualifier: 'basics.lookup.rubriccategory',
				displayMember: 'Description',
				valueMember: 'Id'
			});
			var defaultEntity = _.find(jobCardAreaLookup, function (item) {return item.isDefault && item.RubricFk === 37;});
			entity.RubricCategoryFk = defaultEntity.Id;
		}
	}
})(angular);
