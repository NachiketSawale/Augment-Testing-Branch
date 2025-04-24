(function () {
	'use strict';

	angular.module('platform').constant('platformDefaultToolDef', [
		{
			caption: 'cloud.common.taskBarNewRecord',
			iconClass: 'tlb-icons ico-new',
			permission: '#c',
			isSet: false
		},
		{
			caption: 'cloud.common.taskBarDeleteRecord',
			iconClass: 'tlb-icons ico-delete',
			permission: '#d',
			isSet: false
		},
		{
			id: 'd0',
			type: 'divider',
			isSet: true
		},
		{
			caption: 'cloud.common.taskBarNewRecord',
			iconClass: 'tlb-icons ico-rec-new',
			permission: '#c'
		},
		{
			caption: 'cloud.common.taskBarDeepCopyRecord',
			iconClass: 'tlb-icons ico-copy-paste-deep',
			permission: '#c',
			isSet: false
		},
		{
			id: 'd0',
			type: 'divider',
			isSet: true
		},
		{
			caption: 'cloud.common.toolbarNewDivision',
			iconClass: 'tlb-icons ico-fld-ins-below',
			permission: '#c',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarNewSubdivision',
			iconClass: 'tlb-icons ico-sub-fld-new',
			permission: '#c',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarInsertSub',
			iconClass: 'tlb-icons ico-boq-item-new',
			permission: '#c',
			isSet: false
		},
		{
			caption: 'cloud.common.taskBarDeleteRecord',
			iconClass: 'tlb-icons ico-rec-delete',
			permission: '#d'
		},
		{
			id: 'd1',
			prio: 50,
			type: 'divider',
			isSet: true
		},
		{
			caption: 'cloud.common.toolbarCut',
			iconClass: 'tlb-icons ico-cut',
			permission: '#d',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarCopy',
			iconClass: 'tlb-icons ico-copy',
			permission: '#r',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarPasteSelectedItem',
			iconClass: 'tlb-icons ico-paste',
			permission: '#c',
			isSet: false
		},
		{
			caption: 'cloud.common.documentProperties',
			iconClass: 'tlb-icons ico-settings2',
			isSet: false
		},
		{
			id: 'd1',
			prio: 50,
			type: 'divider',
			isSet: true
		},
		{
			id: 'treeGridAccordion',
			caption: 'Collapse',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarCollapse',
			iconClass: 'tlb-icons ico-tree-collapse',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarExpand',
			iconClass: 'tlb-icons ico-tree-expand',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarCollapseAll',
			iconClass: 'tlb-icons ico-tree-collapse-all',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarExpandAll',
			iconClass: 'tlb-icons ico-tree-expand-all',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarCollapseAllEntirely',
			iconClass: 'tlb-icons ico-tree-collapse2',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarExpandAllEntirely',
			iconClass: 'tlb-icons ico-tree-expand2',
			isSet: false
		},
		{
			id: 'd2',
			prio: 100,
			type: 'divider',
			isSet: true
		},
		{
			caption: 'cloud.common.toolbarFilter',
			iconClass: 'tlb-icons ico-filter-off',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarSelectionMode',
			iconClass: 'tlb-icons ico-selection-multi',
			isSet: false
		},
		{
			caption: 'cloud.common.taskBarSearch',
			iconClass: 'tlb-icons ico-search',
			isSet: false
		},
		{
			caption: 'cloud.common.toolbarSetting',
			iconClass: 'tlb-icons ico-settings',
			isSet: true
		}
	]);

	toolbarService.$inject = ['_', 'globals', 'platformDefaultToolDef', 'platformPermissionService', 'mainViewService', 'platformMenuListDefaultListConfig'];

	function toolbarService(_, globals, toolDef, platformPermissionService, mainViewService, platformMenuListDefaultListConfig) {
		var service = {};
		var toolItems = {};

		if (globals.portal) {
			toolDef.pop();
		}

		function refactorList(list, removeOverflow) {
			var divider = false;

			for (var i = 0; i < list.length; i++) {
				if (!!removeOverflow && list[i].type === 'overflow-btn') {
					list.splice(i, 1);
					i--;
				}
				if (list[i].type === 'divider') {
					if (divider) {
						list.splice(i, 1);
						i--;
					}
					divider = true;
				} else {
					divider = false;
				}

			}
			if (list.length > 2) {
				if (list[list.length - 2].type === 'divider') {
					list.splice(list.length - 2, 1);
				}
			}

			return list;
		}

		function replaceInsertTool(uuid, tool) {
			if (tool) {
				if (tool.id === 'forceResetView') {
					console.log(tool);
				}
				var index;
				var tools = toolItems[uuid];

				if (!tool.iconClass && !!tool.cssClass) {
					tool.iconClass = tool.cssClass;
				}

				if (globals.portal && tool.iconClass === 'tlb-icons ico-settings') {
					return;
				}

				if (tool.type === platformMenuListDefaultListConfig.types.subList && _.isUndefined(tool.iconClass)) {
					index = _.findIndex(tools, {'id': tool.id});
				}
				else if (_.isUndefined(tool.iconClass))
				{
					index = _.findIndex(tools, {'id': tool.id});
				}
				else {
					index = _.findIndex(tools, {'iconClass': tool.iconClass});
				}

				if (index !== -1) {
					var item = tools[index];

					tools[index] = tool;

					// apply missing properties from template (at the moment: permission property)
					_.forOwn(item, function (value, key) {
						if (!tool.hasOwnProperty(key)) {
							tool[key] = value;
						}
					});
				} else {
					if (!_.isUndefined(tool.sort) && tool.sort < 0) {
						// negative sort value. tools added from controller
						var insertIndex = 0;
						for (insertIndex = 0; insertIndex < tools.length; insertIndex++) {
							// find position (insertIndex) of tool.
							if (_.isUndefined(tools[insertIndex].sort) || (!_.isUndefined(tools[insertIndex].sort) && tools[insertIndex].sort >= tool.sort)) {
								// tool found with no sort defined, or with higher sort value
								break;
							}
						}
						tools.splice(insertIndex, 0, tool);
					} else {
						// tool with no or positive sort value
						tools.splice(toolItems[uuid].length - 2, 0, tool);
					}
				}

				tool.isSet = true;

				if (_.isString(tool.permission)) {
					var split = tool.permission.split('#');

					tool.permission = {};
					tool.permission[split[0].length ? split[0] : (mainViewService.getPermission(uuid) || uuid)] = platformPermissionService.permissionsFromString(split[1]);
				}
				_.each(_.get(tool, 'list.items', []), function (tool) {
					if (_.isString(tool.permission)) {
						var split = tool.permission.split('#');
						tool.permission = {};
						tool.permission[split[0].length ? split[0] : (mainViewService.getPermission(uuid) || uuid)] = platformPermissionService.permissionsFromString(split[1]);
					}
				});
			}
		}

		service.addTools = function (uuid, tools) {
			if (!toolItems[uuid]) {
				toolItems[uuid] = _.cloneDeep(toolDef);
			}

			if (angular.isArray(tools)) {
				_.each(tools, function (tool) {
					if (tool.type !== 'overflow-btn') {
						replaceInsertTool(uuid, tool);
					}
				});
			} else {
				if (tools.type !== 'overflow-btn') {
					replaceInsertTool(uuid, tools);
				}
			}
		};

		service.ensureOverflowButton = function (list) {
			if (!!list && list[list.length - 1] && list[list.length - 1].type !== 'overflow-btn') {

				list.push({
					type: 'overflow-btn',
					cssClass: ' fix ',
					iconClass: 'ico-menu',

					list: {
						items: refactorList(list.slice(), true)
					}
				});
			}
		};

		service.getTools = function (uuid, tools, cached) {
			if (tools) {
				if (!toolItems[uuid] || (!!toolItems[uuid] && !cached)) {
					service.addTools(uuid, tools);
				}
			}

			var result = [];
			var refList;

			if (toolItems[uuid]) {
				result = _.filter(toolItems[uuid], 'isSet');
				refList = refactorList(result, false);

				service.ensureOverflowButton(refList);
			}

			return refList;
		};

		service.removeTools = function (uuid) {
			return delete toolItems[uuid];
		};

		return service;
	}

	angular.module('platform').factory('platformToolbarService', toolbarService);

})();
