(() => {
	'use strict';

	cloudDesktopImprovedHierarchicalService.$inject = ['platformCreateUuid', '$translate', 'platformGridAPI'];

	function cloudDesktopImprovedHierarchicalService(platformCreateUuid, $translate, platformGridAPI) {

		function getFontSizeItems() {
			return [
				{id: 0, description: 'Normal' },
				{id: 1, description: 'Large' }
			];
		}

		function getFontWeightItems() {
			return [
				{id: 0, description: 'Normal' },
				{id: 1, description: 'Bold' }
			];
		}

		function getColDefault(gridType) {
			let colItems = [
				{
					id: 'h1',
					field: 'fontSize',
					name$tr$: 'cloud.desktop.design.dataLayout.gridFontSize',
					readonly: true,
					width: 100,
					resizable: true,
					formatter: 'select',
					formatterOptions: {
						items: getFontSizeItems(),
						valueMember: 'description',
						displayMember: 'description'
					},
					editor: 'select',
					editorOptions: {
						items: getFontSizeItems(),
						valueMember: 'description',
						displayMember: 'description'
					},
					sortOrder: 2
				}, {
					id: 'h2',
					field: 'fontWeight',
					name$tr$: 'cloud.desktop.design.dataLayout.gridFontWeight',
					readonly: false,
					width: 100,
					resizable: true,
					formatter: 'select',
					formatterOptions: {
						items: getFontWeightItems(),
						valueMember: 'description',
						displayMember: 'description'
					},
					editor: 'select',
					editorOptions: {
						items: getFontWeightItems(),
						valueMember: 'description',
						displayMember: 'description'
					},
					sortOrder: 3
				}, {
					id: 'h3',
					field: 'fontColor',
					name$tr$: 'cloud.desktop.design.dataLayout.gridFontColour',
					readonly: true,
					width: 100,
					resizable: true,
					sortOrder: 4,
					formatter: 'color',
					formatterOptions: {
						showHashCode: true
					},
					editor: 'color',
					editorOptions: {
						showClearButton: false,
						showHashCode: true
					}
				}, {
					id: 'h4',
					field: 'backgroundColor',
					name$tr$: 'cloud.desktop.design.dataLayout.gridBackgroundColour',
					readonly: false,
					width: 150,
					resizable: true,
					sortOrder: 5,
					formatter: 'color',
					formatterOptions: {
						showHashCode: true
					},
					editor: 'color',
					editorOptions: {
						showClearButton: false,
						showHashCode: true
					}
				}
			];

			if(gridType === 'gridIdSSettings') {
				colItems.unshift({
					id: 'h0',
					field: 'level',
					name$tr$: 'cloud.desktop.design.dataLayout.gridLevel',
					readonly: true,
					width: 50,
					resizable: true,
					formatter: 'integer',
					sortOrder: 1
				});
			}

			return colItems;
		}

		function getCommonGridSettingRow(item, gridType) {
			let _Object = {
				id: platformCreateUuid(),
				fontSize: item.fontSize,
				fontWeight: item.fontWeight,
				fontColor: item.fontColor,
				backgroundColor: item.backgroundColor,
				level: item.level
			};

			return _Object;
		}

		function getDefaultSettingsItem(data) {
			return _.find(data.levelSettings, {'level': -1});
		}

		function getItemsForDefaultSettings(data, gridType) {
			let items = getDefaultSettingsItem(data);
			return [getCommonGridSettingRow(items, gridType)];
		}

		function getItemsForSpecificSettings(data, gridType) {
			let toReturn = [];
			let items = _.filter(data.levelSettings, function(item) { return item.level !== -1; });

			angular.forEach(items, function(level) {
				toReturn.push(getCommonGridSettingRow(level, gridType));
			});

			return toReturn;
		}

		function getGridDataDefaultSettings(gridType, data) {
			if(!data.levelSettings) {
				return;
			}

			if(gridType === 'gridIdDSettings') {
				return getItemsForDefaultSettings(data, 'gridIdDSettings');
			} else {
				return getItemsForSpecificSettings(data, gridType);
			}
		}

		function getGridConfigDefaultSettings(gridId, gridType, data) {
			return {
				columns: getColDefault(gridType),
				data: getGridDataDefaultSettings(gridType, data),
				id: gridId,
				lazyInit: true,
				enableConfigSave: false,
				options: {
					autoHeight: true,
					idProperty: 'id',
					indicator: true,
					skipPermissionCheck: true
				}
			};
		}

		function getColorSchemeItems() {
			return [
				{
					id: 0,
					description: $translate.instant('cloud.desktop.design.dataLayout.themeBlue')
				},
				{
					id: 1,
					description: $translate.instant('cloud.desktop.design.dataLayout.themeTeal')
				},
				{
					id: 2,
					description: $translate.instant('cloud.desktop.design.dataLayout.themeGreen')
				},
				{
					id: 3,
					description: $translate.instant('cloud.desktop.design.dataLayout.themeOrange')
				},
				{
					id: 4,
					description: $translate.instant('cloud.desktop.design.dataLayout.themeCustom')
				}
			];
		}

		function getFormGroups() {
			return [{
				gid: 'theme',
				header$tr$: 'cloud.desktop.design.dataLayout.groupTheme',
				isOpen: true,
				isVisible: true,
				sortOrder: 3
			}, {
				gid: 'dataselection',
				header$tr$: 'cloud.desktop.design.dataLayout.groupDataSelection',
				groupDescription$tr$: 'cloud.desktop.design.dataLayout.groupDescriptionDataSelection',
				isOpen: true,
				isVisible: true,
				sortOrder: 4
			}, {
				gid: 'readonly',
				header$tr$: 'cloud.desktop.design.dataLayout.groupReadonly',
				groupDescription$tr$: 'cloud.desktop.design.dataLayout.groupDescriptionReadonly',
				isOpen: true,
				isVisible: true,
				sortOrder: 5
			}, {
				gid: 'hierarchical',
				header$tr$: 'cloud.desktop.design.dataLayout.groupHierarchical',
				isOpen: true,
				isVisible: true,
				sortOrder: 6
			}];
		}

		function addUserSettingToFormData(formData) {
			formData.groups.unshift({
				gid: 'tool',
				header$tr$: '',
				isOpen: true,
				isVisible: true,
				sortOrder: 1
			});

			formData.rows.unshift({
				gid: 'tool',
				rid: 'useSettings',
				label$tr$: 'cloud.desktop.design.useSettings',
				type: 'boolean',
				visible: true,
				sortOrder: 1,
				model: 'data.useSettings'
			});

			return formData;
		}

		function getNewRow(item) {
			return {
				id: platformCreateUuid(),
				fontSize: item.fontSize,
				fontWeight: item.fontWeight,
				fontColor: item.fontColor,
				backgroundColor: item.backgroundColor
			};
		}

		function addNewSpecificLevelInGrid(gridId, data) {
			let item = _.clone(getDefaultSettingsItem(data));
			item.level = data.levelSettings.length - 1;
			let newLine = getCommonGridSettingRow(item, 'gridIdSSettings');
			data.levelSettings.push(newLine);

			platformGridAPI.rows.add({gridId: gridId, item: newLine});
			platformGridAPI.rows.scrollIntoViewByItem(gridId, newLine);
		}

		function removeNewSpecificLevelInGrid(gridId, data) {
			let selectedEntity = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: false
			});

			if(selectedEntity) {
				data.levelSettings = data.levelSettings.filter((level) => level.level !== selectedEntity.level);
				platformGridAPI.rows.delete({gridId: gridId, item: selectedEntity});
				platformGridAPI.grids.refresh(gridId, true);
			}
		}

		return {
			getGridConfigDefaultSettings: getGridConfigDefaultSettings,
			getColorSchemeItems: getColorSchemeItems,
			getFormGroups: getFormGroups,
			getGridDataDefaultSettings: getGridDataDefaultSettings,
			addUserSettingToFormData: addUserSettingToFormData,
			addNewSpecificLevelInGrid: addNewSpecificLevelInGrid,
			removeNewSpecificLevelInGrid: removeNewSpecificLevelInGrid
		};
	}

	angular.module('cloud.desktop').factory('cloudDesktopImprovedHierarchicalService', cloudDesktopImprovedHierarchicalService);

})();