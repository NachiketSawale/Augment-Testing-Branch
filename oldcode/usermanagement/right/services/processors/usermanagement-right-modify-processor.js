/**
 * Created by sandu on 27.10.2015.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.right').factory('usermanagementRightModifyProcessor', usermanagementRightModifyProcessor);
	usermanagementRightModifyProcessor.$inject = ['_', 'platformRuntimeDataService'];

	function usermanagementRightModifyProcessor(_, platformRuntimeDataService) {
		const fieldsDefault = [
			{field: 'Descriptor.Read', readonly: true},
			{field: 'Descriptor.Write', readonly: true},
			{field: 'Descriptor.Create', readonly: true},
			{field: 'Descriptor.Delete', readonly: true},
			{field: 'Descriptor.Execute', readonly: true},
			{field: 'Descriptor.ReadDeny', readonly: true},
			{field: 'Descriptor.WriteDeny', readonly: true},
			{field: 'Descriptor.CreateDeny', readonly: true},
			{field: 'Descriptor.DeleteDeny', readonly: true},
			{field: 'Descriptor.ExecuteDeny', readonly: true}
		];
		const service = {};
		let functionalRoleFilter = false;

		service.functionalRoleFilter = (value) => {
			functionalRoleFilter = value;
		};

		service.processItem = function processItem(item) {
			if (!item.Type) {
				platformRuntimeDataService.readonly(item, fieldsDefault);
				platformRuntimeDataService.hideReadonly(item, _.map(fieldsDefault, item => item.field), true);
			} else {
				const myFields = _.cloneDeep(fieldsDefault);

				for (let i = 0; i < 5; ++i) {
					if (!functionalRoleFilter && (item.Descriptor.Mask & (0x0001 << i)) !== 0) {
						myFields[i].readonly = false;
					}

					if ((item.Descriptor.Mask & (0x0100 << i)) !== 0) {
						myFields[5 + i].readonly = false;
					}
				}

				platformRuntimeDataService.readonly(item, myFields);
				platformRuntimeDataService.hideReadonly(item, _.reduce(myFields, (result, item) => {
					if (item.readonly) {
						result.push(item.field);
					}

					return result;
				}, []), true);
			}
		};

		return service;
	}
})(angular);