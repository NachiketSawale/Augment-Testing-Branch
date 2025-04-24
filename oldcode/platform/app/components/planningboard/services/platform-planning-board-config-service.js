(function () {

	'use strict';

	angular.module('platform').service('platformPlanningBoardConfigService', PlatformPlanningBoardConfigService);

	PlatformPlanningBoardConfigService.$inject = ['_', '$injector',
		'platformMasterDetailDialogService',
		'platformPlanningBoardDialogConfigService',
		'mainViewService',
		'$timeout',
		'$translate',
		'platformPlanningBoardTagGridConfigService',
		'platformGridAPI',
		'platformPlanningBoardSettingDefaultValuesService'];

	function PlatformPlanningBoardConfigService(_, $injector,
		platformMasterDetailDialogService,
		platformPlanningBoardDialogConfigService,
		mainViewService,
		$timeout,
		$translate,
		platformPlanningBoardTagGridConfigService,
		platformGridAPI,
		platformPlanningBoardSettingDefaultValuesService) {

		var self = this;
		var delayedSaveTimeout = 0;
		var containerUUID;

		self.onSettingsChanged = new Platform.Messenger();
		self.onSettingsChangedStarted = new Platform.Messenger();

		self.registerOnSettingsChanged = function (fn) {
			self.onSettingsChanged.register(fn);
		};

		self.unregisterOnSettingsChanged = function (fn) {
			self.onSettingsChanged.unregister(fn);
		};

		self.registerOnSettingsChangedStarted = function (fn) {
			self.onSettingsChangedStarted.register(fn);
		};

		self.unregisterOnSettingsChangedStarted = function (fn) {
			self.onSettingsChangedStarted.unregister(fn);
		};

		var dialogConfig = {};

		var defaultValues = platformPlanningBoardSettingDefaultValuesService.getDefaultValues();

		let defaultValuesByUUID = {};

		self.getUUID = function getUUID(uuid) {
			if (uuid) {
				containerUUID = uuid;
			}
			return containerUUID;
		};

		self.getConfigByUUID = function (containerUUID, assignmentMappingService, demandMappingService) {
			platformPlanningBoardDialogConfigService.setDialogConfig(containerUUID, assignmentMappingService, demandMappingService);
			dialogConfig = platformPlanningBoardDialogConfigService.getDialogConfig(containerUUID);
			self.getUUID(containerUUID);
			var settings = mainViewService.customData(containerUUID, 'planningBoardSettings');
			mainViewService.customData(containerUUID, 'planningBoardSettings', settings);
			_.forEach(dialogConfig.items, function (dconfig) {
				if (defaultValuesByUUID[containerUUID].hasOwnProperty(dconfig.id)) {
					_.assign(dconfig, defaultValuesByUUID[containerUUID][dconfig.id]);
				}
			});

			if (_.isUndefined(settings)) {
				settings = prepareCustomData(dialogConfig.items);
				mainViewService.customData(containerUUID, 'planningBoardSettings', settings);
			} else {
				settings[0] = mergeSavedSettings(settings, defaultValuesByUUID[containerUUID]['planningBoard.chart.presentation.settings']);
			}

			let tagConfig = defaultValuesByUUID[containerUUID]['planningBoard.chart.presentation.settings'].tagConfig;
			_.forEach(tagConfig, function (config) {
				// replace name with default translation name
				config.name = $translate.instant(_.find(tagConfig, { id: config.id }).name);
			});

			return settings;
		};

		function mergeSavedSettings(settings, defaultValues) {

			function recursiveSettingMerge(defaultSettings, savedSettings) {
				if (!_.isArray(defaultSettings) && !_.isObject(defaultSettings)) {
					defaultSettings = savedSettings;
				} else {
					let defaultMerged = new Map();
					let savedMerged = new Map();
					if (_.isArray(defaultSettings)) {
						defaultMerged = new Map(defaultSettings.map((value, index) => [value.id || index, value]));
						savedMerged = new Map(savedSettings.map((value, index) => [value.id || index, value]));
					} else {
						defaultMerged = new Map(Object.entries(defaultSettings));
						savedMerged = new Map(Object.entries(savedSettings));
					}
					for (let [key, val] of defaultMerged) {
						if (savedMerged.has(key)) {
							savedMerged.set(key, recursiveSettingMerge(val, savedMerged.get(key)));
						} else {
							savedMerged.set(key, val);
						}
					}
					savedSettings = Object.fromEntries(savedMerged.entries());
				}
				return defaultSettings;
			};

			const flatSettingList = settings.reduce(((r, c) => Object.assign(r, c)), {});
			recursiveSettingMerge(_.cloneDeep(defaultValues), flatSettingList);
			let mergedSetting = flatSettingList;
			mergedSetting['id'] = 'planningBoard.chart.presentation.settings';
			return mergedSetting;
		}

		self.show = function show(containerUUID) {
			dialogConfig = platformPlanningBoardDialogConfigService.getDialogConfig(containerUUID);
			let planningBoardDataService = $injector.get('platformPlanningBoardDataService');
			var assignmentMappingService = planningBoardDataService.getPlanningBoardDataServiceByUUID(containerUUID).getAssignmentConfig().mappingService;
			var planningBoardSettingsList = self.getConfigByUUID(containerUUID, assignmentMappingService);

			let supplierConfig = planningBoardDataService.getPlanningBoardDataServiceByUUID(containerUUID).getSupplierConfig();
			if (planningBoardSettingsList) {
				_.each(planningBoardSettingsList, function (planningBoardSetting, index) {
					angular.extend(dialogConfig.items[index], planningBoardSetting);

					if (dialogConfig.items[index].tagConfig) {
						setTagConfigForGrid(dialogConfig.items[index].tagConfig);
						// set state of tagConfig grid
						dialogConfig.items[index].tagConfig.state = platformPlanningBoardTagGridConfigService.uuid;
					}
				});
			} else {
				angular.extend(dialogConfig.items[0], defaultValuesByUUID[containerUUID]);
			}


			// add custom supplier config
			addCustomSupplierConfig(dialogConfig, supplierConfig);

			return platformMasterDetailDialogService.showDialog(dialogConfig).then(function (result) {
				if (result.ok === true) {
					// take all items when one has changed
					var customData = prepareCustomData(result.value.items);
					return saveContainerCustomData(containerUUID, customData);
				}

			}, function (result) {
				// $dismissed dialog
				if (result === 'cancel') {
					platformGridAPI.grids.unregister(platformPlanningBoardTagGridConfigService.uuid);
				}
			});
		};

		self.updateSettingsRowHeight = function updateSettingsLineHeight(containerUUID, newLineHeight) {
			clearTimeout(delayedSaveTimeout);
			delayedSaveTimeout = setTimeout(delayedSaveSetting, 300, containerUUID, newLineHeight);
		};

		/**
		 * @name prepareCustomDataAndSaveSettings
		 *
		 * @param settingsList - list of Planning Board Settings to be saved
		 * @param containerUUID - UUID of Planning Board Settings dialog
		 * @param saveOnly - when 'true' the settings will be saved without triggering the 'onSettingsChangedStarted' event (event triggers redrawing of the PB)
		 * @return {*}
		 */
		self.prepareCustomDataAndSaveSettings = function (settingsList, containerUUID, saveOnly) {
			// take all items when one has changed
			var customData = prepareCustomData(settingsList);
			return saveContainerCustomData(containerUUID, customData, saveOnly);
		};

		function addCustomSupplierConfig(dialogConfig, supplierConfig) {
			// add to gridSettings
			let gridSettings = _.find(dialogConfig.items, { id: 'planningBoard.chart.gridSettings' });
			if (!_.isNil(gridSettings) && !_.isNil(supplierConfig.customSupplierConfig) && !_.isNil(supplierConfig.customSupplierConfig.rows)) {

				gridSettings.form.rows = _.unionBy(gridSettings.form.rows, supplierConfig.customSupplierConfig.rows);
			}
		}

		/**
		 * @name saveContainerCustomData
		 *
		 * @param containerUUID - UUID of Planning Board Settings dialog
		 * @param customData - object containing the list of Planning Board settings to be saved
		 * @param saveOnly - when 'true' the settings will be saved without triggering the 'onSettingsChangedStarted' event (event triggers redrawing of the PB)
		 * @return {*}
		 */
		function saveContainerCustomData(containerUUID, customData, saveOnly) {
			if(!saveOnly) {
				self.onSettingsChangedStarted.fire(customData, containerUUID);
			}
			return mainViewService.customData(containerUUID, 'planningBoardSettings', customData).then(function () {
				if(!saveOnly) {
					self.onSettingsChanged.fire(customData, containerUUID);
				}
			});
		}

		function delayedSaveSetting(containerUUID, newLineHeight) {
			let planningBoardDataService = $injector.get('platformPlanningBoardDataService');
			var assignmentMappingService = planningBoardDataService.getPlanningBoardDataServiceByUUID(containerUUID).getAssignmentConfig().mappingService;

			var planningBoardSettingsList = self.getConfigByUUID(containerUUID, assignmentMappingService);
			if (planningBoardSettingsList) {
				planningBoardSettingsList[0].rowHeight = newLineHeight;
				return saveContainerCustomData(containerUUID, planningBoardSettingsList);
			}
		}

		function prepareCustomData(changedSettingsList) {
			if (changedSettingsList) {
				var chartSettingsList = _.cloneDeep(changedSettingsList);
				var settings2Save = [];
				_.each(chartSettingsList, function prepareCustomData(chartSetting) {
					delete chartSetting.form;
					delete chartSetting.$$hashKey;
					settings2Save.push(chartSetting);
				});
				return settings2Save;
			}
		}

		function setTagConfigForGrid(config) {
			var data = [];
			_.forEach(config, function (d, idx) {
				if (idx !== 'state') {
					data.push(d);
				}
			});
			if (platformGridAPI.grids.exist(platformPlanningBoardTagGridConfigService.uuid)) {
				platformPlanningBoardTagGridConfigService.updateData(data);
			}
		}

		self.getDefaultConfigValues = function (uuid) {
			if (uuid) {
				return _.cloneDeep(defaultValuesByUUID[uuid]);
			}

			if (defaultValues) {
				return _.cloneDeep(defaultValues);
			}
		};

		self.setDefaultConfigValues = function (customDefaultValues, uuid) {
			defaultValuesByUUID[uuid] = customDefaultValues;
		};

	}
})(angular);