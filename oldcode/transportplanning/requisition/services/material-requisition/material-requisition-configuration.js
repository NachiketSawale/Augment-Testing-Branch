/**
 * Created by anl on 11/14/2017.
 */

(function (angular) {
	'use strict';


	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	RequisitionModul.value('transportplanningRequisitionMatRequisitionLayoutConfig', {
		addition: {
			grid: extendGrouping([
				{
					afterId: 'mdcmaterialfk',
					id: 'materialDesc',
					field: 'MdcMaterialFk',
					name: 'Material-Description',
					name$tr$: 'basics.common.entityMaterialDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'DescriptionInfo.Translated',
						width: 140
					}
				}
			])
		}
	});

	//Requisition Details
	RequisitionModul.factory('transportplanningRequisitionMatRequisitionDetailLayout', RequisitionDetailLayout);
	RequisitionDetailLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function RequisitionDetailLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'transportplanning.requisition.matrequisition',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['mdcmaterialfk', 'trsrequisitionfk', 'quantity', 'uomfk', 'description', 'commenttext']
				},
				{
					gid: 'transportInformation',
					attributes: ['ontime', 'planningstate']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				iscancelled: {readonly: true},
				ontime: {readonly: true},
				planningstate: {readonly: true},
				mdcmaterialfk: {
					navigator: {
						moduleName: 'basics.material'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.selectedMaterial = args.selectedItem;
									}
								}]
							},
							directive: 'basics-material-material-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.selectedMaterial = args.selectedItem;
								}
							}],
							lookupOptions: {
								showClearButton: true
							},
							lookupDirective: 'basics-material-material-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				trsrequisitionfk: {
					navigator: {
						moduleName: 'transportplanning.requisition'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true
								//filterKey: 'transportplanning-bundle-trsRequisition-filter'
							},
							directive: 'transportplanning-requisition-lookup-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsRequisition',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true
							},
							lookupDirective: 'transportplanning-requisition-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				})
			}
		};
	}

})(angular);
