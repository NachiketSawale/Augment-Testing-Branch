/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * Factory service for managing cell change queue and conflict resolution.
	 */
	angular.module('basics.common').factory('basicsCommonConflictGridInfoFactory', [
		'$injector',
		'_',
		'platformGridAPI',
		'conflictVersionType',
		function ($injector, _, platformGridAPI, conflictVersionType) {

			function ConflictGridInfoItem(gridConfig, conflictData, serviceConfig, applyChangeService){
				const self = this;
				this.idProperty = 'sequence';
				this.gridId = gridConfig.id;
				this.gridConfig = gridConfig;
				this.conflictData = conflictData;
				this.serviceConfig = serviceConfig;
				this.applyChangeService = applyChangeService;

				this.getGridData = function(){
					return this.gridConfig.data;
				};

				this.getTypeName = function(){
					return this.serviceConfig.typeName;
				};

				this.getDataService = function(){
					let dataService = this.serviceConfig ? this.serviceConfig.dataService : null;
					if(dataService){
						return angular.isString(dataService) ? $injector.get(dataService) : dataService;
					}
					return null;
				};

				/*
				 * add entity to modification, then it will extend the entityToSave in modification
				 * not used now, maybe we can use it to apply the conflict resolve and replace the apply function.
				 */
				this.addOrExtendEntityToModified = function(modification){
					//need to config the mainService, and maybe we need to flag it need to recalculate
					const self = this;
					const data = this.getGridData().filter(e => e.isChecked);
					if(this.getDataService() && data && data.length > 0){
						data.forEach(item =>{
							const applyEntity = self.getGridData().find(e => e.Id === item.Id && e.conflictVersionType === conflictVersionType.ApplyEntity);
							const extendObj = _.pick(item, self.conflictData.ConflictColumnNames);
							extendObj.Version = applyEntity.Version;
							self.getDataService().addOrExtendEntityToModified(modification, item, extendObj);
						});
					}
				};

				/*
				 * collect the conflict resolve apply column value, it will send to serve-side later.
				 */
				this.apply = function(){
					const self = this;
					const data = this.gridConfig.data;
					if(data && data.length > 0 && this.conflictData.ConflictColumnNames) {
						data.forEach((row) => {
							if(row.isChecked && row.conflictVersionType !== conflictVersionType.MyLocalEntity) {
								this.conflictData.ConflictColumnNames.forEach(col => {
									self.applyChangeService.addChangesApplied(self.getTypeName(), col, row);
								});
							}
						});
					}
				};

				/*
				 * update the relate columns when there are in the same RelGroup which config in the ConcurrencyTypeAttribute
				 */
				this.updateRelateColumns = function(entity, selectedItem){
					const relateEntity = this.getGridData().find((e) => e.Id === entity.Id && e.conflictVersionType === selectedItem.ConflictVersionType);
					if(relateEntity && this.conflictData.PropName2RelateProps && this.conflictData.PropName2RelateProps[selectedItem.ColumnName]){
						this.conflictData.PropName2RelateProps[selectedItem.ColumnName].forEach((col) => {
							entity[col] = relateEntity[col];
						});
						platformGridAPI.rows.refreshRow({ gridId: this.gridId, item: entity });
					}
				};
			}

			return {
				createConflictGridInfoItem: function(gridConfig, conflictData, serviceConfig, applyChangeService){
					return new ConflictGridInfoItem(gridConfig, conflictData, serviceConfig, applyChangeService);
				},
			};
		},
	]);
})(angular);
