/**
 * Created by mov on 12/02/2020.
 */

(function (angular) {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
     * @ngdoc service
     * @name estimateAssembliesResourceDynamicConfigurationService
     * @function
     *
     * @description
     * estimateAssembliesResourceDynamicConfigurationService is the config service for estimate line items container.
     */
	angular.module(moduleName).factory('estimateAssembliesResourceDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {
			let userDefinedGroupName = 'userDefinedColumns',
				userDefinedDetailConfig = 'userDefinedDetailConfig',
				options = {
					groupName : 'basicData',
					dynamicColDictionaryForDetail : {}
				};

			let service = estimateCommonDynamicConfigurationServiceFactory.getService('estimateAssembliesResourceConfigurationService', 'estimateAssembliesResourceValidationService', options);

			let orignalGetStandardConfigForDetailView = service.getStandardConfigForDetailView;

			service.getStandardConfigForDetailView = function(){
				let rowsToAttachForDetail = _.remove(options.dynamicColDictionaryForDetail[userDefinedDetailConfig]);
				let configForDetail = orignalGetStandardConfigForDetailView();
				options.dynamicColDictionaryForDetail[userDefinedDetailConfig] = angular.copy(rowsToAttachForDetail);

				if(rowsToAttachForDetail && rowsToAttachForDetail.length > 0){
					let index = -1, entityHistoryGroupIndex = -1;
					if (configForDetail && configForDetail.groups) {
						index = _.findIndex(configForDetail.groups, {'gid': userDefinedGroupName});
						entityHistoryGroupIndex = _.findIndex(configForDetail.groups, {'gid': 'entityHistory'});
					}

					if(entityHistoryGroupIndex > -1){
						configForDetail.groups[entityHistoryGroupIndex].sortOrder = configForDetail.groups.length + 1;
					}

					if (index < 0) {
						let group = {
							gid: userDefinedGroupName,
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
							_.forEach(configForDetail.groups[index].rows, function(row){
								_.remove(configForDetail.rows, function(row){
									return row.gid === userDefinedGroupName;
								});
								delete configForDetail.rowsDict[row.rid];
							});
							configForDetail.groups[index].rows = [];
						}
					}
					let count = configForDetail.groups[index].rows.length;

					_.forEach(rowsToAttachForDetail, function (row) {
						if(!configForDetail.rowsDict){
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
	]);
})(angular);
