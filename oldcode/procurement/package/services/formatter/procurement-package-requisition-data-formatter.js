/**
 * Created by wwa on 8/21/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('procurementPackageReqDataFormatter',
		['platformGridDomainService', function (platformGridDomainService) {
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