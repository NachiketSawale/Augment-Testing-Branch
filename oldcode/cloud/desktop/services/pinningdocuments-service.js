(() => {
	'use strict';
	angular.module('cloud.desktop').factory('cloudDesktopPinningDocumentsService', cloudDesktopPinningDocumentsService);

	cloudDesktopPinningDocumentsService.$inject= ['platformDialogService', 'cloudDesktopDesktopLayoutSettingsService',
		'cloudDesktopUserSettingsService', 'cloudDesktopTilesConfig', 'cloudDesktopPinningDocumentsConfigService', 'cloudDesktopModuleTypes', '$q'];

	function cloudDesktopPinningDocumentsService(platformDialogService, cloudDesktopDesktopLayoutSettingsService,
		cloudDesktopUserSettingsService, cloudDesktopTilesConfig, cloudDesktopPinningDocumentsConfigService, cloudDesktopModuleTypes, $q) {
		let service = {};
		let pinnedTilesLabel = 'Pinned Tiles';
		let userType = 'user';

		function showToolbarButton(dataService) {
			if(!cloudDesktopDesktopLayoutSettingsService.hasWritePermission(userType)) {
				return true;
			}
			if(dataService.getModule()) {
				let moduleName = _.isString(dataService.getModule()) ? dataService.getModule() : dataService.getModule().name;
				return !getModuleInfosFromConfig(moduleName) || getBlackList(moduleName);
			}
			return false;
		}

		function getBlackList(moduleName) {
			// Quick Fallback Solution for Rel 6.1
			let blackListArray = ['scheduling.main', 'estimate.main', 'model.main', 'model.map', 'model.annotation', 'model.changeset', 'boq.wic', 'documents.import',
				'mtwo.controltower', 'procurement.orderproposals', 'timekeeping.timeallocation', 'sales.billing', 'productionplanning.item', 'productionplanning.product',
				'productionplanning.cadimport', 'basics.material', 'basics.unit', 'basics.currency', 'basics.characteristic', 'qto.formula', 'basics.taxcode', 'basics.textmodules',
				'basics.pricecondition', 'basics.procurementconfiguration', 'mtwo.controltowerconfiguration', 'basics.riskregister', 'mtwo.chatbot', 'basics.salestaxcode',
				'basics.customize', 'productionplanning.ppsmaterial', 'basics.efbsheets', 'productionplanning.eventconfiguration', 'privacy.main', 'basics.materialcatalog',
				'controlling.controllingunittemplate', 'model.evaluation'];

			return blackListArray.includes(moduleName);

		}

		service.getPinningDocumentButton = function(dataService, isDefByConfig) {
			if(showToolbarButton(dataService)) {
				return undefined;
			}

			function checkIsPinningDisabled() {
				if (dataService && dataService.getSelectedEntities().length < 2) {
					const selected = dataService.getSelected();
					return (!(selected && selected.Id));
				}
				return true;
			}

			let docuPin = {
				disabled: checkIsPinningDisabled,
				fn: function () {
					cloudDesktopUserSettingsService.loadData().then(function (data) {
						openDialogForPinningDocument(data, cloudDesktopPinningDocumentsConfigService.getConfigEntityInfos(dataService, isDefByConfig));
					});
				}
			};

			return _.assign(cloudDesktopPinningDocumentsConfigService.getPinningDocumentButtonConfig(), docuPin);
		};

		function getTileItemFromConfig(groups, id) {
			let tile;
			for(let i = 0; i < groups.length; i++) {
				tile = groups[i].tiles.find( tile => tile.id.toLowerCase() === id.toLowerCase() );
				if(tile) {
					break;
				}
			}
			return tile;
		}

		function getModuleInfosFromConfig(moduleId) {
			let allTiles = _.cloneDeep(cloudDesktopTilesConfig);
			let tileFromConfig;

			for(let i = 0; i < allTiles.length; i++) {
				tileFromConfig = getTileItemFromConfig(allTiles[i].groups, moduleId);
				if(tileFromConfig) {
					break;
				}
			}
			return tileFromConfig;
		}

		function existUserDesktopLayout(content, selectedUserPage) {
			let page = _.find(content, {'id': selectedUserPage});

			if(!page) {
				content.push(cloudDesktopPinningDocumentsConfigService.getPageEmptyObject());
				page = content[0];
			}

			// usecase --> settingsdilaog -> page is there but not tile --> none url for desktop
			cloudDesktopDesktopLayoutSettingsService.extendStateProvider(content);
			return page;
		}

		function getPinningGroup(page) {
			// let index = _.findIndex(page.groups, {'groupName': pinnedTilesLabel});
			let index = _.findIndex(page.groups, {'moduleType': cloudDesktopModuleTypes.pinned});

			if(index > -1) {
				return page.groups[index];
			}
			else {
				page.groups.push(cloudDesktopPinningDocumentsConfigService.getPageGroupEmptyObject(pinnedTilesLabel));
				return page.groups[page.groups.length - 1];
			}
		}

		function getDesktopUserCount(userSettings) {
			return userSettings.items.desktopSettings.user.content;
		}

		function openDialogForPinningDocument(userSettings, entityInfos) {

			function createPinnedTile(userSettings, entityInfos) {
				let pageContent = userSettings.items.desktopSettings.user.content;
				let selectedUserPage = entityInfos.userPage;

				let moduleInfosFromConfig = getModuleInfosFromConfig(entityInfos.theModule);
				_.assign(moduleInfosFromConfig, cloudDesktopPinningDocumentsConfigService.getPinnedTileConfig(entityInfos, moduleInfosFromConfig));

				// If the module is not a desktop-tile
				if(!moduleInfosFromConfig && _.isNil(entityInfos.favTypConfig)) {
					return $q.when(undefined);
				}

				// check page
				let content = existUserDesktopLayout(pageContent, selectedUserPage);

				// add tile in group
				getPinningGroup(content).tiles.push(moduleInfosFromConfig);

				// information for saving
				userSettings.items.desktopSettings.user.__changed = true;

				// Save in DB
				return cloudDesktopUserSettingsService.saveData(userSettings).then(function (result) {
					if (result && result.exceptions && result.exceptions.length > 0) {
						platformDialogService.showMsgBox(result.exceptionMessage, 'cloud.desktop.design.errors.actionUnsuccessful', 'info');
					}
				});
			}

			let pageItem = getDesktopUserCount(userSettings);

			if(pageItem.length > 1) {
				let dialogOption = cloudDesktopPinningDocumentsConfigService.getDialogOptions(userSettings, entityInfos);

				platformDialogService.showDialog(dialogOption).then(function (result) {
					if (result.ok) {
						createPinnedTile(result.value.userSettings, result.value.entityInfos);
					}
				});
			} else {
				entityInfos.userPage = pageItem.length === 1 ? pageItem[0].id : -1;
				createPinnedTile(userSettings, entityInfos).then(function() {
					let modalDialogId = '37b042989d8b4c7ab5c35b82ddb9b0ba';
					let dontShowAgain = {
						showOption: true,
						defaultActionButtonId: 'ok'
					};
					// scope.getUiAddOns().getAlarm().show(cloudDesktopPinningDocumentsConfigService.getConfigForMsgBox(pageItem));
					platformDialogService.showMsgBox(cloudDesktopPinningDocumentsConfigService.getConfigForMsgBox(pageItem), 'cloud.desktop.pinningDesktopDialogHeader', 'info', modalDialogId, dontShowAgain);
				});
			}
		}

		return service;
	}
})();