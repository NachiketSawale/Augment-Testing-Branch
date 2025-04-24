(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementCommonProcessFieldInForeignKeyEntityService', procurementCommonProcessFieldInForeignKeyEntityService);

	procurementCommonProcessFieldInForeignKeyEntityService.$inject = ['_', 'basicsLookupdataLookupDescriptorService'];

	function procurementCommonProcessFieldInForeignKeyEntityService(_, basicsLookupdataLookupDescriptorService) {
		var service = {};
		service.processFieldInForeignKeyEntity = processFieldInForeignKeyEntity;
		return service;

		function processFieldInForeignKeyEntity(foreignKeyValue, forignKeyLookupType, targetFieldNameInForeignKeyEntity, callbackWhenNotEmptyValue, callBackWhenEmptyValue) {
			if (foreignKeyValue !== null && foreignKeyValue !== undefined) {
				var foreignKeyList = basicsLookupdataLookupDescriptorService.getData(forignKeyLookupType);
				var project = foreignKeyList[foreignKeyValue];
				var targetFieldValueInForeignKeyEntity = project[targetFieldNameInForeignKeyEntity];
				checkIsFunctionThenCall(callbackWhenNotEmptyValue, targetFieldValueInForeignKeyEntity);
			} else {
				checkIsFunctionThenCall(callBackWhenEmptyValue);
			}
		}

		function checkIsFunctionThenCall(fun, param) {
			if (_.isFunction(fun)) {
				fun(param);
			}
		}
	}
})(angular);