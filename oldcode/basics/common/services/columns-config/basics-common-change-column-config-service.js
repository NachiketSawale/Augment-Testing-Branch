(function (angular) {
	'use strict';

	angular.module('basics.common').factory('basicsCommonChangeColumnConfigService', ['mainViewService', '_', 'platformGridAPI', function (mainViewService, _, platformGridAPI) {

		function parseConfiguration(propertyConfig) {
			propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

			_.each(propertyConfig, function (config) {
				if (_.has(config, 'name')) {
					_.unset(config, 'name');
					_.unset(config, 'name$tr$');
					_.unset(config, 'name$tr$param$');
				}
			});

			return propertyConfig;
		}

		function mergeWithConfig(gridId, columns, config) {
			let isResourceContainer = false;
			let resourceShortKeyMap = {
				'estresourcetypefkextend' : 'estresourcetypeshortkey',
				'estresourcetypefkextendbrief' : 'estresourcetypeshortkeydescription'
			};

			if (gridId === 'bedd392f0e2a44c8a294df34b1f9ce44') {
				isResourceContainer = true;
			}

			if (!columns || !angular.isArray(columns)) {
				return [];
			}

			const columnsDic = {};

			// Add dynamic columns
			_.forEach(columns, function (item) {
				columnsDic[item.id] = item;
			});

			let allColumns = [];

			if (config) {
				// Add group column
				if (config.Gridconfig && config.Gridconfig.groups && config.Gridconfig.groups.length > 0) {
					let visibleColums = platformGridAPI.columns.getColumns(gridId);
					let groupItem = _.find(visibleColums, function (item) {
						return item.id === 'group';
					});
					if (groupItem && !columnsDic['group']) {
						columnsDic['group'] = groupItem;
					}
				}
			}

			if (config) {
				let propertyConfig = config.Propertyconfig || [];
				propertyConfig = parseConfiguration(propertyConfig);

				_.forEach(propertyConfig, function (propertyItem) {

					let isOldResourceShortKeyField = isResourceContainer && resourceShortKeyMap[propertyItem.id];

					let propertyId = isOldResourceShortKeyField ? resourceShortKeyMap[propertyItem.id] : propertyItem.id;

					const col = columnsDic[propertyId];
					if (col) {
						const kb = col.keyboard ? col.keyboard : {enter: true, tab: true};

						col.hidden = !propertyItem.hidden; // property config hidden is reversed, so we take their opposite value
						col.pinned = propertyItem.pinned;
						col.userLabelName = propertyItem.userLabelName;
						col.keyboard = kb;
						col.width = propertyItem.width;
						col.aggregates = propertyItem.aggregates;

						if(isOldResourceShortKeyField){
							col.isOldResourceShortKeyField = isOldResourceShortKeyField;
						}

						allColumns.push(col);

						// Remove from cache dictionary
						delete columnsDic[propertyId];
					}
				});

				// const columnToAddToEnd = [];
				for (let item in columnsDic) {
					if (Object.prototype.hasOwnProperty.call(columnsDic, item)) {
						const columnAdd = columnsDic[item];
						if (columnAdd.id === 'indicator') {
							columnAdd.hidden = false;
							allColumns.unshift(columnAdd);
						} else if (columnAdd.id === 'marker' || columnAdd.id === 'group' || columnAdd.id === 'tree') {
							columnAdd.hidden = false;
							if(allColumns.length && allColumns[0].id === 'indicator') {
								allColumns.splice(1, 0, columnAdd);
							} else {
								allColumns.unshift(columnAdd);
							}
						}
						else if (columnAdd.forceVisible) {
							columnAdd.hidden = false;
							allColumns.push(columnAdd);
						} else {
							if (propertyConfig.length <= 0 && _.isNil(columnAdd.hidden)) {
								columnAdd.hidden = false;
							} else {
								columnAdd.hidden = true; // New added dynamic columns should be hidden, otherwise they will change the current layout and current saved view
							}
							allColumns.push(columnAdd);
						}
						// columnToAddToEnd.push(columnAdd);
					}
				}
				// allColumns = allColumns.concat(columnToAddToEnd);
			} else {
				allColumns = columns;
			}

			return allColumns;
		}

		function mergeWithViewConfig(gridId, columns) {
			const config = mainViewService.getViewConfig(gridId);
			return mergeWithConfig(gridId, columns, config);
		}

		function mergeWithModuleConfig(gridId, columns){
			const config = mainViewService.getModuleConfig(gridId);
			return mergeWithConfig(gridId, columns, config);
		}

		return {
			'mergeWithViewConfig': mergeWithViewConfig,
			'mergeWithModuleConfig': mergeWithModuleConfig,
		};

	}]);
})(angular);