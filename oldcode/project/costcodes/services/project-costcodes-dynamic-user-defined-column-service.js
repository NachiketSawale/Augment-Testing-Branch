/**
 * Created by myh on 08/16/2021.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc service
	 * @name projectCostCodesDynamicUserDefinedColumnService
	 * @function
	 *
	 * @description
	 * projectCostCodesDynamicUserDefinedColumnService is the config service for costcode dynamic user defined column
	 */
	angular.module(moduleName).factory('projectCostCodesDynamicUserDefinedColumnService', ['_', '$translate', 'userDefinedColumnTableIds', 'projectCostCodesDynamicConfigurationService', 'basicsCommonUserDefinedColumnServiceFactory',
		function (_, $translate, userDefinedColumnTableIds, projectCostCodesDynamicConfigurationService, basicsCommonUserDefinedColumnServiceFactory) {
			let _projectId = -1;

			let fieldSuffix = 'project';
			let moduleName = 'PorjectCostCode';
			let columnOptions = {
				columns: {
					idPreFix: 'ProjectCostCode',
					nameSuffix: '(' + $translate.instant('basics.common.userDefinedColumn.projectSuffix') + ')',
					overloads: {
						readonly: true,
						editor: null
					}
				},
				additionalColumns: true,
				additionalColumnOption: {
					idPreFix: 'ProjectCostCode',
					fieldSuffix: fieldSuffix,
					nameSuffix: ' ' + $translate.instant('basics.common.userDefinedColumn.costUnitSuffix'),
					overloads: {
						readonly: true,
						editor: null
					}
				}
			};

			let serviceOptions = {
				getRequestData: function (item) {
					return {
						Pk1: item.ProjectFk
					};
				},
				getFilterFn: function (tableId) {
					return function (e, dto) {
						return e.TableId === tableId && e.Pk1 === dto.ProjectFk && e.Pk2 === dto.Id;
					};
				},
				getModifiedItem: function (tableId, item) {
					return {
						TableId: tableId,
						Pk1: _projectId,
						Pk2: item.Id
					};
				},
				attachExtendDataToColumn: true,
				extendDataColumnOption: {
					fieldSuffix: fieldSuffix,
					getRequestData: function () {
						return {
							TableId: userDefinedColumnTableIds.BasicsCostCode
						};
					},
					getFilterFn: function () {
						return function (e, dto) {
							return e.TableId === userDefinedColumnTableIds.BasicsCostCode && e.Pk1 === dto.MdcCostCodeFk;
						};
					}
				}
			};

			let service = basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesDynamicConfigurationService, userDefinedColumnTableIds.ProjectCostCode, 'projectCostCodesMainService', columnOptions, serviceOptions, moduleName);

			service.setProjectId = function (projectId) {
				_projectId = projectId;
			};

			return service;
		}
	]);
})(angular);
