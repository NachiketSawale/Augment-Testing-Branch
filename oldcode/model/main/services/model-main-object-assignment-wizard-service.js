/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	//noinspection JSAnnotator
	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectAssignmentWizardService
	 * @function
	 *
	 * @description Provides wizards for bulk-modifying model objects.
	 */
	angular.module('model.main').factory('modelMainObjectAssignmentWizardService', ['$http', 'platformTranslateService',
		'platformModalFormConfigService', '$translate', 'modelViewerModelSelectionService', '$injector',
		'basicsLookupdataConfigGenerator', 'platformSidebarWizardCommonTasksService',
		'basicsCostGroupCatalogConfigDataService', '$q', 'projectMainProjectSelectionService', '_',
		'basicsCostGroupLookupConfigService', 'basicsCostGroupType',
		function ($http, platformTranslateService, platformModalFormConfigService, $translate,
		          modelViewerModelSelectionService, $injector, basicsLookupdataConfigGenerator,
		          platformSidebarWizardCommonTasksService, basicsCostGroupCatalogConfigDataService, $q,
		          projectMainProjectSelectionService, _, basicsCostGroupLookupConfigService, basicsCostGroupType) {
			var service = {};

			function getCostGroupInfo() {
				function extractCommonCostGroupInfo(cg) {
					return {
						id: cg.Id,
						name: cg.DescriptionInfo.Translated
					};
				}

				var cgcSvc = basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService(projectMainProjectSelectionService.getSelectedProjectId());
				return cgcSvc.loadConfig('model.main').then(function processCompleteCostGroupConfig(cgConfig) {
					return _.concat(_.map(cgConfig.licCostGroupCats, function extractLicCostGroupInfo(cg) {
						var result = extractCommonCostGroupInfo(cg);
						result.costGroupType = basicsCostGroupType.licCostGroup;
						return result;
					}), _.map(cgConfig.prjCostGroupCats, function extractPrjCostGroupInfo(cg) {
						var result = extractCommonCostGroupInfo(cg);
						result.costGroupType = basicsCostGroupType.projectCostGroup;
						result.projectIdGetter = function () {
							return projectMainProjectSelectionService.getSelectedProjectId();
						};
						return result;
					}));
				});
			}

			function extractCostGroupAssignments(entity, extractCostGroupValue) {
				var result = [];
				if (_.isObject(entity.cg)) {
					Object.keys(entity.cg).forEach(function (cgTypeKey) {
						var cgTypeId = parseInt(cgTypeKey);
						var cgTypeGroup = entity.cg[cgTypeKey];
						Object.keys(cgTypeGroup).forEach(function (cgCatKey) {
							var cgCatId = parseInt(cgCatKey);

							var cgValue = extractCostGroupValue(cgTypeGroup[cgCatKey]);
							if (!_.isNil(cgValue)) {
								result.push({
									cgType: cgTypeId,
									cgCat: cgCatId,
									value: cgValue
								});
							}
						});
					});
				}
				return result;
			}

			/**
			 * @ngdoc method
			 * @name prepareEntity
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Prepares an object with the read-only default values to show in the wizard dialogs.
			 * @returns {Object} The object.
			 */
			function prepareEntity() {
				return {
					model: modelViewerModelSelectionService.getSelectedModel().info.getNiceName()
				};
			}

			/**
			 * @ngdoc method
			 * @name getDefaultFormFields
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Creates an array of read-only default form field definitions to show in the wizard dialogs.
			 * @returns {Array} The form field definitions.
			 */
			function getDefaultFormFields() {
				return [{
					gid: 'general',
					rid: 'model',
					model: 'model',
					label$tr$: 'model.main.model',
					readonly: true,
					type: 'description'
				}, {
					gid: 'general',
					rid: 'objSource',
					type: 'directive',
					directive: 'model-main-object-source',
					directiveOptions: {
						allowCollapse: false
					},
					model: 'objectIds',
					label$tr$: 'model.main.assignmentDest'
				}];
			}

			/**
			 * @ngdoc method
			 * @name checkSelection
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Checks whether a model is selected.
			 * @returns {Boolean} A value that indicates whether there is any selection.
			 */
			function checkSelection() {
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					return true;
				} else {
					platformSidebarWizardCommonTasksService.showErrorNoSelection('model.main.assignmentError', $translate.instant('model.main.noModelSelected'));
					return false;
				}
			}

			/**
			 * @ngdoc method
			 * @name getDefaultConfigObject
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Creates an object with default properties that are valid for all bulk assignment wizards.
			 * @param {Object} dialogData The entity object that stores the input from the dialog box.
			 * @returns {Object} An object with default properties that can be merged into the actual config object to
			 *                   transmit with a request.
			 */
			function getDefaultConfigObject(dialogData) {
				return {
					modelId: modelViewerModelSelectionService.getSelectedModelId(),
					objectIds: dialogData.objectIds.useGlobalModelIds().toCompressedString(),
					destination: 's'
				};
			}

			/**
			 * @ngdoc method
			 * @name processResponse
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Processes the response to a server request.
			 * @param {Object} response The response object.
			 */
			function processResponse(response) {
				if (response && (response.status === 200)) {
					var svc = $injector.get('modelMainObjectDataService');
					svc.refresh();
				}
			}

			/**
			 * @ngdoc method
			 * @name assignLocations
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Shows a dialog box for picking a location that will be assigned to any currently selected
			 *              model objects.
			 */
			service.assignLocations = function () {
				if (!checkSelection()) {
					return;
				}

				var entity = prepareEntity();
				var dlgConfig = {
					title: $translate.instant('model.main.assignLocations'),
					dataItem: entity,
					formConfiguration: {
						fid: 'model.main.AssignLocationModal',
						version: '0.1',
						showGrouping: false,
						groups: [{
							gid: 'general'
						}],
						rows: getDefaultFormFields().concat([
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function () {
									return modelViewerModelSelectionService.getSelectedModel().info.projectId;
								}
							}, {
								gid: 'general',
								rid: 'location',
								model: 'locationId',
								sortOrder: 1,
								label$tr$: 'model.main.entityLocation',
								type: 'integer'
							})
						])
					},
					handleOK: function handleOK(result) {
						var prms = _.assign(getDefaultConfigObject(result.data), {
							locationId: result.data.locationId
						});
						$http.post(globals.webApiBaseUrl + 'model/main/object/assignlocation', prms)
							.then(processResponse,
								function (/*error*/) {
								});
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !_.isNumber(entity.locationId);
						},
						disableCancelButton: function disableCancelButton() {
							return false;
						}
					}

				};

				//Show Dialog
				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				platformModalFormConfigService.showDialog(dlgConfig);
			};

			/**
			 * @ngdoc method
			 * @name assignControllingUnits
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Shows a dialog box for picking a controlling unit that will be assigned to any currently
			 *              selected model objects.
			 */
			service.assignControllingUnits = function () {
				if (!checkSelection()) {
					return;
				}

				var entity = prepareEntity();
				var dlgConfig = {
					title: $translate.instant('model.main.assignControllingUnits'),
					dataItem: entity,
					formConfiguration: {
						fid: 'model.main.AssignControllingUnitModal',
						version: '0.1',
						showGrouping: false,
						groups: [{
							gid: 'general'
						}],
						rows: getDefaultFormFields().concat([
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'controllingStructureUnitLookupDataService',
								filter: function () {
									return modelViewerModelSelectionService.getSelectedModel().info.projectId;
								}
							}, {
								gid: 'general',
								rid: 'controllingUnit',
								model: 'controllingUnitId',
								sortOrder: 1,
								label$tr$: 'model.main.entityControllingUnit',
								type: 'integer'
							})
						])
					},
					handleOK: function handleOK(result) {
						var prms = _.assign(getDefaultConfigObject(result.data), {
							controllingUnitId: result.data.controllingUnitId
						});
						$http.post(globals.webApiBaseUrl + 'model/main/object/assigncontrollingunit', prms)
							.then(processResponse,
								function (/*error*/) {
								});
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !_.isNumber(entity.controllingUnitId);
						},
						disableCancelButton: function disableCancelButton() {
							return false;
						}
					}

				};

				//Show Dialog
				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				platformModalFormConfigService.showDialog(dlgConfig);
			};

			/**
			 * @ngdoc method
			 * @name assignCostGroups
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Shows a dialog box for picking cost groups that will be assigned to model objects.
			 */
			service.assignCostGroups = function () {
				if (!checkSelection()) {
					return;
				}

				return getCostGroupInfo().then(function (cgInfo) {
					var entity = prepareEntity();

					var dlgConfig = {
						title: $translate.instant('model.main.assignCostGroups'),
						dataItem: entity,
						formConfiguration: {
							fid: 'model.main.AssignCostGroupsModal',
							version: '0.1',
							showGrouping: false,
							groups: [{
								gid: 'general'
							}],
							rows: getDefaultFormFields().concat(_.map(cgInfo, function generateCostGroupLookup(cg) {
								return _.assign(basicsCostGroupLookupConfigService.provideFromConfig({
									costGroupType: cg.costGroupType,
									catalogIdGetter: function () {
										return cg.id;
									},
									projectIdGetter: cg.projectIdGetter
								}), {
									gid: 'general',
									rid: 'cg' + cg.costGroupType + '_' + cg.id,
									label: cg.name,
									model: 'cg[' + cg.costGroupType + '][' + cg.id + ']'
								});
							}))
						},
						handleOK: function handleOK(result) {
							var prms = _.assign(getDefaultConfigObject(result.data), {
								CostGroupAssignments: _.map(extractCostGroupAssignments(result.data, function (v) {
									var id = parseInt(v);
									return _.isInteger(id) ? id : null;
								}), function (assignment) {
									return {
										PKey2: assignment.cgType,
										PKey1: assignment.cgCat,
										Id: assignment.value
									};
								})
							});
							$http.post(globals.webApiBaseUrl + 'model/main/object/assigncostgroups', prms)
								.then(processResponse,
									function (/*error*/) {
									});
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								var cgData = extractCostGroupAssignments(entity, function (v) {
									return _.isInteger(v) ? true : null;
								});
								return cgData.length <= 0;
							},
							disableCancelButton: function disableCancelButton() {
								return false;
							}
						}

					};

					//Show Dialog
					platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
					return platformModalFormConfigService.showDialog(dlgConfig);
				});
			};

			/**
			 * @ngdoc method
			 * @name unassignLinkedEntities
			 * @function
			 * @methodOf modelMainObjectAssignmentWizardService
			 * @description Shows a dialog box for selecting one or more properties that should be cleared in all
			 *              selected model objects.
			 */
			service.unassignLinkedEntities = function () {
				if (!checkSelection()) {
					return;
				}

				return getCostGroupInfo().then(function (cgInfo) {
					var entity = prepareEntity();
					var dlgConfig = {
						title: $translate.instant('model.main.unassignProperties'),
						dataItem: entity,
						formConfiguration: {
							fid: 'model.main.unassignPropertiesModal',
							version: '0.1',
							showGrouping: true,
							groups: [{
								gid: 'general',
								header$tr$: 'model.main.selectionContext',
								sortOrder: 1,
								isOpen: true
							}, {
								gid: 'deletion',
								header$tr$: 'model.main.deletionProperties',
								sortOrder: 2,
								isOpen: true
							}],
							rows: _.concat(getDefaultFormFields(), [{
								gid: 'deletion',
								rid: 'location',
								model: 'location',
								sortOrder: 1,
								label$tr$: 'model.main.entityLocation',
								type: 'boolean'
							}, {
								gid: 'deletion',
								rid: 'controllingUnit',
								model: 'controllingUnit',
								sortOrder: 2,
								label$tr$: 'model.main.entityControllingUnit',
								type: 'boolean'
							}], _.map(cgInfo, function createUnlinkCheckBoxForCostGroup(cg) {
								return {
									gid: 'deletion',
									rid: 'cg' + cg.costGroupType + '_' + cg.id,
									model: 'cg[' + cg.costGroupType + '][' + cg.id + ']',
									label: cg.name,
									type: 'boolean'
								};
							}))
						},
						handleOK: function handleOK(result) {
							var prms = _.assign(getDefaultConfigObject(result.data), {
								location: result.data.location,
								controllingUnit: result.data.controllingUnit,
								CostGroupDeletion: _.map(extractCostGroupAssignments(result.data, function (v) {
									return v ? true : null;
								}), function (assignment) {
									return {
										PKey2: assignment.cgType,
										PKey1: assignment.cgCat,
										Id: assignment.value ? 1 : 0
									};
								})
							});
						
							$http.post(globals.webApiBaseUrl + 'model/main/object/clearproperties', prms)
								.then(processResponse,
									function (/*error*/) {
									});
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() { // jshint ignore:line
								if (entity.location || entity.controllingUnit) {
									return false;
								}

								var cgData = extractCostGroupAssignments(entity, function (v) {
									return v ? true : null;
								});
								return cgData.length <= 0;
							},
							disableCancelButton: function disableCancelButton() {
								return false;
							}
						}

					};

					//Show Dialog
					platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
					return platformModalFormConfigService.showDialog(dlgConfig);
				});
			};

			return service;
		}]);
})(angular);
