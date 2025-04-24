/**
 * Created by alm on 2020-6-1.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).factory('documentsProjectModelObjectDataService', ['globals','$http', 'platformDataServiceFactory','basicsLookupdataLookupDescriptorService','basicsLookupdataLookupFilterService','platformObservableService','modelViewerModelSelectionService','modelViewerModelIdSetService','modelViewerCompositeModelObjectSelectionService','modelViewerModelSelectionService',
		'basicsPermissionServiceFactory','platformPermissionService','platformRuntimeDataService','_',
		function (globals,$http, platformDataServiceFactory,basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,platformObservableService,modelSelectionService,modelViewerModelIdSetService,modelViewerCompositeModelObjectSelectionService,modelViewerModelSelectionService,
			basicsPermissionServiceFactory,platformPermissionService,runtimeDataService,_) {

			var serviceCache = {};
			var documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');
			function createNewComplete(options) {
				var parentService = options.parentService;
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'documentsProjectModelObjectDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'documentproject/projectdocument2modelobject/'
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								var selectedDocument= parentService.getSelected();
								if(selectedDocument){
									if(selectedDocument && selectedDocument.PermissionObjectInfo && parentService.getServiceName() === 'documentsProjectDocumentDataService') {
										var hasCreate = documentProjectPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
										if (selectedDocument && selectedDocument.IsReadonly || !hasCreate) {
											return false;
										}
									}
									else
									{
										if(selectedDocument && selectedDocument.IsReadonly || !selectedDocument.CanWriteStatus  || !platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')){
											return false;
										}
									}
									var PrjDocumentStatusFk=selectedDocument.PrjDocumentStatusFk;
									var documentstatuss=basicsLookupdataLookupDescriptorService.getData('documentstatus');
									var documentstatus= _.find(documentstatuss,function(item){ return item.Id===PrjDocumentStatusFk;});
									if(documentstatus&&documentstatus.IsReadonly){
										return false;
									}
									return true;
								}

							},
							canDeleteCallBackFunc: function () {
								var selectedItem = parentService.getSelected();
								if(selectedItem && (selectedItem.IsReadonly || !selectedItem.CanDeleteStatus)){
									return false;
								}
								return true;
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Document2mdlObject',
								parentService: parentService
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									var models=readData.Model;
									var main=readData.Main;

									basicsLookupdataLookupDescriptorService.attachData({'Model': models});
									var selectedItem = parentService.getSelected();
									var isReadonly = false;
									if(selectedItem && selectedItem.PermissionObjectInfo && parentService.getServiceName() === 'documentsProjectDocumentDataService') {
										var hasWrite = documentProjectPermissionService.hasWrite('4eaa47c530984b87853c6f2e4e4fc67e');
										if (selectedItem && selectedItem.IsReadonly || !hasWrite) {
											isReadonly = true;
										}
									}
									else
									{
										if(selectedItem && (selectedItem.IsReadonly || !selectedItem.CanWriteStatus)  || !platformPermissionService.hasWrite('4eaa47c530984b87853c6f2e4e4fc67e')){
											isReadonly = true;
										}
									}
									// set readonly from parent
									if(isReadonly){
										var readonlyFiels = [{field:'MdlModelFk', readonly: true}, {field:'MdlObjectFk', readonly: true}];
										_.forEach(main, function (item) {
											runtimeDataService.readonly(item,readonlyFiels);
										});
									}

									var dataRead = serviceContainer.data.handleReadSucceeded(main, data);
									return dataRead;
								},
								handleCreateSucceeded: function initCreationData(newData) {
									var selectedItem = parentService.getSelected();
									newData.PrjDocumentFk = selectedItem.Id;
								}
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				serviceContainer.data.loadOnSelectedEntitiesChanged = true;

				var service = serviceContainer.service;
				service.createObjectSetToDocument = function (param) {

					service.parentService().update().then(function () {
						$http.post(globals.webApiBaseUrl + 'documentproject/projectdocument2modelobject/viewer2objectcopy', param).then(function (response) {
							if (response) {
								service.addList(response.data);
							}
						}).catch(function () {

						});
					});
				};


				service.addList = function addList(data) {
					var list = serviceContainer.data.itemList;
					if (data && data.length) {
						angular.forEach(data, function (d) {
							var item = _.find(list, {Id: d.Id});
							if (item) {
								angular.extend(list[list.indexOf(item)], d);
							} else {
								serviceContainer.data.itemList.push(d);
							}
						});
					}
					serviceContainer.data.listLoaded.fire();
					service.gridRefresh();
				};


				var filters = [
					{
						key: 'documents-project-model-by-company-filter',
						fn: function (context) {

							var documentsProjectService = service.parentService();
							var documentProject = documentsProjectService.getSelected();
							if(documentProject) {
								if (!_.isNull(documentProject.PrjProjectFk)) {
									return context.ProjectFk === documentProject.PrjProjectFk && context.Code !== '<PREVIEW>';
								}
								else {
									return context.CompanyFk === documentProject.BasCompanyFk && context.Code !== '<PREVIEW>';
								}
							}
						}
					},{
						key: 'documents-project-model-object-by-model-filter',
						serverSide: false,
						fn: function (item) {

							return item.MdlModelFk || item.ModelFk;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);



				service.updateModelSelection = platformObservableService.createObservableBoolean();

				service.updateModelSelection.uiHints = {
					id: 'toggleObjectSelection',
					caption$tr$: 'estimate.main.selectLineItemObjects',
					iconClass: 'tlb-icons ico-view-select'
				};

				function updateModelSelectionIfRequired() {
					if (service.updateModelSelection.getValue()) {
						var selModelId = modelSelectionService.getSelectedModelId();
						if (selModelId) {
							var selItems = service.getSelectedEntities();
							service.selectAssignedObject(selItems);
						}
					}
				}

				service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
				service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);


				service.selectAssignedObject = function (assignedObjects) {
					if (modelViewerModelSelectionService.getSelectedModelId()) {
						if(assignedObjects && assignedObjects.length){
							var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();

							modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
								selectedObjectIds[subModelId] = [];
							});

							selectedObjectIds = selectedObjectIds.useGlobalModelIds();

							assignedObjects.forEach(function (assignedObject) {
								if(angular.isArray(selectedObjectIds[assignedObject.MdlModelFk])){
									selectedObjectIds[assignedObject.MdlModelFk].push(assignedObject.MdlObjectFk);
								}
							});

							if (!selectedObjectIds.isEmpty()) {
								modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
							}
						}
						else {
							modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
						}
					}
				};

				return service;
			}



			return {
				getService:function (serviceOptions)  {
					var documentModelService = serviceCache[serviceOptions.moduleName];
					if (!documentModelService) {
						documentModelService = serviceCache[serviceOptions.moduleName] = createNewComplete(serviceOptions);
					}
					return documentModelService;
				}
			};


		}]);
})(angular);
