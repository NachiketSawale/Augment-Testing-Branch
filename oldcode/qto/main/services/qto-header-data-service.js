/* global  globals, Platform, _ */
(function (angular) {

	'use strict';
	let qtoMainModule = angular.module('qto.main');

	// jshint -W072
	qtoMainModule.factory('qtoMainHeaderDataService',
		['moment', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService', 'ServiceDataProcessDatesExtension', 'platformContextService', 'PlatformMessenger',
			'basicsCommonCreateDialogConfigService', 'qtoHeaderReadOnlyProcessor', '$q', '$injector', '$http', 'cloudDesktopSidebarService',
			'$translate', 'qtoMainHeaderCreateDialogDataService', 'cloudDesktopInfoService', 'platformModalService', 'qtoFormulaValidationScriptTranslationDataService', 'qtoMainProjectModes', 'qtoRubricCategory', 'QtoType',
			function (moment, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupFilterService, runtimeDataService, DatesProcessor,
				platformContextService, PlatformMessenger, createDialogConfigService, readOnlyProcessor,
				$q, $injector, $http, cloudDesktopSidebarService, $translate, qtoMainHeaderCreateDialogDataService, cloudDesktopInfoService, platformModalService, formulaTranslationService, qtoMainProjectModes, qtoRubricCategory, qtoType
			) {

				let service = {};
				let serviceContainer = {};

				let currentQtoHeaderId = -1;
				let currentQtoHeader = {};

				let isLoadByNavigation = false;
				let naviQtoHeaderId = null;
				let filters = [
					{
						key: 'qto-main-header-project-filter',
						serverSide: true,
						fn: function () {
							return {
								IsLive: true,
								CompanyFk: platformContextService.clientId
							};
						}
					},
					{
						key: 'qto-main-rubric-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: 6 };//6 is rubric for qto
						}
					},
					{
						key: 'qto-main-catalog-clerk-filter',
						serverSide: true,
						fn: function () {
							return 'IsLive = true';
						}
					},
					{
						key: 'qto-main-boq-filter',
						serverSide: true,
						fn: function (dataContext) {
							if (!dataContext) {
								return;
							}
							let isPortal = globals.portal;
							if (!dataContext.Id) {
								let filter = '';
								let items = dataContext.ConHeaderFk ? service.contractBoqHeaderIds : service.prcBoqHeaderIds;
								if (items.length > 0) {
									angular.forEach(items, function (item) {
										filter += 'BoqHeaderFk=' + item + '||';
									});
								} else {
									filter += 'BoqHeaderFk=' + 0 + '||';
								}
								filter = dataContext.ConHeaderFk && !isPortal ? (filter += 'BoqHeaderFk==' + -1 + '||') : filter;
								return filter.substr(0, filter.lastIndexOf('||'));
							}
						}
					},
					{
						key: 'qto-main-header-package-filter',
						serverSide: true,
						fn: function (dataContext) {
							if (!dataContext) {
								return;
							}

							return {
								ProjectFk: dataContext.ProjectFk
							};
						}
					},
					{
						key: 'qto-main-project-boq-filter',
						serverSide: true,
						fn: function (dataContext) {
							if (!dataContext) {
								return;
							}
							let targetProject = dataContext.ProjectFk;
							return dataContext.OrdHeaderFk ? ('OrdHeaderFk=' + dataContext.OrdHeaderFk) : ('PrjProjectFk=' + targetProject); // 'PrjProjectFk=' + targetProject;
						}
					},
					{
						key: 'qto-main-package2Header-filter',
						serverKey: 'qto-main-package2Header-filter',
						serverSide: true,
						fn: function (dataContext) {
							/* if (dataContext === undefined) {
								return;
							}
							if (dataContext.PackageFk !== null && dataContext.PackageFk !== undefined) {
								return ' PrcPackageFk = ' + dataContext.PackageFk;
							} */
							if (angular.isDefined(dataContext) && dataContext.PackageFk !== null && dataContext.PackageFk !== undefined) {
								return {PrcPackageFk: dataContext.PackageFk};
							}
						}
					},
					{
						key: 'qto-procurement-pes-filter',
						serverSide: true,
						fn: function (dataContext) {
							dataContext = dataContext ? dataContext : service.getSelected();
							if (!dataContext) {
								return;
							}
							if (dataContext.ProjectFk !== null) {
								return 'projectId=' + dataContext.ProjectFk;
							}
						}
					},
					{
						key: 'qto-sales-wip-code-filter',
						serverSide: true,
						fn: function (dataContext) {
							dataContext = dataContext ? dataContext : service.getSelected();
							if (!dataContext) {
								return;
							}
							if (dataContext.BoqHeaderFk !== null && dataContext.ProjectFk !== null) {
								return 'BoqHeaderFk=' + dataContext.BoqHeaderFk + '&ProjectFk=' + dataContext.ProjectFk;
							}
						}
					},
					{
						key: 'qto-sales-billing-no-filter',
						serverSide: true,
						fn: function (dataContext) {
							dataContext = dataContext ? dataContext : service.getSelected();
							if (!dataContext) {
								return;
							}
							if (dataContext.BoqHeaderFk !== null && dataContext.ProjectFk !== null) {
								return 'BoqHeaderFk=' + dataContext.BoqHeaderFk + '&ProjectFk=' + dataContext.ProjectFk;
							}
						}
					},
					{
						key: 'qto-main-create-header-procurment-contract-filter',
						serverKey: 'qto-main-create-header-procurment-contract-filter',
						serverSide: true,
						fn: function (dataContext) {
							return {
								ProjectFk: dataContext ? dataContext.ProjectFk : null,
								FilterOutByPrjChangeStatus: true
							};
						}
					},
					{
						key: 'qto-main-header-procurment-contract-filter',
						serverKey: 'qto-main-header-procurment-contract-filter',
						serverSide: true,
						fn: function (dataContext) {
							return {
								ProjectFk: dataContext ? dataContext.ProjectFk : null
							};
						}
					},
					{
						key: 'qto-main-header-sales-contract-filter',
						serverSide: true,
						fn: function (dataContext) {
							dataContext = dataContext ? dataContext : service.getSelected();
							if (dataContext) {
								let selectedHeader = service.getSelected();
								if (!dataContext.ProjectFk && !selectedHeader) {
									return;
								}

								let projectFk = dataContext.ProjectFk && dataContext.ProjectFk > 0 ? dataContext.ProjectFk : selectedHeader.ProjectFk;
								let filters= 'ProjectFk=' + projectFk.toString();
								return filters;
							}
						}
					},
					{
						key: 'qto-main-bill-subsidiary-filter',
						fn: function (subsidiary, item) {
							return (subsidiary.BusinessPartnerFk === item.BusinessPartnerFk);
						}
					},
					{
						key: 'qto-main-bill-to-customer-filter',
						serverSide: true,
						serverKey: 'project-main-project-customer-filter',
						fn: function () {
							var currentItem = $injector.get('qtoMainBillToDataService').getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk:currentItem !== null ? currentItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'qto-main-wip-reference-filter',
						fn: function (item, entity) {
							return !entity.OrdHeaderFk || item.OrdHeaderFk === entity.OrdHeaderFk;
						}
					},
					{
						key: 'qto-main-bill-reference-filter',
						fn: function (item, entity) {
							return !entity.OrdHeaderFk || item.OrdHeaderFk === entity.OrdHeaderFk;
						}
					},
					{
						key: 'qto-main-create-header-qto-type-filter',
						fn: function (currentQtoType, entity) {
							if(!entity.ProjectFk){
								return false;
							}

							let currentProject = qtoMainHeaderCreateDialogDataService.getCurrentProject(entity);
							return currentProject ? (currentProject.ProjectModeFk === qtoMainProjectModes.CRB ? true : currentQtoType.BasRubricCategoryFk !== qtoRubricCategory.CrbRubricCategory) : false;
						}
					},
					{
						key: 'qto-main-create-header-boq-filter',
						serverSide: true,
						fn: function (dataContext) {
							if (!dataContext) {
								return;
							}
							let isPortal = globals.portal;
							if (!dataContext.Id) {
								let filter = '';
								let items;
								let currentProject = qtoMainHeaderCreateDialogDataService.getCurrentProject(dataContext);
								if(!currentProject){
									items = dataContext.ConHeaderFk ? service.contractBoqHeaderIds : service.prcBoqHeaderIds;
								} else if(currentProject.ProjectModeFk === qtoMainProjectModes.CRB && dataContext.BasRubricCategoryFk === qtoRubricCategory.CrbRubricCategory){
									items = dataContext.ConHeaderFk ? service.crbContractBoqHeaderIds : service.crbPrcBoqHeaderIds;
								}else {
									items = dataContext.ConHeaderFk ? service.contractBoqHeaderIds : service.prcBoqHeaderIds;
								}

								if (items && items.length > 0) {
									angular.forEach(items, function (item) {
										filter += 'BoqHeaderFk=' + item + '||';
									});
								} else {
									filter += 'BoqHeaderFk=' + 0 + '||';
								}
								filter = dataContext.ConHeaderFk && !isPortal ? (filter += 'BoqHeaderFk==' + -1 + '||') : filter;
								return filter.substr(0, filter.lastIndexOf('||'));
							}
						}
					},
					{
						key: 'qto-main-create-header-project-boq-filter',
						serverSide: true,
						fn: function (dataContext) {
							if (!dataContext) {
								return;
							}
							let targetProject = dataContext.ProjectFk;
							let currentProject = qtoMainHeaderCreateDialogDataService.getCurrentProject(dataContext);

							if(!currentProject){
								return;
							}

							let isCrb = currentProject.ProjectModeFk === qtoMainProjectModes.CRB && dataContext.BasRubricCategoryFk === qtoRubricCategory.CrbRubricCategory;
							return dataContext.OrdHeaderFk ? ('OrdHeaderFk=' + dataContext.OrdHeaderFk + ') && (isCrb=' + isCrb) :
								('PrjProjectFk=' + targetProject + ') && (isCrb=' + isCrb);
						}
					}
				];
				let previousProjectId = -1;

				basicsLookupdataLookupFilterService.registerFilter(filters);
				let recalculateBoqQuantities = new PlatformMessenger();
				let recalculateLineItemQuantities = new PlatformMessenger();

				let sidebarSearchOptions = {
					moduleName: 'qto.main',
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					includeNonActiveItems: true,
					showOptions: true,
					showProjectContext: false, // TODO: rei remove it
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: true
				};

				let qtoMainHeaderServiceOptions = {
					flatRootItem: {
						module: qtoMainModule,
						serviceName: 'qtoMainHeaderDataService',
						entityNameTranslationID: 'qto.main.tab.header',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'qto/main/header/',
							endRead: 'searchlist',
							usePostForRead: true,
							extendSearchFilter: function extendSearchFilter(filterRequest) {
								if (isLoadByNavigation) {
									let regexp = new RegExp(/,/);
									if (regexp.test(naviQtoHeaderId)) {
										filterRequest.furtherFilters = [{Token: 'QTO_HEADER_IDS', Value: naviQtoHeaderId}];
										isLoadByNavigation = false;
									}
									else {
										filterRequest.furtherFilters = [{Token: 'QTO_HEADER_ID', Value: naviQtoHeaderId}];
										isLoadByNavigation = false;
									}
								}

								// filter version qtos
								if (service.getFilterVersion()) {
									if (!filterRequest.furtherFilters) {
										filterRequest.furtherFilters = [{Token: 'QTO_VERSION_FILTER', Value: 1}];
									} else {
										filterRequest.furtherFilters.push({Token: 'QTO_VERSION_FILTER', Value: 1});
									}
								}
							}
						},
						dataProcessor: [
							readOnlyProcessor, new DatesProcessor(['QtoDate', 'PerformedFrom', 'PerformedTo'])
						],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {

									creationData.Value = platformContextService.getApplicationValue('projectId');
								},
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData || {});

									basicsLookupdataLookupDescriptorService.removeData('costgroup');
									let items = {
										FilterResult: readData.FilterResult,
										dtos: readData.dtos || []
									};

									angular.forEach(readData.dtos, function (item) {
										service.updateReadOnly(item, 'PrcBoqFk', item.PrcBoqFk);
										service.updateReadOnly(item, 'QtoTargetType', item.QtoTargetType);
										service.updateReadOnly(item, 'ContractCode', item.ContractCode);
										service.updateReadOnly(item, 'PrcStructureFk', item.PrcStructureFk);
										service.updateReadOnly(item, 'ProjectFk', item.ProjectFk);
										service.updateReadOnly(item, 'BasGoniometerTypeFk', item.BasGoniometerTypeFk);
									});

									if(readData && _.isArray(readData.FormulaScriptTranslations) && readData.FormulaScriptTranslations.length > 0){
										formulaTranslationService.setCurrentTranslationItems(readData.FormulaScriptTranslations);
									}

									return serviceContainer.data.handleReadSucceeded(items, data);
								},
								handleCreateSucceeded: function (newData) {
									service.updateReadOnly(newData, 'PrcBoqFk', newData.PrcBoqFk);
									service.updateReadOnly(newData, 'QtoTargetType', newData.QtoTargetType);
									service.updateReadOnly(newData, 'IsWQ', !(newData.QtoTargetType === 3 || newData.QtoTargetType === 4));
									service.updateReadOnly(newData, 'IsAQ', !(newData.QtoTargetType === 3 || newData.QtoTargetType === 4));
									service.updateReadOnly(newData, 'IsBQ', !(newData.QtoTargetType === 1 || newData.QtoTargetType === 2));
									service.updateReadOnly(newData, 'IsIQ', !(newData.QtoTargetType === 1 || newData.QtoTargetType === 2));
									return newData;
								}
							}
						},
						entityRole: {
							root: {
								codeField: 'DescriptionInfo.Translated',
								itemName: 'QtoHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameQTO',
								addToLastObject: true,
								handleUpdateDone: function (updateData, response, data) {

									if(response.timeStr){
										console.log(response.timeStr);
									}

									service.handleOnUpdate(updateData, response, data, true);
									let qtoDetailsToSave, qtoDetailService = $injector.get('qtoMainDetailService'), qtodetailGroupIds = [];
									if (response && response.QtoDetailToSave && response.QtoDetailToSave.length > 0) {
										qtoDetailsToSave = _.map(response.QtoDetailToSave, 'QtoDetail');
										qtodetailGroupIds = _.map(qtoDetailsToSave, 'QtoDetailGroupId');

										_.each(qtoDetailsToSave, function (item) {
											if (item) {
												// to convert to date utc
												item.PerformedFromWip = _.isString(item.PerformedFromWip) ? moment.utc(item.PerformedFromWip) : item.PerformedFromWip;
												item.PerformedToWip = _.isString(item.PerformedToWip) ? moment.utc(item.PerformedToWip) : item.PerformedToWip;
												item.PerformedFromBil = _.isString(item.PerformedFromBil) ? moment.utc(item.PerformedFromBil) : item.PerformedFromBil;
												item.PerformedToBil = _.isString(item.PerformedToBil) ? moment.utc(item.PerformedToBil) : item.PerformedToBil;
												item.PerformedDate = _.isString(item.PerformedDate) ? moment.utc(item.PerformedDate) : item.PerformedDate;

												// response data not merge to qto detail item list, can not get the group info, here should not validate for result
												// it will validate at callAfterSuccessfulUpdate, qto detail resizeGrid
												item.notSyncToList = true;

												item.IsSplitLine = false;
												item.IsBoqItemChange = false;
												item.IsBoqSplitChange = false;
												item.IsLineItemChange = false;
											}
										});

										// set dynamic cost groups to show
										if (response.IsCopy) {
											let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
											_.each(response.QtoDetailToSave, function (itemToSave) {
												if (itemToSave.CostGroupToSave && itemToSave.CostGroupToSave.length > 0) {
													basicsCostGroupAssignmentService.attachCostGroupValueToEntity([itemToSave.QtoDetail], itemToSave.CostGroupToSave, function identityGetter(entity) {
														return {
															Id: entity.MainItemId
														};
													},
													'QtoDetail2CostGroups'
													);
												}

												if (itemToSave.CostGroupToDelete && itemToSave.CostGroupToDelete.length > 0) {
													_.forEach(itemToSave.CostGroupToDelete, function (entity2CostGroup) {
														itemToSave.QtoDetail['costgroup_' + entity2CostGroup.CostGroupCatFk] = null;
													});
												}
											});
										}

										if (response.RemovedQtoDetailCostGroups && response.RemovedQtoDetailCostGroups.length > 0){
											_.forEach(response.RemovedQtoDetailCostGroups, function (entity2CostGroup) {
												var itemToSave = entity2CostGroup.MainItemId ? _.find(response.QtoDetailToSave, function(toSave){
													return toSave && toSave.QtoDetail && toSave.QtoDetail.Id ===  entity2CostGroup.MainItemId;
												}) : null;

												if(itemToSave && itemToSave.QtoDetail){
													itemToSave.QtoDetail['costgroup_' + entity2CostGroup.CostGroupCatFk] = null;
												}
											});
										}

										// reload the cost group of qto line
										$injector.get('qtoDetailCostGroupService').load();

										// Set lookup data to boqItems
										qtoDetailService.setLookupData({Main: qtoDetailsToSave});
									}

									data.callAfterSuccessfulUpdate = function callAfterSuccessfulUpdate() {
										service.refreshQtoDetail.fire();
										service.refreshSubTotal.fire();

										// update qto detail grouping info first.
										qtoDetailService.updateQtoDetailGroupInfo();

										// recalculate boq additional quantities
										let qtoDetialsOfAffectedBoq = [];
										if(response && response.qtoDetialsOfAffectedBoq && response.qtoDetialsOfAffectedBoq.length > 0) {
											qtoDetialsOfAffectedBoq = response.qtoDetialsOfAffectedBoq;
										}

										let arg= {};
										if(qtoDetailsToSave && qtoDetailsToSave.length > 0) {
											arg.boqItemFks= null;
											arg.QtoDetailDatas = qtoDetailsToSave;
											arg.qtoDetialsOfAffectedBoq = qtoDetialsOfAffectedBoq;

											// recalculate lineItems quantities
											recalculateLineItemQuantities.fire(null, arg);

											// recalculate boq quantities
											recalculateBoqQuantities.fire(null, arg);

										}

										if(response && response.QtoDetailToDelete && response.QtoDetailToDelete.length > 0) {
											arg.boqItemFks= null;
											arg.QtoDetailDatas = response.QtoDetailToDelete;
											arg.qtoDetialsOfAffectedBoq = qtoDetialsOfAffectedBoq;

											// recalculate lineItems quantities
											recalculateLineItemQuantities.fire(null, arg);

											// recalculate boq quantities
											recalculateBoqQuantities.fire(null, arg);
										}

										data.callAfterSuccessfulUpdate = null;
										let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
										modTrackServ.clearModificationsInRoot(service);

										let qtoDetailCommentsService = $injector.get('qtoDetailCommentsService');
										qtoDetailCommentsService.refreshBtn.fire();

										if(qtodetailGroupIds.length > 0) {
											let qtoDetails = qtoDetailService.getList();

											// after update qto detail grouping info, then mark the qto detail item to sync to list
											_.each(qtoDetails, function (item) {
												item.notSyncToList = false;
											});

											let groupItem = _.filter(qtoDetails, function (detail) {
												return qtodetailGroupIds.indexOf(detail.QtoDetailGroupId) > -1;
											});

											qtoDetailService.updateQtoLineReferenceReadOnly(groupItem);
										}

										qtoDetailService.resizeGrid.fire(qtoDetailService.getSelected());
									};
									// set detail total,it will check this when import data.
									let selectedItem = service.getSelected();
									if (selectedItem) {
										let addTotal = qtoDetailsToSave ? qtoDetailsToSave.length : 0,
											removeTotal = response.QtoDetailToDelete ? response.QtoDetailToDelete.length : 0;
										selectedItem.DetailTotal = selectedItem.DetailTotal - (removeTotal - addTotal);
										qtoDetailService.setQtoTypeFk(selectedItem.QtoTypeFk);
									}

									if(response.WarningInfo){
										platformModalService.showMsgBox(response.WarningInfo, 'Info', 'info');
									}
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						translation: {
							uid: 'qtoMainHeaderDataService',
							title: 'qto.main.header.gridTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'QtoHeaderDto',
								moduleSubModule: 'qto.main'
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(qtoMainHeaderServiceOptions);

				service = serviceContainer.service;
				let parentDeleteItem = serviceContainer.service.deleteItem;
				let parentDeleteEntities = serviceContainer.service.deleteEntities;
				serviceContainer.service.deleteItem = deleteItem;
				serviceContainer.service.deleteEntities = deleteEntities;

				function deleteItem(entity) {
					// noinspection JSCheckFunctionSignatures
					let qtostatusItem = readOnlyProcessor.getItemStatus(entity);
					if ((qtostatusItem && qtostatusItem.IsReadOnly)) {
						platformModalService.showErrorBox('qto.main.cannotDeleteQtoHeader', 'cloud.common.errorMessage');
					} else {
						platformModalService.showYesNoDialog('qto.main.confirmDelete', 'qto.main.confirmDeleteTitle').then(function (response) {
							if (response.yes) {
								parentDeleteItem(entity);
							}
						});
					}
				}

				function deleteEntities(entities) {
					// noinspection JSCheckFunctionSignatures
					platformModalService.showYesNoDialog('qto.main.confirmDelete', 'qto.main.confirmDeleteTitle').then(function (response) {
						if (response.yes) {
							parentDeleteEntities(entities);
						}
					});
				}
				service.onContextUpdated = new Platform.Messenger();

				service.getCellEditable = function getCellEditable(item, model) {
					let editable = true;
					if (model === 'PackageFk' && (!item.ProjectFk || item.ConHeaderFk)) {
						editable = false;
					} else if (model === 'Package2HeaderFK' && !item.PackageFk) {
						editable = false;
					} else if (model === 'PrcBoqFk' && !item.Package2HeaderFK) {
						editable = false;
					} else if (model === 'BasRubricCategoryFk') {
						editable = false;
					} else if (model === 'BasGoniometerTypeFk') {
						editable = !item.hasQtoDetal;
					} else if (model === 'QtoTypeFk') {
						editable = false;
					} else if (model === 'QtoTargetType') {
						editable = false;
					} else if (model === 'ProjectFk') {
						editable = false;
					}

					return editable;
				};
				service.updateReadOnly = function (item, model, value) {
					let editable = service.getCellEditable(item, model, value);
					runtimeDataService.readonly(item, [
						{field: model, readonly: !editable}
					]);
				};

				let orginalSetSelected = service.setSelected;
				service.setSelected = function (item, entities) {
					$injector.get('qtoMainDetailService').deleteTemporaryQtos();
					return orginalSetSelected(item, entities);
				};

				service.setContext = function setContext() {
					service.onContextUpdated.fire();
				};

				service.updateModuleHeaderInfo = function () {
					let entityText = '';
					let currentHeader = service.getSelected();
					let projects = basicsLookupdataLookupDescriptorService.getData('project');
					let prjBoqs = basicsLookupdataLookupDescriptorService.getData('PrjBoqExtended');
					let partners = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
					let prcstructures = basicsLookupdataLookupDescriptorService.getData('prcstructure');
					let entityHeaderObject = {};
					if (currentHeader) {
						let prj = _.find(projects, function (item) {
							return item.Id === currentHeader.ProjectFk;
						});

						let prjBoqReference = _.find(prjBoqs, function (item) {
							return item.BoqHeaderFk === currentHeader.BoqHeaderFk;
						});

						let partner = _.find(partners, function (item) {
							return item.Id === currentHeader.BusinessPartnerFk;
						});

						let prcstructure = _.find(prcstructures, function (item) {
							return item.Id === currentHeader.PrcStructureFk;
						});

						/* Module-Description contains max. 3 fields. Project/Module/lineItem. */
						if(prj) {
							let prjNo = prj ? prj.ProjectNo : ' - ';
							let prjName = prj ? prj.ProjectName : ' - ';
							let pojectInfo = prjName ? prjNo + '-' + prjName : prjNo;

							entityHeaderObject.project = {
								id: prj.ProjectId,
								description: pojectInfo
							};
						}


						let ContractCode = currentHeader.ContractCode ? currentHeader.ContractCode : '';
						let moduleDesc = ContractCode ? ContractCode : '';
						let partnerCode = partner ? (partner.BusinessPartnerName1 ? partner.BusinessPartnerName1 : ' - ') : '';
						moduleDesc += partnerCode ? ' - ' + partnerCode : '';
						let boqReference = prjBoqReference ? prjBoqReference.Reference : '';
						moduleDesc += boqReference ? ' - ' + boqReference : '';
						let structureCode = prcstructure ? prcstructure.Code : '';
						moduleDesc += structureCode ? ' - ' + structureCode : '';
						moduleDesc = moduleDesc ? moduleDesc : ' - ';

						entityHeaderObject.module = {
							description: moduleDesc
						};

						let itemInfo = currentHeader.Code;
						entityHeaderObject.lineItem = {
							description: itemInfo
						};
					}
					cloudDesktopInfoService.updateModuleInfo('qto.main.moduleName', entityHeaderObject);
				};

				service.doPrepareUpdateCall = function doPrepareQtoHeaderUpdateCall(updateData) {
					let currentHeader = service.getSelected();
					if (currentHeader) {
						updateData.NoDecimals = currentHeader.NoDecimals;
						updateData.Goniometer = currentHeader.BasGoniometerTypeFk;
						if (currentHeader.QtoTargetType === 2 || currentHeader.QtoTargetType === 4) {
							updateData.BoqItemToSave = [];
						}
					}

					updateData.QtoHeaderId = updateData.MainItemId;

					// TODO: when no existing qto line to calculate, set the IsCalculate as false
					if (updateData.QtoDetailToSave && updateData.QtoDetailToSave.length > 0) {
						let qtoDetailsToSave = _.map(updateData.QtoDetailToSave, 'QtoDetail');
						let index = _.findIndex(qtoDetailsToSave, {'IsCalculate': true});
						updateData.IsCalculate = index !== -1;

						// set PrepareUpdate qto2costgroups to copy
						let indexCopy = _.findIndex(qtoDetailsToSave, {'IsCopy': true});
						updateData.IsCopy = indexCopy !== -1;
						if (updateData.IsCopy) {
							_.each(updateData.QtoDetailToSave, function (item) {
								if (item.QtoDetail && item.QtoDetail.CostGroupsToCopy) {
									item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
								}
							});
						}

						updateData.QtoDetailCopyOption = $injector.get('qtoMainDetailCopyConfigService').getCopyOptions();
					}
				};

				service.showModuleName = function showModuleName() {
					serviceContainer.data.showHeaderAfterSelectionChanged({}, serviceContainer.data);
				};

				service.refreshQtoDetail = new PlatformMessenger();

				// when qtoDetail add about subTotal item,the SubTotal Grid should be change
				service.refreshSubTotal = new PlatformMessenger();

				service.onQtoHeaderRubricCatagoryChanged = new PlatformMessenger();

				service.setRubricCatagoryReadOnly = new PlatformMessenger();


				service.registerQtoDetailUpdate = function registerQtoDetailUpdate(func) {
					recalculateBoqQuantities.register(func);
				};

				service.unregisterQtoDetailUpdate = function unregisterQtoDetailUpdate(func) {
					recalculateBoqQuantities.unregister(func);
				};

				service.registerQtoDetailLineItemUpdate = function registerQtoDetailLineItemUpdate(func) {
					recalculateLineItemQuantities.register(func);
				};

				service.unregisterQtoDetailLineItemUpdate = function unregisterQtoDetailLineItemUpdate(func) {
					recalculateLineItemQuantities.unregister(func);
				};

				service.fireRecalculateBoqQuantities = function (item){
					recalculateBoqQuantities.fire(null, item);
				};

				service.createItem = function createItem() {
					$http.get(globals.webApiBaseUrl + 'qto/main/header/preparedatabeforecreateqtoheader')
						.then(function (response) {
							if (response && response.data) {
								qtoMainHeaderCreateDialogDataService.setIsGeneratedState(response.data.HasCodeGenerated);

								if (response.data.DefaultQtoPurposeType) {
									qtoMainHeaderCreateDialogDataService.setDefaultQtoPurposeTypeId(response.data.DefaultQtoPurposeType.Id);
								}

								if (response.data.QtoTypeFk > 0){
									qtoMainHeaderCreateDialogDataService.setQtoTypeInfo(response.data.QtoTypeFk, response.data.BasRubricCategoryFk, response.data.BasGoniometerTypeFk);
								}
							}

							qtoMainHeaderCreateDialogDataService.showDialog(serviceContainer.data);
						});
				};

				service.prcBoqHeaderIds = [];

				service.gridRefresh = function () {
					serviceContainer.data.dataModified.fire();
				};

				service.getCode = function (basRubricCategoryFk,qtoHeader) {
					let defer = $q.defer();
					let param = {
						BasRubricCategoryFk :basRubricCategoryFk,
						SaleContractId :qtoHeader.OrdHeaderFk, // sales contract
						PrcContractId: qtoHeader.ConHeaderFk,
						ClerkFk: qtoHeader.ClerkFk,
						ProjectId :qtoHeader.ProjectFk,
						PrcStructureFk:qtoHeader.PrcStructureFk,

						ProcurementContractCode:qtoHeader.ConHeaderFk ?  qtoHeader.ContractCode:'',
						ProjectNo: qtoHeader.ProjectNo,
						SalesContractCode: qtoHeader.OrdHeaderFk ?  qtoHeader.ContractCode:'',
						PackageId: qtoHeader.PrcPackageFk,
						BoqHeaderId: qtoHeader.BoqHeaderFk,
						QtoTargetType: qtoHeader.QtoTargetType
					};


					$http.post(globals.webApiBaseUrl + 'qto/main/header/getcode',param).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				};

				service.getPrcHeaderId = function (packageId) {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'qto/main/header/getprcheaderid?prcPackageId=' + packageId).then(function (response) {
						service.prcHeaderIds = response.data;
						defer.resolve(response.data);
					});
					return defer.promise;
				};

				service.getBoqHeaderId = function (package2HeaderId) {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'qto/main/header/getboqheaderid?package2HeaderId=' + package2HeaderId).then(function (response) {
						service.prcBoqHeaderIds = response.data.prcBoqHeaderIds ? response.data.prcBoqHeaderIds : [];
						service.crbPrcBoqHeaderIds = response.data.crbPrcBoqHeaderIds ? response.data.crbPrcBoqHeaderIds : [];
						service.notIncludeCrbPrcBoqHeaderIds = response.data.notIncludeCrbPrcBoqHeaderIds ? response.data.notIncludeCrbPrcBoqHeaderIds : [];
						defer.resolve(service.prcBoqHeaderIds);
					});
					return defer.promise;
				};

				service.contractBoqHeaderIds = [];
				service.crbContractBoqHeaderIds = [];
				service.notIncludeCrbContractBoqHeaderIds = [];

				service.getContractBoqHeaderId = function (id) {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'qto/main/header/getcontractboqheaderid?id=' + id).then(function (response) {
						service.contractBoqHeaderIds = response.data.contractBoqHeaderIds ? response.data.contractBoqHeaderIds : [];
						service.crbContractBoqHeaderIds = response.data.crbContractBoqHeaderIds ? response.data.crbContractBoqHeaderIds : [];
						service.notIncludeCrbContractBoqHeaderIds = response.data.notIncludeCrbContractBoqHeaderIds ? response.data.notIncludeCrbContractBoqHeaderIds : [];
						defer.resolve(service.contractBoqHeaderIds);
					});
					return defer.promise;
				};

				service.updateBoqItemQuantity = function (boqItemFks, QtoDetailDatas) {
					let arg = {};
					arg.boqItemFks = boqItemFks;
					arg.QtoDetailDatas = QtoDetailDatas;
					recalculateBoqQuantities.fire(null, arg);
				};

				service.getGoniometer = function (item) {
					if (item && item.QtoTypeFk) {
						$http.get(globals.webApiBaseUrl + 'qto/main/header/getGoniometer?QtoTypeFk=' + item.QtoTypeFk).then(function (response) {
							if (response && response.data) {
								item.BasGoniometerTypeFk = response.data;
								service.gridRefresh();
							}
						});
					}
				};

				service.getBoqReferenceNo = function (isOrd) {
					let filter = '';
					let items = isOrd ? service.contractBoqHeaderIds : service.prcBoqHeaderIds;
					angular.forEach(items, function (item) {
						filter += 'BoqHeaderFk=' + item + '||';
					});
					filter = filter.substr(0, filter.lastIndexOf('||'));
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'procurement/common/prcboqextended/getsearchlist?filtervalue=' + filter).then(function (response) {
						if (response && response.data) {
							defer.resolve(response.data);
						}
					});
					return defer.promise;
				};

				service.handleOnUpdate = function (updateData, response, data) {
					serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
				};

				/* navFunc: go to qto header */
				service.setQtoHeader = function setQtoHeader(item, triggerField) {
					isLoadByNavigation = true;
					if (triggerField === 'QtoHeaderFk' && _.has(item, triggerField)) {
						let qtoHeaderFk = _.get(item, triggerField);
						naviQtoHeaderId = _.isInteger(qtoHeaderFk) ? qtoHeaderFk : null;
					} else if ((triggerField === 'QtoHeaderFks' || triggerField === 'Ids') && _.has(item, triggerField)) {
						naviQtoHeaderId = _.get(item, triggerField);
						if(typeof naviQtoHeaderId === 'string'){
							const ids = item.Ids.split(',').map(e => parseInt(e));
							cloudDesktopSidebarService.filterSearchFromPKeys(ids);
						}
					}
					else if (triggerField === 'QtoHeaderCode' && _.has(item, 'QtoIds')) {
						naviQtoHeaderId = _.get(item, 'QtoIds');
					}
					else {
						naviQtoHeaderId = item.Id ? item.Id : null;
					}

					service.setSelected(null);
					service.load().then(function (d) {
						let targetItem = _.find(d, {Id: item.QtoHeaderFk});
						if (targetItem) {
							service.setSelected(targetItem);
						}
					});
				};

				service.onContextUpdated.register(service.updateModuleHeaderInfo);
				service.onContextUpdated.unregister(service.updateModuleHeaderInfo);

				service.getSelectedProjectId = function getSelectedProjectId(){
					let item = service.getSelected();
					return item ? item.ProjectFk : 0;
				};

				service.setSelectedHeader = function (headerId){
					serviceContainer.data.__IdSelectedCapture = headerId;
				};

				let _projectId = -1;
				service.setSelectProjectId = function (projectId){
					_projectId = projectId;
				};

				service.getLastProjectId = function (){
					return _projectId;
				};

				service.setCurrentdHeader = function (headerId){
					return currentQtoHeaderId = headerId;
				};

				service.getCurrentdHeader = function (){
					return currentQtoHeaderId;
				};

				service.setCurrentHeader = function (entity){
					return currentQtoHeader = entity;
				};

				service.getCurrentHeader = function (){
					return currentQtoHeader;
				};

				service.setPreviousProjectId = function (value) {
					previousProjectId = value;
				};

				service.getPreviousProjectId = function () {
					return previousProjectId;
				};

				service.configConHeaderViewLookup = function (columns) {
					let businessPartnerName1LookupFormatterOptions = {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					};

					let businessPartnerName2LookupFormatterOptions = {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName2'
					};

					let supplierLookupFormatterOptions = {
						lookupType: 'Supplier',
						displayMember: 'Code'
					};

					let projectNoLookupFormatterOptions = {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					};

					let projectNameLookupFormatterOptions = {
						lookupType: 'project',
						displayMember: 'ProjectName',
					};

					_.forEach(columns,function (column) {
						if(column.id === 'BPName1' || column.id === 'BP2Name1'){
							column.field = column.id === 'BPName1' ? 'BusinessPartnerFk' : 'BusinessPartner2Fk';
							column.formatter = 'lookup';
							column.formatterOptions = businessPartnerName1LookupFormatterOptions;
						}

						if(column.id === 'BPName2' || column.id === 'BP2Name2'){
							column.field = column.id === 'BPName2' ? 'BusinessPartnerFk' : 'BusinessPartner2Fk';
							column.formatter = 'lookup';
							column.formatterOptions = businessPartnerName2LookupFormatterOptions;
						}

						if(column.id === 'supplierCode' || column.id === 'supplier2Code'){
							column.field = column.id === 'supplierCode' ? 'SupplierFk' : 'Supplier2Fk';
							column.formatter = 'lookup';
							column.formatterOptions = supplierLookupFormatterOptions;
						}

						if(column.id === 'projectNo'){
							column.field = 'ProjectFk';
							column.formatter = 'lookup';
							column.formatterOptions = projectNoLookupFormatterOptions;
						}

						if(column.id === 'projectName'){
							column.field = 'ProjectFk';
							column.formatter = 'lookup';
							column.formatterOptions = projectNameLookupFormatterOptions;
						}
						if(column.id === 'prcConfigurationFk'){
							column.field = 'PrcHeaderEntity.ConfigurationFk';
						}
					});
				};

				service.getGqIsAvailable = function GQIsAvailable(qtoHeader){
					if(!qtoHeader){
						qtoHeader = service.getSelected();
					}

					return qtoHeader && qtoHeader.QtoTargetType === 2 && qtoHeader.QtoTypeFk !== qtoType.OnormQTO && qtoHeader.BasRubricCategoryFk !== 525;
				};

				service.getGQQuantities = function getGQQuantities(qtoHeader, boqItem){
					let defer = $q.defer();

					if(!qtoHeader){
						defer.resolve([]);
					}else{
						let url = globals.webApiBaseUrl + 'qto/main/header/getgqquantities?qtoHeaderFk=' + qtoHeader.Id;
						if(boqItem){
							url += '&boqHeaderFk=' + boqItem.BoqHeaderFk + '&boqItemFk=' + boqItem.Id;
						}

						$http.get(url).then(function(response){
							let gqQuantitiesList = response && response.data && _.isArray(response.data.GQQuantities) ? response.data.GQQuantities : [];
							defer.resolve(gqQuantitiesList);
						});
					}

					return defer.promise;
				};

				service.setFilterVersion = function (value){
					service.isFilterVersion = value;
				};

				service.getFilterVersion = function (){
					return service.isFilterVersion;
				};

				return serviceContainer.service;
			}]);
})(angular);