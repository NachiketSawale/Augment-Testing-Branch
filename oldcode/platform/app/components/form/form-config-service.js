/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	function FormConfigService(mainViewService) {
		var service = {};
		var currentItem;
		var listLoaded = new Platform.Messenger();

		service.getSelected = function getSelected() {
			return currentItem;
		};

		service.setSelected = function setSelected(item) {
			currentItem = item;
		};

		service.registerListLoaded = function registerListLoaded(callBackFn) {
			listLoaded.register(callBackFn);
		};

		service.unregisterListLoaded = function unregisterListLoaded(callBackFn) {
			listLoaded.unregister(callBackFn);
		};

		service.fireListLoaded = function fireListLoaded() {
			listLoaded.fire();
		};

		var initGroupsAndRows = function initGroupsAndRows(formOption, configure) {
			var rowsDict = {};
			var groupsDict = {};
			configure.rowsDict = rowsDict;
			configure.groupsDict = groupsDict;

			// update canTabStop,when the value is undefined if parent has the value ,
			// get it from parent, else set true
			var initialShowHeaderProperty = function (group) {
				if (angular.isUndefined(group.showHeader)) {
					group.showHeader = true;
				}
			};

			// update canTabStop,when the value is undefined if parent has the value ,
			// get it from parent, else set true
			var initialTabStopProperty = function (row, parentRow) {
				if (angular.isUndefined(row.tabStop)) {
					if (angular.isDefined(parentRow) && angular.isDefined(parentRow.tabStop)) {
						row.tabStop = parentRow.tabStop;
					} else {
						row.tabStop = true;
					}
				}
			};

			// update canEnterStop,when the value is undefined if parent has the value ,
			// get it from parent, else set true
			var initialEnterStopProperty = function (row, parentRow) {
				if (angular.isUndefined(row.enterStop)) {
					if (angular.isDefined(parentRow) && angular.isDefined(parentRow.enterStop)) {
						row.enterStop = parentRow.enterStop;
					} else {
						row.enterStop = true;
					}
				}
			};

			// update row or group visible,when the value is undefined if parent has the value ,
			// get it from parent, else set true
			var initialVisibleProperty = function (row, parentRow) {
				if (angular.isUndefined(row.visible)) {
					if (angular.isDefined(parentRow) && angular.isDefined(parentRow.visible)) {
						row.visible = parentRow.visible;
					} else {
						row.visible = true;
					}
				}
			};

			var initialRow = function (row) {
				initialEnterStopProperty(row);
				initialTabStopProperty(row);
				initialVisibleProperty(row);

				row.validationMethod = formOption.validationMethod;
				row.onPropertyChanged = formOption.onPropertyChanged;
			};

			// initial groups and add to group dictionary
			configure.groups.forEach(function (group) {
				initialVisibleProperty(group);
				initialShowHeaderProperty(group);
				groupsDict[group.gid] = group;
			});

			var rowOrder = 0;
			// initial rows and add to row dictionary
			configure.rows.forEach(function (row) {
				initialRow(row);
				rowsDict[row.rid] = row;

				// Set the default value for sortOrder
				if (angular.isUndefined(row.sortOrder)) {
					row.sortOrder = rowOrder++;
				}
			});

		};

		var loadCustomSetting = function loadCustomSetting(fid) {
			var config = {};
			config = mainViewService.getViewConfig(fid);
			if (config && config.Propertyconfig) {
				return angular.isString(config.Propertyconfig) ? JSON.parse(config.Propertyconfig) : config.Propertyconfig;
			}
			return null;
		};

		var applyConfig = function applyConfig(usersetting, configuration) {
			if (usersetting) {

				if (usersetting.markReadOnlyFields) {
					configuration.markReadOnlyFields = usersetting.markReadOnlyFields;
				}

				_.each(configuration.rows, function (row) {
					row.visible = false;
				});

				_.each(usersetting.rows, function (userRowSetting) {
					var row = configuration.rowsDict[userRowSetting.rid];

					if (row && configuration.groupsDict[userRowSetting.gid]) {
						row.gid = userRowSetting.gid;
						row.userlabel = userRowSetting.userlabel;
						row.labelCode = userRowSetting.labelCode;
						row.visible = userRowSetting.visible;
						row.readonly = !!row.readonly;
						row.enterStop = userRowSetting.enterStop;
						row.tabStop = userRowSetting.tabStop;
						row.sortOrder = userRowSetting.sortOrder;
						row.uom = userRowSetting.uom;
						row.fraction = userRowSetting.fraction;
					}
				});

				_.each(configuration.groups, function (group) {
					group.visible = false;
				});

				_.each(usersetting.groups, function (groupsetting) {
					var group = configuration.groupsDict[groupsetting.gid];

					if (group) {
						group.gid = groupsetting.gid;
						group.userheader = groupsetting.userheader;
						group.labelCode = groupsetting.labelCode;
						group.isOpen = groupsetting.isOpen;
						group.visible = groupsetting.visible;
						group.sortOrder = groupsetting.sortOrder;
					}
				});
			}
		};

		service.getRowsByGroupId = function getRowsByGroupId(gid, formOption) {
			return formOption.configure.rows.filter(function (row) {
				return row.gid === gid;
			});
		};

		service.initialize = function initialize(formOption, configure) {

			if (angular.isUndefined(configure.showGrouping)) {
				configure.showGrouping = true;
			}

			initGroupsAndRows(formOption, configure);

			if (!_.isNil(configure.uuid) && !configure.skipConfiguration) {
				var userSetting = loadCustomSetting(configure.uuid);

				// if the user setting is a compatible setting apply the custom setting
				if (userSetting !== null) {
					service.saveSetting(userSetting, formOption);
					// applyConfig(userSetting, configure);
				} else {
					_.forEach(configure.groups, function (group) {
						group.visible = true;
					});

					_.forEach(configure.rows, function (row) {
						row.tabStop = row.enterStop = row.visible = true;
					});

					let setting = { fid: configure.fid, groups: configure.groups, rows: configure.rows };
					mainViewService.setViewConfig(formOption.configure.uuid, setting, null, true, true);
				}
			}

			// form options interface definition

			// set row read only property
			formOption.setRowReadOnly = function setRowReadOnly(rid, readonly) {
				var row = configure.rowsDict[rid];
				if (row) {
					row.readonly = readonly;
				}
			};

			// get row read only property
			formOption.getRowReadOnly = function getRowReadOnly(rid) {
				var row = configure.rowsDict[rid];
				if (row) {
					return row.readonly;
				}

				return false;
			};

			// set row enter stop property
			formOption.setRowEnterStop = function setRowEnterStop(rid, enterStop) {
				var row = configure.rowsDict[rid];
				if (row) {
					row.enterStop = enterStop;
				}
			};

			// get row enter stop property
			formOption.getRowEnterStop = function getRowEnterStop(rid) {
				var row = configure.rowsDict[rid];
				if (row) {
					return row.enterStop;
				}
				return false;
			};

			// set row tab stop property
			formOption.setRowTabStop = function setRowTabStop(rid, tabStop) {
				var row = configure.rowsDict[rid];
				if (row) {
					row.tabStop = tabStop;
				}
			};

			// get row tab stop property
			formOption.getRowTabStop = function getRowTabStop(rid) {
				var row = configure.rowsDict[rid];
				if (row) {
					return row.tabStop;
				}
				return false;
			};

			// expand all the panels
			formOption.expandAll = function expandAll() {
				configure.groups.forEach(function (group) {
					group.isOpen = true;
				});
			};

			// collapse all the panels
			formOption.collapseAll = function collapseAll() {
				configure.groups.forEach(function (group) {
					group.isOpen = false;
				});
			};

			// set label property
			formOption.setLabel = function setLabel(rid, label) {
				var row = configure.rowsDict[rid];
				if (row) {
					row.label = label;
				}
			};
		};

		service.saveSetting = function saveSetting(usersetting, formOption) {
			applyConfig(usersetting, formOption.configure);

			mainViewService.setViewConfig(formOption.configure.uuid, usersetting, null, true, true);
		};

		return service;
	}

	FormConfigService.$inject = ['mainViewService'];

	angular.module('platform').factory('platformFormConfigService', FormConfigService);

})(angular);
