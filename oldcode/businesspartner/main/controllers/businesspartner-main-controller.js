(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals  */
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businesspartnerMainController',
		['$scope', '_', 'businesspartnerMainHeaderDataService', 'platformMainControllerService', 'businesspartnerMainTranslationService',
			'businessPartnerMainBP2CompanyDataService', 'businesspartnerMainSubsidiaryDataService', '$translate', 'platformTranslateService',
			'documentsProjectDocumentDataService', 'platformLayoutByDataService', 'businessPartnerMainSubsidiaryUIStandardService',
			'platformValidationByDataService', 'businesspartnerMainSubsidiaryValidationService', 'cloudDesktopSidebarService', 'businesspartnerCertificateCertificateContainerServiceFactory',
			'basicsImportProfileService', 'businessPartnerImportFields', 'platformGridAPI', 'platformRuntimeDataService', 'platformModalService', 'procurementContextService',
			'basicsImportHeaderService', 'customerNumberGenerationSettingsService', 'supplierNumberGenerationSettingsService','documentsProjectDocumentFileUploadDataService','$rootScope',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, _, mainService, mainControllerService, translateService, businessPartnerMainBP2CompanyDataService, businesspartnerMainSubsidiaryDataService,
				$translate, platformTranslateService, documentsProjectDocumentDataService, platformLayoutByDataService, businessPartnerMainSubsidiaryUIStandardService,
				platformValidationByDataService, businesspartnerMainSubsidiaryValidationService, cloudDesktopSidebarService, certificateContainerServiceFactory, basicsImportProfileService,
				businessPartnerImportFields, platformGridAPI, platformRuntimeDataService, platformModalService, moduleContext,
				basicsImportHeaderService, customerNumberGenerationSettingsService, supplierNumberGenerationSettingsService,
				fileUploadDataService, $rootScope) {

				let opt = {search: true, infos: true, wizards: true, auditTrail: 'c5d0f7ae1ef84b89ba870e68f619119b'};
				let result = mainControllerService.registerCompletely($scope, mainService, {}, translateService, moduleName, opt);

				// add export capability
				moduleContext.setLeadingService(mainService);
				moduleContext.setMainService(mainService);
				let exportOptions = {
					ModuleName: moduleName,
					permission: '3c5513a31ebd49c7a9e5ae0832b05ea0#e',
					MainContainer: {
						Id: 'businesspartner.main.grid',
						Label: 'businesspartner.main.headerGridContainerTitle'
					},
					SubContainers: [
						{
							Id: 'businesspartner.main.subsidiary',
							Qualifier: 'subsidiary',
							Label: 'businesspartner.main.subsidiaryGridContainerTitle',
							Selected: false
						},
						{
							Id: 'businesspartner.main.contactgrid',      // must match an entry in the module-containers.json!
							Qualifier: 'contact',                        // unique identifier for subcontainers (used on server side!)
							Label: 'businesspartner.main.contactGridContainerTitle', // listbox item text
							Selected: false                              // pre-select container in the listbox
						},
						{
							Id: 'businesspartner.main.activities',
							Qualifier: 'activity',
							Label: 'businesspartner.main.activitiesContainerTitle',
							Selected: false
						},
						{
							Id: 'businesspartner.main.objectsofcustomers',
							Qualifier: 'realestate',
							Label: 'businesspartner.main.realEstateGridContainerTitle',
							Selected: false
						},
						{
							Id: 'businesspartner.main.characteristic',
							Qualifier: 'characteristic',
							Label: 'cloud.common.ContainerCharacteristicDefaultTitle',
							Selected: false
						},
						{
							Id: 'businesspartner.main.supplier',
							Qualifier: 'supplier',
							Label: 'businesspartner.main.supplierContainerTitle',
							Selected: false
						},
						{
							Id: 'businesspartner.main.customer',
							Qualifier: 'customer',
							Label: 'businesspartner.main.customerGridContainerTitle',
							Selected: false
						}
					],
					HandlerSubContainer: function (subContainers) {
						_.forEach(subContainers, function (item) {
							item.ColumnLabels = [];
							item.SelectedColumns = [];
							item.InternalFieldNames = [];
							if (!item.GridId) {
								return;
							}
							let grid = platformGridAPI.grids.element('id', item.GridId);
							if (grid) {
								let gridConfig = platformGridAPI.columns.configuration(item.GridId);
								let gridColumns = angular.copy(exportOptions.ExcelProfileId > 3 ? gridConfig.current : gridConfig.visible);
								if (gridColumns.length > 0 && gridColumns[0].field === 'indicator') {
									gridColumns.splice(0, 1);
								}
								item.SelectedColumns = _.map(gridColumns, 'id');
								item.InternalFieldNames = _.map(gridColumns, 'field');
								_.forEach(gridColumns, function (column) {
									item.ColumnLabels.push(column.userLabelName ? column.userLabelName : column.name);
								});
							}
						});
					}
				};

				mainControllerService.registerExport(exportOptions);  // add export feature to the main-controller
				customerNumberGenerationSettingsService.assertLoaded();
				supplierNumberGenerationSettingsService.assertLoaded();

				// sidebar | information
				let info = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/sidebar-info.html'
				};

				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(info, true);

				// add import capability
				let importOptions = {
					// function will be called before popup will be shown
					preprocessor: function () {
					},
					ModuleName: moduleName,
					permission: '3dc98cfebf2f4540be90a255e6eb8b26#e',
					DoubletFindMethodsPage: {
						skip: false
					},
					CustomSettingsPage: {
						skip: false,
						Config: {
							showGrouping: false,
							groups: [
								{
									gid: 'businessPartnerImport',
									header: '',
									header$tr$: '',
									isOpen: true,
									visible: true,
									sortOrder: 1
								}
							],
							rows: [
								{
									gid: 'businessPartnerImport',
									rid: 'subsidiaryQuantity',
									label: 'Subsidiary Quantity',
									label$tr$: 'businesspartner.main.import.subsidiaryQuantity',
									type: 'integer',
									model: 'SubsidiaryQuantity',
									regex: '^[+]?[1-9]*$',
									validator: validateQuantity,
									required: true,
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'businessPartnerImport',
									rid: 'contactQuantity',
									label: 'Contact Quantity',
									label$tr$: 'businesspartner.main.import.contactQuantity',
									type: 'integer',
									model: 'ContactQuantity',
									regex: '^[+]?[1-9]*$',
									validator: validateQuantity,
									required: true,
									visible: true,
									sortOrder: 2
								},
								{
									gid: 'businessPartnerImport',
									rid: 'supplierQuantity',
									label: 'Supplier Quantity',
									label$tr$: 'businesspartner.main.import.supplierQuantity',
									type: 'integer',
									model: 'SupplierQuantity',
									regex: '^[+]?[1-9]*$',
									validator: validateQuantity,
									required: true,
									visible: true,
									sortOrder: 3
								},
								{
									gid: 'businessPartnerImport',
									rid: 'customerQuantity',
									label: 'Customer Quantity',
									label$tr$: 'businesspartner.main.import.customerQuantity',
									type: 'integer',
									model: 'CustomerQuantity',
									regex: '^[+]?[1-9]*$',
									validator: validateQuantity,
									required: true,
									visible: true,
									sortOrder: 4
								},
								{
									gid: 'businessPartnerImport',
									rid: 'bankQuantity',
									label: 'Bank Quantity',
									label$tr$: 'businesspartner.main.import.bankQuantity',
									type: 'integer',
									model: 'BankQuantity',
									regex: '^[+]?[1-9]*$',
									validator: validateQuantity,
									required: true,
									visible: true,
									sortOrder: 5
								}
							]
						}
					},
					ImportDescriptor: {
						DoubletFindMethods: [
							{
								Selected: false,
								Description: $translate.instant('businesspartner.main.import.DoubletFindMethod0')
							},   // 'Creditreform or D&B D-U-N-S number'},
							{
								Selected: false,
								Description: $translate.instant('businesspartner.main.import.DoubletFindMethod1')
							},   // 'TAX number'},
							{
								Selected: false,
								Description: $translate.instant('businesspartner.main.import.DoubletFindMethod2')
							},   // 'Telephone pattern'},
							{
								Selected: true,
								Description: $translate.instant('businesspartner.main.import.DoubletFindMethod3')
							}     // 'Name, Street, Zip and City'}
						],
						CustomSettings: {
							SubsidiaryQuantity: 1,
							ContactQuantity: 1,
							SupplierQuantity: 1,
							CustomerQuantity: 1,
							BankQuantity: 1
						},
						Fields: angular.copy(businessPartnerImportFields),
						BeforeMappingFields: function (parentScope) {
							let profile = basicsImportProfileService.getSelectedItem(), profileFields = profile.ImportDescriptor.Fields, newFields = profileFields;
							let currImportFields = setBusinessPartnerId(businessPartnerImportFields);
							let allFields = setAllFields(parentScope, currImportFields);
							let nextId = _.maxBy(profileFields, function (a) {
								return a.Id;
							}).Id;
							newFields = _.map(allFields, function (item) {
								let field = _.find(profileFields, {PropertyName: item.PropertyName});
								if (field) {
									item.Id = field.Id;
									return _.extend(field, item);
								} else {
									item.Id = ++nextId;
									return item;
								}
							});
							parentScope.entity.ImportDescriptor.Fields = newFields;
						}
					},
					ModifyImportDocumentPage: function (scope) {
						// scope.entity.fileFilter = '.xlsx,.zip';
						scope.entity.placeholder = $translate.instant('businesspartner.main.import.importFileTypePlaceHolder');
					},
					mapFieldValidator: mapFieldValidator,
					validateMapFields: function (grid, fields) {
						if (grid?.instance) {
							let mandatory = ['BUSINESSPARTNERNAME1'];
							let valid = true;
							let headerList = basicsImportHeaderService.getList();
							for (let field of fields) {
								let header = _.find(headerList, {description: field.MappingName});
								if (!header) { // check MappingName existed
									field.MappingName = null;
								}

								let propertyName = field.PropertyName.toUpperCase();
								if (mandatory.indexOf(propertyName) >= 0 && (!field.MappingName)) {
									let result = mapFieldValidator(field, field.MappingName, 'MappingName');
									platformRuntimeDataService.applyValidationResult(result, field, 'MappingName');
									valid = false;
								}
							}
							// seems unnecessary
							// if (!valid) {
							// 	platformGridAPI.grids.refresh(grid.id, valid);
							// }
							return valid;
						}
						return true;
					},
					HandleImportSucceed: function () {
						platformModalService.showMsgBox($translate.instant('businesspartner.main.import.importSuccessed'), 'cloud.common.informationDialogHeader', 'ico-info');
					},
					CanNext: function (parentScope) {
						return ((parentScope.currentStep.identifier === 'customsettings') &&
							(!parentScope.customEntity.BankQuantity ||
								!parentScope.customEntity.ContactQuantity ||
								!parentScope.customEntity.CustomerQuantity ||
								!parentScope.customEntity.SubsidiaryQuantity ||
								!parentScope.customEntity.SupplierQuantity)) ? false : !parentScope.isLoading && parentScope.canNext;
					}
				};

				function setBusinessPartnerId(businessPartnerImportFields) {
					let index = 0;
					let bpFields = angular.copy(businessPartnerImportFields);
					_.forEach(bpFields, function (item) {
						item.Id = index++;
					});
					return bpFields;
				}

				function validateQuantity(entity, value, model) {
					if (!value || value <= 0) {
						let message = $translate.instant('businesspartner.main.import.isRequired', {'DisplayName': model});
						$scope.canNext = false;
						return {apply: true, valid: false, error: message};
					}
					return {apply: true, valid: true, error: ''};
				}

				function setAllFields(parentScope, fields) {
					let newFields = _.filter(fields, {EntityName: 'BusinessPartner'});
					setFields(parentScope.customEntity.SubsidiaryQuantity, fields, newFields, 'Subsidiary');
					setFields(parentScope.customEntity.SupplierQuantity, fields, newFields, 'Supplier');
					setFields(parentScope.customEntity.CustomerQuantity, fields, newFields, 'Customer');
					setFields(parentScope.customEntity.ContactQuantity, fields, newFields, 'Contact');
					setFields(parentScope.customEntity.BankQuantity, fields, newFields, 'BusinessPartnerBank');
					parentScope.entity.ImportDescriptor.Fields = newFields;
					return newFields;
				}

				function setFields(quantity, fields, newFields, subString) {
					let subFields = _.filter(fields, {EntityName: subString});
					for (let i = 1; i < quantity + 1; i++) {
						let copyFields = angular.copy(subFields);
						/* jshint -W083 */
						_.forEach(copyFields, function (item) {
							item.DisplayName = item.GroupName + i + '-' + $translate.instant(item.DisplayName);
							if(subString==='BusinessPartnerBank')
							{
								subString='Bank';
							}
							item.PropertyName =  subString+ i + '_' + item.PropertyName;
							item.GroupName += i;
							item.Id = (i * 10000) + item.Id;
							newFields.push(item);
						});
					}
				}

				function mapFieldValidator(entity, value, model) {
					let mandatory = ['BUSINESSPARTNERNAME1'];
					let propertyName = entity.PropertyName.toUpperCase();
					if (model === 'MappingName' && mandatory.indexOf(propertyName) >= 0 && !value) {
						let message = $translate.instant('businesspartner.main.import.emptyErrorMessage', {'DisplayName': entity.DisplayName});
						return {apply: true, valid: false, error: message};
					}
					return {apply: true, valid: true, error: ''};
				}

				mainControllerService.registerImport(importOptions);

				platformTranslateService.registerModule('cloud.common');
				platformTranslateService.registerModule('businesspartner.main');

				let certificateDataService = certificateContainerServiceFactory.getDataService('businesspartner.main', mainService);
				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});
				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('businesspartner.main.headerGridContainerTitle'),
					parentService: mainService,
					columnConfig: [
						{documentField: 'BpdBusinessPartnerFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					],
					subModules: [
						{
							service: certificateDataService,
							title: $translate.instant('businesspartner.main.actualCertificateListContainerTitle'),
							columnConfig: [
								{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
								{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
								{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
								{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false}
							],
							otherFilter: [{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk'}]
						}
					]
				});
				// ---
				platformLayoutByDataService.registerLayout(businessPartnerMainSubsidiaryUIStandardService, businesspartnerMainSubsidiaryDataService);
				platformValidationByDataService.registerValidationService(businesspartnerMainSubsidiaryValidationService(businesspartnerMainSubsidiaryDataService), businesspartnerMainSubsidiaryDataService);
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					mainControllerService.unregisterCompletely(mainService, result, translateService, opt);
					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
				});

			}]);
})(angular);