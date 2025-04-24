/**
 * Created by jes on 9/9/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterParameterTypeConverter', constructionSystemMasterParameterTypeConverter);

	constructionSystemMasterParameterTypeConverter.$inject = ['_', 'parameterDataTypes', 'moment'];

	function constructionSystemMasterParameterTypeConverter(_, parameterDataTypes, moment) {
		return {
			/* jshint -W074 */
			convertValue: function convertValue(parameterTypeId, value) {
				var temp;
				switch (parameterTypeId) {
					case parameterDataTypes.Integer:
					case parameterDataTypes.Decimal1:
					case parameterDataTypes.Decimal2:
					case parameterDataTypes.Decimal3:
					case parameterDataTypes.Decimal4:
					case parameterDataTypes.Decimal5:
					case parameterDataTypes.Decimal6:
						temp = value !== null && value !== undefined ? Number(value) : null;
						break;
					case parameterDataTypes.Boolean:
						if (_.isBoolean(value)) {
							temp = value;
						} else if (_.isString(value)) {
							temp = (value.toLowerCase() === 'true');
						} else {
							temp = false;
						}
						break;
					case parameterDataTypes.Date:
						temp = value ? moment.utc(value) : null;
						break;
					case parameterDataTypes.Text:
						temp = value ? String(value) : null;
						break;
					default :
						temp = null;
						break;
				}
				return temp;
			}
		};
	}

})(angular);