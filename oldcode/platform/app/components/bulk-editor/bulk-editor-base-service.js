(function (angular) {
	'use strict';

	// noinspection JSValidateTypes
	angular.module('platform').service('platformBulkEditorBaseService', platformBulkEditorBaseService);

	platformBulkEditorBaseService.$inject = ['_', 'globals', 'platformModalService', 'basicsCommonRuleEditorService', 'platformBulkEditorChangeProcessorService', '$q', '$translate', '$rootScope', '$timeout', '$http', 'platformBulkEditorConfigurationService', 'platformBulkEditorReportService', 'cloudCommonFeedbackType'];

	// noinspection OverlyComplexFunctionJS
	function platformBulkEditorBaseService(_, globals, platformModalService, ruleEditorService, changeProcessorService, $q, $translate, $rootScope, $timeout, $http, configurationService, reportService, cloudCommonFeedbackType) {
		const self = this;

		// indicates if the bulkEditor is open or not
		let bulkEditorActive = false;

		let feedback;

		self.isBulkEditorActive = function isBulkEditorActive() {
			return bulkEditorActive;
		};

		function overwriteVisibleName(col, visibleGridColumns) {
			const visibleCol = _.find(visibleGridColumns, function (candidate) {
				return candidate.field === col.field;
			});

			if (!!visibleCol && !!visibleCol.userLabelName) {
				col.userLabelName = visibleCol.userLabelName;
			}
		}

		function filterInvisibleFields(col, visibleGridColumns) {
			// Do not put hidden fields in Bulk
			const visibleCol = _.find(visibleGridColumns, function (candidate) {
				return candidate.field === col.field;
			});

			if (!visibleCol) {
				col.bulkSupport = false;
			}
		}
		/**
		 *@name filterDateshiftFields
		 *@description deactivates dateshift fields by default - because bulk editor cannot handle dateshift at the moment (07/24)
		 				can be activated in the future
		 * @param { Object } itemService: Transport Requisition data service - 'transportplanningRequisitionMainService'
		 * @param { Array } props: all colums of Transport Requisition main container as objects
		 * @param { Object } vds: Registered virtual data service
		 */
		function filterDateshiftFields(itemService, props, vds) {
			const affectedEntitiesForDateshift = new Map(Object.entries(vds.getContainerData().entityMappings));
			const registeredServices = new Map(Object.entries(vds.getContainerData().registeredServices));
			let entityToFilter = new Map();
			registeredServices.forEach((value, key) => {
				const foundDataService = value.find((s) => s.serviceContainer.service === itemService);
				if (foundDataService) {
					entityToFilter.set(key, value[0]);
				}
			});

			let propertiesByFilteredEntity;
			affectedEntitiesForDateshift.forEach((val, key) => {
				if (entityToFilter.has(key)) {
					propertiesByFilteredEntity = affectedEntitiesForDateshift.get(key);
				}
			});

			// set bulkSupport = false if it is a dateshift field
			if (!propertiesByFilteredEntity) {
				return;
			} else {
				let propertiesValues = Object.values(propertiesByFilteredEntity);
				props.forEach((columnObject) => {
					let propertyFieldName = columnObject.field;
					propertiesValues.forEach((prop) => {
						if (prop === propertyFieldName) {
							columnObject.bulkSupport = false;
						}
					});
				});
			}
		}

		function processColumns(cols, visibleGridColumns) {
			return _.each(cols, (col) => {
				if (col.bulkSupport && _.isFunction(col.bulkSupport)) {
					col.bulkSupport = col.readonly !== true && col.bulkSupport() !== false && ruleEditorService.checkColumn(col);
				} else {
					col.bulkSupport = col.readonly !== true && col.bulkSupport !== false && ruleEditorService.checkColumn(col);
				}
				overwriteVisibleName(col, visibleGridColumns);
				filterInvisibleFields(col, visibleGridColumns);
			});
		}

		function setup(itemService, uiStandardService, validationService, scope, gridColumns) {
			if (itemService && uiStandardService && _.isFunction(uiStandardService.getDtoScheme)) {
				feedback.setOptions({type: cloudCommonFeedbackType.short});
				feedback.show();

				const name = getFullQualifiedName(itemService);
				const allColumnsByListViewConfig = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
				const virtualDataService = itemService && itemService.getChildServices ? itemService.getChildServices().find((services) => services.addVirtualEntities) : null;

				if (virtualDataService) {
					filterDateshiftFields(itemService, allColumnsByListViewConfig, virtualDataService);
				}
				// bulkConfig function returns a promise or array with columns
				let props = processColumns(allColumnsByListViewConfig, gridColumns);

				return ruleEditorService.getOperatorByType(4).then(function (operators) {
					// set the operators because they are needed to process the incoming rules
					ruleEditorService.setConfig({
							AvailableProperties: props, AvailableOperators: operators, RuleOperatorType: 4 // changeRules
					});
					// this line will trigger the loading and processing of the incoming rules
					return configurationService.getBulkConfiguraion(name, validationService).then(function (configs) {
						return configurationService.createBulkConfig(name, scope.selectedColumn).then(function () {
							ruleEditorService.setConfig({
								AvailableProperties: props, AvailableOperators: operators, RuleOperatorType: 4, // changeRules
								AffectedEntities: itemService.getSelectedEntities(), RuleDefinitions: configs
							});
							feedback.hide();
							return true;
						});
					});
				});
			}
			return $q.when(false);
		}

		function change(validationService, itemService, $scope, defer, gridConfig, headlessOption) {
			/*
				when serverSideBulkProcessing is true, for fields with asyncValidation the asyncValidationCall is skipped and a BulkChangeRequest is send to
				basics/common/bulk/processBulkChanges
			*/
			const serverSideBulkProcessing = _.isObject(gridConfig.bulkEditorSettings) && _.isBoolean(gridConfig.bulkEditorSettings.serverSideBulkProcessing) && gridConfig.bulkEditorSettings.serverSideBulkProcessing;
			// so domainControls can apply their values after 2secs debounce
			$timeout(function () {
				changeProcessorService.runChanges(validationService, itemService, {
					serverSide: serverSideBulkProcessing, headlessOption: headlessOption
						})
						.then(function (changes) {
							// save changed entities
							if (!serverSideBulkProcessing) {
							self.getServiceWithUpdate(itemService).update().then(function (response) {
										if (response.status !== 409 && !response.userHasStartedDataReload) {
											clear();
											loadingCallback($scope, changes, itemService, defer, response, validationService, gridConfig, headlessOption);
										} else {
											// handle ConcurrencyException!
											if (response.userHasStartedDataReload) {
												loadingCallback($scope, changes, itemService, defer, response, validationService, gridConfig, headlessOption);
											} else {
												feedback.hide();
											}
										}
									});
							} else {
								const entities = headlessOption ? headlessOption.entities : itemService.getSelectedEntities();
								let entitiesToProcess = entities && _.isArray(entities) ? entities : [entities];
							changes.forEach(change => {
								change.forEach(changeItem => {
										if (typeof changeItem.validationResult === 'boolean') {
											changeItem.validationResult = {
												Valid: changeItem.validationResult,
												Apply: changeItem.validationResult,
											Error: ''
											};
										}
									});
								});

								if (gridConfig.bulkEditorSettings.skipEntitiesToProcess) {
									entitiesToProcess = [];
								}
								// send a bulkChangeRequest
							$http.post(globals.webApiBaseUrl + 'basics/common/bulk/processBulkChanges', {
										EntitiesToProcess: entitiesToProcess,
										ChangeObjects: changes,
								FullQualifiedName: getFullQualifiedName(itemService)
							}).then(function (result) {
											clear();
											loadingCallback($scope, result.data, itemService, defer, result, validationService, gridConfig, headlessOption);
											itemService.refresh();
							}, function (reject) {
											let changes = reject.config.data.ChangeObjects;
											_.forEach(changes, function (change) {
												_.forEach(change, function (chang) {
													chang.asyncValidationResult = {
														apply: false,
														valid: false,
											error: reject.statusText
													};
													chang.isChanged = false;
												});
											});

											loadingCallback($scope, changes, itemService, defer, reject, validationService, gridConfig, headlessOption);
							});
							}
						});
			}, headlessOption ? 0 : 2000);
		}

		// noinspection OverlyComplexFunctionJS
		function loadingCallback($scope, changes, itemService, defer, response, validationService, gridConfig, headlessOption) {
			feedback.hide();
			itemService.gridRefresh();
			defer.resolve(reportService.processReport(changes, response, itemService, validationService, gridConfig, headlessOption));
		}

		self.startBulkEditor = function (itemService, uiStandardService, validationService, $scope, gridConfig, gridColumns, headlessOption) {
			let uiMgr = $scope.getUiAddOns();
			feedback = uiMgr.getFeedbackComponent();

			const modalOptions = {
				headerTextKey: 'cloud.common.bulkEditor.title',
				showCancelButton: true,
				showSaveButton: true,
				showSaveandrunButton: true,
				showRunButton: true,
				width: '700px',
				saveAndRunText: $translate.instant('platform.bulkEditor.saveAndRun'),
				runText: $translate.instant('platform.bulkEditor.run'),
				saveText: $translate.instant('platform.bulkEditor.save'),
				disableSaveButton: function () {
					return !configurationService.savePossible();
				},
				disableSaveandrunButton: function () {
					return !configurationService.savePossible();
				},
				disableRunButton: function () {
					return !configurationService.configIsValidForRun();
				},
				windowClass: 'body-flex-column',
				bodyTemplateUrl: globals.appBaseUrl + 'app/components/bulk-editor/bulk-editor-dialog-tpl.html',
				footerTemplateUrl: globals.appBaseUrl + 'app/components/bulk-editor/bulk-dialog-footer-template.html'
			};
			const defer = $q.defer();
			feedback.setOptions({loadingText: $translate.instant('platform.processing')});

			setup(itemService, uiStandardService, validationService, $scope, gridColumns).then(function (canOpen) {
				if (canOpen) {
					// close all grid editors!
					$rootScope.$emit('updateRequested', true);
					bulkEditorActive = true;
					let uiComponentResolver;
					let uiComponentArgs;
					if (headlessOption) {
						uiComponentResolver = $q.when;
						uiComponentArgs = {run: true};
					} else {
						uiComponentResolver = platformModalService.showDialog;
						uiComponentArgs = modalOptions;
					}
					return uiComponentResolver(uiComponentArgs).then(function (result) {
						feedback.setOptions({type: cloudCommonFeedbackType.long, info:$translate.instant('cloud.common.bulkEditor.infoMessage'), title: $translate.instant('cloud.common.bulkEditor.inProgress')})
						feedback.show();
							if (result.run) {
								change(validationService, itemService, $scope, defer, gridConfig, headlessOption);
							} else if (result.saveAndRun) {
								save(itemService).then(function () {
									change(validationService, itemService, $scope, defer, gridConfig);
								});
							} else if (result.save) {
								save(itemService).then(function () {
									feedback.hide();
									defer.resolve();
									clear();
								});
							}
							bulkEditorActive = false;
					}, function () {
							clear();
							bulkEditorActive = false;
					});
				}
				defer.reject();
				console.warn('Container is not suitable for using the Bulk-Editor');
			});

			return defer.promise;
		};

		self.getServiceWithUpdate = function getServiceWithUpdate(service) {
			const max = 1;

			while (!_.isFunction(service.update)) {
				if (service.isRoot || max > 10) {
					break;
				}
				service = service.parentService ? service.parentService() : service.getService().parentService();
			}
			return service;
		};

		function getFullQualifiedName(entityDataService) {
			if (!entityDataService.getItemName() || !entityDataService.getItemName()) {
				throw new Error('ItemName is required to save a Bulk Configuration');
			}
			return (entityDataService.getModule().name + '.' + entityDataService.getItemName()).toLowerCase();
		}

		function save() {
			return configurationService.update();
		}

		function clear() {
			ruleEditorService.clearRulesData();
			configurationService.clearList();
		}
	}
})(angular);
