(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName)
		.factory('basicsProcurementStructureService',
			['$http','platformDataServiceFactory', 'basicsLookupdataLookupDataService', 'cloudDesktopSidebarService',
				'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessArraysExtension',
				'basicsProcurementStructureImageProcessor', 'procurementCommonHelperService', 'PlatformMessenger','basicsCommonMandatoryProcessor',
				'platformDataServiceDataProcessorExtension','platformGridAPI','$injector','basicsCommonCharacteristicService',
				'globals','basicsLookupdataLookupFilterService',
				function ($http, dataServiceFactory, lookupDataService, cloudDesktopSidebarService, basicsLookupdataLookupDescriptorService,
						          ServiceDataProcessArraysExtension, imageProcessor, procurementCommonHelperService, PlatformMessenger,mandatoryProcessor,
								  platformDataServiceDataProcessorExtension,platformGridAPI,$injector,basicsCommonCharacteristicService,
					globals,basicsLookupdataLookupFilterService) {
					var characteristicColumn = '';
					var gridContainerGuid = 'a59c90cf86d14abe98df9cb8601b22a0';
					var sidebarSearchOptions = {
						moduleName: moduleName,  // required for filter initialization
						pattern: '',
						pageSize: 100,
						enhancedSearchEnabled: true,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: false,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true
					};

					var navHeaderFk = 0;
					var serviceOption = {
						hierarchicalRootItem: {
							module: angular.module(moduleName),
							serviceName: 'basicsProcurementStructureService',
							entityNameTranslationID: 'basics.procurementstructure.moduleName',
							httpCreate: {
								route: globals.webApiBaseUrl + 'basics/procurementstructure/',
								endCreate: 'createstructure'
							},
							httpDelete: {
								route: globals.webApiBaseUrl + 'basics/procurementstructure/',
								endDelete: 'deletestructure'
							},
							httpUpdate: {
								route: globals.webApiBaseUrl + 'basics/procurementstructure/',
								endUpdate: 'updatestructure'
							},
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/procurementstructure/', // endRead: 'tree',
								usePostForRead: true
							},
							dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), imageProcessor],
							presenter: {
								tree: {
									parentProp: 'PrcStructureFk', childProp: 'ChildItems',
									initCreationData: function (creationData) {
										creationData.PrcStructureTypeFk = creationData.parent ? creationData.parent.PrcStructureTypeFk : 0;
										creationData.parentId = creationData.parentId === null ? 0 : creationData.parentId;
									},
									incorporateDataRead: incorporateDataRead,
									handleCreateSucceeded: function (item) {
										basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, item, 9, 54);
										var exist = platformGridAPI.grids.exist(gridContainerGuid);
										if (exist) {
											var containerInfoService = $injector.get('basicsProcurementstructureContainerInformationService');
											var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 54, gridContainerGuid,containerInfoService);
											characterColumnService.appendDefaultCharacteristicCols(item);
										}
									}
								}
							},
							entityRole: {
								//Root is need, rest are default values
								root: {
									itemName: 'PrcStructureToSave',
									moduleName: 'cloud.desktop.moduleDisplayNameProcurementStructure',
									addToLastObject: true,
									lastObjectModuleName: 'basics.procurementstructure',
									descField: 'DescriptionInfo.Description'
								}
							},
							sidebarSearch: {options: sidebarSearchOptions},
							translation: {
								uid: 'basicsProcurementStructureService',
								title: 'basics.procurementstructure.moduleName',
								columns: [
									{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'},
									{header: 'cloud.common.entityCommentText', field: 'CommentTextInfo'}
								],
								dtoScheme: { typeName: 'PrcStructureDto', moduleSubModule: 'Basics.ProcurementStructure' }
							},
							entitySelection: {supportsMultiSelection: true}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

					var service = serviceContainer.service;
					var data = serviceContainer.data;
					service.onScrollToItem = new PlatformMessenger();

					var getNavData = function getNavData(item) {
						navHeaderFk = item.PrcStructureFk || item.StructureFk || item.PrcHeaderEntity.StructureFk;
						if (angular.isDefined(navHeaderFk)) {
							return navHeaderFk;
						} else {
							throw new Error('The property contract header is not recognized.');
						}
					};

					//add deep copy function
					service.createDeepCopy = function createDeepCopy() {
						$http.post(globals.webApiBaseUrl + 'basics/procurementstructure/deepcopy', service.getSelected())
							.then(function (response) {
								serviceContainer.data.handleOnCreateSucceeded(response.data.PrcStructure, serviceContainer.data);
							},
							function (/*error*/) {
							});
					};

					serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
						typeName: 'PrcStructureDto',
						moduleSubModule: 'Basics.ProcurementStructure',
						validationService: 'basicsProcurementStructureValidationService',
						mustValidateFields:['Code']
					});
					serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
						characteristicColumn = colName;
					};
					serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
						return characteristicColumn;
					};

					procurementCommonHelperService.registerNavigation(serviceContainer.data.httpReadRoute, {
						moduleName: 'basics.procurementstructure',
						getNavData: getNavData
					});
					basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 9, 54);
					service.upgradeDowngradeActivity = new Platform.Messenger();
					service.upgradeStructure = function upgradeStructure() {
						var structures, oldParent, newParent;
						var structure = service.getSelected();
						structures = service.getList();
						if (structure &&  structure.PrcStructureFk !== null) {
							oldParent = _.find(structures, {Id: structure.PrcStructureFk});
							var oldPos;
							var index;
							var help, diff;
							if (oldParent && oldParent.PrcStructureFk) {
								oldPos = _.indexOf(oldParent.ChildItems, structure);
								oldParent.ChildItems.splice(oldPos, 1);
								structure.PrcStructureFk = oldParent.PrcStructureFk;
								newParent = _.find(structures, {Id: structure.PrcStructureFk});
								index = _.indexOf(newParent.ChildItems, oldParent);
								newParent.ChildItems.splice(index + 1, 0, structure);
								help = angular.copy(newParent.ChildItems);
								newParent.ChildItems.sort(sortItem);
								diff = 0;
								for (var i = 0; i < newParent.ChildItems.length; i++) {
									if (newParent.ChildItems[i].Code !== help[i].Code) {
										diff++;
										break;
									}
								}
							}
							else {
								structure.PrcStructureFk = null;
								index = _.indexOf(oldParent.ChildItems, structure);
								oldParent.ChildItems.splice(index, 1);
								var tree = service.getTree();
								oldPos = _.indexOf(tree, oldParent);
								tree.splice(oldPos + 1, 0, structure);
								help = angular.copy(tree);
								tree.sort(sortItem);
								diff = 0;
								for (var j = 0; j < tree.length; j++) {
									if (tree[j].Code !== help[j].Code) {
										diff++;
										break;
									}
								}
							}
							adjustLevel(structure, -1);

							data.markItemAsModified(oldParent, data);
							data.markItemAsModified(structure, data);

							platformDataServiceDataProcessorExtension.doProcessItem(structure, data);
							data.itemModified.fire(null, structure);

							if (oldParent) {
								if (oldParent.ChildItems.length === 0) {
									oldParent.nodeInfo.children = false;
									oldParent.nodeInfo.collapsed = true;
									oldParent.HasChildren = false;
								}
								if (oldPos !== oldParent.ChildItems.length) {
									oldParent.nodeInfo.collapsed = true;
								}
								platformDataServiceDataProcessorExtension.doProcessItem(oldParent, data);
								data.itemModified.fire(null, oldParent);
								if (oldPos !== oldParent.ChildItems.length || diff > 0) {
									serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
									serviceContainer.data.listLoaded.fire();
									service.upgradeDowngradeActivity.fire(structure);
								}
								data.itemModified.fire(null, oldParent);
								oldParent = null;
							}
						}
					};

					service.canUpgradeStructure = function canUpgradeStructure() {
						var canUpGrade = false;
						var sel = service.getSelected();
						if (sel !== null && !!sel.PrcStructureFk) {
							canUpGrade = true;
						}

						return canUpGrade;
					};

					service.downgradeStructure = function downgradeStructure() {
						var structures, index, predecessor;
						var structure = service.getSelected();
						structures = [];

						if (structure) {
							structures = getDownGradeSiblings(structure);
							index = structures.indexOf(structure);

							if (index >= 1) {
								predecessor = structures[index - 1];
								structure.PrcStructureFk = predecessor.Id;
								adjustLevel(structure, +1);
								predecessor.ChildItems.push(structure);
								var help = angular.copy(predecessor.ChildItems);
								predecessor.ChildItems.sort(sortItem);
								var diff = 0;
								for (var j = 0; j < predecessor.ChildItems.length; j++) {
									if (predecessor.ChildItems[j].Code !== help[j].Code) {
										diff++;
										break;
									}
								}
								predecessor.nodeInfo.children = true;
								predecessor.nodeInfo.collapsed = false;
								predecessor.HasChildren = true;

								_.remove(structures, function (treeItem) {
									return treeItem.Id === structure.Id;
								});

								data.markItemAsModified(predecessor, data);
								data.markItemAsModified(structure, data);

								platformDataServiceDataProcessorExtension.doProcessItem(structure, data);
								data.itemModified.fire(null, structure);
							}
						}
					};

					service.canDowngradeStructure = function canDowngradeStructure() {
						var canDownGrade = false;
						var sel = service.getSelected();
						if (sel !== null) {
							var Structures = getDownGradeSiblings(sel);
							var index = Structures.indexOf(sel);
							var parentCandidate = null;
							if(index >= 1)
							{
								parentCandidate = Structures[index - 1];
							}
							canDownGrade = (parentCandidate && (parentCandidate.PrcStructureLevel5Fk === null || angular.isUndefined(parentCandidate.PrcStructureLevel5Fk)));
						}
						return canDownGrade;
					};
					let lookupFilters = [
						{
							key: 'prc-bas-loading-cost-filter',
							fn: function (item) {
								return item.IsForMaterial===true;
							}
						},
						{
							key: 'prc-generals-type-filter',
							fn: function (item,entity) {
								return item.LedgerContextFk === entity.MdcLedgerContextFk;
							}
						}
					];


						basicsLookupdataLookupFilterService.registerFilter(lookupFilters);


					function sortItem(itemA, itemB) {
						var codeA = itemA.Code.toLowerCase();
						var codeB = itemB.Code.toLowerCase();
						if (codeA < codeB) {
							return -1;
						}
						if (codeA > codeB) {
							return 1;
						}
						return 0;
					}

					function adjustLevel(structure, delta) {
						structure.nodeInfo.level += delta;

						_.forEach(structure.ChildItems, function (act) {
							adjustLevel(act, delta);
						});
					}

					function getDownGradeSiblings(structure) {
						if (structure.PrcStructureFk) {
							var predecessor = service.getItemById(structure.PrcStructureFk);
							return predecessor.ChildItems;
						}
						return service.getTree();
					}



					service.getClerkContextFkUIConfig = function () {
						var basicsProcurementconfigurationModule = 'basics.procurementconfiguration';
						var basicsCommonModule = 'basics.common';
						return {
							translationInfos: {
								'extraModules': [basicsProcurementconfigurationModule, basicsCommonModule],
								'extraWords': {
									ContextFk: {
										location: basicsCommonModule,
										identifier: 'entityPrcConfigurationFk',
										initial: 'Configuration Header'
									}
								}
							},
							attributes: {
								hasValidFrom: false,
								hasValidTo: false
							},
							overloads: {
								required: true,
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-procurement-configuration-config-header-combo-box',
										descriptionMember: 'DescriptionInfo.Translated'
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-procurement-configuration-config-header-combo-box'
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PrcConfigHeader',
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							}
						};
					};

					let confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
					confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

					return service;

					function incorporateDataRead(readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData);
						var result = {
							FilterResult: readData.FilterResult,
							dtos: readData.Main || []
						};
						var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
						if (navHeaderFk > 0) {
							var itemList = service.getList();
							if (itemList.length > 0) {
								service.onScrollToItem.fire(itemList[itemList.length - 1]);
							}
						}
						navHeaderFk = 0;//this is need. if module is open by navigate, after completed,should set it back to 0;
						var exist = platformGridAPI.grids.exist(gridContainerGuid);
						if (exist) {
							var containerInfoService = $injector.get('basicsProcurementstructureContainerInformationService');
							var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 54, gridContainerGuid,containerInfoService);
							characterColumnService.appendCharacteristicCols(readData.dtos);
						}

						return dataRead;
					}

				}]);
})(angular);