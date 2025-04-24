/**
 * @author: chd
 * @date: 10/23/2020 3:00 PM
 * @description:
 */

(function(angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsAICostGroupColumnGenerationService', ['_', '$translate', '$log', 'basicsAICostGroupLookupConfigService',
		function (_, $translate, $log, basicsAICostGroupLookupConfigService) {

			var fieldTag = 'costgroup_',
				suggestedFieldTag = 'suggested_costgroup_',
				licCostGroupTag = 'costgroup_lic_',
				suggestedLicCostGroupTag = 'suggested_costgroup_lic_',
				prjCostGroupTag = 'costgroup_prj_',
				suggestedPrjCostGroupTag = 'suggested_costgroup_prj_';


			var original = $translate.instant('basics.costgroups.ai.original');
			var suggested = $translate.instant('basics.costgroups.ai.suggested');

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

			function generateAIColumnId(item, isLicCostGroup){
				return isLicCostGroup ? licCostGroupTag + item.Code : prjCostGroupTag + item.Code;
			}

			function generateSuggestedAIColumnId(item, isLicCostGroup){
				return isLicCostGroup ? suggestedLicCostGroupTag + item.Code : suggestedPrjCostGroupTag + item.Code;
			}

			function getTranslation(col) {
				var translation   = col.name$tr$ ? $translate.instant(col.name$tr$) : col.name,
					notTranslated = translation === col.name$tr$;
				if (notTranslated) {
					$log.warn('Identifier "' + col.name$tr$ + '" was not translated (for additional lookup column).');
				}
				return notTranslated ? col.name : translation;
			}

			function getAICostGroupColumnName(item){
				var description = item.DescriptionInfo.Translated || item.DescriptionInfo.Description;
				return description ? original + ' ' + item.Code + '(' + description + ')' : original + ' ' + item.Code;
			}

			function getAISuggestedCostGroupColumnName(item){
				var description = item.DescriptionInfo.Translated || item.DescriptionInfo.Description;
				return description ? suggested + ' ' + item.Code + '(' + description + ')' : suggested + ' ' + item.Code;
			}

			function createAIGridColumn(item, isLicCostGroup){

				return {
					id : generateAIColumnId(item, isLicCostGroup).toLowerCase(),
					field : fieldTag + item.Id,
					costGroupCatId : item.Id,
					costGroupCatCode : item.Code,
					name : getAICostGroupColumnName(item),
					name$tr$ : undefined,
					columnid : item.Id,
					isDynamic : true,
					sortable: true,
					required : false,
					hidden : false,
					sortOrder : item.Sorting,
					bulkSupport: true,
					readOnly: true
				};
			}

			function createAISuggestedGridColumn(item, isLicCostGroup){

				return {
					id : generateSuggestedAIColumnId(item, isLicCostGroup).toLowerCase(),
					field : suggestedFieldTag + item.Id,
					costGroupCatId : item.Id,
					costGroupCatCode : item.Code,
					name : getAISuggestedCostGroupColumnName(item),
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

			function createAICostGroupDescriptionColumn(item){
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

			function createAILicCostGroupColumn(item){
				var config = basicsAICostGroupLookupConfigService.provideAILicConfig({catalogIdGetter : function(){
					return item.Id;
				}});

				var costGroupColumn = createAIGridColumn(item, true);

				return angular.extend(costGroupColumn, config.grid);
			}

			function createAISuggestedLicCostGroupColumn(item){
				var config = basicsAICostGroupLookupConfigService.provideAILicConfig({catalogIdGetter : function(){
					return item.Id;
				}});

				var costGroupColumn = createAISuggestedGridColumn(item, true);
				return angular.extend(costGroupColumn, config.grid);
			}

			function createAIPrjCostGroupColumn(item, projectId) {
				var config = basicsAICostGroupLookupConfigService.provideAIProjectConfig({
					catalogIdGetter : function(){return item.Id;},
					projectIdGetter : function(){return projectId;}
				});

				var costGroupColumn =  createAIGridColumn(item, false);

				return angular.extend(costGroupColumn, config.grid);
			}

			function createAISuggestedPrjCostGroupColumn(item, projectId){
				var config = basicsAICostGroupLookupConfigService.provideAIProjectConfig({
					catalogIdGetter : function(){return item.Id;},
					projectIdGetter : function(){return projectId;}
				});

				var costGroupColumn = createAISuggestedGridColumn(item, false);

				return angular.extend(costGroupColumn, config.grid);
			}

			function createAICostGroupColumns(costGroupCats, costGroupDataService, createFunc, suggestedCreateFunc, isForDetail, projectId){
				var columns = [];

				if(!costGroupCats || !angular.isArray(costGroupCats)) { return columns; }

				/* create costGroup columns */
				_.forEach(costGroupCats, function (item) {

					var newColumn = createFunc(item, projectId);

					columns.push(newColumn);

					if(!isForDetail){
					// Cost group description column
						columns.push(createAICostGroupDescriptionColumn(newColumn));
					}

					var newSuggestedColumn = suggestedCreateFunc(item, projectId);

					columns.push(newSuggestedColumn);

					if(!isForDetail){
					// Cost group description column
						columns.push(createAICostGroupDescriptionColumn(newSuggestedColumn));
					}
				});

				extendGrouping(columns);

				/* order by sorting */
				columns = _.sortBy(columns, 'sortOrder');

				return columns;
			}

			var service = {};

			service.createAILicCostGroupColumnsForGrid = function(licCostGroupCats, projectId){
				return createAICostGroupColumns(licCostGroupCats, null, createAILicCostGroupColumn, createAISuggestedLicCostGroupColumn, false, projectId);
			};

			service.createAIPrjCostGroupColumnsForGrid = function (prjCostGroupCats, projectId) {
				return createAICostGroupColumns(prjCostGroupCats, null, createAIPrjCostGroupColumn, createAISuggestedPrjCostGroupColumn, false, projectId);
			};

			service.createAICostGroupColumns = function(licCostGroupCats, prjCostGroupCats, projectId){
				var columns = service.createAILicCostGroupColumnsForGrid(licCostGroupCats, projectId);
				columns = columns.concat(service.createAIPrjCostGroupColumnsForGrid(prjCostGroupCats, projectId));
				return columns;
			};

			service.createCostGroupDescriptionColumn = createAICostGroupDescriptionColumn;

			return service;
		}]);
})(angular);
