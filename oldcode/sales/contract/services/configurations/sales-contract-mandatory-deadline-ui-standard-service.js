(function () {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).service('ordMandatoryDeadlineLayout', [
		function() {
			return {
				'fid': 'sales.contract.mandatorydeadlinedetailform',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['individualperformance','start','end']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {}
			};
		}]
	);

	angular.module(moduleName).factory('ordMandatoryDeadlineUIStandardFactory', [
		'$injector',
		'platformUIStandardConfigService',
		'salesContractTranslationService',
		'platformSchemaService',
		'ordMandatoryDeadlineLayout',
		function (
			$injector,
			platformUIStandardConfigService,
			salesContractTranslationService,
			platformSchemaService,
			ordMandatoryDeadlineLayout
		) {
			function constructor() {
				var BaseService = platformUIStandardConfigService;
	
				var mandatoryDeadlineAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'OrdMandatoryDeadlineDto',
					moduleSubModule: 'Sales.Common'
				});
				mandatoryDeadlineAttributeDomains = mandatoryDeadlineAttributeDomains.properties;


				function MandatoryDeadlineUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				MandatoryDeadlineUIStandardService.prototype = Object.create(BaseService.prototype);
				MandatoryDeadlineUIStandardService.prototype.constructor = MandatoryDeadlineUIStandardService;

				return new MandatoryDeadlineUIStandardService(ordMandatoryDeadlineLayout, mandatoryDeadlineAttributeDomains, salesContractTranslationService);
			}

			return constructor;
		}
	]);
})();
