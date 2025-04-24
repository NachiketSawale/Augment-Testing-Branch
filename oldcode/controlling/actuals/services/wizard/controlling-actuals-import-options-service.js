(function () {
	'use strict';

	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc service
	 * @name controllingActualsImportOptionsService
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('controllingActualsImportOptionsService', ['_','$q', '$translate','platformContextService',
		function (_, $q, $translate, platformContextService) {
			let service = {};

			let _costHeaderListService;

			let importOptions = {
				ModuleName: moduleName,
				DoubletFindMethodsPage: { skip: true },
				/* FieldMappingsPage: { skip: true or false },
				EditImportPage: { skip: true or false },
				PreviewResultPage: { skip: true or false }, */
				CustomSettingsPage: {
					skip: function (entity){
						if(entity.ExcelColumnNames){
							let currencyStr = $translate.instant('basics.currency.Currency').toLowerCase();
							return !_.find(entity.ExcelColumnNames, function (item){return item && item.toLowerCase().indexOf(currencyStr) >= 0;});
						}
						return false;
					},
					Config: {
						showGrouping: false,
						groups: [
							{
								gid: 'actualExcelImport',
								header: 'Update',
								header$tr$: 'controlling.actuals.wizard.excelImport.group1Title',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: 'actualExcelImport',
								rid: 'overwrite',
								label: $translate.instant('controlling.actuals.wizard.excelImport.overwrite'),
								label$tr$: 'controlling.actuals.wizard.excelImport.overwrite',
								type: 'boolean',
								model: 'Overwrite',
								validator:overrideValidtor,
								visible: false,
								sortOrder: 1
							},
							{
								gid: 'actualExcelImport',
								rid: 'CreateNew',
								label: $translate.instant('controlling.actuals.wizard.excelImport.createNew'),
								label$tr$: 'controlling.actuals.wizard.excelImport.createNew',
								type: 'boolean',
								model: 'CreateNew',
								validator:overrideValidtor,
								visible: false,
								sortOrder: 2,
								options:{
									labelText: $translate.instant('controlling.actuals.wizard.excelImport.createNew')
								}
							},
							{
								gid: 'actualExcelImport',
								rid: 'UpdateOld',
								label: $translate.instant('controlling.actuals.wizard.excelImport.updateExist'),
								label$tr$: 'controlling.actuals.wizard.excelImport.updateExist',
								type: 'boolean',
								model: 'UpdateOld',
								validator:overrideValidtor,
								visible: false,
								sortOrder: 3
							},
							{
								gid: 'actualExcelImport',
								rid: 'homeCurrency',
								label: $translate.instant('controlling.actuals.wizard.excelImport.currencyConvert'),
								label$tr$: 'controlling.actuals.wizard.excelImport.currencyConvert',
								type: 'boolean',
								model: 'HomeCurrency',
								validator:overrideValidtor,
								visible: true,
								sortOrder: 4
							},
							{
								gid: 'actualExcelImport',
								rid: 'foreignCurrency',
								label: $translate.instant('basics.currency.ForeignCurrency'),
								label$tr$: 'basics.currency.ForeignCurrency',
								type: 'boolean',
								model: 'ForeignCurrency',
								validator:overrideValidtor,
								visible: false,
								sortOrder: 5
							},
							{
								gid: 'actualExcelImport',
								rid: 'note',
								label: $translate.instant('controlling.actuals.wizard.excelImport.note'),
								label$tr$: 'controlling.actuals.wizard.excelImport.note',
								type: 'comment',
								model: 'NoteText',
								readonly: true,
								// validator:overrideValidtor,
								visible: true,
								sortOrder: 5
							}
						]
					}
				},
				ImportDescriptor: {
					DoubletFindMethods: [],
					Fields: [
						{
							PropertyName: 'Code',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'code',
							Editor: 'domain'
						},
						{
							PropertyName: 'CompanyYear',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain',
							defaultMappingFun: function (excelHeaders){
								let mappingName = '';

								angular.forEach(excelHeaders, function (value, key){
									if(key === 'reportingdate'){
										mappingName = excelHeaders[key];
									}
								});

								if(mappingName){ return mappingName;}

								angular.forEach(excelHeaders, function (value, key){
									if(key.indexOf('date') >= 0){
										mappingName = excelHeaders[key];
									}
								});
								return mappingName;
							}
						},
						{
							PropertyName: 'CompanyPeriod',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain',
							defaultMappingFun: function (excelHeaders){
								let mappingName = '';

								angular.forEach(excelHeaders, function (value, key){
									if(key === 'reportingdate'){
										mappingName = excelHeaders[key];
									}
								});

								if(mappingName){ return mappingName;}

								angular.forEach(excelHeaders, function (value, key){
									if(key.indexOf('date') >= 0){
										mappingName = excelHeaders[key];
									}
								});
								return mappingName;
							}
						},
						{
							PropertyName: 'ValueType',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'ProjectNumber',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'HasCostCode',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'HasContCostCode',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'HasAccount',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'IsFinal',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'HeaderComment',
							EntityName: 'CompanyCostHeaderEntity',
							DomainName: 'comment',
							Editor: 'domain'
						},
						{
							PropertyName: 'ControllingUnitCode',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'MdcCostCode',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'ControllingCostCode',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'AccountCode',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'Quantity',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'quantity',
							Editor: 'domain'
						},
						{
							PropertyName: 'Amount',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'money',
							Editor: 'domain'
						},
						{
							PropertyName: 'Currency',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'description',
							Editor: 'domain'
						},
						{
							PropertyName: 'AmountOc',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'money',
							Editor: 'domain'
						},
						{
							PropertyName: 'DataComment',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'comment',
							Editor: 'domain'
						},
						{
							PropertyName: 'Uom',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'integer',
							LookupQualifier: 'basics.uom',
							Editor: 'simplelookup',
							DisplayMember: 'UOM'
						},
						{
							PropertyName: 'NominalDimension1',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'comment',
							Editor: 'domain'
						},
						{
							PropertyName: 'NominalDimension2',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'comment',
							Editor: 'domain'
						},
						{
							PropertyName: 'NominalDimension3',
							EntityName: 'CompanyCostDataEntity',
							DomainName: 'comment',
							Editor: 'domain'
						}
					],
					CustomSettings: {
						Overwrite: false,
						CreateNew: true,
						UpdateOld: true,
						HomeCurrency: false,
						ForeignCurrency: false,
						NoteText: $translate.instant('controlling.actuals.wizard.excelImport.currencyInfo')
					}
				},
				GetSelectedMainEntityCallback: function() {
					let context = platformContextService.getContext();
					if (context) {
						return context.clientId;
					}
					else {
						return null;
					}
				},
				OnImportSucceededCallback: function () {
					_costHeaderListService.load();
				},
				OnImportFormatChangedCallback: function () {
				},
				PreventNextStepAsync: function () {
					return $q.when().then(function () {
						return '';
					});
				},
				ShowProtocollAfterImport: true,
				CanNext: function (scope){
					return !scope.isLoading && scope.canNext && (scope.customEntity.CreateNew || scope.customEntity.UpdateOld || scope.customEntity.Overwrite);
				}
			};

			function  overrideValidtor(entity, value, model) {
				if (model === 'CreateNew' || model === 'UpdateOld') {
					if(value){
						entity.Overwrite = false;
					}
				}
				else if (model === 'Overwrite') {
					if(value){
						entity.CreateNew = false;
						entity.UpdateOld = false;
					}
				}
				// if(model === 'Overwrite' || model === 'HomeCurrency' || model === 'ForeignCurrency'){
				// let isOverWrite = model === 'Overwrite' ? value : entity.Overwrite;
				// let isHomeCurrency = model === 'HomeCurrency' ? value : entity.HomeCurrency;
				// let isForeignCurrency = model === 'ForeignCurrency' ? value : entity.ForeignCurrency;
				//
				// entity.NoteText = isOverWrite ? $translate.instant('controlling.actuals.wizard.excelImport.overwriteInfo') : '';
				// if(isHomeCurrency || isForeignCurrency){
				// entity.NoteText += (entity.NoteText ? '\r\n' : '');
				// entity.NoteText += $translate.instant('controlling.actuals.wizard.excelImport.currencyInfo');
				// }
				// }
			}

			service.getImportOptions = function (costHeaderListService) {
				_costHeaderListService = costHeaderListService;
				return importOptions;
			};

			return service;
		}
	]);
})(angular);
