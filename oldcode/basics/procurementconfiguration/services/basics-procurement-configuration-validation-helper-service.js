/**
 * Created by chi on 11/2/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).factory('basicsProcurementConfigurationValidationHelperService', basicsProcurementConfigurationValidationHelperService);

	basicsProcurementConfigurationValidationHelperService.$inject = ['_', '$translate'];

	function basicsProcurementConfigurationValidationHelperService(_, $translate) {
		let service = {};

		service.createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction = createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction;

		return service;

		function createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction(platformDataValidationService,
																		 modelPrcTexttypeFk, modelTextModuleTypeFk) {
			return function isPrcrtextTypeFkAndTextModuleTypeFkUnique(list, id, newObj) {
				if (_.some(list, function (item) {
					if (item.Id === id) {
						return false;
					}
					let isSame = (item[modelPrcTexttypeFk] || null) === (newObj[modelPrcTexttypeFk] || null);
					return isSame && (item[modelTextModuleTypeFk] || null) === (newObj[modelTextModuleTypeFk] || null);
				})) {
					let errMsgObj =  '[' + $translate.instant(moduleName + '.textType') + ', ' + $translate.instant(moduleName + '.textModuleType') + ']';
					return platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage',
						{object: errMsgObj});
				}
				return {apply: true, valid: true};
			};
		}
	}
})(angular);