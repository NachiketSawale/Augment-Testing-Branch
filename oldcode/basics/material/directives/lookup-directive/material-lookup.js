(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module(moduleName).directive('basicsMaterialMaterialLookupObsolete', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsMaterialLookupService', '$templateCache','$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, basicsMaterialLookupService, $templateCache,$injector) {
			var defaults = {
				lookupType: 'MaterialCommodity',
				valueMember: 'Id',
				displayMember: 'Code',
				showClearButton: true,
				autoComplete:true,
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'estimateprice',
						field: 'EstimatePrice',
						name: 'Estimate Price',
						width: 80,
						formatter: 'money',
						name$tr$: 'basics.material.record.estimatePrice'
					},
					{
						id: 'listprice',
						field: 'ListPrice',
						name: 'List Price',
						width: 80,
						formatter: 'money',
						name$tr$: 'basics.material.record.listprice'
					}],
				popupOptions: {
					width: 420,
					height: 300,
					template: $templateCache.get('grid-popup-lookup.html'),
					footerTemplate: $templateCache.get('lookup-popup-footer.html'),
					controller: 'basicsLookupdataGridPopupController',
					showLastSize: true
				},
				dialogOptions: {
					headerText$tr$:'basics.material.materialSearchLookup.htmlTranslate.materialSearch',
					templateUrl: globals.appBaseUrl + moduleName + '/partials/material-lookup.html',
					showMinimizeMaximizeButton:true
				},
				events: [
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							var selectedItems = args.selectedItems,
								usageContext = args.lookupOptions.usageContext;
							if (usageContext){
								var serviceContext = $injector.get(usageContext);
								if (serviceContext ){
									if(angular.isFunction(serviceContext.getMaterialLookupSelectedItems)){
										serviceContext.getMaterialLookupSelectedItems(selectedItems || []);
									}
                            	else if(angular.isFunction(serviceContext.getService)&&angular.isFunction(serviceContext.getService().getMaterialLookupSelectedItems)) {
										serviceContext.getService().getMaterialLookupSelectedItems(selectedItems || []);
									}
								}
							}
						}
					}
				],
				width: '850px',
				height: '600px',
				minWidth: '600px',
				minHeight: '400px',
				resizeable: true,
				pageOptions: {
					enabled: true,
					size: 10
				},
				version: 3,
				disableDataCaching: true,
				uuid: 'f1661fdf78688a65b8fcf5c3b695e0ec',
				dialogUuid: 'b3c72dceb90f0af20e1f1c09431491e8'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults,{
				dataProvider: {
					getSearchList: basicsMaterialLookupService.getSearchList,
					getList: basicsMaterialLookupService.getList,
					getItemByKey: basicsMaterialLookupService.getItemByKey
				}});
		}]);

})(angular);