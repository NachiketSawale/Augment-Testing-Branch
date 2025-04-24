/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	var moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineitemParameterProcessService', ['platformRuntimeDataService',
		function(platformRuntimeDataService){
			var service = {};

			service.processItem = function processItem(parameter){
				if(parameter) {
					var fileds = ['ValueDetail', 'UomFk', 'ParameterValue', 'EstRuleParamValueFk','ParameterText'];
					var readonlyFields = [];
					angular.forEach(parameter, function(value, key) {
						if (fileds.indexOf(key) !== -1) {
							if(parameter.ValueType === 4){
								if (key === 'UomFk') {
									readonlyFields.push({field: key, readonly: false});

								} else if (key === 'EstRuleParamValueFk' || key === 'ValueDetail') {
									readonlyFields.push({field: key, readonly: true});
								} else {
									readonlyFields.push({field: key, readonly: false});
								}
							}else{
								if (key === 'UomFk') {
									readonlyFields.push({field: key, readonly: false});
								} else if (key === 'EstRuleParamValueFk') {
									readonlyFields.push({field: key, readonly: !parameter.IsLookup});
								} else {
									readonlyFields.push({field: key, readonly: parameter.IsLookup});
								}
							}
						}
						else {
							readonlyFields.push({field: key, readonly: true});
						}
					});

					readonlyFields.push({field:'DescriptionInfo.Translated', readonly: true});

					platformRuntimeDataService.readonly(parameter, readonlyFields);
				}
			};

			return service;

		}]);



})(angular);
