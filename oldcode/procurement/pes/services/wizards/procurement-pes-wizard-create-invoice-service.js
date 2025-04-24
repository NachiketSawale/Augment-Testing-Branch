/**
 * Created by lvy on 12/16/2019.
 */
(function(angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular, _ */
	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesWizardCreateInvoiceService', procurementPesWizardCreateInvoiceService);

	procurementPesWizardCreateInvoiceService.$inject = [
		'_',
		'platformDataServiceFactory',
		'platformRuntimeDataService',
		'procurementPesWizardCreateInvoiceValidationService',
		'procurementPesWizardCreateInvoiceUIService',
		'platformLayoutByDataService',
		'platformValidationByDataService',
		'platformDataServiceValidationErrorHandlerExtension',
		'platformModuleStateService',
		'platformModalFormConfigService',
		'procurementContextService',
		'basicsLookupdataLookupFilterService'
	];
	function procurementPesWizardCreateInvoiceService(
		_,
		platformDataServiceFactory,
		platformRuntimeDataService,
		validationService,
		uiService,
		platformLayoutByDataService,
		platformValidationByDataService,
		platformDataServiceValidationErrorHandlerExtension,
		platformModuleStateService,
		platformModalFormConfigService,
		procurementContextService,
		basicsLookupdataLookupFilterService) {
		var localCache = [];
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementPesWizardCreateInvoiceService',
			httpRead: {
				useLocalResource: true,
				resourceFunction: function (){
					return localCache;
				}
			},
			presenter: {
				list: {
				}
			},
			entitySelection: {
				supportsMultiSelection: true
			},
			modification: {},
			entityRole: {
				root: {
					itemName: 'procurementPesWizardCreateInvoice', moduleName: 'procurementPesWizardCreateInvoice'
				}
			},
			actions: {
				delete: false,
				create: 'flat'
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		var validator = validationService(serviceContainer.service);
		service.createItemsFromPes = createItemsFromPes;
		service.getformConfig = getformConfig;
		service.parentService = function() { return null; };

		platformLayoutByDataService.registerLayout(uiService, service);
		platformValidationByDataService.registerValidationService(validationService, service);

		let filters = [
			{
				key: 'pes-create-invoice-configuration-filter',
				serverSide: true,
				fn: function (currentItem) {
					return 'RubricFk = ' + procurementContextService.invoiceRubricFk + 'And PrcConfigHeaderFk=' + currentItem.PrcConfigHeaderFk;
				}
			}, {
				key: 'pes-create-invoice-invType-filter',
				serverKey: 'prc-invoice-invType-filter',
				serverSide: true,
				fn: function (currentItem) {
					if (currentItem) {
						return 'Sorting > 0 And RubricCategoryFk=' + currentItem.RubricCategoryFk;
					}
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		return service;

		function createItemsFromPes(pesArr) {
			_.forEach(pesArr, function (item) {
				if (data.onCreateSucceeded) {
					var resOfCode = validator.validateCode(item, item.Code, 'Code');
					var resOfReference = validator.validateReference(item, item.Reference, 'Reference');
					var resOfInvType = validator.validateInvTypeFk(item, item.InvTypeFk, 'InvTypeFk');
					showUIErrorHint(resOfCode, item, 'Code');
					showUIErrorHint(resOfReference, item, 'Reference');
					showUIErrorHint(resOfInvType, item, 'InvTypeFk');
				}
			});
			var modState = platformModuleStateService.state(service.getModule(), service);
			var issues = platformDataServiceValidationErrorHandlerExtension.getValidationIssues(modState.validation.issues);
			var config = {
				dialogOptions: {
					message: 'basics.common.validation.correctValidationErrors'
				},
				items: []
			};
			config.items = issues;
			platformModalFormConfigService.setConfig(config);
		}

		function getformConfig() {
			var formConfig = uiService.getStandardConfigForDetailView();
			if (formConfig.rows.length) {
				_.forEach(formConfig.rows, function (row) {
					var rowModel = row.model.replace(/\./g, '$');
					var syncName = 'validate' + rowModel;
					var asyncName = 'asyncValidate' + rowModel;
					if (validator[syncName]) {
						row.validator = validator[syncName];
					}
					if (validator[asyncName]) {
						row.asyncValidator = validator[asyncName];
					}
				});
			}
			return formConfig;
		}

		function showUIErrorHint(result, item, model) {
			if(result === false || (!!result && result.valid === false) ||
				result === true || (!!result && result.valid === true)) {
				platformRuntimeDataService.applyValidationResult(result, item, model);
			}
		}
	}

	angular.module(moduleName).factory('procurementPesWizardCreateInvoiceValidationService',
		['$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'procurementInvoiceNumberGenerationSettingsService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, platformDataValidationService, platformRuntimeDataService, procurementInvoiceNumberGenerationSettingsService, basicsLookupdataLookupDescriptorService) {
				return function (dataService) {
					var service = {};
					service.validateCode = function validateCode(entity, value, model) {
						var result = {apply: true, valid: true};
						if ((angular.isUndefined(value) || value === null || value === '') && !entity.isCannotCreate) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						return result;
					};
					service.validateReference = function validateReference(entity, value, model) {
						var result = {apply: true, valid: true};
						if ((angular.isUndefined(value) || value === null || value === '') && !entity.isCannotCreate) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						return result;
					};
					service.validatePrcConfigFk = function validatePrcConfigFk(entity, value) {
						let result = {apply: true, valid: true};
						let prcConfigs = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');
						let prcConfig = prcConfigs ? _.find(prcConfigs, {Id: value}) : null;
						if (prcConfig) {
							entity.RubricCategoryFk = prcConfig.RubricCategoryFk;
							rubricCategoryFkChanged(entity, entity.RubricCategoryFk);
						}
						return result;
					};
					service.validateInvTypeFk = function validateInvTypeFk(entity, value, model) {
						let result = {apply: true, valid: true};
						if (!value) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};
					function rubricCategoryFkChanged(entity, value) {
						/* reset invType by rubricCategory */
						entity.InvTypeFk = null;
						let invTypes = basicsLookupdataLookupDescriptorService.getData('InvType');
						if (!_.isEmpty(invTypes)) {
							let invTypesGrp = _.groupBy(invTypes, 'RubricCategoryFk');
							let sameRbTypes = invTypesGrp[value];
							if (sameRbTypes && sameRbTypes.length) {
								let defaultType = _.find(sameRbTypes, {IsDefault: true});
								entity.InvTypeFk = defaultType ? defaultType.Id : (_.orderBy(sameRbTypes, 'Id'))[0].Id;
							}
						}
						service.validateInvTypeFk(entity, entity.InvTypeFk, 'InvTypeFk');

						/* reset code by rubricCategory */
						entity.Code = procurementInvoiceNumberGenerationSettingsService.provideNumberDefaultText(value, '');
						let codeReadonly = procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
						service.validateCode(entity, entity.Code, 'Code');
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: codeReadonly}]);
					}

					return service;
				};
			}
		]);

	angular.module(moduleName).factory('procurementPesWizardCreateInvoiceUIService',
		[function() {

			var formConfig = {
				'fid': 'pes.wizard.createInvoice',
				'version': '1.1.0',
				showGrouping: false,
				title$tr$: '',
				'groups': [
					{
						'gid': 'CreateInvoiceInfo',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'InvoiceNo',
						'gid': 'CreateInvoiceInfo',
						'label$tr$': 'procurement.invoice.header.reference',
						'type': 'code',
						'directive': 'text',
						'model': 'Reference'
					},
					{
						'rid': 'InvoiceCode',
						'gid': 'CreateInvoiceInfo',
						'label$tr$': 'procurement.invoice.header.code',
						'type': 'code',
						'directive': 'text',
						'model': 'Code'
					},
					{
						'rid': 'PrcConfigFk',
						'gid': 'CreateInvoiceInfo',
						'label$tr$': 'procurement.invoice.header.configuration',
						'type': 'directive',
						'model': 'PrcConfigFk',
						'directive': 'basics-configuration-configuration-combobox',
						'options': {
							filterKey: 'pes-create-invoice-configuration-filter'
						}
					},
					{
						'rid': 'InvTypeFk',
						'gid': 'CreateInvoiceInfo',
						'label$tr$': 'cloud.common.entityType',
						'type': 'directive',
						'model': 'InvTypeFk',
						'directive': 'procurement-invoice-type-lookup',
						'options': {
							filterKey: 'pes-create-invoice-invType-filter'
						}
					},
					{
						'rid': 'DateInvoiced',
						'gid': 'CreateInvoiceInfo',
						'label$tr$': 'procurement.invoice.header.dateInvoiced',
						'type': 'dateutc',
						'model': 'DateInvoiced',
						'formatter': 'dateutc'
					}
				]
			};

			return {
				getStandardConfigForDetailView: getStandardConfigForDetailView
			};

			// //////////////////
			function getStandardConfigForDetailView() {
				return formConfig;
			}
		}]);

})(angular);