/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonBoqCreationService', ['_', 'salesCommonBaseBoqLookupService',
		function (_, salesCommonBaseBoqLookupService) {

			function initBaseBoqLookupService(projectId, itemsCallback) {
				// Initialize base boq lookup service
				salesCommonBaseBoqLookupService.setCurrentProject(projectId);
				salesCommonBaseBoqLookupService.setCurrentlyLoadedItemsCallback(itemsCallback);
			}

			function createNextFreeBoqNumber(baseBoqLookupService) {
				// Increment the reference number of the boq root item
				return baseBoqLookupService.getSalesBaseBoqList(true).then(function (baseBoqs) {

					var convertibleReferences = _.map(baseBoqs, 'BoqRootItem').filter(function (item) {
						return /^\d+$/.test(item.Reference); // Make sure we only take the references that can be converted to integers
					});

					var convertedReferences = _.map(convertibleReferences, function (item) {
						return parseInt(item.Reference, 10); // Convert the strings to integers
					});

					var maxReference = (convertedReferences.length === 0) ? null : _.max(convertedReferences);
					if (maxReference) {
						maxReference = (maxReference + 1).toString();
					}

					var reference = maxReference || '1';
					return reference;
				});
			}

			var service = {
				initBaseBoqLookupService: initBaseBoqLookupService,
				createNextFreeBoqNumber: createNextFreeBoqNumber
			};

			return service;

		}]);

	salesCommonModule.factory('salesCommonBoqCreationDialogService', ['_', '$q', '$injector', 'globals', '$translate', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'platformDataValidationService', '$http', 'salesCommonBoqCreationService', 'salesCommonBaseBoqLookupService', 'platformDialogService',
		function (_, $q, $injector, globals, $translate, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, platformDataValidationService, $http, salesCommonBoqCreationService, salesCommonBaseBoqLookupService, platformDialogService) {

			var readOnlyFields = ['Reference'];
			var currentlyLoadedSalesBoqs = [];

			// noinspection JSUnusedLocalSymbols
			function validateBaseBoqReference(entity, value) {
				salesCommonBaseBoqLookupService.getSalesBaseBoqList().then(function (baseBoqs) {
					var basePrcBoqExtended = _.find(baseBoqs, {Id: value});
					if (angular.isDefined(basePrcBoqExtended) && (basePrcBoqExtended !== null)) {
						var baseBoqReference = basePrcBoqExtended.BoqRootItem.Reference;
						var baseBoqBriefInfo = {Translated: basePrcBoqExtended.BoqRootItem.BriefInfo.Translated};

						// Based on the base boq reference we set the initial reference for the version boq that's to be created
						initDataItem.Reference = baseBoqReference;
						initDataItem.BriefInfo = baseBoqBriefInfo;

						if (_.isObject(initDataItem.BriefInfo) && _.isString(initDataItem.BriefInfo.Translated)) {
							initDataItem.BriefInfo.Modified = true; // To force saving of BriefInfo
						}

						readOnlyRefenceAndBriefInfo(true);

						// if BoqRootItem.Reference is set readOnly, then should remove BoqRootItem.Reference's validate error
						platformRuntimeDataService.applyValidationResult(true, initDataItem, 'Reference');
					} else {
						readOnlyRefenceAndBriefInfo(false);

						// Reset values to defaults
						service.resetToDefault();
					}
				});
				return true;
			}

			// set readOnly to BoqRootItem.Reference And BoqRootItem.BriefInfo when select a BaseBoqReference
			function readOnlyRefenceAndBriefInfo(readOnly) {
				readOnlyFields.forEach(function (field) {
					platformRuntimeDataService.readonly(initDataItem, [{
						field: field,
						readonly: readOnly
					}]);
				});
			}

			function isReferenceUnique(reference) {
				var foundItem = _.find(currentlyLoadedSalesBoqs, function (item) {
					if (angular.isDefined(item) && (item !== null)) {
						return item.BoqRootItem.Reference === reference;
					}

					return false;
				});

				return angular.isUndefined(foundItem) || (foundItem === null);
			}

			function validateReference(entity, value) {
				// In this context the validation of the reference means to check if there is already a boq root item
				// that has the same reference set. If so this is an error. The enterered reference must be unique.
				var result = true;

				if (!isReferenceUnique(value)) {
					result = platformDataValidationService.createErrorObject('sales.common.salesBoqReferenceUniqueError');
				}

				return result;
			}

			var service = {},
				frameworkData = {},
				// default item init values
				initDataItem = {},
				ctrlStates = {};

			service.boqCreationGroupSelection = function boqCreationGroupSelection() {
				// radio buttons enable/disable logic
				if (!_.isNil(frameworkData.WicGroupId) || !_.isNil(frameworkData.WicBoqId)) {
					frameworkData.creationType = 2;
					ctrlStates.disabledBaseBoqRadio = true;
					ctrlStates.disabledCreateNewBoq = true;
					ctrlStates.disabledUseWicGroup = false;
					if (!_.isNil(frameworkData.WicGroupId)) {
						ctrlStates.disabledWicGroup = true;
					}
					if (!_.isNil(frameworkData.WicBoqId)) {
						ctrlStates.disabledWicBoq = true;
					}
				} else if (frameworkData.creationType === 3) {
					ctrlStates.disabledUseWicGroup = true;
					ctrlStates.disabledWicGroup = true;
					ctrlStates.disabledWicBoq = true;
				} else {
					frameworkData.creationType = 3;
					ctrlStates.disabledUseWicGroup = true;
					ctrlStates.disabledBaseBoqRadio = false;
				}
			};

			service.resetToDefault = function (clearPropertiesFirst) {

				if (clearPropertiesFirst) {
					// Clear all properties first.
					// This is mainly done to clear the readonly settings done by the platformRuntimeDataService.
					for (var prop in initDataItem) {
						if (_.has(initDataItem, prop)) {
							delete initDataItem[prop];
						}
					}
				}

				// Set the properties to default values
				initDataItem.BaseBoqReference = '';
				initDataItem.Reference = '';
				initDataItem.BriefInfo = { Description: '', Translated: '', Modified :true};
				initDataItem.BasCurrencyFk = null;

				// framework data default values
				// 1: takeOverEntireBoq, 2: takeOverBoqHeaderOnly
				frameworkData.takeOverOption = 1;
				// 1: base boq, 2: wic boq, 3: new boq
				frameworkData.creationType = null;

				frameworkData.BasCurrencyFk = null;
				frameworkData.BoqHeaderId = null;
				frameworkData.WicGroupId = null;
				frameworkData.WicBoqId = null;

				// state of controls (visible/hidden + disabled/enabled)
				ctrlStates.showBaseBoq = false;
				ctrlStates.disabledUseBaseBoq = false;
				ctrlStates.disabledBaseBoqRadio = false;
				ctrlStates.disabledUseWicGroup = false;
				ctrlStates.disabledCreateNewBoq = false;
				ctrlStates.disabledWicGroup = false;
				ctrlStates.disabledWicBoq = false;
				ctrlStates.reference = {
					disabled: function () {
						return frameworkData.creationType === 1 || frameworkData.creationType === 2;
					}
				};
				ctrlStates.briefInfo = {
					disabled: function () {
						return frameworkData.creationType === 1 || frameworkData.creationType === 2;
					}
				};
				service.boqCreationGroupSelection();
			};
			
			service.resetToDefault();

			service.showDialog = function createSalesBoq(onCreateFn, salesBoqService/* , readOnlyRows */) {

				var validateDataItem = function () {
					var dataItem = modalOptions.dataItem;
					return !_.isEmpty(dataItem.Reference)
						&& isReferenceUnique(dataItem.Reference)
						&& _.includes([1, 2, 3], frameworkData.creationType);
				};

				var modalOptions = {
					headerText$tr$: 'sales.common.createSalesBoqTitle',
					width: '700px',
					showOkButton: true,
					showCancelButton: true,
					dataItem: initDataItem,
					itemValue: frameworkData,
					ctrlStates: ctrlStates,  // TODO: find better name?
					baseBoq: {
						onChange: function () {
							validateBaseBoqReference(null, modalOptions.dataItem.BaseBoqReference);
						}
					},
					// TODO: use onCreationTypeChange() instead? => check
					onChangeBaseBoq: {
						onBaseBoqChange: function () {
							modalOptions.ctrlStates.showBaseBoq = true;
							modalOptions.ctrlStates.disabledCreateNewBoq = false;
							initDataItem.Reference = '';
							initDataItem.BriefInfo = {Description: '', Translated: '', Modified: true};
						}
					},
					onChangeCreateNewBoq: {
						onCreateNewBoqChange: function () {
							modalOptions.ctrlStates.showBaseBoq = false;
							modalOptions.ctrlStates.disabledUseBaseBoqRadio = false;
							initDataItem.Reference = modalOptions.dataItem.reference;
						}
					},
					lookupOptions: {
						Project: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								initValueField: 'ProjectFk',
								showClearButton: false,
								filterKey: 'sales-common-project-filterkey',
								readOnly: true,
							},
						},
						baseBoq: {
							lookupDirective: 'sales-common-base-boq-lookup',
							descriptionMember: 'BoqRootItem.BriefInfo.Translated',
							validator: validateBaseBoqReference,
							lookupOptions: {
								showClearButton: true,
								filterKey: 'sales-common-base-boq-filter',
								onDataRefresh: function ($scope) {
									salesCommonBaseBoqLookupService.refresh().then(function (data) {
										$scope.refreshData(data);
									});
								},
							},
						},
						wicGroup: {
							lookupDirective: 'basics-lookup-data-by-custom-data-service',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								valueMember: 'Id',
								displayMember: 'Code',
								lookupModuleQualifier: 'estimateAssembliesWicGroupLookupDataService',
								dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
								showClearButton: false,
								lookupType: 'estimateAssembliesWicGroupLookupDataService',
								columns: [
									{
										id: 'Code',
										field: 'Code',
										name: 'Code',
										formatter: 'code',
										name$tr$: 'cloud.common.entityCode',
									},
									{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription',
									},
								],
								uuid: 'aee374374c634e27ba45e6e145f872ae',
								isTextEditable: false,
								treeOptions: {
									parentProp: 'WicGroupFk',
									childProp: 'WicGroups',
									initialState: 'expanded',
									inlineFilters: true,
									hierarchyEnabled: true,
								},
							},
						},
						wicBoq: {
							lookupDirective: 'prc-common-wic-cat-boq-lookup',
							descriptionMember: 'BoqRootItem.BriefInfo.Translated',
							editorOptions: {
								directive: 'prc-common-wic-cat-boq-lookup',
								lookupOptions: {
									additionalColumns: true,
									displayMember: 'BoqRootItem.Reference',
									descriptionMember: 'BoqRootItem.BriefInfo.Translated',
									addGridColumns: [
										{
											id: 'briefinfo',
											field: 'BoqRootItem.BriefInfo.Translated',
											name: 'Description',
											formatter: 'description',
											width: 150,
											name$tr$: 'cloud.common.entityDescription',
										},
									],
									filterKey: 'prc-con-wic-cat-boq-filter',
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcWicCatBoqs',
								displayMember: 'BoqRootItem.Reference',
								descriptionMember: 'BoqRootItem.BriefInfo.Translated',
								pKeyMaps: [
									{pkMember: 'BoqWicCatFk', fkMember: 'BoqWicCatFk'},
								],
							},
						},
						reference: {
							validator: validateReference
						}
					},
					resizeable: true,
					buttons: [{
						id: 'ok',
						disabled: function (/* info */) {
							return !validateDataItem();
						}
					}],
					bodyTemplateUrl: 'sales.common/partials/sales-common-create-boq-dialog.html',
				};

				service.resetToDefault(true); // Clear the initDataItem and set its properies to default values

				currentlyLoadedSalesBoqs = salesBoqService.getList();

				var salesHeaderService = salesBoqService.parentService() || null;
				var selectedSalesHeader = salesHeaderService !== null ? salesHeaderService.getSelected() : null;

				if (selectedSalesHeader !== null) {
					// Initialize base boq lookup service
					salesCommonBoqCreationService.initBaseBoqLookupService(selectedSalesHeader.ProjectFk, salesBoqService.getList);

					salesCommonBoqCreationService.createNextFreeBoqNumber(salesCommonBaseBoqLookupService).then(function (reference) {
						initDataItem.Reference = reference;
					});
					// get Header Boq Data
					var headerBoqData = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('PrcWicCatBoqs', selectedSalesHeader.BoqWicCatBoqFk);
					// add project info
					initDataItem.ProjectFk = selectedSalesHeader.ProjectFk;
					// add WIC BoQ
					frameworkData.WicGroupId = selectedSalesHeader.BoqWicCatFk;
					frameworkData.WicBoqId = selectedSalesHeader.BoqWicCatBoqFk;
					frameworkData.BoqWicCatFk = selectedSalesHeader.BoqWicCatFk;
					frameworkData.BasCurrencyFk = selectedSalesHeader.CurrencyFk;
					frameworkData.BoqHeaderId = _.has(headerBoqData, 'BoqRootItem.BoqHeaderFk') ? headerBoqData.BoqRootItem.BoqHeaderFk : null;
					service.boqCreationGroupSelection();
				}

				return platformDialogService.showDialog(modalOptions).then(function (result) {
					if (result.ok) {
						// WIC Boq?
						if (modalOptions.itemValue.creationType === 2) {
							var data = modalOptions.itemValue;
							let creationData = {
								getCreationType: function () {
									return 'wicboq';
								},
								BasCurrencyFk: data.BasCurrencyFk,
								BoqHeaderId: data.BoqHeaderId,
								WicGroupId: data.WicGroupId,
								WicBoqId: data.WicBoqId,
								TakeOverOption:data.takeOverOption
							};
							if (_.isFunction(onCreateFn)) {
								onCreateFn(creationData);
							}
						} else {
							var newSalesBoq = modalOptions.dataItem;
							let creationData = {
								Reference: newSalesBoq.Reference,
								BriefInfo: newSalesBoq.BriefInfo,
							};
							if (_.isFunction(onCreateFn)) {
								onCreateFn(creationData);
							}
						}
					}
				});
			};

			return service;

		}]);
})();
