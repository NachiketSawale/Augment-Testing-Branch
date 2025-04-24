(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('materialPriceConditionValueFormatter',
		['platformGridDomainService',
			function (platformGridDomainService) {
				return function complexFormatter(row, cell, value, columnDef, dataContext) {

					columnDef.formatterOptions = columnDef.formatterOptions || {
						domainType: 'currency'
					};
					var controlFieldValue = _.get(dataContext, columnDef.formatterOptions.controlField);

					if (!controlFieldValue) {
						return '';
					}

					var domain = columnDef.formatterOptions.domainType;

					var displayMember = columnDef.formatterOptions.displayMember;
					var domainTypeFormatter = platformGridDomainService.formatter(domain);
					if (value && typeof value === 'object' && displayMember) {
						value = _.get(value, displayMember);
					}
					if (domainTypeFormatter && typeof domainTypeFormatter === 'function') {
						value = domainTypeFormatter(row, cell, value, columnDef, dataContext);
					}

					return value || '';
				};
			}]);
})(angular);
