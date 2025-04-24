/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';

	angular.module(moduleName).factory('projectCostCodesJobRateProcessor', ['$injector', 'platformRuntimeDataService',
		function($injector, platformRuntimeDataService){

			function processItem(item) {
				if(!item){
					return;
				}
				let prjCostCode = $injector.get('projectCostCodesMainService').getSelected();

				if(!prjCostCode || prjCostCode.Id !== item.ProjectCostCodeFk){
					return;
				}
				setHourfactorReadonly(item, !prjCostCode.IsLabour);
			}

			function setHourfactorReadonly(item, flag) {
				let fields = [
					{field: 'FactorHour', readonly: flag}
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			return {
				processItem : processItem
			};
		}]);

})(angular);
