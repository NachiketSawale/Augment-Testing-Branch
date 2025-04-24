(function () {
	'use strict';
	var moduleName = 'constructionsystem.common';

	/**
	 * @ngdoc service
	 * @name constructionsystemCommonPropertyValueTypeService
	 * @function
	 * @requires
	 *
	 * @description Provides utilities related to value types for use in model properties.
	 */
	angular.module(moduleName).factory('constructionsystemCommonPropertyValueTypeService', [
		'$translate', '$q', '_',
		function ($translate, $q, _) {
			var valueTypes = [
				{
					code: 'string',
					value: 1,
					description: $translate.instant(moduleName + '.filterEditor.stringDescription')
				},
				{
					code: 'decimal',
					value: 2,
					description: $translate.instant(moduleName + '.filterEditor.decimalDescription')
				},
				{
					code: 'integer',
					value: 3,
					description: $translate.instant(moduleName + '.filterEditor.integerDescription')
				},
				{
					code: 'boolean',
					value: 4,
					description: $translate.instant(moduleName + '.filterEditor.booleanDescription')
				},
				{
					code: 'dateTime',
					value: 5,
					description: $translate.instant(moduleName + '.filterEditor.dateTimeDescription')
				}
			];

			function getList() {
				return valueTypes;
			}

			function getListSync() {
				return valueTypes;
			}

			function getListAsync() {
				return $q.when(valueTypes);
			}

			function getItemById(id) {
				return _.find(valueTypes, {value: id});
			}

			function getItemByKey(key) {
				return _.find(valueTypes, {value: key});
			}

			function getItemByIdAsync(id) {
				return $q.when(_.find(valueTypes, {value: id}));
			}

			function getValueTypeDescription(valueType) {
				return _.result(_.find(valueTypes, {value: valueType}), 'description') || '';
			}


			return {
				getList: getList,
				getListSync: getListSync,
				getListAsync: getListAsync,
				getItemById: getItemById,
				getItemByKey: getItemByKey,
				getItemByIdAsync: getItemByIdAsync,
				getValueTypeDescription: getValueTypeDescription
			};
		}
	]);
})();