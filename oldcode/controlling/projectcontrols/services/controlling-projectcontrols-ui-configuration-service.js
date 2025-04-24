
(function () {
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectControlsUIConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'controllingProjectControlsTranslationService',
		'controllingProjectControlsConfigService','platformContextService', 'platformLanguageService', 'platformDomainService', 'accounting', 'projectControlsColumnType',
		function (_, $injector, platformUIStandardConfigService, controllingProjectControlsTranslationService, controllingProjectControlsConfigService,
			platformContextService, platformLanguageService, platformDomainService, accounting, projectControlsColumnType) {

			let columns = controllingProjectControlsConfigService.getColumns();

			function createDashboardLayout() {
				let layout = {
					fid: 'controlling.projectcontrols.dashboard',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							gid: 'baseGroup',
							attributes: ['code', 'description']
						}
					],
					'overloads':{
						'code':{
							'searchable': true,
							'grouping': {'generic': false, 'aggregateForce' : true},
							'readonly': true,
							'aggregation': false
						},
						'description':{
							'searchable': true,
							'grouping': {'generic': false, 'aggregateForce' : true},
							'readonly': true,
							'aggregation': false
						}
					}
				};

				if(columns){
					let cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());

					_.forEach(columns, function(column){
						let columnId = column.id.toLowerCase();
						layout.groups[0].attributes.push(columnId);
						layout.overloads[columnId] = {
							'grouping': {'generic': false, 'aggregateForce' : true},
							'readonly': column.readonly,
							'aggregation': column.aggregation
						};
						if(column.basContrColumnType === projectControlsColumnType.WCF || column.basContrColumnType === projectControlsColumnType.BCF|| column.basContrColumnType === projectControlsColumnType.CUSTOM_FACTOR){
							layout.overloads[columnId].grid = {
								'formatter': function(row, cell, value, columnDef, entity){
									if(columnDef && entity && entity.EditableInfo){
										if(entity.EditableInfo.IsWCFBCFItem){
											return formatNumberToMoney(value, cultureInfo);
										}
										return '';
									}else{
										return '';
									}
								}
							}
						}

						if(column.isLookupProp && column.basContrColumnType === projectControlsColumnType.SAC){
							generateLookupForSAC(layout.overloads[columnId]);
						}

						if(layout.overloads[columnId].grid && column.propDefInfo && column.propDefInfo.type === 2 && column.propDefInfo.item){
							layout.overloads[columnId].grid['basContrColumnType'] = column.propDefInfo.item.BasContrColumnTypeFk;
							layout.overloads[columnId].grid['basContrColumnId'] = column.propDefInfo.item.Id;
						}

						if(column.toolTip){
							layout.overloads[columnId].grid = layout.overloads[columnId].grid || {};
							layout.overloads[columnId].grid['toolTip'] = column.toolTip;
						}
					});
				}

				return layout;
			}

			function formatNumberToMoney(value, cultureInfo){
				let domainInfo = platformDomainService.loadDomain('money');
				return accounting.formatNumber(value, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
			}

			function toNumberWithCulture(value, cultureInfo){
				if(_.isNumber(value)){
					return value;
				}

				let result = 0;

				if(!_.isString(value) || value === '' || !cultureInfo || !cultureInfo.numeric){
					return result;
				}

				let inverseNumberDecimal = cultureInfo.numeric.decimal === ',' ? '.' : ',';
				result = _.toNumber(value.replaceAll(inverseNumberDecimal, '').replace(',', '.'));

				return _.isNaN(result) ? 0 : result;
			}

			function generateLookupForSAC(overloads){
				overloads.grid = {
					'maxLength': 255,
					'editor': 'directive',
					'editorOptions': {
						'directive': 'controlling-projectcontrols-formula-value-cell',
						'lookupOptions': {
							'showclearButton': true
						},
						validKeys: {
							regular: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,2})$)'
						}
					},
					'formatter': function(row, cell, value, columnDef, entity) {
						let field = columnDef.field;
						let inField = field + '_IN_RP',
							toField = field + '_TO_RP',
							detailField = field + 'Detail';
						let valueResult = $injector.get('controllingProjectcontrolsDashboardService').checkValueByCulture(entity[field]);

						let error = entity && entity.__rt$data && entity.__rt$data.errors && Object.prototype.hasOwnProperty.call(entity.__rt$data.errors, field) ? entity.__rt$data.errors[field] : null;
						if(error && error.error ){
							return '<div class="invalid-cell" title="' + error.error + '">' + value + '</div>';
						}else{
							let cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());
							entity[detailField] = toNumberWithCulture(valueResult.valueDetail,cultureInfo);
							entity[field] = formatNumberToMoney(entity[detailField], cultureInfo);
							entity[inField] = _.toNumber(entity[inField]);
							entity[toField] = _.toNumber(entity[toField]);

							return formatNumberToMoney(entity[field + '_IN_RP'], cultureInfo) + '(' + formatNumberToMoney(entity[field + '_TO_RP'], cultureInfo) + ')';
						}
					}
				};
				overloads.detail = {
					'maxLength': 255
				};
			}

			let dashboardLayout = createDashboardLayout();

			let dashboardAttributeDomains = {
				'Code': {
					'domain' : 'text'
				},
				'Description': {
					'domain' : 'text'
				}
			};

			if(columns){
				_.forEach(columns, function(column){
					dashboardAttributeDomains[column.id] = {
						'domain' : column.domain
					};
				});
			}

			let BaseService = platformUIStandardConfigService;

			function DashboardUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DashboardUIStandardService.prototype = Object.create(BaseService.prototype);
			DashboardUIStandardService.prototype.constructor = DashboardUIStandardService;

			return new BaseService(dashboardLayout, dashboardAttributeDomains, controllingProjectControlsTranslationService);
		}
	]);
})(angular);
