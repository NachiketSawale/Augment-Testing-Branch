
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMdcAllowanceAreaUIService',[
		'platformUIStandardConfigService',
		'platformSchemaService',
		'estimateMainTranslationService',
		'accounting',
		function (platformUIStandardConfigService,
			platformSchemaService,
			estimateMainTranslationService,
			accounting) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = {};
			domainSchema.Code = {domain: 'description'};
			domainSchema.Rest = {domain: 'percent'};
			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			function getMdcAllowanceAreaDetailLayout() {
				return {
					fid: 'estimate.main.mdcAllowanceAreaDetail',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['code','rest']
						}
					],
					'overloads': {
						'rest':{
							'grid': {
								domain: function (entity, column) {
									let domain ='percent';
									column.regex ='(^[+]?\\d*$)|(^(?:[+]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,2})$)';
									return domain;
								},
								formatter: function(row, cell, value, column, entity){
									if(entity.AreaType !== 2 && !entity[column.field]){
										entity[column.field] = null;
										return '';
									}else {
										return accounting.formatNumber(entity[column.field], 2 ,',','.');
									}
								}
							}
						}
					}
				};

			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			return new BaseService(getMdcAllowanceAreaDetailLayout(), domainSchema, estimateMainTranslationService);
		}
	]);
})(angular);