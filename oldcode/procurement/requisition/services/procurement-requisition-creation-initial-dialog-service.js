/**
 * Created by chi on 2023/07/24
 */

(function (angular) {
	'use strict';
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).service('procurementRequisitionCreationInitialDialogService', procurementRequisitionCreationInitialDialogService);

	procurementRequisitionCreationInitialDialogService.$inject = ['$q', '$http', '$injector', '$translate', '$timeout', '_',
		'basicsLookupdataLookupDataService', 'cloudDesktopPinningContextService', 'ServiceDataProcessDatesExtension',
		'SchedulingDataProcessTimesExtension', 'platformLayoutByDataService', 'platformTranslateService',
		'platformValidationByDataService', 'procurementRequisitionHeaderReadonlyProcessor',
		'platformDataValidationService', 'platformRuntimeDataService', 'globals'];

	function procurementRequisitionCreationInitialDialogService($q, $http, $injector, $translate, $timeout, _,
		basicsLookupdataLookupDataService, cloudDesktopPinningContextService, ServiceDataProcessDatesExtension,
		SchedulingDataProcessTimesExtension, platformLayoutByDataService, platformTranslateService,
		platformValidationByDataService, procurementRequisitionHeaderReadonlyProcessor,
		platformDataValidationService, platformRuntimeDataService, globals) {

		this.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout, conf, data) {

			dlgLayout.title = $translate.instant('procurement.requisition.requisitionCreateDialogTitle');
			let formLayout = platformLayoutByDataService.provideLayoutFor(data.getImplementedService());
			let validationService = platformValidationByDataService.getValidationServiceByDataService(data.getImplementedService());
			let columns = conf.ColumnsForCreateDialog;

			let addressCol = _.find(columns, function (col) {
				return col.PropertyName === 'AddressFk' && col.ShowInWizard === 'true';
			});

			let prcHeaderCol = _.find(columns, function (col) {
				return col.PropertyName === 'PrcHeaderFk' && col.ShowInWizard === 'true';
			});

			let addressIndex = addressCol ? _.indexOf(columns, addressCol) : -1;
			let prcHeaderIndex = prcHeaderCol ? _.indexOf(columns, prcHeaderCol) : -1;
			let layoutTemp = {
				rows: []
			};
			if (addressIndex > -1) {
				let address = _.find(formLayout.rows, { model: 'AddressEntity' });
				if (address) {
					let newAddress = provideFieldLayout(address, addressIndex, validationService);
					if (addressCol.IsReadonly === 'true') {
						newAddress.readonly = true;
					}
					if (addressCol.IsMandatory === 'true') {
						newAddress.required = true;
					}
					layoutTemp.rows.push(newAddress);
					dlgLayout.formConfiguration.rows.splice(addressIndex, 0, newAddress);
					dlgLayout.formConfiguration.groups[0].attributes.push(address.rid);
				}
			}

			if (prcHeaderIndex > -1) {
				_.forEach(formLayout.rows, function (row) {
					if (!row.model) {
						return;
					}
					let models = row.model.split('.');
					if (models.length < 2 || models[0] !== 'PrcHeaderEntity' || models[1] !== 'ConfigurationFk') {
						return;
					}
					let newPrcHeader = provideFieldLayout(row, prcHeaderIndex, validationService);
					if (prcHeaderCol.IsReadonly === 'true') {
						newPrcHeader.readonly = true;
					}
					switch (models[1]) {
						case 'ConfigurationFk':
							newPrcHeader.asyncValidator = validationService.asyncValidateDialogConfigurationFk;
							delete newPrcHeader.validator;
							break;
						// case 'StructureFk':
						// newPrcHeader.validator = validationService.validateDialogStructureFk;
						// break;
						default:
							break;
					}

					layoutTemp.rows.push(newPrcHeader);
					dlgLayout.formConfiguration.rows.splice(prcHeaderIndex++, 0, newPrcHeader);
					dlgLayout.formConfiguration.groups[0].attributes.push(newPrcHeader.rid);
				});
			}

			dlgLayout.formConfiguration.rows = dlgLayout.formConfiguration.rows.filter(function (row) {
				return row.rid !== 'PackageDuration' && row.rid !== 'TextInfo';
			});

			if (layoutTemp.rows.length > 0) {
				platformTranslateService.translateFormConfig(layoutTemp);
			}

			let projectRow = _.find(dlgLayout.formConfiguration.rows, { model: 'ProjectFk' });
			if (projectRow) {
				if (angular.isFunction(projectRow.validator)) {
					projectRow.validator = validationService.validateDialogProjectFk;
				}
			}

			let bpRow = _.find(dlgLayout.formConfiguration.rows, { model: 'BusinessPartnerFk' });
			if (bpRow) {
				if (angular.isFunction(bpRow.validator)) {
					bpRow.validator = validationService.validateDialogBusinessPartnerFk;
				}
			}

			let packageRow = _.find(dlgLayout.formConfiguration.rows, { model: 'PackageFk' });
			if (packageRow) {
				if (angular.isFunction(packageRow.validator)) {
					packageRow.validator = validationService.validateDialogPackageFk;
				}
			}

			let reqHeaderRow = _.find(dlgLayout.formConfiguration.rows, { model: 'ReqHeaderFk' });
			if (reqHeaderRow) {
				if (angular.isFunction(reqHeaderRow.validator)) {
					reqHeaderRow.validator = validationService.validateDialogReqHeaderFk;
				}
			}

			let taxCodeRow = _.find(dlgLayout.formConfiguration.rows, { model: 'TaxCodeFk' });
			if (taxCodeRow) {
				if (angular.isFunction(taxCodeRow.validator)) {
					taxCodeRow.validator = validationService.validateDialogTaxCodeFk;
				}
			}

			let dateRequiredRow = _.find(dlgLayout.formConfiguration.rows, { model: 'DateRequired' });
			if (dateRequiredRow) {
				if (angular.isFunction(dateRequiredRow.validator)) {
					dateRequiredRow.validator = validationService.validateDialogDateRequired;
				}
			}

			let paymentTermFiRow = _.find(dlgLayout.formConfiguration.rows, { model: 'BasPaymentTermFiFk' });
			if (paymentTermFiRow) {
				delete paymentTermFiRow.validator;
				delete paymentTermFiRow.asyncValidator;
			}

			let paymentTermPaRow = _.find(dlgLayout.formConfiguration.rows, { model: 'BasPaymentTermPaFk' });
			if (paymentTermPaRow) {
				delete paymentTermPaRow.validator;
				delete paymentTermPaRow.asyncValidator;
			}

			let dateEffectiveRow = _.find(dlgLayout.formConfiguration.rows, { model: 'DateEffective' });
			if (dateEffectiveRow) {
				delete dateEffectiveRow.validator;
				delete dateEffectiveRow.asyncValidator;
			}

			_.forEach(dlgLayout.formConfiguration.rows, function (row) {
				if (row.required) {
					row.validator = rebuildValidator(row.validator, data, validationService);
				}
			});

			dlgLayout.dialogOptions = {
				disableOkButton: function disableOkButton() {
					let hasErrors = platformDataValidationService.hasErrors(data.getImplementedService());
					if (!hasErrors) {
						_.forEach(dlgLayout.formConfiguration.rows, function(row) {
							if(!hasErrors && row && row.required) {
								hasErrors = hasErrors || platformRuntimeDataService.hasError(dlgLayout.dataItem, row.model);
							}
						});
					}

					return hasErrors;
				}
			};

			dlgLayout.handleCancel = function () {
				platformDataValidationService.removeDeletedEntitiesFromErrorList(dlgLayout.dataItem, data.getImplementedService());
			};

			// get default configuration
			return basicsLookupdataLookupDataService.getSearchList('PrcConfiguration', 'RubricFk = 23' + 'And IsDefault = true').then(function (result) {
				if (result && result.length > 0) {
					let validationService = $injector.get('procurementRequisitionHeaderValidationService');
					dlgLayout.dataItem.PrcHeaderEntity = {
						ConfigurationFk: 0
					};
					return validationService.asyncValidateDialogConfigurationFk(dlgLayout.dataItem, result[0].Id)
						.then(function (validResult) {
							if ((_.isBoolean(validResult) && validResult) || (validResult && angular.isDefined(validResult.apply) && validResult.apply)) {
								// get default requisition data
								dlgLayout.dataItem.PrcHeaderEntity.ConfigurationFk = result[0].Id;
								var projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
								return $http.post(globals.webApiBaseUrl + 'procurement/requisition/requisition/createrequisition', {
									ProjectFk: projectContext ? projectContext.id : null,
									ConfigurationFk: result[0].Id,
									Code: dlgLayout.dataItem.Code,
									IsCreateFromDataConfigDialog: true
								}).then(function (response) {
									if (!response || !response.data || !response.data.ReqHeaderDto) {
										return dlgLayout;
									}

									dlgLayout.dataItem = angular.extend(dlgLayout.dataItem, response.data.ReqHeaderDto);
									let processors = [];
									processors.push(new ServiceDataProcessDatesExtension(['DateReceived', 'DateCanceled', 'DateRequired','DateEffective','DeadlineDate']));
									processors.push(new SchedulingDataProcessTimesExtension(['DeadlineTime']));
									processors.push(procurementRequisitionHeaderReadonlyProcessor);
									_.forEach(processors, function (processor) {
										processor.processItem(dlgLayout.dataItem);
									});

									return dlgLayout;
								}).finally(function () {
									return dlgLayout;
								});
							}
							return dlgLayout;
						});
				}

				return dlgLayout;
			});
		};

		function provideFieldLayout(row, index, validationService) {
			let newRow = {};
			_.extend(newRow, row);
			newRow.sortOrder = index;
			newRow.gid = 'allData';

			let rowModel = row.model.replace(/\./g, '$');

			let syncName = 'validate' + rowModel;
			let asyncName = 'asyncValidate' + rowModel;

			if (validationService[syncName]) {
				newRow.validator = validationService[syncName];
			}

			if (validationService[asyncName]) {
				newRow.asyncValidator = validationService[asyncName];
			}

			return newRow;
		}

		function rebuildValidator(validator, data, validationService) {
			if (!angular.isFunction(validator)) {
				return function (entity, value, model) {
					return checkMandatory(entity, value, model, data, validationService);
				};
			}
			return function (entity, value, model) {
				let result = checkMandatory(entity, value, model, data, validationService);
				if (result.valid) {
					return validator(entity, value, model);
				}
				return result;
			};
		}

		function checkMandatory(entity, value, model, data, validationService) {
			let validation =  platformDataValidationService.isMandatory(value, model);
			platformRuntimeDataService.applyValidationResult(validation, entity, model);
			platformDataValidationService.finishValidation(validation, entity, value, model, validationService, data.getImplementedService());
			return validation;
		}
	}
})(angular);