(function (angular) {
	'use strict';

	const changeMainModule = 'change.main';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const projectMainModule = 'project.main';
	const salesCommonModule = 'sales.common';
	const procureContractModule = 'procurement.contract';
	const procureCommonModule = 'procurement.common';
	const defectMain = 'defect.main';


	/**
	 * @ngdoc service
	 * @name changeMainTranslationService
	 * @description provides translation for change main module
	 */
	angular.module(changeMainModule).service('changeMainTranslationService', ChangeMainTranslationService);

	ChangeMainTranslationService.$inject = ['_', 'platformModuleInitialConfigurationService', 'platformTranslationUtilitiesService',
		'projectMainTranslationService', 'procurementContractTranslationService'];

	function ChangeMainTranslationService(_, platformModuleInitialConfigurationService, platformTranslationUtilitiesService,
		projectMainTranslationService, procurementContractTranslationService) {
		var service = this;

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [changeMainModule, basicsCommonModule, cloudCommonModule, projectMainModule, salesCommonModule,
				procureContractModule, procureCommonModule, 'logistic.settlement', 'logistic.dispatching', 'resource.wot']
		};

		data.words = {
			procurementContractGridTitle: {
				location: changeMainModule,
				identifier: 'procurementContractGridTitle',
				initial: 'Procurement Contracts'
			},
			procurementContractFormTitle: {
				location: changeMainModule,
				identifier: 'procurementContractFormTitle',
				initial: 'Procurement Contract Details'
			},
			ChangeStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Basic Data'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
			LastDate: {location: projectMainModule, identifier: 'entityLastDate', initial: 'Last Date'},
			Reference: {location: projectMainModule, identifier: 'entityReference', initial: 'Reference'},
			ChangeTypeFk: {location: projectMainModule, identifier: 'entityChangeType', initial: 'Type'},
			Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
			Probability: {location: projectMainModule, identifier: 'entityProbability', initial: 'Incident Rate'},
			ExpectedCost: {location: projectMainModule, identifier: 'entityExpectedCost', initial: 'Expected Cost'},
			OrdHeaderFk: { location: defectMain, identifier: 'entityOrdHeaderFk'},
			ContractHeaderFk: { location: defectMain, identifier: 'entityConHeaderFk'},
			ExpectedRevenue: {
				location: projectMainModule,
				identifier: 'entityExpectedRevenue',
				initial: 'ExpectedRevenue'
			},
			CompanyResponsibleFk: {
				location: salesCommonModule,
				identifier: 'entityCompanyResponsibleFk',
				initial: 'Responsible'
			},
			PrjProjectFk: {location: salesCommonModule, identifier: 'entityProjectFk', initial: 'Project'},
			CurrencyFk: {location: salesCommonModule, identifier: 'entityCurrencyFk', initial: 'Currency'},
			CustomerFk: {location: salesCommonModule, identifier: 'entityCustomerFk', initial: 'Customer'},
			PrjChangeFk: {location: salesCommonModule, identifier: 'entityPrjChange', initial: 'Change'},
			ProjectData: {location: changeMainModule, identifier: 'entityProjectData', initial: 'Project Data'},
			Reason: {location: changeMainModule, identifier: 'entityReason', initial: 'Reason'},
			InstructionDate: {location: changeMainModule, identifier: 'instructionDate', initial: 'Instruction Date'},
			SubmissionDate: {location: changeMainModule, identifier: 'submissionDate', initial: 'Submission Date'},
			ConfirmationDate: {location: changeMainModule, identifier: 'confirmationDate', initial: 'Confirmation Date'},
			ChangestatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Change Status'},
			EstDirCostTotal: {location: changeMainModule, identifier: 'entityEstDirCostTotal', initial: 'Est Direct Cost Total'},
			EstIndCostTotal: {location: changeMainModule, identifier: 'entityEstIndCostTotal', initial: 'Est Indirect Cost'},
			EstCostTotal: {location: changeMainModule, identifier: 'entityEstCostTotal', initial: 'Est Total Cost From'},
			EstBudget: {location: changeMainModule, identifier: 'entityEstBudget', initial: 'Est Budget'},
			SlsBidResult: {location: changeMainModule, identifier: 'entitySlsBidResult', initial: 'Sales Bid Net'},
			SlsOrdResult: {location: changeMainModule, identifier: 'entitySlsOrdResult', initial: 'Sales Con Net Total'},
			SlsBilResult: {location: changeMainModule, identifier: 'entitySlsBilResult', initial: 'Sales Bill Net Total'},
			PrcReqNetTotal: {location: changeMainModule, identifier: 'entityPrcReqNetTotal', initial: 'Prc Req Net Total'},
			PrcReqBudget: {location: changeMainModule, identifier: 'entityPrcReqBudget', initial: 'Prc Req Budget'},
			PrcConNetTotal: {location: changeMainModule, identifier: 'entityPrcConNetTotal', initial: 'Prc Con Net Total'},
			PrcConBudget: {location: changeMainModule, identifier: 'entityPrcConBudget', initial: 'Prc Con Budget'},
			RubricCategoryFk: {location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Rubric Category'},
			ChangeReasonFk: {location: changeMainModule, identifier: 'changeReason', initial: 'Change Reason'},
			ExternalsourceFk: {location: changeMainModule, identifier: 'entityExternalSourceFk', initial: 'External Source'},
			ExtGuid: {location: changeMainModule, identifier: 'entityExtGuid', initial: 'External GUID'},
			ExtName: {location: changeMainModule, identifier: 'entityExtName', initial: 'External Name'},
			ExtPath: {location: changeMainModule, identifier: 'entityExtPath', initial: 'External Path'},
			DeltaSlsOrdResultEstCostTotal: {location: changeMainModule, identifier: 'entityDeltaSlsOrdResultEstCostTotal', initial: 'Delta Sales Con Net Total vs Est Total Cost From'},
			DeltaEstBudgetEstCostTotal: {location: changeMainModule, identifier: 'entityDeltaEstBudgetEstCostTotal', initial: 'Delta Est Budget vs Est Total Cost From'},
			DeltaEstBudgetSlsOrdResult: {location: changeMainModule, identifier: 'entityDeltaEstBudgetSlsOrdResult', initial: 'Delta Est Budget vs Sales Con Net Total'},
			FactorByAmount: {location: changeMainModule, identifier: 'FactorByAmount', initial: 'Factor By Amount'},
			FactorByReason: {location: changeMainModule, identifier: 'FactorByReason', initial: 'Factor By Reason'},
			ElectronicDataExchangeNrGermanGaeb: { location: changeMainModule, identifier: 'entityGaebNr', initial: 'Gaeb Nr'},
			ChangeAssignmentFk: { location: changeMainModule, identifier: 'entityReference', initial: 'Referenced Change'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'}
		};

		service.loadDynamicTranslations = function loadDynamicTranslations() {
			_.forEach(platformModuleInitialConfigurationService.get('Change.Main').container, function (cont) {
				if (_.indexOf(data.allUsedModules, cont.moduleName) === -1) {
					data.allUsedModules.push(cont.moduleName);
				}

				var title = _.last(_.split(cont.title, '.'));
				if (_.isNull(data.words[title]) || _.isUndefined(data.words[title])) {
					data.words[title] = {
						location: cont.moduleName,
						identifier: title,
						initial: ''
					};
				}
			});

			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, dataWords);
			platformTranslationUtilitiesService.reloadModuleTranslation(data);
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		// Needs basicData and baseGroup on the data.words property as addCloudCommonBasicWords can only add one of them,
		// basicData is manually added.
		data.words.basicData = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' };
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

		var pcHeaderWords = procurementContractTranslationService.addContractHeaderWords({ });
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, pcHeaderWords);

		var projectWords = _.cloneDeep(projectMainTranslationService.getProjectData().words);
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, projectWords);

		var prefix = 'Project.';
		var dataWordsProject = {};
		for (var text in projectWords) {
			if (projectWords.hasOwnProperty(text)) {
				dataWordsProject[prefix + text] = projectWords[text];
				if (text === 'StatusFk') {
					dataWordsProject[prefix + text].identifier = 'prj_status';
					dataWordsProject[prefix + text].location = 'change.main';
				}
			}
		}

		var dataWords = Object.assign(data.words, dataWordsProject);


		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, dataWords);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
