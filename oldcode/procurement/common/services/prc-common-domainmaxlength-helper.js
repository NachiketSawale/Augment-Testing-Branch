/**
 * Created by lcn on 02/09/2022.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonDomainMaxlengthHelper', ['_', 'platformSchemaService',
		function (_, platformSchemaService) {

			function get(moduleSubModule, typeName, propertyName) {
				const domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: typeName,
					moduleSubModule: moduleSubModule
				});
				if (domainSchema) {
					const findDomainSchema = domainSchema.properties[propertyName];
					if (findDomainSchema && angular.isDefined(findDomainSchema.domainmaxlen)) {
						return findDomainSchema.domainmaxlen;
					}
				}
				return 252;
			}

			return {
				get: get
			};
		}
	]);

})(angular);
