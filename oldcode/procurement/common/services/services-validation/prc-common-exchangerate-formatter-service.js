/**
 * Created by chi on 2018/3/13.
 */
(function(angular){
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonExchangerateFormatterService', procurementCommonExchangerateFormatterService);

	procurementCommonExchangerateFormatterService.$inject = ['_', 'accounting', 'platformContextService', 'platformLanguageService', 'platformDomainService'];

	function procurementCommonExchangerateFormatterService(_, accounting, platformContextService, platformLanguageService, platformDomainService) {

		var culture = platformContextService.culture();
		var cultureInfo = platformLanguageService.getLanguageInfo(culture);
		var domainInfo = platformDomainService.loadDomain('exchangerate');
		// eslint-disable-next-line no-unused-vars
		var precision = domainInfo.precision;// jshint ignore: line
		// eslint-disable-next-line no-unused-vars
		var decimal = cultureInfo[domainInfo.datatype].decimal;// jshint ignore: line
		// eslint-disable-next-line no-unused-vars
		var thousand = cultureInfo[domainInfo.datatype].thousand;// jshint ignore: line

		return {
			test: test
		};
		// /////////////
		function test(value) {
			var result = {apply: true, valid: true};
			if (value === null || angular.isUndefined(value) || value === '') {
				result = {apply: true, valid: false, error: 'required'};
				return result;
			}

			if (value === 0) {
				result = {apply: true, valid: false, error: 'zero is not valid', error$tr$: 'basics.common.validation.zeroIsInvalid', isZero: true};
			}

			return result;
		}
	}
})(angular);