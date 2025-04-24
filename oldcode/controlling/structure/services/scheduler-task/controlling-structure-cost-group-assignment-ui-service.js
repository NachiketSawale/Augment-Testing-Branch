
(function () {
	'use strict';
	let moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureCostGroupAssignmentUiService', [
		'basicsLookupdataConfigGenerator', 'platformTranslateService',
		function (basicsLookupdataConfigGenerator, platformTranslateService) {

			let service = {};

			service.getGridColumns = function() {
				let columns =[
					{
						id: 'classification',
						field: 'Classification',
						name: 'Classification',
						name$tr$: 'controlling.structure.costGroupClassification',
						width: 150
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Cost Group Catalog',
						name$tr$: 'controlling.structure.costGroupCatalog',
						// readonly: true
						width: 120,
						// readonly: false
						editor: 'lookup',
						editorOptions:{
							directive: 'controlling-structure-cost-group-assignment-lookup',
							lookupOptions:{
								showClearButton: true,
								filterKey: 'controlling-structure-cost-group-assignment-lookup-selection-filter',
								displayMember: 'Code',
								valueMember: 'Code'
							}},
						formatter: 'lookup',
						formatterOptions: {
							lookupType:'controllingStructureCostGroupAssignmentLookup',
							displayMember: 'Code',
							dataServiceName: 'controllingStructureCostGroupAssignmentLookupService'
						}},
					{
						id: 'description',
						field: 'DescriptionInfo',
						formatter: 'translation',
						name: 'Description',
						name$tr$: 'controlling.structure.costGroupCatalogsDesc',
						readonly: true,
						width: 250
					},
					{
						id: 'IsProjectCatalog',
						field:'IsProjectCatalog',
						name: 'IsProjectCatalog',
						name$tr$: 'controlling.structure.isProjectCatalog',
						readonly: true,
						width:50,
						formatter: 'boolean'
					}];

				platformTranslateService.translateGridConfig(columns);

				return columns;
			};

			service.getStandardConfigForListView = function () {
				return {
					addValidationAutomatically: true,
					columns: service.getGridColumns()
				};
			};

			return service;
		}]);
})();
