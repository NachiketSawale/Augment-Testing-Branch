/**
 * @author: chd
 * @date: 6/1/2021 4:44 PM
 * @description:
 */
/**
 * Created by anl on 11/6/2019.
 */


(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAIConfigurationModelListProcessor', processor);

	processor.$inject = ['_', 'platformObjectHelper', 'platformRuntimeDataService'];

	function processor(_, platformObjectHelper, platformRuntimeDataService) {
		let service = {};

		service.processItem = function (item) {
			if (item.Id < 100000) {
				service.setColumnsReadOnly(item, ['Code', 'Description'], true);
			} else {
				service.setColumnsReadOnly(item, ['Code', 'Description'], false);
			}
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			let fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);

