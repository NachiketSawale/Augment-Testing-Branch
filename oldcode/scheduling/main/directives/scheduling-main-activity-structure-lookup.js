(function (angular) {
	'use strict';
	angular.module('scheduling.main').directive('schedulingMainActivityStructureLookup', ['_', 'moment', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, moment, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'SchedulingActivity',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '7b5b55db95744c359e7ccc6289913a94',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', width: 100, formatter:'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'Description', field: 'Description', name: 'Description', width: 120, formatter:'description',  name$tr$: 'cloud.common.entityDescription' }
				],
				width: 500,
				height: 200,
				treeOptions: {
					parentProp: 'ParentActivityFk',
					childProp: 'Activities',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			};

			function flattenChild(dataList){
				_.forEach(dataList,function(item){
					item.PlannedStart=moment.utc(item.PlannedStart);
					item.PlannedFinish=moment.utc(item.PlannedFinish);
					item.ActualStart=moment.utc(item.ActualStart);
					item.ActualFinish=moment.utc(item.ActualFinish);
					if(item.Activities&&item.Activities.length>0){
						flattenChild(item.Activities);
					}
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				processData: function (dataList) {
					flattenChild(dataList);
					return dataList;
				}
			});
		}
	]);
})(angular);
