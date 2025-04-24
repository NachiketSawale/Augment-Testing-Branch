/**
 * Created by xia on 12/27/2016.
 */

(function (angular, globals) {
	'use strict';

	/* globals  globals */

	globals.lookups.PrjBoqExtended = function PrjBoqExtended($injector){
		var qtoProjectBoqDataService = $injector.get('qtoProjectBoqDataService');
		return {
			lookupOptions:{
				lookupType: 'PrjBoqExtended',
				valueMember: 'Id',
				displayMember: 'Reference',
				uuid: '18fa9d7b50ed41c1a716129cd970a389',
				columns:[
					{ id: 'ref', field: 'Reference', name: 'Reference', width:50, toolTip: 'Reference', formatter: 'description', name$tr$: 'boq.main.Reference'},
					{ id: 'brief', field: 'BriefInfo', name: 'Brief', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'}
				],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							var selectedDataItem = args.entity;
							if(args.selectedItem !== null) {
								selectedDataItem.PrjBoqFk = args.selectedItem.Id;
								if (selectedDataItem.__rt$data && selectedDataItem.__rt$data.errors && selectedDataItem.__rt$data.errors.PrjBoqFk) {
									selectedDataItem.__rt$data.errors.PrjBoqFk = null;
								}
							}
						}
					}
				]
			},
			dataProvider: {
				myUniqueIdentifier: 'qtoProjectBoqDataService',

				getList: function () {
					return qtoProjectBoqDataService.getListAsync();
				},

				getItemByKey: function (value) {
					return qtoProjectBoqDataService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return qtoProjectBoqDataService.getItemByIdAsync(value);
				},

				getSearchList: function (value) {
					return qtoProjectBoqDataService.getSearchList(value);
				}
			}
		};
	};

	angular.module('qto.main').directive('qtoMainProjectBoqLookup',
		['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition', '$injector',
			function (lookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition, $injector) {
				var defaults = globals.lookups.PrjBoqExtended($injector);

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions,{
					dataProvider: defaults.dataProvider
				}
				);
			}]);

})(angular, globals);
