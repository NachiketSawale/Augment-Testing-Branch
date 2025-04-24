(angular => {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.ppscostcodes';
	const ppsCostCodesModule = angular.module(moduleName);

	ppsCostCodesModule.factory('ppsCostCodesDataService', ppsCostCodesDataService);

	ppsCostCodesDataService.$inject = ['$q', '$http', '$injector',
		'platformSchemaService',
		'platformDataServiceFactory',
		'platformRuntimeDataService',
		'basicsCommonMandatoryProcessor',
		'basicsCostCodesImageProcessor',
		'ServiceDataProcessArraysExtension',
		'ppsCostCodesConstantValues'];

	function ppsCostCodesDataService($q, $http, $injector,
		platformSchemaService,
		platformDataServiceFactory,
		platformRuntimeDataService,
		basicsCommonMandatoryProcessor,
		basicsCostCodesImageProcessor,
		ServiceDataProcessArraysExtension,
		ppsCostCodesConstantValues) {
		const urlPrefix = globals.webApiBaseUrl + 'productionplanning/ppscostcodes/';
		const serviceOptions = {
			hierarchicalRootItem: {
				module: ppsCostCodesModule,
				serviceName: 'ppsCostCodesDataService',
				entityNameTranslationID: 'productionplanning.ppscostcodes.costCodes',
				httpCRUD: { route: urlPrefix },
				actions: { create: false, delete : false },
				entityRole: {
					root: {
						codeField: 'Code',
						descField: 'Description',
						itemName: 'CostCodes',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsCostCodes',
					}
				},
				dataProcessor: [ new ServiceDataProcessArraysExtension(['CostCodes']), basicsCostCodesImageProcessor ],
				presenter: {
					tree: {
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes',
						childSort: true,
						isInitialSorted: true,
						sortOptions: { initialSortColumn: { field: 'Code', id: 'code' }, isAsc: true },
					}
				},
				entitySelection: { supportsMultiSelection: true },
				translation: {
					uid: 'ppsCostCodesDataService',
					title: 'productionplanning.costcodes.costCodes',
					columns: [
						{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'},
						{header: 'basics.costcodes.description2', field: 'Description2Info'},
					]
				},
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		const service = serviceContainer.service;

		service.onPropertyChanged = function onPropertyChanged(entity, field) {
			if (field.startsWith(ppsCostCodesConstantValues.prefix)) {
				const skipFieldNewTksTimeSymbolFk = field.endsWith('NewTksTimeSymbolFk');
				validate(entity, skipFieldNewTksTimeSymbolFk);
				// remark: When the changed property is field `NewTksTimeSymbolFk`, method ppsCostCodesValidationService.validateNewTksTimeSymbolFk() has already been called for special business logic. Here we need to skip to validate field NewTksTimeSymbolFk again.
			}
		};

		/**
		 * @ngdoc function
		 * @name reactOnChangeOfItem
		 * @function Called by bulk-editor-base-service.js
		 * @methodOf ppsCostCodesDataService
		 * @description Update properties of Pps Cost Code when modified by bulk editor
		 * @param {object} entity Cost Code entity
		 * @param {string} propertyName e.g., PpsCostCode.TksTimeSymbolFk
		 * @param {boolean} isFromBulkEditor
		 * @returns {void}
		 */
		service.reactOnChangeOfItem = function reactOnChangeOfItem(entity, propertyName, isFromBulkEditor) {
			if (isFromBulkEditor && propertyName.startsWith(ppsCostCodesConstantValues.prefix)) {
				const ppsCostCodePropertyName = propertyName.split('.')[1];
				if (ppsCostCodePropertyName) {
					if (!entity.PpsCostCode) {
						entity.PpsCostCode = {};
					}
					entity.PpsCostCode[ppsCostCodePropertyName] = entity[propertyName];
				}
				service.onPropertyChanged(entity, propertyName);
			}
		};

		service.getOrCreatePpsCostCode = function getOrCreatePpsCostCode(mdcCostCode) {
			const deferred = $q.defer();
			if (mdcCostCode && isPpsCostCodeMissing(mdcCostCode)) {
				$http.get(urlPrefix + 'getorcreate?mdcCostCodeFk=' + mdcCostCode.Id).then(result => {
					mdcCostCode.PpsCostCode = Object.assign({}, result.data, { TksTimeSymbolFk : null }, mdcCostCode.PpsCostCode);
					deferred.resolve(mdcCostCode);
				});
			} else {
				deferred.resolve(mdcCostCode);
			}
			return deferred.promise;
		};

		function isPpsCostCodeMissing(entity) {
			return !entity.PpsCostCode || !entity.PpsCostCode.MdcCostCodeFk;
		}

		const mandatoryProperties = [];
		/**
		 * @ngdoc function
		 * @name validate
		 * @function
		 * @methodOf ppsCostCodesDataService
		 * @description Entrance of validation for ppsCostCodeDataService (simulate basicsCommonMandatoryProcessor)
		 * @param {object} item basics cost code with pps cost code
		 * @param {boolean} skipFieldNewTksTimeSymbolFk for judging if skips validating field NewTksTimeSymbolFk
		 * @returns {void}
		 */
		function validate(item, skipFieldNewTksTimeSymbolFk = true) {
			const validationService = $injector.get('ppsCostCodesValidationService');

			if (mandatoryProperties.length === 0) {
				const ignoreField = ['InsertedAt', 'InsertedBy', 'Version'];
				const domains = platformSchemaService.getSchemaFromCache(ppsCostCodesConstantValues.schemes.ppsCostCode).properties;
				for (let prop in domains) {
					if (Object.prototype.hasOwnProperty.call(domains, prop) && domains[prop].mandatory && !ignoreField.includes(prop)) {
						if (prop === 'TksTimeSymbolFk') {
							mandatoryProperties.push('NewTksTimeSymbolFk');
						} else {
							mandatoryProperties.push(prop);
						}
					}
				}
			}

			let tmpProperties = skipFieldNewTksTimeSymbolFk ? mandatoryProperties.filter(prop => prop !== 'NewTksTimeSymbolFk') : mandatoryProperties;
			tmpProperties.forEach(prop => {
				let result = true;
				const syncProp = 'validate' + prop;
				const asyncProp = 'asyncValidate' + prop;

				if (validationService[syncProp]) {
					result = validationService[syncProp](item, item.PpsCostCode[prop], prop);
					result.model = ppsCostCodesConstantValues.prefix + '.' + result.model;
					showUIErrorHint(result, item, result.model);
				}

				if (isPpsCostCodeMissing(item) && validationService[asyncProp]) {
					validationService[asyncProp].call(this, item, item.PpsCostCode[prop], prop, true).then(result => {
						result.model = ppsCostCodesConstantValues.prefix + '.' + result.model;
						showUIErrorHint(result, item, result.model);
					});
				}
			});
		}

		function showUIErrorHint(result, item, model) {
			if (result === false || (!!result && result.valid === false) ||
				result === true || (!!result && result.valid === true)) {
				platformRuntimeDataService.applyValidationResult(result, item, model);
				service.gridRefresh();
			}
		}

		return service;
	}
})(angular);