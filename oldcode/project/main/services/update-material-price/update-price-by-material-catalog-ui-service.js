/**
 * Created by jie on 12/27/2023.
 */
(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceByMaterialCatalogUIService', projectMainUpdatePriceByMaterialCatalogUIService);

	projectMainUpdatePriceByMaterialCatalogUIService.$inject = ['$translate', 'projectMainUpdatePriceFromCatalogAdditionalData',
		'projectMainUpdateResultFieldVarianceFormatter','$q','$injector'];

	function projectMainUpdatePriceByMaterialCatalogUIService($translate, projectMainUpdatePriceFromCatalogAdditionalData,
		projectMainUpdateResultFieldVarianceFormatter,$q,$injector) {

		var columnsFileds = [
			{
				id: 'upSelected',
				field: 'Selected',
				name: 'Selected',
				name$tr$: 'project.main.selected',
				formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
					var html = '';
					if(dataContext.hasOwnProperty('isIndeterMinate')){
						if(dataContext.isIndeterMinate){
							html = '<input type="checkbox" id='+dataContext.Id+'>';
							setTimeout(()=>{
								let elementList = $('#ce5ae346f4c74fba98d776f756537eec').find('input[type=checkbox]');
								let element = _.find(elementList,{id:dataContext.Id.toString()});
								angular.element(element).prop('indeterminate', true);
							},200);
							return '<div class="text-center" >' + html + '</div>';
						}
					}
					if (value === true) {
						html = '<input type="checkbox" id="'+dataContext.Id+'" checked />';
					} else if (value === 'readonly') {
						html = '<input type="checkbox" disabled />';
					} else if (value === 'unknown') {
						setTimeout(function () {
							angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
						}, 0);

						html = '<input type="checkbox" />';
					} else {
						html = '<input type="checkbox" id='+dataContext.Id+' unchecked/>';
					}
					setTimeout(()=>{
						var materialService = $injector.get('projectMainUpdatePriceByMaterialCatalogService');
						let itemList = materialService.getList();
						let allSelectedItem = _.filter(itemList,{Selected:true});
						let elementList = $('#ce5ae346f4c74fba98d776f756537eec').find('input[type=checkbox]');
						if((itemList.length === allSelectedItem.length) || allSelectedItem.length === 0){
							angular.element(elementList[0]).prop('indeterminate', false);
							if(itemList.length === allSelectedItem.length){
								angular.element(elementList[0]).prop('checked',true);
							}
						}else{
							angular.element(elementList[0]).prop('indeterminate', true);
						}},100);
					return '<div class="text-center" >' + html + '</div>';
				},
				editor: 'directive',
				editorOptions: {
					directive: 'material-group-checkbox'
				},
				width: 70,
				pinned: true,
				headerChkbox: true,
				asyncValidator:(e,f)=>{
					var materialService = $injector.get('projectMainUpdatePriceByMaterialCatalogService');
					let itemList = materialService.getList();
					e.Selected = f;


					let elementList = $('#ce5ae346f4c74fba98d776f756537eec').find('input[type=checkbox]');
					if(e.nodeInfo.lastElement){
						var childCount =  0;
						let parentItem = _.find(itemList,{Id:e.StructureFk});
						parentItem.isIndeterMinate = false;
						let element = _.find(elementList,{id:parentItem.Id.toString()});
						if(parentItem){
							for (let i = 0; i < parentItem.Children.length; i++) {
								if(parentItem.Children[i].Selected){
									childCount++;
								}
							}
							if(childCount === parentItem.Children.length){
								parentItem.Selected = true;
								materialService.fireItemModified(parentItem);
							}else if(childCount > 0 && parentItem.Children.length>childCount){
								angular.element(element).prop('indeterminate', true);
								parentItem.isIndeterMinate = true;
								parentItem.Selected = false;
							}else{
								parentItem.Selected = false;
								materialService.fireItemModified(parentItem);
							}
						}
					}else {
						_.forEach(e.Children, (item) => {
							item.Selected = f;
							materialService.fireItemModified(item);
						});
						e.isIndeterMinate = false;
						materialService.fireItemModified(e);
					}
					return $q.when({
						apply: true, valid: true
					});
				}
			},
			{
				id: 'upCatalogCode',
				field: 'CatalogCode',
				name: 'Catalog Code',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.catalogCode',
				formatter: 'code',
				width: 100
			},
			{
				id: 'upCatalogDesc',
				field: 'CatalogDescription',
				name: 'Catalog Description',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.catalogDesc',
				formatter: 'description',
				width: 120
			},
			{
				id: 'upGroupCode',
				field: 'GroupCode',
				name: 'Group Code',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.groupCode',
				formatter: 'code',
				width: 100
			},
			{
				id: 'upGroupDesc',
				field: 'GroupDescriptionInfo.Translated',
				name: 'Group Description',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.groupDesc',
				formatter: 'description',
				width: 120
			},
			{
				id: 'upStructureCode',
				field: 'StructureCode',
				name: 'Structure Code',
				name$tr$: 'project.main.structureCode',
				width: 90,
				formatter: 'code'
			},
			{
				id: 'upStructureDes',
				field: 'StructureDes',
				name: 'Structure Description',
				name$tr$: 'project.main.structureDescription',
				formatter: 'description',
				width: 150
			},
			{
				id: 'upMaterialPriceVersionFk',
				field: 'MaterialPriceVersionFk',
				name: 'Price Version',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.priceList.materialPriceVersion',
				editor: 'lookup',
				editorOptions: {
					directive: 'basics-material-catalog-price-version-lookup',
					lookupOptions: {
						filterKey: 'update-material-by-catalog-price-version-filter',
						showClearButton: true,
						additionalData: projectMainUpdatePriceFromCatalogAdditionalData.additionalPriceVersions
					}
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'MaterialPriceVersion',
					displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
				},
				width: 100,
				asyncValidator: function (e, f) {
					if(e.hasOwnProperty('Children')){
						var materialService = $injector.get('projectMainUpdatePriceByMaterialCatalogService');
						_.forEach(e.Children, (item) => {
							item.MaterialPriceVersionFk = f;
							materialService.fireItemModified(item);
						});
					}
					return $q.when({
						apply: true, valid: true
					});
				}
			},
			{
				id: 'upBasPriceListFk',
				field: 'MaterialPriceVersionFk',
				name: 'Price List',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.priceList.priceList',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'MaterialPriceVersion',
					displayMember: 'PriceListDescriptionInfo.Translated'
				},
				width: 100
			}
		];

		function extendGrouping(gridColumns) {
			angular.forEach(gridColumns, function (column) {
				angular.extend(column, {
					grouping: {
						title: column.name$tr$, getter: column.field, aggregators: [], aggregateCollapsed: true
					}, formatter: column.formatter || platformGridDomainService.formatter('description')
				});
			});
			return gridColumns;
		}

		var columns = extendGrouping(columnsFileds);

		return {
			getStandardConfigForListView: getStandardConfigForListView
		};

		///////////////////////////////////
		function getStandardConfigForListView() {
			return {
				fid: 'project.main.update.price.project.material',
				version: '1.0.0',
				columns: columns,
				addValidationAutomatically: true,
				showGrouping:true
			};
		}
	}
})(angular);
