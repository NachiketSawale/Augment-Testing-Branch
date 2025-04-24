(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name controllingCommonTranslationService
	 * @description provides translation for controlling module
	 */

	const moduleName='controlling.common';
	const procurementPackageModule = 'procurement.package';
	const cloudCommonModule = 'cloud.common';

	angular.module(moduleName).service('controllingCommonTranslationService', ['platformUIBaseTranslationService',
		function (platformUIBaseTranslationService) {

			var controllingStructureTranslations = {
				translationInfos: {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						BusinesspartnerName: {'location': procurementPackageModule, 'identifier': 'entityContract.businessPartnerName', 'initial': 'Business Partner Name'},
						ContractCode: {'location': cloudCommonModule, 'identifier': 'entityCode', 'initial': 'Contract Code'},
						ContractDescription: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Description'},
						ContractStatusFk: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Status'},
						Plannedstart: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Status'},
						Plannedend: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Status'},
						Actualstart: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Status'},
						Actualend: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Status'},
						Prcvalue: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'Contract Status'},
					}
				}
			};
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, [controllingStructureTranslations], localBuffer);
		}
	]);
})(angular);
