(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcItemDialog = function prcItemDialog($injector) {
		var procurementCommonPrcItemDataService = $injector.get('procurementCommonPrcItemDataService');
		var _ = $injector.get('_');
		var q = $injector.get('$q');

		return {
			lookupOptions: {
				lookupType: 'prcItemDialog',
				valueMember: 'Id',
				displayMember: 'Itemno',
				columns: [
					{ id: 'code', field: 'Itemno', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description1', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
				],
				width: 500,
				height: 200,
				title: { name: 'procurement.common.dialogTitleItem' },
				disableDataCaching : true
			},
			dataProvider:{
				getList:function (){
					var deferred = q.defer();
					var datalist=procurementCommonPrcItemDataService.getService().data.getList();
					deferred.resolve(datalist);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var item = {};
					item= _.find(procurementCommonPrcItemDataService.getService().data.getList(),function(item1){
						return item1.Id===value;
					});
					return q.when(item);
				},
				getSearchList:function (value,displayMeber,scope,setting){
					var searchString=setting.searchString;
					var deferred = q.defer();
					var datalist=procurementCommonPrcItemDataService.getService().data.getList();
					if(value.length>0) {
						var filterList=_.filter(datalist, function (item) {
							var code=''+item.Itemno;
							return code.indexOf(searchString) > -1;
						});

						deferred.resolve(filterList);
					}
					else {
						deferred.resolve(datalist);
					}
					return deferred.promise;
				}
			}
		};
	};

	angular.module('procurement.common').directive('prcCommonItemDialog', ['$injector','BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			// return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
			var defaults = globals.lookups.prcItemDialog($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions,{
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);