/**
 * Created by xsi on 2016-03-24.
 */
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';

	/* jshint -W074 */
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterFormatterProcessor',
		['basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'constructionSystemMasterParameterTypeConverter',
			function (basicsLookupdataLookupDescriptorService, platformRuntimeDataService, parameterTypeConverter) {
				return {
					processItem: function processItem(item) {
						var parameterItem;
						var items = basicsLookupdataLookupDescriptorService.getData('CosParameter');
						if (items) {
							parameterItem = items[item.ParameterFk];
						}
						if (parameterItem) {
							item.VariableName = parameterItem.VariableName; // for script validation
							if (parameterItem.IsLookup) {
								item.ParameterValueVirtual = item.ParameterValueVirtual ? Number(item.ParameterValueVirtual) : null;
								item.ParameterValue = parameterTypeConverter.convertValue(parameterItem.ParameterTypeFk, item.ParameterValue);
								item.InputValue = item.ParameterValue; // for script validation
							} else {
								item.ParameterValueVirtual = parameterTypeConverter.convertValue(parameterItem.ParameterTypeFk, item.ParameterValueVirtual);
								item.InputValue = item.ParameterValueVirtual;
							}
							addRuntimeMethod(item, 'ParameterValueVirtual');  // for script validation
						}

						function addRuntimeMethod(param, model) {
							if(!Object.prototype.hasOwnProperty.call(param,'rt$hasError')) {
								param.rt$hasError = function () {
									return platformRuntimeDataService.hasError(param, model);
								};
							}
							if(!Object.prototype.hasOwnProperty.call(param,'rt$errorText')) {
								param.rt$errorText = function () {
									return platformRuntimeDataService.getErrorText(param, model);
								};
							}
							if(!Object.prototype.hasOwnProperty.call(param,'rt$readonly')) {
								param.rt$readonly = function () {
									return !param || platformRuntimeDataService.isReadonly(param, model);
								};
							}
							if(!Object.prototype.hasOwnProperty.call(param,'rt$show')) {
								param.rt$show = function () {
									var show = true;
									if(param.__rt$data) {
										if(param.__rt$data.hide !== undefined && param.__rt$data.hide !== null) {
											show = !param.__rt$data.hide;
										}
									}
									return show;
								};
							}
						}
					}
				};
			}]);

})(angular);
