
(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.projectcontrols';
	let controllingProjectControlsModule = angular.module(moduleName);
	
	controllingProjectControlsModule.factory('controllingProjectControlsLineItemListDataService',
		['_', 'controllingCommonLineItemListDataServiceFactory','controllingProjectcontrolsDashboardService','cloudCommonGridService',
			function (_, controllingCommonLineItemListDataServiceFactory,parentService,cloudCommonGridService) {
				
				let serviceOptions = {
					module: moduleName,
					serviceName: 'controllingProjectControlsLineItemListDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
						endRead: 'projectcontrolslineitemlist',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selectedParent = parentService.getSelected();
							let groupingStructureList = parentService.getGroupingStructureList();
							let selectedGroupingStructure = _.find(groupingStructureList,function (d){
								for(let i =1; i<=selectedParent.StructureLevel; i++){
									if(d['StructureLevel'+i+'Id'] !== selectedParent['StructureLevel'+i+'Id']  || selectedParent.StructureIdId!== d.StructureIdId  || selectedParent.StructureLevel!== d.StructureLevel ){
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
							request.PsdActivityFks =[];
							request.BoqItemFks =[];
							let groupIndex = selectedParent.StructureLevel - 1;
							
							// root
							if(groupIndex <0){
								_.forEach(groupingColumns, function (node) {
									let groupColumnId = _groupingStructureFieldMapping[node.groupColumnId];
									_.forEach(groupingStructureTree, function (cd) {
										if(cd) {
											if ((node.groupColumnId === 'REL_CO' || node.groupColumnId === 'REL_ACTIVITY' || node.groupColumnId === 'REL_BOQ')) {
												if (!request[groupColumnId + 's']) {
													request[groupColumnId + 's'] = [];
												}
												request[groupColumnId + 's'].push(cd[groupColumnId]);
											} else {
												request.MdcControllingunitFks.push(cd.MdcControllingunitFk);
											}
										}
									});
								});
								
							}else {
								if (directlyNodes && directlyNodes.length) {
									_.forEach(directlyNodes, function (node) {
										let groupColumnId = _groupingStructureFieldMapping[node.groupColumnId];
										_.forEach(groupingStructureTree, function (cd) {
											if(node.groupColumnId === 'REL_COSTCODE' || node.groupColumnId === 'REL_COSTCODE_CO'){
												if(cd.MdcControllingunitFk){
													request.MdcControllingunitFks.push(cd.MdcControllingunitFk);
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

										request[groupColumnId + 's'] = _.uniq(request[groupColumnId + 's']);
									});
								}
							}
							
							request.MdcControllingunitFks =_.uniq(request.MdcControllingunitFks);
							request.PsdActivityFks =_.uniq(request.PsdActivityFks);
							request.BoqItemFks =_.uniq(request.BoqItemFks);
							
							Object.assign(readData, request);
							let project = parentService.getProjectInfo();
							if (project) {
								readData.prjProjectFk = project.Id;
							}
							return readData;
						}
					}
				};
				let service = controllingCommonLineItemListDataServiceFactory.createLineItemListDataService(serviceOptions,parentService,'controllingProjectControlsLineItemListDataService');
				return service;
			}
		]);
})(angular);
