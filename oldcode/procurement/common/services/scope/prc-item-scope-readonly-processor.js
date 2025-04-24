/**
 * Created by wui on 10/25/2018.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeReadOnlyProcessor', ['platformRuntimeDataService',
		function (platformRuntimeDataService) {
			return function (parentService) {
				return {
					processItem: function (item) {
						var parent = parentService.getSelected();
						var readonly = (_.isNil(parent) || _.isNil(parent.MdcMaterialFk));
						platformRuntimeDataService.readonly(item, [{field: 'MatScope', readonly: readonly}]);
					}
				};
			};
		}
	]);

})(angular);