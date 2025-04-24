/**
 * Created by zos on 2014/12/9.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainHeaderDataService
	 * @function
	 * @requireds platformDataServiceBase, $http, basicsLookupdataLookupFilterService, $q
	 *
	 * @description Provide header data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businesspartnerMainHeaderDataService',
		['_', '$http', '$translate', '$injector', 'platformDataServiceFactory', 'cloudDesktopInfoService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			'cloudDesktopSidebarService', 'businessPartnerHelper', 'platformRuntimeDataService', 'globals', 'ServiceDataProcessDatesExtension', 'basicsCommonFileUploadServiceLocator',
			'PlatformMessenger', 'platformDataValidationService', 'platformModuleStateService', 'platformDataServiceSelectionExtension', 'basicsCommonServiceUploadExtension',
			'platformValidationByDataService', 'platformGridAPI', 'platformPermissionService', '$rootScope', 'basicsCommonCharacteristicService', 'basicsCommonInquiryHelperService',
			'platformModalService', 'mainViewService','initApp','businesspartnerMainNumberGenerationSettingsService',
			function (_, $http, $translate, $injector, platformDataServiceFactory, cloudDesktopInfoService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,
				cloudDesktopSidebarService, businessPartnerHelper, platformRuntimeDataService, globals, ServiceDataProcessDatesExtension, basicsCommonFileUploadServiceLocator,
				PlatformMessenger, platformDataValidationService, platformModuleStateService, platformDataServiceSelectionExtension, basicsCommonServiceUploadExtension,
				platformValidationByDataService, platformGridAPI, platformPermissionService, $rootScope, basicsCommonCharacteristicService, basicsCommonInquiryHelperService,
				platformModalService, mainViewService,initAppService,businesspartnerMainNumberGenerationSettingsService) {
				var itemName = 'BusinessPartners',
					codeField = 'BusinessPartnerName1',
					descField = 'BusinessPartnerName2',
					bpName3 = 'BusinessPartnerName3',
					bpName4 = 'BusinessPartnerName4',
					addressField = 'SubsidiaryDescriptor.AddressDto',
					gridContainerGuid = '75dcd826c28746bf9b8bbbf80a1168e8',
					characteristicColumn = '';

				var _allUniqueColumns = null;
				let updateDataTemp = null;

				// user can edit this fields only bp status which has edit right.
				var readonlyFieldsByBpStatus = [
					'Email','TitleFk', 'BusinessPartnerStatusFk', 'BusinessPartnerName1', 'BusinessPartnerName2', 'BusinessPartnerName3', 'BusinessPartnerName4',
					'MatchCode', 'SubsidiaryDescriptor.AddressDto', 'CrefoNo', 'BedirektNo', 'DunsNo', 'VatNo', 'TaxNo', 'HasFrameworkAgreement',
					'SubsidiaryDescriptor.TelephoneNumber1Dto', 'SubsidiaryDescriptor.TelephoneNumber2Dto', 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto', 'SubsidiaryDescriptor.TelephoneNumberMobileDto'];

				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					orderBy: [{Field: 'BusinessPartnerName1'}],
					useCurrentClient: false,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					// withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch: true,
					includeRadiusSearch: true
				};

				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainHeaderDataService',
						entityRole: {
							root: {
								itemName: itemName,
								moduleName: 'cloud.desktop.moduleDisplayNameBusinessPartner',
								codeField: codeField,
								descField: descField,
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								handleUpdateDone: handleUpdateDone,
								responseDataEntitiesPropertyName: 'Main'
							}
						},
						entitySelection: {
							supportsMultiSelection: true
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner/',
							endCreate: 'createbp'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner/',
							endDelete: 'deletebp'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner/',
							endUpdate: 'updatebp'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner/',
							endRead: 'listbp',
							initReadData: initReadData,
							usePostForRead: true
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								handleCreateSucceeded: handleCreateSucceeded
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['TradeRegisterDate', 'CraftCooperativeDate'])],
						modification: {
							multi: function () {
							}
						},
						entityInformation: {
							module: moduleName,
							entity: 'BusinessPartner',
							specialTreatmentService: $injector.get('businessPartnerCreationInitialDialogService')
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true}, // enable watchlist for this module
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName,
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						},  // 11.Jun.2015@rei added
						actions: {
							delete: {}, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								if (item && !_.isEmpty(item)) {
									if (item.Version === 0) {
										return true;
									} else {
										return !container.service.getItemStatus(item).IsReadonly;
									}
								}
								return true;
							}
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(serviceOptions);
				container.data.newEntityValidator = {
					validate: processItem
				};
				var doesBpDuplicateCheckEmail = 0;
				const appStartupInfo = initAppService.getStartupInfo();

				$rootScope.$on('permission-service:updated', function () {
					var selectedItem = container.service.getSelected();
					if (selectedItem) {
						if (!platformPermissionService.hasWrite('75dcd826c28746bf9b8bbbf80a1168e8')) {
							platformRuntimeDataService.readonly(selectedItem, true);
						}
					}
				});

				function canEditDunsNo(item) {
					if (!item) {
						return false;
					}
					return !platformRuntimeDataService.isReadonly(item, 'DunsNo');
				}

				function getExtension() {
					return '*.vcf';
				}

				container.service.setAllUniqueColumns = function (allUniqueColumns){
					_allUniqueColumns = allUniqueColumns;
				}

				// eslint-disable-next-line no-tabs
				/*	function revertProcessItem(item) {
			      if (item.Version === 0 && businesspartnerMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryId)) {
						item.Code = 'IsGenerated';
					}
				} */
				function handleCreateSucceeded(newItem) {
					if (_allUniqueColumns){
						newItem = {
							main: newItem,
							allUniqueColumns: _allUniqueColumns
						}
					}

					container.service.allUniqueColumns = newItem.allUniqueColumns;
					basicsCommonCharacteristicService.onEntityCreated(container.service, newItem, 2, 56);
					var exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						var containerInfoService = $injector.get('businesspartnerMainContainerInformationService');
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(container.service, 56, gridContainerGuid, containerInfoService);
						characterColumnService.appendDefaultCharacteristicCols(newItem);
					}
					newItem.main.Code = businesspartnerMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(newItem.main.RubricCategoryFk) ? $translate.instant('cloud.common.isGenerated') : '';
					return newItem.main;
				}

				function processItem(createdEntity) {
					if (createdEntity.Version === 0) {  // check unique when create a entity
						var validationService = platformValidationByDataService.getValidationServiceByDataService(container.service);
						_.forEach(container.service.allUniqueColumns, function (items) {
							var uniqueColumns = items.split('&');
							_.forEach(uniqueColumns, function (item) {
								// var asyncValidateString = 'asyncValidate' + item;
								validationService.asyncValidationColumnsUnique(createdEntity, createdEntity[item], item, uniqueColumns).then(function (validateResult) {
									if (validateResult.valid && item === 'BusinessPartnerName1') {
										validationService.validateBusinessPartnerName1(createdEntity, createdEntity[item], item);
									}
								});
							});
						});
					}
					setReadonly(createdEntity);
				}

				var uploadOptions = {
					uploadServiceKey: 'business-partner-partner',
					uploadConfigs: {action: 'Import', SectionType: 'Partner'},
					getExtension: getExtension
				};

				basicsCommonServiceUploadExtension.extendForCustom(container.service, uploadOptions);

				var searchFilter = null;

				/**
				 * This function creates a Inquiry Resultset from input resultset (busniness partner specific)
				 *
				 * {InquiryItem} containing:
				 *     {  id:   {integer} unique id of type integer
				 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
				 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
				 *        bpId: item.Id, {integer}  business partner id (extended property) will be used in businesslogic for querying
				 *        subsidiaryId:  {integer}  subsidiary id(extended property), will be used in businesslogic for querying
				 *     });
				 *
				 * @param resultSet
				 * @returns {Array} see above
				 */
				function createInquiryResultSet(resultSet) {

					var subsidiaryService = $injector.get('businesspartnerMainSubsidiaryDataService');
					var contactService = $injector.get('businesspartnerMainContactDataService');
					var defNoName = $translate.instant('businesspartner.main.inquiry.noname');
					var defNoAdress = $translate.instant('businesspartner.main.inquiry.noaddress');
					var defNoSubSidDesc = $translate.instant('businesspartner.main.inquiry.nosubsidiarydesc');
					const supplierDataService = $injector.get('businesspartnerMainSupplierDataService');

					/**
					 * this function formats the business partner name1, and name2
					 * @param  {object } item  valid business partner object
					 * @returns {string} returns formatted string
					 */
					function getConcatenatedName(item) {
						var x1 = item.BusinessPartnerName1 || '';
						var x2 = item.BusinessPartnerName2 || '';
						var x = x1 + ((x1.length > 0) && (x2.length > 0) ? ', ' : '') + x2;
						return x.length > 0 ? x : defNoName;
					}

					/**
					 * checks the inStr string for null, undefined and length >0,
					 * if inStr is not a valid string tt returns defaultStr
					 * @param {string} inStr
					 * @param {string} defaultStr
					 * @returns {*} if inStr is not a valid string tt returns defaultStr
					 */
					function stringIsNullorEmpty(inStr, defaultStr, prefix) {
						return (inStr && _.isString(inStr) && inStr.length > 0) ? ((prefix ? prefix : '') + inStr) : defaultStr;
					}

					/**
					 * This function checks if bp subsidiary is the same as select subsidiary,
					 * we prefere to take the selected subsidiary from subsidiary service.
					 *
					 * @param {obj} item
					 * @param item.SubsidiaryDescriptor
					 * @returns {{description, address, subsidiaryId}}
					 */
					function getSubsidiary(item) {
						var mainSubSidiaryId;
						var subSidiary = {
							description: defNoSubSidDesc,
							address: defNoAdress,
							subsidiaryId: undefined
						};
						if (item.SubsidiaryDescriptor) {
							subSidiary.description = stringIsNullorEmpty(item.SubsidiaryDescriptor.Description, defNoSubSidDesc);
							if (item.SubsidiaryDescriptor.AddressDto) {
								subSidiary.address = item.SubsidiaryDescriptor.AddressDto.Address;
							}
							mainSubSidiaryId = subSidiary.subsidiaryId = item.SubsidiaryDescriptor.Id;
						}

						// check: 1. subsidiary holds subsidiary(ies) to current business partner
						//        2. select subsidiary is different from bp main address (check by different ids)
						//        3. Single selection
						var subSid = subsidiaryService.getSelected();
						if (subSid && subSid.Id && (subSid.Id !== mainSubSidiaryId) && resultSet.length === 1) {
							subSidiary.subsidiaryId = subSid.Id;
							subSidiary.description = subSid.Description;
							if (subSid.AddressDto) {
								subSidiary.address = subSid.AddressDto.Address;
							}
						}

						return subSidiary;
					}

					/**
					 * This function checks if bp subsidiary is the same as select subsidiary,
					 * we prefere to take the selected subsidiary from subsidiary service.
					 *
					 * @param {obj} item
					 * @param item.SubsidiaryDescriptor
					 * @returns {{description, address, subsidiaryId}}
					 */
					function getContact(item /* ,subsidiary */) {
						// var ContactId;
						var contact = {
							description: 'no contact',
							contactId: undefined
						};
						// check: 1. subsidiary holds subsidiary(ies) to current business partner
						//        2. select subsidiary is different from bp main address (check by different ids)
						var contactItem = contactService.getSelected();
						if (contactItem && contactItem.BusinessPartnerFk !== item.Id) {
							contactItem = item.DefaultContact;
						}
						if (contactItem && contactItem.Id) {
							initContact(contactItem);
						}
						else if(!contactItem && appStartupInfo && appStartupInfo.navInfo)
						{
							const extparams=appStartupInfo.navInfo.extparams;
							if(extparams!==null && extparams !== undefined &&extparams.length>0)
							{
								const obj=angular.fromJson(extparams);
								if(obj.from==='baseline')
								{
									const list=contactService.getList();
									const listItem = _.find(list, {IsDefaultBaseline : true});
									if(listItem)
									{
										initContact(listItem);
									}
								}
							}
						}

						function initContact(contactEntity)
						{
							contact.contactId = contactEntity.Id;
							const a = [contactEntity.FirstName, contactEntity.FamilyName];
							contact.description = a.join(' ');
							contact.email = contactEntity.Email;
						}
						return contact;
					}

					function getSupplier() {
						let supplier = supplierDataService.getSelected();
						const subsidiary = subsidiaryService.getSelected();
						if (isBaseline() && supplier && subsidiary) {
							if (supplier.SubsidiaryFk && supplier.SubsidiaryFk !== subsidiary.Id) {
								supplier = null;
							} else {
								const supplierStatusList = basicsLookupdataLookupDescriptorService.getData('supplierstatus');
								const state = _.find(supplierStatusList, {Id: supplier.SupplierStatusFk});
								if (state && state.IsDeactivated) {
									supplier = null;
									platformModalService.showDialog({
										headerTextKey: $translate.instant('businesspartner.main.supplierContainerTitle'),
										bodyTextKey: $translate.instant('businesspartner.main.supplierStatusWarning'),
										iconClass: 'warning'
									});
								}
							}
							return supplier;
						} else {
							return null;
						}
					}

					var resultArr = [];
					_.forEach(resultSet, function (item) {
						if (item && item.Id) { // check for valid object
							var code = item.Code ? item.Code : '';
							var subSidiary = getSubsidiary(item);
							var theContact = getContact(item /* ,subSidiary */);
							const supplier = getSupplier();
							if (subSidiary.subsidiaryId) {
								resultArr.push({
									id: subSidiary.subsidiaryId,
									name: getConcatenatedName(item),
									description: stringIsNullorEmpty(subSidiary.description, defNoSubSidDesc) + ': ' + stringIsNullorEmpty(subSidiary.address, defNoAdress) +
										stringIsNullorEmpty((theContact || {}).description, '', ': '),
									bpId: item.Id,
									code: code,
									subsidiaryId: subSidiary.subsidiaryId,
									contactName: (theContact || {}).description,
									contactId: (theContact || {}).contactId,
									supplierCode: supplier ? supplier.Code : null
								});
							}
						}
					});

					return resultArr;
				}

				function isBaseline() {
					let isBaseline = false;
					if (appStartupInfo && appStartupInfo.navInfo) {
						const extParams = appStartupInfo.navInfo.extparams;
						if (extParams && extParams.length > 0) {
							const obj = angular.fromJson(extParams);
							isBaseline = obj.from === 'baseline'
						}
					}
					return isBaseline;
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getSelectedItems() {

					// var theCont = container;
					var theSvc = container.service;
					// var resultSet = theSvc.getSelected();
					var resultSet = theSvc.getSelectedEntities();

					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getResultsSet() {
					let resultSet = platformGridAPI.rows.getRows('75dcd826c28746bf9b8bbbf80a1168e8');
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				initialize();
				container.service.name = 'businesspartner.main';
				container.service.isBaseLine = isBaseline();
				// TODO: it is just a work around to clear modifications when do call search
				container.service.executeSearchFilterBase = container.service.executeSearchFilter;

				container.service.executeSearchFilter = function executeSearchFilter(e, filter) {
					searchFilter = filter;

					var oldDoCallHTTPUpdate = container.data.doCallHTTPUpdate;
					container.data.doCallHTTPUpdate = function doCallHTTPUpdate() {
						return null;
					};

					container.service.executeSearchFilterBase(e, filter);

					container.data.doCallHTTPUpdate = oldDoCallHTTPUpdate;
				};
				container.service.canEditDunsNo = canEditDunsNo;
				container.service.allUniqueColumns = [];
				container.service.allOldUniqueColumns = [];
				container.service.originalValidationService = null;
				container.service.setUniqueColumns = setUniqueColumns;
				container.data.showHeaderAfterSelectionChanged = function showHeaderAfterSelectionChanged(entity) {// jshint ignore:line
					var entityText;
					if (entity) {
						entityText = entity[codeField];
						if (entity[descField] && entity[descField].trim().length > 0) {
							if (entityText && entityText.length > 0) {
								entityText += ' - ' + entity[descField];
							} else {
								entityText = entity[descField];
							}
						}
					}
					// cloudDesktopInfoService.updateModuleInfo(serviceOptions.flatRootItem.entityRole.root.moduleName, entityText);
					cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameBusinessPartner', entityText);
				};
				// define status rignts.
				container.service.statusWithEidtRight = [];
				container.service.statusWithEidtRightToSupplier = [];
				container.service.statusWithEidtRightToCustomer = [];
				container.service.statusWithCreateRight = [];
				container.service.statusWithDeleteRight = [];

				container.service.getItemStatus = function getItemStatus(item) {
					var state, statuses, parentItem = item || container.service.getSelected();
					statuses = basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus');
					if (parentItem && parentItem.Id) {
						state = _.find(statuses, {Id: parentItem.BusinessPartnerStatusFk});
					} else {
						state = {IsReadonly: true};
					}
					return state;
				};

				var createItem = container.service.createItem;
				container.service.createItem = function (creationOptions, data){
					_allUniqueColumns = null;
					createItem(creationOptions, data);
				};

				container.service.createItemSimple = function (creationOptions, customCreationData, onCreateSucceeded) {
					var data = container.data;
					var creationData = _.merge(data.doPrepareCreate(data, creationOptions), customCreationData);
					return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
				};

				container.service.updateSimple = function (updateData) {
					return container.data.doCallHTTPUpdate(updateData, container.data);
				};
				container.service.getBpDuplicateCheckEmail = getBpDuplicateCheckEmail;
				basicsCommonInquiryHelperService.registerEnableInspector('75dcd826c28746bf9b8bbbf80a1168e8',container.service);

				container.data.callAfterSuccessfulUpdate = function () {
					container.service.onCallAfterSuccessfulUpdate.fire(updateDataTemp);
					updateDataTemp = null;
				}

				return container.service;

				function initReadData(readData) {
					var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(searchFilter);
					const appStartupInfo = initAppService.getStartupInfo();
					if (appStartupInfo && appStartupInfo.navInfo) {
						const extparams = appStartupInfo.navInfo.extparams;
						if (extparams !== null && extparams !== undefined && extparams.length > 0) {
							const json = angular.fromJson(extparams);
							if (json && json.hasOwnProperty('isApprovedBP')) {
								if (!params.furtherFilters) {
									params.furtherFilters = [];
								}
								params.furtherFilters.push({Token: 'isApprovedBP', Value: json.isApprovedBP});
							}
						}
					}
					angular.extend(readData, params);
				}

				function incorporateDataRead(responseData, data) {
					var filterParams = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(searchFilter);
					cloudDesktopSidebarService.updateFilterResult({
						isPending: false,
						filterRequest: filterParams,
						filterResult: responseData.FilterResult
					});
					searchFilter = null;

					responseData = responseData || {};
					basicsLookupdataLookupDescriptorService.attachData(responseData);
					basicsLookupdataLookupDescriptorService.updateData('businesspartner.evluation', responseData.Main);
					var dataRead = data.handleReadSucceeded(responseData.Main, data);

					container.service.allUniqueColumns = responseData.AllUniqueColumns;
					if (responseData.BusinessPartnerStatusEditRightToSupplier) {
						container.service.statusWithEidtRightToSupplier = responseData.BusinessPartnerStatusEditRightToSupplier;
					}
					if (responseData.BusinessPartnerStatusEditRightToCustomer) {
						container.service.statusWithEidtRightToCustomer = responseData.BusinessPartnerStatusEditRightToCustomer;
					}
					if (responseData.BusinessPartnerStatusEditRight) {
						container.service.statusWithEidtRight = responseData.BusinessPartnerStatusEditRight;
					}
					if (responseData.BusinessPartnerStatusCreateRight) {
						container.service.statusWithCreateRight = responseData.BusinessPartnerStatusCreateRight;
					}
					if (responseData.BusinessPartnerStatusDeleteRight) {
						container.service.statusWithDeleteRight = responseData.BusinessPartnerStatusDeleteRight;
					}

					_.forEach(responseData.Main, function (item) {
						defineValue(item);
						defineValueByConfiguration(item);
						setReadonly(item);
					});

					// doesBpDuplicateCheckEmail = !!responseData.DoesBpDuplicateCheckEmail;
					container.service.goToFirst();
					var exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						var containerInfoService = $injector.get('businesspartnerMainContainerInformationService');
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(container.service, 56, gridContainerGuid, containerInfoService);
						characterColumnService.appendCharacteristicCols(responseData.Main);
					}
					return dataRead;
				}

				/**
				 * @param gridColumns : grid Columns
				 * @param formColumns : form Columns
				 * @param allUniqueColumns : the Unique columns
				 * @param isGrid : if the container is grid, isGrid = true
				 * @param initValidator : if delete th configuration, initValidate is true,else is false
				 * @param gridId : if the id from Grid container,
				 */
				function setUniqueColumns(gridColumns, formColumns, allUniqueColumns, isGrid, initValidator, gridId) {
					var allColumns,
						instanceGridColumns,
						existedGrid,
						validationService = platformValidationByDataService.getValidationServiceByDataService(container.service);

					if (isGrid && gridId) {
						existedGrid = platformGridAPI.grids.exist(gridId);
						if (existedGrid) {
							instanceGridColumns = platformGridAPI.columns.getColumns(gridId);
							allColumns = platformGridAPI.grids.element('id', gridId);
						}
					}
					_.forEach(allUniqueColumns, function (items) {
						var uniqueColumns = items.split('&');
						_.forEach(uniqueColumns, function (item) {
							var asyncValidateString = 'asyncValidate' + item;
							if (initValidator) {    // set the configuration message for the validationService
								validationService[asyncValidateString] = container.service.originalValidationService[asyncValidateString];
							} else {
								validationService[asyncValidateString] = function (entity, value, columnName) {
									if (angular.isFunction(container.service.originalValidationService[asyncValidateString])) {
										return container.service.originalValidationService[asyncValidateString](entity, value, columnName)
											.then(function (result) {
												if (result.valid) {
													return validationService.asyncValidationColumnsUnique(entity, value, columnName, uniqueColumns);
												}
												else{
													return result;
												}
											});
									} else {
										return validationService.asyncValidationColumnsUnique(entity, value, columnName, uniqueColumns);
									}
								};
							}
							if (isGrid) {
								if (gridColumns) { // set the asyncValidator for the grid columns of grid
									_.find(gridColumns, function (col) {
										if (_.toUpper(item) === _.toUpper(col.field)) {
											col.asyncValidator = validationService[asyncValidateString];
											return null;
										}
									});
								}
								if (instanceGridColumns) { // set the asyncValidator for the instance columns of grid
									_.find(instanceGridColumns, function (col) {
										if (_.toUpper(item) === _.toUpper(col.field)) {
											col.asyncValidator = validationService[asyncValidateString];
											return null;
										}
									});
								}
								if (allColumns && allColumns.columns && allColumns.columns.current) { // set the asyncValidator for the all currency columns of grid
									_.find(allColumns.columns.current, function (col) {
										if (_.toUpper(item) === _.toUpper(col.field)) {
											col.asyncValidator = validationService[asyncValidateString];
											return null;
										}
									});
								}
							} else if (formColumns) { // set the asyncValidator for columns of form
								_.find(formColumns, function (col) {
									if (_.toUpper(item) === _.toUpper(col.model)) {
										col.asyncValidator = validationService[asyncValidateString];
										return null;
									}
								});
							}
						});
					});
				}

				function initialize() {

					var http = $injector.get('$http');
					http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/defaultbpstatus', {}).then(function (response) {
						if (response.data) {
							basicsLookupdataLookupDescriptorService.updateData('BusinessPartnerStatus', [response.data]);
						}
					});
					// initial status rights.
					http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getkindsstatusrights').then(function (response) {

						if (response.data) {
							var res = response.data;
							container.service.statusWithEidtRight = res.BusinessPartnerStatusEditRight;
							container.service.statusWithEidtRightToSupplier = res.BusinessPartnerStatusEditRightToSupplier;
							container.service.statusWithEidtRightToCustomer = res.BusinessPartnerStatusEditRightToCustomer;
							container.service.statusWithCreateRight = res.BusinessPartnerStatusCreateRight; // clear
							container.service.statusWithDeleteRight = res.BusinessPartnerStatusDeleteRight; // clear
						}
					});
					container.service.checkBusinessPartnerIsExists = function (businessPartners) {
						if (businessPartners instanceof String) {
							businessPartners = [businessPartners];
						}
						var checkBusinessPartnerApiUrl = globals.webApiBaseUrl + 'businesspartner/main/businesspartnermain/checkbusinesspartner';
						return $injector.get('$http').post(checkBusinessPartnerApiUrl, businessPartners);
					};

					container.service.testReadAsync = function testReadAsync(fileList, callback) {

						// use Array, takes the place of FileList(it is a readonly object,
						// when Array.prototype.splice.call(fileList, start, count), then it will show error.)
						let files = Array.prototype.map.call(fileList, function (item) {
							return item;
						});

						clearFilesByExtension(files, getExtension());

						let results = [];// {testResult:false, fileName:"aa.txt", charset:"utf-8", vCard:card}
						if (files && files.length > 0) {
							// test read file by utf-8 and get charset.
							let readCount = 0;
							for (let i = 0; i < files.length; i++) {
								// use it replace the code before, but not change the original logic.
								readFile(files[i], (result) => {
									results.push(result);

									// reading file completed.
									if (++readCount === files.length) {
										let vCards = getVCards(results);
										callback(files, vCards, results);
									}
								});
							}
						}
					};

					// create FileReader and do something when onload.
					function readFile(file, processFn) {
						let reader = new FileReader();
						reader.onload = function (res) {
							let content = res.target.result;
							let result = {fileName: '', charset: 'utf-8', vCard: null};
							let charset = getCharSet(content);
							if (charset && charset !== 'utf-8') {
								result.charset = charset;
							}
							result.fileName = file.name;

							if (result.charset && result.charset !== 'utf-8') {
								readFileAgain(file, result, processFn);
							} else {
								result.vCard = getVCardInfo(content);
								processFn(result);
							}
						};
						reader.readAsText(file, 'utf-8');
					}

					function readFileAgain(file, fileResult, processFn) {
						let reader = new FileReader();
						reader.onload = function (res) {
							let content = res.target.result;
							fileResult.vCard = getVCardInfo(content);
							processFn(fileResult);
						};
						reader.readAsText(file, fileResult.charset);
					}

					function clearFilesByExtension(files, exts) {
						if (!exts) {
							return;
						}
						files = files || [];
						if (files && files.length > 0) {
							for (var i = files.length; i > 0; i--) {
								var file = files[i - 1];
								var ext = getExtensionByFileName(file.name);
								if (exts.indexOf(ext) < 0) {
									files.splice(i - 1, 1);
								}
							}
						}
						return files;
					}

					function getExtensionByFileName(fileName) {
						if (!fileName) {
							return '';
						}
						return fileName.substring(fileName.lastIndexOf('.'));
					}

					function getVCardInfo(content) {
						var N, familyName, givenName, additionalName, namePrefix, nameSuffix, FN, ORG;
						var lines = content.split('\r\n');
						for (var i = 0, len = lines.length; i < len; i++) {
							var line = lines[i];
							var properties = line.split(':');
							var propertyName = properties[0].split(';')[0];
							var propertyValue = properties[1];

							// Read N property
							if (propertyName === 'N') {
								N = propertyValue;

								var nameParts = N.split(';');

								// The first value is the family (last) name.
								familyName = nameParts[0];
								if (nameParts.Length === 1) {
									return;
								}

								// The next value is the given (first) name.
								givenName = nameParts[1];
								if (nameParts.Length === 2) {
									return;
								}

								// The next value contains the middle name.
								additionalName = nameParts[2];
								if (nameParts.Length === 3) {
									return;
								}

								// The next value contains the prefix, e.g. Mr.
								namePrefix = nameParts[3];
								if (nameParts.Length === 4) {
									return;
								}

								// The last value contains the suffix, e.g. Jr.
								nameSuffix = nameParts[4];

							}

							// Read FN property
							if (propertyName === 'FN') {
								FN = propertyValue;
							}

							// Read ORG property
							if (propertyName === 'ORG') {
								ORG = propertyValue;
							}

							// Break when read completed
							if (N && FN && ORG) {
								break;
							}
						}

						// Make result of vCard.
						return {
							N: N,
							familyName: familyName,
							givenName: givenName,
							additionalName: additionalName,
							namePrefix: namePrefix,
							nameSuffix: nameSuffix,
							FN: FN,
							ORG: ORG
						};
					}

					function getCharSet(content) {
						var result = '';
						var lines = content.split('\r\n');
						for (var i = 0, len = lines.length; i < len; i++) {
							if (result) {
								break;
							}
							var line = lines[i];
							var properties = line.split(':');
							var subProperties = properties[0].split(';');
							if (subProperties.length > 1) {
								for (var j = subProperties.length; j > 1; j--) {
									var subProperty = subProperties[j - 1].split('=');
									if (subProperty[0] === 'CHARSET') {
										result = subProperty[1];
										break;
									}
								}
							}
						}

						return result;
					}

					function getVCards(results) {
						var vCards = [];
						results.forEach(function (result) {
							vCards.push(result.vCard);
							result.vCard = undefined;
						});
						return vCards;
					}

					container.data.onDeleteDone = onDeleteDoneInList;
					container.service.getCellEditable = getCellEditable;
					container.service.fillReadonlyModels = fillReadonlyModels;
					container.service.disableItem = disableItem;
					container.service.enableItem = enableItem;

					var beforeDataUpdate = new PlatformMessenger();
					container.service.beforeDataUpdate = beforeDataUpdate;
					container.service.filterBranchBtnDisable = new PlatformMessenger();
					container.service.onCallAfterSuccessfulUpdate = new PlatformMessenger();

					var oldUpdate = container.service.update;
					container.service.update = function update(isTriggeredBySelectionOrContainerChange, ignoreNextSelectionChangeForUpdate) {
						beforeDataUpdate.fire();
						return oldUpdate(isTriggeredBySelectionOrContainerChange, ignoreNextSelectionChangeForUpdate);
					};

					/**
					 * provide lookup data item to lookup formatter after creating new item.
					 */
					container.service.registerEntityCreated(onEntityCreated);

					container.service.setReadonly = setReadonly;
					container.service.setCodeReadOnly = setCodeReadOnly;
					container.service.setCodeReadOnlyByData = setCodeReadOnlyByData;
					container.service.registerDescriptorChanged = registerDescriptorChanged;
					container.service.unregisterDescriptorChanged = unregisterDescriptorChanged;
					container.service.registerBeforeDataUpdate = registerBeforeDataUpdate;
					container.service.unregisterBeforeDataUpdate = unregisterBeforeDataUpdate;
					container.service.clearUpValidationIssues = clearUpValidationIssues;
					container.service.registerValidationIssuesClearUp = registerValidationIssuesClearUp;
					container.service.unregisterValidationIssuesClearUp = unregisterValidationIssuesClearUp;
					container.service.registerValidationIssuesRemove = registerValidationIssuesRemove;
					container.service.unregisterValidationIssuesRemove = unregisterValidationIssuesRemove;
					container.service.isBpStatusHasRight = isBpStatusHasRight;
					container.service.doClearModifications = container.data.doClearModifications;
					container.service.isEditName = isEditName;
					container.service.setDataReadOnly = setDataReadOnly;
					container.service.getDuplicateCheckeEmail = getDuplicateCheckeEmail;

					container.service.updateEmail = updateEmail;
					container.service.registerUpdateEmail = registerUpdateEmail;
					container.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
						characteristicColumn = colName;
					};
					container.service.getCharacteristicColumn = function getCharacteristicColumn() {
						return characteristicColumn;
					};
					basicsCommonCharacteristicService.unregisterCreateAll(container.service, 2, 56);

					let updateSuccessed = new PlatformMessenger();
					container.service.updateSuccessedRegister = updateSuccessed;
					container.service.wizardIsActivate = wizardIsActivate;

					function isBpStatusHasRight(item, bpStatusFkField, currentstatus, bpStatusFk) {

						var status = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus'), {Id: item.BusinessPartnerStatusFk || bpStatusFk});
						var statusHasRight = _.find(container.service[currentstatus], {Id: item.BusinessPartnerStatusFk || bpStatusFk});
						// return !!(status && statusHasRight);
						return !!(status && statusHasRight) && status.IsReadonly === false && statusHasRight.IsReadonly === false;
					}

					function isEditName(statusFk) {
						var status = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus'), {Id: statusFk});
						return status.EditName;
					}

					var descriptorChanged;
					descriptorChanged = new PlatformMessenger();
					container.service.descriptorChanged = descriptorChanged;

					function registerDescriptorChanged(handler) {
						if (angular.isFunction(handler)) {
							descriptorChanged.register(handler);
						}
					}

					function unregisterDescriptorChanged(handler) {
						if (angular.isFunction(handler)) {
							descriptorChanged.unregister(handler);
						}
					}

					function registerBeforeDataUpdate(handler) {
						if (angular.isFunction(handler)) {
							beforeDataUpdate.register(handler);
						}
					}

					function unregisterBeforeDataUpdate(handler) {
						if (angular.isFunction(handler)) {
							beforeDataUpdate.unregister(handler);
						}
					}

					var validationIssuesClearUp;
					validationIssuesClearUp = new PlatformMessenger();
					container.service.validationIssuesClearUp = validationIssuesClearUp;

					function registerValidationIssuesClearUp(handler) {
						if (angular.isFunction(handler)) {
							validationIssuesClearUp.register(handler);
						}
					}

					function unregisterValidationIssuesClearUp(handler) {
						if (angular.isFunction(handler)) {
							validationIssuesClearUp.unregister(handler);
						}
					}

					var validationIssuesRemove;
					validationIssuesRemove = new PlatformMessenger();
					container.service.validationIssuesRemove = validationIssuesRemove;

					function registerValidationIssuesRemove(handler) {
						if (angular.isFunction(handler)) {
							validationIssuesRemove.register(handler);
						}
					}

					function unregisterValidationIssuesRemove(handler) {
						if (angular.isFunction(handler)) {
							validationIssuesRemove.unregister(handler);
						}
					}

					// container.service.registerItemModified(onItemModified);

					var rubricCategoryFilter =
						{
							key: 'businesspartner-main-rubric-category-by-rubric-filter',
							fn: function (rc) {
								return rc.RubricFk === 1;// 3 is rubric for bp.
							}
						};

					var legalFormFilter = {
						key: 'business-partner-main-legal-form-filter',
						fn: function (item, context) {
							if (!item || !context) {
								return false;
							}

							// If item is not live or sorting is not valid, don't list it.
							if(!item.IsLive || item.Sorting <= 0) {
								return false;
							}

							if (!item.BasCountryFk) {
								return true;
							}

							if (context.SubsidiaryDescriptor && context.SubsidiaryDescriptor.AddressDto && context.SubsidiaryDescriptor.AddressDto.CountryFk) {
								return context.SubsidiaryDescriptor.AddressDto.CountryFk === item.BasCountryFk;
							}

							return true;
						}
					};
					let  newRubricCategoryFilter= {

						key: 'businesspartner-main-rubric-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function (entity) {
							return {Rubric: 1,CustomCompanyFk:entity.CompanyFk};
						}
					};
					let  supplierRubricCategoryFilter= {

						key: 'supplier-rubric-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return {Rubric: 11};
						}
					};
					let  customerRubricCategoryFilter= {

						key: 'customer-rubric-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return {Rubric: 10};
						}
					};

					basicsLookupdataLookupFilterService.registerFilter([legalFormFilter, rubricCategoryFilter,newRubricCategoryFilter,supplierRubricCategoryFilter,customerRubricCategoryFilter]);

					function registerNavi() {
						businessPartnerHelper.registerNavigation(container.data.httpReadRoute, {
							moduleName: moduleName,
							getNavData: function getNavData(item, triggerField) {
								if (angular.isDefined(item[triggerField])) {
									return item[triggerField] !== null ? item[triggerField] : -1;
								}

								if (angular.isNumber(item) || angular.isString(item) || angular.isArray(item)) {
									return item;
								}

								throw new Error('The property business partner is not recognized.');
							}
						});
					}

					container.service.registerNavi = registerNavi;

					function clearUpValidationIssues() {
						if (platformDataValidationService.hasErrors(container.service)) {
							var modState = platformModuleStateService.state(container.service.getModule());
							modState.validation.issues = [];
						}
						validationIssuesClearUp.fire();
					}

					function onDeleteDoneInList(deleteParams, data, response) {
						var deleteEntities = deleteParams.entities || [];
						if (deleteParams.entity && deleteParams.entity.Id) {
							deleteEntities.push(deleteParams.entity);
						}

						if (data.deleteFromSelections) {
							data.deleteFromSelections(deleteEntities, data);
						}

						data.doClearModifications(deleteEntities, data);
						_.each(deleteEntities, function (delEntity) {
							doClearValidationIssues(delEntity);
						});
						data.itemList = _.filter(data.itemList, function (item) {
							return !_.find(deleteEntities, function (delEntity) {
								return item.Id === delEntity.Id;
							});
						});

						if (data.rootOptions && data.rootOptions.mergeAffectedItems) {
							data.rootOptions.mergeAffectedItems(response, data);
						}

						data.listLoaded.fire();
						platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);
					}

					function doClearValidationIssues(entity) {
						if (platformDataValidationService.hasErrors(container.service)) {
							var modState = platformModuleStateService.state(container.service.getModule());
							modState.validation.issues = _.filter(modState.validation.issues, function (err) {
								return err.entity.Id !== entity.Id;
							});
						}
						validationIssuesRemove.fire(null, entity.Id);
					}

					container.service.getBusinessPartnerAddresses = function (bpIds) {
						return $http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getbusinesspartneraddresses', bpIds)
							.then(function (response) {
								return response.data;
							});
					};

					container.service.adjustClerkLayout = adjustClerkLayout;
				}

				function fillReadonlyModels(configuration) {
					var service = container.service;
					service.unregisterSelectionChanged(onSelectionChanged);
					businessPartnerHelper.fillReadonlyModels(configuration, service);
					service.registerSelectionChanged(onSelectionChanged);
				}

				// noinspection JSUnusedLocalSymbols
				function onSelectionChanged(e, item) {
					if (item && Object.getOwnPropertyNames(item).length) {

						if (!item.SubsidiaryDescriptor) {
							// todo(seto) : item != null but item.SubsidiaryDescriptor == null,then set item.SubsidiaryDescriptor.AddressFk is error
							item.SubsidiaryDescriptor = item.SubsidiaryDescriptor || {};
						}
					}
				}

				function setReadonly(item) {
					if (!item || !item.Id) {
						return;
					}

					var bpStatus = _.find(basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus'), {Id: item.BusinessPartnerStatusFk});
					var statusWithEditRight = _.find(container.service.statusWithEidtRight, {Id: item.BusinessPartnerStatusFk});
					var fields = _.map(container.service.canReadonlyModels, function (model) {
						//  status's field "Readonly" check
						if (bpStatus.IsReadonly) {
							if (item.Version !== 0) {
								return {field: model, readonly: true};
							}
							return {field: model, readonly: false};
						}
						// field check
						else {
							var editable = getCellEditable(item, model);
							// version field check
							if (model === 'UpdatedAt' || model === 'InsertedAt' || model.indexOf('__rt$data.history') >= 0) {
								editable = false;
							}
							// status's field  "statusWithEditRight"  check
							else {
								// set the fields readonly only AccessRightDescriptorFk is not null and has not edit right
								if (_.includes(readonlyFieldsByBpStatus, model) && bpStatus && !statusWithEditRight) {
									// here a new created item always allowed to edit (because it can't get permission if no data loaded and it make sence to user in daily work).
									if (item.Version !== 0) {
										editable = false;
									}
								}
							}
							if (model === 'Code') {

								if (item.Version > 0) {
									/* editable = !businesspartnerMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryId); */
									editable = false;
									if (!item.RubricCategoryFk /* && !item.Code */) {
										editable = true;
									}

								}
								else if (item.Version ===0) {
									editable = !businesspartnerMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk);
								}
							}

							return {field: model, readonly: !editable};
						}

					});

					platformRuntimeDataService.readonly(item, fields);
				}

				function getCellEditable(currItem, field) {
					// check data isnull?
					if (!currItem) {
						return false;
					}
					// status's field "editName" check
					if (field === codeField || field === descField || field === addressField || field === bpName3 || field === bpName4) {
						// noinspection JSUnresolvedVariable
						return !!getValueByKey('BusinessPartnerStatus', currItem.BusinessPartnerStatusFk).EditName;
					}
					return true;
				}
				// region customized code function
				function  setCodeReadOnlyByData(entity,newRubricCategoryFk,newCompanyFk) {
					let codeReadOnly=false;
					$http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/checkcodebycompany?rubricCategoryFk=' + newRubricCategoryFk + '&companyFk=' + newCompanyFk).then(function (response) {
						if (response && response.data === false && entity.Version === 0) {
							entity.Code = null;
							codeReadOnly = false;
						} else if (response && response.data === true && entity.Version === 0) {
							entity.Code = $translate.instant('cloud.common.isGenerated');
							codeReadOnly = true;
						}
						setCodeReadOnly(entity,codeReadOnly);
					});
				}
				function  setCodeReadOnly(entity,codeReadOnly) {
					let fields=[];
					let readOnlyField={field: 'Code', readonly: codeReadOnly};
					fields.push(readOnlyField);
					platformRuntimeDataService.readonly(entity, fields);
					container.service.gridRefresh();
				}
				// endregion
				function getValueByKey(type, key) {
					var value = basicsLookupdataLookupDescriptorService.getData(type);
					if (value && value[key]) {
						return value[key];
					}
					return {};
				}

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, newEntity) {
					defineValue(newEntity);
					defineValueByConfiguration(newEntity);

					var result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
						collect: function (prop) {
							var result = true;
							// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
							// if it is not the right lookup type name, please use convert to return right name.
							switch (prop) {
								case 'CustomerAbcFk':
								case 'CustomerGroupFk':
								case 'CustomerSectorFk':
								case 'TitleFk':
								case 'LanguageFk':
								case 'CommunicationChannelFk':
									result = false;
									break;
								default:
									break;
							}
							return result;
						}
					});
					if (!result.dataReady) {
						result.dataPromise.then(function () {
							container.service.gridRefresh();
						});
					}
				}

				function disableItem(item) {
					if (!item || !item.Id) {
						return;
					}
					item.IsLive = false;
					container.service.markItemAsModified(item);
					container.service.updateAndExecute(onRefresh);

					function onRefresh() {
						cloudDesktopSidebarService.filterStartSearch();
					}
				}

				function enableItem(item) {
					if (!item || !item.Id) {
						return;
					}
					item.IsLive = true;
					container.service.markItemAsModified(item);
					container.service.update();
				}

				function defineValue(item) {
					if (angular.isUndefined(item.BusinessPartnerName1)) {
						item.BusinessPartnerName1 = null;
					}
					if (angular.isUndefined(item.CrefoNo)) {
						item.CrefoNo = null;
					}
					if (angular.isUndefined(item.BedirektNo)) {
						item.BedirektNo = null;
					}
					if (angular.isUndefined(item.DunsNo)) {
						item.DunsNo = null;
					}
					if (angular.isUndefined(item.VatNo)) {
						item.VatNo = null;
					}
					if (angular.isUndefined(item.TaxNo)) {
						item.TaxNo = null;
					}
					if (angular.isUndefined(item.TradeRegisterNo)) {
						item.TradeRegisterNo = null;
					}
					if (angular.isUndefined(item.TradeRegister)) {
						item.TradeRegister = null;
					}
					if (angular.isUndefined(item.TradeRegisterDate)) {
						item.TradeRegisterDate = null;
					}
				}

				function defineValueByConfiguration(entity) {
					var allUniqueColumns = container.service.allUniqueColumns;
					if (allUniqueColumns && allUniqueColumns.length) {
						_.forEach(allUniqueColumns, function (items) {
							var uniqueColumns = items.split('&');
							_.forEach(uniqueColumns, function (item) {
								if (angular.isUndefined(entity[item])) {
									entity[item] = null;
								}
							});
						});
					}
				}

				function handleUpdateDone(updateData, res, data) {
					data.handleOnUpdateSucceeded(updateData, res, data, true);
					var uploadService = basicsCommonFileUploadServiceLocator.getService('businessPartnerEvaluationService.common.document');
					if (uploadService) {
						uploadService.clear();
					}
					if (res.EvaluationViewDto) {
						var bp = container.service.getSelected();
						if (bp) {
							delete res.EvaluationViewDto.BusinessPartnerFk;
							_.assign(bp, res.EvaluationViewDto);
						}
					}
					container.service.filterBranchBtnDisable.fire();

					updateDataTemp = updateData;
					container.service.updateSuccessedRegister.fire();
				}

				function adjustClerkLayout(clerkLayout) {
					clerkLayout.addition = {
						grid: [
							{
								id: 'companyCode',
								field: 'CompanyFk',
								name: 'Company Code',
								name$tr$: 'cloud.common.entityCompanyCode',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Company',
									displayMember: 'Code'
								}
							},
							{
								id: 'companyName',
								field: 'CompanyFk',
								name: 'Company Name',
								name$tr$: 'cloud.common.entityCompanyName',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Company',
									displayMember: 'CompanyName'
								}
							},
							{
								lookupDisplayColumn: true,
								field: 'ClerkFk',
								name: 'First Name',
								name$tr$: 'basics.clerk.entityFirstName',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'FirstName'
								}
							},
							{
								lookupDisplayColumn: true,
								field: 'ClerkFk',
								name: 'Family Name',
								name$tr$: 'basics.clerk.entityFamilyName',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'FamilyName'
								}
							},
							{
								lookupDisplayColumn: true,
								field: 'ClerkFk',
								name: 'Department',
								name$tr$: 'cloud.common.entityDepartment',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Department'
								}
							}
						],
						detail: [
							{
								readonly: true,
								id: 'company',
								gid: 'basicData',
								rid: 'company',
								model: 'CompanyFk',
								label: 'Company',
								label$tr$: 'cloud.common.entityCompany',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
								}
							},
							{
								readonly: true,
								lookupDisplayColumn: true,
								model: 'ClerkFk',
								label: 'First Name',
								label$tr$: 'basics.clerk.entityFirstName',
								type: 'directive',
								directive: 'cloud-clerk-clerk-dialog-without-teams',
								options: {
									displayMember: 'FirstName'
								}
							},
							{
								readonly: true,
								lookupDisplayColumn: true,
								model: 'ClerkFk',
								label: 'Family Name',
								label$tr$: 'basics.clerk.entityFamilyName',
								type: 'directive',
								directive: 'cloud-clerk-clerk-dialog-without-teams',
								options: {
									displayMember: 'FamilyName'
								}
							},
							{
								readonly: true,
								lookupDisplayColumn: true,
								model: 'ClerkFk',
								label: 'Department',
								label$tr$: 'cloud.common.entityDepartment',
								type: 'directive',
								directive: 'cloud-clerk-clerk-dialog-without-teams',
								options: {
									displayMember: 'Department'
								}
							}
						]
					};
				}

				function setDataReadOnly(data) {
					var businesspartnerStatusRightService = $injector.get('businesspartnerStatusRightService');
					businesspartnerStatusRightService.setListDataReadonly(data, true);
				}

				function getDuplicateCheckeEmail() {
					return doesBpDuplicateCheckEmail;
				}

				function updateEmail(value) {
					let mainItem = container.service.getSelected();
					mainItem.Email = value;
					container.service.markItemAsModified(mainItem);
					container.service.gridRefresh();
				}

				function registerUpdateEmail(messager) {
					messager.register(updateEmail);
				}

				function wizardIsActivate() {
					let isCurrentModule = mainViewService.getCurrentModuleName() === moduleName;
					let IsActivate = true;
					if (isCurrentModule) {
						let status = basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus');
						let parentItem = container.service.getSelected();
						let bodyText = '';
						if (parentItem) {
							let oneStatus = _.find(status, {Id: parentItem.BusinessPartnerStatusFk});
							let IsReadonly = oneStatus.IsReadonly;
							IsActivate = !IsReadonly;
							if (IsReadonly) {
								bodyText = $translate.instant('businesspartner.main.isReadOnlyMessage');
							}
						}
						if (!IsActivate) {
							let headerTextKey = $translate.instant('procurement.package.wizard.isActivateCaption');
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
					}
					return IsActivate;
				}

				function getBpDuplicateCheckEmail() {
					$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/getBpDuplicateCheckEmail').then(function (response) {
						var result = response.data;
						if (result !== null) {
							doesBpDuplicateCheckEmail = result;
						}
					});
				}
			}
		]
	);
})(angular);
