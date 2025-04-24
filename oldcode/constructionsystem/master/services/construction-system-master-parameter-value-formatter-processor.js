(function (angular) {

	'use strict';
	/* jshint -W074 */
	angular.module('constructionsystem.master').factory('constructionSystemMasterParameterValueFormatterProcessor',
		['_', 'moment', 'parameterDataTypes', 'constructionSystemMasterParameterDataService',
			function (_, moment, parameterDataTypes, parentService) {
				return {
					processItem: function processItem(item) {
						var parentItemType;
						if (item !== null && item.CosParameterFk !== null && parentService !== null) {
							var parameterService = parentService.getItemById(item.CosParameterFk);
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
