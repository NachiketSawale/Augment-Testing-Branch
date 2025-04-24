(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.rfq';
	/** @namespace data.selectedItem.IsSchemaReadonly */
	/** @namespace updateData.RfqRequisitionToSave */
	/** @namespace toSave.RfqRequisition */
	/** @namespace currentItem.IsSchemaReadonly */
	/** @namespace status.IsAdvertised */
	/**
	 * @ngdoc service
	 * @name procurementRfqMainService
	 * @function
	 * @requires platformDataServiceFactory
	 * @description
	 * #
	 * data service of rfq header container (leading container).
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqMainService', [
		'$http', '$log', '$injector', 'platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'procurementRfqHeaderValidationService', 'platformRuntimeDataService',
		'procurementContextService', 'ServiceDataProcessDatesExtension', 'SchedulingDataProcessTimesExtension',
		'procurementCommonDataEnhanceProcessor', 'cloudDesktopSidebarService', 'PlatformMessenger', 'cloudDesktopPinningContextService',
		'basicsCharacteristicDataServiceFactory', 'procurementCommonCharacteristicDataService', 'platformDataServiceModificationTrackingExtension',
		'$q', 'basicsLookupdataLookupDescriptorService', '$translate', 'platformModalService', 'procurementRfqNumberGenerationSettingsService', 'platformDataValidationService', '$timeout',
		'platformGridAPI', 'basicsCommonCharacteristicService', 'basicsCommonMandatoryProcessor','procurementRfqReadOnlyProcessorService','procurementCommonOverrideHeaderInfoService',
		'procurementCommonHelperService',
		function ($http, $log, $injector, platformDataServiceFactory, platformContextService, lookupDescriptorService,
			lookupFilterService, validationService, platformRuntimeDataService,
			moduleContext, ServiceDataProcessDatesExtension, SchedulingDataProcessTimesExtension,
			procurementCommonDataEnhanceProcessor, cloudDesktopSidebarService, PlatformMessenger, cloudDesktopPinningContextService,
			basicsCharacteristicDataServiceFactory, procurementCommonCharacteristicDataService, platformDataServiceModificationTrackingExtension,
			$q, basicsLookupdataLookupDescriptorService, $translate, platformModalService, procurementRfqNumberGenerationSettingsService, platformDataValidationService, $timeout,
			platformGridAPI, basicsCommonCharacteristicService, mandatoryProcessor,procurementRfqReadOnlyProcessorService,procurementCommonOverrideHeaderInfoService, procurementCommonHelperService) {

			var characteristicColumn = '';
			var gridContainerGuid = '037c70c17687481a88c726b1d1f82459';
			var sidebarSearchOptions = {
				moduleName: moduleName,  // required for filter initialization
				enhancedSearchEnabled: true,
				pattern: '',
				pageSize: 100,
				useCurrentClient: null,
				includeNonActiveItems: null,
				includeChainedItems: false,
				showOptions: true,
				showProjectContext: false, // TODO: rei remove it
				pinningOptions: {
					isActive: true, showPinningContext: [{token: 'project.main', show: true}],
					setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
				},
				withExecutionHints: false,
				enhancedSearchVersion: '2.0',
				includeDateSearch: true
			};
			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementRfqMainService',
					entityNameTranslationID: 'procurement.rfq.headerGridTitle',
					entityInformation: { module: 'Procurement.Rfq', entity: 'RfqHeader', specialTreatmentService: null },
					httpCreate: {
						route: globals.webApiBaseUrl + 'procurement/rfq/header/',
						endCreate: 'createrfq'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'procurement/rfq/header/',
						endDelete: 'deleterfq'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'procurement/rfq/header/',
						endUpdate: 'updaterfq'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/rfq/header/',
						endRead: 'listrfq',
						usePostForRead: true
					},
					entitySelection: {supportsMultiSelection: true},
					modification: {multi: {}},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var projectVal = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
								creationData.Value = projectVal ? projectVal.id : null;
							},
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						root: {
							moduleName: 'cloud.desktop.moduleDisplayNameRfQ',
							itemName: 'RfqHeaders',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							codeField: 'Code',
							descField: 'Description',
							handleUpdateDone: handleUpdateDone,
							responseDataEntitiesPropertyName: 'Main',
							showProjectHeader: {
								getProject: function (entity) {
									if (!entity || !entity.ProjectFk) {
										return null;
									}
									return lookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
								}
							}
						}
					},
					sidebarSearch: {options: sidebarSearchOptions},
					sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
					dataProcessor: [{
						processItem: angular.noop,
						revertProcessItem: function (entity) {
							if (entity.Version === 0) {
								var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.PrcConfigurationFk});
								var hasToGenerate = config && procurementRfqNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
								if (hasToGenerate) {
									entity.Code = 'IsGenerated';
								}
							}
						}
					},
					new ServiceDataProcessDatesExtension(['DateRequested', 'DateCanceled', 'DateQuoteDeadline', 'DateAwardDeadline', 'PlannedStart', 'PlannedEnd']),
					new SchedulingDataProcessTimesExtension(['TimeQuoteDeadline']),
					dataProcessItem(),
					procurementRfqReadOnlyProcessorService
					],
					filterByViewer: true
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'RfqHeaderDto',
				moduleSubModule: 'Procurement.RfQ',
				validationService: validationService(service),
				mustValidateFields: ['PrcStrategyFk', 'PrcContractTypeFk', 'RfqTypeFk']
			});

			serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
				deleteParams.entity = deleteParams.entities[0];
				deleteParams.entities = null;
			};

			serviceContainer.service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				if (updateData.RfqHeaders && updateData.RfqHeaders.length === 1) {
					updateData.RfqHeader = updateData.RfqHeaders[0];
					updateData.RfqHeaders = null;
				}

				if (updateData.RfqHeaderblobToSave){
					procurementCommonHelperService.setHeaderTextContentNull(updateData.RfqHeaderblobToSave);
				}
			};

			service.registerEntityCreated(onEntityCreated);
			service.navigationCompleted = navigationCompleted;
			initialize(service);

			basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 19, 52);

			function incorporateDataRead(readData, data) {

				lookupDescriptorService.attachData(readData);

				// lookup data use in procurement-rfq-header-dialog
				if(readData.Main && _.isArray(readData.Main)){
					lookupDescriptorService.attachData({RfqHeader: readData.Main});
				}
				var items = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				var dataRead = data.handleReadSucceeded(items, data);
				service.goToFirst(data);
				// handel characterist
				var exist = platformGridAPI.grids.exist(gridContainerGuid);
				if (exist) {
					var containerInfoService = $injector.get('procurementRfqContainerInformationService');
					var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 52, gridContainerGuid.toUpperCase(), containerInfoService);
					characterColumnService.appendCharacteristicCols(readData.Main);
				}
				return dataRead;
			}

			function handleUpdateDone(updateData, response, data) {
				if (!response.RfqHeaders && response.RfqHeader) {
					response.RfqHeaders = [];
					response.RfqHeaders.push(response.RfqHeader);
				}

				// for performance reason, the DatePriceFixing recalculation is client-side only.
				if(response.RfqHeader){
					response.RfqHeader.DatePriceFixing = data.selectedItem?.DatePriceFixing;
				}

				data.handleOnUpdateSucceeded(updateData, response, data, true);
				lookupDescriptorService.attachData(response.UpdatedLookup); // update lookup data before merge updated data.

				// set field readonly.
				if (data.selectedItem) {
					platformRuntimeDataService.readonly(data.selectedItem, [
						{
							field: 'PrcConfigurationFk',
							readonly: true
						},
						{
							field: 'EvaluationSchemaFk',
							readonly: (!_.isNil(data.selectedItem.EvaluationSchemaFk) && data.selectedItem.IsSchemaReadonly)
						},
						{
							field: 'BillingSchemaFk',
							readonly: data.selectedItem.BillingSchemaReadonly
						}
					]);
				}

				service.gridRefresh();
				service.refreshTotal.fire(); // refresh rfq totals

				if (updateData.RfqRequisitionToSave &&
					updateData.RfqRequisitionToSave.length > 0) {
					var hasNewReq = _.find(updateData.RfqRequisitionToSave, function (toSave) {
						return toSave.RfqRequisition && toSave.RfqRequisition.Version === 0;
					});
					if (hasNewReq) {
						service.refreshRfqBusinessPartner.fire();
					}
				}

				service.rfqUpdateDone.fire();
				serviceContainer.data.updateDone.fire();
				service.showModuleHeaderInformation();
			}

			function dataProcessItem() {
				var dataProcessService = function () {
					// return {dataService:service,validationService:validationService(service)};
					var list = service.getList();
					var deniedList = _.filter(list, function (item) {
						return item.IsBidderDeniedRequest === true;
					});
					service.setDataReadOnly(deniedList);
					return {dataService: service, validationService: null}; // disable validation
				};
				return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementRfqHeaderUIStandardService');
			}

			function initialize(service) {
				service.refreshTotal = new PlatformMessenger();
				service.exchangeRateChanged = new PlatformMessenger();
				service.refreshRfqBusinessPartner = new PlatformMessenger();
				service.rfqUpdateDone = new PlatformMessenger();
				service.updateHeaderFieldsReadonly = updateHeaderFieldsReadonly;
				service.getStatus = getStatus;

				var filters = [
					{
						key: 'procurement-rfq-header-project-filter',
						serverSide: true,
						fn: function () {
							return {IsLive: true};
						}
					},
					{
						key: 'procurement-rfq-header-strategy-filter',
						serverSide: true,
						fn: function (item) {
							var currentItem = service.getSelected();
							if (currentItem || item) {
								// should filter by PrcConfigHeaderFk not by PrcConfigurationFk
								var items = lookupDescriptorService.getData('PrcConfiguration');
								if (items) {
									const id = currentItem ? currentItem.PrcConfigurationFk : item.PrcConfigurationFk;
									var prcConfiguration = _.find(items, {'Id': id});
									if (prcConfiguration && prcConfiguration.PrcConfigHeaderFk
									) {
										// return 'PrcConfigheaderFk=' + prcConfiguration.PrcConfigHeaderFk;
										return {
											PrcConfigheaderFk: prcConfiguration.PrcConfigHeaderFk
										};
									}
								}
							}
							// return 'PrcConfigheaderFk=-1';
							return {
								PrcConfigheaderFk: -1
							};
						}
					},
					{
						key: 'prc-rfq-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.rfqRubricFk;
						}
					},
					{
						key: 'prc-rfq-rfqheaderfk-filter',
						serverKey: 'prc-rfq-rfqheaderfk-filter',
						serverSide: true,
						fn: function (item) {
							return {
								CompanyFk: item.CompanyFk,
								notIncludeId: item.Id
							};
						}
					},
					{
						key: 'prc-rfq-billing-schema-filter',
						serverSide: true,
						fn: function (currentItem) {
							if (!currentItem || !currentItem.Id) {
								return '';
							}
							var config = _.find(lookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcConfigurationFk});

							return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
						}
					},
					{
						key: 'procurement-rfq-create-quote-businesspartner-filter',
						serverSide: true,
						serverKey: 'procurement-rfq-create-quote-businesspartner-filter',
						fn: function () {
							return {
								ApprovalBPRequired: true,
							};
						}
					}
				];
				lookupFilterService.registerFilter(filters);

				// TODO: how to trigger to call this method when selection changed?
				service.canDelete = function canDelete() {
					if (service.getList().length <= 0) {
						return false;
					}

					// the item can be deleted only when the item is not null and selected and it's Status.IsReadonly = false.
					var currentItem = service.getSelected();
					if (!(currentItem && Object.hasOwn(currentItem, 'Id'))) {
						return false;
					}

					if (currentItem && currentItem.IsBidderDeniedRequest) {
						return false;
					}

					return !service.isReadonly(currentItem);
				};

				// characteristic item readonly
				service.setDataReadOnly = function (items) {
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, true);
					});
				};

				service.isReadonly = function isReadonly(currentItem, model) {
					currentItem = currentItem || service.getSelected();

					if (!currentItem) {
						return '';
					}
					if (model === 'PlannedStart' || model === 'PlannedEnd') {
						return false;
					} else if (model === 'EvaluationSchemaFk') {
						return currentItem.Version > 0 && !_.isNil(currentItem.EvaluationSchemaFk) && currentItem.IsSchemaReadonly; // this 'filed' only can be editable between 'create' and 'save'.
					} else if (model === 'BillingSchemaFk') {
						return currentItem.Version > 0 && currentItem.BillingSchemaReadonly; // if has created billing schema,readonly .
					}

					// set other fields readonly by Status.IsReadonly
					var status = getStatus(currentItem);
					if (status && status.IsReadonly) {
						return true;
					}

					if (status && (status.IsAdvertised || status.IsQuoted)) {
						return true;
					}

					if (currentItem && currentItem.IsBidderDeniedRequest) {
						return true;
					}

					// set the two fileds readonly by default.
					if (model === 'RfqStatusFk' || model === 'ExchangeRate' || model === 'DatePriceFixing') {
						return true;
					} else if (model === 'DateCanceled') {
						return true;
					} else if (model === 'PrcConfigurationFk') {
						return currentItem.Version > 0; // this 'filed' only can be editable between 'create' and 'save'.
					} else if (model === 'Code') {
						return currentItem.Version > 0;
					}
					return false;
				};

				function updateHeaderFieldsReadonly(item, readonly) {
					readonly = angular.isUndefined(readonly) ? true : readonly;
					if (!item || angular.isUndefined(item.Id)) {
						return;
					}
					platformRuntimeDataService.readonly(item, [
						{
							field: 'PrcConfigurationFk',
							readonly: item.Version === 0 ? readonly : true
						},
						{
							field: 'EvaluationSchemaFk',
							readonly: item.Version === 0 ? readonly : (!_.isNil(item.EvaluationSchemaFk) && item.IsSchemaReadonly)
						}]);
				}

				function getStatus(currentItem) {
					currentItem = currentItem || service.getSelected();
					if (!currentItem) {
						return null;
					}

					var items = lookupDescriptorService.getData('RfqStatus');
					if (items) {
						return items[currentItem.RfqStatusFk];
					}
					return null;
				}
			}

			function onEntityCreated() {
				var newEntity = arguments[1];

				var result = lookupDescriptorService.provideLookupData(newEntity, {
					collect: function (prop) {
						var result = true;
						// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
						// if it is not the right lookup type name, please use convert to return right name.
						switch (prop) {
							case 'PrcStrategyFk':
								result = 'prcconfig2strategy';
								break;
							case 'RfqStatusFk':
								result = 'rfqStatus';
								break;
							case 'ClerkPrcFk':
								result = 'Clerk';
								break;
							case 'PaymentTermFiFk':
								result = 'PaymentTerm';
								break;
							case 'PaymentTermPaFk':
								result = 'PaymentTerm';
								break;
							case 'PaymentTermAdFk':
								result = 'PaymentTerm';
								break;
						}
						return result;
					}
				});
				if (!result.dataReady) {
					result.dataPromise.then(function () {
						service.gridRefresh();
					});
				}
			}

			// if the rfqHeader has created QTN, then readonly the BillingSchemaFk field
			service.billingSchemaReadonly = function (rfqHeaderFk) {
				var item = _.find(service.getList(), {Id: rfqHeaderFk});
				if (item) {
					item.BillingSchemaReadonly = true;
					platformRuntimeDataService.readonly(item, [
						{
							field: 'BillingSchemaFk',
							readonly: true
						}]);
				}
			};

			function navigationCompleted(entity, field) {
				var parameters = {}, hasParameters = false;

				// navigate from 'procurement.package'
				if (entity && entity.Rfq2PackageData && entity.Rfq2PackageData.PrcPackageFk) {
					parameters.PrcPackageFk = entity.Rfq2PackageData.PrcPackageFk;
					hasParameters = true;
				}
				// navigate from 'procurement.requisition'
				else if (entity && field === 'ReqHeaderId') {
					parameters.ReqHeaderId = entity.Id;
					hasParameters = true;
				}
				// navigate from 'procurememnt.quote'
				else if (entity && Object.hasOwn(entity, 'QuoteVersion') && entity.RfqHeaderFk > 0) {
					cloudDesktopSidebarService.filterSearchFromPKeys([entity.RfqHeaderFk]);
				}
				// navigate from 'procurement.pricecomparison'
				else if (entity && Object.hasOwn(entity, 'RfqStatusFk')) {
					parameters.RfqHeaderId = entity.Id;
					hasParameters = true;
				} else if (entity && field === 'Id') {
					var keys = [];
					if (angular.isObject(entity)) {
						keys.push(entity[field]);
					}
					if (angular.isString(entity)) {
						keys.push(parseInt(entity));
					}
					cloudDesktopSidebarService.filterSearchFromPKeys(keys);
				} else if (field === 'Ids' && entity.FromGoToBtn) {
					var ids = entity.Ids.split(',');
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
				if (hasParameters) {
					$http.post(globals.webApiBaseUrl + 'procurement/rfq/header/navigation', parameters).then(function (response) {
						cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
					});
				}
			}

			service.getConfigurationFk = function getConfigurationFk() {
				if (service.getSelected()) {
					return service.getSelected().PrcConfigurationFk;
				}
			};
			service.isProcurementModule = true;
			service.targetSectionId = 19;
			service.isSavedImmediately = true;
			service.reloadHeaderText = reloadHeaderText;

			function reloadHeaderText(item, options) {
				var headerTextService = $injector.get('procurementRfqHeaderTextService');

				headerTextService.reloadData({
					rfqHeaderId: item.Id,
					prcConfigurationId: item.PrcConfigurationFk,
					projectId: item.ProjectFk,
					isOverride: options && !angular.isUndefined(options) ? options.isOverride : false
				});
			}

			/* function update() {
				platformDataServiceModificationTrackingExtension.getModifications(service);
				service.update();
			} */
			var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
				// jshint ignore:line
				return onCreateSucceeded.call(serviceContainer.data, created, data, creationData).then(function () {

					// var sourceHeaderId = service.getConfigurationFk(created);
					// var  onEntityParentCreatedForPrcModule = procurementCommonCharacteristicDataService.createMethod(service.targetSectionId,sourceHeaderId,service.isSavedImmediately,update);
					// onEntityParentCreatedForPrcModule(null,created);

					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: created.PrcConfigurationFk});

					var code = created.Code;
					if (code === null || code === '') {
						procurementRfqNumberGenerationSettingsService.assertLoaded().then(function () {
							platformRuntimeDataService.readonly(created, [{
								field: 'Code',
								readonly: procurementRfqNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
							}]);
							created.Code = procurementRfqNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, code);
							var currentItem = serviceContainer.service.getSelected();
							var result = {apply: true, valid: true};
							if (created.Code === '') {
								result.valid = false;
								result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
							}
							platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
							platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
							serviceContainer.service.markCurrentItemAsModified();

						});
					}
					// handel characterist
					// rfq characteristic1 SectionId = 19;
					// rfq characteristic2 SectionId = 52;
					// configuration characteristic1 SectionId = 32;
					// configuration characteristic2 SectionId = 55;
					// structure characteristic1 SectionId = 9;
					// structure characteristic2 SectionId = 54;
					basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, created, 19, 52, 32, 55, 9, 54);
					var exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						var containerInfoService = $injector.get('procurementRfqContainerInformationService');
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 52, gridContainerGuid.toUpperCase(), containerInfoService);
						characterColumnService.appendDefaultCharacteristicCols(created);
					}

					service.markCurrentItemAsModified();

					$timeout(function () {
						reloadHeaderText(created);
					}, 500);

				});
			};
			service.getDefaultListForCreated = function getDefaultListForCreated(targetSectionId, configrationSectionId, structureSectionId, newData) {
				var deferred = $q.defer();
				var sourceHeaderId = newData.Version === 0 ? newData.PrcConfigurationFk : service.getConfigurationFk();
				if (!sourceHeaderId) {
					sourceHeaderId = newData.PrcConfigurationFk;
				}
				procurementCommonCharacteristicDataService.getDefaultListForCreated(targetSectionId, sourceHeaderId, configrationSectionId, structureSectionId, newData).then(function (defaultItem) {
					if (defaultItem) {
						deferred.resolve(defaultItem);
					}
				});
				return deferred.promise;
			};

			var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
			confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

			service.wizardIsActivate = function () {
				var status = basicsLookupdataLookupDescriptorService.getData('RfqStatus');
				var parentItem = service.getSelected();
				var IsActivate = true;
				if (parentItem) {
					var oneStatus = _.find(status, {Id: parentItem.RfqStatusFk});
					if (oneStatus) {
						var IsReadonly = oneStatus.IsReadonly;
						var IsLive = oneStatus.IsLive;
						IsActivate = !IsReadonly;
						if (IsActivate) {
							IsActivate = IsLive;
						}
					}

				}
				if (!IsActivate) {
					var headerTextKey = $translate.instant('procurement.rfq.wizard.isActivateCaption');
					var bodyText = $translate.instant('procurement.rfq.wizard.isActiveMessage');
					var modalOptions = {
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

			/**
			 * get module state
			 * @param item target item, default to current selected item
			 * @returns IsReadonly {Isreadonly:true|false}
			 */
			service.getModuleState = function getModuleState(item) {
				var state, status, parentItem = item || service.getSelected();
				status = basicsLookupdataLookupDescriptorService.getData('RfqStatus');
				if (parentItem && parentItem.Id) {
					state = _.find(status, {Id: parentItem.RfqStatusFk});
				} else {
					state = {IsReadonly: true};
				}
				return state;
			};

			serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
				characteristicColumn = colName;
			};
			serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
				return characteristicColumn;
			};

			service.registerSelectionChanged(()=>{
				procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNameRfQ');
			});

			service.getRubricId = function () {
				return moduleContext.rfqRubricFk;
			};

			return service;
		}
	]);
})(angular);