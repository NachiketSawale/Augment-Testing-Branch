
(function () {
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectcontrolsFormulaValueUiConfigurationService', ['_', 'platformUIStandardConfigService', 'controllingProjectControlsTranslationService',
		'platformContextService', 'platformLanguageService', 'platformDomainService', 'accounting', 'controllingProjectControlsConfigService', 'projectControlsColumnType',
		function (_, platformUIStandardConfigService, controllingProjectControlsTranslationService,
			platformContextService, platformLanguageService, platformDomainService, accounting, controllingProjectControlsConfigService, projectControlsColumnType) {
			let columns = controllingProjectControlsConfigService.getSACColumns();

			let gridColumns = [];

			function createLayout(){
				let layout = {
					fid: 'controlling.projectcontrols.formulavaluepopup',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							gid: 'baseGroup',
							attributes: ['period']
						}
					],
					'overloads':{
						'period':{
							'searchable': true,
							'grouping': {'generic': false, 'aggregateForce' : true},
							'readonly': true,
							'aggregation': false
						}
					}
				};

				if(columns) {
					_.forEach(columns, function (column) {
						if(column.isLookupProp && column.basContrColumnType === projectControlsColumnType.SAC){
							layout.groups[0].attributes.push(column.id.toLowerCase());
							layout.overloads[column.id.toLowerCase()] = {
								'grouping': {'generic': false, 'aggregateForce' : true},
								'readonly': column.readonly,
								'aggregation': column.aggregation
							};
							layout.overloads[column.id.toLowerCase()].formatter = function(row, cell, value){
								let culture = platformContextService.culture(),
									cultureInfo = platformLanguageService.getLanguageInfo(culture),
									domainInfo = platformDomainService.loadDomain('money');
								return accounting.formatNumber(value, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
							};
						}
					});
				}

				return layout;
			}

			let dashboardLayout = createLayout();

			let BaseService = platformUIStandardConfigService;

			let dashboardAttributeDomains = {
				'Period': {
					'domain' : 'dateutc'
				}
			};

			if(columns){
				_.forEach(columns, function(column){
					if(column.isLookupProp && column.basContrColumnType === projectControlsColumnType.SAC){
						dashboardAttributeDomains[column.id] = {
							'domain' : column.domain
						};
					}
				});
			}

			function DashboardUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DashboardUIStandardService.prototype = Object.create(BaseService.prototype);
			DashboardUIStandardService.prototype.constructor = DashboardUIStandardService;

			return new BaseService(dashboardLayout, dashboardAttributeDomains, controllingProjectControlsTranslationService);
		}
	]);
})(angular);
