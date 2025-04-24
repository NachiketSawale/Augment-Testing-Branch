/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	angular.module('basics.common').directive('conflictColumnValueSelector', [
		'_',
		'$injector',
		'moment',
		'$q',
		'platformGridAPI',
		'BasicsLookupdataLookupDirectiveDefinition',
		'conflictVersionType',
		'conflictGridContextService',
		function (_,$injector, moment, $q, platformGridAPI, BasicsLookupdataLookupDirectiveDefinition, conflictVersionType, conflictGridContextService) {
			var defaults = {
				version:2,
				lookupType: 'conflictColumnValueSelector',
				disableDataCaching: true,
				valueMember: 'Value',
				displayMember: 'Code',
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							if(args.entity && args.selectedItem) {
								conflictGridContextService.updateRelateColumns(args.entity, angular.copy(args.selectedItem));
							}
						}
					}
				]
			};

			function getConfig(scope){
				return scope.$parent.$parent.config;
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'conflictColumnValueLookupHandler',
					getList: function getList(options, scope) {
						let result = [];
						const gridId = conflictGridContextService.getCurrentConflictGridId();
						const column = getConfig(scope);
						if(gridId && column){
							const grid = platformGridAPI.grids.element('id', gridId);
							if(grid && grid.data && scope && scope.entity){
								const data = grid.data.filter(e => e.Id === scope.entity.Id && e.conflictVersionType !== conflictVersionType.ApplyEntity);
								if(data && data.length > 0){
									result = data.map(function(item, index){
										return {
											Id : index,
											Value: item[column.field],
											Code : column.formatter(1, 1, item[column.field], column, item, true),
											ColumnName : column.field,
											ConflictVersionType : item.conflictVersionType,
										};
									});
								}
							}
						}
						return $q.when(result);
					},
					getDefault: function getDefault() {
						return $q.when([]);
					},
					getItemByKey: function getItemByKey(value, options, scope) {
						const column = getConfig(scope);
						if(column){
							return {
								Id : 1,
								Value: value,
								Code : column.formatter(1, 1, scope.entity[column.field], column, scope.entity, true),
								ColumnName : column.field,
								ConflictVersionType : scope.entity.conflictVersionType,
							};
						}
						return null;
					}
				}
			});
		}
	]);

})();
