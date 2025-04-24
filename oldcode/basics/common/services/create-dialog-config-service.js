/**
 * Created by chi on 8/13/2015. Implemented by wuj.
 */
/* jshint -W074 */
/* jshint -W072 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('basicsCommonCreateDialogConfigService', [
		'$injector', '$q', 'platformSchemaService', '$translate', 'platformTranslateService',
		'platformRuntimeDataService', 'platformDataValidationService', '_', 'globals', 'platformModuleStateService',
		'$rootScope', 'platformDialogService',
		function (
			$injector, $q, platformSchemaService, $translate, platformTranslateService, runtimeDataService,
			platformDataValidationService, _, globals, platformModuleStateService, $rootScope, platformDialogService) {
			platformTranslateService.registerModule('basics.common');
			let service = {}, formConfiguration = {}, domains;
			let self = this, layoutService, rootService, dataService, uiStandardService, validationService, creationData,
				attributes = [], dataItem = {}, defaultValues = null, detailConfig, newRow, sortOrder = 0;

			self.checkIsMandatoryProperty = function (prop) {
				if (!domains[prop].mandatory) {
					return false;
				}
				if (prop === 'Version' || prop === 'InsertedAt' || prop === 'InsertedBy' || prop === 'IsLive') {
					return false;
				}

				if (domains[prop].domain === 'boolean') {
					return false;
				}

				return !(!layoutService.overloadsMandatory || layoutService.overloadsMandatory.indexOf(prop) === -1);

			};

			self.addValidation = function (row) {
				const syncName = 'validate' + row.model;
				const asyncName = 'asyncValidate' + row.model;

				if (validationService[syncName]) {
					row.validator = validationService[syncName];
				}

				if (validationService[asyncName]) {
					row.asyncValidator = validationService[asyncName];
				}
			};

			self.getFormConfiguration = function (options) {
				formConfiguration = {
					fid: options.fid,
					version: '0.2.4',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: []
					}],
					rows: []
				};

				dataService = options.dataService;
				if (angular.isString(dataService)) {
					dataService = $injector.get(dataService);
				}

				rootService = options.rootService;
				if (angular.isString(rootService)) {
					rootService = $injector.get(rootService);
				}

				uiStandardService = options.uiStandardService;
				if (angular.isString(uiStandardService)) {
					uiStandardService = $injector.get(uiStandardService);
				}

				detailConfig = uiStandardService.getStandardConfigForDetailView();

				validationService = options.validationService;
				if (angular.isString(validationService)) {
					validationService = $injector.get(validationService);
				}

				if (detailConfig.addValidationAutomatically && validationService) {
					_.forEach(detailConfig.rows, function (row) {
						self.addValidation(row);
					});

					if (options.rows) {
						_.forEach(options.rows, function (row) {
							self.addValidation(row.config);
						});
					}
				}

				if (options.creationData) {
					creationData = options.creationData;
				}

				if (!options.attributes) {
					if (!options.typeName || !options.moduleSubModule || !options.layoutService) {
						return;
					}

					domains = platformSchemaService.getSchemaFromCache({
						typeName: options.typeName,
						moduleSubModule: options.moduleSubModule
					}).properties;

					attributes = [];
					layoutService = options.layoutService;
					if (angular.isString(layoutService)) {
						layoutService = $injector.get(layoutService);
					}

					for (let prop in domains) {
						if (Object.prototype.hasOwnProperty.call(domains, prop) && self.checkIsMandatoryProperty(prop)) {
							attributes.push(prop);
						}
					}
					angular.forEach(layoutService.groups, function (group) {
						angular.forEach(group.attributes, function (attribute) {
							angular.forEach(attributes, function (property) {
								if (property.toLowerCase() === attribute) {
									formConfiguration.groups[0].attributes.push(attribute);
									self.initRows(property);
								}
							});
						});
					});
				} else {
					attributes = options.attributes;
					for (let attr in attributes) {
						if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
							if (attributes[attr].isDisableShow) {
								self.setDateItemAttribute(attr);
							} else {
								formConfiguration.groups[0].attributes.push(attr.toLowerCase());
								self.initRows(attr, options.rows);
							}
						}
					}
				}

				if (options.readOnlyProcessor) {
					options.readOnlyProcessor.processItem(dataItem);
				}

				return formConfiguration;
			};

			self.addRow = function (row) {
				sortOrder++;
				newRow = angular.copy(row);
				newRow.gid = formConfiguration.groups[0].gid;
				newRow.sortOrder = sortOrder;
				formConfiguration.rows.push(newRow);
			};

			self.initRows = function (attribute, rows) {
				self.setDateItemAttribute(attribute);
				let hasAdded = false;
				angular.forEach(detailConfig.rows, function (row) {
					if (row.rid === attribute.toLowerCase()) {
						self.addRow(row);
						hasAdded = true;
					}
				});

				if (!hasAdded && rows) {
					angular.forEach(rows, function (row) {
						if (row.attribute && row.config && row.attribute.toLowerCase() === attribute.toLowerCase()) {
							self.addRow(row.config);
						}
					});
				}
			};

			self.setDateItemAttribute = function (attribute) {
				if (!domains) {
					if (defaultValues && defaultValues[attribute]) {
						dataItem[attribute] = defaultValues[attribute];
					} else {
						dataItem[attribute] = null;
					}
					return;
				}

				switch (domains[attribute].domain) {
					case 'numeric':
					case 'integer':
					case 'lookup':
						dataItem[attribute] = 0;
						break;
					case 'string':
					case 'translation':
						dataItem[attribute] = '';
						break;
					default :
						dataItem[attribute] = null;
						break;
				}

				if (defaultValues && defaultValues[attribute]) {
					dataItem[attribute] = defaultValues[attribute];
				}
			};

			self.getCreateDialogConfig = function (options) {
				return {
					title: $translate.instant(options.title),
					dataItem: dataItem,
					formConfiguration: self.getFormConfiguration(options),
					handleOK: function handleOK(result) {
						const creationData = result.data;
						let canCreate = true;

						for (let attr in attributes) {
							if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
								if (!creationData[attr] && attributes[attr].mandatory && attributes[attr].required !== false) {
									canCreate = false;
									break;
								}
							}
						}

						if (options.containerData && canCreate) {
							options.containerData.doCallHTTPCreate(creationData, options.containerData, options.containerData.onCreateSucceeded);
						}
					}
				};
			};

			self.showCreateDialog = function showCreateDialog() {
				function calcDialogWidth() {
					if (dialogConfig.width) {
						return dialogConfig.width;
					}
				}

				const dialogSettings = {
					scope: (dialogConfig.scope) ? dialogConfig.scope.$new(true) : null,
					bodyTemplateUrl: globals.appBaseUrl + 'basics.common/partials/create-dialog-template.html',
					backdrop: false,
					width: calcDialogWidth(),
					headerText: service.getDialogTitle(),
					showOkButton: true,
					showCancelButton: true
				};

				if (dataService) {
					const defer = $q.defer();
					if (_.isFunction(creationData)) {
						creationData = creationData();
					}
					dataService.createItem({}, creationData).then(function (data) {
						dataItem = dialogConfig.dataItem = data;
						self.handlerError();
						platformDialogService.showDialog(dialogSettings).then(function (result) {
							if (result.ok) {
								dataService.update().then(function () {
									defer.resolve(result);
								});
							} else {
								dataService.deleteItem(data).then(function () {
									defer.resolve(result);
								});
							}
						});
					});
					return defer.promise;
				} else {
					platformDialogService.showDialog(dialogSettings).then(function (result) {
						if (result.ok) {
							dialogConfig.handleOK(result);
						} else {
							if (dialogConfig.handleCancel) {
								dialogConfig.handleCancel(result);
							}
						}
					});
				}
			};

			let validateResult;
			self.handlerError = function () {
				for (let attr in attributes) {
					if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
						if (attributes[attr].mandatory) {
							const errParam = attributes[attr].errorParam ? {fieldName: attributes[attr].errorParam} : null;
							validateResult = platformDataValidationService.isMandatory(dataItem[attr], attr, errParam);
							runtimeDataService.applyValidationResult(validateResult, dataItem, attr);
						}
					}
				}
			};

			service.assertAllValid = function assertAllValid(scope) {
				if(!angular.isDefined(rootService)){
					return $q.when(true);
				}

				var modState = platformModuleStateService.state(rootService.getModule());
				if (modState && modState.validation) {
					return $q.all(_.map(modState.validation.asyncCalls, function (call) {
						return call.myPromise;
					})).then(function () {
						let hasError = false; //modState.validation.issues && modState.validation.issues.length > 0;
						if (scope.dataItem.__rt$data && scope.dataItem.__rt$data.errors) {
							for (let prop in scope.dataItem.__rt$data.errors) {
								if (!Object.prototype.hasOwnProperty.call(scope.dataItem.__rt$data.errors, prop)) {
									continue;
								}
								if (scope.dataItem.__rt$data.errors[prop]) {
									hasError = true;
									break;
								}
							}
						}
						return !hasError;
					});
				} else {
					return $q.when(true);
				}
			};

			/* jshint -W003 */
			let dialogConfig;
			service.showDialog = function showDialog(createDialogOptions) {
				dataItem = {};
				sortOrder = 0;
				defaultValues = createDialogOptions.defaultValues ? createDialogOptions.defaultValues : null;
				dialogConfig = self.getCreateDialogConfig(createDialogOptions);
				platformTranslateService.translateFormConfig(dialogConfig.formConfiguration);
				const result = self.showCreateDialog();
				self.handlerError();

				return result;
			};

			service.getDialogTitle = function getDialogTitle() {
				return dialogConfig.title;
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return dialogConfig ? dialogConfig.title : '';
					}, enumerable: true
				}
			});

			service.getDataItem = function getDataItem() {
				return dialogConfig.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return dialogConfig.formConfiguration;
			};

			service.getRootService = function (){
				return rootService;
			};

			return service;
		}]
	);
})(angular);
