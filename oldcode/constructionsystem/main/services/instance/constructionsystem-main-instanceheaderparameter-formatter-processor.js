/**
 * Created by lvy on 4/26/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';

	/* jshint -W074 */
	angular.module(moduleName).factory('constructionSystemMainInstanceHeaderParameterFormatterProcessor',
		['basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'constructionSystemMasterParameterTypeConverter',
			function (basicsLookupdataLookupDescriptorService, platformRuntimeDataService, parameterTypeConverter) {
				return {
					processItem: function processItem(item) {
						var parameterItem;
						var items = basicsLookupdataLookupDescriptorService.getData('cosglobalparam');
						if (items) {
							parameterItem = items[item.CosGlobalParamFk];
						}
						if (parameterItem) {
							item.VariableName = parameterItem.VariableName;
							if (parameterItem.IsLookup) {
								item.ParameterValueVirtual = item.ParameterValueVirtual ? Number(item.ParameterValueVirtual) : null;
								item.ParameterValue = item.ParameterValueVirtual;
							} else {
								item.ParameterValueVirtual = parameterTypeConverter.convertValue(parameterItem.CosParameterTypeFk, item.ParameterValueVirtual);
							}
						}
					}
				};
			}]);

})(angular);