/**
 * Created by lvy on 4/12/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	/* jshint -W074 */
	angular.module(moduleName).factory('constructionSystemMasterGlobalParameterValueFormatterProcessor',
		['_','moment','parameterDataTypes','constructionSystemMasterGlobalParameterDataService',
			function (_,moment,parameterDataTypes,parentService) {
				return {
					processItem: function processItem(item) {
						var parentItemType;
						if (item !== null && item.CosGlobalParamFk !== null && parentService !== null) {
							var parameterService = parentService.getItemById(item.CosGlobalParamFk);
							parentItemType = parameterService !== null ? parameterService.CosParameterTypeFk : null;
						}

						switch (parentItemType) {
							case parameterDataTypes.Integer:
							case parameterDataTypes.Decimal1:
							case parameterDataTypes.Decimal2:
							case parameterDataTypes.Decimal3:
							case parameterDataTypes.Decimal4:
							case parameterDataTypes.Decimal5:
							case parameterDataTypes.Decimal6:
								item.ParameterValue = Number(item.ParameterValue);
								break;
							case parameterDataTypes.Boolean:
								if (!_.isBoolean(item.ParameterValue)) {
									item.ParameterValue = _.toLower(item.ParameterValue) === 'true';
								}
								break;
							case parameterDataTypes.Date:
								item.ParameterValue = moment.utc(item.ParameterValue);
								break;
							case parameterDataTypes.Text:
								item.ParameterValue = item.ParameterValue ? String(item.ParameterValue) : null;
								break;
							default :
								item.ParameterValue = null;
								break;
						}
					}
				};
			}]);

})(angular);
