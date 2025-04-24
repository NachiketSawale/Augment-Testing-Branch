/**
 * Created by pel on 01/10/2022.
 */
( function (angular, globals) {
	'use strict';


	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	let moduleName = 'defect.main';
	globals.lookups.DfmDefect = function DfmDefect($injector) {

		return {
			lookupOptions: {
				version:3,
				lookupType: 'DfmDefect',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '8e8ee2e121aa4595bab73628f58e509e',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'cproject',
						field: 'ProjectNo',
						name: 'Project',
						width: 150,
						name$tr$: 'cloud.common.entityPrjProjectFk'
					},
					{
						id: 'status',
						field: 'StatusDescriptionInfo.Translated',
						name: 'Status',
						width: 100,
						name$tr$: 'cloud.common.entityStatus',
						formatter: function (row, cell, value, columnDef, dataContext) {
							dataContext.icon=dataContext.StatusIconId;
							var imageSelector = $injector.get('platformStatusIconService');
							var imageUrl = imageSelector.select(dataContext);
							var isCss = Object.prototype.hasOwnProperty.call(imageSelector, 'isCss') ? imageSelector.isCss() : false;
							return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
								'<span class="pane-r">' + value + '</span>';
						},
						searchable: false
					},
					{
						id: 'defectType',
						field: 'TypeDescriptionInfo.Translated',
						name: 'Type',
						width: 100,
						name$tr$: 'defect.main.entityBasDefectTypeFk',
						searchable: false
					},
					{
						id: 'defectGroup',
						field: 'GroupDescInfo.Translated',
						name: 'Group',
						width: 100,
						name$tr$: 'defect.main.entityDfmGroupFk',
						searchable: false
					},
					{
						id: 'priority',
						field: 'PriorityDescriptionInfo.Translated',
						name: 'Priority',
						width: 100,
						name$tr$: 'defect.main.entityBasDefectPriorityFk',
						searchable: false
					},
					{
						id: 'severity',
						field: 'SeverityDescInfo.Translated',
						name: 'Severity',
						width: 100,
						name$tr$: 'defect.main.entityBasDefectSeverityFk',
						searchable: false
					},
					{
						id: 'warrantyStatus',
						field: 'WarrantyStatusDescInfo.Translated',
						name: 'Warranty Status',
						width: 100,
						name$tr$: 'defect.main.entityBasWarrantyStatusFk',
						searchable: false
					},
					{
						id: 'rubricCategory',
						field: 'RubricCategoryDescInfo.Translated',
						name: 'Rubric Category',
						width: 100,
						name$tr$: 'defect.main.basics.lookup.rubriccategory',
						searchable: false
					}

				],
				width: 500,
				height: 200,
				title: {name:'defect.main.defectLookupDialogueTitle'},
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module(moduleName).directive('defectMainCommonLookupDialog', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.DfmDefect($injector).lookupOptions);
		}
	]);

})(angular, globals);