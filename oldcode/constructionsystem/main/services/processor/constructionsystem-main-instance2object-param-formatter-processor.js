(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';

	/* jshint -W074 */
	angular.module(moduleName).factory('constructionSystemMainInstance2ObjectParamFormatterProcessor',
		['_', 'moment', 'parameterDataTypes', 'basicsLookupdataLookupDescriptorService',
			function (_, moment, parameterDataTypes, basicsLookupdataLookupDescriptorService) {
				return function (servicePrefixName) {
					servicePrefixName = servicePrefixName || 'constructionSystemMainInstance2ObjectParamService';
					var self = this;
					self.processItem = function processItem(item) {
						var parameterItem;
						var items = basicsLookupdataLookupDescriptorService.getData('CosParameter');
						if (items) {
							parameterItem = items[item.ParameterFk];
						}
						if (item.ParameterValueVirtual && parameterItem) {
							if (parameterItem.IsLookup) {
								if ((!angular.isDefined(item.ParameterValueFk) || item.ParameterValueFk === null) &&
									(angular.isDefined(item.ParameterValue) && item.ParameterValue !== null)) {
									var newParameterValues = [];
									item.ParameterValueVirtual = servicePrefixName + item.Id;

									newParameterValues.push({
										Id: item.ParameterValueVirtual,
										Description: item.ParameterValue,
										ParameterValue: item.ParameterValue
									});

									basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', newParameterValues);
								}

								return;
							}
							switch (parameterItem.ParameterTypeFk) {
								case parameterDataTypes.Integer:
								case parameterDataTypes.Decimal1:
								case parameterDataTypes.Decimal2:
								case parameterDataTypes.Decimal3:
								case parameterDataTypes.Decimal4:
								case parameterDataTypes.Decimal5:
								case parameterDataTypes.Decimal6:
									item.ParameterValueVirtual = item.ParameterValueVirtual ? Number(item.ParameterValueVirtual) : null;
									break;
								case parameterDataTypes.Boolean:
									if (angular.isString(item.ParameterValueVirtual)) {
										item.ParameterValueVirtual = _.toLower(item.ParameterValueVirtual) === 'true';
									} else if (!item.ParameterValueVirtual) {
										item.ParameterValueVirtual = false;
									}
									break;
								case parameterDataTypes.Date:
									item.ParameterValueVirtual = item.ParameterValueVirtual ? moment.utc(item.ParameterValueVirtual) : null;
									break;
								case parameterDataTypes.Text:
									item.ParameterValueVirtual = item.ParameterValueVirtual ? item.ParameterValueVirtual :
										item.ParameterValueVirtual = null;
									break;
							}

						}
					};
				};
			}]);

})(angular);
