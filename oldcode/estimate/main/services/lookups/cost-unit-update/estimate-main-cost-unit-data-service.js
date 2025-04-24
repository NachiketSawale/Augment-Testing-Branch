/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let modName = 'estimate.main';

	let estimateMainModule = angular.module(modName);

	estimateMainModule.factory('estimateMainCostUnitDataService', ['$q', '$injector', '$translate','platformGridAPI','platformDataServiceFactory', 'hourfactorReadonlyProcessor', 'basicsCommonUtilities',
		'userDefinedColumnTableIds','basicsCommonUserDefinedColumnServiceFactory','projectCommonJobService','platformRuntimeDataService', 'estimateMainResourceType',
		function ($q, $injector, $translate,platformGridAPI,platformDataServiceFactory, hourfactorReadonlyProcessor, basicsCommonUtilities,
			userDefinedColumnTableIds,basicsCommonUserDefinedColumnServiceFactory,projectCommonJobService,platformRuntimeDataService, estimateMainResourceType) {

			let listRoute = '',
				itemName = '',
				endRead = '',
				service = {};

			service.getDataService = function (opt) {
				let projectId = $injector.get('estimateMainService').getSelectedProjectId();
				if (opt.entity.EstResourceTypeFk === estimateMainResourceType.Material) {
					listRoute = 'project/material/';
					itemName = 'PrjMaterial';
					endRead = 'getupdateprjlistbymatiealid';
				} else {
					listRoute = 'project/costcodes/job/rate/';
					itemName = 'PrjCostCodes';
					endRead = 'getupdateprjcostcodesbyjobrate';
				}

				let dataOption = {
					flatRootItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainCostUnitDataService',
						httpRead: {route: globals.webApiBaseUrl + listRoute, endRead: endRead},
						dataProcessor: [hourfactorReadonlyProcessor],
						actions: {},
						entityRole: {
							root: {
								addToLastObject: true,
								lastObjectModuleName: modName,
								codeField: 'Code',
								itemName: itemName
							}
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(dataOption);
				serviceContainer.data.updateOnSelectionChanging = null;
				let dataService = serviceContainer.service;
				let filterUrl = '';
				if (opt.entity.EstResourceTypeFk === estimateMainResourceType.Material) {
					filterUrl = 'projectId=' + projectId + '&materialId=' + opt.entity.MdcMaterialFk + '&materialPriceListFk=' + opt.entity.MaterialPriceListFk;
				} else {
					filterUrl = 'projectId=' + projectId + '&costCodeId=' + (opt.entity.MdcCostCodeFk || 0) + '&code=' + (basicsCommonUtilities.urlEncoding(opt.entity.Code) || '');
				}
				if (opt.onlyShowSelected) {
					filterUrl += '&jobFk=' + (opt.entity.LgmJobFk || opt.entity.parentJobFk || $injector.get('estimateMainService').getLgmJobId(opt.entity));
				} else {
					filterUrl += '&jobFk=0';
				}
				dataService.setFilter(filterUrl);

				dataService.markItemAsModified = null;

				let udpService = null;

				function incorporateDataRead (readData, data) {
					if(udpService) {
						udpService.clearValueComplete();
						udpService.attachDataToColumn(readData);
					}
					projectCommonJobService.prepareData(projectId).then(function(){
						setReadOnly(readData);
					});
					return serviceContainer.data.handleReadSucceeded(readData, data);
				}
				function setReadOnly(jobList) {
					_.forEach(jobList, function (item) {
						let fields = [];
						let isReadOnly = projectCommonJobService.isJobReadOnly(item.LgmJobFk);
						_.forOwn(item, function (value, key) {
							let field = {field: key, readonly: !!isReadOnly};
							fields.push(field);
						});
						platformRuntimeDataService.readonly(item, fields);
					});
				}

				function getUserDefinedColumnService(mainConfigurationService, isReadOnly, dataServiceName) {
					let fieldSuffix = 'project';
					let moduleName = 'PorjectCostCoeJobRate';
					let columnOptions = {
						columns: {
							idPreFix: 'ProjectCostCode',
							nameSuffix: '(' + $translate.instant('basics.common.userDefinedColumn.projectSuffix') + ')'
						},
						additionalColumns: false,
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

					// todo: add project fk as pk1
					let serviceOptions = {
						getRequestData: function (item) {
							return {
								Pk1: projectId,
								Pk2: item.OriginalId
							};
						},
						getFilterFn: function (tableId) {
							return function (e, dto) {
								return e.TableId === tableId && e.Pk1 === projectId && e.Pk2 === dto.OriginalId && e.Pk3 === dto.LgmJobFk;
							};
						},
						getModifiedItem: function (tableId, item) {
							return {
								TableId: tableId,
								Pk1: projectId,
								Pk2: item.OriginalId,
								Pk3: item.LgmJobFk
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

					let udpServer = basicsCommonUserDefinedColumnServiceFactory.getService(mainConfigurationService, userDefinedColumnTableIds.ProjectCostCodeJobRate, dataServiceName, columnOptions, serviceOptions,moduleName);

					udpServer.loadDynamicColumns();

					udpServer.initReloadFn();

					mainConfigurationService.fireRefreshConfigLayout = function(){
						let baseStandardColunms = angular.copy(mainConfigurationService.getBaseStandardColunms());
						let dyColunms = udpServer.getDynamicColumns();
						if (isReadOnly) {
							dyColunms = _.forEach(dyColunms, function (col) {
								col.editor = null;
							});
						}
						let cols= baseStandardColunms.concat(dyColunms);
						platformGridAPI.columns.configuration(opt.uuid, cols);
					};

					return udpServer;
				}

				dataService.registerUserDefinedColumnService  = function(mainConfigurationService,isReadOnly){
					if(opt.entity.EstResourceTypeFk !== 2) {
						udpService = getUserDefinedColumnService(mainConfigurationService, isReadOnly);
					}
					return  udpService;
				};

				dataService.unRegisterUserDefinedColumnService  = function(){
					if(udpService){
						udpService.onDestroy();
					}
				};

				return dataService;
			};

			service.loadData = function (dataServce, entity, forceSelectRow) {
				return dataServce.load().then(function (data) {
					let defEntity = _.find(data, {LgmJobFk: (entity.LgmJobFk || entity.parentJobFk)});
					if (defEntity && forceSelectRow) {
						dataServce.setSelected(defEntity);
					} else {
						dataServce.setSelected(null);
					}
					return data;
				});
			};


			return service;
		}
	]);
})(angular);
