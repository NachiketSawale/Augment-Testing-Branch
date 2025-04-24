/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, globals */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskCalculatorWizardService', [

		'platformWizardDialogService','$translate','estimateMainRiskCalculatorDialogUIConfigService',
		'estimateCommonDynamicConfigurationServiceFactory','platformTranslateService',
		'basicsRiskRegisterImpactService','platformModalFormConfigService',
		'$http','estimateMainRiskRegisterCalculatorWizardUIService','basicsRiskCalculatorMainService',
		'$injector','estimateMainRiskSettingsService','basicsRiskRegisterImpactDetailService',
		function (platformWizardDialogService,$translate,estMainRiskCalculatorDialogUI,
			estimateCommonDynamicConfigurationServiceFactory,platformTranslateService,
			basicsRiskRegisterImpactService,platformModalFormConfigService,
			$http,estimateMainRiskRegisterCalculatorWizardUIService,basicsRiskCalculatorMainService,
			$injector,estimateMainRiskSettingsService,basicsRiskRegisterImpactDetailService) {


			let _selectedRisks = {};
			let modelData = {
				SelectedRisks:[_selectedRisks],
				SelectedImpacts: [],
				SelectedProjectImpact: null,
				CalculationResult: null,
				CustomizeImpact: false,
				ModifiedImpacts: [],
				resultModel:{},
				ApplicableCalculations:[]


			};
			/* let modelData = {
				CustomizeImpact:false
			}; */
			// console.log('Impact ui',impactUITest);




			function prepareImpactStep(stepObj) {


				let risks = _selectedRisks;
				let count = 0;
				let form = stepObj.step.form;

				if(stepObj.model.CustomizeImpact === false){
					angular.forEach(form.rows,function(row){
						row.isReadOnly = true;
					});
				}

				angular.forEach(risks,function (risk) {
					basicsRiskRegisterImpactDetailService.transfromLowAndHighImpacts(risk);
					let impact = risk.RiskRegisterImpactEntities[0];
					let name = 'Impact' + count.toString();
					// eslint-disable-next-line no-prototype-builtins
					if(impact && !stepObj.model[name].hasOwnProperty('CustomizeImpact') ){
						angular.forEach(impact,function (value,key) {
							stepObj.model['Impact' + count.toString()][key] = value;
						});

					}
					count++;
				});
			}

			function prepareResultsStep(stepObj){
				stepObj.scope.entity.CurrentStep = stepObj.step.id;
				stepObj.step.loadingMessage = 'Calculating Risk(s)!';
				let selectedRisks;

				if(stepObj.model.SelectedRisks){
					selectedRisks = stepObj.model.SelectedRisks;
					if(stepObj.model.ModifiedImpacts && stepObj.model.ModifiedImpacts.length > 0 ){
						for(let i = 0; i < selectedRisks.length; i++){
							for(let j =0; j < stepObj.model.ModifiedImpacts.length; j++){
								if(stepObj.model.ModifiedImpacts[j].Id === selectedRisks[i].RiskRegisterImpactEntities[0].Id){
									selectedRisks[i].RiskRegisterImpactEntities[0] = stepObj.model.ModifiedImpacts[j];// this swaps out the old impact for the new one
								}
							}
						}
					}
				}

				let dataModel = {
					data: selectedRisks
				};
				if(selectedRisks){

					// This is the start to future implementation of all of susccess risk calculator
					$http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/runrisksimulation',dataModel.data).then(function(response){
						/* angular.forEach(response.data,function (output) {
							if(output.SimOutput && output.SimOutput.errMessage !== ''){
								console.log('Simulation result',response.data[0].SimOutput);

							}else{
								console.log('Error Message',output.SimOutput.errMessage);
							}
						}); */
						stepObj.scope.entity.CalculationResults = response.data;
						addFinalSteps(stepObj);
						stepObj.step.Message = 'Calculation Recieved!';
						stepObj.step.loadingMessage = null;
					},function (/* fail */) {
						stepObj.step.loadingMessage = 'Calculation Failed. Please check data.';
					});
					/* $http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/_calculaterisk',dataModel.data).then(function (results) {

						stepObj.scope.entity.CalculationResults = results.data;

						addFinalSteps(stepObj);

						stepObj.step.Message = 'Calculation Recieved!';

						stepObj.step.loadingMessage = null; */

					// },function (/* fail */) {
					// stepObj.step.loadingMessage = 'Calculation Failed. Please check data.';

					// });

				}else{
					stepObj.step.loadingMessage = 'No Selected Risks';
				}

			}

			function prepareViewSteps(stepObj){
				stepObj.scope.entity.CurrentStep = stepObj.step.id;
			}

			function prepareFirstStep(stepObj){

				let estimateMainService = $injector.get('estimateMainService');

				let data = {
					filter: estimateMainService.getSelectedEstHeaderId()
				};

				$injector.get('estimateMainCalculateRiskDataService').load().then(function () {
					$http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/updatecentralimpact',data).then(function (resp) {
						stepObj.step.loadingMessage = null;
						let selectorStepIndex = _.findIndex(stepObj.wizard.steps, {id: 'baseStep'});
						let selectorStep = stepObj.wizard.steps[selectorStepIndex];
						selectorStep.disallowNext = false;
						angular.forEach(resp.data,function (data) {
							// eslint-disable-next-line no-prototype-builtins
							if(data.hasOwnProperty('RiskRegisterImpactEntities') && data.RiskRegisterImpactEntities[0].length > 0){
								data.RiskRegisterImpactEntities[0].HighImpactDetail = data.RiskRegisterImpactEntities[0].HighImpact;
								data.RiskRegisterImpactEntities[0].LowImpactDetail = data.RiskRegisterImpactEntities[0].LowImpact;
							}

						});
						stepObj.model.SelectedRisks = resp.data;// $injector.get('estimateMainAssignedRiskDataService').getList();
						// service.setSelected(stepObj.model.SelectedRisks);
						service.setSelected(resp.data);
					});
				});
			}

			let wizardConfigObject = {
				title: $translate.instant('estimate.main.calculateRisk'),
				steps: [
					{
						id: 'baseStep',
						title: $translate.instant('estimate.main.riskCalculator.riskEventSummaryText'),
						form: estimateMainRiskRegisterCalculatorWizardUIService.getRegisterConfig(),
						loadingMessage: 'Getting Assigned Risks',
						disallowNext: false,
						change:onChange,
						prepareStep:prepareFirstStep,
						watches: []
					},
					{
						id: 'impactStep',
						title: 'Test',
						form:{
							fid: 'selectImpactReview',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'default'
							}],
							rows: [{
								gid: 'default',
								rid: 'reviewImpacts',
								type: 'boolean',
								label: $translate.instant('estimate.main.riskCalculator.riskImpactsReviewText'),
								model:'reviewImpacts',// 'wizardData.SelectedImpact.CustomizeImpact',
								readonly: false,
								checked: false,
								disabled: false,
								visible: true,
							}]
						},
						disallowNext: false,
						watches:[{
							expression:'reviewImpacts',
							fn: function (info) {
								let selectorStepIndex = _.findIndex(info.wizard.steps, {id: 'impactStep'});
								let selectorStep = info.wizard.steps[selectorStepIndex];
								if(info.model.SelectedRisks && info.model.reviewImpacts !== false){
									addImpactSteps(info);
									selectorStep.disallowNext = false;
								}

							}
						}]
					},
					/* {
						id: 'projectEventsStep',
						title: 'Test',
						form: estimateMainRiskRegisterCalculatorWizardUIService.getProjectEventsConfig(),
						disallowNext: false,
						watches: []
					}, */
					{
						id: 'RiskResult',
						title: 'Calculation',
						// form: estimateMainRiskRegisterCalculatorWizardUIService.getResultConfig(),
						loadingMessage:'Calculating Results',
						disallowNext: false,
						prepareStep: prepareResultsStep,
						watches: [],
						canFinish: false
					},
					{
						id: 'Confirmation',
						title: $translate.instant('estimate.main.riskCalculator.applyResults'),
						form: estimateMainRiskRegisterCalculatorWizardUIService.getConfirmationConfig(),
						watches:[{
							expression:'result.spread',
							fn: function (info) {
								// eslint-disable-next-line no-console
								console.log(info);
							}
						},
						{
							expression:'result.newItem',
							fn: function(info){
								// eslint-disable-next-line no-console
								console.log(info);
							}
						},
						{
							expression:'result.default',
							fn: function (info) {
								// eslint-disable-next-line no-console
								console.log(info);
							}
						},
						{
							expression:'result.resource',
							fn: function (info) {
								// eslint-disable-next-line no-console
								console.log(info);
							}
						}],
						canFinish:true
					}]
			};



			let service = {};

			service.getWizardConfigObj = function () {
				service.wizardConfigObj = angular.copy(wizardConfigObject);
				return service.wizardConfigObj;
			};

			platformWizardDialogService.translateWizardConfig(service.getWizardConfigObj());

			service.showDialog = function () {

				platformWizardDialogService.showDialog(service.getWizardConfigObj(), resetEntity()).then(function (result) {// angular.copy(modelData)
					if (result.success) {
						// abasicsRiskCalculatorMainService.setWizardResults(result.data);
						let finalResults = [];
						let selectedRisks = result.data.ApplicableCalculations;
						let riskResults = [];
						let ApplyEvenSpread = false;
						let applyNewLineitem = false;
						let ApplyWeightedSpread = false;
						let applyNewResource = false;

						let userChoicesToSave = [];

						let risksWithChangedImpacts = [];// fill with risks that were applied to Estimate but changed in wizard

						angular.forEach(result.data, function (resultValue, resultKey) {
							let keyString = resultKey.toString();
							let keyname = keyString.substring(0, 10);
							if (keyname === 'RiskResult') {
								riskResults.push(resultValue);
							}
							if (keyname === 'result') {
								// eslint-disable-next-line no-prototype-builtins
								if (resultValue.hasOwnProperty('spread')) {
									ApplyEvenSpread = resultValue.spread;
									// eslint-disable-next-line no-prototype-builtins
								} else if (resultValue.hasOwnProperty('newItem')) {
									applyNewLineitem = resultValue.newItem;
									// eslint-disable-next-line no-prototype-builtins
								} else if (resultValue.hasOwnProperty('default')) {
									ApplyWeightedSpread = resultValue.default;
									// eslint-disable-next-line no-prototype-builtins
								} else if (resultValue.hasOwnProperty('resource')) {
									applyNewResource = resultValue.resource;
								}
							}
						});
						angular.forEach(selectedRisks, function (risk) {

							let riskToSave = GetRiskToSave(result.data.SelectedRisks, risk);

							if (riskToSave) {
								risksWithChangedImpacts.push(riskToSave);
							}
							let choicesObj = angular.copy(estimateMainRiskSettingsService.getUserChoiceObj());

							choicesObj.UseCalculation = true;

							choicesObj.IsSpread = ApplyEvenSpread;

							choicesObj.IsDefault = ApplyWeightedSpread;

							let data = {
								Id: null,
								RiskApplyValue: null,
								ApplyEvenSpread: ApplyEvenSpread,
								ApplyWeightedSpread: ApplyWeightedSpread,
								ApplyNewLineItem: applyNewLineitem,
								ApplyNewResource: applyNewResource,
								ProjectFk: basicsRiskCalculatorMainService.getProjId(),
								EstHeaderFk: basicsRiskCalculatorMainService.getEstHeaderFk()
							};

							angular.forEach(riskResults, function (riskResult) {
								if (risk.RiskName === riskResult.RiskName) {
									data.Id = risk.Id;
									choicesObj.RiskEventFk = risk.Id;
									// eslint-disable-next-line no-prototype-builtins
									if (riskResult.hasOwnProperty('chkxvalue') && riskResult.chkxvalue === true) {
										data.RiskApplyValue = riskResult.pValue;
										choicesObj.IsX = true;
										choicesObj.XValue = riskResult.xValue;
									}
									// eslint-disable-next-line no-prototype-builtins
									if (riskResult.hasOwnProperty('chkmin') && riskResult.chkmin === true) {
										data.RiskApplyValue = riskResult.min;
										choicesObj.IsMin = true;
										choicesObj.MinValue = riskResult.min;
										// eslint-disable-next-line no-prototype-builtins
									} else if (riskResult.hasOwnProperty('chkmax') && riskResult.chkmax === true) {
										data.RiskApplyValue = riskResult.max;
										choicesObj.IsMax = true;
										choicesObj.MaxValue = riskResult.max;
										// eslint-disable-next-line no-prototype-builtins
									} else if (riskResult.hasOwnProperty('chkmean') && riskResult.chkmean === true) {
										data.RiskApplyValue = riskResult.mean;
										choicesObj.IsMean = true;
										choicesObj.MeanValue = riskResult.mean;
										// eslint-disable-next-line no-prototype-builtins
									} else if (riskResult.hasOwnProperty('chkstdev') && riskResult.chkstdev === true) {
										data.RiskApplyValue = riskResult.stdDev;
										choicesObj.IsStdDev = true;
										choicesObj.StdDevValue = riskResult.stdDev;
									}
									finalResults.push(data);
								}
							});
							userChoicesToSave.push(choicesObj);
						});

						if (finalResults.length > 0) {
							basicsRiskCalculatorMainService.applyResultsToLineItems(finalResults);
							estimateMainRiskSettingsService.updateUserChoices(userChoicesToSave).then(function () {
								if (risksWithChangedImpacts && risksWithChangedImpacts.length > 0) {
									let dto = {
										EntitiesCount: risksWithChangedImpacts.length,
										RiskRegisters: []
										// RiskImpactToSave: []
									};
									angular.forEach(risksWithChangedImpacts, function (risk) {
										dto.RiskRegisters.push(risk);
										// dto.RiskImpactToSave.push(risk.RiskRegisterImpactEntities);
									});
									$http.post(globals.webApiBaseUrl + 'basics/riskregister/update', dto);
								}
							});
						}
					} else {

						resetEntity();
						basicsRiskCalculatorMainService.clear();
						return false;
					}
				});
			};

			function GetRiskToSave(selectedRisks,appliedRisk){
				let returnedRisk = null;
				let go = true;
				angular.forEach(selectedRisks,function (risk) {
					if(go) {
						if (risk.Code === appliedRisk.RiskName) {
							returnedRisk = risk;
							go = false;
						}
					}
				});
				return returnedRisk;
			}

			function addImpactSteps(info){
				let stepCount = 2;
				if(info.newValue){
					info.model.SelectedRisks = _selectedRisks;
					if(info.model.SelectedRisks ){
						let steps = generateAdditionalSteps(info);
						angular.forEach(steps,function (step) {
							info.wizard.steps.splice(stepCount,0,step);
							stepCount++;
						});

					}
				}
			}

			function addFinalSteps(info){
				let currentStep = info.stepIndex + 1;

				if(info.model.CalculationResults){
					let steps = generateFinalSteps(info);
					angular.forEach(steps,function (step) {
						info.wizard.steps.splice(currentStep,0,step);
						currentStep++;
					});
				}
			}

			function generateFinalSteps(stepObj){
				let steps = [];
				let count = 0;

				let step = {
					id: 'resultsStep',
					title: 'Test',
					form: null,
					disallowNext: false,
					prepareStep: prepareViewSteps,
					watches:[],
					canFinish: false
				};
				angular.forEach(stepObj.scope.entity.CalculationResults,function(risk){
					let newStep = angular.copy(step);

					newStep.id = 'RiskResult'+ count.toString();

					newStep.title = 'Result for ' + risk.RiskName;

					let modelName = 'RiskResult' + count.toString();

					newStep.form = angular.copy(estimateMainRiskRegisterCalculatorWizardUIService.getResultConfig());

					angular.forEach(newStep.form.rows,function (row) {
						if(row.model !== 'riskResults'){
							row.model = modelName +'.'+ row.model;
						}
					});
					stepObj.model['RiskResult' + count.toString()] = risk;

					if(risk.Plots.length > 0){
						// data.coord = risk;
						basicsRiskCalculatorMainService.getStatistics(risk,50).then(function (response) {
							let data = response.data;
							if(data !== null){
								stepObj.model[modelName].min = data.min;
								stepObj.model[modelName].max = data.max;
								stepObj.model[modelName].mean = data.mean;
								stepObj.model[modelName].stdDev = data.stdDev;
							}
						});
					}else if(risk.Triangle.length > 0 ){
						// data.coord = risk;
						basicsRiskCalculatorMainService.getStatistics(risk,50).then(function (response) {
							let data = response.data;
							if(data !== null){
								stepObj.model[modelName].min = data.min;
								stepObj.model[modelName].max = data.max;
								stepObj.model[modelName].mean = data.mean;
								stepObj.model[modelName].stdDev = data.stdDev;
							}

						});
					}

					angular.forEach(newStep.form.rows,function (row) {
						newStep.watches.push(createAdditionalWatchesForFinal( row.model,newStep.id));
					});

					steps.push(newStep);

					count++;
				});

				platformWizardDialogService.translateWizardSteps(steps);

				return steps;
			}

			service.setSelected = function (items) {
				_selectedRisks = items;
			};

			return service;

			function onChange(item,model){
				// eslint-disable-next-line no-console
				console.log('Item from onChange',item);
				// eslint-disable-next-line no-console
				console.log('Model from onChange',model);

			}

			function changeUIModels(modelName){
				let ui = angular.copy(estimateMainRiskRegisterCalculatorWizardUIService.getImpactUITest());
				angular.forEach(ui.rows,function (row) {
					row.model = modelName + '.' + row.model;
				});

				return ui;
			}

			function generateAdditionalSteps(stepObj){
				let steps = [];
				let count = 0;

				let step = {
					id: 'impactStep',
					title: 'Test',
					form: null,
					// loadingMessage:'Getting Impact',
					disallowNext: false,
					prepareStep: prepareImpactStep,
					watches:[]
				};
				angular.forEach(stepObj.model.SelectedRisks,function(risk){
					let newStep = angular.copy(step);

					newStep.id = 'impactStep'+ count.toString();

					newStep.title = $translate.instant('estimate.main.riskCalculator.impactFor') + ' ' + risk.DescriptionInfo.Description;

					let modelName = 'Impact' + count.toString();

					newStep.form = changeUIModels(modelName);

					stepObj.model['Impact' + count.toString()] = {};

					angular.forEach(newStep.form.rows,function (row) {
						newStep.watches.push(createAdditionalWatchesForImpact( row.model,newStep.id));
					});

					steps.push(newStep);

					count++;
				});

				platformWizardDialogService.translateWizardSteps(steps);

				return steps;
			}

			function createAdditionalWatchesForFinal(modelName /* ,stepId */){
				return {
					expression: modelName,
					fn: function (info) {
						let currentObjName = info.scope.currentStep.id;
						let currentEntity = info.scope.entity[currentObjName];

						let modelSplit = modelName.split('.');
						if(modelSplit[modelSplit.length - 1] === 'xValue'){
							/* currentObjName = info.scope.currentStep.id;
							currentEntity = info.scope.entity[currentObjName]; */

							basicsRiskCalculatorMainService.calculateXValue(currentEntity,currentEntity.xValue).then(function (response) {
								currentEntity.pValue = response.data;
							});
						}
						if(modelSplit[modelSplit.length - 1] === 'pValue'){
							/* currentObjName = info.scope.currentStep.id;
							currentEntity = info.scope.entity[currentObjName]; */

							basicsRiskCalculatorMainService.calculatePValue(currentEntity,currentEntity.pValue).then(function (response) {
								currentEntity.xValue = response.data;
							});
						}
						if(modelSplit[modelSplit.length - 1] === 'UseCalculation'){

							if(info.newValue){
								/* currentObjName = info.scope.currentStep.id;
								currentEntity = info.scope.entity[currentObjName]; */

								let splitTitle = info.scope.currentStep.title.split(' ');

								let riskCode = '';
								// split title contain Reuslts For --risk title/Code-- start at 2 to avoid the Results For part of the title
								for(let i = 2; i < splitTitle.length; i++){
									riskCode += splitTitle[i] + ' ';
								}
								// let riskCode = splitTitle[splitTitle.length - 2] + ' ' + splitTitle[splitTitle.length -1 ];
								angular.forEach(info.scope.entity.SelectedRisks,function (risk) {
									if(risk.Code + ' ' === riskCode || risk.Code === splitTitle[splitTitle.length -1 ]){
										currentEntity.Id = risk.Id;
									}
								});
								info.scope.entity.ApplicableCalculations.push(currentEntity);
							}else{
								/* currentObjName = info.scope.currentStep.id;
								currentEntity = info.scope.entity[currentObjName]; */
								info.scope.entity.ApplicableCalculations = info.scope.entity.ApplicableCalculations.filter(function(item){
									return item.RiskName !== currentEntity.RiskName;
								});
							}


						}

						switch(modelSplit[modelSplit.length -1]){
							case 'chkxvalue':
								currentEntity.chkxvalue = true;
								currentEntity.chkmean = false;
								currentEntity.chkmin = false;
								currentEntity.chkmax = false;
								currentEntity.chkstdev = false;
								break;
							case 'chkmean':
								currentEntity.chkmean = true;
								currentEntity.chkxvalue = false;
								currentEntity.chkmin = false;
								currentEntity.chkmax = false;
								currentEntity.chkstdev = false;
								break;
							case 'chkmin':
								currentEntity.chkmin = true;
								currentEntity.chkmean = false;
								currentEntity.chkxvalue = false;
								currentEntity.chkmax = false;
								currentEntity.chkstdev = false;
								break;
							case 'chkmax':
								currentEntity.chkmax = true;
								currentEntity.chkmean = false;
								currentEntity.chkmin = false;
								currentEntity.chkxvalue = false;
								currentEntity.chkstdev = false;
								break;
							case 'chkstdev':
								currentEntity.chkstdev = true;
								currentEntity.chkmean = false;
								currentEntity.chkmin = false;
								currentEntity.chkmax = false;
								currentEntity.chkxvalue = false;
								break;
							default:
								break;
						}
					}
				};
			}
			function createAdditionalWatchesForImpact(modelName,stepId){
				return {
					expression: modelName,
					fn: function (info) {

						let selectorStepIndex = _.findIndex(info.wizard.steps, {id: stepId});
						let selectorStep = info.wizard.steps[selectorStepIndex];
						let modelSplit = modelName.split('.');


						angular.forEach(selectorStep.form.rows, function (row) {
							if(info.model.CustomizeImpact === false){
								row.readonly = false;
							}

						});
						angular.forEach(info.model,function (modelItem,key) {

							if(key.substring(0,6) === 'Impact' ){
								if(modelItem.CustomizeImpact === true){
									let removeIndex = info.model.ModifiedImpacts.map(function (item) {
										return item.Id;
									}).indexOf(modelItem.Id);
									if(removeIndex !== -1){
										info.model.ModifiedImpacts.splice(removeIndex,1);
									}
									info.model.ModifiedImpacts.push(modelItem);
									info.model[key] = modelItem;
								}
								switch (modelSplit[modelSplit.length - 1]) {
									case 'HighImpactDetail':
										basicsRiskRegisterImpactDetailService.fieldChange(modelItem,modelSplit[modelSplit.length - 1]);
										break;
									case 'LowImpactDetail':
										basicsRiskRegisterImpactDetailService.fieldChange(modelItem,modelSplit[modelSplit.length - 1]);
										break;
									case 'CentralImpact':
										basicsRiskRegisterImpactDetailService.fieldChange(modelItem,'HighImpactDetail');
										basicsRiskRegisterImpactDetailService.fieldChange(modelItem,'LowImpactDetail');
										break;
									default:
										break;

								}
							}
						});


					}
				};
			}

			function resetEntity(){
				_selectedRisks = null;
				modelData = {
					SelectedRisks:[_selectedRisks],
					SelectedImpacts: [],
					SelectedProjectImpact: null,
					CalculationResults: null,
					CustomizeImpact: false,
					ModifiedImpacts: [],
					resultModel:{},
					ApplicableCalculations:[]

				};


				return modelData;
			}

		}
	]);
})(angular);
