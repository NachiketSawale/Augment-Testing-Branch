/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerModelSettingsService
	 * @function
	 *
	 * @description This service loads and manages 3D-model-related settings objects. It also manages subscriptions to
	 *              receive update notifications about these objects. Furthermore, the service provides some settings
	 *              types related to the models.
	 */
	angular.module('model.viewer').factory('modelViewerModelSettingsService', ['_', '$http', '$q', 'permissions',
		'modelViewerModelSelectionService', 'PlatformMessenger', 'basicsCommonConfigLocationListService',
		function (_, $http, $q, permissions, modelSelectionService, PlatformMessenger, configLocations) {
			var listParts = ['camPos'];
			var atomicParts = ['displaySettings'];

			var service = {};

			/**
			 * @ngdoc function
			 * @name checkValidMarkerType
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Checks whether a split settings part identifier refers to a valid marker type.
			 * @param {Array<String>} splitSettingsPart The split form of the settings part identifier.
			 * @throws {Error} If `splitSettingsPart` does not denote a valid marker type.
			 */
			function checkValidMarkerType(splitSettingsPart) {
				if (splitSettingsPart.length <= 1) {
					throw new Error('Marker settings cannot be loaded without specifying the marker type.');
				}
				switch (splitSettingsPart[1]) {
					case 'rfi':
						break;
					default:
						throw new Error('Unknown marker type: ' + splitSettingsPart[1]);
				}
			}

			/**
			 * @ngdoc function
			 * @name loadModelSettings
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Retrieves model-specific settings from the backend.
			 * @param {Number} modelId The ID of the model.
			 * @param {String} settingsPart The name of the settings part to load.
			 * @returns {Promise} A promise that returns a settings object.
			 */
			function loadModelSettings(modelId, settingsPart) {
				if (!('' + modelId).match(/^[0-9]+$/)) {
					throw new Error('Invalid model ID: ' + modelId);
				}

				var splitSettingsPart = settingsPart.split('_');

				var retrievalPromise;
				switch (splitSettingsPart[0]) {
					case 'camPos':
						retrievalPromise = $http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'model/main/modelconfig/listcamerapositions?modelId=' + modelId
							//url: globals.webApiBaseUrl + 'model/annotation/viewpoint/listviewpoints?modelId=' + modelId
							//need to be debug, always return error
						});
						break;
					case 'displaySettings':
						retrievalPromise = $http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'model/main/modelconfig/getdisplaysettings?modelId=' + modelId
						});
						break;
					case 'markers':
						checkValidMarkerType(splitSettingsPart);
						retrievalPromise = $http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'model/main/modelconfig/listmarkers?modelId=' + modelId + '&markertype=' + splitSettingsPart[1]
						});
						break;
					default:
						throw new Error('Unsupported settings part: ' + settingsPart);
				}
				return retrievalPromise.then(function (val) {
					if (_.includes(listParts, settingsPart)) {
						val.data.forEach(function (item) {
							item.origScopeLevel = item.scopeLevel;
						});
					}
					return val.data;
				});
			}

			/**
			 * @ngdoc function
			 * @name saveSettings
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Saves model-specific settings to the backend.
			 * @returns {Promise<Object>} A promise that returns when the settings have been saved.
			 */
			service.saveSettings = function () {
				function createPermittedCopy(grantedAccess) {
					var accessScopes = configLocations.createItems();
					var result = {};

					if (loadedSettings.changes) {
						listParts.forEach(function (partName) {
							if (loadedSettings.changes[partName]) {
								result[partName] = _.cloneDeep(loadedSettings.changes[partName]);
								if (grantedAccess[partName]) {
									var removeItems = [];
									if (result[partName].items) {
										result[partName].items.forEach(function (item) {
											if ((item.origScopeLevel && !grantedAccess[partName][item.origScopeLevel]) || !grantedAccess[partName][item.scopeLevel]) {
												removeItems.push(item.id);
											}
										});
										removeItems.forEach(function (id) {
											_.remove(result[partName].items, {id: id});
										});

										removeItems = [];
									}

									if (result[partName].deletedIds) {
										result[partName].deletedIds.forEach(function (id, index) {
											if (!grantedAccess[partName][result[partName].deletedAccessScopes[index]]) {
												removeItems.push(id);
											}
										});
										removeItems.forEach(function (id) {
											_.remove(result[partName].deletedIds, id);
										});
										delete result[partName].deletedAccessScopes;
									}
								}
							}
						});
						atomicParts.forEach(function (partName) {
							if (loadedSettings.changes[partName]) {
								result[partName] = _.cloneDeep(loadedSettings.changes[partName]);
								if (grantedAccess[partName]) {
									accessScopes.forEach(function (accessScope) {
										if (!grantedAccess[partName][accessScope.id]) {
											delete result[partName][accessScope.id];
										}
									});
								}
							}
						});
					}

					return result;
				}

				if (!('' + loadedSettings.modelId).match(/^[0-9]+$/)) {
					throw new Error('Invalid model ID: ' + loadedSettings.modelId);
				}
				if (!loadedSettings.changes) {
					return $q.when();
				}

				return (function () {
					var reqPermissions = _.map(_.filter(atomicParts.concat(listParts), function (settingsPart) {
						return loadedSettings.changes[settingsPart];
					}), function (settingsPart) {
						return {
							id: settingsPart,
							permissions: service.getPermissionsForPart(settingsPart)
						};
					});
					return configLocations.checkAllAccessRights(reqPermissions);
				})().then(function (granted) {
					var dataCopy = createPermittedCopy(granted);

					var p = $http.post(globals.webApiBaseUrl + 'model/main/modelconfig/save', {
						modelId: loadedSettings.modelId,
						data: dataCopy
					});
					loadedSettings.changes = null;
					return p;
				});
			};

			var trackedSettings = {
				byPartName: {},
				all: []
			};

			/**
			 * @ngdoc function
			 * @name trackSettings
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Registers a listener function for notifications about loading or changes of a given set of
			 *              settings parts.
			 * @param {Function} handler The listener function. When it is called, use {@see getSettingsPart} to
			 *                           retrieve the configuration data.
			 * @param {Array<String>} settingsParts The names of the settings parts to track.
			 */
			service.trackSettings = function (handler, settingsParts) {
				settingsParts.forEach(function (partName) {
					var trackedPartSettings = trackedSettings.byPartName[partName];
					if (!trackedPartSettings) {
						trackedPartSettings = {
							partName: partName,
							listeners: new PlatformMessenger(),
							handlerCount: 0,
							loadPromise: null
						};
						trackedPartSettings.reload = function () {
							loadedSettings.data[partName] = null;
							var promise = loadModelSettings(loadedSettings.modelId, partName).then(function (data) {
								loadedSettings.data[partName] = data;
								trackedPartSettings.loadPromise = $q.when(partName);
							});
							trackedPartSettings.loadPromise = promise;
							return promise;
						};
						if (loadedSettings.modelId) {
							trackedPartSettings.reload();
						}
						trackedSettings.byPartName[partName] = trackedPartSettings;
						trackedSettings.all.push(trackedPartSettings);
					}
					trackedPartSettings.listeners.register(handler);
					trackedPartSettings.handlerCount++;
					if (trackedPartSettings.loadPromise) {
						return trackedPartSettings.loadPromise.then(function () {
							handler();
						});
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name untrackSettings
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Removes a listener function that gets notified about changes to settings parts.
			 * @param {Function} handler The listener function. When it is called, use {@see getSettingsPart} to
			 *                           retrieve the configuration data.
			 * @param {Array<String>} settingsParts The names of the settings parts to track. If a falsy value is
			 *                                      passed to this parameter, `handler` will be removed for all settings
			 *                                      parts for which it has been registered.
			 */
			service.untrackSettings = function (handler, settingsParts) {
				var untrackedSettingsParts = settingsParts || _.map(trackedSettings.all, function (trackedPartSettings) {
					return trackedPartSettings.partName;
				});

				untrackedSettingsParts.forEach(function (partName) {
					var trackedPartSettings = trackedSettings.byPartName[partName];
					if (trackedPartSettings) {
						trackedPartSettings.listeners.unregister(handler);
						trackedPartSettings.handlerCount--;
						if (trackedPartSettings.handlerCount <= 0) {
							trackedSettings.byPartName[partName] = null;
							_.remove(trackedSettings.all, function (item) {
								return item.partName === partName;
							});
						}
					}
				});
			};

			var loadedSettings = {
				modelId: null,
				data: {}
			};

			/**
			 * @ngdoc function
			 * @name getSettingsPart
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Returns the given settings part, if it has been loaded.
			 * @param {String} partName The name of the settings part.
			 * @returns {Object} The settings part, or a falsy value if the part is not loaded.
			 */
			service.getSettingsPart = function (partName) {
				return loadedSettings.data[partName];
			};

			/**
			 * @ngdoc function
			 * @name loadTrackedSettings
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Loads all tracked settings parts for the currently selected model, if any.
			 * @returns {Boolean} A value that indicates whether a model is currently loaded.
			 */
			function loadTrackedSettings() {
				if (loadedSettings.modelId) {
					trackedSettings.all.forEach(function (item) {
						item.reload().then(function () {
							item.listeners.fire();
						});
					});
					return true;
				} else {
					return false;
				}
			}

			/**
			 * @ngdoc function
			 * @name retrieveChangeJournal
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Returns a change journal for the given settings part of the currently selected model and
			 *              creates a new such object if none exists yet.
			 * @param {String} settingsPart The model part.
			 * @returns {Object} An object that stores information about modified settings for the given settings part.
			 */
			function retrieveChangeJournal(settingsPart) {
				var changeJournal = loadedSettings.changes;
				if (!changeJournal) {
					changeJournal = loadedSettings.changes = {};
				}

				var partChangeJournal = changeJournal[settingsPart];
				if (!partChangeJournal) {
					partChangeJournal = changeJournal[settingsPart] = {};
				}

				return partChangeJournal;
			}

			/**
			 * @ngdoc function
			 * @name storeAccessScopedChanges
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Copies the access-scoped settings of a settings part into the change journal.
			 * @param {String} settingsPart The model part.
			 * @throws {Error} No model has been selected, or `settingsPart` has not been loaded.
			 */
			function storeAccessScopedChanges(settingsPart) {
				var settings = loadedSettings.data[settingsPart];
				if (settings) {
					var changes = retrieveChangeJournal(settingsPart);
					configLocations.createItems().forEach(function (accessScope) {
						changes[accessScope.id] = settings[accessScope.id];
					});
				} else {
					throw new Error('The settings part ' + settingsPart + ' has not been loaded.');
				}
			}

			/**
			 * @ngdoc function
			 * @name modelSettingsUpdated
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Triggers a notification that settings related to a given settings part have changed.
			 * @param {String} partName The name of the changed settings part.
			 */
			service.modelSettingsUpdated = function (partName) {
				if (loadedSettings.modelId) {
					var trackedPartSettings = trackedSettings.byPartName[partName];
					if (trackedPartSettings) {
						trackedPartSettings.listeners.fire();
					}
				}
			};

			/**
			 * @ngdoc function
			 * @name checkModelSelected
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Checks whether a model is selected and otherwise throws an error.
			 * @throws {Error} No model has been selected.
			 */
			function checkModelSelected() {
				if (!loadedSettings.modelId) {
					throw new Error('Currently, no model is selected.');
				}
			}

			/**
			 * @ngdoc function
			 * @name modelSelectionUpdated
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Processes the event when the selected model has changed.
			 */
			function modelSelectionUpdated() {
				var savePromise;
				if (loadedSettings.modelId) {
					savePromise = service.saveSettings();
				} else {
					savePromise = $q.when();
				}

				savePromise.then(function () {
					loadedSettings = {
						modelId: modelSelectionService.getSelectedModelId(),
						data: {}
					};
					if (loadedSettings.modelId) {
						loadTrackedSettings();
					} else {
						trackedSettings.all.forEach(function (item) {
							item.listeners.fire();
						});
					}
				});
			}

			modelSelectionService.onSelectedModelChanged.register(modelSelectionUpdated);

			modelSelectionUpdated();

			/**
			 * @ngdoc function
			 * @name getPermissionsForPart
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Returns the scoped permissions for modifying the respective settings.
			 * @param {String} settingsPart The name of the settings part to load.
			 * @returns {Object} An object with scoped permissions for modifying the settings part. The object is
			 *                   compatible with the {@see platformScopedConfigDialogService}.
			 * @throws {Error} If `settingsPart` is unknown.
			 */
			service.getPermissionsForPart = function (settingsPart) {
				switch (settingsPart) {
					case 'camPos':
						return { // TODO: change IDs
							permission: permissions.execute,
							g: ['bec4aba702444305a67a77c7ceeede05'],
							r: ['27d87713bd8247aa94b1aedf87d75eb6'],
							u: ['f79b2b811ca14208b9160fda64de8f45']
						};
					case 'displaySettings':
						return {
							permission: permissions.execute,
							g: ['3370d97838704b85ae0d49a1d8fdbf73'],
							r: ['2a9924e3d31546c380f236e5f5fa4b5e'],
							u: ['60cc1283416a404f96985ff04af6c9b6']
						};
					case 'markers_rfi':
						return {
							permission: permissions.execute,
							g: ['056fce258dc0449790d067664ced9c20'],
							r: ['8b08ce82af304795a9c68fd3b1897e96'],
							u: ['856a177f46814877925e01de5089fbf6']
						};
					default:
						throw new Error('Unsupported settings part: ' + settingsPart);
				}
			};

			// camera positions ----------------------------------------------------------------

			/**
			 * @ngdoc function
			 * @name addCameraPosition
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Adds a new camera position to the loaded configuration of the currently selected model.
			 * @param {CameraPosition} camPos The new camera position.
			 * @throws {Error} No model has been selected, or camera position settings have not been loaded.
			 */
			service.addCameraPosition = function (camPos) {
				checkModelSelected();

				var camPosList = loadedSettings.data.camPos;
				if (camPosList) {
					$http.post(globals.webApiBaseUrl + 'model/main/modelconfig/createid', {
						modelId: loadedSettings.modelId
					}).then(function (val) {
						camPos.id = val.data;
						camPosList.push(camPos);
						service.modelSettingsUpdated('camPos');

						var changes = retrieveChangeJournal('camPos');
						if (!changes.items) {
							changes.items = [];
						}
						changes.items.push(camPos);
						if (!changes.addedIds) {
							changes.addedIds = [];
						}
						changes.addedIds.push(camPos.id);
						service.saveSettings();
					});
				} else {
					throw new Error('The camera position list has not been loaded.');
				}
			};

			/**
			 * @ngdoc function
			 * @name modifyCameraPosition
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Marks a camera position of the currently selected model as modified.
			 * @param {Number} camPosId The ID of the modified camera position.
			 * @throws {Error} No model has been selected, or camera position settings have not been loaded, or camPosId
			 *                 does not exist.
			 */
			service.modifyCameraPosition = function (camPosId) {
				checkModelSelected();

				var camPosList = loadedSettings.data.camPos;
				if (camPosList) {
					var camPos = _.find(loadedSettings.data.camPos, function (cp) {
						return cp.id === camPosId;
					});
					if (camPos) {
						service.modelSettingsUpdated('camPos');

						var changes = retrieveChangeJournal('camPos');
						if (!changes.items) {
							changes.items = [];
						}
						changes.items.push(camPos);
						service.saveSettings();
					} else {
						throw new Error('No camera position with ID ' + camPosId + ' was found.');
					}
				} else {
					throw new Error('The camera position list has not been loaded.');
				}
			};

			/**
			 * @ngdoc function
			 * @name deleteCameraPosition
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Marks a camera position of the currently selected model. as deleted.
			 * @param {Number} camPosId The ID of the deleted camera position.
			 * @throws {Error} No model has been selected, or camera position settings have not been loaded, or camPosId
			 *                 does not exist.
			 */
			service.deleteCameraPosition = function (camPosId) {
				checkModelSelected();

				var camPosList = loadedSettings.data.camPos;
				if (camPosList) {
					var camPosIdx = _.findIndex(loadedSettings.data.camPos, function (cp) {
						return cp.id === camPosId;
					});
					if (camPosIdx >= 0) {
						var oldCamPos = camPosList[camPosIdx];

						camPosList.splice(camPosIdx, 1);

						service.modelSettingsUpdated('camPos');

						var changes = retrieveChangeJournal('camPos');
						if (!changes.deletedIds) {
							changes.deletedIds = [];
							changes.deletedAccessScopes = [];
						}
						changes.deletedIds.push(camPosId);
						changes.deletedAccessScopes.push(oldCamPos.origScopeLevel || oldCamPos.scopeLevel);
						service.saveSettings();
					} else {
						throw new Error('No camera position with ID ' + camPosId + ' was found.');
					}
				} else {
					throw new Error('The camera position list has not been loaded.');
				}
			};

			/**
			 * @ngdoc method
			 * @name CameraPosition
			 * @constructor
			 * @methodOf CameraPosition
			 * @description Initializes a new instance.
			 * @param {String} name The name of the camera position.
			 * @param {String} scopeLevel A one-letter identifier of the intended configuration scope.
			 * @param {Number} posX The X position of the camera.
			 * @param {Number} posY The Y position of the camera.
			 * @param {Number} posZ The Z position of the camera.
			 * @param {Number} trgX The X position of the point looked at by the camera.
			 * @param {Number} trgY The Y position of the point looked at by the camera.
			 * @param {Number} trgZ The Z position of the point looked at by the camera.
			 * @param {boolean} important Indicates whether the camera position is marked as important.
			 */
			service.CameraPosition = function (name, scopeLevel, posX, posY, posZ, trgX, trgY, trgZ, important) {
				this.name = name;
				this.scopeLevel = scopeLevel;
				this.pos = {
					x: posX,
					y: posY,
					z: posZ
				};
				this.trg = {
					x: trgX,
					y: trgY,
					z: trgZ
				};
				this.important = important;
			};

			// display settings ----------------------------------------------------------------

			/**
			 * @ngdoc function
			 * @name modifyCameraPosition
			 * @function
			 * @methodOf modelViewerModelSettingsService
			 * @description Marks display settings of the currently selected model as modified.
			 * @throws {Error} No model has been selected, or the display settings have not been loaded.
			 */
			service.modifyDisplaySettings = function () {
				checkModelSelected();

				var displaySettings = loadedSettings.data.displaySettings;
				if (displaySettings) {
					storeAccessScopedChanges('displaySettings');
					service.saveSettings();
					service.modelSettingsUpdated('displaySettings');
				} else {
					throw new Error('The display settings have not been loaded.');
				}
			};

			return service;
		}]);
})(angular);
