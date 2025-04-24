(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.processconfiguration';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	var platform = 'platform';
	var ppsCommonModule = 'productionplanning.common';
	var ppsFormworkModule = 'productionplanning.formwork';

	angular.module(moduleName).service('productionplanningProcessConfigurationTranslationService', ProcessConfigurationTranslationService);

	ProcessConfigurationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProcessConfigurationTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, basicsCommonModule, cloudCommonModule, platform, ppsCommonModule, ppsFormworkModule]
		};

		data.words = {
			ProcessTypeFk: { location: moduleName, identifier: 'processType', initial: '*Process Type' },
			baseGroup: {location: platform, identifier: 'baseGroup', initial: '*Basic Data'},
			result:{location: moduleName, identifier: 'result', initial: '*Result'},
			userDefText:{location: moduleName, identifier: 'userDefText', initial: '*Userdefined Texts'},
			placeHolder: {location: moduleName, identifier: 'placeHolder', initial: '*PlaceHolder'},
			secondaryPhase: {location: moduleName, identifier: 'secondaryPhase', initial: '*Secondary Phase'},
			location: {location: moduleName, identifier: 'location', initial: '*Location'},
			PhaseTypeFk: {location: moduleName, identifier: 'phaseTemplate.phaseType', initial: '*Phase Type'},
			PpsPhaseTypeFk: {location: moduleName, identifier: 'phaseTemplate.phaseType', initial: '*Phase Type'},
			Length: {location: moduleName, identifier: 'phaseTemplate.length', initial: '*Length'},
			Height: {location: moduleName, identifier: 'phaseTemplate.height', initial: '*Height'},
			Width: {location: moduleName, identifier: 'phaseTemplate.width', initial: '*Width'},
			Weight: {location: moduleName, identifier: 'phaseTemplate.weight', initial: '*Weight'},
			Weight2: {location: moduleName, identifier: 'phaseTemplate.weight2', initial: '*Weight2'},
			Weight3: {location: moduleName, identifier: 'phaseTemplate.weight3', initial: '*Weight3'},
			Area: {location: moduleName, identifier: 'phaseTemplate.area', initial: '*Area'},
			Area2: {location: moduleName, identifier: 'phaseTemplate.area2', initial: '*Area2'},
			Area3: {location: moduleName, identifier: 'phaseTemplate.area3', initial: '*Area3'},
			Volume: {location: moduleName, identifier: 'phaseTemplate.volume', initial: '*Volume'},
			Volume2: {location: moduleName, identifier: 'phaseTemplate.volume2', initial: '*Volume2'},
			Volume3: {location: moduleName, identifier: 'phaseTemplate.volume3', initial: '*Volume3'},
			PlanQuantity: {location: moduleName, identifier: 'phaseTemplate.planquantity', initial: '*Plan Quantity'},
			BillQuantity: {location: moduleName, identifier: 'phaseTemplate.billquantity', initial: '*Bill Quantity'},
			general: {location: moduleName, identifier: 'phaseTemplate.general', initial: '*General'},
			Code: {location: moduleName, identifier: 'phaseTemplate.code', initial: '*Code'},
			ProductTemplateCode: {location: moduleName, identifier: 'phaseTemplate.producttemplatecode', initial: '*Template Code'},
			Description: {location: moduleName, identifier: 'phaseTemplate.description', initial: '*Description'},
			Userdefined1: {location: moduleName, identifier: 'phaseTemplate.userdefined1', initial: '*Userdefined1'},
			Userdefined2: {location: moduleName, identifier: 'phaseTemplate.userdefined2', initial: '*Userdefined2'},
			Userdefined3: {location: moduleName, identifier: 'phaseTemplate.userdefined3', initial: '*Userdefined3'},
			Userdefined4: {location: moduleName, identifier: 'phaseTemplate.userdefined4', initial: '*Userdefined4'},
			Userdefined5: {location: moduleName, identifier: 'phaseTemplate.userdefined5', initial: '*Userdefined5'},
			product: {location: moduleName, identifier: 'phaseTemplate.product', initial: '*Product'},
			productdimension: {location: moduleName, identifier: 'phaseTemplate.productdimension', initial: '*Product Dimension'},
			formwork: {location: moduleName, identifier: 'phaseTemplate.formwork', initial: '*Formwork'},
			project: {location: moduleName, identifier: 'phaseTemplate.project', initial: '*Project'},
			ProjectNo : {location: moduleName, identifier: 'phaseTemplate.projectno', initial:'*Project No'},
			ProjectName : {location: moduleName, identifier: 'phaseTemplate.projectname', initial:'*Project Name'},
			LgmJobCode : {location: moduleName, identifier: 'phaseTemplate.lgmjobcode', initial:'*LgmJobCode'},
			StatusFk: {location: moduleName, identifier: 'phaseTemplate.status', initial: '*Status'},
			FormworkTypeFk: {location: moduleName, identifier: 'phaseTemplate.formworktypefk', initial: '*Formwork Type'},

			SequenceOrder: {
				location: moduleName,
				identifier: 'phaseTemplate.sequenceOrder',
				initial: '*Sequence Order'
			},
			Duration: {location: moduleName, identifier: 'phaseTemplate.duration', initial: '*Duration'},
			SuccessorLeadTime: {location: moduleName, identifier: 'phaseTemplate.successorLeadTime', initial: '*Successor Lead Time'},
			PsdRelationkindFk : {location: moduleName, identifier: 'phaseTemplate.psdRelationKind', initial: '*Relation Kind'},
			SuccessorMinSlackTime: {location: moduleName, identifier: 'phaseTemplate.successorMinSlackTime', initial: '*Min Time'},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			IsPlaceholder: {location: moduleName, identifier: 'phaseTemplate.isPlaceholder', initial: '*IsPlaceholder'},
			ProcessTemplateDefFk:  {location: moduleName, identifier: 'phaseTemplate.defaultProcessTemplate', initial: '*DefaultProcessTemplate'},
			ExecutionLimit:  {location: moduleName, identifier: 'phaseTemplate.executionLimit', initial: '*Execution Limit'},
			UpstreamGoodsTypeFk: {location: moduleName, identifier: 'phasereqtemplate.upstreamGoodsType', initial: '*Requirement Goods Type'},
			UpstreamGoods: {location: moduleName, identifier: 'phasereqtemplate.upstreamGoods', initial: '*Requirement Good'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: '*Quantity'},
			ActualQuantity: {location: ppsCommonModule, identifier: 'actualQuantity', initial: '*Actual Quantity'},
			CorrectionQuantity: {location: moduleName, identifier: 'phasereq.correctionQuantity', initial: '*Correction Quantity'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'},
			CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: '*Comment'},
			PlannedStart: { location: ppsCommonModule, identifier: 'event.plannedStart', initial: '*Planned StartDate' },
			PlannedFinish: { location: ppsCommonModule, identifier: 'event.plannedFinish', initial: '*Planned FinishDate' },
			EarliestStart: { location: ppsCommonModule, identifier: 'event.earliestStart', initial: '*Earliest StartDate' },
			LatestStart: { location: ppsCommonModule, identifier: 'event.latestStart', initial: '*Latest StartDate' },
			EarliestFinish: { location: ppsCommonModule, identifier: 'event.earliestFinish', initial: '*Earliest FinishDate' },
			LatestFinish: { location: ppsCommonModule, identifier: 'event.latestFinish', initial: '*Latest FinishDate' },
			ActualStart: {location: ppsCommonModule, identifier: 'event.actualStart', initial: '*Actual StartDate'},
			ActualFinish: {location: ppsCommonModule, identifier: 'event.actualFinish', initial: '*Actual FinishDate'},
			BasSiteFk: { location: ppsCommonModule, identifier: 'header.basSiteFk', initial: 'Site' },
			PpsProductionPlaceFk: {location: moduleName, identifier: 'phase.PpsProdPlaceFk', initial: '*Production Place'},
			PpsUpstreamGoodsTypeFk: {location: moduleName, identifier: 'phasereqtemplate.upstreamGoodsType', initial: '*Requirement Goods Type'},
			RequirementGoods: {location: moduleName, identifier: 'phasereqtemplate.upstreamGoods', initial: '*Requirement Good'},
			PpsPhaseReqStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			PpsUpstreamTypeFk:{location: moduleName, identifier: 'phasereqtemplate.resultType', initial: '*Requirement Result Type'},
			RequirementResult: {location: moduleName, identifier: 'phasereqtemplate.result', initial: '*Requirement Result'},
			RequirementResultStatus: {location: moduleName, identifier: 'phasereqtemplate.resultstatus', initial: '*Requirement Result Status'},
			IsLockedStart:{location: moduleName, identifier: 'phase.Islockedstart', initial: '*Locked Start'},
			IsLockedFinish:{location: moduleName, identifier: 'phase.Islockedfinish', initial: '*Locked Finish'},
			PpsFormworkFk: { location: ppsFormworkModule, identifier: 'entityFormwork', initial: '*Formwork' },
			PpsProductFk: {location: ppsCommonModule, identifier: 'product.entity', initial: '*Product'},
			CalCalendarLeadFk: { location: ppsCommonModule, identifier: 'event.calCalendarFk', initial: 'Calendar' }
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
