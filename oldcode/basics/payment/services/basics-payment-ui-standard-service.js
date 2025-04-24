(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.payment';

	/**
	 * @ngdoc service
	 * @name basicsPaymentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of payment entities
	 */
	angular.module(moduleName).factory('basicsPaymentUIStandardService',
		['platformUIStandardConfigService', 'basicsPaymentTranslationService', 'basicsLookupdataConfigGenerator' , 'platformSchemaService',

			function (platformUIStandardConfigService, basicsPaymentTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						fid: 'basics.payment.paymentdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'payment',
								attributes: [ 'code','codefinance','descriptioninfo','netdays','discountdays','discountpercent','calculationtypefk','dayofmonth',
									'printdescriptioninfo','printtextdescriptioninfo',
									'sorting', 'isdefault', 'isdateinvoiced', 'month','islive','isdefaultcreditor','isdefaultdebtor']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							calculationtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.calculationtype'),
							islive: {'readonly': true}
						}
					};
				}
				var paymentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var paymentAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'PaymentTermDto', moduleSubModule: 'Basics.Payment'});
				paymentAttributeDomains = paymentAttributeDomains.properties;


				function PaymentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				PaymentUIStandardService.prototype = Object.create(BaseService.prototype);
				PaymentUIStandardService.prototype.constructor = PaymentUIStandardService;

				return new BaseService(paymentDetailLayout, paymentAttributeDomains, basicsPaymentTranslationService);
			}
		]);
})();
