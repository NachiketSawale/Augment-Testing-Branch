/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';

	angular.module(moduleName).factory('ProjectCostCodesProcessor', ['$injector', 'platformRuntimeDataService', 'PlatformMessenger',
		function($injector, platformRuntimeDataService, PlatformMessenger){

			let service= {
				processItem : processItem,
				processIsChildAllowed : processIsChildAllowed,
				onChildAllowedChanged : new PlatformMessenger()
			};

			function processItem(item) {
				if(!item){
					return;
				}

				let  isEditable = !item.MdcCostCodeFk;

				let isCodeEditable = isEditable && item.Version === 0;
				let isChildAllowed = item.BasCostCode && item.BasCostCode.IsProjectChildAllowed;
				let isChildAllowedReadOnly = item.IsChildAllowed && item.ProjectCostCodes && item.ProjectCostCodes.length;

				let fields = [];
				fields = [
					{field: 'Code', readonly: !isCodeEditable},
					{field: 'Description', readonly: !isEditable},
					{field: 'Description2', readonly: !isEditable},
					{field: 'MdcCostCodeFk', readonly: !isEditable},
					{field: 'LgmJobFk', readonly: true},
					{field: 'CostCodePortionsFk', readonly: !isEditable},
					{field: 'CostGroupPortionsFk', readonly: !isEditable},
					{field: 'AbcClassificationFk', readonly: !isEditable},
					{field: 'PrcStructureFk', readonly: !isEditable},
					{field: 'ContrCostCodeFk', readonly: !isEditable},
					{field: 'CostCodeTypeFk', readonly: !isEditable},
					{field: 'UserDefined1', readonly: !isEditable},
					{field: 'UserDefined2', readonly: !isEditable},
					{field: 'UserDefined3', readonly: !isEditable},
					{field: 'UserDefined4', readonly: !isEditable},
					{field: 'UserDefined5', readonly: !isEditable},
					{field: 'IsChildAllowed', readonly: (!isChildAllowed || isChildAllowedReadOnly)}
				];
				platformRuntimeDataService.readonly(item, fields);

			}

			function processIsChildAllowed(item) {
				if(!item){
					return;
				}
				service.onChildAllowedChanged.fire(item);
			}

			return service;
		}]);

})(angular);
