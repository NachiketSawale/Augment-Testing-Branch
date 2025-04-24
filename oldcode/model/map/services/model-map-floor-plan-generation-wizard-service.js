/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.map.modelMapFloorPlanGenerationWizardService
	 * @function
	 *
	 * @description
	 * Provides a wizard to generate 2D floor plans from a 3D scene.
	 */
	angular.module('model.map').factory('modelMapFloorPlanGenerationWizardService',
		modelMapFloorPlanGenerationWizardService);

	modelMapFloorPlanGenerationWizardService.$inject = ['platformWizardDialogService', '$translate',
		'modelMapLevelDataService', 'modelMapAreaDataService', 'modelViewerHoopsSnapshotService',
		'$http', 'modelMapDataService', 'modelViewerModelSelectionService', '$timeout', '$q'];

	function modelMapFloorPlanGenerationWizardService(platformWizardDialogService, $translate,
		modelMapLevelDataService, modelMapAreaDataService, modelViewerHoopsSnapshotService,
		$http, modelMapDataService, modelViewerModelSelectionService, $timeout, $q) {

		function buildMapTree(mapEntity, enrichLevel) {
			const mapName = $translate.instant('model.map.floorPlanGeneration.entityTypeMap');
			const areaName = $translate.instant('model.map.floorPlanGeneration.entityTypeArea');
			const levelName = $translate.instant('model.map.floorPlanGeneration.entityTypeLevel');

			return {
				id: `map:${mapEntity.ModelFk}/${mapEntity.Id}`,
				description: mapEntity.Description,
				entityType: mapName,
				children: mapEntity.MapAreaEntities.map(function (areaEntity) {
					return {
						id: `area:${areaEntity.ModelFk}/${areaEntity.Id}`,
						description: areaEntity.Description,
						entityType: areaName,
						children: areaEntity.MapLevelEntities.map(function (levelEntity) {
							const lvl = {
								id: `level:${levelEntity.ModelFk}/${levelEntity.Id}`,
								description: levelEntity.Description,
								entityType: levelName,
								hasPlan: Boolean(levelEntity.PrjDocumentFk),
								modelId: levelEntity.ModelFk,
								levelId: levelEntity.Id
							};

							if (enrichLevel) {
								enrichLevel(lvl);
							}

							return lvl;
						})
					};
				})
			};
		}

		function containsFloorPlans(mapEntity) {
			return mapEntity.MapAreaEntities.some(function (areaEntity) {
				return areaEntity.MapLevelEntities.some(function (mapLevel) {
					return Boolean(mapLevel.PrjDocumentFk);
				});
			});
		}

		function extractAllLevels(mapEntity, includeWithFloorPlans) {
			const result = [];

			for (let area of mapEntity.MapAreaEntities) {
				for (let level of area.MapLevelEntities) {
					if (!level.PrjDocumentFk || includeWithFloorPlans) {
						result.push(level);
					}
				}
			}

			return result;
		}

		function showDialog(modelId, mapLevelIds, mapAreaIds, mapId) {
			return $http.get(globals.webApiBaseUrl + 'model/map/tree', {
				params: {
					modelId,
					mapId: mapId,
					areaIds: mapAreaIds ? mapAreaIds.join(':') : undefined,
					levelIds: mapLevelIds ? mapLevelIds.join(':') : undefined
				}
			}).then(function (response) {
				const mapEntity = response.data;

				const wzConfig = {
					title: $translate.instant('model.map.floorPlanGeneration.title'),
					steps: [platformWizardDialogService.createListStep({
						stepId: 'welcome',
						title: $translate.instant('model.map.floorPlanGeneration.welcomeTitle'),
						topDescription: $translate.instant('model.map.floorPlanGeneration.welcomeDesc'),
						model: 'mapLevels',
						requireSelection: false
					}), {
						id: 'settings',
						form: {
							fid: 'model.map.floorPlanGeneration',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'baseGroup'
							}],
							rows: [{
								rid: 'overwrite',
								gid: 'baseGroup',
								label$tr$: 'model.map.floorPlanGeneration.overwrite',
								type: 'boolean',
								model: 'OverwriteExisting',
								readonly: !containsFloorPlans(mapEntity)
							}]
						}
					}, {
						id: 'processing',
						title$tr$: 'model.map.floorPlanGeneration.processingTitle',
						message$tr$: 'model.map.floorPlanGeneration.processingDesc',
						disallowNext: true,
						disallowBack: true,
						disallowCancel: true
					}, _.assign(platformWizardDialogService.createListStep({
						stepId: 'summary',
						title: $translate.instant('model.map.floorPlanGeneration.summaryTitle'),
						topDescription: $translate.instant('model.map.floorPlanGeneration.summaryDesc'),
						model: 'mapLevelResults',
						requireSelection: false
					}), {
						disallowBack: true,
						disallowCancel: true,
						canFinish: true
					})],
					onChangeStep: function (stepInfo) {
						switch (_.get(stepInfo, 'step.id')) {
							case 'processing':
								return takeSnapshots(mapEntity, extractAllLevels(mapEntity, generationSettings.OverwriteExisting), generationSettings).then(function () {
									if (!_.isEmpty(modelMapLevelDataService.getList())) {
										modelMapLevelDataService.load();
									}

									stepInfo.step.disallowNext = false;
									return $timeout(function () {
										return stepInfo.commands.goToNext();
									});
								});
						}
					}
				};

				const generationSettings = {
					mapLevels: {
						selectionListConfig: {
							columns: [{
								id: 'desc',
								name$tr$: 'cloud.common.entityDescription',
								field: 'description',
								formatter: 'description',
								width: 300
							}, {
								id: 'type',
								name$tr$: 'model.map.floorPlanGeneration.entityType',
								field: 'entityType',
								formatter: 'description',
								width: 120
							}, {
								id: 'hasPlan',
								name$tr$: 'model.map.floorPlanGeneration.hasPlan',
								field: 'hasPlan',
								formatter: 'boolean',
								width: 80
							}],
							idProperty: 'id',
							childProp: 'children',
							options: {
								tree: true,
								collapsed: false
							}
						},
						items: [buildMapTree(mapEntity)]
					},
					mapLevelResults: {
						selectionListConfig: {
							columns: [{
								id: 'desc',
								name$tr$: 'cloud.common.entityDescription',
								field: 'description',
								formatter: 'description',
								width: 300
							}, {
								id: 'type',
								name$tr$: 'model.map.floorPlanGeneration.entityType',
								field: 'entityType',
								formatter: 'description',
								width: 120
							}, {
								id: 'created',
								name$tr$: 'model.map.floorPlanGeneration.created',
								field: 'planCreated',
								formatter: 'boolean',
								width: 90
							}, {
								id: 'replaced',
								name$tr$: 'model.map.floorPlanGeneration.replaced',
								field: 'existingPlanReplaced',
								formatter: 'boolean',
								width: 90
							}, {
								id: 'remarks',
								name$tr$: 'model.map.floorPlanGeneration.remarks',
								field: 'remarks',
								formatter: 'description',
								width: 200
							}],
							idProperty: 'id',
							childProp: 'children',
							options: {
								tree: true,
								collapsed: false
							}
						}
					}
				};

				platformWizardDialogService.translateWizardConfig(wzConfig);
				return platformWizardDialogService.showDialog(wzConfig, generationSettings).then(function (result) {

				});
			});
		}

		function runWizard() {
			function getSelIds(dataService) {
				const selItems = dataService.getSelectedEntities();
				if (selItems.length > 0) {
					return selItems.map(item => item.Id);
				}
			}

			const selModelId = modelViewerModelSelectionService.getSelectedModelId();

			return showDialog(selModelId, getSelIds(modelMapLevelDataService), getSelIds(modelMapAreaDataService), getSelIds(modelMapDataService)[0]);
		}

		function takeSnapshots(mapEntity, mapLevels, settings) {
			const snapshotConfigs = mapLevels.map(function (ml) {
				return {
					id: `${ml.ModelFk}/${ml.Id}`,
					customData: {
						modelId: ml.ModelFk,
						levelId: ml.Id
					},
					orthographic: true,
					standardCamera: 'top',
					referencePoints: true,
					cuttingPlanes: [{
						point: {
							x: 0,
							y: 0,
							z: ml.ZLevel
						},
						normal: {
							x: 0,
							y: 0,
							z: 1
						}
					}, {
						point: {
							x: 0,
							y: 0,
							z: ml.ZLevel - ml.ViewingDistance
						},
						normal: {
							x: 0,
							y: 0,
							z: -1
						}
					}]
				};
			});

			const results = [];

			return modelViewerHoopsSnapshotService.takeSnapshots({}, snapshotConfigs, function (snapshotInfo) {
				const dataUrlPattern = /^data:(?:(image\/[a-z]+);)?base64,(.*)$/;
				const levelInfo = snapshotInfo.config.customData;

				const imageDataUrl = snapshotInfo.html.src;
				const dataUrlInfo = imageDataUrl.match(dataUrlPattern);

				const request = {
					ModelFk: levelInfo.modelId,
					LevelFk: levelInfo.levelId,
					MimeType: dataUrlInfo[1],
					ImageData: dataUrlInfo[2],
					ReferencePoints: snapshotInfo.referencePoints.map(function (rp) {
						return {
							SpatialX: rp.point3D.x,
							SpatialY: rp.point3D.y,
							SpatialZ: rp.point3D.z,
							ProjectedX: rp.point2D.x,
							ProjectedY: rp.point2D.y
						};
					})
				};

				return $http.post(globals.webApiBaseUrl + 'model/map/level/saveSnapshot', request, {
					headers: {
						errorDialog: false
					}
				}).then(function (response) {
					results.push(response.data);
				}, function (reason) {
					results.push({
						ModelFk: levelInfo.modelId,
						LevelFk: levelInfo.levelId,
						Success: false,
						PrjDocumentFk: null,
						Remarks: reason.data.ErrorMessage,
						ReplacedExisting: false
					});
					return $q.resolve();
				});
			}).then(function () {
				settings.mapLevelResults.items = [buildMapTree(mapEntity, function enrichLevel (lvl) {
					const levelResult = results.find(lr => lr.ModelFk === lvl.modelId && lr.LevelFk === lvl.levelId);
					if (levelResult) {
						lvl.planCreated = levelResult.Success;
						lvl.existingPlanReplaced = levelResult.ReplacedExisting;
						lvl.remarks = levelResult.Remarks;
					}
				})];
			});
		}

		return {
			showDialog,
			runWizard
		};
	}
})(angular);