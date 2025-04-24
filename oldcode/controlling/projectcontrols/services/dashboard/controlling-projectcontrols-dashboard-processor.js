(function (angular) {
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectcontrolsDashboardProcessor',
		['platformRuntimeDataService', 'projectControlsColumnType', 'controllingProjectControlsConfigService',
			function (platformRuntimeDataService, projectControlsColumnType, configService) {

				let service = {};

				service.processItem = function processItem(item, data) {
					let readonlyTypes = [];

					if (item.EditableInfo) {
						if(!item.EditableInfo.IsControllingUnitEditable){
							readonlyTypes.push(projectControlsColumnType.SAC);
						}

						if(!item.EditableInfo.IsWCFBCFEditable){
							readonlyTypes.push(projectControlsColumnType.WCF);
							readonlyTypes.push(projectControlsColumnType.BCF);
							readonlyTypes.push(projectControlsColumnType.CUSTOM_FACTOR);
						}
					}else{
						readonlyTypes.push(projectControlsColumnType.SAC);
						readonlyTypes.push(projectControlsColumnType.WCF);
						readonlyTypes.push(projectControlsColumnType.BCF);
						readonlyTypes.push(projectControlsColumnType.CUSTOM_FACTOR);
					}

					_.forEach(configService.getEditableColumnFieldByType(readonlyTypes), function(code){
						platformRuntimeDataService.readonly(item, [{field: code, readonly: true}]);
					})

					data.renderFilterOptions(item);
				};

				service.processItems = function processItems(items,gc) {
					angular.forEach(items, function (item) {
						service.processItem(item);
					});
				};

				return service;
			}]);
})(angular);