/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	/**
     * @ngdoc service
     * @name projectCostCodesJobRateDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * projectCostCodesJobRateDynamicUserDefinedColumnService is the config service for costcode dynamic user defined column
     */
	angular.module(moduleName).factory('projectCostCodesJobRateDynamicUserDefinedColumnService', ['$q', '_', '$translate', 'userDefinedColumnTableIds', 'projectCostCodesJobRateDynamicConfigurationService', 'basicsCommonUserDefinedColumnServiceFactory', 'projectCostCodesJobRateMainService',
		function ($q, _, $translate, userDefinedColumnTableIds, projectCostCodesJobRateDynamicConfigurationService, basicsCommonUserDefinedColumnServiceFactory, projectCostCodesJobRateMainService) {
			let _projectId = -1;

			let fieldSuffix = 'project';
			let moduleName = 'PorjectCostCoeJobRate';
			let columnOptions = {
				columns : {
					idPreFix : 'ProjectCostCode',
					nameSuffix : '(' + $translate.instant('basics.common.userDefinedColumn.projectSuffix') + ')'
				},
				additionalColumns : true,
				additionalColumnOption : {
					idPreFix : 'ProjectCostCode',
					fieldSuffix : fieldSuffix,
					nameSuffix : ' ' + $translate.instant('basics.common.userDefinedColumn.costUnitSuffix'),
					overloads : {
						readonly : true,
						editor : null
					}
				}
			};

			// todo: add project fk as pk1
			let serviceOptions = {
				getRequestData : function(item){
					return {
						Pk1 : _projectId,
						Pk2 : item.ProjectCostCodeFk
					};
				},
				getFilterFn : function(tableId){
					return function(e, dto){
						return e.TableId === tableId && e.Pk1 === _projectId && e.Pk2 === dto.ProjectCostCodeFk && e.Pk3 === dto.LgmJobFk;
					};
				},
				getModifiedItem : function(tableId, item){
					return {
						TableId : tableId,
						Pk1 : _projectId,
						Pk2 : item.ProjectCostCodeFk,
						Pk3 : item.LgmJobFk
					};
				},
				attachExtendDataToColumn : true,
				extendDataColumnOption : {
					fieldSuffix : fieldSuffix,
					getRequestData : function(){
						return {
							TableId : userDefinedColumnTableIds.BasicsCostCode
						};
					},
					getFilterFn : function(){
						return function(e, dto){
							return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === dto['BasCostCode.Id'];
						};
					}
				}
			};

			let service = basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesJobRateDynamicConfigurationService, userDefinedColumnTableIds.ProjectCostCodeJobRate, 'projectCostCodesJobRateMainService', columnOptions, serviceOptions, moduleName);

			service.onJobChanged = function(item){
				if(item.LgmJobFk === null) { return; }

				service.getValueList().then(function (existedValues){
					let existedUserDefinedVal = _.find(existedValues, function(e){
						return e.TableId === userDefinedColumnTableIds.ProjectCostCodeJobRate && e.Pk1 === _projectId && e.Pk2 === item.ProjectCostCodeFk && e.Pk3 === item.LgmJobFk;
					});

					let columns = _.filter(service.getDynamicColumns(), function(column){ return !column.isExtend; });
					if(existedUserDefinedVal){
						_.forEach(columns, function(column){
							let field = column.field;
							let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
							item[field] = existedUserDefinedVal && existedUserDefinedVal[valueField] ? existedUserDefinedVal[valueField] : 0;
						});
					}else{
						service.fieldChange(item, columns[0].field);
					}
				});
			};

			let baseFieldChange = service.fieldChange;
			service.fieldChange = function(item, field, newValue){
				if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.LgmJobFk){
					return;
				}

				baseFieldChange(item, field, newValue);
			};

			service.handleCreatedItem = function(newItem){
				let requestData = {
					TableId : userDefinedColumnTableIds.BasicsCostCode,
					Pk1 : newItem['BasCostCode.Id']
				};

				service.getValueList(requestData).then(function(existedValues){
					let mdcCostCodeUserDefinedVal = _.find(existedValues, function(e){
						return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === newItem['BasCostCode.Id'];
					});

					let columns = service.getDynamicColumns();
					if(!columns || columns.length <= 0) { return; }

					if(mdcCostCodeUserDefinedVal){
						_.forEach(columns, function(column){
							let field = column.field;
							let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
							newItem[field] = mdcCostCodeUserDefinedVal[valueField] ? mdcCostCodeUserDefinedVal[valueField] : 0;
						});

						projectCostCodesJobRateMainService.gridRefresh();
					}else{
						service.attachEmptyDataToColumn(newItem);
					}

					if(newItem.LgmJobFk === null) {  return; }
					service.fieldChange(newItem, columns[0].field);
				});
			};

			service.setProjectId = function(projectId){
				_projectId = projectId;
			};

			return service;
		}
	]);
})(angular);
