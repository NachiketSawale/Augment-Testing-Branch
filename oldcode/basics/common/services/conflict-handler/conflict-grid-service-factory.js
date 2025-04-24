/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * factory for resource merge service
	 */
	angular.module('basics.common').factory('basicsCommonConflictGridServiceFactory', [
		'$injector',
		'$translate',
		'_',
		'platformGridControllerService',
		'platformLayoutHelperService',
		'platformCreateUuid',
		'conflictVersionType',
		function ($injector, $translate, _, platformGridControllerService, platformLayoutHelperService, platformCreateUuid,
			conflictVersionType) {

			function createConflictVersionInfoColumn() {
				return {
					editor: null,
					editorOptions: null,
					field: 'conflictVersionType',
					formatter: function (row, cell, value){
						let result = $translate.instant('basics.common.conflict.mergeData');
						switch (value) {
							case conflictVersionType.OthersEntity:{
								result = $translate.instant('basics.common.conflict.remoteData');
								break;
							}
							case conflictVersionType.MyLocalEntity:{
								result = $translate.instant('basics.common.conflict.localData');
								break;
							}
						}
						return result;
					},
					id: 'conflictVersionType',
					name: 'conflictVersionType',
					name$tr$: 'basics.common.conflict.conflictVersionTypeInfo',
					sortable: false,
					toolTip: 'Conflict Version Type Info',
					toolTip$tr$: 'basics.common.conflict.conflictVersionTypeInfo',
					width: 200,
				};
			}

			function createMarkerColumn() {
				return {
					editor: 'marker',
					editorOptions: {
						idProperty: 'sequence',
						multiSelect: true,
					},
					field: 'isChecked',
					formatter: 'marker',
					id: 'marker',
					name: 'Keep',
					name$tr$: 'basics.common.conflict.keep',
					sortable: false,
					width: 50
				};
			}

			function createUpdateAtColumn() {
				return {
					id: 'updatedat',
					field: 'UpdatedAt',
					name: 'Updated At',
					name$tr$: 'cloud.common.entityUpdatedAt',
					readonly: true,
					type: 'dateutc',
					sortable: true,
					toolTip: 'Updated At',
					toolTip$tr$: 'cloud.common.entityUpdatedAt',
					editor: null,
					width: 180
				};
			}

			function createUpdateByColumn() {
				const column = angular.copy(platformLayoutHelperService.provideUserLookupDialogOverload().grid);
				column.id = 'updatedby';
				column.field = 'UpdatedBy';
				column.name = 'Updated By';
				column.name$tr$ = 'cloud.common.entityUpdatedBy';
				column.readonly = true;
				column.type = 'directive';
				column.sortable = true;
				column.toolTip = 'Updated By';
				column.toolTip$tr$ = 'cloud.common.entityUpdatedBy';
				column.editor = null;
				column.width = 180;
				return column;
			}

			function createConflictGridService(conflictInfo, serviceConfig) {
				const idProperty = 'sequence';

				/**
				 * Creates conflict grid columns by combining common columns and conflict-specific columns.
				 * @returns {Array} The array of combined columns with validation functions added.
				 */
				function createConflictGridColumns() {
					let columnSet = new Set();
					// Add conflict version info column
					columnSet.add(createMarkerColumn());
					columnSet.add(createConflictVersionInfoColumn());
					// Add updatedBy column
					columnSet.add(createUpdateByColumn());
					// Add updatedAt column
					columnSet.add(createUpdateAtColumn());
					// Add fixed columns
					cloneAndAddColumns(columnSet, conflictInfo.FixedColumnNames, true);
					// Add conflict columns
					cloneAndAddColumns(columnSet, conflictInfo.ConflictColumnNames, false);
					return [...columnSet];
				}

				function cloneAndAddColumns(columnSet, columnNames, isFixedColumn) {
					if(angular.isArray(columnNames) && columnNames.length > 0){
						const columns = cloneColumns(columnNames, isFixedColumn);
						if(columns.length > 0){
							columns.forEach((column) => {
								columnSet.add(column);
							});
						}
					}
				}

				function getStandardConfigColumns() {
					return $injector.get(serviceConfig.configurationService).getStandardConfigForListView().columns;
				}

				function cloneColumns(columnNames, isFixedColumn) {
					return getStandardConfigColumns().filter(column => columnNames.includes(column.field)).map(column => {
						const columnCloned = angular.copy(column);
						if(isFixedColumn){
							columnCloned.readonly = true;
							columnCloned.editor = null;
						}else{
							columnCloned.navigator = null;
							columnCloned.editor = 'dynamic';
							columnCloned.formatter = 'dynamic';
							columnCloned.domain = function(item, columnDef, isEditor){
								if(isEditor){
									if(item.conflictVersionType === conflictVersionType.ApplyEntity){
										columnDef.editorOptions = {
											showClearButton: false,
											displayMember: 'Code',
											directive: 'conflict-Column-Value-Selector',
											formatter: column.formatter,
											name: column.name,
										};
										return 'lookup';
									}else{
										return null;
									}
								}else{
									return column.formatter;
								}
							}
						}
						return columnCloned;
					});
				}

				function createConflictGridData() {
					const gridData = [];
					let idNext = 1;
					//add history info
					if(angular.isArray(conflictInfo.EntityChanges) && conflictInfo.EntityChanges.length > 0){
						conflictInfo.EntityChanges.forEach((entityChange) => {
							if(!entityChange.IsAutoMerge){
								const localEntity = entityChange.MyLocalEntity;
								const remoteEntity = entityChange.OthersEntity;
								const applyEntity = entityChange.ApplyEntity;

								//add local entity
								localEntity[idProperty] = idNext++;
								localEntity.conflictVersionType = conflictVersionType.MyLocalEntity;
								localEntity.isChecked = true;
								gridData.push(localEntity);

								//add remote entity
								remoteEntity[idProperty] = idNext++;
								remoteEntity.conflictVersionType = conflictVersionType.OthersEntity;
								remoteEntity.isChecked = false;
								gridData.push(remoteEntity);

								//add local entity cloned as apply entity
								applyEntity[idProperty] = idNext++;
								applyEntity.conflictVersionType = conflictVersionType.ApplyEntity;
								applyEntity.isChecked = false;
								gridData.push(applyEntity);

								$injector.get('platformDataProcessExtensionHistoryCreator').processItem(remoteEntity);
								$injector.get('basicsCommonConflictItemProcessor').process([localEntity, remoteEntity, applyEntity]);
							}
						});
					}
					return gridData;
				}

				function createConflictGridConfig() {
					return {
						id: platformCreateUuid(),
						columns: createConflictGridColumns(),
						data: createConflictGridData(),
						lazyInit: false,
						title: serviceConfig.title ? $translate.instant(serviceConfig.title) : conflictInfo.typeName,
						options: {
							tree: false,
							indicator: true,
							allowRowDrag: false,
							idProperty: idProperty,
							skipPermissionCheck: true,
							showMainTopPanel: false
						},
					};
				}

				return {
					generateGridConfig : function () {
						return createConflictGridConfig();
					},
					getServiceConfig : function(){
						return serviceConfig;
					}
				};
			}

			return {
				createConflictGridService : createConflictGridService
			};
		}
	]);
})(angular);