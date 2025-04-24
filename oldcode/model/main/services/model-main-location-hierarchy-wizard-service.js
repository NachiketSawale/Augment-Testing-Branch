/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainLocationHierarchyWizardService
	 * @function
	 *
	 * @description Provides a wizard for creating a hierarchy of locations based on model object properties.
	 */

	angular.module('model.main').factory('modelMainLocationHierarchyWizardService', ['_', 'platformTranslateService',
		'platformModalFormConfigService', '$http', '$injector', 'modelViewerModelSelectionService', '$translate',
		'platformSidebarWizardCommonTasksService', '$q', 'platformGridDialogService', 'platformGridAPI',
		'basicsLookupdataConfigGenerator',
		function (_, platformTranslateService, platformModalFormConfigService, $http, $injector, modelViewerModelSelectionService,
			$translate, platformSidebarWizardCommonTasksService, $q, platformGridDialogService, platformGridAPI,
			basicsLookupdataConfigGenerator) {

			const RUBRIC_ID = 85;
			const service = {};
			let hasToCreate = false;

			service.setHasToCreate = function (value) {
				hasToCreate = value;
			};

			service.getHasToCreate = function () {
				return hasToCreate;
			};

			const postData = {
				RubricId: RUBRIC_ID
			};

			service.runWizard = async function () {
				try {
					const response = await $http.post(`${globals.webApiBaseUrl}basics/company/number/GenerationInfo`, postData);

					if (!response.data) {
						throw new Error('No data received.');
					}

					const filterData = response.data[0].HasToCreate;
					hasToCreate = filterData;
					service.setHasToCreate(hasToCreate);

					const selModelId = modelViewerModelSelectionService.getSelectedModelId();
					if (!selModelId) {
						return platformSidebarWizardCommonTasksService.showErrorNoSelection(
							'model.main.locationHierarchy.cannotAssignLocations',
							$translate.instant('model.main.noModelSelected')
						);
					}

					const settings = getDefaultSettings();
					const dlgConfig = getDialogConfig(settings);
					platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
					const result = await platformModalFormConfigService.showDialog(dlgConfig);
					if (result.ok) {
						await submitHierarchyCreationRequest(selModelId, settings);
					}

				} catch (error) {
					console.error('Error in runWizard:', error.message);
				}
			};

			function getDefaultSettings() {
				return {
					Levels: _.map(_.range(0, 5), idx => ({
						Id: idx + 1,
						level: idx + 1,
						CodePattern: '{pAutocode}',
						DescriptionPattern: '{property}: {value}'
					})),
					NullValueText: $translate.instant('model.main.locationHierarchy.defaultNullValueText'),
					OverwriteLocations: true
				};
			}

			function getDialogConfig(settings) {
				return {
					title: $translate.instant('model.main.locationHierarchy.title'),
					width: '70%',
					resizeable: true,
					dataItem: settings,
					formConfiguration: {
						fid: 'model.main.locationHierarchyWizard.config',
						showGrouping: true,
						groups: [
							{
								gid: 'loc',
								isOpen: true,
								sortOrder: 100,
								header$tr$: 'model.main.locationHierarchy.locationGeneration'
							},
							{
								gid: 'assignment',
								isOpen: true,
								sortOrder: 200,
								header$tr$: 'model.main.locationHierarchy.locationAssignment'
							}
						],
						rows: [
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelAdministrationDataTreeLookupDataService',
								enableCache: true,
								showClearButton: true,
								additionalColumns: false
							}, {
								gid: 'loc',
								model: 'DataTreeId',
								label$tr$: 'model.main.locationHierarchy.existingHierarchy',
								visible: true,
								sortOrder: 20
							}),
							{
								gid: 'loc',
								label$tr$: 'model.main.locationHierarchy.treeName',
								type: 'description',
								model: 'Description',
								visible: true,
								sortOrder: 30
							},
							{
								gid: 'loc',
								label$tr$: 'model.main.locationHierarchy.rootCode',
								type: 'code',
								model: 'RootCode',
								visible: true,
								sortOrder: 40

							},
							{
								gid: 'loc',
								label$tr$: 'model.main.locationHierarchy.rootDescription',
								type: 'description',
								model: 'RootDescription',
								visible: true,
								sortOrder: 42
							},
							{
								gid: 'loc',
								label$tr$: 'model.main.locationHierarchy.hierarchy',
								type: 'directive',
								directive: 'model-main-location-hierarchy-level-list',
								model: 'Levels',
								visible: true,
								sortOrder: 100
							},
							{
								gid: 'loc',
								label$tr$: 'model.main.locationHierarchy.nullValueText',
								type: 'description',
								model: 'NullValueText',
								visible: true,
								sortOrder: 140
							},
							{
								gid: 'assignment',
								label$tr$: 'model.main.locationHierarchy.assignLocations',
								type: 'boolean',
								model: 'AssignLocations',
								visible: true,
								sortOrder: 200
							},
							{
								gid: 'assignment',
								label$tr$: 'model.main.locationHierarchy.overwriteLocations',
								type: 'boolean',
								model: 'OverwriteLocations',
								visible: true,
								sortOrder: 250
							}
						]
					},
					handleOK: () => platformGridAPI.grids.commitAllEdits()
				};
			}


			async function submitHierarchyCreationRequest(modelId, settings) {
				const request = _.omitBy(settings, (value, key) => _.isString(key) && key.startsWith('_'));

				request.Levels = _.filter(request.Levels, lvl => _.isNumber(lvl.PropertyKeyFk));
				request.Levels.forEach(lvl => {
					delete lvl.Id;
					delete lvl.level;
				});
				request.ModelId = modelId;

				const response = await $http.post(`${globals.webApiBaseUrl}model/main/object/createlocationhierarchy`, request);

				const locById = {};
				response.data.forEach(loc => {
					locById[loc.Id] = loc;
					loc.children = [];
					loc.image = 'ico-location';
				});
				response.data.forEach(loc => {
					if (_.isNumber(loc.ParentId)) {
						locById[loc.ParentId].children.push(loc);
					}
				});

				const cols = [
					{
						id: 'code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'code',
						field: 'Code',
						width: 100
					},
					{
						id: 'desc',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						field: 'Description',
						width: 200
					},
					{
						id: 'newLoc',
						name$tr$: 'model.main.locationHierarchy.newLoc',
						formatter: 'boolean',
						field: 'IsNewLocation',
						width: 130
					}
				];

				if (request.AssignLocations) {
					cols.push({
						id: 'objCount',
						name$tr$: 'model.main.locationHierarchy.objectCount',
						formatter: 'integer',
						field: 'ObjectCount',
						width: 150
					});
				}

				return platformGridDialogService.showDialog({
					columns: cols,
					items: _.filter(response.data, loc => !_.isNumber(loc.ParentId)),
					idProperty: 'Id',
					tree: true,
					childrenProperty: 'children',
					headerText$tr$: 'model.main.locationHierarchy.summaryTitle',
					topDescription$tr$: request.AssignLocations ? 'model.main.locationHierarchy.summaryLocationsAssigned' : 'model.main.locationHierarchy.summaryLocations',
					topDescription$tr$param$: {
						locationCount: response.data.length,
						objectCount: (function () {
							var result = 0;
							response.data.forEach(function (loc) {
								if (_.isNumber(loc.ObjectCount)) {
									result += loc.ObjectCount;
								}
							});
							return result;
						})()
					},
					isReadOnly: true
				});
			}

			return service;
		}
	]);
})(angular);
