/**
 * Created by lvy on 8/21/2018.
 */
(function (angular) {
	'use strict';
	/* global globals, _ */
	/* jshint -W072 */
	var moduleName = 'documents.project';
	var projectDocumentModule = angular.module(moduleName);
	projectDocumentModule.constant('documentsProjectDocumentOperationType', {
		create: 1,
		modify: 2,
		upload: 3,
		open: 4,
		download: 5
	});
	projectDocumentModule.factory('documentsProjectDocumentHistoryDataService',
		['$http','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'documentsProjectDocumentOperationType',
			function ($http,dataServiceFactory, basicsLookupdataLookupDescriptorService, documentoperationType) {
				var serviceCache = {};
				function createNewComplete(options) {
					var route = globals.webApiBaseUrl + 'documentsproject/history/';
					var parentService = options.parentService;
					var clerkService;
					var serviceContainer;
					var service;
					var data;
					var serviceOptions = {
						flatLeafItem: {
							module: projectDocumentModule,
							serviceName: 'documentsProjectDocumentHistoryDataService',
							httpCRUD: {
								route: route,
								endRead: 'list'
							},
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										basicsLookupdataLookupDescriptorService.attachData(readData);
										var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
										service.allData = readData.Main;
										return dataRead;
									},
									initCreationData: function initCreationData(createData) {
										createData.mainItemId = parentService.getSelected().Id;
									},
									handleCreateSucceeded: function (newData) {
										var totalList = service.getList();
										if (totalList.length > 0) {
											newData.Sorting = _.max(_.map(totalList, 'Sorting')) + 1;
										} else {
											newData.Sorting = 1;
										}
										service.allData = totalList;
									}
								}
							},
							entityRole: {
								leaf: {
									itemName: 'ProjectDocumentHistory',
									parentService: parentService
								}
							},
							actions: {delete: false, create: false},
							translation: {
								uid: 'documentsProjectDocumentHistoryDataService',
								title: 'cloud.common.documentsProjectHistory',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
							},
							dataProcessor: []
						}
					};
					serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					service = serviceContainer.service;
					data = serviceContainer.data;
					service.name = 'project.document.history';
					service.allData = [];
					service.isFilterByClerk = false;

					function baseCreateDocHistory(parentUpdatedata, operationType) {
						var selectedProjectDocument = parentUpdatedata.data.selectedProjectDocument;
						var docId = selectedProjectDocument.Id;
						var revision = '&revision=' + selectedProjectDocument.Revision;
						operationType = operationType === undefined ? documentoperationType.modify : operationType;
						if (selectedProjectDocument.PrjDocumentFk) {
							docId = selectedProjectDocument.PrjDocumentFk;
						}
						if (selectedProjectDocument && selectedProjectDocument.Id) {
							$http.post(globals.webApiBaseUrl + 'documentsproject/history/create?projectDocId=' + docId + '&operationType=' + operationType + revision, {}).then(function (response) {
								var parentSelected = parentService.getSelected();
								if (parentSelected && response.data.length > 0 &&  parentSelected.Id === response.data[0].PrjDocumentFk) {
									service.allData.push(response.data[0]);
									if (service.isFilterByClerk && clerkService) {
										var clerkSelected = clerkService.getSelected();
										clerkSelectionChanged(null, clerkSelected);

									}
									else {
										data.itemList.push(response.data[0]);
										data.listLoaded.fire();
									}
								}
							});
						}
					}
					function createDocHistoryAfterPreview(parentUpdatedata) {
						baseCreateDocHistory(parentUpdatedata, documentoperationType.open);
					}
					function createDocHistoryAfterDownload(parentUpdatedata) {
						baseCreateDocHistory(parentUpdatedata, documentoperationType.download);
					}
					function reload() {
						service.load();
					}
					function clerkSelectionChanged(e, entity) {
						if (entity && entity.ClerkFk) {
							var sameClerkList = _.filter(service.allData, function(item) {
								return item.BasClerkFk === entity.ClerkFk;
							});
							service.setListAfterFilterClerk(sameClerkList);
						}
						else {
							service.setListAfterFilterClerk(service.allData);
						}
					}

					service.clickBtnFilterByClerk = function clickBtnFilterByClerk(newValue) {
						service.isFilterByClerk = newValue;
						if (service.isFilterByClerk) { // filter
							if (clerkService === undefined) {
								var otherNodeService = parentService.getChildServices();
								clerkService = _.find(otherNodeService, function(s) {
									return s.getServiceName() === 'documentsprojectclerkdocumentcentralquerydataservice';
								});
							}
							var clerkSelected;
							if (clerkService) {
								clerkSelected = clerkService.getSelected();
								clerkService.unregisterSelectionChanged(clerkSelectionChanged);
								clerkService.registerSelectionChanged(clerkSelectionChanged);
							}
							if (clerkSelected) { // select clerk
								clerkSelectionChanged(null, clerkSelected);
							}
						}
						else { // not filter
							if (clerkService) {
								clerkService.unregisterSelectionChanged(clerkSelectionChanged);
							}
							if (service.allData.length) {
								service.setListAfterFilterClerk(service.allData);
							}
						}
					};
					service.setListAfterFilterClerk = function setListAfterFilterClerk(items) {
						data.doClearModifications(null, data);
						data.selectedItem = null;
						data.itemList.length = 0;
						_.forEach(items, function (item) {
							data.itemList.push(item);
						});
						data.listLoaded.fire();
					};
					service.createHistoryForPreviewAndDownloadInDocRevision = function(revisionService) {
						if (revisionService.onPreviewDocCreateHistory) {
							revisionService.onPreviewDocCreateHistory.register(createDocHistoryAfterPreview);
						}
						if (revisionService.onDownloadDocCreateHistory) {
							revisionService.onDownloadDocCreateHistory.register(createDocHistoryAfterDownload);
						}
					};
					if (parentService.onUpdateDocCreateHistory) {
						parentService.onUpdateDocCreateHistory.register(baseCreateDocHistory);
					}
					if (parentService.onPreviewDocCreateHistory) {
						parentService.onPreviewDocCreateHistory.register(createDocHistoryAfterPreview);
					}
					if (parentService.onDownloadDocCreateHistory) {
						parentService.onDownloadDocCreateHistory.register(createDocHistoryAfterDownload);
					}
					if (parentService.onUpdateSucceeded) {
						parentService.onUpdateSucceeded.register(reload);
					}

					var revisionService = _.filter(parentService.getChildServices(), function(s) {
						return s.getServiceName() === 'documentsProjectDocumentRevisionDataService';
					});
					if (revisionService.length && revisionService[0]) {
						service.createHistoryForPreviewAndDownloadInDocRevision(revisionService[0]);
					}

					return service;
				}
				return {
					getService: function (serviceOptions) {
						var documentRevisionService=serviceCache[serviceOptions.moduleName];
						if ((!documentRevisionService)||(!!serviceOptions.documentProjectEntity)) {
							documentRevisionService=serviceCache[serviceOptions.moduleName] = createNewComplete(serviceOptions);
						}
						return documentRevisionService;
					}
				};
			}]);

})(angular);