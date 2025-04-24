
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.common';
	let module = angular.module(moduleName);

	module.factory('controllingCommonActualDataServiceFactory',
		['$translate','$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'cloudCommonGridService',
			function ($translate,$injector, platformDataServiceFactory, ServiceDataProcessDatesExtension, cloudCommonGridService) {

				let factory = {};

				factory.createActualListDataService = function createActualListDataService(options,parentService,serviceName){
					let reloadFunc = null;
					let selectedGroupingStructure = null;
					let serviceOptions = {
						flatLeafItem: {
							module: options.moduleName,
							serviceName: serviceName,
							httpRead: {
								route: globals.webApiBaseUrl + 'controlling/actuals/subtotal/',
								endRead: 'getPrjControllingActuals',
								usePostForRead: true,
								initReadData: function initReadData(readData) {
									let selectedParent = parentService.getSelected();
									let groupingStructureList = parentService.getGroupingStructureList();
									selectedGroupingStructure = _.find(groupingStructureList,function (d){
										for(let i =1; i<=selectedParent.StructureLevel; i++){
											if(d['StructureLevel'+i+'Id'] !== selectedParent['StructureLevel'+i+'Id'] || selectedParent.StructureIdId!== d.StructureIdId  || selectedParent.StructureLevel!== d.StructureLevel ){
												return false;
											}
										}
										return true;
									});

									let groupingStructureTree = [];
									if (selectedGroupingStructure && selectedGroupingStructure.Children && selectedGroupingStructure.Children.length) {
										cloudCommonGridService.flatten([selectedGroupingStructure], groupingStructureTree, 'Children');
									}
									if(selectedGroupingStructure) {
										groupingStructureTree.push(selectedGroupingStructure);
									} else {
										/*
										* if selectedGroupingStructure is empty, it means the grouping struncture info is laoding, need to reload the data after it done
										* */
										reloadFunc = service.load;
										parentService.registerGroupingStructureInfoLoaded(reloadFunc);
									}

									let groupingColumns = parentService.getGroupingColumns();
									let directlyNodes =[];

									_.forEach(groupingColumns, function (d, index) {
										if (index < selectedParent.StructureLevel) {
											directlyNodes.push(d);
										}
									});

									let _groupingStructureFieldMapping = parentService.getGroupingStructureFieldMapping();

									let request = {};
									request.MdcControllingunitFks =[];
									request.MdcContrCostCodeFks =[];
									request.MdcCostCodeFks =[];
									let groupIndex = selectedParent.StructureLevel - 1;


									// root
									if(groupIndex <0){
										request.MdcControllingunitFks = request.MdcControllingunitFks.concat(_.map(groupingStructureTree,'MdcControllingunitFk'));
										request.MdcContrCostCodeFks = request.MdcContrCostCodeFks.concat(_.map(groupingStructureTree,'MdcContrCostCodeFk'));
										request.MdcCostCodeFks = request.MdcCostCodeFks.concat(_.map(groupingStructureTree,'MdcCostCodeFk'));

									}else {
										let isValid = parentIsValid(selectedGroupingStructure,groupingStructureList);
										if(!isValid){
											return readData;
										}
										if (directlyNodes && directlyNodes.length) {
											_.forEach(directlyNodes, function (node) {
												let groupColumnId = _groupingStructureFieldMapping[node.groupColumnId];
												_.forEach(groupingStructureTree, function (cd) {
													if(selectedGroupingStructure && cd.StructureLevel === selectedGroupingStructure.StructureLevel && isInValidStructure(node.groupColumnId)){
														if(!isInValidStructure(node.groupColumnId)){
															if (!request[groupColumnId + 's']) {
																request[groupColumnId + 's'] = [];
															}
															request[groupColumnId + 's'].push(cd[groupColumnId]);
														}else if(cd.StructureIdId === -1){
															request.MdcControllingunitFks = request.MdcControllingunitFks.concat(_.map(groupingStructureTree,'MdcControllingunitFk'));
															request.MdcContrCostCodeFks = request.MdcContrCostCodeFks.concat(_.map(groupingStructureTree,'MdcContrCostCodeFk'));
															request.MdcCostCodeFks = request.MdcCostCodeFks.concat(_.map(groupingStructureTree,'MdcCostCodeFk'));
														}
													}else {
														if (selectedGroupingStructure && cd.StructureLevel === selectedGroupingStructure.StructureLevel) {
															if (!request[groupColumnId + 's']) {
																request[groupColumnId + 's'] = [];
															}
															request[groupColumnId + 's'].push(cd[groupColumnId]);
														}
													}
												});
											});
										}
									}

									request.MdcControllingunitFks =_.uniq(request.MdcControllingunitFks);
									request.MdcCostCodeFks =_.uniq(request.MdcCostCodeFks);
									request.MdcContrCostCodeFks =_.uniq(request.MdcContrCostCodeFks);

									Object.assign(readData, request);

									let project = parentService.getProjectInfo();
									if (project) {
										readData.ProjectId = project.Id;
									}
									return readData;
								}
							},
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										if(!!selectedGroupingStructure && _.isFunction(reloadFunc)){
											parentService.unregisterGroupingStructureInfoLoaded(reloadFunc);
											reloadFunc = null;
										}
										return serviceContainer.data.handleReadSucceeded(readData, data);
									}
								}
							},
							entityRole: {
								leaf: {itemName: 'ControllingUnitTotals', parentService: parentService}
							},
							actions: { delete: false, create: false, bulk: false },
							dataProcessor: [new ServiceDataProcessDatesExtension(['CompanyYearFkStartDate', 'CompanyYearFkEndDate', 'CompanyPeriodFkStartDate', 'CompanyPeriodFkEndDate'])]
						}
					};

					function isInValidStructure(groupColumnId){
						return groupColumnId === 'REL_ACTIVITY' || groupColumnId === 'REL_BOQ' || groupColumnId === 'REL_PACKAGE';
					}

					function parentIsValid(currentItem,groupingStructureTree) {
						if(!currentItem){
							return true;
						}
						let groupingColumns = parentService.getGroupingColumns();
						let index = currentItem.StructureLevel-1;
						let groupNode = groupingColumns[index];

						let parentNode = _.find(groupingStructureTree,{Id:currentItem.ParentFk});
						if(parentNode && currentItem.StructureIdId !==-1 && parentNode.ParentFk>0 && groupNode && isInValidStructure(groupNode.groupColumnId)){
							return false;
						}else if(parentNode && currentItem.StructureIdId !== -1 && _.isNull(parentNode.ParentFk) && groupNode && isInValidStructure(groupNode.groupColumnId)){
							return false;
						}else {
							return parentIsValid (parentNode,groupingStructureTree);
						}

					}

					let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

					serviceContainer.data.usesCache = false;

					serviceContainer.service.canLoad = function () {
						return !!parentService.getSelected();
					};

					serviceContainer.data.markItemAsModified = angular.noop;
					serviceContainer.service.markItemAsModified = angular.noop;
					let service = serviceContainer.service;
					return service;
				};

				return factory;


			}]);
})();
