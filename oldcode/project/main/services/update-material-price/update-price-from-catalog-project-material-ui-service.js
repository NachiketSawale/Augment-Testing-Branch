/**
 * Created by chi on 1/7/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogMaterialUIService', projectMainUpdatePriceFromCatalogMaterialUIService);

	projectMainUpdatePriceFromCatalogMaterialUIService.$inject = ['$translate', 'projectMainUpdatePriceFromCatalogAdditionalData',
		'projectMainUpdateResultFieldVarianceFormatter','$injector','$q'];

	function projectMainUpdatePriceFromCatalogMaterialUIService($translate, projectMainUpdatePriceFromCatalogAdditionalData,
	                                                            projectMainUpdateResultFieldVarianceFormatter,$injector,$q) {

		var columnsFileds = [
			{
				id: 'upSelected',
				field: 'Selected',
				name: 'Selected',
				name$tr$: 'project.main.selected',
				formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
					var html = '';
					if (value === true) {
						html = '<input type="checkbox" checked />';
					} else if (value === 'readonly') {
						html = '<input type="checkbox" disabled />';
					} else if (value === 'unknown') {
						setTimeout(function () {
							angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
						}, 0);

						html = '<input type="checkbox"/>';
					} else {
						html = '<input type="checkbox" unchecked/>';
					}
					return '<div class="text-center" >' + html + '</div>';
				},
				editor: 'directive',
				editorOptions: {
					directive: 'material-group-checkbox'
				},
				width: 70,
				pinned: true,
				headerChkbox: true,
				asyncValidator:(entity,value,field)=>{
					entity.Selected = value;
					let service = $injector.get('projectMainUpdatePriceFromCatalogProjectMaterialService');
						let dataIndex = service.tempData.findIndex((item)=>{
							return item.Id === entity.Id;
						});
						if(dataIndex !== -1 && !value){
							service.tempData.splice(dataIndex,1);
						}else {
							let item = angular.copy(entity);
							service.tempData.push(item);
						}
					return $q.when({
						apply: true, valid: true
					});
				}
			},
			{
				id: 'upJobCatalogCode',
				field: 'JobCode',
				name: 'Job / Catalog Code',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.jobCatalogCode',
				formatter: 'code',
				width: 100
			},
			{
				id: 'upJobCatalogDesc',
				field: 'JobDescription',
				name: 'Job / Catalog Description',
				name$tr$: 'project.main.updatePriceFromCatalogWizard.jobCatalogDesc',
				formatter: 'description',
				width: 120
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
				id: 'upMaterialCode',
				field: 'MaterialCode',
				name: 'Material Code',
				name$tr$: 'project.main.materialCode',
				width: 90,
				formatter: 'code'
			},
			{
				id: 'upMaterialDescription',
				field: 'MaterialDescription',
				name: 'Material Description',
				name$tr$: 'project.main.materialDescription',
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
						filterKey: 'project-material-update-price-price-version-filter',
						showClearButton: true,
						additionalData: projectMainUpdatePriceFromCatalogAdditionalData.additionalPriceVersions
					}
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'MaterialPriceVersion',
					displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
				},
				width: 100
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
			},
			// {
			// 	id: 'upCatalogCode',
			// 	field: 'CatalogCode',
			// 	name: 'Catalog Code',
			// 	name$tr$: 'project.main.catalogCode',
			// 	width: 90,
			// 	formatter: 'description'
			// },
			// {
			// 	id: 'upCatalogDescription',
			// 	field: 'CatalogDescription',
			// 	name: 'Catalog Description',
			// 	name$tr$: 'project.main.catalogDescription',
			// 	formatter: 'description',
			// 	width: 100
			// },
			{
				id: 'upUomFk',
				field: 'Uom',
				name: 'UoM',
				name$tr$: 'project.main.uoM',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'Uom',
					displayMember: 'Unit'
				},
				width: 100
			},
			{
				id: 'upCurPrjEstimatePrice',
				field: 'CurPrjEstimatePrice',
				name: 'Cur. PRJ. Est. Price',
				name$tr$: 'project.main.currentPrjEstimatePrice',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upNewPrjEstimatePrice',
				field: 'NewPrjEstimatePrice',
				name: 'New PRJ. Est. Price',
				name$tr$: 'project.main.newPrjEstimatePrice',
				editor: 'money',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upCurPrjDayworkRate',
				field: 'CurPrjDayworkRate',
				name: 'Cur. PRJ.DW/T+M Rate',
				name$tr$: 'project.main.currentPrjDayworkRate',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upNewPrjDayworkRate',
				field: 'NewPrjDayworkRate',
				name: 'New PRJ.DW/T+M Rate',
				name$tr$: 'project.main.newPrjDayworkRate',
				editor: 'money',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upVariance',
				field: 'Variance',
				name: 'Variance',
				name$tr$: 'project.main.variance',
				formatter: projectMainUpdateResultFieldVarianceFormatter.formatter,
				formatterOptions: {
					decimalPlaces: 2,
					dataType: 'numeric'
				},
				cssClass: 'text-right'
			},
			{
				id: 'upMaterialEstimatePrice',
				field: 'MaterialEstimatePrice',
				name: 'Catalog Est. Price',
				name$tr$: 'project.main.materialEstimatePrice',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upMaterialDayworkRate',
				field: 'MaterialDayworkRate',
				name: 'Material PRJ.DW/T+M Rate',
				name$tr$: 'project.main.materialDayworkRate',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upMaterialFactorHour',
				field: 'MaterialFactorHour',
				name: 'Material Factor Hour',
				name$tr$: 'project.main.materialFactorHour',
				width: 100,
				formatter: 'factor'
			},
			{
				id: 'upCurPrjFactorHour',
				field: 'CurPrjFactorHour',
				name: 'Cur. PRJ. Factor Hour',
				name$tr$: 'project.main.currentPrjFactorHour',
				width: 100,
				formatter: 'factor'
			},
			{
				id: 'upNewPrjFactorHour',
				field: 'NewPrjFactorHour',
				name: 'New PRJ. Factor Hour',
				name$tr$: 'project.main.newPrjFactorHour',
				editor: 'factor',
				width: 100,
				formatter: 'factor'
			},
			{
				id: 'upCurrencyFk',
				field: 'CurrencyFk',
				name: 'Currency',
				name$tr$: 'cloud.common.entityCurrency',
				searchable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'currency',
					displayMember: 'Currency'
				},
				width: 100
			},
			{
				id: 'upSource',
				field: 'Source',
				name: 'Source',
				name$tr$: 'project.main.source',
				width: 100,
				formatter: 'description'
			},
			{
				id: 'upComment',
				field: 'CommentText',
				name: 'Comment',
				name$tr$: 'project.main.comment',
				width: 150,
				editor: 'description',
				formatter: 'description'
			},
			{
				id: 'upCurPriceUnit',
				field: 'CurPriceUnit',
				name: 'Cur. Price Unit',
				name$tr$: 'project.main.currentPriceUnit',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upNewPriceUnit',
				field: 'NewPriceUnit',
				name: 'New Price Unit',
				name$tr$: 'project.main.newPriceUnit',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upCurPriceUnitFactor',
				field: 'CurFactorPriceUnit',
				name: 'Cur.P.U.Factor',
				name$tr$: 'project.main.currentPriceUnit',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'upNewPriceUnitFactor',
				field: 'NewFactorPriceUnit',
				name: 'New P.U.Factor',
				name$tr$: 'project.main.newPriceUnitFactor',
				width: 100,
				formatter: 'money'
			},
			{
				id: 'Co2Project',
				field: 'Co2Project',
				name: 'CO2/kg (Project)',
				name$tr$: 'procurement.common.entityCo2Project',
				width: 100,
				formatter: 'money',
				readonly: true
			},
			{
				id: 'Co2Source',
				field: 'Co2Source',
				name: 'CO2/kg (Source)',
				name$tr$: 'procurement.common.entityCo2Source',
				width: 100,
				formatter: 'money',
				readonly: true
			},
			{
				id: 'co2SourceFk',
				field: 'Co2SourceFk',
				name: 'CO2/kg (Source Name)',
				name$tr$: 'basics.material.record.entityBasCo2SourceFk',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'co2sourcename',
					displayMember: 'DescriptionInfo.Translated',
					version: 3
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
