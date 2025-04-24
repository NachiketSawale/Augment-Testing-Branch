
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainBackwardCalculationGridUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of risk register entities
	 */
	angular.module(moduleName).factory('estimateMainBackwardCalculationGridUIConfigService',
		['platformUIStandardConfigService', 'estimateMainBackwardCalculationGridConfigService', 'estimateMainBackwardCalculationGridTranslationService',
			function (platformUIStandardConfigService, estimateMainBackwardCalculationGridConfigService, estimateMainBackwardCalculationGridTranslationService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = {
					'Id': {'domain': 'integer', 'mandatory': true},
					'MajorCostCode': {'domain': 'code'},
					'ResourceType': {'domain': 'string'},
					'IsChange':{'domain': 'boolean'},
					'ChangeValueFk':{'domain': 'integer'},
					'CalculationMethod':{'domain': 'string'}
				};

				function estimateMainBackwardUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				estimateMainBackwardUIStandardService.prototype = Object.create(BaseService.prototype);
				estimateMainBackwardUIStandardService.prototype.constructor = estimateMainBackwardUIStandardService;

				return new BaseService(estimateMainBackwardCalculationGridConfigService.getLayout(), domainSchema, estimateMainBackwardCalculationGridTranslationService);
			}
		]);

	angular.module(moduleName).factory('estimateMainBackwardCalculationGridConfigService',
		[function () {
			return {
				getLayout: function getLayout() {
					return {
						'fid': 'estimate.main.backward.calculate.grid',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'change':'change',
						'readonly':false,
						'groups':[
							{
								'gid': 'basicData',
								'attributes': ['resourcetype', 'majorcostcode','ischange', 'changevaluefk', 'calculationmethod']
							}
						],
						'overloads':{
							'resourcetype':{readonly:true},
							'majorcostcode':{readonly:true},
							'ischange':{readonly:false,headerChkbox: true,width: 80},
							'changevaluefk':{
								grid: {
									editor: 'directive',
									formatter: 'lookup',
									formatterOptions:{
										lookupType: 'BackwardChangeValue',
										dataServiceName:'estimateMainBackwardChangeValueDataService',
										displayMember: 'Code'
									},
									gridOptions: {
										multiSelect: false
									},
									required: true,
									editorOptions: {
										directive: 'estimate-main-backward-change-value-lookup',
									}
								}
							},
							'calculationmethod':{readonly:true}
						}
					};
				}
			};
		}
		]);
})(angular);
