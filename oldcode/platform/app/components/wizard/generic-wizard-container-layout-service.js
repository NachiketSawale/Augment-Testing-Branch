(function (angular) {
	'use strict';

	angular.module('platform').service('genericWizardContainerLayoutService', GenericWizardContainerLayoutService);

	GenericWizardContainerLayoutService.$inject = ['_', '$injector', '$translate'];

	function GenericWizardContainerLayoutService(_, $injector, $translate) {
		var self = this;
		self.config = {};

		self.containerConfigMap = new Map();

		self.createContainerLayout = function createLayout(containerSettings, moduleName) {// module as second param?
			var layout = null;
			var containerInfo = null;
			var containerInstance = containerSettings.Instance;// container instance settings
			var containerProperties = containerSettings.Properties;// container property settings
			var layoutInfoService = $injector.get(_.camelCase(moduleName) + 'ContainerInformationService');

			if (layoutInfoService !== null) {
				containerInfo = _.cloneDeep(layoutInfoService.getContainerInfoByGuid(containerInstance.ContainerUuid));

				if (!_.isNull(containerInfo) && !_.isUndefined(containerInfo)) {

					if (containerInfo.ContainerType === 'Grid') {
						layout = self.createGridLayout(containerInfo, containerProperties, containerInstance);
					} else if (containerInfo.ContainerType === 'Detail') {
						layout = self.createDetailLayout(containerInfo.layout ? containerInfo.layout : containerInfo, containerProperties);
					}
					self.setContainerLayout(containerInstance.Id, {
						uuid: containerInstance.ContainerUuid, layout: layout, ctnrInfo: containerInfo
					});
				}
			}
		};

		self.createDetailLayout = function createDetailLayout(layout, properties) {
			let rows = [];

			_.each(properties, function (prop) {
				let row = _.find(layout.rows, {rid: prop.PropertyId});

				if (row) {
					let myRow = angular.copy(row);
					// myRow.gid = containerInstance.Id;
					if (!_.isEmpty(prop.LabelInfo)) {
						const label = prop.LabelInfo.Translated || prop.LabelInfo.Description;
						myRow.label = label || myRow.label;
					}
					if (prop.IsReadOnly) {
						myRow.readonly = true;
					}
					if (!_.isEmpty(prop.customTooltip)) {
						myRow.customTooltip = $translate.instant(prop.customTooltip);
					}
					if (!_.isEmpty(prop.ToolTipInfo)) {
						let tooltip = prop.ToolTipInfo.Translated ? prop.ToolTipInfo.Translated : prop.ToolTipInfo.Description;
						myRow.toolTip = tooltip || myRow.toolTip;
					}
					myRow.sortOrder = prop.Sorting;

					rows.push(myRow);
				}
			});

			let groupIds = _.uniq(_.map(rows, 'gid'));
			let groups = [];
			_.forEach(groupIds, function (groupId) {
				let group = _.find(layout.groups, {gid: groupId});
				groups.push({
					gid: groupId,
					attributes: [],
					header$tr$: group.header$tr$,
					header: group.header,
					isOpen: true
				});
			});

			return {
				fid: layout.fid,
				version: layout.version,
				showGrouping: true,
				addValidationAutomatically: true,
				groups: groups,
				rows: rows
			};

			/*_.each(layout.rows, function (row) {
				var wp = _.find(properties, {PropertyId: row.rid});

				if (wp) {
					var myRow = angular.copy(row);
					myRow.gid = containerInstance.Id;
					if (!_.isEmpty(wp.LabelInfo)) {
						const label = wp.LabelInfo.Translated || wp.LabelInfo.Description;
						myRow.label = label || myRow.label;
					}
					if (wp.IsReadOnly) {
						myRow.readonly = true;
					}
					if (!_.isEmpty(wp.customTooltip)) {
						myRow.customTooltip = $translate.instant(wp.customTooltip);
					}
					if (!_.isEmpty(wp.ToolTipInfo)) {
						var tooltip = wp.ToolTipInfo.Translated ? wp.ToolTipInfo.Translated : wp.ToolTipInfo.Description;
						myRow.toolTip = tooltip || myRow.toolTip;
					}
					myRow.sortOrder = wp.Sorting;

					cl.rows.push(myRow);
				}
			});*/
		};

		self.createGridLayout = function createGridLayout(containerInfo, properties, containerInstance) {
			var gridLayout = {
				fid: containerInstance.Id,
				version: containerInfo.version,
				addValidationAutomatically: true,
				columns: [],
				rows: []
			};

			var columns = _.isArray(containerInfo.columns) ? containerInfo.columns : _.isArray(containerInfo.layout.columns) ? containerInfo.layout.columns : null;

			_.each(columns, function (col) {
				var foundProp = _.find(properties, function (prop) {
					return prop.PropertyId.toLowerCase() === col.id.toLowerCase();
				});

				if (foundProp) {
					var column = angular.copy(col);
					var translatedLabel = foundProp.LabelInfo.Translated ? foundProp.LabelInfo.Translated : foundProp.LabelInfo.Description;
					if (!_.isEmpty(translatedLabel)) {
						column.name = translatedLabel;
						column.name$tr$ = null;
					}
					if (foundProp.IsReadOnly) {
						column.editor = null;
						column.readonly = true;
					}
					var translatedToolTip = foundProp.ToolTipInfo.Translated ? foundProp.ToolTipInfo.Translated : foundProp.ToolTipInfo.Description;
					if (!_.isEmpty(translatedToolTip)) {
						column.toolTip = translatedToolTip;
						column.toolTip$tr$ = null;
					}
					if (foundProp.Width) {
						column.width = foundProp.Width;
					}
					column.sortOrder = foundProp.Sorting;
					column.isPinned = foundProp.IsPinned;
					gridLayout.rows.push(column);
				}
			});
			gridLayout.rows = _.orderBy(gridLayout.rows, 'sortOrder', 'asc');
			return gridLayout;
		};

		self.setContainerLayout = function setContainerLayout(containerId, layout) {
			self.containerConfigMap.set(containerId, layout);
		};

		self.getContainerLayoutByContainerId = function getContainerLayoutByContainerId(containerId) {
			return self.containerConfigMap.get(containerId);
		};

		self.clearLayout = function clearLayout() {
			self.containerConfigMap.clear();
		};

	}

})(angular);
