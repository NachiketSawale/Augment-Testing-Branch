/**
 * Created By Roberson Luo 2015-08-14
 */
(function () {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name basicsCommonDialogGridControllerService
	 * @function
	 *
	 * @description
	 * Service to do the initializing in a dialog flat item list controller
	 **/
	angular.module('basics.common').factory('basicsCommonDialogGridControllerService', ['platformGridControllerService', 'platformGridAPI', '_', '$timeout',
		'$stateParams',
		'mainViewService',
		'platformPermissionService',
		'$injector',
		function (platformGridControllerService, platformGridAPI, _, $timeout,
			$stateParams,
			mainViewService,
			platformPermissionService,
			$injector
		) {
			const service = {};

			service.initListController = function initListController($scope, uiStandardService, itemService, validationService, gridConfig) {

				$scope.getContainerUUID = function () {
					return gridConfig.uuid;
				};
				$scope.onContentResized = function () {
				};

				if (!_.isFunction($scope.setTools)) {
					$scope.setTools = function (tools) {
						$scope.tools = tools || {};
						if (!_.isFunction($scope.tools.update)) {
							$scope.tools.update = function () {
							};
						}
					};
				}

				$scope.onCancel = function () {
					$scope.$close({isOK: false}); // when the popup grid is being closed, keep the grid in API
				};

				// TODO: grid only show the first time (this feature should be fixed in platformgrid.directive.js)
				// clean the grid first due to the directive only save the grid onStateChange
				// but in the popup modal, no state change.
				if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
					platformGridAPI.grids.unregister($scope.getContainerUUID());
				}

				gridConfig.skipPermissionCheck = true; // ignore the permission check for dialog.

				platformGridControllerService.initListController($scope, uiStandardService, itemService, validationService, gridConfig);
				itemService.gridId = $scope.gridId;

				// workaround to make sure all the grid config in the dialog can be saved by default.
				if (angular.isUndefined(gridConfig.enableConfigSave) || gridConfig.enableConfigSave === true) {
					const grid = platformGridAPI.grids.element('id', gridConfig.uuid);
					grid.enableConfigSave = true;
				}

				if (gridConfig.enableTemplateButtons) {
					addTemplateButtons($scope);
				}

				_.forEach($scope.tools.items, function (item) {
					parsePermission(item);
					if (item.list && item.list.items && _.isArray(item.list.items)) {
						_.each(item.list.items, function (subTool) {
							parsePermission(subTool);
						});
					}
				});

				$timeout(function () {
					platformGridAPI.grids.invalidate($scope.gridId);
					platformGridAPI.grids.resize($scope.gridId);
					platformGridAPI.grids.refresh($scope.gridId);
				});

			};

			return service;

			// parse permission
			// It is a bad practice to override 'setTools' and 'getTools' function, for example, here missing some permission data transform lead to 'Grid Layout' config button disappear.
			function parsePermission(tool) {
				if (!tool || !_.isString(tool.permission)) {
					return;
				}
				let splits = tool.permission.split('#');
				tool.permission = {};
				tool.permission[splits[0]] = $injector.get('platformPermissionService').permissionsFromString(splits[1]);
			}

			function addTemplateButtons($scope) {
				let hasModuleActivated = $stateParams.tab > 0;
				let toolbarItems = [];
				let systemTmplBtn = null;
				let roleTmplBtn = null;
				let hasSystemTmpl = hasModuleActivated && mainViewService.hasModuleConfig($scope.gridId, 's');
				let hasRoleTmpl = hasModuleActivated && mainViewService.hasModuleConfig($scope.gridId, 'r');

				let hasTemplateEditPermission = platformPermissionService.hasExecute('7ee17da2cd004de6a53c63af7cb4d3d9');

				let createItem = function (id, type, sort, hideItem, isSet, options) {
					return _.extend({
						id: id,
						sort: sort,
						type: type,
						hideItem: hideItem,
						isSet: isSet
					}, options);
				};

				let createActionItem = function (id, type, sort, hideItem, caption, iconClass, fn, disabledFn) {
					return createItem(id, type, sort, hideItem, false, {
						caption: caption,
						iconClass: iconClass,
						fn: fn,
						disabled: function () {
							return angular.isFunction(disabledFn) ? disabledFn() : false;
						}
					});
				};

				let updateToolbar = function (id, props) {
					let toolbar = _.find($scope.tools.items, {id: id});
					if (toolbar) {
						_.extend(toolbar, props);
						$scope.tools.update();
					}
				};

				let updateState = function (type, hasTemplate) {
					let updateToolbarId;
					let iconClass = '';
					if (type === 's') {
						updateToolbarId = 'user-sys-template-dd';
						hasSystemTmpl = hasTemplate;
						if (systemTmplBtn) {
							iconClass = 'tlb-icons ' + (hasSystemTmpl ? 'ico-config-system-true' : 'ico-config-system');
						}
					} else {
						updateToolbarId = 'role-template-dd';
						hasRoleTmpl = hasTemplate;
						if (roleTmplBtn) {
							iconClass = 'tlb-icons ' + (hasRoleTmpl ? 'ico-config-roles-true' : 'ico-config-roles');
						}
					}
					if (updateToolbarId && iconClass) {
						updateToolbar(updateToolbarId, {iconClass: iconClass});
					}
				};

				let refreshView = function () {

					// Retrieve configuration form cache
					let config = mainViewService.getModuleConfig($scope.gridId);

					// Unchecked the grouping button
					updateToolbar('t12', {value: false});

					// Clear grouping columns
					platformGridAPI.columns.setGrouping($scope.gridId, [], true, true, config.Gridconfig.groupColumnWidth);

					// Hide the group panel
					platformGridAPI.grouping.toggleGroupPanel($scope.gridId, false);

					// Refresh configuration
					platformGridAPI.configuration.refresh($scope.gridId, true);
				};

				let saveModuleConfigAs = function (type) {
					mainViewService.saveModuleConfigAs($scope.gridId, type);
					updateState(type, true);
				};

				let applyModuleConfig = function (type) {
					mainViewService.applyModuleConfig($scope.gridId, type);
					refreshView();
				};

				let deleteModuleConfig = function (type) {
					mainViewService.deleteModuleConfig($scope.gridId, type);
					updateState(type, false);
				};

				if (hasModuleActivated) {

					if (hasTemplateEditPermission) {

						systemTmplBtn = createItem('user-sys-template-dd', 'dropdown-btn', 200, false, true, {
							iconClass: 'tlb-icons ' + (hasSystemTmpl ? 'ico-config-system-true' : 'ico-config-system'),
							list: {
								showImages: true,
								cssClass: 'dropdown-menu-right',
								items: [
									createActionItem('save-as-sys-tmpl', 'item', 1, false, 'cloud.common.saveAsSystemTemplate', 'tlb-icons ico-save2system', function saveSysTemplateFn() {
										saveModuleConfigAs('s');
									}, function disabledSaveAsSysTemplateFn() {
										return !mainViewService.hasModuleConfig($scope.gridId, 'u');
									}),
									createActionItem('load-sys-tmpl', 'item', 2, false, 'cloud.common.loadSystemTemplate', 'tlb-icons ico-config-system-load', function loadSysTemplateFn() {
										applyModuleConfig('s');
									}, function disabledLoadSysTemplateFn() {
										return !hasSystemTmpl;
									}),
									createActionItem('delete-sys-tmpl', 'item', 3, false, 'cloud.common.deleteSystemTemplate', 'tlb-icons ico-config-system-delete', function deleteSysTemplateFn() {
										deleteModuleConfig('s');
									}, function disabledDeleteSysTemplateFn() {
										return !hasSystemTmpl;
									})
								]
							}
						});

						roleTmplBtn = createItem('role-template-dd', 'dropdown-btn', 200, false, true, {
							iconClass: 'tlb-icons ' + (hasRoleTmpl ? 'ico-config-roles-true' : 'ico-config-roles'),
							list: {
								showImages: true,
								cssClass: 'dropdown-menu-right',
								items: [
									createActionItem('save-as-role-tmpl', 'item', 1, false, 'cloud.common.saveAsRoleTemplate', 'tlb-icons ico-save2role', function saveRoleTemplateFn() {
										saveModuleConfigAs('r');
									}, function disabledSaveAsRoleTemplateFn() {
										return !mainViewService.hasModuleConfig($scope.gridId, 'u');
									}),
									createActionItem('load-role-tmpl', 'item', 2, false, 'cloud.common.loadRoleTemplate', 'tlb-icons ico-config-role-load', function loadRoleTemplateFn() {
										applyModuleConfig('r');
									}, function disabledLoadRoleTemplateFn() {
										return !hasRoleTmpl;
									}),
									createActionItem('delete-role-tmpl', 'item', 3, false, 'cloud.common.deleteRoleTemplate', 'tlb-icons ico-config-role-delete', function deleteRoleTemplateFn() {
										deleteModuleConfig('r');
									}, function disabledDeleteRoleTemplateFn() {
										return !hasRoleTmpl;
									})
								]
							}
						});

					} else {
						if (hasSystemTmpl) {
							systemTmplBtn = createActionItem('reload-user-sys-template', 'item', 201, false, 'cloud.common.reloadUserSystemTemplate', 'tlb-icons ico-config-system-load', function reloadSysTemplateFn() {
								applyModuleConfig('s');
							});
						}
						if (hasRoleTmpl) {
							roleTmplBtn = createActionItem('reload-role-template', 'item', 202, false, 'cloud.common.reloadRoleTemplate', 'tlb-icons ico-config-role-load', function reloadRoleTemplateFn() {
								applyModuleConfig('r');
							});
						}
					}
				}

				// Template button
				if ((systemTmplBtn || roleTmplBtn)) {
					toolbarItems.push(createItem('d1', 'divider', 200, false, true));
				}

				if (systemTmplBtn) {
					toolbarItems.push(systemTmplBtn);
				}
				if (roleTmplBtn) {
					toolbarItems.push(roleTmplBtn);
				}

				if($scope.tools && $scope.tools.items && $scope.tools.items.length > 0){
					toolbarItems = toolbarItems.length > 0 ? toolbarItems.concat($scope.tools.items) : $scope.tools.items;
				}

				if (toolbarItems.length > 0) {
					toolbarItems = _.orderBy(toolbarItems, 'sort');
				}

				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					overflow: true,
					sublist: true,
					version: 0,
					refreshVersion: 0,
					update: function () {
						this.version += 1;
					},
					refresh: function () {
						this.refreshVersion += 1;
					},
					items: toolbarItems
				};
			}
		}
	]);
})();
