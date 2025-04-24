/**
 * Created by spr on 2017-05-08.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleParameterTypeDataService', ['_', '$q', '$translate',
		function (_, $q, $translate) {
			let parameterTypes = [{
				Id: 1,
				Description: $translate.instant('estimate.rule.parameter.valueType.double')
			}, {
				Id: 2,
				Description: $translate.instant('estimate.rule.parameter.valueType.boolean')
			}, {
				Id: 3,
				Description: $translate.instant('estimate.rule.parameter.valueType.text')
			}, {
				Id: 4,
				Description: $translate.instant('estimate.rule.parameter.valueType.TextFormula')
			}];
			return {
				getList: function () {
					return $q.when(parameterTypes);
				},
				getItemByKey: function (key) {
					return $q.when(_.find(parameterTypes, {Id: key}));
				},
				getDefault: function () {
					return $q.when(parameterTypes[0]);
				},
				getItemById: function (id) {
					return _.find(parameterTypes, {Id: id});
				},
				getSearchList: function () {
					return $q.when(parameterTypes);
				},
				getParameterTypes: function(){
					return parameterTypes;
				},

				getItemByIdAsync:function(key){
					return $q.when(_.find(parameterTypes, {Id: key}));
				},
				Types: {
					DOUBLE: 1,
					BOOLEAN: 2,
					TEXT:3,
					TEXTFORMULA:4
				}
			};
		}]);

})(angular);
