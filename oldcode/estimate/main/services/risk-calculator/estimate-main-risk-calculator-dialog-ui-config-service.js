/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainRiskCalculatorDialogUIConfigService',[
		'platformTranslateService','$translate',
		function (platformTranslateService,$translate) {
			let service = {};

			function getBaseFormConfig(){
				return {
					showGrouping: true,
					change:'change',
					addValidationAutomatically: true,
					groups: [],
					rows: [],
					overloads: {},
					skipPermissionCheck : true
				};
			}

			function getConfirmationConfig(){
				return{
					groups:[
						{
							gid:'confConfig',
							header: $translate.instant('estimate.main.riskCalculator.confirm'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows:[
						{
							gid: 'confConfig',
							rid: 'ApplyEvenSpread',
							label: $translate.instant('estimate.main.riskCalculator.evenSpread'),
							type: 'boolean',
							model: 'result.spread',
							sortOrder: 1
						},/*
						{
							gid: 'confConfig',
							rid: 'createLineitem',
							label: 'Overwrite assignment and create new lineitems',
							type: 'boolean',
							model: 'result.newItem',
							sortOrder: 1
						}, */
						{
							gid: 'confConfig',
							rid: 'ApplyWeightedSpread',
							label: $translate.instant('estimate.main.riskCalculator.weightedSpread'),
							type: 'boolean',
							model: 'result.default',
							sortOrder: 3
						}/* ,//ApplyNewResource
						{
							gid: 'confConfig',
							rid: 'resource',
							label: 'Overwrite assignment and create new resources',
							type: 'boolean',
							model: 'result.resource',
							sortOrder: 4
						} */
					]
				};
			}

			function getRiskCalculatorResultsConfig(){
				return {
					groups: [
						{
							gid: 'calcConfig',
							header: $translate.instant('estimate.main.riskCalculator.resultsHeader'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'charts',
							header: $translate.instant('estimate.main.riskCalculator.chartHeader'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],

					rows: [
						{
							gid:'calcConfig',
							rid:'useBtn',
							label: $translate.instant('estimate.main.riskCalculator.useCalculation'),
							type: 'boolean',
							model:'UseCalculation',
							readonly: false,
							checked: false,
							disabled: false,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'calcConfig',
							rid: 'useXValue',
							label: $translate.instant('estimate.main.riskCalculator.useXValue'),
							type: 'boolean',
							model: 'chkxvalue',
							sortOrder: 2
						},
						{
							gid: 'calcConfig',
							rid: 'xValue',
							label: $translate.instant('estimate.main.riskCalculator.xValue'),
							type: 'integer',
							model: 'xValue',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 3
						},
						{
							gid: 'calcConfig',
							rid: 'pValue',
							label: $translate.instant('estimate.main.riskCalculator.pValue'),
							type: 'integer',
							model: 'pValue',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 4
						},
						{
							gid: 'calcConfig',
							rid: 'useMinValue',
							label: $translate.instant('estimate.main.riskCalculator.useMinValue'),
							type: 'boolean',
							model: 'chkmin',
							sortOrder: 5
						},
						{
							gid: 'calcConfig',
							rid: 'min',
							label: $translate.instant('estimate.main.riskCalculator.min'),
							type: 'money',
							model: 'min',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: true,
							disabled: false,
							visible: true,
							sortOrder: 6
						},
						{
							gid: 'calcConfig',
							rid: 'useMaxValue',
							label: $translate.instant('estimate.main.riskCalculator.useMaxValue'),
							type: 'boolean',
							model: 'chkmax',
							sortOrder: 7
						},
						{
							gid: 'calcConfig',
							rid: 'max',
							label: $translate.instant('estimate.main.riskCalculator.max'),
							type: 'money',
							model: 'max',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: true,
							disabled: false,
							visible: true,
							sortOrder: 8
						},
						{
							gid: 'calcConfig',
							rid: 'useMeanValue',
							label: $translate.instant('estimate.main.riskCalculator.useMeanValue'),
							type: 'boolean',
							model: 'chkmean',
							sortOrder: 9
						},
						{
							gid: 'calcConfig',
							rid: 'mean',
							label: $translate.instant('estimate.main.riskCalculator.mean'),
							type: 'money',
							model: 'mean',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: true,
							disabled: false,
							visible: true,
							sortOrder: 10
						},
						{
							gid: 'calcConfig',
							rid: 'useStdDevValue',
							label: $translate.instant('estimate.main.riskCalculator.useStdDevValue'),
							type: 'boolean',
							model: 'chkstdev',
							sortOrder: 11
						},
						{
							gid: 'calcConfig',
							rid: 'stdDev',
							label: $translate.instant('estimate.main.riskCalculator.stdDev'),
							type: 'money',
							model: 'stdDev',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: true,
							disabled: false,
							visible: true,
							sortOrder: 12
						},
						{
							gid: 'charts',
							rid: 'chartSvg',
							type: 'directive',
							model: 'riskResults',
							directive: 'basics-risk-calculator-results',
							options: {
								serviceName: 'basicsRiskCalculatorMainService'
							},
							readonly: true,
							disabled: false,
							visible: true,
							sortOrder: 13
						}
					]
				};
			}

			function getRiskCalculatorRegisterConfig(){
				return {
					groups:[
						{
							gid: 'registerConfig',
							header: $translate.instant('estimate.main.riskCalculator.riskRegister'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows:[
						/* {
							gid: 'registerConfig',
							label: 'Calculate All Risk Events',
							rid: 'registerConfig',
							type: 'boolean',
							model: 'calculateAllEvents',
							sortOrder: 1
						},{
							gid: 'registerConfig',
							label: 'Calculate Selected Events',
							rid: 'registerConfig',
							type: 'boolean',
							model: 'calculateSelectedEvents',
							sortOrder: 2
						}, */
						{
							gid: 'registerConfig',
							label: $translate.instant('estimate.main.riskCalculator.assignedRiskEvents'),
							rid: 'registerConfig',
							type: 'directive',
							model: 'registerConfigDetails',
							directive: 'estimate-main-risk-register-assigned-config-grid',
							readonly:'true',
							sortOrder: 1
						}
					]
				};
			}

			function getRiskCalculatorRiskEventsConfig(){
				return {
					groups:[
						{
							gid: 'eventsConfig',
							header: 'Project Risk Events',
							isOpen: true,
							visible: true,
							sortOrder: 3
						}
					],
					rows:[]
				};
			}

			function getRiskCalculatorImpactConfig(){
				return {
					groups: [
						{
							gid: 'impactConfig',
							header: 'Impact',
							isOpen: true,
							visible: true,
							sortOrder: 2
						}
					],
					rows:[
						{
							gid:'impactConfig',
							rid:'customizeBtn',
							label: 'Customize',
							type: 'boolean',
							model:'CustomizeImpact',
							readonly: false,
							checked: false,
							disabled: false,
							visible: true,
							sortOrder: 0
						},

						/* {
							gid: 'impactConfig',
							rid: 'estImpactConfg',
							label: 'Distribution Type',
							type: 'directive',
							model: 'distributionType',
							directive: 'estimate-main-risk-calculator-distribution-lookup-combobox',
							options: {
								showClearButton: true
							},
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 1
						},
						{
							gid: 'impactConfig',
							rid: 'estImpactConfg',
							label: 'Probability of Risk Occuring',
							type: 'directive',
							model: 'probabilityRisk',
							directive:'estimate-main-risk-calculator-occurance-lookup',
							options: {
								showClearButton: true,
								isTextEditable: true
							},
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 2
						},
						{
							gid: 'impactConfig',
							rid: 'estImpactConfg',
							label: 'Inverse Occurence',
							type: 'boolean',
							model:'inverseOccurence',
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 3
						},
						{
							gid: 'impactConfig',
							rid: 'estImpactConfg',
							label: 'Value when NO Risk',
							type: 'integer',
							model:'noRiskValue',
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 4
						},
						{
							gid: 'impactConfig',
							rid: 'estImpactConfg',
							label: 'Risk Impact Dependant On',
							model: 'dependantOn',
							type: 'boolean',
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 5
						},
						{
							//dependant on lookup or display
						},
						{
							gid: 'impactConfig',
							rid: 'estImpactConfg',
							label: 'Inverse Dependancy',
							type: 'boolean',
							model:'inverseDependancy',
							readonly: false,
							disabled: false,
							visible: true,
							sortOrder: 7
						} */// ,
						{
							gid: 'impactConfig',
							// label: $translate.instant('estimate.main.columnConfigurationDialogForm.ColumnConfigureDetails'),
							label: 'Column Configure Details',
							label$tr$: 'estimate.main.columnConfigurationDialogForm.columnConfigureDetails',
							rid: 'colConfigDetail',
							type: 'directive',
							model: 'impactConfigDetails',
							directive: 'estimate-main-risk-impact-detail-grid',
							sortOrder: 8
						}
					]
				};
			}



			angular.extend(service,{
				getBaseFormConfig:getBaseFormConfig,
				getRiskCalculatorRiskEventsConfig:getRiskCalculatorRiskEventsConfig,
				getRiskCalculatorRegisterConfig:getRiskCalculatorRegisterConfig,
				getRiskCalculatorResultsConfig:getRiskCalculatorResultsConfig,
				getRiskCalculatorImpactConfig:getRiskCalculatorImpactConfig,
				getConfirmationConfig:getConfirmationConfig
			});

			service.getFormConfig = function getFormConfig() {

				let formConfig = getBaseFormConfig();
				let resultConfig = getRiskCalculatorResultsConfig();
				let impactConfig = getRiskCalculatorImpactConfig();
				let eventsConfig = getRiskCalculatorRiskEventsConfig();
				let registerConfig = getRiskCalculatorRegisterConfig();

				formConfig.groups = formConfig.groups.concat(resultConfig.groups);
				formConfig.rows = formConfig.rows.concat(resultConfig.rows);
				formConfig.groups = formConfig.groups.concat(impactConfig.groups);
				formConfig.rows = formConfig.rows.concat(impactConfig.rows);
				formConfig.groups = formConfig.groups.concat(eventsConfig.groups);
				formConfig.rows = formConfig.rows.concat(eventsConfig.rows);
				formConfig.groups = formConfig.groups.concat(registerConfig.groups);
				formConfig.rows = formConfig.rows.concat(registerConfig.rows);
				platformTranslateService.translateFormConfig(formConfig);
				return formConfig;
			};


			return service;
		}
	]);
})(angular);
