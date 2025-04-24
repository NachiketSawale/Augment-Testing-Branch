/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelMapPopulateMapsFromLocationTreeWizardService
	 * @function
	 *
	 * @description Provides a wizard to create map structures based on an existing location hierarchy.
	 */
	angular.module('model.map').factory('modelMapPopulateMapsFromLocationTreeWizardService',
		modelMapPopulateMapsFromLocationTreeWizardService);

	modelMapPopulateMapsFromLocationTreeWizardService.$inject = ['_',
		'platformModalFormConfigService', '$http', '$translate', 'platformTranslateService',
		'modelMapDataService', 'platformDialogService', 'basicsLookupdataConfigGenerator',
		'platformGridDialogService'];

	function modelMapPopulateMapsFromLocationTreeWizardService(_,
		platformModalFormConfigService, $http, $translate, platformTranslateService,
		modelMapDataService, platformDialogService, basicsLookupdataConfigGenerator,
		platformGridDialogService) {

		const service = {};

		service.showDialog = function () {
			const selMap = modelMapDataService.getSelected();
			if (selMap && _.isInteger(selMap.ProjectFk)) {
				const settings = {
					AreasDepth: 2,
					LevelsDepth: 3,
					AreasDescriptionPattern: $translate.instant('model.map.populateMapsFromLocationTreeWizard.defaultAreaDescPattern'),
					LevelsDescriptionPattern: $translate.instant('model.map.populateMapsFromLocationTreeWizard.defaultLevelDescPattern')
				};

				const wzConfig = {
					id: 'populateMapsFromLocationTreeWizardService',
					title: $translate.instant('model.map.populateMapsFromLocationTreeWizard.title'),
					dataItem: settings,
					formConfiguration: {
						id: 'populateMapsFromLocationTree',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'projectLocationLookupDataService',
							filter: function provideModelPropertyKeyFilter() {
								return selMap.ProjectFk;
							},
							gridLess: false
						}, {
							gid: 'default',
							rid: 'projectLocation',
							label$tr$: 'model.map.populateMapsFromLocationTreeWizard.projectLocation',
							model: 'ProjectLocationFk'
						}), {
							gid: 'default',
							rid: 'createAreasFromDepth',
							type: 'integer',
							model: 'AreasDepth',
							label$tr$: 'model.map.populateMapsFromLocationTreeWizard.createAreasFromDepth'
						}, {

							gid: 'default',
							rid: 'createLevelsFromDepth',
							type: 'integer',
							model: 'LevelsDepth',
							label$tr$: 'model.map.populateMapsFromLocationTreeWizard.createLevelsFromDepth'
						}, {
							gid: 'default',
							rid: 'descriptionPatternForAreas',
							type: 'description',
							maxLength: 255,
							model: 'AreasDescriptionPattern',
							label$tr$: 'model.map.populateMapsFromLocationTreeWizard.descriptionPatternForAreas'
						}, {
							gid: 'default',
							rid: 'descriptionPatternForLevels',
							type: 'description',
							maxLength: 255,
							model: 'LevelsDescriptionPattern',
							label$tr$: 'model.map.populateMapsFromLocationTreeWizard.descriptionPatternForLevels'
						}]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return _.isNil(settings.ProjectLocationFk) ||
								(settings.AreasDepth <= 0) || (settings.LevelsDepth <= 0) ||
								(settings.AreasDepth > settings.LevelsDepth);
						}
					}
				};
				platformTranslateService.translateFormConfig(wzConfig.formConfiguration);

				return platformModalFormConfigService.showDialog(wzConfig).then(function (result) {
					if (result.ok) {
						result.data.ModelId = selMap.ModelFk;
						result.data.MapId = selMap.Id;
						return $http.post(globals.webApiBaseUrl + 'model/map/populateMapsFromLocationTree', result.data).then(function (response) {
							modelMapDataService.load();

							return showResults(response.data);
						}).then(function () {
							return {
								success: true
							};
						});
					} else {
						return {
							success: false
						};
					}
				});
			} else {
				return platformDialogService.showDialog({
					headerText$tr$: 'cloud.common.errorDialogTitle',
					bodyText$tr$: 'model.map.populateMapsFromLocationTreeWizard.noModelMapSelected',
					showOkButton: true,
					iconClass: 'error'
				});
			}
		};

		function showResults(map) {
			const mapItem = {
				Id: 'map',
				EntityType: $translate.instant('model.map.populateMapsFromLocationTreeWizard.entityTypeMap'),
				Description: map.Description,
				LocationFk: null,
				children: _.map(map.MapAreaEntities, function (area) {
					return {
						Id: 'map/' + area.Id,
						EntityType: $translate.instant('model.map.populateMapsFromLocationTreeWizard.entityTypeArea'),
						Description: area.Description,
						LocationFk: area.LocationFk,
						children: _.map(area.MapLevelEntities, function (level) {
							return {
								Id: 'map/' + area.Id + '/' + level.Id,
								EntityType: $translate.instant('model.map.populateMapsFromLocationTreeWizard.entityTypeLevel'),
								Description: level.Description,
								LocationFk: level.LocationFk
							};
						})
					};
				})
			};

			return platformGridDialogService.showDialog({
				columns: [{
					id: 'entityType',
					name$tr$: 'model.map.populateMapsFromLocationTreeWizard.entityType',
					formatter: 'description',
					field: 'EntityType',
					width: 100
				}, {
					id: 'desc',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description',
					field: 'Description',
					width: 300
				}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'projectLocationLookupDataService',
					filter: function provideModelPropertyKeyFilter() {
						return map.ProjectFk;
					},
					gridLess: false,
					readonly: true
				}, {
					id: 'loc',
					name$tr$: 'model.map.populateMapsFromLocationTreeWizard.location',
					field: 'LocationFk',
					width: 300
				})],
				items: [mapItem],
				idProperty: 'Id',
				tree: true,
				childrenProperty: 'children',
				headerText$tr$: 'model.map.populateMapsFromLocationTreeWizard.results',
				topDescription$tr$: 'model.map.populateMapsFromLocationTreeWizard.resultsSummary',
				isReadOnly: true
			});
		}

		return service;
	}
})(angular);
