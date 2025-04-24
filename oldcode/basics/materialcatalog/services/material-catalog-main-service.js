(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	// neutral or supplier material catalogs
	var moduleName = 'basics.materialcatalog';
	angular.module(moduleName).factory('bpIsMandatoryMaterialCatalogType', ['basicsLookupdataSimpleLookupService', function (simpleLookupService) {
		var lookupOptions = {
			valueMember: 'Id',
			displayMember: 'Description',
			lookupModuleQualifier: 'basics.materialcatalog.type',
			filter: {
				customBoolProperty: 'ISFRAMEWORK',
				field: 'Isframework'
			}
		};
		return {
			getDefault: function () {
				return simpleLookupService.getDefault(lookupOptions);
			},
			getItemById: function (value) {
				return simpleLookupService.getItemById(value, lookupOptions);
			}
		};
	}]);

	angular.module(moduleName).factory('basicsMaterialCatalogService',
		['_', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService', 'platformContextService',
			'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'platformModuleNavigationService',
			'basicsCommonCreateDialogConfigService', 'basicsLookupdataSimpleLookupService', '$injector',
			'bpIsMandatoryMaterialCatalogType', 'ServiceDataProcessDatesExtension', 'basicsMaterialCatalogReadOnlyProcessor', 'cloudDesktopSidebarService',
			function (_, $http, dataServiceFactory, basicsLookupdataLookupFilterService, platformContextService,
				basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService, runtimeDataService,
				naviService, createDialogConfigService, simpleLookupService, $injector,
				bpIsMandatoryMaterialCatalogType, DatesProcessor, readOnlyProcessor, cloudDesktopSidebarService) {

				var serviceContainer = null;
				var service = null;
				var filters = [
					{
						key: 'mdc-material-catalog-rubric-category-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + 12; // material rubricFK is 12
						}
					},
					{
						key: 'mdc-material-catalog-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (dataContext) {
							return {
								BusinessPartnerFk: dataContext !== null ? dataContext.BusinessPartnerFk : null,
								SupplierFk: dataContext !== null ? dataContext.SupplierFk : null
							};
						}
					},
					{
						key: 'mdc-material-catalog-supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						fn: function (dataContext) {
							return {
								BusinessPartnerFk: dataContext !== null ? dataContext.BusinessPartnerFk : null,
								SubsidiaryFk: dataContext !== null ? dataContext.SubsidiaryFk : null
							};
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);
				var sidebarSearchOptions = {
					moduleName: 'basics.materialcatalog',  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: false,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					withExecutionHints: false,
					includeDateSearch:true,
					enhancedSearchVersion: '2.0'
				};

				var serviceOption = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsMaterialCatalogService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/materialcatalog/catalog/',
							endRead: 'searchlist',
							usePostForRead: true
						},
						dataProcessor: [
							readOnlyProcessor,
							new DatesProcessor(['ValidFrom', 'ValidTo', 'DataDate'])
						],
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									var items = {
										FilterResult: readData.FilterResult,
										dtos: readData.Main || []
									};

									return serviceContainer.data.handleReadSucceeded(items, data);
								}
							}
						},
						entityRole: {
							root: {
								useIdentification: true,
								itemName: 'MaterialCatalog',
								moduleName: 'cloud.desktop.moduleDisplayNameMaterialCatalog',
								addToLastObject: true,
								lastObjectModuleName: 'basics.materialcatalog',
								codeField: 'Code',
								descField: 'DescriptionInfo.Description',
								handleUpdateDone: function (updateData, response, data) {
									if (!response.MaterialCatalogs && response.MaterialCatalog) {
										response.MaterialCatalog = [response.MaterialCatalog];
									} else if (response.MaterialCatalogs) {
										response.MaterialCatalog = response.MaterialCatalogs;
										response.MaterialCatalogs = null;
									}
									data.handleOnUpdateSucceeded(updateData, response, data, true);
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						entitySelection: {supportsMultiSelection: true},
						translation: {
							uid: 'basicsMaterialCatalogService',
							title: 'basics.materialcatalog.moduleName',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: { typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog' }
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				service.isInternetFields = false;
				service.isInternetFieldsFn = ()=>{
					 return  $http.get(
						globals.webApiBaseUrl + 'basics/common/systemoption/internetfields'
					).then(res=>{
						 service.isInternetFields = res.data;
					 });
				};
				serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
					deleteParams.entity = deleteParams.entities[0];
					deleteParams.entities = null;
				};

				service.getCurrentTermsAndConditions = function getCurrentTermsAndConditions() {
					var currentItem = service.getSelected();
					if (currentItem) {
						return currentItem.TermsConditions;
					}
					return '';
				};

				service.setTermsAndConditionsAsModified = function setTermsAndConditionsAsModified(termsAndConditions) {
					if (!termsAndConditions) {
						return;
					}

					var selectedMaterialCatalog = service.getSelected();
					selectedMaterialCatalog.TermsConditions = termsAndConditions;
					service.markItemAsModified(selectedMaterialCatalog);
				};

				service.searchByCalId = function searchByCalId(item, navField) {
					if (item && angular.isDefined(item[navField]) && item[navField] !== null) {// navigate from req's framework contract
						cloudDesktopSidebarService.filterSearchFromPKeys([item[navField]]);
					}
					// Load service if neccessary
					if (angular.isDefined(serviceContainer.service.getList()) && _.isArray(serviceContainer.service.getList()) && serviceContainer.service.getList().length === 0) {
						serviceContainer.service.load();
					}

					if (angular.isDefined(item.WicBoq) && item.WicBoq !== null && angular.isDefined(item.WicBoq.MdcMaterialCatalogFk) && item.WicBoq.MdcMaterialCatalogFk !== null) {
						serviceContainer.service.setSelected(serviceContainer.service.getItemById(item.WicBoq.MdcMaterialCatalogFk));
					}
				};

				service.searchByCalCode = function searchByCalCode(item, navField) {
					var params = [item[navField]];
					$http.post(
						globals.webApiBaseUrl + 'basics/materialcatalog/catalog/searchlistByCode',
						params
					).then(function (response) {
						basicsLookupdataLookupDescriptorService.attachData(response.data);
						var items = {
							FilterResult: null,
							dtos: response.data.Main || []
						};
						return serviceContainer.data.handleReadSucceeded(items, serviceContainer.data);
					});
				};
				service.createItem = function createItem() {
					var options = {
						title: 'basics.materialcatalog.createDialogTitle',
						fid: 'basics.materialcatalog.createMaterialCatalogDialog',
						attributes: {},
						uiStandardService: 'basicsMaterialCatalogUIStandardService',
						containerData: serviceContainer.data,
						readOnlyProcessor: readOnlyProcessor,
						validationService: 'basicsMaterialCatalogValidationService'
					};

					bpIsMandatoryMaterialCatalogType.getDefault().then(function (data) {
						if (data.Isframework) {
							options.defaultValues = {
								MaterialCatalogTypeFk: data.Id
							};
							options.attributes = {
								Code: {mandatory: true},
								MaterialCatalogTypeFk: {mandatory: true},
								BusinessPartnerFk: {mandatory: true, required: false},
								SubsidiaryFk: {mandatory: false},
								SupplierFk: {mandatory: false}
							};
							createDialogConfigService.showDialog(options);
						} else {
							serviceContainer.data.doCallHTTPCreate({}, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
						}
					});
				};

				service.updateReadOnly = function (item, field, value) {
					runtimeDataService.readonly(item, [{field: field, readonly: !value}]);
				};

				service.deepCopyId = $injector.get('platformCreateUuid')();
				service.createDeepCopy = function createDeepCopy() {
					$injector.get('platformDialogService').showYesNoDialog('basics.materialcatalog.deepCopyMessage', 'basics.materialcatalog.Wizard.DeepCopyTitle', 'yes', service.deepCopyId, true)
						.then(function (result) {
							var apiUrl = result.yes === true ? 'deepcopyinside' : 'deepcopy';
							$http.post(globals.webApiBaseUrl + 'basics/materialcatalog/catalog/' + apiUrl, service.getSelected())
								.then(function (response) {
									service.isDeepCopy = true;
									serviceContainer.data.handleOnCreateSucceeded(response.data.MaterialCatalog, serviceContainer.data);
								}, function (/* error */) {
								});
						});
				};

				service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
					if (updateData.MaterialCatalog) {
						// adding MaterialCatalogs for batch disable record
						if (updateData.MaterialCatalog.length > 1) {
							updateData.MaterialCatalogs = updateData.MaterialCatalog;
							updateData.MaterialCatalog = null;
						} else if (updateData.MaterialCatalog.length === 1) {
							updateData.MaterialCatalogs = null;
							updateData.MaterialCatalog = updateData.MaterialCatalog[0];
						}
					}
				};

				return service;
			}]);
})(angular);