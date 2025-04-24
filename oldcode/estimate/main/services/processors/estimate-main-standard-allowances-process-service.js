
(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainStandardAllowanceProcessor',
		['_','$q', '$injector', 'platformRuntimeDataService','platformPermissionService',
			function (_,$q, $injector, platformRuntimeDataService,platformPermissionService) {

				let service = {
					processItem : processItem,
				};

				function processItem(item) {
					if(!item || item.Id < 0){
						return;
					}
					let allFieldsReadOnly = [];
					if(!platformPermissionService.hasWrite('681223e37d524ce0b9bfa2294e18d650')){
						_.forOwn(item, function (value, key) {
							let field = {field: key, readonly: true};
							allFieldsReadOnly.push(field);
						});
						platformRuntimeDataService.readonly(item, allFieldsReadOnly);
					}else if(item.Version > 0 && item.MdcAllowanceTypeFk === 3){
						let field = {field: 'MdcAllowanceTypeFk', readonly: true};
						allFieldsReadOnly.push(field);
						platformRuntimeDataService.readonly(item, allFieldsReadOnly);
					}
				}

				return service;
			}]);
})(angular);
