/**
 * Created by wui on 12/7/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';
	
	angular.module(moduleName).factory('basicsLookupdataDomainService', ['accounting',
		'platformDomainService',
		'platformContextService',
		'platformLanguageService',
		function(accounting, platformDomainService, platformContextService, platformLanguageService) {
			var service = {};

			service.lookupOptionsByDomain = function (domainType, options) {
				var settings = {};
				var domainInfo = platformDomainService.loadDomain(domainType);

				if(domainInfo){
					settings.regex = getRegex(options, domainInfo);
				}

				switch (domainType) {
					case 'money':
						{
							settings.formatter = numberFormatter;
							settings.textAlign = 'right';
						}
						break;
				}

				return settings;
			};

			function getRegex(config, domain) {
				var regex = domain.regex;

				if (domain.regexTemplate) {
					var regexTemplate = domain.regexTemplate;

					if (config.maxLength) {
						regexTemplate = regexTemplate.replace(/@@maxLength/g, config.maxLength);
					}

					if (config.decimalPlaces) {
						regexTemplate = regexTemplate.replace(/@@decimalPlaces/g, config.decimalPlaces);
					}

					if (regexTemplate !== domain.regexTemplate) {
						regex = regexTemplate;
					}
				}

				return regex;
			}

			function numberFormatter(value, lookupItem, displayValue, context) {
				var culture = platformContextService.culture(),
					cultureInfo = platformLanguageService.getLanguageInfo(culture),
					domainInfo = platformDomainService.loadDomain(context.domain);

				if (_.isNumber(displayValue)) {
					return accounting.formatNumber(displayValue, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
				}
				else {
					return displayValue;
				}
			}

			return service;
		}
	]);

})(angular);