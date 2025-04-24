/**
 * Created by lst on 5/30/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyImportContentSelectionGridUIService', [
		'basicsCompanyImportContentOperationtypeService', 'basicsCompanyImportContentContentTypeService',
		function (basicsCompanyImportContentOperationtypeService, basicsCompanyImportContentContentTypeService) {

			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						addValidationAutomatically: true,
						columns: [
							{
								id: 'selection',
								field: 'selection',
								name$tr$: 'basics.company.importContent.columnSelection',
								formatter: 'boolean',
								editor: 'boolean',
								sortable: false,
								resizable: true,
								headerChkbox: true,
								width: 100
							},
							{
								id: 'contenttype',
								field: 'contenttype',
								domain: 'select',
								editor: 'select',
								editorOptions: {
									items: basicsCompanyImportContentContentTypeService.contentTypeItems,
									displayMember: 'Description',
									valueMember: 'Id'
								},
								formatter: 'select',
								name$tr$: 'basics.company.importContent.columnContentType',
								sortable: false,
								resizable: true,
								width: 100
							},
							{
								id: 'content', field: 'content', name$tr$: 'basics.company.importContent.columnContent',
								formatter: 'content', sortable: false, resizable: true, width: 240
							},
							{
								id: 'id', field: 'id', name$tr$: 'cloud.common.entityId',
								formatter: 'id', sortable: false, resizable: true, width: 100
							},
							{
								id: 'description', field: 'description', name$tr$: 'cloud.common.entityDescription',
								formatter: 'description', sortable: false, resizable: true, width: 240
							},
							{
								id: 'operation',
								field: 'operation',
								domain: 'select',
								editor: 'select',
								editorOptions: {
									items: basicsCompanyImportContentOperationtypeService.importStatusItems,
									displayMember: 'Description',
									valueMember: 'Id'
								},
								formatter: 'select',
								name$tr$: 'basics.company.importContent.columnOperation',
								sortable: false,
								resizable: true,
								width: 100
							}
						]
					};
				}
			};

			return columnDef;
		}
	]);
})(angular);