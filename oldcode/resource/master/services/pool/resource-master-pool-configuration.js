(function (angular) {
	'use strict';

	var moduleName = 'resource.master';

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

	angular.module(moduleName).value('resourceMasterPoolLayoutConfig', {
		'addition': {
			'grid': extendGrouping([
				{
					afterId: 'resourcesubfk',
					id: 'resourcesubDesc',
					field: 'ResourceSubFk',
					name: 'Subresource Description',
					name$tr$: 'resource.master.resourceSubDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ResourceMasterResource',
						displayMember: 'DescriptionInfo.Translated',
						width: 140,
						version: 3
					}
				}

			])
		}
	});

	//master Layout
	angular.module(moduleName).factory('resourceMasterPoolLayout', ResourceMasterPoolLayout);
	ResourceMasterPoolLayout.$inject = [];

	function ResourceMasterPoolLayout() {
		return {
			'fid': 'resource.master.resourcemasterpoollayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'pool',
					attributes: ['resourcesubfk', 'quantity', 'validfrom', 'validto', 'commenttext']
				}
			],
			'overloads': {
				resourcesubfk: {

					detail: {
						//readonly: false,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'resource-master-resource-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							version: 3
						}
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ResourceMasterResource',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'ResourceSubFk',
							directive: 'resource-master-resource-lookup',
							lookupOptions: {
								showClearButton: true
							}
						}
					}
				}
			}
		};
	}

})(angular);
