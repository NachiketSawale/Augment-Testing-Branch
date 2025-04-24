(() => {
	'use strict';
	angular.module('cloud.desktop').factory('cloudDesktopPinningDocumentsConfigService', cloudDesktopPinningDocumentsConfigService);

	cloudDesktopPinningDocumentsConfigService.$inject= ['platformCreateUuid', 'cloudDesktopModuleTypes', '$translate', 'cloudDesktopSidebarFavoritesService', 'platformContextMenuTypes'];

	function cloudDesktopPinningDocumentsConfigService(platformCreateUuid, cloudDesktopModuleTypes, $translate, cloudDesktopSidebarFavoritesService, platformContextMenuTypes) {
		let service = {};

		service.getPinningDocumentButtonConfig = function() {
			return {
				id: 't-addpinningdocument',
				type: 'item',
				caption: $translate.instant('cloud.desktop.pinningDesktopDialogHeader'),
				iconClass: 'tlb-icons ico-pin2desktop',
				sort: 119,
				contextAreas: [platformContextMenuTypes.gridRow.type]
			};
		};

		service.getDialogOptions = function getDialogOptions(userSettings, entityInfos) {
			return {
				headerText$tr$: 'cloud.desktop.pinningDesktopDialogHeader',
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/pinning-documents-dialog.html',
				topDescription: { text: $translate.instant('cloud.desktop.pinningDesktopDialogTopDescription'), iconClass: 'tlb-icons ico-info' },
				showCancelButton: true,
				showOkButton: true,
				value: {
					userSettings: userSettings,
					entityInfos: entityInfos
				}
			};
		};

		function setSettingsDisplayName(moduleInfos, object, entityInfos) {
			if (entityInfos.settingsDisplayName) {
				object.settingsDisplayName = entityInfos.settingsDisplayName;
			} else if (moduleInfos) {
				object.settingsDisplayName = object.description ? moduleInfos.displayName.concat(' - ', object.description) : moduleInfos.displayName;
			}
		}

		service.getPinnedTileConfig = function(entityInfos, moduleInfos) {
			let object = {
				id: platformCreateUuid(),
				tileSize: 1,
				type: cloudDesktopModuleTypes.pinned,
				description: entityInfos.selectedDescription,
				description$tr$: '',
				entityInfos: entityInfos
			};

			if(entityInfos.displayName) {
				object.displayName = entityInfos.displayName;
			}

			if(entityInfos.displayName$tr$) {
				object.displayName$tr$ = entityInfos.displayName$tr$;
			}

			setSettingsDisplayName(moduleInfos, object, entityInfos);

			return object;
		};

		service.getPageEmptyObject = function getPageEmptyObject() {
			let uuid = platformCreateUuid();
			return {
				id: uuid,
				pageNameFk: undefined,
				pageName: 'Custom Desktop',
				visibility: true,
				url: '/' + uuid,
				routeUrl: globals.defaultState + '.' + uuid,
				groups: []
			};
		};

		service.getPageGroupEmptyObject = function(pinnedTilesLabel) {
			return {
				id: platformCreateUuid(),
				groupName: pinnedTilesLabel,
				moduleType: cloudDesktopModuleTypes.pinned,
				tiles: []
			};
		};

		service.getConfigForMsgBox = function(pageItem) {
			let filterName = pageItem.length === 1 ? pageItem[0].pageName : '';
			return pageItem.length === 0 ? 'cloud.desktop.pinningDesktopDialogNewPage' : $translate.instant('cloud.desktop.pinningDesktopDialogAddInPage', {pagename: filterName});
		};

		function getProjectIdByConfig(entity, isDefByConfig) {
			return isDefByConfig.projectId ? _.get(entity, isDefByConfig.projectId) : entity.ProjectFk;
		}

		function getIdByConfig(entity, isDefByConfig) {
			return isDefByConfig.id ? _.get(entity, isDefByConfig.id) : entity.Id;
		}

		function getConfigByService(dataService, isDefByConfig, config) {
			let entity = dataService.getSelected();
			let favTypConfig = {};
			favTypConfig.id = getIdByConfig(entity, isDefByConfig);

			let projectId = getProjectIdByConfig(entity, isDefByConfig);
			if (projectId) {
				favTypConfig.projectId = projectId;
			}

			angular.forEach(cloudDesktopSidebarFavoritesService.favtypeInfo, function (item, index) {
				if (item.moduleName === isDefByConfig.moduleName) {
					favTypConfig.favTyp = index;
					config.displayName = $translate.instant(item.name);
					config.displayName$tr$ = item.name;
					config.theModule = isDefByConfig.tileId || item.moduleName;
				}
			});

			if(isDefByConfig.description) {
				config.selectedDescription  = _.get(entity, isDefByConfig.description);
			}

			config.settingsDisplayName = config.selectedDescription ? config.displayName.concat(' - ', config.selectedDescription) : config.displayName;

			return favTypConfig;
		}

		service.getConfigEntityInfos = function(dataService, isDefByConfig) {
			let config = {
				selected: dataService.getSelected().Id || -1,
				selectedDescription: getDescription(dataService.getSelected()),
				theModule: (_.isString(dataService.getModule()) ? dataService.getModule() : dataService.getModule().name) || ''
			};

			if(isDefByConfig) {
				let favTypConfig = getConfigByService(dataService, isDefByConfig, config);
				config.favTypConfig = favTypConfig;
			}

			return config;
		};

		function getDescription(selectedItem) {
			if(selectedItem.DescriptionInfo) {
				return selectedItem.DescriptionInfo.Translated;
			}
			if(selectedItem.DescriptionInfo1) {
				return selectedItem.DescriptionInfo1.Translated;
			}
			if(selectedItem.Description) {
				return selectedItem.Description;
			}
			if(selectedItem.Title) {
				return selectedItem.Title;
			}
			if(selectedItem.ProjectName) {
				return selectedItem.ProjectName;
			}
			if(selectedItem.BusinessPartnerName1) {
				return selectedItem.BusinessPartnerName1;
			}
			if(selectedItem.FullName) {
				return selectedItem.FullName;
			}
			if(selectedItem.CompanyName) {
				return selectedItem.CompanyName;
			}
			if(selectedItem.BankName) {
				return selectedItem.BankName;
			}
			if(selectedItem.Name) {
				return selectedItem.Name;
			}
			if(selectedItem.Code) {
				return selectedItem.Code;
			}
		}

		return service;
	}
})();