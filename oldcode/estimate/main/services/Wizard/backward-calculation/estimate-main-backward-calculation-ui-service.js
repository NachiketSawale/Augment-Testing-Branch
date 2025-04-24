(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainBackwardCalculationUIService
	 * @function
	 * @description retrieve ui configuration from this service
	 */
	angular.module(moduleName).factory('estimateMainBackwardCalculationUIService', ['$injector', 'platformTranslateService',
		function ($injector, platformTranslateService) {

			let service = {};

			service.getOptionConfig = function getOptionConfig() {
				let configure = {
					fid: 'estimate.main.backward.calculation.from',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'basicData',
							isOpen: true,
							header: 'Basic Setting',
							header$tr$: 'estimate.main.backwardCalculation.basicHeader',
							attributes: ['sellineitemscope', 'actstandardallowance', 'keepfixedprice']
						},
						{
							gid: 'detailData',
							isOpen: true,
							header: 'Detail Setting',
							header$tr$: 'estimate.main.backwardCalculation.detailHeader',
							attributes: ['detailconfigs']
						}
					],
					rows: [
						{
							gid: 'basicData',
							rid: 'sellineitemscope',
							label: 'Select Line items Scope',
							label$tr$: 'estimate.main.backwardCalculation.selLineItemScope',
							type: 'directive',
							model: 'selLineItemScope',
							directive: 'estimate-main-backward-calculation-checkbox',
							readonly: false,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'basicData',
							rid: 'actstandardallowance',
							model: 'ActStandardAllowanceFk',
							sortOrder: 4,
							label: 'Activated Standard Allowance',
							label$tr$: 'estimate.main.backwardCalculation.actStandardAllowance',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							visible: true,
							readonly: true,
							options: {
								lookupType: 'EstStandardAllowanceLookup',
								lookupDirective: 'estimate-main-standard-allowance-lookup',
								showClearButton: false,
								descriptionMember: 'DescriptionInfo.Description',
								lookupOptions: {
									showClearButton: false,
									isTextEditable: false,
									valueMember: 'Id',
									displayMember: 'Code'
								}
							}
						},
						{
							gid: 'basicData',
							rid: 'keepfixedprice',
							label: 'Keep Fixed Price Flag',
							label$tr$: 'estimate.main.backwardCalculation.keepFixedPrice',
							type: 'boolean',
							model: 'KeepFixedPrice',
							sortOrder: 5
						},
						{
							gid: 'detailData',
							rid: 'detailconfigs',
							type: 'directive',
							model: 'Detailconfigs',
							directive: 'estimate-main-backward-config-grid',
							rows: 10,
							visible: true,
							sortOrder: 0
						}
					]
				};
				platformTranslateService.translateFormConfig(configure);

				return configure;
			};

			return service;
		}]);
})(angular);
