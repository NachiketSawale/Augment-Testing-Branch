/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainDynamicConfigurationService
     * @function
     *
     * @description
     * estimateMainDynamicConfigurationService is the config service for estimate line items container.
     */
	angular.module(moduleName).factory('estimateMainDynamicConfigurationService', ['_', '$injector',
		'estimateCommonDynamicConfigurationServiceFactory',
		function (_, $injector, estimateCommonDynamicConfigurationServiceFactory) {
			let userDefinedGroupName = 'userDefinedColumns',
				options = {
					dynamicColDictionaryForDetail : {}
				};

			let service = estimateCommonDynamicConfigurationServiceFactory.getService('estimateMainStandardConfigurationService', 'estimateMainValidationService', options);

			let orignalGetStandardConfigForDetailView = service.getStandardConfigForDetailView;

			let originalgetStandardConfigForListView = service.getStandardConfigForListView;

			let getStandardConfigForDetailView = function(){

				let formConfig = orignalGetStandardConfigForDetailView();

				if (formConfig && formConfig.addValidationAutomatically) {
					let estimateMainValidationService = $injector.get('estimateMainValidationService');
					_.forEach(formConfig.rows, function (row) {
						var rowModel = row.model.replace(/\./g, '$');

						var syncName = 'validate' + rowModel;
						var asyncName = 'asyncValidate' + rowModel;

						if (estimateMainValidationService[syncName]) {
							row.validator = estimateMainValidationService[syncName];
						}

						if (estimateMainValidationService[asyncName]) {
							row.asyncValidator = estimateMainValidationService[asyncName];
						}
					});
				}

				return formConfig;
			};

			service.getStandardConfigForDetailView = function(){
				let rowsToAttachForDetail = _.remove(options.dynamicColDictionaryForDetail['userDefinedDetailConfig']);
				let configForDetail = getStandardConfigForDetailView();
				options.dynamicColDictionaryForDetail['userDefinedDetailConfig'] = angular.copy(rowsToAttachForDetail);

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

			service.getStandardConfigForListView = function(){
				let configForList = originalgetStandardConfigForListView();
				var estAssemblyFkIdx = _.findIndex(configForList.columns, {id: 'estassemblyfk'});
				if (estAssemblyFkIdx > -1){
					var estAssemblyFkCol = configForList.columns[estAssemblyFkIdx];
					estAssemblyFkCol.$$postApplyValue = function (grid, item/* , column */) {
						if (Object.hasOwnProperty.call(item, 'EstAssemblyFkPrjProjectAssemblyFk')){
							item.EstAssemblyFk = item.EstAssemblyFkPrjProjectAssemblyFk;
						}
					};
				}
				return configForList;
			};

			return service;
		}
	]);
})(angular);
