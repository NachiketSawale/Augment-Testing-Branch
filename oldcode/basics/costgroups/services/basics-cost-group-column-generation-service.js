/**
 * Created by xia on 8/13/2019.
 */
(function(angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupColumnGenerationService', ['_', '$translate', '$log', 'basicsCostGroupLookupConfigService', function (_, $translate, $log, basicsCostGroupLookupConfigService) {

		var fieldTag = 'costgroup_';
		var licCostGroupTag = 'costgroup_lic_';
		var prjCostGroupTag = 'costgroup_prj_';

		var additionColumn = {
			id: 'Description',
			field: 'DescriptionInfo',
			name: 'Description',
			width: 300,
			formatter: 'translation',
			name$tr$: 'cloud.common.entityDescription'
		};

		function extendGrouping(gridColumns) {
			angular.forEach(gridColumns, function (column) {
				angular.extend(column, {
					grouping: {
						title: column.name,
						getter: column.field,
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					}
				});
			});
			return gridColumns;
		}

		function generateColumnId(item, isLicCostGroup){
			return isLicCostGroup ? licCostGroupTag + item.Code : prjCostGroupTag + item.Code;
		}

		function getTranslation(col) {
			var translation   = col.name$tr$ ? $translate.instant(col.name$tr$) : col.name,
				notTranslated = translation === col.name$tr$;
			if (notTranslated) {
				$log.warn('Identifier "' + col.name$tr$ + '" was not translated (for additional lookup column).');
			}
			return notTranslated ? col.name : translation;
		}

		function getCostGroupColumnName(item){
			var description = item.DescriptionInfo.Translated || item.DescriptionInfo.Description;
			return description ? item.Code + '(' + description + ')' : item.Code;
		}

		function createGridColumn(item, isLicCostGroup){

			return {
				id : generateColumnId(item, isLicCostGroup).toLowerCase(),
				field : fieldTag + item.Id,
				costGroupCatId : item.Id,
				costGroupCatCode : item.Code,
				name : getCostGroupColumnName(item),
				name$tr$ : undefined,
				columnid : item.Id,
				isDynamic : true,
				sortable: true,
				required : false,
				hidden : false,
				sortOrder : item.Sorting,
				bulkSupport: true
			};
		}

		function createDetailColumn(item, costGroupDataService, isLicCostGroup){
			return {
				rid: generateColumnId(item, isLicCostGroup).toLowerCase(),
				label: getCostGroupColumnName(item),
				model: fieldTag + item.Id,
				costGroupCatId : item.Id,
				costGroupCatCode : item.Code,
				hidden: false,
				visible: true,
				isDynamic: true,
				required: false,
				type: 'directive',
				sortOrder : item.Sorting,
				change : function(entity, model, options){
					if(costGroupDataService){
						if(costGroupDataService && options && options.costGroupCatId){
							let col = {costGroupCatId: options.costGroupCatId, field: options.model};
							if(costGroupDataService.parentService().getServiceName() === 'qtoMainDetailService') {
								costGroupDataService.createCostGroupForQtoLines(entity, col);
							}
							else {
								costGroupDataService.createCostGroup2Save(entity, col);
							}
						}
					}
				}
			};
		}

		function createCostGroupDescriptionColumn(item){
			return {
				id: item.id.toLowerCase() + '_Desc',
				formatter: item.formatter,
				field: item.field,
				name: getTranslation(item) + '-' + getTranslation(additionColumn),
				sortOrder : item.sortOrder,
				sortable: true,
				grouping: item.grouping,
				width: 60,
				formatterOptions: {
					dataServiceName: (additionColumn.formatterOptions && additionColumn.formatterOptions.dataServiceName) || item.formatterOptions.dataServiceName,
					displayMember: additionColumn.formatter === 'translation' ? additionColumn.field + '.Translated' : additionColumn.field,
					isClientSearch: (additionColumn.formatterOptions && additionColumn.formatterOptions.isClientSearch) || item.formatterOptions.isClientSearch,
					lookupType: (additionColumn.formatterOptions && additionColumn.formatterOptions.lookupType) || item.formatterOptions.lookupType,
					filter: (additionColumn.formatterOptions && additionColumn.formatterOptions.filter) || item.formatterOptions.filter,
					version: (additionColumn.formatterOptions && additionColumn.formatterOptions.version) || item.formatterOptions.version
				}
			};
		}

		function createLicCostGroupColumn(item, costGroupDataService, isForDetail){
			var config = basicsCostGroupLookupConfigService.provideLicConfig({catalogIdGetter : function(){
				return item.Id;
			}});

			var costGroupColumn = isForDetail ? createDetailColumn(item, costGroupDataService, true) : createGridColumn(item, true);

			return angular.extend(costGroupColumn, !isForDetail ? config.grid : config.detail);
		}

		function createPrjCostGroupColumn(item, costGroupDataService, isForDetail, projectId) {
			var config = basicsCostGroupLookupConfigService.provideProjectConfig({
				catalogIdGetter : function(){return item.Id;},
				projectIdGetter : function(){return projectId;}
			});

			var costGroupColumn = isForDetail ? createDetailColumn(item, costGroupDataService, false) : createGridColumn(item, false);

			return angular.extend(costGroupColumn, !isForDetail ? config.grid : config.detail);
		}

		function createCostGroupColumns(costGroupCats, costGroupDataService, createFunc, isForDetail, projectId){
			var columns = [];

			if(!costGroupCats || !angular.isArray(costGroupCats)) { return columns; }

			/* create lic costGroup columns */
			_.forEach(costGroupCats, function (item) {

				var newColumn = createFunc(item, costGroupDataService, isForDetail, projectId);

				columns.push(newColumn);

				if(!isForDetail){
					// Cost group description column
					columns.push(createCostGroupDescriptionColumn(newColumn));
				}
			});

			extendGrouping(columns);

			/* order by sorting */
			columns = _.sortBy(columns, 'sortOrder');

			return columns;
		}

		var service = {};

		service.createLicCostGroupColumnsForGrid = function(licCostGroupCats, isForDetail){
			return createCostGroupColumns(licCostGroupCats, null, createLicCostGroupColumn, isForDetail);
		};

		service.createPrjCostGroupColumnsForGrid = function (prjCostGroupCats, isForDetail, projectId) {
			return createCostGroupColumns(prjCostGroupCats, null, createPrjCostGroupColumn, isForDetail, projectId);
		};

		service.createCostGroupColumns = function(licCostGroupCats, prjCostGroupCats, isForDetail, projectId){
			var columns = service.createLicCostGroupColumnsForGrid(licCostGroupCats, isForDetail);
			columns = columns.concat(service.createPrjCostGroupColumnsForGrid(prjCostGroupCats, isForDetail, projectId));
			/* order by sorting */
			// columns = _.sortBy(columns, 'sortOrder');
			return columns;
		};

		service.createLicCostGroupColumnsForDetail = function(licCostGroupCats, costGroupDataService){
			return createCostGroupColumns(licCostGroupCats, costGroupDataService, createLicCostGroupColumn, true);
		};

		service.createPrjCostGroupColumnsForDetail = function(prjCostGroupCats, costGroupDataService, projectId){
			return createCostGroupColumns(prjCostGroupCats, costGroupDataService, createPrjCostGroupColumn, true, projectId);
		};

		service.createCostGroupColumnsForDetail = function(licCostGroupCats, prjCostGroupCats, costGroupDataService, projectId){
			var columns = service.createLicCostGroupColumnsForDetail(licCostGroupCats, costGroupDataService);
			columns = columns.concat(service.createPrjCostGroupColumnsForDetail(prjCostGroupCats, costGroupDataService, projectId));
			/* order by sorting */
			// columns = _.sortBy(columns, 'sortOrder');
			return columns;
		};

		service.createCostGroupDescriptionColumn = createCostGroupDescriptionColumn;

		return service;
	}]);
})(angular);