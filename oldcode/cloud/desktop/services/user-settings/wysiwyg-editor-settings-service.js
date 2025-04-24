/**
 * Created by alisch on 07.05.2020.
 */
(function () {
	'use strict';

	platformWysiwygEditorSettingsService.$inject = ['$http', '$q', '_', 'cloudDesktopSettingsState', 'platformRuntimeDataService', 'platformPermissionService', '$translate', 'cloudDesktopSettingsUserTypes', 'platformGridAPI', 'platformManualGridService', '$timeout', 'platformCreateUuid', 'platformDialogService', 'platformTranslateService', 'platformGridDialogService', 'cloudDesktopSystemFonts', 'cloudDesktopTextEditorConsts'];

	function platformWysiwygEditorSettingsService($http, $q, _, dataStates, platformRuntimeDataService, platformPermissionService, $translate, userTypes, platformGridAPI, manualGridService, $timeout, platformCreateUuid, platformDialogService, platformTranslateService, platformGridDialogService, cloudDesktopSystemFonts, cloudDesktopTextEditorConsts) {
		const settingsKey = 'wysiwygEditorSettings'; // the property name of settings within the user settings object
		const accessRightIdUser = '71e7b89ac5cc40f6bd1544f80d47ae15';
		const accessRightIdSystem = '18272044cb264e6693d0f696f44ea6ac';
		const accessRightDescriptors = [accessRightIdUser, accessRightIdSystem];
		var cachedPromise, cachedSettings;
		var lastSettingsChange;
		const gridIdFonts = '5643878c9e8611eabb370242ac130002';
		const gridIdButtons = '65f1e02a9e8611eabb370242ac130002';
		const gridIdFontSizes = '5643878c9e8611eabb370242ac130011';
		let wysiwygEditorSettingsTypes = [userTypes.system, userTypes.user];

		var systemFonts = cloudDesktopSystemFonts;

		var buttons = cloudDesktopTextEditorConsts.buttons;
		var alignments = cloudDesktopTextEditorConsts.alignments;
		var units = cloudDesktopTextEditorConsts.units;
		var unitLabel;

		platformPermissionService.loadPermissions(accessRightDescriptors);
		platformTranslateService.translateObject(buttons);
		platformTranslateService.translateObject(alignments, 'caption');
		platformTranslateService.translateObject(units, 'caption');

		/**
		 * @ngdoc function
		 * @name getMasterItemId
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Returns the id of the master item object of the specified user typ.
		 * @param { string } userType The type of the user
		 * @return { string } The id of the master item object
		 */
		// function getMasterItemId() {
		// 	return settingsKey;
		// }
		function getMasterItemId(userType) {
			return _.includes(wysiwygEditorSettingsTypes, userType) ? settingsKey + _.capitalize(userType) : undefined;
		}

		/**
		 * @ngdoc function
		 * @name convertToTransferable
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Converts the settings from the UserSettings-object to the transportable format. This is necessary to save the data into the db.
		 * @param {Object} userSettings The User Settings data.
		 * @param {requestCallback} deleteFunc The function to delete the whole setting data for this service
		 * @param {Boolean} removeUnchanged When true unchanged settings will be removed from object.
		 */
		function convertToTransferable(userSettings, removeUnchanged) {
			if (!userSettings) {
				return;
			}

			// delete unchanged items
			if (removeUnchanged) {
				_.forEach(wysiwygEditorSettingsTypes, function (type) {
					if (!userSettings[type] || !userSettings[type].__changed) {
						delete userSettings[type];
					}
				});
			}

			// delete unchanged items
			// if (removeUnchanged) {
			// 	wysiwygEditorSettingsTypes.forEach(function (type) {
			// 		if (userSettings[type]) {
			// 			if (!userSettings[type].__changed) {
			// 				deleteFunc(settingsKey);
			// 				return;
			// 			}
			// 		}});

			// }

			// // delete unknown properties
			// for (var property in userSettings) {
			// 	if (userSettings.hasOwnProperty(property)) {
			// 		if (!_.includes(userSettings, property)) {
			// 			delete userSettings[property];
			// 		}
			// 	}
			// }

			// userSettings.buttons = _.map(userSettings.buttons, function (button) {
			// 	return {
			// 		id: button.id,
			// 		visibility: button.visibility
			// 	};
			// });

		}


		/**
		 * @ngdoc function
		 * @name hasWritePermission
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Returns a bool value which indicates whether the user has write permissions
		 * @param { Object } userType The type of the user
		 * @return {bool} True, when system user has write permissions
		 */
		function hasWritePermission(userType) {
			switch (userType) {
				case userTypes.user:
					return platformPermissionService.hasWrite(accessRightIdUser, true);
				case userTypes.system:
					return platformPermissionService.hasWrite(accessRightIdSystem, true);
				default:
					return false;
			}
		}

		/**
		 * @ngdoc function
		 * @name getMasterItem
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Returns an master item object for the settings dialog definition.
		 * @return {object} The master item object
		 */
		function getMasterItem(editableData, userType) { // jshint ignore:line
			switch (userType) {
				case userTypes.user:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('platform.wysiwygEditor.settings.miSystem'),
						data: editableData.items[settingsKey].user,
						visible: hasWritePermission(userType),
						form: getUserFormData(editableData.items[settingsKey].user)
					};
				case userTypes.system:
					return {
						Id: getMasterItemId(userType),
						name: $translate.instant('platform.wysiwygEditor.settings.miSystem'),
						data: editableData.items[settingsKey].system,
						visible: hasWritePermission(userType),
						form: getFormData(editableData.items[settingsKey].system, editableData)
					};
				default:
					return undefined;
			}
		}

		/**
		 * @ngdoc function
		 * @name getFormData
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Returns the config object for the form-generator
		 * @return {Object} The config object
		 */
		function getFormData(data, editableData) { // jshint ignore:line
			var formConfig;

			function getInitializer(gridId) {

				if (!platformGridAPI.grids.exist(gridId)) {
					var gridConfig = {
						columns: getColDef(gridId),
						// data: _.get(data, 'grids.fonts') || [],
						data: [],
						id: gridId,
						lazyInit: true,
						enableConfigSave: false,
						options: {
							autoHeight: true,
							idProperty: 'id',
							// editable: gridId !== gridIdTiles,
							indicator: true,
							skipPermissionCheck: true
						}
					};
					switch (gridId) {
						case gridIdFonts:
							gridConfig.data = data.fonts || [];
							platformGridAPI.events.register(gridId, 'onRenderCompleted', handleGridFontsOnRenderCompleted);
							platformGridAPI.events.register(gridId, 'onCellChange', handleGridOnCellChanged);
							break;
						case gridIdFontSizes:
							gridConfig.data = data.fontSizes || [];
							platformGridAPI.events.register(gridId, 'onRenderCompleted', handleGridFontSizesOnRenderCompleted);
							platformGridAPI.events.register(gridId, 'onCellChange', handleGridOnCellChanged);
							break;
						case gridIdButtons:
							gridConfig.data = data.buttons || [];
							platformGridAPI.events.register(gridId, 'onRenderCompleted', handleGridButtonsOnRenderCompleted);
							platformGridAPI.events.register(gridId, 'onCellChange', handleGridOnCellChanged);
							break;
					}

					platformGridAPI.grids.config(gridConfig);

					return function () {
						onDestroyGrid(gridId);
					};
				}
			}

			function onDestroyGrid(gridId) {
				if (platformGridAPI.grids.exist(gridId)) {

					switch (gridId) {
						case gridIdFonts:
							platformGridAPI.events.unregister(gridId, 'onRenderCompleted', handleGridFontsOnRenderCompleted);
							platformGridAPI.events.unregister(gridId, 'onCellChange', handleGridOnCellChanged);
							break;
						case gridIdFontSizes:
							platformGridAPI.events.unregister(gridId, 'onRenderCompleted', handleGridFontSizesOnRenderCompleted);
							platformGridAPI.events.unregister(gridId, 'onCellChange', handleGridOnCellChanged);
							break;
						case gridIdButtons:
							platformGridAPI.events.unregister(gridId, 'onRenderCompleted', handleGridButtonsOnRenderCompleted);
							platformGridAPI.events.unregister(gridId, 'onCellChange', handleGridOnCellChanged);
							break;
					}

					platformGridAPI.grids.unregister(gridId);
				}
			}

			function handleGridOnCellChanged() {
				// only to set the form to changed true
				setChanged(data);
				platformGridAPI.events.unregister(gridIdFonts, 'onCellChange', handleGridOnCellChanged);
				platformGridAPI.events.unregister(gridIdButtons, 'onCellChange', handleGridOnCellChanged);
				platformGridAPI.events.unregister(gridIdFontSizes, 'onCellChange', handleGridOnCellChanged);
			}

			function handleGridFontsOnRenderCompleted() {
				$timeout(function () {
					manualGridService.selectRowByIndex(gridIdFonts, 0);
				}, 0);

				platformGridAPI.events.unregister(gridIdFonts, 'onRenderCompleted', handleGridFontsOnRenderCompleted);
			}

			function handleGridFontSizesOnRenderCompleted() {
				$timeout(function () {
					manualGridService.selectRowByIndex(gridIdFontSizes, 0);
				}, 0);

				platformGridAPI.events.unregister(gridIdFontSizes, 'onRenderCompleted', handleGridFontsOnRenderCompleted);
			}

			function handleGridButtonsOnRenderCompleted() {
				$timeout(function () {
					manualGridService.selectRowByIndex(gridIdButtons, 0);
				}, 0);

				platformGridAPI.events.unregister(gridIdButtons, 'onRenderCompleted', handleGridFontsOnRenderCompleted);
			}

			function prepareGrid(gridId, scope) {
				scope.$on('$destroy', function () {
					onDestroyGrid(gridId);
				});
			}

			function setChanged(data) {
				data.__changed = true;
			}

			function setFontsToDropdown() {
				// set fonts to dropdown list
				var obj = _.find(formConfig.rows, {rid: 'defaultFont'});
				obj.options.items = getCurrentFonts(data);

				// if font doesn't exist in dropdown list then first item will be selected
				data.defaultFont = _.get(_.find(obj.options.items, {fontFamily: data.defaultFont}), 'fontFamily') || _.get(obj, 'options.items[0].fontFamily');
			}

			function setDocumentViewForm(newVal, oldVal) {
				let obj = _.find(formConfig.rows, {rid: 'unitOfMeasurement'});
				unitLabel = _.get(_.find(obj.options.items, {value: newVal}), 'caption');
				let documentWidth = convertInRequiredUnit(newVal, oldVal, data.documentWidth);
				let documentPadding = convertInRequiredUnit(newVal, oldVal, data.documentPadding);
				data.documentWidth = documentWidth;
				data.documentPadding = documentPadding;
			}

			function setFontSizesToDropdown() {
				// set fontsize to dropdown list
				let obj = _.find(formConfig.rows, {rid: 'defaultFontSize'});
				obj.options.items = getCurrentFontSizes(data);

				// if fontsize doesn't exist in dropdown list then first item will be selected
				data.defaultFontSize = _.get(_.find(obj.options.items, {size: data.defaultFontSize}), 'size') || _.get(obj, 'options.items[0].size');
			}

			formConfig = {
				fid: 'platform.wysiwygEditorSettings.form',
				version: '1.0.0',
				showGrouping: true,
				initializers: [function () {
					// var item = _.get(scope, selectedItemPath);
					return getInitializer(gridIdFonts);
				}, function () {
					return getInitializer(gridIdFontSizes);
				},
				function () {
					return getInitializer(gridIdButtons);
				}, function (scope, selectedItemPath) {
					return scope.$watch(selectedItemPath + '.data.showSystemFonts', function () {
						setFontsToDropdown();
					});
				}, function (scope, selectedItemPath) {
					return scope.$watch(selectedItemPath + '.data.unitOfMeasurement', function (newVal, oldVal) {
						if (newVal !== oldVal) {
							setDocumentViewForm(newVal, oldVal);
							let unit = units.find(item => item.value === newVal);
							scope.formOptions.configure.groupsDict.docview.rows.forEach(function (row) {
								row.options.decimalPlaces = unit.decimal;
							});
							scope.formOptions.configure.groupsDict.docview.header = $translate.instant('platform.wysiwygEditor.settings.groupDocview') + ' (' + unitLabel + ')';
							scope.$broadcast('form-config-updated');
						}
					});
				}],
				groups: [{
					gid: 'fonts',
					header$tr$: 'platform.wysiwygEditor.settings.groupFonts',
					isOpen: true,
					isVisible: true,
					sortOrder: 1
				}, {
					gid: 'fontSizes',
					header$tr$: 'platform.wysiwygEditor.settings.fontSize',
					isOpen: true,
					isVisible: true,
					sortOrder: 2
				}, {
					gid: 'buttons',
					header$tr$: 'platform.buttons',
					isOpen: true,
					isVisible: true,
					sortOrder: 5
				}],
				rows: [{
					gid: 'fonts',
					rid: 'gridFonts',
					visible: true,
					sortOrder: 2,
					model: 'data.grids.fonts',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						tools: getFontTools(editableData, data),
						gridConfig: {id: gridIdFonts},
						//height: '120px'
					}
				}, {
					gid: 'fontSizes',
					rid: 'gridFontSizes',
					visible: true,
					sortOrder: 2,
					model: 'data.grids.fontSizes',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						tools: getFontSizesTools(editableData, data),
						gridConfig: {id: gridIdFontSizes},
						//height: '120px'
					}
				}, {
					gid: 'buttons',
					rid: 'gridButtons',
					visible: true,
					sortOrder: 3,
					model: 'data.grids.buttons',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						gridId: gridIdButtons,
						//height: '270px'
					}
				}, {
					gid: 'general',
					rid: 'showSystemFonts',
					label: 'Show System Fonts',
					label$tr$: 'platform.wysiwygEditor.settings.showSystemFonts',
					visible: true,
					sortOrder: 5,
					model: 'data.showSystemFonts',
					type: 'boolean'
				}, {
					gid: 'general',
					rid: 'showRuler',
					label: 'Show Ruler',
					label$tr$: 'platform.wysiwygEditor.settings.showRuler',
					visible: true,
					sortOrder: 6,
					model: 'data.showRuler',
					type: 'boolean'
				}]
			};

			// Check whether defaults exist
			data.defaultFontSize = _.get(_.find(data.fontSizes, {size: data.defaultFontSize}), 'size') || data.fontSizes[0].size;

			mergeFormConfigs(formConfig, getGeneralFormConfig(data, 'data'), getDocumentViewConfig(data, 'data'));

			formConfig.prepareData = function (item, scope) {
				// this will be executed once, when changing to this masterItem first
				scope.dataLoading = true;
				item.data.grids = {
					fonts: {
						state: gridIdFonts
					},
					fontSizes: {
						state: gridIdFontSizes
					},
					buttons: {
						state: gridIdButtons
					}
				};

				// data.grids.buttons

				prepareGrid(gridIdFonts, scope);
				prepareGrid(gridIdFontSizes, scope);
				prepareGrid(gridIdButtons, scope);

				// Fonts for the defaultFont dropdown
				setFontsToDropdown();
				scope.dataLoading = false;
			};

			function showNewFontFamilyDialog() {
				return showEditFontFamilyDialog();
			}

			function showEditFontFamilyDialog(item) {
				const gridSourcesId = '74e6bf64aa5811eabb370242ac130002';

				const fontWeightOptions = [
					{css: 'normal', description: $translate.instant('platform.wysiwygEditor.settings.normal')},
					{css: 'bold', description: $translate.instant('platform.wysiwygEditor.settings.weightBold')}
				];

				const fontStyleOptions = [
					{css: 'normal', description: $translate.instant('platform.wysiwygEditor.settings.normal')},
					{
						css: 'italic',
						description: $translate.instant('platform.wysiwygEditor.settings.styleItalic')
					}
				];

				const cols = [
					{
						id: 'p3',
						field: 'url',
						name: 'Url',
						name$tr$: 'platform.wysiwygEditor.settings.colUrl',
						readonly: false,
						width: 300,
						maxLength: 255,
						resizable: true,
						formatter: 'description',
						editor: 'description',
						sortOrder: 10
					}, {
						id: 'p4',
						field: 'fontWeight',
						name: 'Font Weight',
						name$tr$: 'platform.wysiwygEditor.settings.colWeight',
						formatter: 'select',
						formatterOptions: {
							items: fontWeightOptions,
							valueMember: 'css',
							displayMember: 'description'
						},
						editor: 'select',
						editorOptions: {
							items: fontWeightOptions,
							valueMember: 'css',
							displayMember: 'description'
						},
						visible: true,
						sortOrder: 15,
					}, {
						id: 'p5',
						field: 'fontStyle',
						name$tr$: 'platform.wysiwygEditor.settings.colStyle',
						visible: true,
						sortOrder: 20,
						formatter: 'select',
						formatterOptions: {
							items: fontStyleOptions,
							valueMember: 'css',
							displayMember: 'description'
						},
						editor: 'select',
						editorOptions: {
							items: fontStyleOptions,
							valueMember: 'css',
							displayMember: 'description'
						}
					}];

				const dialogConfig = {
					headerText: item ? $translate.instant('platform.wysiwygEditor.settings.editFontFamily') + ': ' + (item.displayName || item.fontFamily) : $translate.instant('platform.wysiwygEditor.settings.addFontFamily'),
					width: '70%',
					minWidth: '500px',
					// width: '500px',
					showCancelButton: true,
					resizeable: true,
					backdrop: 'static',
					// isReadOnly: false,
					bodyFlexColumn: true,
					bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/cloud-desktop-edit-font-family-body.html',
					// windowClass: 'grid-dialog',
					gridId: gridSourcesId,
					columns: cols,
					items: _.get(item, 'sources') || [],
					value: item || {},
					indicator: true,
					tree: false,
					idProperty: 'id',
					tools: {
						showImages: true,
						showTitles: true,
						cssClass: 'tools ',
						items: [
							{
								id: 'z1',
								sort: 10,
								caption: 'platform.wysiwygEditor.settings.toolAddRecord',
								iconClass: 'tlb-icons ico-rec-new',
								type: 'item',
								fn: function () {
									manualGridService.addNewRowInGrid(gridSourcesId, {
										id: platformCreateUuid(),
										url: '../cdn/custom/fonts/myfont.woff',
										fontStyle: 'normal',
										fontWeight: 'normal'
									});
								}
							},
							{
								id: 'z2',
								sort: 20,
								caption: 'platform.wysiwygEditor.settings.toolDeleteRecord',
								iconClass: 'tlb-icons ico-rec-delete',
								type: 'item',
								disabled: function () {
									return manualGridService.isDeleteBtnDisabled(gridSourcesId);

								},
								fn: function () {
									manualGridService.deleteSelectedRow(gridSourcesId, true);
								}
							}
						]
					},
					buttons: [
						{
							id: 'ok',
							disabled: function (info) {
								return !_.get(info, 'value.fontFamily');
							}
						}
					]
				};

				dialogConfig.dataItem = {
					cfg: dialogConfig
				};

				dialogConfig.value.sources = dialogConfig.items;

				return platformDialogService.showDialog(dialogConfig);
			}

			function getFontTools(editableData, data) {
				var gridId = gridIdFonts;

				return {
					showImages: true,
					showTitles: true,
					cssClass: 'tools ',
					items: [
						{
							id: '1',
							sort: 10,
							caption: 'platform.wysiwygEditor.settings.toolAddRecord',
							iconClass: 'tlb-icons ico-rec-new',
							type: 'item',
							// disabled: function () {
							// 	return !manualGridService.isRowSelected(gridIdFonts);
							// },
							fn: function () {
								showNewFontFamilyDialog().then(function (result) {
									if (result.ok) {

										// angular.forEach(selectedItems, function (item) {
										// 	_.assign(item, resultValue);
										// });

										manualGridService.addNewRowInGrid(gridId, getNewFontItem(result.value));
										setChanged(data);
										setFontsToDropdown();
									}
								});
							}
						}, {
							id: '2',
							sort: 20,
							caption: 'platform.wysiwygEditor.settings.toolDeleteRecord',
							iconClass: 'tlb-icons ico-rec-delete',
							type: 'item',
							disabled: function () {
								let selected = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
								if (selected && selected.length > 0) {
									if (selected[0].fontFamily === data.defaultFont) {
										return true;
									} else {
										return false;
									}
								}
								return true;
							},
							fn: function () {
								manualGridService.deleteSelectedRow(gridId, true);
								setChanged(data);
							}
						},
						{
							id: '5',
							sort: 27,
							caption: 'platform.wysiwygEditor.settings.toolEditFont',
							iconClass: 'tlb-icons ico-font-customize',
							type: 'item',
							disabled: function () {
								return !manualGridService.isRowSelected(gridIdFonts);
							},
							fn: function () {
								var selectedItem = platformGridAPI.rows.selection({gridId: gridIdFonts, wantsArray: false});
								if (selectedItem) {
									showEditFontFamilyDialog(selectedItem).then(function (result) {
										if (result.ok) {
											_.assign(selectedItem, result.value);
											setChanged(data);
											platformGridAPI.grids.refresh(gridIdFonts, true);
											setFontsToDropdown();
										}
									});
								}
							}
						}
					]
				};
			}

			function getFontSizesTools(editableData, data) {
				let gridId = gridIdFontSizes;

				return {
					showImages: true,
					showTitles: true,
					cssClass: 'tools ',
					items: [
						{
							id: '1',
							sort: 10,
							caption: 'platform.wysiwygEditor.settings.toolAddFontSize',
							iconClass: 'tlb-icons ico-rec-new',
							type: 'item',
							fn: function () {
								showNewFontSizesDialog().then(function (result) {
									let validFontSize = data.fontSizes.find(item => item.size === result.value.size);
									if (result.ok) {
										if (validFontSize === undefined) {
											manualGridService.addNewRowInGrid(gridId, getNewFontItem(result.value));
											setChanged(data);
											setFontSizesToDropdown();
										} else {
											let messageText = 'The font size already exist';
											platformDialogService.showMsgBox(messageText, 'Error', 'error');
										}
									}

								});
							}
						}, {
							id: '2',
							sort: 20,
							caption: 'platform.wysiwygEditor.settings.toolDeleteFontSize',
							iconClass: 'tlb-icons ico-rec-delete',
							type: 'item',
							disabled: function () {
								let selected = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
								if (selected && selected.length > 0) {
									if (selected[0].size === data.defaultFontSize) {
										return true;
									} else {
										return false;
									}
								}
								return true;
							},
							fn: function () {
								manualGridService.deleteSelectedRow(gridId, true);
								setChanged(data);
							}
						}
					]
				};
			}

			function showNewFontSizesDialog() {
				return showEditFontSizesDialog();
			}

			function showEditFontSizesDialog() {

				const dialogConfig = {
					headerText: 'Add Font Size',
					// headerText: 'platform.wysiwygEditor.settings.editFontSizes',
					width: '300px',
					minWidth: '500px',
					showCancelButton: true,
					resizeable: false,
					backdrop: 'static',
					bodyFlexColumn: true,
					bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/cloud-desktop-edit-font-size-body.html',
					buttons: [
						{
							id: 'ok',
							disabled: function (info) {
								return !_.get(info, 'value.size');
							}
						}
					]
				};

				return platformDialogService.showDialog(dialogConfig);
			}

			function getColDef(gridId) {
				switch (gridId) {
					case gridIdFonts:
						return [{
							id: 'p1',
							field: 'fontFamily',
							name: 'Font Family',
							name$tr$: 'platform.wysiwygEditor.settings.colFontFamily',
							readonly: false,
							width: 200,
							resizable: true,
							formatter: 'description',
							// editor: 'description',
							sortOrder: 5
						}, {
							id: 'p2',
							field: 'displayName',
							name: 'Display Name',
							name$tr$: 'platform.wysiwygEditor.settings.colDisplayName',
							readonly: false,
							width: 200,
							resizable: true,
							formatter: 'description',
							// editor: 'description',
							sortOrder: 10
						}];
					case gridIdFontSizes:
						return [{
							id: 'f1',
							field: 'size',
							name: 'Font Size',
							readonly: false,
							width: 200,
							resizable: true,
							formatter: 'description',
							sortOrder: 5
						}];
					case gridIdButtons:
						return [{
							id: 'b1',
							field: 'caption',
							name: 'Button',
							name$tr$: 'platform.button',
							readonly: true,
							width: 150,
							resizable: true,
							formatter: 'description',
							sortOrder: 1
						}, {
							id: 'b2',
							field: 'visibility',
							name: 'Visibility',
							name$tr$: 'platform.formConfigVisibility',
							readonly: false,
							width: 40,
							resizable: true,
							formatter: 'boolean',
							editor: 'boolean',
							sortOrder: 5
						}];
				}
			}

			return formConfig;
		}

		function convertInRequiredUnit(newValue, oldValue, value) {
			let newVal = {};
			let oldVal = {};

			if (newValue === 'px' && oldValue !== 'px') {
				newVal.caption = 'px';
				oldVal = _.find(units, {value: oldValue});
			} else if (oldValue === 'px' && newValue !== 'px') {
				newVal = _.find(units, {value: newValue});
				oldVal.caption = 'px';
			} else {
				oldVal = _.find(units, {value: oldValue});
				newVal = _.find(units, {value: newValue});
			}

			switch (oldVal.caption + '-' + newVal.caption) {
				case 'mm-cm':
					value /= 10;
					break;
				case 'mm-in':
					value /= 25.4;
					break;
				case 'cm-mm':
					value *= 10;
					break;
				case 'cm-in':
					value /= 2.54;
					break;
				case 'in-mm':
					value *= 25.4;
					break;
				case 'in-cm':
					value *= 2.54;
					break;
				case 'mm-px':
					value *= 3.7795275591;
					break;
				case 'cm-px':
					value *= 37.795275591;
					break;
				case 'in-px':
					value *= 96;
					break;
				case 'px-mm':
					value /= 3.7795275591;
					break;
				case 'px-cm':
					value /= 37.795275591;
					break;
				case 'px-in':
					value /= 96;
					break;
				default:
					break;
			}

			return value;
		}

		function getUnitCaption(unit) {
			let values = _.find(units, {value: unit});
			if(values) {
				return values.caption;
			}
			return null;
		}

		function getUnitValue(data) {
			let values = _.find(units, {caption: data});
			if(values) {
				return values.value;
			}
			return null;
		}

		function getNewFontItem(item) {
			if (platformGridAPI) {
				var uuid = platformCreateUuid();
				return _.assign({id: uuid}, item);
			}
		}

		function getUserFormData(data) {
			let formConfig;

			function setDocumentUserViewForm(newVal, oldVal) {
				let obj = _.find(formConfig.rows, {rid: 'unitOfMeasurement'});
				unitLabel = _.get(_.find(obj.options.items, {value: newVal}), 'caption');
				let documentWidth = convertInRequiredUnit(newVal, oldVal, data.documentWidth);
				let documentPadding = convertInRequiredUnit(newVal, oldVal, data.documentPadding);
				data.documentWidth = documentWidth.toFixed(2);
				data.documentPadding = documentPadding.toFixed(2);
			}

			formConfig = {
				fid: 'SettingsView',
				version: '0.1.1',
				showGrouping: true,
				initializers: [
					function (scope, selectedItemPath) {
						return scope.$watch(selectedItemPath + '.data.useSettings', function (newValue) {
							var item = _.get(scope, selectedItemPath);

							if (item) {
								var props = Object.keys(item.data);
								props.forEach(function (prop) {
									if (prop !== 'useSettings') {
										platformRuntimeDataService.readonly(item, [{
											field: 'data.' + prop,
											readonly: !newValue
										}]);
									}
								});
							}
						});
					},
					function (scope, selectedItemPath) {
						return scope.$watch(selectedItemPath + '.data.unitOfMeasurement', function (newVal, oldVal) {
							if (newVal !== oldVal) {
								setDocumentUserViewForm(newVal, oldVal);
								scope.formOptions.configure.groupsDict.docview.header = $translate.instant('platform.wysiwygEditor.settings.groupDocview') + '(' + unitLabel + ')';
								scope.$broadcast('form-config-updated');
							}
						});
					}
				],
				groups: [
					{
						gid: 'tool',
						header$tr$: 'platform.wysiwygEditor.settings.activate',
						isOpen: true,
						isVisible: true,
						sortOrder: 1
					},
				],
				rows: [
					{
						gid: 'tool',
						rid: 'useSettings',
						label: 'Activate User Settings',
						type: 'boolean',
						visible: true,
						sortOrder: 1,
						model: 'data.useSettings',
					},
				],
			};

			mergeFormConfigs(formConfig, getGeneralUserFormConfig(data, 'data'), getDocumentViewConfig(data, 'data'));

			return formConfig;
		}

		/**
		 * @ngdoc function
		 * @name isSettingsChanged
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Indicate whether the settings are changed.
		 * @returns { bool } True, if settings are changed, otherwise false.
		 */
		function isSettingsChanged(data) {
			return _.get(data[settingsKey], 'system.__changed') || _.get(data[settingsKey], 'user.__changed');
		}

		/**
		 * @ngdoc function
		 * @name onSaved
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description This function will be processed after the settings dialog has saved his settings.
		 * @param { Object } data The data object of the selected master item.
		 */
		function onSaved(data) {
			if (isSettingsChanged(data)) {
				cachedPromise = undefined;
				cachedSettings = undefined;
				lastSettingsChange = Date.now();
			}
		}

		/**
		 * @ngdoc function
		 * @name getLastSettingsUpdate
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Gets the date of the last settings change
		 * @returns { string } A string with the date of the last css update
		 */
		function getLastSettingsUpdate() {
			return lastSettingsChange;
		}

		/**
		 * @ngdoc function
		 * @name getSettings
		 * @function
		 * @methodOf platformWysiwygEditorSettingsService
		 * @description Loads the available settings from the server.
		 * @returns {Promise<Object>} The wysiwyg editor's settings.
		 */
		function getSettings(hardReload = true) {
			if (cachedSettings && hardReload) {
				return $q.when(cachedSettings);
			} else {
				return loadSettings(hardReload).then(function (result) {
					var defaultAlignmentButton = _.find(alignments, {'value': result.defaultAlignment});
					var defaultUnits = _.find(units, {'value': result.unitOfMeasurement});

					cachedSettings = {
						defaultFont: result.defaultFont,
						defaultFontSize: getFontSize(result, 12) + 'pt',
						defaultAlignment: defaultAlignmentButton ? defaultAlignmentButton.value : '1',
						fonts: getFonts(result),
						fontSizes: getCurrentFontSizes(result),
						buttons: result.buttons,
						documentWidth: result.documentWidth,
						documentPadding: result.documentPadding,
						unitOfMeasurement: defaultUnits ? defaultUnits.value : '1',
						useSettings: result.useSettings
					};

					return cachedSettings;
				});
			}
		}

		function getBothSettings() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadsetting',
				params: {settingsKey: settingsKey}
			}).then(function (result) {
				if (angular.isObject(result.data)) {
					return result.data;
				}
			});
		}

		function getFonts(settingsData) {
			var userFonts = _.get(settingsData.system, 'fonts');

			if (settingsData.system.showSystemFonts) {
				return mergeFonts(getSystemFonts(), userFonts).sort(fontsComparer);
			} else {
				return userFonts.sort(fontsComparer);
			}
		}

		function getButtons(settingsData) {
			var allButtons = buttons.slice();
			var userButtons = _.get(settingsData.system, 'buttons');

			if (!_.isUndefined(userButtons)) {
				_.forEach(allButtons, function (button) {
					var userButton = _.find(userButtons, {id: button.id});

					if (userButton) {
						button.visibility = userButton.visibility;
					}
				});
			}

			return allButtons;
		}

		function loadSettings(hardReload = true) {
			if (cachedPromise && hardReload) {
				return cachedPromise;
			} else {
				cachedPromise = $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/desktop/usersettings/loadmergedsetting',
					params: {settingsKey: settingsKey}
				}).then(function (result) {
					if (angular.isObject(result.data)) {
						var loadedData = result.data;
						return loadedData;
					}

					return undefined;
				});

				return cachedPromise;
			}
		}

		function mergeFonts(allFonts, userFonts) {
			if (_.isArray(allFonts) && _.isArray(userFonts)) {
				_.forEach(userFonts, function (userFont) {
					if (!_.isUndefined(userFont.fontFamily)) {
						// fontFamily is a mandatory field, if no display name, then fontFamily is the displayName
						if (_.isUndefined(userFont.displayName)) {
							userFont.displayName = userFont.fontFamily;
						}

						var index = _.findIndex(allFonts, {'fontFamily': userFont.fontFamily});
						if (index > -1) {
							allFonts[index] = userFont;
						} else {
							allFonts.push(userFont);
						}
					}
				});
			}

			return allFonts;
		}

		function fontsComparer(a, b) {
			if (_.isUndefined(a.displayName) || _.isUndefined(b.displayName)) {
				return 0;
			}

			var nameA = a.displayName.toUpperCase();
			var nameB = b.displayName.toUpperCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		}

		function getSystemFonts() {
			return _.clone(systemFonts);
		}

		function getCurrentFonts(data) {
			if (_.isUndefined(data)) {
				return;
			}

			var retVal = data.showSystemFonts ? mergeFonts(getSystemFonts(), data.fonts) : data.fonts;
			return retVal.sort(fontsComparer);
		}

		function getFontSize(data, defaultValue) {
			let size = _.find(getCurrentFontSizes(data), {size: data.defaultFontSize}) || _.find(getCurrentFontSizes(data), {size: defaultValue});
			return _.isUndefined(size) ? undefined : size.size;
		}

		function getCurrentFontSizes(data) {
			if (_.isUndefined(data)) {
				return;
			}

			if (_.isUndefined(data.fontSizes)) {
				wysiwygEditorSettingsTypes.forEach(function (type) {
					if (data[type] && data[type].fontSizes) {
						let retVal = data[type].fontSizes;
						return retVal.sort(function (a, b) {
							return a.size - b.size;
						});
					}
				});
			} else {
				let retVal = data.fontSizes;
				return retVal.sort(function (a, b) {
					return a.size - b.size;
				});
			}
		}

		function mergeFormConfigs(main, general, documentView) {
			main.groups = [...main.groups, ...general.groups, ...documentView.groups];
			main.rows = [...main.rows, ...general.rows, ...documentView.rows];
		}

		function getGeneralFormConfig(data, scopePath) {
			var formConfig = {
				groups: [{
					gid: 'general',
					header$tr$: 'platform.wysiwygEditor.settings.groupGeneral',
					isOpen: true,
					isVisible: true,
					sortOrder: 10
				}],
				rows: [{
					gid: 'general',
					rid: 'defaultFont',
					label: 'Default Font',
					label$tr$: 'platform.wysiwygEditor.settings.defaultFont',
					type: 'select',
					visible: true,
					sortOrder: 10,
					model: _.isEmpty(scopePath) ? 'defaultFont' : scopePath + '.defaultFont',
					options: {
						items: getCurrentFonts(data),
						valueMember: 'fontFamily',
						displayMember: 'displayName',
						modelIsObject: false
					}
				}, {
					gid: 'general',
					rid: 'defaultFontSize',
					label: 'Default Font Size',
					label$tr$: 'platform.wysiwygEditor.settings.defaultFontSize',
					type: 'select',
					visible: true,
					sortOrder: 10,
					model: _.isEmpty(scopePath) ? 'defaultFontSize' : scopePath + '.defaultFontSize',
					options: {
						items: getCurrentFontSizes(data),
						valueMember: 'size',
						displayMember: 'size',
						modelIsObject: false
					}
				}, {
					gid: 'general',
					rid: 'defaultAlignment',
					label: 'Default Alignment',
					label$tr$: 'platform.wysiwygEditor.settings.defaultAlignment',
					type: 'select',
					visible: true,
					sortOrder: 10,
					model: _.isEmpty(scopePath) ? 'defaultAlignment' : scopePath + '.defaultAlignment',
					options: {
						items: alignments,
						valueMember: 'value',
						displayMember: 'caption',
						modelIsObject: false
					}
				}, {
					gid: 'general',
					rid: 'unitOfMeasurement',
					label: 'Unit of Measurement',
					label$tr$: 'platform.wysiwygEditor.settings.unitOfMeasurement',
					type: 'select',
					visible: true,
					sortOrder: 10,
					model: _.isEmpty(scopePath) ? 'unitOfMeasurement' : scopePath + '.unitOfMeasurement',
					options: {
						items: units,
						valueMember: 'value',
						displayMember: 'caption',
						modelIsObject: false
					}
				}]
			};

			return formConfig;
		}

		function getGeneralUserFormConfig(data, scopePath) {
			var formConfig = {
				groups: [{
					gid: 'general',
					header$tr$: 'platform.wysiwygEditor.settings.groupGeneral',
					isOpen: true,
					isVisible: true,
					sortOrder: 10
				}],
				rows: [{
					gid: 'general',
					rid: 'unitOfMeasurement',
					label: 'Unit of Measurement',
					label$tr$: 'platform.wysiwygEditor.settings.unitOfMeasurement',
					type: 'select',
					visible: true,
					sortOrder: 10,
					model: _.isEmpty(scopePath) ? 'unitOfMeasurement' : scopePath + '.unitOfMeasurement',
					options: {
						items: units,
						valueMember: 'value',
						displayMember: 'caption',
						modelIsObject: false
					}
				}, {
					gid: 'general',
					rid: 'showRuler',
					label: 'Show Ruler',
					label$tr$: 'platform.wysiwygEditor.settings.showRuler',
					visible: true,
					sortOrder: 11,
					model: _.isEmpty(scopePath) ? 'showRuler' : scopePath + '.showRuler',
					type: 'boolean'
				}]
			};

			return formConfig;
		}

		function getDocumentViewConfig(data, scopePath) {
			unitLabel = units.find(item => item.value === data.unitOfMeasurement);

			var formConfig = {
				groups: [{
					gid: 'docview',
					header: $translate.instant('platform.wysiwygEditor.settings.groupDocview') + ' (' + unitLabel.caption + ')',
					isOpen: true,
					isVisible: true,
					sortOrder: 15
				}],
				rows: [{
					gid: 'docview',
					rid: 'width',
					label: 'Width',
					label$tr$: 'platform.wysiwygEditor.settings.documentWidth',
					type: 'decimal',
					visible: true,
					sortOrder: 5,
					model: _.isEmpty(scopePath) ? 'documentWidth' : scopePath + '.documentWidth',
					options: {
						decimalPlaces: unitLabel.decimal,
						infoText: 'Width of the document in ' + unitLabel.caption,
						infoText$tr$: 'platform.wysiwygEditor.settings.documentWidthInfo'
					}
				}, {
					gid: 'docview',
					rid: 'padding',
					label: 'Margin',
					label$tr$: 'platform.wysiwygEditor.settings.documentPadding',
					type: 'decimal',
					visible: true,
					sortOrder: 10,
					model: _.isEmpty(scopePath) ? 'documentPadding' : scopePath + '.documentPadding',
					options: {
						decimalPlaces: unitLabel.decimal,
						infoText: 'Margin of the document in  ' + unitLabel.caption,
						infoText$tr$: 'platform.wysiwygEditor.settings.documentPaddingInfo'
					}
				}]
			};

			return formConfig;
		}

		return {
			getMasterItemId: getMasterItemId,
			convertToTransferable: convertToTransferable,
			convertInRequiredUnit: convertInRequiredUnit,
			getUnitCaption: getUnitCaption,
			getUnitValue: getUnitValue,
			getCurrentFonts: getCurrentFonts,
			hasWritePermission: hasWritePermission,
			getMasterItem: getMasterItem,
			getLastSettingsUpdate: getLastSettingsUpdate,
			onSaved: onSaved,
			getGeneralFormConfig: getGeneralFormConfig,
			getSettings: getSettings,
			getUserFormData: getUserFormData,
			loadSettings: loadSettings,
			getBothSettings: getBothSettings,

			/**
			 * @ngdoc property
			 * @name .#settingsKey
			 * @propertyOf platformWysiwygEditorSettingsService
			 * @returns { string } The id of the settings object
			 */
			settingsKey: settingsKey
		};
	}

	/**
	 * @ngdoc service
	 * @name platformWysiwygEditorSettingsService
	 * @function
	 * @requires $http, $q, _, dataStates, platformRuntimeDataService, platformPermissionService, $translate, userTypes
	 *
	 * @description Manages the settings of the wysiwyg editor.
	 */
	angular.module('platform').factory('platformWysiwygEditorSettingsService', platformWysiwygEditorSettingsService);
})();
