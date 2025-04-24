/**
 * Created by sus on 2015/6/16.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,console,_ */
	angular.module('procurement.common').factory('procurementCommonDataEnhanceProcessor',
		['$injector','platformRuntimeDataService','platformObjectHelper',
			function ($injector,platformRuntimeDataService,platformObjectHelper) {

				return function enhanceProcessor(dataProcessServiceFun,configures, isReadonly) {
					var canReadonlyModels = [];
					var add = function (columns, fieldFun) {
						angular.forEach(columns, function (column) {
							if (canReadonlyModels.indexOf(fieldFun(column)) === -1) {
								canReadonlyModels.push(fieldFun(column));
							}
						});
					};
					var getFields = function (getReadonly, currentItem, fields) {
						var getReadonlyFn = angular.isFunction(getReadonly) ? getReadonly : function () {
							return !!getReadonly;
						};
						if (!fields || !fields.length) {
							console.log('no field to set readonly!');
							return [];
						}

						return _.map(fields, function (model) {
							var readonly = !currentItem || getReadonlyFn(currentItem, model);
							return {
								field: model,
								readonly: readonly
							};
						});
					};
					var getCanReadonlyModels = function () {

						configures = angular.isArray(configures) ? configures : [configures];
						angular.forEach(configures, function (configure) {
							if (angular.isString(configure)) {
								configure = $injector.get(configure);
							}

							if (configure && configure.getStandardConfigForListView) {
								add(configure.getStandardConfigForListView().columns, function (column) {
									return column.field;
								});
							}
							if (configure && configure.getStandardConfigForDetailView) {
								add(configure.getStandardConfigForDetailView().rows, function (column) {
									return column.model;
								});
							}
						});
					};

					var updateReadonly = function updateReadonly(dataService,currentItem) {
						var setReadonly = dataService.setReadonly || function () {};
						var getReadonly = angular.isUndefined(isReadonly) ? dataService.isReadonly : isReadonly;
						if (currentItem && Object.getOwnPropertyNames(currentItem).length) {
							if (!canReadonlyModels || !canReadonlyModels.length) {
								getCanReadonlyModels();
							}
							platformRuntimeDataService.readonly(currentItem, getFields(getReadonly, currentItem, canReadonlyModels));
							setReadonly(currentItem);
						}
					};

					var validator = function(validatorService,item){
						angular.forEach(validatorService,function(fun,property){
							var field = property.replace('asyncValidate', '').replace('validate', '');
							if(angular.isFunction(fun) && canReadonlyModels.indexOf(field) !== -1 && !platformRuntimeDataService.isReadonly(item,field)) {
								if (/^validate.*/.test(property)) {
									platformRuntimeDataService.applyValidationResult(fun(item, platformObjectHelper.getValue(item, field), field), item, field);
								}
								if (/^asyncValidate.*/.test(property)) {
									fun(item, platformObjectHelper.getValue(item, field), field).then(function (res) {
										platformRuntimeDataService.applyValidationResult(res.data, item, field);
									});
								}
							}
						});
					};

					var defineProp = function(defineOption,item){
						if(!defineOption){return;}

						var defineProp = function ($item,prop) {
							var getter = function () {
								return _.get(defineOption.get(), prop);
							};
							var setter = function (value) {
								_.set(defineOption.get(), prop, value);
							};
							Object.defineProperty($item, prop, {
								get: getter,
								set: setter,
								enumerable: true,
								configurable: true
							});
						};
						angular.forEach(defineOption.fields,function(field){
							if(field.indexOf('.') === -1){
								defineProp(item,field);
							}else{
								defineProp(platformObjectHelper.getValue(item,field.slice(0,field.lastIndexOf('.'))),field.slice(field.lastIndexOf('.')+1,field.length));
							}
						});

					};

					return {
						processItem:function(item){
							var dataProcessService = dataProcessServiceFun();
							if(item && dataProcessService){
								updateReadonly(dataProcessService.dataService,item);
								validator(dataProcessService.validationService,item);
								defineProp(dataProcessService.defineOption,item);
							}
							return item;
						},
						updateValue:function(item,values){
							var validationService = dataProcessServiceFun().validationService;
							var noThing = function(){};
							if(item && !values){
								values = item;
								item = {};
							}

							if(validationService){
								angular.forEach(values,function(value,key){
									(validationService['validate' + key]||noThing)(item,value,key);
									(validationService['asyncValidate' + key]||noThing)(item,value,key);
									platformObjectHelper.setValue(item,key,value);
								});
							}
							return item;
						}
					};
				};
			}]);
})(angular);