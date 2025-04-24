(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'basics.payment';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var wizardData = [{
					serviceName: 'basicsPaymentSidebarWizardService',
					wizardGuid: '3b2949f29ce243099b1fb627883367b1',
					methodName: 'disablePayment',
					canActivate: true
				}, {
					serviceName: 'basicsPaymentSidebarWizardService',
					wizardGuid: 'c74f6004ca1c45309d6fc6ccb5e016f3',
					methodName: 'enablePayment',
					canActivate: true
				}
				];

				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function(platformSchemaService, basicsConfigWizardSidebarService){
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas( [
								{ typeName: 'PaymentTermDto', moduleSubModule: 'Basics.Payment'}
							] );
						}	]
					}
				};
				platformLayoutService.registerModule(options);
			}
		]).run(['platformTranslateService',function (platformTranslateService) {
		platformTranslateService.registerModule(moduleName);
	}]);
})(angular);