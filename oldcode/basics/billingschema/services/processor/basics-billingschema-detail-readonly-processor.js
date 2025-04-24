/**
 * Created by wui on 1/24/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.billingschema';

	angular.module(moduleName).factory('BasicsBillingSchemaDetailReadOnlyProcessor', ['platformRuntimeDataService', 'basicsBillingSchemaBillingLineType',
		function (platformRuntimeDataService, basicsBillingSchemaBillingLineType) {
			var field = {
				formula: 'Formula',
				sqlStatement: 'SqlStatement'
			};

			return function BasicsBillingSchemaDetailReadOnlyProcessor() {
				this.processItem = function (item) {
					if (item.BillingLineTypeFk === basicsBillingSchemaBillingLineType.formula) {
						platformRuntimeDataService.readonly(item, [{field: field.formula, readonly: false}]);
					}
					else {
						platformRuntimeDataService.readonly(item, [{field: field.formula, readonly: true}]);
					}

					if (item.BillingLineTypeFk === basicsBillingSchemaBillingLineType.configurableLine) {
						platformRuntimeDataService.readonly(item, [{field: field.sqlStatement, readonly: false}]);
					}
					else {
						platformRuntimeDataService.readonly(item, [{field: field.sqlStatement, readonly: true}]);
					}
				};
			};
		}
	]);

})(angular);