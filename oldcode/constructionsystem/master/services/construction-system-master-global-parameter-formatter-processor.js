/**
 * Created by lvy on 4/23/2018.
 */
(function (angular) {

	'use strict';
	var modulename = 'constructionsystem.master';

	angular.module(modulename).factory('constructionSystemMasterGlobalParameterFormatterProcessor',
		['moment','parameterDataTypes', '_',function (moment,parameterDataTypes, _) {
			return {
				processItem: function processItem(item) {
					if(item.IsLookup)
					{
						item.DefaultValue = item.DefaultValue !== null ? Number(item.DefaultValue) : null;
						return;
					}
					switch (item.CosParameterTypeFk) {
						case parameterDataTypes.Integer:
						case parameterDataTypes.Decimal1:
						case parameterDataTypes.Decimal2:
						case parameterDataTypes.Decimal3:
						case parameterDataTypes.Decimal4:
						case parameterDataTypes.Decimal5:
						case parameterDataTypes.Decimal6:
							item.DefaultValue = item.DefaultValue !== null ? Number(item.DefaultValue) : null;
							break;
						case parameterDataTypes.Boolean:
							if (angular.isString(item.DefaultValue)){
								item.DefaultValue = _.toLower(item.DefaultValue) ==='true';
							} else if (!item.DefaultValue) {
								item.DefaultValue = false;
							}

							break;
						case parameterDataTypes.Date:
							item.DefaultValue = item.DefaultValue !== null ? moment.utc(item.DefaultValue) : null;
							break;
						case parameterDataTypes.Text:
							item.DefaultValue = item.DefaultValue ? item.DefaultValue.toString() : null;
							break;
						default :
							item.DefaultValue = null;
							break;
					}
				}
			};
		}]);

})(angular);
