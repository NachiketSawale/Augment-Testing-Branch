/**
 * Created by anl on 4/13/2017.
 * Drastically improved by baf on 2018-02-14
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeTaxCodeValidationService', BasicsCustomizeTaxCodeValidationService);
	BasicsCustomizeTaxCodeValidationService.$inject = ['_','platformValidationServiceFactory', 'platformDataValidationService',
		'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeTaxCodeValidationService(_, platformValidationServiceFactory, platformDataValidationService,
		basicsCustomizeInstanceDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterfaceFromProperties({
			LedgerContextFk: {domain: 'integer'},
			Code: {domain: 'code'},
			VatPercent: {domain: 'percent'},
			VatPercentDominant: {domain: 'percent'}
		},
		{
			mandatory: ['LedgerContextFk', 'Code', 'VatPercent', 'VatPercentDominant']
		},
		self,
		basicsCustomizeInstanceDataService);

		function doValidateUniqueComposite(entity, value, model, theOther) {
			if (_.isNil(theOther)) {
				return platformDataValidationService.validateIsUniqueComposite(entity, [{
					model: model,
					value: value
				}, theOther], basicsCustomizeInstanceDataService.getList(), 'Ledger context and code', self, basicsCustomizeInstanceDataService);
			}

			return true;
		}

		this.validateAdditionalCode = function validateCode(entity, value, model) {
			return doValidateUniqueComposite(entity, value, model, {
				model: 'LedgerContextFk',
				value: entity.LedgerContextFk
			});
		};

		this.validateAdditionalLedgerContextFk = function validateLedgerContextFk(entity, value, model) {
			return doValidateUniqueComposite(entity, value, model, {
				model: 'Code',
				value: entity.Code
			});
		};
	}
})(angular);
