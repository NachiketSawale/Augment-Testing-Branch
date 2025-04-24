(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'basics.costgroups';
	angular.module(moduleName).service('basicsCostGroupAssignmentUIStandardService', StackUIStandardService);

	StackUIStandardService.$inject = [
		'basicsCostgroupsTranslationService',
		'basicsCostGroupLookupConfigService',
		'basicsCostGroupColumnGenerationService',
		'basicsCostGroupType',
		'basicsCostGroupsConstantValues',
		'platformLayoutHelperService',
		'platformUIStandardConfigService',
		'platformSchemaService'];

	function StackUIStandardService(basicsCostgroupsTranslationService,
		basicsCostGroupLookupConfigService,
		basicsCostGroupColumnGenerationService,
		basicsCostGroupType,
		basicsCostGroupsConstantValues,
		platformLayoutHelperService,
		platformUIStandardConfigService,
		platformSchemaService) {
		function createLicCostGroupColumn() {
			var config = basicsCostGroupLookupConfigService.provideLicConfig({
				catalogIdGetter: function (entity) {
					return entity.Id;
				},
				costGroupTypeGetter: function (entity) {
					return entity.ProjectFk ? basicsCostGroupType.projectCostGroup : basicsCostGroupType.licCostGroup;
				},
				projectIdGetter: function (entity) {
					return entity.ProjectFk;
				}
			});
			var costGroupColumn = createGridColumn(true);
			return angular.extend(costGroupColumn, config.grid);
		}

		function createGridColumn() {
			return {
				id: 'costgroup',
				field: 'costgroup_',
				name: 'Code',
				name$tr$: 'basics.costgroups.code',
				required: false
			};
		}

		var res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'basics.costgroups.costgroup',
			['code', 'descriptioninfo']);

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache(basicsCostGroupsConstantValues.schemes.costGroupCatalog);
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		var config = new BaseService(res, ruleSetAttributeDomains, basicsCostgroupsTranslationService);

		var listConfig = config.getStandardConfigForListView();
		_.forEach(listConfig.columns, function (column) {
			column.editor = null;
			if(column.id === 'code'){
				column.name = 'Cost Group Catalog Code';
				column.name$tr$ = 'basics.costgroups.costGroupCatalogCode';
				column.toolTip = 'Cost Group Catalog Code';
				column.toolTip$tr$ = 'basics.costgroups.costGroupCatalogCode';
			}
			if(column.id === 'descriptioninfo'){
				column.name = 'Cost Group Catalog Description';
				column.name$tr$ = 'basics.costgroups.costGroupCatalogDesc';
				column.toolTip = 'Cost Group Catalog Description';
				column.toolTip$tr$ = 'basics.costgroups.costGroupCatalogDesc';
			}
		});
		var costGroupColumn = createLicCostGroupColumn();
		listConfig.columns = listConfig.columns.concat(costGroupColumn, basicsCostGroupColumnGenerationService.createCostGroupDescriptionColumn(costGroupColumn));

		config.getStandardConfigForListView = function () {
			return listConfig;
		};

		return config;
	}
})();