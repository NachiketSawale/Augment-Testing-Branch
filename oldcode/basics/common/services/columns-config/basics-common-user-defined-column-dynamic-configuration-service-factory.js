/**
 * Created by myh on 08/30/2021.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory', ['estimateCommonDynamicConfigurationServiceFactory', '_',
		function (estimateCommonDynamicConfigurationServiceFactory, _) {

			function createService(standardConfigurationService, validationService) {
				let groupName = 'userDefinedColumns',
					options = {
						dynamicColDictionaryForDetail: []
					};

				let service = estimateCommonDynamicConfigurationServiceFactory.getService(standardConfigurationService, validationService, options);

				function getExtendColumns(dataDictionary) {
					let columnsToAttachForList = [];

					for (let prop in dataDictionary) {
						if (dataDictionary.hasOwnProperty(prop)) {
							columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
						}
					}

					return columnsToAttachForList;
				}

				service.getStandardConfigForDetailView = function () {
					let rowsToAttachForDetail = getExtendColumns(options.dynamicColDictionaryForDetail);

					let configForDetail = service.baseCongigurationService.getStandardConfigForDetailView();

					if (rowsToAttachForDetail && rowsToAttachForDetail.length > 0) {
						let index = -1, entityHistoryGroupIndex = -1;
						if (configForDetail && configForDetail.groups) {
							index = _.findIndex(configForDetail.groups, {'gid': groupName});
							entityHistoryGroupIndex = _.findIndex(configForDetail.groups, {'gid': 'entityHistory'});
						}

						if (entityHistoryGroupIndex > -1) {
							configForDetail.groups[entityHistoryGroupIndex].sortOrder = configForDetail.groups.length + 1;
						}

						if (index < 0) {
							let group = {
								gid: groupName,
								header: 'User-Defined Price',
								header$tr$: 'basics.common.userDefinedColumn.detailGroupName',
								sortOrder: configForDetail.groups.length,
								isOpen: true,
								showHeader: true,
								visible: true,
								rows: []
							};
							index = configForDetail.groups.length;
							configForDetail.groups.push(group);
							if (!configForDetail.groupsDict) {
								configForDetail.groupsDict = {};
							}
							configForDetail.groupsDict[group.gid] = group;
						} else {
							if (configForDetail.groups[index].rows.length > 0) {
								_.forEach(configForDetail.groups[index].rows, function (row) {
									_.remove(configForDetail.rows, function (row) {
										return row.gid === groupName;
									});
									delete configForDetail.rowsDict[row.rid];
								});
								configForDetail.groups[index].rows = [];
							}
						}
						let count = configForDetail.groups[index].rows.length;

						_.forEach(rowsToAttachForDetail, function (row) {
							if (!configForDetail.rowsDict) {
								configForDetail.rowsDict = {};
							}

							if (_.isNil(configForDetail.rowsDict[row.rid])) {
								row.sortOrder = ++count;
								configForDetail.rows.push(row);
								configForDetail.groups[index].rows.push(row);
								if (configForDetail.rowsDict) {
									configForDetail.rowsDict[row.rid] = row;
								}
							}
						});
					}

					return configForDetail;
				};

				return service;
			}

			return {
				getService: function (standardConfigurationService, validationService) {
					return createService(standardConfigurationService, validationService);
				}
			};

		}]);
})(angular);
