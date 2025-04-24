/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';

	angular.module(moduleName).factory('hourfactorReadonlyProcessor', ['platformRuntimeDataService', function(platformRuntimeDataService){

		let service= {
			processItem : processItem,
			setHourfactorReadonly : setHourfactorReadonly,
			processIsEditable : processIsEditable
		};

		function processItem(item) {
			if(!item){
				return;
			}
			setHourfactorReadonly(item, !item.IsLabour);
			processIsEditable(item);
			processIsProjectChildAllowed(item);
		}

		function setHourfactorReadonly(item, flag) {
			// eslint-disable-next-line no-prototype-builtins
			let fieldName = item.hasOwnProperty('FactorHour') ? 'FactorHour' : 'HourFactor';
			let fields = [
				{field: fieldName, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		}

		function processIsEditable(item, value, field) {
			if(!item){return;}
			let flag = true;
			let fields = [];
			if(item.HasChildren){
				fields = [
					{field: 'IsEditable', readonly: true}
				];
			}else if(field === 'IsEditable'){
				flag = value;
				fields = [
					{field: 'IsLabour', readonly: flag},
					{field: 'IsRate', readonly: flag}
				];
			}
			else{
				switch (field){
					case 'IsLabour' :
						flag = !value && !item.IsRate && !item.HasChildren ? false : true;
						break;
					case 'IsRate' :
						flag = !value && !item.IsLabour && !item.HasChildren ? false : true;
						break;
					default :
						flag = !item.IsLabour && !item.IsRate ? false : true;
						break;
				}
				fields = [
					{field: 'IsEditable', readonly: flag}
				];
			}
			platformRuntimeDataService.readonly(item, fields);
		}

		function processIsProjectChildAllowed(item){
			if(!item){
				return;
			}

			let readOnly = item && !item.CostCodeParentFk;

			let fields = [{field: 'IsProjectChildAllowed', readonly: readOnly}];

			platformRuntimeDataService.readonly(item, fields);
		}
		
		return service;
	}]);

})(angular);
