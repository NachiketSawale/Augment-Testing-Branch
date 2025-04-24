/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelMapSpacedLevelWizardService
	 * @function
	 *
	 * @description Provides a status change wizard for create spaced levels.
	 */
	angular.module('model.map').service('modelMapSpacedLevelWizardService', ['platformModalFormConfigService', '$http', '$translate', 'platformTranslateService', 'modelViewerModelSelectionService', 'modelMapAreaDataService', 'modelMapLevelDataService', 'platformDialogService',
		function (platformModalFormConfigService, $http, $translate, platformTranslateService, modelViewerModelSelectionService, modelMapAreaDataService, modelMapLevelDataService, platformDialogService) {
			var service = {};
			var wzConfig = {
				id: 'generateSpacedLevels',
				title: $translate.instant('model.map.level.spacedWizard.generateSpacedLevels'),
				dataItem: {
					numberOfLevels: 1,
					levelHeight: 3,
					spacing: 0.20,
					zCoordinate: 0,
					downward: false,
					firstLevelNumber: 1,
					descriptionPattern: 'Level {number}'
				},

				formConfiguration: {
					id: 'generateSpacedLevels',
					showGrouping: true,
					groups: [
						{
							gid: 'default',
							header$tr$: 'model.map.level.spacedWizard.default'
						},
						{
							gid: 'namingGroup',
							header$tr$: 'model.map.level.spacedWizard.namingGroup'
						}],
					rows: [

						{
							gid: 'default',
							rid: 'numberOfLevels',
							type: 'integer',
							model: 'numberOfLevels',
							label$tr$: 'model.map.level.spacedWizard.numberOfLevels',
							visible: true,
							sortOrder: 0
						}, {
							gid: 'default',
							rid: 'levelHeight',
							type: 'decimal',
							model: 'levelHeight',
							label$tr$: 'model.map.level.spacedWizard.levelHeight',
							visible: true,
							sortOrder: 10
						}, {
							gid: 'default',
							rid: 'spacing',
							type: 'decimal',
							model: 'spacing',
							label$tr$: 'model.map.level.spacedWizard.spacing',
							visible: true,
							sortOrder: 20
						}, {
							gid: 'default',
							rid: 'zCoordinate',
							type: 'decimal',
							model: 'zCoordinate',
							label$tr$: 'model.map.level.spacedWizard.zCoordinate',
							visible: true,
							sortOrder: 30
						}, {
							gid: 'default',
							rid: 'downward',
							type: 'boolean',
							model: 'downward',
							label$tr$: 'model.map.level.spacedWizard.downward',
							visible: true,
							sortOrder: 40
						},
						{
							gid: 'namingGroup',
							rid: 'firstLevelNumber',
							type: 'integer',
							model: 'firstLevelNumber',
							label$tr$: 'model.map.level.spacedWizard.firstLevelNumber',
							visible: true,
							sortOrder: 50
						}, {
							gid: 'namingGroup',
							rid: 'descriptionPattern',
							type: 'description',
							maxLength: 255,
							model: 'descriptionPattern',
							label$tr$: 'model.map.level.spacedWizard.descriptionPattern',
							visible: true,
							sortOrder: 60
						}]

				}

			};
			platformTranslateService.translateFormConfig(wzConfig.formConfiguration);
			service.showDialog = function () {
				if (modelMapAreaDataService.getSelected()) {

					return platformModalFormConfigService.showDialog(wzConfig).then(function (result) {
						if (result.ok) {
							result.data.ModelId = modelViewerModelSelectionService.getSelectedModelId();
							result.data.MapAreaId = modelMapAreaDataService.getSelected().Id;
							$http.post(globals.webApiBaseUrl + 'model/map/level/createSpacedLevels', result.data).then(function () {
								platformDialogService.showDialog({
									headerText$tr$: 'cloud.common.infoBoxHeader',
									bodyText$tr$: 'model.map.level.spacedWizard.messageBoxes.spacedLevelsCreated',
									bodyText$tr$param$: {
										count: result.data.numberOfLevels
									},
									showOkButton: true,
									iconClass: 'info'
								});
								modelMapLevelDataService.load();
							});

						}
					});
				} else {
					return platformDialogService.showDialog({
						headerText$tr$: 'cloud.common.errorDialogTitle',
						bodyText$tr$: 'model.map.level.spacedWizard.messageBoxes.noMapAreaSelected',
						bodyText$tr$param$: {},
						showOkButton: true,
						iconClass: 'error'
					});

				}
			};
			return service;
		}]);
})(angular);
