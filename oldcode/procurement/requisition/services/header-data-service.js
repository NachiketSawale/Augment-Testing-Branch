(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals, moment */
	let moduleName = 'procurement.requisition';
	let procurementRequisitionModule = angular.module(moduleName);
	/** @namespace created.ReqHeaderDto */
	/** @namespace response.data.ReqHeader */
	/** @namespace updateData.BoqItemToDelete */
	/** @namespace entity.Requisition2PackageData */
	/**
	 * @ngdoc service
	 * @name procurementRequisitionHeaderDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide requisition header data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	procurementRequisitionModule.factory('procurementRequisitionHeaderDataService',
		['_', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
			'cloudDesktopSidebarService', 'procurementContextService', 'platformRuntimeDataService', 'ServiceDataProcessDatesExtension',
			'PlatformMessenger', 'procurementRequisitionHeaderReadonlyProcessor', '$injector',
			'platformContextService', 'basicsCommonMandatoryProcessor', 'basicsLookupdataLookupDataService','procurementCommonGeneralsDataService','procurementCommonCharacteristicDataService','platformDataServiceModificationTrackingExtension',
			'procurementRequisitionNumberGenerationSettingsService','$q','$translate','platformModalService','procurementCommonCreateModuleService', 'procurementCommonHeaderTextNewDataService', '$timeout',
			'platformGridAPI','basicsCommonCharacteristicService', 'platformModuleStateService',
			'prcCommonSplitOverallDiscountService', 'SchedulingDataProcessTimesExtension', 'basicsLookupdataSimpleLookupService',
			'boqMainLookupFilterService', 'procurementRequisitionCreationInitialDialogService', 'platformDataServiceConfiguredCreateExtension',
			'prcCommonProcessChangeVatGroupDialog','procurementCommonOverrideHeaderInfoService', 'procurementCommonHelperService',
			function (_, $http, dataServiceFactory, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService,
				cloudDesktopSidebarService, moduleContext, runtimeDataService, ServiceDataProcessDatesExtension,
				PlatformMessenger, procurementRequisitionHeaderReadonlyProcessor, $injector,
				platformContextService, mandatoryProcessor, lookupDataService,procurementCommonGeneralsDataService,procurementCommonCharacteristicDataService,platformDataServiceModificationTrackingExtension,
				procurementRequisitionNumberGenerationSettingsService,$q,$translate,platformModalService,procurementCommonCreateModuleService, procurementCommonHeaderTextNewDataService, $timeout,
				platformGridAPI,basicsCommonCharacteristicService, platformModuleStateService,
				prcCommonSplitOverallDiscountService, SchedulingDataProcessTimesExtension, basicsLookupdataSimpleLookupService,
				boqMainLookupFilterService, procurementRequisitionCreationInitialDialogService, platformDataServiceConfiguredCreateExtension,
				prcCommonProcessChangeVatGroupDialog,procurementCommonOverrideHeaderInfoService, procurementCommonHelperService) {
				let service = {},
					onFilterLoaded = new PlatformMessenger(),
					onFilterUnLoaded = new PlatformMessenger();
				let characteristicColumn = '';
				let gridContainerGuid = '509f8b1f81ea475fbebf168935641489';
				let createParam = {};
				let serviceContainer = null;

				let sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					includeChainedItems: false,
					quotesFromSameRFQ: null,
					showOptions: true,
					showProjectContext: false, // TODO: rei remove it
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch:true
				};
				let mergeUpdatedBoqRootItemIntoBoqList;
				let hasItemsOrBoqs = {
					items: false,
					prcboqs: false,
					boqitems: false
				};
				let needUpdateUcToItemsBoqs = false;
				let serviceOptions = {
					flatRootItem: {
						module: procurementRequisitionModule,
						serviceName: 'procurementRequisitionHeaderDataService',
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/requisition/requisition/',
							endCreate: 'createrequisition'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/requisition/requisition/',
							endDelete: 'deleterequisition'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/requisition/requisition/',
							endUpdate: 'updaterequisition'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/requisition/requisition/',
							endRead: 'listrequisition',
							usePostForRead: true
						},
						entityRole: {
							root: {
								itemName: 'ReqHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameRequisition',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								responseDataEntitiesPropertyName: 'Main',
								// TODO: it is just a work around to set Configuration readonly after saving a new item
								handleUpdateDone: function (updateData, response, data) {
									data.handleOnUpdateSucceeded(updateData, response, data, true);
									if ((updateData.HeaderPparamToSave?.length) ||
										((updateData.HeaderPparamToDelete?.length))
									) {
										$injector.get('procurementRequisitionItemDataService').load();
									}

									let currentItem = _.find(data.getList(), {Id: updateData.MainItemId});
									service.updateReadOnly(currentItem, 'PrcHeaderEntity.ConfigurationFk');
									service.onParentUpdated.fire();
									mergeUpdatedBoqRootItemIntoBoqList(response);
									service.showModuleHeaderInformation();
								},
								showProjectHeader: {
									getProject: function (entity) {
										if(!entity?.ProjectFk){return null;}
										return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
									}
								}
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.ProjectFk = moduleContext.loginProject;
									creationData.ConfigurationFk = createParam.ConfigurationFk;
									creationData.Code = createParam.Code;
									createParam = {};
								},
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									let items = {
										FilterResult: readData.FilterResult,
										dtos: readData.Main || []
									};
									let dataRead = serviceContainer.data.handleReadSucceeded(items, data);
									angular.forEach(readData.Main, function (item) {
										service.setEntityReadOnly(item);
									});
									service.goToFirst(data);
									// handel characterist
									let exist = platformGridAPI.grids.exist(gridContainerGuid);
									if (exist) {
										let containerInfoService = $injector.get('procurementRequisitionContainerInformationService');
										let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 51, gridContainerGuid.toUpperCase(),containerInfoService);
										characterColumnService.appendCharacteristicCols(readData.Main);
									}
									return dataRead;
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						dataProcessor: [procurementRequisitionHeaderReadonlyProcessor,{
							processItem: angular.noop,
							revertProcessItem: function (entity) {
								if (entity.Version === 0) {
									let config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.PrcHeaderEntity.ConfigurationFk});
									let hasToGenerate = config && procurementRequisitionNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
									if (hasToGenerate) {
										entity.Code = 'IsGenerated';
									}
								}
							}
						}, new ServiceDataProcessDatesExtension(['DateReceived', 'DateCanceled', 'DateRequired','DateEffective','DeadlineDate','PlannedStart','PlannedEnd','DateAwardDeadline','DateRequested']),
						new SchedulingDataProcessTimesExtension(['DeadlineTime'])],
						entitySelection: {},
						filterByViewer: true,
						actions: {
							delete: {}, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								if (item && !_.isEmpty(item)) {
									if (item.Version === 0) {
										return true;
									}
									else {
										return !moduleContext.isReadOnly;
									}
								}
								return true;
							}
						},
						entityNameTranslationID: 'procurement.requisition.headerGrid.reqheaderGridTitle',
						entityInformation: { module: 'Procurement.Requisition', entity: 'ReqHeader', specialTreatmentService: procurementRequisitionCreationInitialDialogService}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				// reader service
				service = serviceContainer.service;
				service.isProcurementModule=true;
				service.targetSectionId=6;

				let onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
					let promise = created.ReqHeaderDto ? $q.when({data: created}) : $http.post(globals.webApiBaseUrl + 'procurement/requisition/requisition/createsubentitiesaftercreationconfigured', created);
					return promise
						.then(function (response) {
							if (!response?.data) {
								return;
							}
							created = response.data;
							procurementRequisitionNumberGenerationSettingsService.assertLoaded().then(function () {
								let config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: created.ReqHeaderDto.PrcHeaderEntity.ConfigurationFk});
								runtimeDataService.readonly(created.ReqHeaderDto, [{
									field: 'Code',
									readonly: procurementRequisitionNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
								}]);
							});
							// handle characterist
							// Contract characteristic1 SectionId = 6;
							// Contract characteristic2 SectionId = 51;
							// configuration characteristic1 SectionId = 32;
							// configuration characteristic2 SectionId = 55;
							// structure characteristic1 SectionId = 9;
							// structure characteristic2 SectionId = 54;
							basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, created.ReqHeaderDto, 6, 51, 32, 55, 9, 54);
							let exist = platformGridAPI.grids.exist(gridContainerGuid);
							if (exist) {
								let containerInfoService = $injector.get('procurementRequisitionContainerInformationService');
								let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 51, gridContainerGuid.toUpperCase(),containerInfoService);
								characterColumnService.appendDefaultCharacteristicCols(created.ReqHeaderDto);
							}
							return onCreateSucceeded.call(serviceContainer.data, created.ReqHeaderDto, data, creationData).then(function () {
								service.completeItemCreated.fire(null, {
									mainItem: created.ReqHeaderDto,
									totalItems: created.PrcTotalsDto
								});

								service.markCurrentItemAsModified();// when create done the set selected will call by grid which will make selection changed and do clear all modifications.
								$timeout(function () {
									reloadHeaderText(created.ReqHeaderDto);
								}, 500);
							});
						});

				};

				service.getDefaultListForCreated = function getDefaultListForCreated(targetSectionId,configrationSectionId,structureSectionId,newData) {
					let deferred = $q.defer();
					let sourceHeaderId = newData.Version === 0 ? newData.PrcHeaderEntity.ConfigurationFk : service.getConfigurationFk();
					if (!sourceHeaderId) {
						sourceHeaderId = newData.PrcHeaderEntity.ConfigurationFk;
					}
					procurementCommonCharacteristicDataService.getDefaultListForCreated(targetSectionId, sourceHeaderId,configrationSectionId,structureSectionId,newData).then(function (defaultItem) {
						if (defaultItem) {
							deferred.resolve(defaultItem);
						}
					});
					return deferred.promise;
				};

				function reloadHeaderText(item, options) {
					let headerTextDataService = procurementCommonHeaderTextNewDataService.getService(service);
					headerTextDataService.reloadData({
						prcHeaderId: item.PrcHeaderEntity.Id,
						prcConfigurationId: item.PrcHeaderEntity.ConfigurationFk,
						projectId: item.ProjectFk,
						isOverride: options !== null && !angular.isUndefined(options) ? options.isOverride: false
					});
				}

				service.reloadHeaderText = reloadHeaderText;
				service.name = moduleName;
				service.totalFactorsChangedEvent = new PlatformMessenger();
				service.exchangeRateChanged = new PlatformMessenger();
				service.taxCodeFkChanged = new PlatformMessenger();
				service.projectFkChanged = new PlatformMessenger();
				service.completeItemCreated = new PlatformMessenger();
				service.onParentUpdated = new PlatformMessenger();
				service.taxMaterialCatalogFkChanged = new PlatformMessenger();
				service.basisChanged = new PlatformMessenger();
				service.selectedRequisitionStatusChanged = new PlatformMessenger();
				service.vatGroupChanged = new PlatformMessenger();
				service.onRecalculationItemsAndBoQ = new PlatformMessenger();
				service.configurationChanged = new PlatformMessenger();
				service.controllingUnitChanged = new PlatformMessenger();
				service.controllingUnitToItemBoq = new PlatformMessenger();
				/**
				 * navigate from other module.
				 */
				service.navigationCompleted = navigationCompleted;

				// filter events
				service.registerFilterLoad = function (func) {
					onFilterLoaded.register(func);
				};

				service.registerFilterUnLoad = function (func) {
					onFilterUnLoaded.register(func);
				};

				service.getSelectedProjectId = function getSelectedProjectId() {
					let item = service.getSelected();
					if (item && angular.isDefined(item.Id)) {
						return item.ProjectFk;
					}
					return -1;
				};

				let filters = [
					{
						key: 'prc-req-header-project-filter',
						serverSide: true,
						fn: function (currentItem) {
							if(currentItem.PackageFk){
								return {PackageFk: currentItem.PackageFk};
							}else{
								return {};
							}
						}
					},
					{
						key: 'procurement-requisition-header-project-change-filter',
						serverSide: true,
						fn: function () {
							let selected = service.getSelected() || {};
							return 'ProjectFk=' + selected.ProjectFk;
						}
					},
					{
						key: 'prc-req-header-filter',
						serverKey: 'prc-req-header-filter',
						serverSide: true,
						fn: function (currentItem) {
							if (currentItem) {
								return {
									CompanyFk: platformContextService.clientId,// todo stone: is login company?
									ProjectFk: currentItem.ProjectFk,
									ExcludedHeaderId: currentItem.Id
								};
							}
						}
					},
					{
						key: 'procurement-req-material-filter',
						serverSide: true,
						filterIsFramework: true,
						fn: function () {
							let currentItem = service.getSelected();
							if (!currentItem) {
								return '';
							}
							let date = currentItem.DateRequired || Date.now();
							let dateOrderedISO = 'DateTime(' + window.moment(date).utc().format('YYYY,MM,DD') + ')';
							let filterPrefix = '';
							if (service.isFrameworkCatalogTypes?.length) {
								let  typeFilterStr = '(';
								_.forEach(service.isFrameworkCatalogTypes, function (catalogType, idx) {
									typeFilterStr += 'MaterialCatalogTypeFk = ' + catalogType.Id;
									if (service.isFrameworkCatalogTypes.length - 1 === idx) {
										typeFilterStr += ')';
									}
									else {
										typeFilterStr += ' or ';
									}
								});
								filterPrefix = typeFilterStr + ' And ';
							}
							else {
								filterPrefix = 'MaterialCatalogTypeFk = -1 And ';
							}
							let filter = filterPrefix + '(ValidFrom = null Or ValidFrom<=%date%) And (ValidTo = null Or ValidTo>=%date%)';
							filter = filter.replace(/%date%/g, dateOrderedISO);
							return filter;
						}
					},
					{
						key: 'procurement-requisition-header-package-filter',
						serverSide: true,
						fn: function () {
							let loginCompany = moduleContext.loginCompany;
							if (!loginCompany) {
								return null;
							}
							let loginProject = moduleContext.loginProject;
							let currentItem = service.getSelected() || {};

							let targetProject = currentItem.ProjectFk || loginProject;
							if (!targetProject) {
								return {
									BasCompanyFk: loginCompany
								};
							}
							return {
								ProjectFk: targetProject,
								BasCompanyFk: loginCompany
							};
						}
					},
					{
						key: 'prc-req-header-strategy-filter',
						serverSide: true,
						fn: function (currentItem) {
							if (!currentItem || angular.isUndefined(currentItem.Id)) {
								return '1=2';
							}
							let config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcHeaderEntity.ConfigurationFk});
							if(config){
								return 'PrcConfigHeaderFk=' + config.PrcConfigHeaderFk;
							}else {
								return '1=2';
							}

						}
					},
					{
						key: 'prc-req-header-businesspartner-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function () {
							let currentItem = service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
							};
						}
					},// controllingUnitFilter
					{
						key: 'prc-req-controlling-unit-filter',
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						serverSide: true,
						fn: function () {
							let currentItem = service.getSelected();
							if(currentItem) {
								return {
									ByStructure: true,
									ExtraFilter: true,
									PrjProjectFk: currentItem.ProjectFk,
									CompanyFk: null
								};
							}
						}
					},
					{
						key: 'prc-req-header-businesspartner-supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						/* jshint undef:false, unused:false */
						fn: function () {
							let currentItem = service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'prc-req-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.requisitionRubricFk;
						}
					},
					{
						key: 'bas-currency-conversion-filter',
						serverSide: true,
						serverKey: 'bas-currency-conversion-filter',
						fn: function (currentItem) {
							return {companyFk: currentItem.CompanyFk};
						}
					},
					{
						key: 'prc-req-wic-cat-boq-filter',
						serverSide: false,
						serverKey: 'prc-req-wic-cat-boq-filter',
						fn: function(entity) {
							let today = moment.utc().format('YYYY MM DD');
							return (!_.has(entity, 'WicBoq.ValidFrom') || !entity.WicBoq.ValidFrom || (moment.utc(moment(entity.WicBoq.ValidFrom).format('YYYY MM DD')).isBefore(today) || moment.utc(moment(entity.WicBoq.ValidFrom).format('YYYY MM DD')).isSame(today))) &&
							(!_.has(entity, 'WicBoq.ValidTo') || !entity.WicBoq.ValidTo || (moment.utc(moment(entity.WicBoq.ValidTo).format('YYYY MM DD')).isAfter(today) || moment.utc(moment(entity.WicBoq.ValidTo).format('YYYY MM DD')).isSame(today)));
						}
					}
				];

				let changeVatGroupRecalBoqAndItemDialogId = $injector.get('platformCreateUuid')();
				service.cellChange = function cellChange (entity,field){
					if (field === 'BpdVatGroupFk' && entity.Id > 0) {
						prcCommonProcessChangeVatGroupDialog.showAskDialog(moduleName, service, serviceContainer.data, entity, changeVatGroupRecalBoqAndItemDialogId, function recalculateAfterChangeVatGroupInReq() {
							$http.get(globals.webApiBaseUrl + 'procurement/common/boq/RecalculationBoQ?headerId=' + entity.Id + '&vatGroupFk=' + entity.BpdVatGroupFk+'&sourceType=requisition'+'&taxCodeFk='+entity.TaxCodeFk).then(function(){
								service.onRecalculationItemsAndBoQ.fire();
							});
						});
					}
				};


				// register filter by hand
				service.registerFilters = function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(filters);
					onFilterLoaded.fire(moduleName);
				};

				// unload filters
				service.unRegisterFilters = function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					onFilterUnLoaded.fire(moduleName);
				};

				service.updateDeliveryDateToItem = function updateDeliveryDateToItem(entityToItem){
					return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/updateDeliveryDateToItem', entityToItem);
				};

				service.getRubricId = function () {
					return moduleContext.requisitionRubricFk;
				};

				let selectionChanged = function selectionChanged() {
					let currentItem = service.getSelected();
					if (currentItem && angular.isDefined(currentItem.Id)) {
						moduleContext.exchangeRate = currentItem.ExchangeRate;
						moduleContext.setModuleStatus(service.getModuleState(currentItem));
					} else {
						moduleContext.setModuleStatus({IsReadonly: true});
					}

					service.selectedRequisitionStatusChanged.fire(moduleContext.getModuleStatus());

					service.hasItemsOrBoqs({});

					updateBoqSourceRelativeFilter(currentItem);

					procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNameRequisition');
				};

				service.registerSelectionChanged(selectionChanged);

				basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 6, 51);

				/**
				 * @ngdoc function
				 * @name getCellEditable
				 * @function
				 * @methodOf procurement.contract.procurementContractHeaderDataService
				 * @description get editable of model
				 * @returns bool
				 */
				/* jshint -W074 */ // The complexly warning is not need, logic in method is simple and readable
				service.getCellEditable = function (item, model) {
					let editable = true, state;
					if (angular.isDefined(item)) {

						// check is editable
						state = service.getModuleState(item);
						if (state?.IsReadonly) {
							return false;
						}

						// check filed editable
						if (model === 'ExchangeRate') {
							// editable when package is not null
							editable = moduleContext.companyCurrencyId !== item.BasCurrencyFk;
						}

						else if (model === 'BusinessPartnerFk') {
							// editable when material catalog is null
							// editable = !item.MaterialCatalogFk;
							editable= !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if (model === 'SubsidiaryFk') {
							// editable when material catalog is null
							editable = !item.MaterialCatalogFk && !!item.BusinessPartnerFk && !item.BoqWicCatFk;
						}
						else if (model === 'SupplierFk') {
							// editable when material catalog is null
							editable= !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if (model === 'IncotermFk') {
							// editable when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if (model === 'ProjectChangeFk') {
							// editable when Project catalog is not null
							editable = !!item.ProjectFk;
						}
						else if (model === 'PrcHeaderEntity.ConfigurationFk') {
							// editable only before first time save
							return item.Version === 0;
						}
						else if(model === 'BasPaymentTermFiFk'){
							// editable when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if(model === 'BasPaymentTermPaFk'){
							// editable when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if(model === 'BasPaymentTermAdFk'){
							// editable when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if (model === 'Subsidiary2Fk') {
							// editabl when material catalog is null
							editable = !!item.Subsidiary2Fk && !item.BoqWicCatFk;
						}
						else if(model === 'BusinessPartner2Fk'){
							// editabl when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if(model === 'Supplier2Fk'){
							// editabl when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
						else if(model === 'PackageFk' || model === 'ProjectFk'){

							editable = !item.ReqHeaderFk;
						}
						else if(model==='Code'){
							editable=item.Version===0;
						}
						else if (model === 'BoqWicCatFk') {
							let prcConfigurations = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');
							editable = !!(_.has(item, 'PrcHeaderEntity.ConfigurationFk') && prcConfigurations && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk]?.IsService);
						}
						else if (model === 'BoqWicCatBoqFk') {
							editable = !!item.BoqWicCatFk;
						}
						else if (model === 'TaxCodeFk') {
							// editabl when material catalog is null
							editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
						}
					}

					return editable;
				};

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns IsReadonly {Isreadonly:true|false}
				 */
				service.getModuleState = function getModuleState(item) {
					let state, status, parentItem = item || service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('ReqStatus');
					if (parentItem && angular.isDefined(parentItem.Id)) {
						state = _.find(status, {Id: parentItem.ReqStatusFk});
						if(state){
							state = {IsReadonly: state.Isreadonly};
						}

					} else {
						state = {IsReadonly: true};
					}
					return state;
				};

				service.updateReadOnly = function updateReadOnly(entity, readOnlyField, value, editField) {
					if (!entity) {
						return;
					}
					if (editField) {
						entity[editField] = value;
					}
					let readOnly = !service.getCellEditable(entity, readOnlyField);
					runtimeDataService.readonly(entity, [{field: readOnlyField, readonly: readOnly}]);
				};

				service.updateFieldsReadOnly = function updateFieldsReadOnly(entity, readOnlyFields, value, editField) {
					if (editField) {
						entity[editField] = value;
					}
					angular.forEach(readOnlyFields, function (filed) {
						let readOnly = !service.getCellEditable(entity, filed);

						runtimeDataService.readonly(entity, [{field: filed, readonly: readOnly}]);
					});
				};

				// characteristic item readonly
				service.setDataReadOnly=function(items){
					_.forEach(items, function (item) {
						runtimeDataService.readonly(item, true);
					});
				};

				service.setEntityReadOnly = function (entity) {
					service.updateFieldsReadOnly(entity,
						['Code','ProjectFk','PackageFk','ExchangeRate', 'TaxCodeFk', 'BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk',
							'IncotermFk', 'ProjectChangeFk', 'PrcHeaderEntity.ConfigurationFk']);

					if(entity.MaterialCatalogFk){
						runtimeDataService.readonly(entity, [{field: 'BasPaymentTermFiFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'BasPaymentTermPaFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'BasPaymentTermAdFk', readonly: true}]);
					}
				};

				// add update done event.
				let basUpdateSucceeded = serviceContainer.data.onUpdateSucceeded, leadingUpdateDone = new PlatformMessenger();
				serviceContainer.data.onUpdateSucceeded = function doUpdate() {
					let result = basUpdateSucceeded.apply(this, arguments);
					leadingUpdateDone.fire(null, {leadingService: service});
					return result;
				};

				service.getContainerData=function(){
					return serviceContainer.data;
				};

				service.registerUpdateDone = function registerUpdateDone(handler) {
					leadingUpdateDone.register(handler);
				};
				service.unregisterUpdateDone = function unregisterUpdateDone(handler) {
					leadingUpdateDone.unregister(handler);
				};

				// add refresh done event.
				let basReadData = serviceContainer.data.doReadData, leadingRefreshDone = new PlatformMessenger();
				serviceContainer.data.doReadData = function doReadData() {
					return basReadData.apply(this, arguments).then(function () {
						leadingRefreshDone.fire(null, {leadingService: service});
					});
				};

				service.registerRefreshDone = function registerUpdateDone(handler) {
					leadingRefreshDone.register(handler);
				};
				service.unregisterRefreshDone = function unregisterUpdateDone(handler) {
					leadingRefreshDone.unregister(handler);
				};
				service.getIsFrameworkTypes = function() {
					let catalogTypeLookupOptions = {
						displayMember: 'Description',
						valueMember: 'Id',
						lookupModuleQualifier: 'basics.materialcatalog.type',
						lookupType: 'basics.materialcatalog.type',
						filter: { customBoolProperty: 'ISFRAMEWORK' }
					};
					return basicsLookupdataSimpleLookupService.refreshCachedData(catalogTypeLookupOptions).then(function (res) {
						let promise;
						if (res?.length) {
							let defer = $q.defer();
							defer.resolve(res);
							promise = defer.promise;
						}
						else if (res === false) {
							promise = basicsLookupdataSimpleLookupService.getList(catalogTypeLookupOptions);
						}
						promise.then(function (res2) {
							service.isFrameworkCatalogTypes = [];
							if (res2?.length) {
								let types = _.orderBy(res2, ['Id']);
								types = _.filter(types, function (i) {
									return i.sorting && i.isLive && i.Isframework;
								});
								if (types?.length) {
									service.isFrameworkCatalogTypes = types;
								}
							}
							basicsLookupdataLookupDescriptorService.removeData('isFrameworkCatalogType');
							if (service.isFrameworkCatalogTypes.length) {
								basicsLookupdataLookupDescriptorService.addData('isFrameworkCatalogType', service.isFrameworkCatalogTypes);
							}
						});
					});
				};
				service.getIsFrameworkTypes();

				// TODO It's just a workaround for create project suceesfully

				let baseCreateItem = service.createItem;
				service.createItem = function createItem() {
					if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
						if (serviceContainer.data.doUpdate) {
							return serviceContainer.data.doUpdate(serviceContainer.data).then(function (canCreate) {
								if (canCreate) {
									return baseCreateItem();
								} else {
									return $q.reject('Cancelled by User');
								}
							});
						} else {
							return baseCreateItem();
						}
					} else {
						return procurementCommonCreateModuleService.showEditDialog(moduleName).then(function (params) {
							createParam = params;
							return baseCreateItem();
						});
					}
				};

				service.createDeepCopy = function createDeepCopy() {
					let entity = angular.copy(service.getSelected());
					if (entity?.DeadlineTime && _.isObject(entity.DeadlineTime)) {
						entity.DeadlineTime = entity.DeadlineTime.format('HH:mm:ss');
					}

					$http.post(globals.webApiBaseUrl + 'procurement/requisition/requisition/deepcopy', entity)
						.then(function (response) {
							serviceContainer.data.handleOnCreateSucceeded(response.data.ReqHeader, serviceContainer.data);
						},
						function (/* error */) {
						});
				};

				// load lookup items, and cache in front end.
				basicsLookupdataLookupDescriptorService.loadData(['packageStatus', 'prcconfiguration', 'prcconfig2strategy', 'reqstatus']);


				service.doPrepareUpdateCall = function doPreparePrcBoqMainUpdateCall(updateData) {
					// This is a hack to get the deletion of boq items running again for it was not possible to adjust the functionality
					// for handling updates consistently to the new processes in the platformDataServiceFactory.
					// *** Has to be removed ASAP ***
					if (angular.isArray(updateData.BoqItemToDelete) && updateData.BoqItemToDelete.length > 0) {
						updateData.PrcBoqCompleteToSave = {};
						updateData.PrcBoqCompleteToSave.BoqItemCompleteToDelete = _.map(updateData.BoqItemToDelete, function (entity) {
							return {BoqItem: entity};
						});

						delete updateData.BoqItemToDelete;
					}

					if (updateData.PrcHeaderblobToSave){
						procurementCommonHelperService.setHeaderTextContentNull(updateData.PrcHeaderblobToSave);
					}

					if (needUpdateUcToItemsBoqs) {
						// need to update controllingUnit of prcItems and boqItems
						updateData.NeedUpdateUcToItemsBoqs = true;
						needUpdateUcToItemsBoqs = false;
					}

					// Since specification clob will be automatically changed when add/remove text complement rows
					// we do not need to save text complements extra
					// // adapt object to expected server side object

					if (angular.isDefined(updateData.PrcBoqCompleteToSave)) {
						updateData.PrcBoqCompleteToSave.HeaderId = service.getSelected().Id;
					}
				};

				mergeUpdatedBoqRootItemIntoBoqList = function mergeUpdatedBoqRootItemIntoBoqList(response) {

					if (angular.isUndefined(response) || response === null) {
						return;
					}

					let prcBoqCompleteToSave = response.PrcBoqCompleteToSave;

					if (angular.isUndefined(prcBoqCompleteToSave) || (prcBoqCompleteToSave === null)) {
						return;
					}

					let boqItemCompleteToSaveArray = prcBoqCompleteToSave.BoqItemCompleteToSave;

					if (angular.isUndefined(boqItemCompleteToSaveArray) || !_.isArray(boqItemCompleteToSaveArray)) {
						return;
					}

					angular.forEach(boqItemCompleteToSaveArray, function (boqItemCompleteToSave) {
						if (angular.isUndefined(boqItemCompleteToSave) || (boqItemCompleteToSave === null)) {
							return;
						}

						let updatedBoqRootItem = boqItemCompleteToSave.BoqItem;

						if (angular.isUndefined(updatedBoqRootItem) || (updatedBoqRootItem === null)) {
							return;
						}

						// We're only handling boq root item changes for these are the types that are updated when the requisition is saved and changes have been
						// done to the currently active procurement boq structure root item.
						let boqMainLineTypes = $injector.get('boqMainLineTypes');
						if (updatedBoqRootItem.BoqLineTypeFk !== boqMainLineTypes.root) {
							// This shouldn't happen, but if so we exit here
							return;
						}

						let prcBoqMainService = $injector.get('prcBoqMainService');
						let boqMainService = prcBoqMainService.getService(service);
						let procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
						let prcCommonBoqService = procurementCommonPrcBoqService.getService(service, boqMainService);
						let boqList = prcCommonBoqService.getList();

						let boqExtended = _.find(boqList, function (item) {
							return item.BoqRootItem.Id === updatedBoqRootItem.Id;
						});

						if (angular.isUndefined(boqExtended) || (boqExtended === null)) {
							return;
						}

						let boqRootItem = boqExtended.BoqRootItem;

						if (angular.isDefined(boqRootItem) && (boqRootItem !== null) && (boqRootItem.Id === updatedBoqRootItem.Id)) {
							// Update the client side version with the server side version of this boqItem.
							// Remove the child array property, because an empty property might delete the child hierarchy on the client side.
							if (angular.isDefined(updatedBoqRootItem.BoqItems)) {
								delete updatedBoqRootItem.BoqItems;
							}
							angular.extend(boqRootItem, updatedBoqRootItem);
						}
					});
				};

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'ReqHeaderDto',
					moduleSubModule: 'Procurement.Requisition',
					validationService: 'procurementRequisitionHeaderValidationService',
					mustValidateFields: ['Code', 'TaxCodeFk', 'PrcHeaderEntity.StrategyFk']
				});

				service.parentBoqItems = [];
				service.getParentBoqItems = function () {
					if (service.getSelected() && service.getSelected().ReqHeaderFk !== null && service.getSelected().ReqHeaderFk > 0) {
						$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqitemsbymodule?module=1&headerId='+ service.getSelected().ReqHeaderFk).then(function (result) {
							service.parentBoqItems = result.data;
						});
					}
				};
				service.isChangeHeader = function (boqItem) {
					let baseBoqItem = _.indexOf(service.parentBoqItems, boqItem.BoqItemPrjItemFk);
					return service.getSelected() && service.getSelected().ReqHeaderFk !== null &&
						service.getSelected().ReqHeaderFk > 0 && baseBoqItem >= 0; // if is change order and the base req have this item, readonly
				};

				service.isFrameworkContractCallOffByWic = function () {
					let selected = service.getSelected();
					return !!selected.BoqWicCatFk;
				};

				service.isFrameworkContractCallOffByMdc = function () {
					let selected = service.getSelected();
					return !!selected.MaterialCatalogFk;
				};

				let confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

				function navigationCompleted(entity, field) {
					let parameters = {}, hasParameters = false;

					// navigate from 'procurement.package' pakcage toolbars
					if(field ==='PackageId'){
						parameters.PrcPackageId = entity.package.Id;
						hasParameters = true;
					}
					// navigate from 'procurement.package' package container
					else if (entity?.Requisition2PackageData?.PrcPackageFk) {
						parameters.PrcPackageFk = entity.Requisition2PackageData.PrcPackageFk;
						hasParameters = true;
					}
					// navigate from 'procurement.rfq/quote' requisition container, 'procurement.package' subpackage container
					else if (entity?.ReqHeaderFk) {
						cloudDesktopSidebarService.filterSearchFromPKeys([entity.ReqHeaderFk]);
					}
					// navigate form ticket system, after successfully submit the order
					else if (_.isArray(entity) && entity.length > 0) {
						cloudDesktopSidebarService.filterSearchFromPKeys(entity);
					}
					else if (entity && field === 'Id') {
						let keys = [];
						if (_.isObject(entity)) {
							keys.push(entity[field]);
						}
						if (_.isString(entity)) {
							keys.push(parseInt(entity));
						}
						cloudDesktopSidebarService.filterSearchFromPKeys(keys);
					}
					else if(entity && field === 'RfqHeaderId'){
						$http.post(globals.webApiBaseUrl + 'procurement/rfq/header/navigation', { RfqHeaderFk: entity.Id }).then(function (response) {
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						});
					}
					else if (field==='Ids' && entity.FromGoToBtn) {
						let ids = entity.Ids.split(',');
						cloudDesktopSidebarService.filterSearchFromPKeys(ids);
					}
					if (hasParameters) {
						$http.post(globals.webApiBaseUrl + 'procurement/requisition/requisition/navigation', parameters).then(function (response) {
							if (field ==='PackageId' && response.data.length === 0) {
								response.data = [-1];
							}
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						});
					}
				}
				service.getConfigurationFk = function getConfigurationFk() {
					if (service.getSelected()) {
						return service.getSelected().PrcHeaderEntity.ConfigurationFk;
					}
				};

				service.getItemServiceName = function () {
					return 'procurementRequisitionItemDataService';
				};

				service.wizardIsActivate=function(){
					let status = basicsLookupdataLookupDescriptorService.getData('ReqStatus');
					let parentItem = service.getSelected();
					let IsActivate=true;
					if (parentItem) {
						let oneStatus= _.find(status, { Id: parentItem.ReqStatusFk });
						if(oneStatus){
							let IsReadonly = oneStatus.Isreadonly;
							let IsLive=oneStatus.IsLive;
							IsActivate=!IsReadonly;
							if(IsActivate){
								IsActivate=IsLive;
							}
						}
					}
					if(!IsActivate){
						let headerTextKey = $translate.instant('procurement.requisition.wizard.isActivateCaption');
						let bodyText=$translate.instant('procurement.requisition.wizard.isActiveMessage');
						let modalOptions = {
							headerTextKey: headerTextKey,
							bodyTextKey: bodyText,
							showOkButton: true,
							showCancelButton: false,
							defaultButton: 'ok',
							iconClass: 'ico-question'
						};
						platformModalService.showDialog(modalOptions);
					}
					return IsActivate;
				};

				service.hasWicBoqInReqHeader = function hasWicBoqInReqHeader(item) {
					return item?.BoqWicCatFk;
				};

				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				function asyncGetPrcWicCatBoq(boqWicCatBoqFk, boqWicCatFk) {
					let defer = $q.defer();
					let boqHeaderIds = null;
					if (boqWicCatBoqFk && boqWicCatFk) {
						let wicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
						if (wicCatBoqs) {
							let wicCatBoq = _.find(wicCatBoqs, {Id: boqWicCatBoqFk});
							if (wicCatBoq) {
								boqHeaderIds = {};
								boqHeaderIds[boqWicCatFk] = [wicCatBoq.BoqHeader.Id];
							}
							defer.resolve(boqHeaderIds);
							return defer.promise;
						}
						else {
							return basicsLookupdataLookupDescriptorService.getItemByKey('PrcWicCatBoqs', {Id: boqWicCatBoqFk, PKey1: boqWicCatFk})
								.then(function (data) {
									if (data) {
										boqHeaderIds = {};
										boqHeaderIds[boqWicCatFk] = [data.BoqHeader.Id];
									}
									return boqHeaderIds;
								});
						}
					}
					defer.resolve(boqHeaderIds);
					return defer.promise;
				}

				function updateBoqSourceRelativeFilter(currentItem) {
					let groupIds = [];
					let isSetMainItemId2BoqHeaderIds = false;
					if (currentItem?.BoqWicCatFk) {
						groupIds = [currentItem.BoqWicCatFk];
						if (currentItem.BoqWicCatBoqFk) {
							isSetMainItemId2BoqHeaderIds = true;
							asyncGetPrcWicCatBoq(currentItem.BoqWicCatBoqFk, currentItem.BoqWicCatFk).then(function (boqHeaderIds) {
								boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(boqHeaderIds);
							});
						}
					}
					boqMainLookupFilterService.setSelectedWicGroupIds(groupIds);
					if (!isSetMainItemId2BoqHeaderIds) {
						boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(null);
					}
				}

				function updateBoqFilter() {
					let selected = service.getSelected();
					if (selected) {
						updateBoqSourceRelativeFilter(selected);
					}
				}
				service.updateBoqFilter = updateBoqFilter;

				let budgetEditableInPrc = {
					editable: false,
					cacheTime: null,
					optionValue: -1
				};

				function getBudgetEditableInPrc() {
					if (budgetEditableInPrc.cacheTime !== null) {
						return budgetEditableInPrc;
					}
				}

				service.setBudgetEditableInPrc = function (editable, value) {
					budgetEditableInPrc.editable = editable;
					budgetEditableInPrc.cacheTime = new Date().getTime();
					budgetEditableInPrc.optionValue = value;
				}

				service.syncGetBudgetEditingInProcurement = function () {
					let isEditableObject = getBudgetEditableInPrc();
					if (isEditableObject !== undefined) {
						return $q.when(isEditableObject.editable);
					} else {
						service.resetBudgetEditable();
					}
				};

				service.getBudgetEditingInProcurement = function () {
					let isEditableObject = getBudgetEditableInPrc();
					if (isEditableObject !== undefined){
						return isEditableObject.editable;
					} else {
						return false;
					}
				};

				service.getBudgetEditingValueInProcurement = function () {
					let isEditableObject = getBudgetEditableInPrc();
					if (isEditableObject !== undefined){
						return isEditableObject.optionValue;
					} else {
						return -1;
					}
				};

				service.resetBudgetEditable = function(){
					return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/getbudgeteditinginprocurement')
						.then(function (response) {
							let result = _.toNumber(response.data);
							let isEditable = result === 0;
							service.setBudgetEditableInPrc(isEditable, result);
							return isEditable;
						});
				}

				service.hasItemsOrBoqs = function (o) {
					if (_.isObject(o)) {
						hasItemsOrBoqs.items = !!o.items;
						hasItemsOrBoqs.prcboqs = !!o.prcboqs;
						hasItemsOrBoqs.boqitems = !!o.boqitems;
					}
				};
				service.getItemsOrBoqs = function () {
					return hasItemsOrBoqs;
				};
				let doUpdateControllingUnitDialogId = $injector.get('platformCreateUuid')();
				// eslint-disable-next-line no-unused-vars
				service.wantToUpdateCUToItemsAndBoq = function (entity,isProjectFkChange,isFromConfigDialog) {
					if (hasItemsOrBoqs.items || hasItemsOrBoqs.prcboqs || hasItemsOrBoqs.boqitems) {
						let modalOptions = {
							headerText: $translate.instant('procurement.package.updateControllingUnitDialogTitle'),
							bodyText: $translate.instant('procurement.package.doUpdateControllingUnit'),
							showYesButton: true, showNoButton: true,
							iconClass: 'ico-question',
							id: doUpdateControllingUnitDialogId,
							dontShowAgain: true
						};
						let validateService = $injector.get('procurementRequisitionHeaderValidationService');
						$injector.get('procurementContextService').showDialogAndAgain(modalOptions)
							.then(function (result) {
								if (result.yes) {
									if(!_.isNil(isProjectFkChange) && isProjectFkChange){
										service.updateHeaderCUtoItemBoq(entity);
										entity.NeedUpdateCUToItemsBoq = true;
										service.fireItemModified(entity);
									}else {
										let selected = service.getSelected();
										if (selected) {
											needUpdateUcToItemsBoqs = true;
											service.controllingUnitToItemBoq.fire();
										}
									}
								} else {
									needUpdateUcToItemsBoqs = false;
								}
							}).finally(function () {
							service.hasItemsOrBoqs({});
							if(!_.isNil(isProjectFkChange) && isProjectFkChange){
								validateService.validateBasCurrencyFk(entity, entity.BasCurrencyFk, 'BasCurrencyFk', isFromConfigDialog);
								service.gridRefresh();
							}
						});
					}
				};
				service.updateHeaderCUtoItemBoq = (entity)=> {
					let prcBoqMainService = $injector.get('prcBoqMainService');
					let boqMainService = prcBoqMainService.getService(service);
					let procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
					let prcCommonBoqService = procurementCommonPrcBoqService.getService(service, boqMainService);
					let itemService = $injector.get(service.getItemServiceName());
					let itemList = itemService.getList();
					let prcBoqList = prcCommonBoqService.getList();
					let boqService = $injector.get('prcBoqMainService').getService();
					let boqItemList = boqService.getList();

					_.forEach(prcBoqList, function (prcBoq){
						prcBoq.PrcBoq.MdcControllingunitFk = entity.ControllingUnitFk;
						prcCommonBoqService.markItemAsModified(prcBoq);
						entity.NeedUpdateUcToItemsBoqs = true;
						service.markItemAsModified(entity);
					});

					_.forEach(itemList, function (item){
						item.MdcControllingunitFk = entity.ControllingUnitFk;
						itemService.markItemAsModified(item);
					})

					_.forEach(boqItemList, function (item){
						item.MdcControllingUnitFk = entity.ControllingUnitFk;
						boqService.markItemAsModified(item);
					})
				};

				return service;
			}]);

})(angular);