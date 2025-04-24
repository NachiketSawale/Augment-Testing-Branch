/**
 * Created by zwz on 3/28/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';
	/**
	 * @ngdoc service
	 * @name resourceMasterPoolResourceProcessor
	 * @function
	 * @requires platformRuntimeDataService, resourceMasterContextService
	 *
	 * @description
	 * resourceMasterPoolResourceProcessor is the service to set fields  dynamically readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('resourceMasterPoolResourceProcessor', resourceMasterPoolResourceProcessor);

	resourceMasterPoolResourceProcessor.$inject = ['platformRuntimeDataService', 'resourceMasterContextService'];

	function resourceMasterPoolResourceProcessor(platformRuntimeDataService, moduleContext) {

		var service = {};

		service.processItem = function processItem(item) {
			var readOnlyStatus = moduleContext.isReadOnly;
			if (readOnlyStatus) {
				service.setRowReadonlyFromLayout(item, readOnlyStatus);
			} else {
				var flag = item.Version > 0;
				service.setColumnReadOnly(item, 'ResourceSubFk', flag);
			}
		};

		service.setRowReadonlyFromLayout = function setColumnReadOnly(item, flag) {
			var fields = [
				{field: 'ResourceSubFk', readonly: flag},
				{field: 'Validto', readonly: flag},
				{field: 'Quantity', readonly: flag},
				{field: 'Validfrom', readonly: flag},
				{field: 'CommentText', readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
