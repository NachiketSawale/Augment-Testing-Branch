
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.common';
	let module = angular.module(moduleName);

	module.factory('controllingCommonPrcContractListDataServiceFactory',
		['$translate','$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'cloudCommonGridService',
			function ($translate,$injector, platformDataServiceFactory, ServiceDataProcessDatesExtension, cloudCommonGridService) {
				let factory = {};
				factory.createPrcContractService = function createPrcContractService(options,parentService,serviceName){
					let reloadFunc = null;
					let selectedGroupingStructure = null;
					let serviceOptions = {
						flatLeafItem: {
							module: options.moduleName,
							serviceName: serviceName,
							httpRead: {
								route: globals.webApiBaseUrl + 'procurement/contract/controllingtotal/',
								usePostForRead: true,
								initReadData: function(readData) {
									let selected = parentService.getSelected();

									let groupingStructureList = parentService.getGroupingStructureList();
									selectedGroupingStructure = _.find(groupingStructureList, function (d) {
										for (let i = 1; i <= selected.StructureLevel; i++) {
											if (d['StructureLevel' + i + 'Id'] !== selected['StructureLevel' + i + 'Id'] || selected.StructureIdId!== d.StructureIdId  || selected.StructureLevel!== d.StructureLevel ) {
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
									let directlyNodes = [];

									_.forEach(groupingColumns, function (d, index) {
										if (index < selected.StructureLevel) {
											directlyNodes.push(d);
										}
									});

									let _groupingStructureFieldMapping = parentService.getGroupingStructureFieldMapping();

									let request = {};
									request.MdcControllingunitFks = [];

									let groupIndex = parentService.getSelected().StructureLevel - 1;

									if (groupIndex < 0) {
										let cuFks = _.uniq(_.map(groupingStructureTree,'MdcControllingunitFk'));
										_.forEach(cuFks,function (d) {
											request.MdcControllingunitFks.push(d ? d : -1);
										});

									} else if (directlyNodes && directlyNodes.length) {

										_.forEach(directlyNodes, function (node) {

											let groupColumnId = _groupingStructureFieldMapping[node.groupColumnId];

											_.forEach(groupingStructureTree, function (cd) {

												if (node.groupColumnId !== 'REL_CO') {
													request.MdcControllingunitFks.push(cd.MdcControllingunitFk?cd.MdcControllingunitFk:-1);
												} else if (selectedGroupingStructure && cd.StructureLevel === selectedGroupingStructure.StructureLevel) {
													if (!request[groupColumnId + 's']) {
														request[groupColumnId + 's'] = [];
													}
													request[groupColumnId + 's'].push(cd[groupColumnId]?cd[groupColumnId]:-1);
												}
											});

											if (request[groupColumnId + 's']) {
												request[groupColumnId + 's'] = _.uniq(request[groupColumnId + 's']);
											}
										});
									}

									request.MdcControllingunitFks = _.uniq(request.MdcControllingunitFks);
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
								leaf: {itemName: 'controllingCommonPrcContracts', parentService: parentService}
							},
							actions: { delete: false, create: false, bulk: false },
							dataProcessor: [new ServiceDataProcessDatesExtension(['DateOrdered', 'DateReported', 'DateCanceled', 'DateDelivery', 'DateCallofffrom', 'DateCalloffto', 'DateQuotation', 'ConfirmationDate', 'DatePenalty','DateEffective', 'ExecutionStart', 'ExecutionEnd','ValidFrom','ValidTo'])]
						}
					};

					if (options.httpRead) {
						serviceOptions.flatLeafItem.httpRead = options.httpRead;
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
