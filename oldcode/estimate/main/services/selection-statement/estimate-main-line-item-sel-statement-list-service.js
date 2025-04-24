/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemSelStatementListService
	 * @function
	 * @description
	 * estimateMainResourceService is the data service for estimate line item resource related functionality.
	 */
	estimateMainModule.factory('estimateMainLineItemSelStatementListService', [
		'$http', '$injector', '$translate', 'PlatformMessenger', 'estimateMainService', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'estimateMainLineItemSelectionStatementImageProcessor', 'estimateMainLiSelStatementListValidationProcessService',
		'estimateMainLineItemSelectionStatementProcessor','cloudCommonLanguageService',
		function ($http, $injector, $translate, PlatformMessenger, estimateMainService, platformDataServiceFactory, ServiceDataProcessArraysExtension,
			estimateMainLineItemSelectionStatementImageProcessor, estimateMainLiSelStatementListValidationProcessService,
			estimateMainLineItemSelectionStatementProcessor, cloudCommonLanguageService) {

			let trLanguages = [];
			let myCreationData = {};

			cloudCommonLanguageService.getLanguageItems().then(function (data) {
				trLanguages = data.filter(function (item) {
					return !item.IsDefault;
				});
			});

			let estimateMainResourceServiceOption = {
				hierarchicalRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainLineItemSelStatementListService',
					entityNameTranslationID: 'estimate.main.LineItemSelectionStatement',
					httpCreate: { route: globals.webApiBaseUrl + 'estimate/main/selstatement/', endCreate: 'create' },

					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/selstatement/',
						endRead: 'tree',
						initReadData: function initReadData(readData) {
							let projectModule = 'project.main';
							let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');

							let project = cloudDesktopPinningContextService.getPinningItem(projectModule);
							let estHeader = cloudDesktopPinningContextService.getPinningItem(moduleName);

							// eslint-disable-next-line no-prototype-builtins
							if (project && project.hasOwnProperty('id') && estHeader && estHeader.hasOwnProperty('id')){
								readData.filter = '?projectId=' + project.id + '&headerId=' + estHeader.id;
							}else{
								let projectId = estimateMainService.getSelectedProjectId();
								projectId = projectId ? projectId : -1;
								let headerId = estimateMainService.getSelectedEstHeaderId();

								readData.filter = '?projectId=' + projectId + '&headerId=' + headerId;
							}
						},
						usePostForRead: false
					},

					httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
					httpDelete: {route: globals.webApiBaseUrl + 'estimate/main/selstatement/', endDelete: 'delete'},

					actions: { create: 'hierarchical', canCreateCallBackFunc: canCreate, canCreateChildCallBackFunc: canCreateChild, delete: {}, canDeleteCallBackFunc: canDelete },
					entitySelection: {supportsMultiSelection: true},
					setCellFocus:true,
					presenter: {
						tree: {
							parentProp: 'EstLineItemSelStatementFk',
							childProp: 'EstLineItemSelStatementChildren',
							initCreationData: function initCreationData(creationData) {

								let estMainService = $injector.get('estimateMainService');
								let projectId = estMainService.getSelectedProjectId();
								let headerId = estMainService.getSelectedEstHeaderId();

								creationData.PrjProjectFk = projectId;
								creationData.EstHeaderFk = headerId;

								let selectedResourceItem = serviceContainer.service.getSelected();
								if (selectedResourceItem && selectedResourceItem.Id > 0) {
									creationData.EstLineItemSelStatementFk = creationData.parentId;
								}
								// eslint-disable-next-line no-prototype-builtins
								if (myCreationData.hasOwnProperty('lineType')){
									creationData.EstLineItemSelStatementType = myCreationData.lineType;
								}
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								return serviceContainer.data.handleReadSucceeded(readItems, data);
							},
							handleCreateSucceeded : function(){

							}
						}
					},
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							itemName: 'EstLineItemSelStatements',
							moduleName: moduleName,
							handleUpdateDone:function handleUpdateDone(updateData, response, data) {
								traverseCheckAfterUpdateDone(updateData, response);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								service.updateCheckBoxStatus.fire();
							}
						}
					},
					translation: {
						uid: 'estimateMainLineItemSelStatementListService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					},

					dataProcessor: [new ServiceDataProcessArraysExtension(['EstLineItemSelStatementChildren']), estimateMainLineItemSelectionStatementImageProcessor, estimateMainLineItemSelectionStatementProcessor]
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainResourceServiceOption);

			let service = serviceContainer.service;
			let data = serviceContainer.data;

			angular.extend(data, {
				isFilterActive: false,
				doNotLoadOnSelectionChange: true,
				showHeaderAfterSelectionChanged: null, // disable hint text updating
				newEntityValidator: estimateMainLiSelStatementListValidationProcessService,
				provideUpdateData: provideUpdateData
			});

			angular.extend(service, {
				init: new PlatformMessenger(),
				refreshToShowTranslations: new PlatformMessenger(),
				filterChanged: new PlatformMessenger(),
				updateCheckBoxStatus:new PlatformMessenger(),
				getFilterStatus:  getFilterStatus,
				setFilterStatus: setFilterStatus,
				handleUpdateDone: handleUpdateDone,
				createNewItem: createNewItem,
				createNewDivision: createNewDivision,
				createNewSubDivision: createNewSubDivision,
				applyFilters: applyFilters,
				filterSelectionSt: filterSelectionSt,
				getImportOptions: getImportOptions,
				getExportOptions: getExportOptions,
				traverseCheckChildren: traverseCheckChildren,
				traverseCheckParent:traverseCheckParent,
				traverseCheckTree:traverseCheckTree,
				getAssemblyLookupSelectedItems: getAssemblyLookupSelectedItems,
				markersChanged: markersChanged,
				getContainerData: getContainerData // This is used for the descriptioninfo translation cell directive
			});

			return serviceContainer.service;

			function provideUpdateData(updateData) {
				updateData.EstHeaderId = estimateMainService.getSelectedEstHeaderId();
			}

			function canCreate(){
				let projectId = estimateMainService.getSelectedProjectId();
				return projectId && projectId > 0;
			}

			function canCreateChild(){
				// let projectId = estimateMainService.getSelectedProjectId();
				// let selected = service.getSelected();
				// // eslint-disable-next-line no-prototype-builtins
				// return (projectId && projectId > 0) && (_.isObject(selected) && selected.hasOwnProperty('Id')) && selected.EstLineItemSelStatementType === 1;
				return true;
			}

			function canDelete(){
				return true;
			}

			function getFilterStatus(){
				return data.isFilterActive;
			}

			function setFilterStatus(value){
				data.isFilterActive = value;
			}

			// TODO: update done, update tree
			/* function handleUpdateDone(data){
				let items = data.EstLineItemSelStatements || [];
				_.forEach(items, function(item){
					if(item && _.isObject(item) && item.Id) {
						let oldItem = _.find(service.getList(), {Id : item.Id});
						if(oldItem){
							angular.extend(oldItem, item);
						}
					}
				});

				//Refresh UI (Removes validations)
				service.gridRefresh();
			} */
			function handleUpdateDone(updateData, response) {
				data.handleOnUpdateSucceeded(updateData, response, data, true);
			}

			function createNewItem(){
				myCreationData.lineType = 0; // item
				let selected = service.getSelected();
				if (!_.isEmpty(selected) && selected.EstLineItemSelStatementType === 1){
					service.createChildItem();
				}else{
					service.createItem();
				}
			}

			function createNewDivision(){
				myCreationData.lineType = 1; // folder
				service.createItem();
			}

			function createNewSubDivision(){
				myCreationData.lineType = 1; // folder
				service.createChildItem();
			}

			function applyFilters(selStatements, applyForCurrentLineItems){
				serviceContainer.data.reloadOnAppliedAssignment = true;
				let url = globals.webApiBaseUrl + 'estimate/main/selstatement/applyfilters';
				let estMainService = $injector.get('estimateMainService');
				let headerId = estMainService.getSelectedEstHeaderId();
				let projectId = estMainService.getSelectedProjectId();
				let filterRequest = estMainService.getLastFilter();
				let postData = {
					projectFk: projectId,
					headerFk: headerId,
					ids : _.map(selStatements, 'Id'),
					applyForCurrentLineItems: !!applyForCurrentLineItems,
					filterRequest: filterRequest
				};
				return $http.post(url, postData);
			}

			function filterSelectionSt(selStatements){
				let url = globals.webApiBaseUrl + 'estimate/main/selstatement/filterselectionSt';
				let estMainService = $injector.get('estimateMainService');
				let headerId = estMainService.getSelectedEstHeaderId();
				let projectId = estMainService.getSelectedProjectId();
				let postData = {
					projectFk: projectId,
					headerFk: headerId,
					ids : _.map(selStatements, 'Id'),
					applyForCurrentLineItems: false,
					currentLineItemIds: []
				};
				return $http.post(url, postData);
			}

			function getImportOptions(){
				let importOptions = {
					wizardParameter:{},
					ModuleName: moduleName,
					DoubletFindMethodsPage: {
						skip: true
					},
					CustomSettingsPage: {
						skip:false,
						Config: {
							showGrouping: false,
							groups: [
								{
									gid: 'lineItemSelectionImport',
									header: '',
									header$tr$: '',
									isOpen: true,
									visible: true,
									sortOrder: 1
								}
							],
							rows: [
								{
									gid: 'lineItemSelectionImport',
									rid: 'OverrideDocument',
									label: $translate.instant('estimate.main.lineItemSelStatement.overwriteDocument'),
									label$tr$: 'estimate.main.lineItemSelStatement.overwriteDocument',
									type: 'boolean',
									model: 'OverrideDocument',
									validator:overrideValidtor,
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'lineItemSelectionImport',
									rid: 'ModifiedDocument',
									label: $translate.instant('estimate.main.lineItemSelStatement.modifyDocument'),
									label$tr$: 'estimate.main.lineItemSelStatement.modifyDocument',
									type: 'boolean',
									model: 'ModifiedDocument',
									validator:overrideValidtor,
									visible: true,
									sortOrder: 1
								}
							]
						}
					},
					ImportDescriptor: {
						Fields: [
							{
								PropertyName: 'Code',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'code',
								Editor: 'domain',
								DisplayName: 'cloud.common.entityCode'
							},
							{
								PropertyName: 'Description',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'cloud.common.entityDescription'
							},
							{
								PropertyName: 'Structure',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'cloud.common.entityStructure'
							},
							{
								PropertyName: 'SelectionStatementType',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.lineItemSelStatement.recordType'
							},
							{
								PropertyName: 'estassemblyfirstlevelcat',
								EntityName: 'Assembly',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.lineItemSelStatement.parentLevelAssembly'
							},
							{
								PropertyName: 'estassemblycat',
								EntityName: 'Assembly',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.assemblies.estAssemblyCat'
							},
							{
								PropertyName: 'estassemblyfk',
								EntityName: 'Assembly',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.estAssemblyFk'
							},
							{
								PropertyName: 'boqheaderitemfk',
								EntityName: 'BoqItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.boqHeaderRef'
							},
							{
								PropertyName: 'Reference',
								EntityName: 'BoqItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.boqItemFk'
							},
							{
								PropertyName: 'wicgroupitemfk',
								EntityName: 'BoqItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.boqWicCatFk'
							},
							{
								PropertyName: 'wicheaderitemfk',
								EntityName: 'BoqItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.wicBoqHeaderFk'
							},
							{
								PropertyName: 'wicitemfk',
								EntityName: 'BoqItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.wicBoqItemFk'
							},
							{
								PropertyName: 'quantity',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'quantity',
								Editor: 'domain',
								DisplayName: 'cloud.common.entityQuantity'
							},
							{
								PropertyName: 'selectstatement',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.lineItemSelStatement.selectStatement'
							},
							{
								PropertyName: 'schedulefk',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.scheduleCode'
							},
							{
								PropertyName: 'psdactivityfk',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.psdActivityFk'
							},
							{
								PropertyName: 'mdlmodelfk',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'model.main.entityModel'
							},
							{
								PropertyName: 'objectselectstatement',
								EntityName: 'EstLineItemSelStatement',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'estimate.main.lineItemSelStatement.objectSelectStatement'
							}
						],
						CustomSettings: {
							OverrideDocument: true,
							ModifiedDocument: false,
							Translations: ['Description']
						},
						FieldProcessor: function (parentScope, oldProfile) {
							processTrFields();

							if(oldProfile && oldProfile.ImportDescriptor && oldProfile.ImportDescriptor.Fields){
								let oldFields = oldProfile.ImportDescriptor.Fields;
								_.forEach(parentScope.entity.ImportDescriptor.Fields, function (item) {
									let res = _.find(oldFields, function (field) {
										return field.PropertyName === item.PropertyName;
									});
									if (res && _.isUndefined(item.MappingName)) {
										item.MappingName = res.MappingName;
									}
								});
							}

							for(let i= 0; i< parentScope.entity.ImportDescriptor.Fields.length; i++){
								parentScope.entity.ImportDescriptor.Fields[i].Id = i;
							}

							function mapTrColumnFn(field, fields) {
								return function (item) {
									let index = _.findIndex(fields, {PropertyName: field.PropertyName + '_' + item.Culture});
									if(index === -1) {
										return {
											PropertyName: field.PropertyName + '_' + item.Culture,
											EntityName: field.EntityName,
											DomainName: field.DomainName,
											Editor: field.Editor,
											DisplayName: $translate.instant(field.DisplayName) + ' - ' + item.Description,
											ValueName: field.ValueName ? field.ValueName + '_' + item.Culture : null,
											__isTrColumn: true
										};
									}
								};
							}

							function processTrFields() {
								// remove all translation columns first.
								parentScope.entity.ImportDescriptor.Fields = parentScope.entity.ImportDescriptor.Fields.filter(function (field) {
									return !field.__isTrColumn;
								});

								let fields = parentScope.entity.ImportDescriptor.Fields;
								let translations = parentScope.entity.ImportDescriptor.CustomSettings.Translations;

								translations.forEach(function (propertyName) {
									let field = _.find(fields, {PropertyName: propertyName});
									let index = _.findIndex(fields, {PropertyName: propertyName});

									if (index < 0) {
										return;
									}

									let args = [index + 1, 0];
									let trFields = trLanguages.map(mapTrColumnFn(field, fields));
									trFields = _.filter(trFields, function (trField) {
										return !!trField;
									});
									fields.splice.apply(fields, args.concat(trFields));
								});
							}
						},
						BeforeMappingFields: function(parentScope) {
							let headers = $injector.get('basicsImportHeaderService').getList();
							_.each(parentScope.entity.ImportDescriptor.Fields, function (field) {
								let existItem = _.find(headers, {'description': field.MappingName});
								if (!existItem) {
									field.MappingName = '';
								}
							});
						}
					},
					HandleImportSucceed:function(){
						service.load();
					},
					GetSelectedMainEntityCallback: function () {
						let selectItem =  estimateMainService.getSelectedProjectId();
						if (selectItem > 0) {
							return selectItem;
						}
						else {
							return null;
						}
					}
				};
				return importOptions;
			}

			function getExportOptions() {
				let projectId = estimateMainService.getSelectedProjectId() || -1;

				let exportOptions = {
					ModuleName: moduleName,
					MainContainer: {
						Id: 'estimate.main.lineItemSelectionStatement',
						Label: 'estimate.main.lineItemSelStatement.containerTitle',
						NoExportFields: ['Id', 'Structure', 'isexecute', 'wicheaderitemfk', 'wiccatfk', 'Select', 'boqrootref', 'BoQ-RootItemRefNo', 'schedulefk',
							'psdactivityfk', 'Activity-Description', 'Activity Schedule', 'mdlmodelfk', 'Model-Description'],
						SelectedColumns: []
					},
					SubContainers: [],
					Service: service,
					Language2Id: projectId // Workaround to pass selected ProjectId
				};

				return exportOptions;
			}

			function  overrideValidtor(entity, value, model) {
				if (model === 'OverrideDocument') {
					if (value) {
						entity.ModifiedDocument = false;
					}
				}
				else if (model === 'ModifiedDocument') {
					if(value){
						entity.OverrideDocument = false;
					}
				}
			}


			function traverseCheckChildren(item, childProp, isChecked, childrenSelectStatusList){
				let children = item[childProp];
				if (_.isArray(children) && children.length > 0){
					for (let i = 0; i < children.length; i++) {
						let isChange = children[i].IsExecute!==isChecked;
						children[i].IsExecute = isChecked;
						childrenSelectStatusList.push(children[i]);
						if(isChange) {
							service.markItemAsModified(children[i]);
						}
						traverseCheckChildren(children[i], childProp, isChecked, childrenSelectStatusList);
					}
				}
			}

			function traverseCheckParent(item, childProp, parentProp, list) {
				let parent = _.find(list, {'Id': item[parentProp]});
				if (parent) {
					let hasTrueValue = _.findIndex(parent[childProp], {'IsExecute': true}) !== -1;
					let hasFalseValue = _.findIndex(parent[childProp], {'IsExecute': false}) !== -1;
					parent.IsExecute = hasTrueValue && hasFalseValue ? null : hasTrueValue && !hasFalseValue;
					traverseCheckParent(parent, childProp, parentProp, list);
				}
			}

			function traverseCheckTree(item,val) {
				var childs = [],
					childProp = 'EstLineItemSelStatementChildren',
					parentProp = 'EstLineItemSelStatementFk',
					isChecked = _.isUndefined(val) ?  item.IsExecute :  val,
					list = service.getList();
				traverseCheckChildren(item, childProp, isChecked, childs);
				traverseCheckParent(item, childProp, parentProp, list);
			}

			function traverseCheckAfterUpdateDone(updateData, response) {
				if (response.EstLineItemSelStatements && response.EstLineItemSelStatements.length > 0) {
					let list = service.getList();
					_.forEach(response.EstLineItemSelStatements, (e) => {
						let item = _.find(list, {'Id': e.Id});
						if (item.IsExecute !== e.IsExecute) {
							e.IsExecute = item.IsExecute;
						}
					});
				}
			}
			
			function getAssemblyLookupSelectedItems(entity, assemblySelectedItems){
				if (!_.isEmpty(assemblySelectedItems)){
					let assemblySelectedItem = _.head(assemblySelectedItems);
					let selectedItem = service.getSelected();
					angular.extend(selectedItem, {
						EstHeaderAssemblyFk : assemblySelectedItem.EstHeaderFk
					});
				}
			}

			function markersChanged(){
				setFilterStatus(false);
				service.filterChanged.fire();
			}

			function getContainerData(){
				return serviceContainer.data;
			}

		}]);
})(angular);
