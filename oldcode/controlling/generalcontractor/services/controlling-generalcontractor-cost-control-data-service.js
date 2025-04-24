
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.generalcontractor');

	module.factory('controllingGeneralcontractorCostControlDataService', ['_','$timeout','$injector','PlatformMessenger','platformGridAPI','basicsLookupdataLookupDescriptorService','platformDataServiceFactory','cloudDesktopSidebarService','cloudDesktopPinningContextService','cloudDesktopInfoService','ServiceDataProcessDatesExtension','ServiceDataProcessArraysExtension','controllingGeneralcontractorCostControlImageProcessor','cloudCommonGridService',
		function (_,$timeout,$injector,PlatformMessenger,platformGridAPI,basicsLookupdataLookupDescriptorService,platformDataServiceFactory,cloudDesktopSidebarService,cloudDesktopPinningContextService,cloudDesktopInfoService,ServiceDataProcessDatesExtension,ServiceDataProcessArraysExtension,controllingGeneralcontractorCostControlImageProcessor,cloudCommonGridService) {
			let service ={};
			let serviceContainer ={};
			let gridId =null;
			let entities = [];
			let dueDates =[];
			let selectedDueDate = null;
			let isNeedReLoad = false;
			let rootParentId = -1;

			let serviceOptions = {
				hierarchicalRootItem: {
					module: module,
					serviceName: 'controllingGeneralcontractorCostControlDataService',
					entityNameTranslationID: 'controlling.generalcontractor.GeneralContractorControlling',
					httpRead: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/CostControlController/', // adapt to web API controller
						endRead: 'getCostControl',
						usePostForRead: true,
						initReadData: function (readData) {
							let context = cloudDesktopPinningContextService.getContext();
							let item =_.find(context, {'token': 'project.main'});
							readData.ProjectId = item? item.id:-1;
							readData.DueDate = selectedDueDate? selectedDueDate:null;
							return readData;
						}
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'Controlling/GeneralContractor/CostControlController/', // adapt to web API controller
						endUpdate:'updateCostControl'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['CostControlVChildren']),
						controllingGeneralcontractorCostControlImageProcessor],
					presenter: {
						tree: {
							parentProp: 'MdcControllingUnitFk',
							childProp: 'CostControlVChildren',
							isInitialSorted: true,
							incorporateDataRead: function (readData, data) {
								let context = {
									treeOptions:{
										parentProp: 'MdcControllingUnitFk',
										childProp: 'CostControlVChildren'
									},
									IdProperty: 'Id'
								};

								entities = readData.dtos;

								dueDates = _.orderBy(readData.DueDates);
								service.onLoadDueDates.fire(selectedDueDate);

								_.forEach(entities,function (d) {
									if(d.ElementType === 2 && d.IsParent!==-1){
										d.cssClass = 'font-italic';
									}
									if(!d.MdcControllingUnitFk){
										rootParentId = d.Id;
									}
								});
								if(entities && entities.length){
									entities = $injector.get('basicsLookupdataTreeHelper').buildTree(entities, context);
									if(entities[0]) {
										entities[0].cssClass = 'font-bold';
									}
								}
								handleSorting(entities[0]);
								entities = handleDataList(entities);
								let result = serviceContainer.data.handleReadSucceeded(entities, data);


								if(gridId){
									platformGridAPI.rows.expandAllNodes(gridId);
								}

								$injector.get('platformContextService').setPermissionObjectInfo(readData.PermissionObjectInfo);

								basicsLookupdataLookupDescriptorService.removeData('GccProjectChange');
								basicsLookupdataLookupDescriptorService.removeData('GccControllingUnit');

								isNeedReLoad = false;
								return result;
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'GeneralContractorCostControl',
							moduleName: 'controlling.generalcontractor.GeneralContractorControlling',
							mainItemName: 'GeneralContractorCostControl'
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {},
					translation: {
						uid: 'controllingGeneralcontractorCostControlDataService',
						title: 'controlling.generalcontractor.GeneralContractorControlling',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'CostControlDto',
							moduleSubModule: 'Controlling.GeneralContractor'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'controlling.generalcontractor',
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							includeNonActiveItems: true,
							showOptions: true,
							showProjectContext: true,
							pinningOptions: {
								isActive: true, showPinningContext: [{token: 'project.main', show: true}],
								setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
							},
							withExecutionHints: true
						}
					}
				}
			};

			function handleSorting(item) {
				if(item && item.CostControlVChildren && item.CostControlVChildren.length){

					item.CostControlVChildren = _.orderBy(item.CostControlVChildren,'ElementType','desc');

					_.forEach(item.CostControlVChildren,function (d) {
						handleSorting(d);
					});
				}
			}

			function handleDataList(list){
				if(list && list.length > 0){
					_.forEach(list, function (item){
						calculatePackageValueNet(item);
					});
				}

				return list;
			}

			function calculatePackageValueNet(item){
				item.SubTotalBudget = (item.CostControlVChildren && item.CostControlVChildren.length > 0)
					? _.sumBy(item.CostControlVChildren, function (i){ return i.Budget;})
					: 0;

				item.TotalPackageValueNet = 0;
				if(item.CostControlVChildren && item.CostControlVChildren.length > 0){
					_.forEach(item.CostControlVChildren, function (i){
						item.TotalPackageValueNet += calculatePackageValueNet(i);
					});
				}else{
					item.TotalPackageValueNet = item.PackageValueNet;
				}

				return item.TotalPackageValueNet;
			}

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			service = serviceContainer.service;

			serviceContainer.data.updateOnSelectionChanging = null;

			service.getServiceContainer = function getServiceContainer() {
				return serviceContainer.data;
			};

			service.setIsNeedReLoad = function setIsNeedLoad(value){
				isNeedReLoad = value;
			};

			service.getIsNeedReLoad = function getIsNeedReLoad(){
				return isNeedReLoad;
			};

			service.getTree = function getTree() {
				return entities;
			};

			service.setSelectedDueDate = function setSelectedDueDate(value){
				selectedDueDate = value;
			};

			service.getSelectedDueDate = function getSelectedDueDate(){
				return selectedDueDate;
			};

			service.init = function init(){
				basicsLookupdataLookupDescriptorService.loadData('prcConfiguration');
				basicsLookupdataLookupDescriptorService.loadData('PackageStatus');

				$injector.get('procurementPackageNumberGenerationSettingsService').load();
			};

			service.init();
			service.onContextUpdated = new PlatformMessenger();
			service.onDueDatesChanged = new PlatformMessenger();
			service.onLoadDueDates = new PlatformMessenger();

			service.setDueDates = function (values){
				dueDates  = values;
			};

			service.getDueDates = function () {
				return dueDates;
			};

			service.navigateToCostControl = function navigateToCostControl() {
				service.onContextUpdated.fire();
			};

			service.setGridId = function (value){
				gridId = value;
			};

			service.getGridId = function (){
				return gridId;
			};

			service.getProjectId = function (){
				let context = cloudDesktopPinningContextService.getContext();
				let item =_.find(context, {'token': 'project.main'});
				return item ? item.id: -1;
			};


			service.getMdcIds = function (){
				let costControlSelected = service.getSelected();
				let mdcControllingUnitFks = [];
				if(costControlSelected) {
					mdcControllingUnitFks.push (Math.abs(costControlSelected.Id));
					if (costControlSelected.CostControlVChildren && costControlSelected.CostControlVChildren.length) {
						let result = [];
						cloudCommonGridService.flatten (costControlSelected.CostControlVChildren, result, 'CostControlVChildren');
						result = _.filter(result, function (d) {
							return d.ElementType === 0;
						});
						let mdcIds = _.map (result, 'Id');
						mdcControllingUnitFks = mdcControllingUnitFks.concat(mdcIds);
					}
				}
				return mdcControllingUnitFks;
			};

			service.updateModuleHeaderInfo = function () {
				let currentHeader = service.getSelected();

				let context = cloudDesktopPinningContextService.getContext();
				let item =_.find(context, {'token': 'project.main'});
				let prjInfo = item ? item.info :'';
				let entityText = prjInfo;
				if (currentHeader) {
					entityText = prjInfo + '-'+  currentHeader.Code;
				}
				cloudDesktopInfoService.updateModuleInfo('controlling.generalcontractor.GeneralContractorControlling', entityText);
			};

			service.loadCostControl = function () {
				if (service.getProjectId()>0 && service.getIsNeedReLoad()) {
					service.setList([]);
					serviceContainer.data.itemList =[];
					serviceContainer.data.itemTree =[];
					service.setSelectedDueDate(null);
					service.setDueDates([]);

					$timeout(function () {
						service.load().then(
							function () {
								platformGridAPI.rows.expandAllSubNodes(gridId);
								service.gridRefresh();
							}
						);

					});
				}
			};

			service.doPrepareUpdateCall = function (dataToUpdate) {
				dataToUpdate.RootParentId = rootParentId;
			};
			return serviceContainer.service;
		}]);
})();
