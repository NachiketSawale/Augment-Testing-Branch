(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDynamicColumnCollector', ['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
		function DynamicColumnCollector(options){
			this.allColumns = [];
			this.dynamicColDictionaryForList = {};
			this.dynamicColDictionaryForDetail = [];
			this.costGroupCats = [];
			this.options = {};
			this.groupName = 'assignments';

			if(options){
				angular.extend(this.options, options);
			}
		}

		DynamicColumnCollector.prototype.setCostGroupCats = function(costGroupCats){
			this.costGroupCats = costGroupCats;
		};

		// Attach column as object
		// e.g: {costGroups: [{id:1,...}]}
		DynamicColumnCollector.prototype.attachData = function(dataDictionary, dataObject) {
			if (!angular.isObject(dataObject)) {
				return;
			}

			for (let prop in dataObject) {
				// eslint-disable-next-line no-prototype-builtins
				if (dataObject.hasOwnProperty(prop)) {
					let dataObjectList = dataObject[prop];
					_.forEach(dataObjectList, function(dataObjectItem){
						// Flag as dynamic column
						dataObjectItem.isCustomDynamicCol = true;
					});
					dataDictionary[prop] = dataObjectList;
				}
			}
		};

		DynamicColumnCollector.prototype.attachDynColConfigForList = function(dataObject) {
			this.attachData(this.dynamicColDictionaryForList, dataObject);
		};

		DynamicColumnCollector.prototype.attachDynColConfigForDetail = function(dataObject) {
			this.attachData(this.dynamicColDictionaryForDetail, dataObject);
		};

		DynamicColumnCollector.prototype.attachDataForDetail = function(dataObject){
			this.attachData(this.dynamicColDictionaryForDetail, dataObject);
		}

		DynamicColumnCollector.prototype.appendData = function(dataDictionary, dataObject){
			if (!angular.isObject(dataObject)) {
				return;
			}
			for (let prop in dataObject) {
				// eslint-disable-next-line no-prototype-builtins
				if (dataObject.hasOwnProperty(prop)) {
					// eslint-disable-next-line no-prototype-builtins
					if (dataDictionary.hasOwnProperty(prop)===false){
						dataDictionary[prop]=[];
					}
					this.processPropertyData(dataDictionary, prop, dataObject);
				}
			}
		};

		DynamicColumnCollector.prototype.processPropertyData = function(dataDictionary, prop, dataObject){
			_.forEach(dataObject[prop],  function (propDataObject) {
				if (_.findIndex(dataDictionary[prop], {id: propDataObject.id}) === -1){
					// Flag as dynamic column
					propDataObject.isCustomDynamicCol = true;
					dataDictionary[prop].push(propDataObject);
				}
			});
		};

		DynamicColumnCollector.prototype.appendDataForList = function(dataObject){
			this.appendData(this.dynamicColDictionaryForList, dataObject);
		}

		// detach columns
		DynamicColumnCollector.prototype.detachData = function(dataDictionary, dataObjectKey) {
			// eslint-disable-next-line no-prototype-builtins
			if (dataDictionary.hasOwnProperty(dataObjectKey)) {
				delete dataDictionary[dataObjectKey];
			}
		}

		// detach column by key
		DynamicColumnCollector.prototype.detachDataByKey = function(dataDictionary, dataObjectKey, dataItemKey) {
			// eslint-disable-next-line no-prototype-builtins
			if (dataDictionary.hasOwnProperty(dataObjectKey)) {
				if (_.findIndex(dataDictionary[dataObjectKey], {id: dataItemKey}) > -1){
					_.remove(dataDictionary[dataObjectKey], {id: dataItemKey});
				}
			}
		}

		DynamicColumnCollector.prototype.detachDataForList = function(dataObjectKey) {
			this.detachData(this.dynamicColDictionaryForList, dataObjectKey);
		}

		DynamicColumnCollector.prototype.detachDataForDetail = function(dataObjectKey) {
			this.detachData(this.dynamicColDictionaryForDetail, dataObjectKey);
		}

		DynamicColumnCollector.prototype.detachDataItemByKey = function(dataObjectKey, dataItemKey){
			this.detachDataByKey(data.dynamicColDictionaryForList, dataObjectKey, dataItemKey);
		}

		DynamicColumnCollector.prototype.attachCostGroup = function(costGroupCats, costGroupDataService, option) {
			this.costGroupCats = costGroupCats;
			this.option = option ? option : {};
			let costGroupColumnsForList = basicsCostGroupAssignmentService.createCostGroupColumns(costGroupCats, false);
			if (costGroupColumnsForList && angular.isArray(costGroupColumnsForList)) {
				this.attachDynColConfigForList({costGroup: costGroupColumnsForList});
			}
			let costGroupColumnsForDetail = basicsCostGroupAssignmentService.getCostGroupColumnsForDetail(costGroupCats, costGroupDataService, option.costGroupName);
			if (costGroupColumnsForDetail && angular.isArray(costGroupColumnsForDetail)) {
				this.attachDynColConfigForDetail({costGroup: costGroupColumnsForDetail});
			}
		}

		DynamicColumnCollector.prototype.attachCostGroupColumnsForList = function(costGroupColumnsForList){
			this.attachDynColConfigForList({costGroup: costGroupColumnsForList});
		}

		DynamicColumnCollector.prototype.initializeUDPGroupForDetail = function(configForDetail, newDetailRows){
			if (configForDetail && configForDetail.groups && configForDetail.rows && newDetailRows) {
				let gid = 'userDefinedColumns';
				let udpGroupRows = _.filter(newDetailRows, function(row){
					return row.gid === gid;
				});

				if(udpGroupRows.length <= 0){
					return;
				}

				let group = _.find(configForDetail.groups, {gid: gid});

				if(!group){
					group = {
						gid: gid,
						header: 'User-Defined Price',
						header$tr$: 'basics.common.userDefinedColumn.detailGroupName',
						sortOrder: configForDetail.groups.length,
						isOpen: true,
						showHeader: true,
						visible: true,
						rows: []
					};
					configForDetail.groups.push(group);
				}

				let originalRows = _.filter(configForDetail.rows, function (row) {
					return row.gid !== gid;
				});

				configForDetail.rows = originalRows.concat(udpGroupRows);

				let udpGroupIndex = udpGroupRows.length;//_.findIndex(configForDetail.groups, {'gid': 'userDefinedColumns'});
				if (!configForDetail.groupsDict) {
					configForDetail.groupsDict = {};
				}
				configForDetail.groupsDict[group.gid] = group;

				if(!configForDetail.rowsDict){
					configForDetail.rowsDict = {};
				}

				_.forEach(udpGroupRows, function (row) {
					if (_.isNil(configForDetail.rowsDict[row.rid])) {
						row.sortOrder = ++udpGroupIndex;
						group.rows.push(row);
						configForDetail.rowsDict[row.rid] = row;
					}
				});
			}
		}

		DynamicColumnCollector.prototype.initializeCostGroupForDetail = function(configForDetail, newDetailRows, configOption){
			if (configForDetail && configForDetail.groups && configForDetail.rows && configOption && newDetailRows) {
				let option = angular.extend({
					scope : null,
					dataService : null,
					validationService: null,
					costGroupDataService : null,
					formConfiguration : null,
					costGroupName : 'assignments'
				}, configOption);

				let costGroupRows = _.filter(newDetailRows, function (row) {
					// eslint-disable-next-line no-prototype-builtins
					return row.hasOwnProperty('costGroupCatId');
				});

				if(costGroupRows && angular.isArray(costGroupRows) && costGroupRows.length > 0) {
					var originalRows = _.filter(configForDetail.rows, function (row) {
						return !row.hasOwnProperty('costGroupCatId');
					});

					//autoValidation(costGroupRows, option.validationService);

					configForDetail.rows = originalRows.concat(costGroupRows);

					// add costGroups rows to rowsDict
					if (configForDetail.hasOwnProperty('rowsDict')){
						_.forEach(costGroupRows, function(costGroupRow){
							configForDetail.rowsDict[costGroupRow.rid] = costGroupRow;
						});
					}
				}else{
					configForDetail.rows = _.filter(configForDetail.rows, function (row) {
						// eslint-disable-next-line no-prototype-builtins
						return !row.hasOwnProperty('costGroupCatId');
					});
				}
			}
		}

		DynamicColumnCollector.prototype.getExtendColumnsForList = function(){
			return this.getExtendColumns(this.dynamicColDictionaryForList);
		}

		DynamicColumnCollector.prototype.getExtendColumnsForDetail = function(){
			return this.getExtendColumns(this.dynamicColDictionaryForDetail);
		}

		DynamicColumnCollector.prototype.getExtendColumns = function(dataDictionary) {
			let columnsToAttachForList = [];
			for (let prop in dataDictionary) {
				if (dataDictionary.hasOwnProperty(prop)) {
					columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
				}
			}
			return columnsToAttachForList;
		}

		DynamicColumnCollector.prototype.getCostGroupColumns = function(){
			if(!data || !data.dynamicColDictionaryForList || !data.dynamicColDictionaryForList.costGroup){
				return [];
			}

			return data.dynamicColDictionaryForList.costGroup;
		}

		DynamicColumnCollector.prototype.processConfigForDetail = function(configForDetail, configOption){
			configOption = configOption || {};

			let columnsToAttachForList = this.getExtendColumns(this.dynamicColDictionaryForDetail);
			this.initializeUDPGroupForDetail(configForDetail, columnsToAttachForList);
			this.initializeCostGroupForDetail(configForDetail, columnsToAttachForList, configOption.costGroupOption);

			// move the history group to the last one
			if (configForDetail && configForDetail.groups) {
				let entityHistoryGroupIndex = -1;
				entityHistoryGroupIndex = _.findIndex(configForDetail.groups, {'gid': 'entityHistory'});
				if(entityHistoryGroupIndex > -1){
					configForDetail.groups[entityHistoryGroupIndex].sortOrder = configForDetail.groups.length + 1;
				}
			}
		}

		return DynamicColumnCollector;
	}]);

}(angular));