/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.project';
	let projectMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateProjectEstimateLineItemSelStatementListService
	 * @function
	 * @description
	 * estimateMainResourceService is the data service for estimate line item resource related functionality.
	 */
	projectMainModule.factory('estimateProjectEstimateLineItemSelStatementListService', [
		'$http', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', '$translate', 'projectMainService', 'ServiceDataProcessArraysExtension', 'estimateMainLineItemSelectionStatementImageProcessor',
		'estimateProjectLiSelStatementListValidationProcessService', 'estimateMainLineItemSelectionStatementProcessor', 'cloudCommonLanguageService',
		function (
			$http, $injector, PlatformMessenger, platformDataServiceFactory, $translate, projectMainService, ServiceDataProcessArraysExtension, estimateMainLineItemSelectionStatementImageProcessor,
			estimateProjectLiSelStatementListValidationProcessService, estimateMainLineItemSelectionStatementProcessor, cloudCommonLanguageService) {

			let trLanguages = [];

			cloudCommonLanguageService.getLanguageItems().then(function (data) {
				trLanguages = data.filter(function (item) {
					return !item.IsDefault;
				});
			});

			let estimateMainResourceServiceOption = {
					hierarchicalLeafItem: {
						module: projectMainModule,
						serviceName: 'estimateProjectEstimateLineItemSelStatementListService',
						entityNameTranslationID: 'project.main.LineItemSelectionStatement',
						httpCreate: { route: globals.webApiBaseUrl + 'estimate/main/selstatement/', endCreate: 'create' },

						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/selstatement/',
							endRead: 'tree',
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
									creationData.PrjProjectFk = creationData.MainItemId;
									let selectedItem = serviceContainer.service.getSelected();
									if (selectedItem && selectedItem.Id > 0) {
										creationData.EstLineItemSelStatementFk = creationData.parentId;
									}
									// eslint-disable-next-line no-prototype-builtins
									if (myCreationData.hasOwnProperty('lineType')){
										creationData.EstLineItemSelStatementType = myCreationData.lineType;
									}
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									return serviceContainer.data.handleReadSucceeded(readItems, data);
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'EstLineItemSelStatement',
								moduleName: moduleName,
								parentService: projectMainService,
								parentFilter: 'projectId'
							}
						},
						translation: {
							uid: 'estimateProjectEstimateLineItemSelStatementListService',
							title: 'Title',
							columns: [
								{
									header: 'cloud.common.entityDescription',
									field: 'DescriptionInfo'
								}]
						},

						dataProcessor: [new ServiceDataProcessArraysExtension(['EstLineItemSelStatementChildren']), estimateMainLineItemSelectionStatementImageProcessor, estimateMainLineItemSelectionStatementProcessor]
					}
				}, myCreationData = {};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainResourceServiceOption);

			let service = serviceContainer.service;
			let data = serviceContainer.data;

			angular.extend(data, {
				// doNotLoadOnSelectionChange: true, //It is required for project
				showHeaderAfterSelectionChanged: null, // disable hint text updating
				newEntityValidator: estimateProjectLiSelStatementListValidationProcessService
			});

			angular.extend(service, {
				init: new PlatformMessenger(),

				handleUpdateDone: handleUpdateDone,
				createNewItem: createNewItem,
				createNewDivision: createNewDivision,
				createNewSubDivision: createNewSubDivision,

				getImportOptions: getImportOptions,
				getExportOptions: getExportOptions,
				traverseCheckChildren: traverseCheckChildren,
				getAssemblyLookupSelectedItems: getAssemblyLookupSelectedItems,
				getContainerData: getContainerData // This is used for the descriptioninfo translation cell directive
			});

			return serviceContainer.service;

			function canCreate(){
				let selectedItem = projectMainService.getSelected();
				return selectedItem && selectedItem.Id;
			}

			function canCreateChild(){
				return true;
			}

			function canDelete(){
				return true;
			}

			function handleUpdateDone(){
				// Refresh UI
				// Validation under tree structure is not cleared automatically, so we need to refresh UI to clear unhandled validation styles
				service.gridRefresh();
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

			function getImportOptions(){
				let importOptions = {
					ModuleName: 'estimate.main',
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
									label: 'Overwrite Document',
									label$tr$: 'estimate.main.lineItemSelStatement.OverrideDocument',
									type: 'boolean',
									model: 'OverrideDocument',
									validator:overrideValidtor,
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'lineItemSelectionImport',
									rid: 'ModifiedDocument',
									label: 'Modify Document',
									label$tr$: 'estimate.main.lineItemSelStatement.ModifiedDocument',
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
						let selectItem =  projectMainService.getSelected();
						if (selectItem && selectItem.Id > 0) {
							return selectItem.Id;
						}
						else {
							return null;
						}
					}
				};
				return importOptions;
			}

			function getExportOptions() {
				let prjSelected = projectMainService.getSelected();
				let projectId = prjSelected && prjSelected.Id ? prjSelected.Id: -1;

				let exportOptions = {
					ModuleName: 'estimate.main',
					MainContainer: {
						Id: 'project.main.lineItemSelectionStatement',
						Label: 'estimate.main.lineItemSelStatement.containerTitle',
						NoExportFields: ['Id', 'Structure', 'isexecute', 'wicheaderitemfk', 'wiccatfk', 'Select', 'boqrootref', 'BoQ-RootItemRefNo', 'schedulefk',
							'psdactivityfk', 'Activity-Description', 'Activity Schedule', 'mdlmodelfk', 'Model-Description'],
						SelectedColumns: []
					},
					SubContainers: [],
					Service:service,
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
						children[i].IsExecute = isChecked;
						childrenSelectStatusList.push(children[i]);
						traverseCheckChildren(children[i], childProp, isChecked, childrenSelectStatusList);
					}
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

			function getContainerData(){
				return serviceContainer.data;
			}

		}]);
})(angular);
