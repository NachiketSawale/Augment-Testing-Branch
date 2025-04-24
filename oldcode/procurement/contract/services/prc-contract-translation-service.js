/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var procurementStructureModule = 'basics.procurementstructure';
	var modelWdeViewerModule = 'model.wdeviewer';
	var procurementContractModule = 'procurement.contract';
	var resourceEquipment = 'resource.equipment';
	var resourceEquipmentGroup = 'resource.equipmentgroup';
	var logisticJob = 'logistic.job';
	var changeMainModule = 'change.main',
		defectMainModule = 'defect.main',
		cloudCommonModule = 'cloud.common',
		controllingStructureModule = 'controlling.structure',
		projectMainModule='project.main';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(procurementContractModule)
		.factory('procurementContractTranslationService', ['_', 'platformUIBaseTranslationService', '$q', 'procurementContractHeaderLayout',
			'businesspartnerCertificateToContractLayout', 'basicsMaterialPriceConditionLayout', 'procurementContractMasterRestrictionLayout', 'procurementContractAdvanceDetailLayout', 'procurementCommonTranslationService','projectMainStandardConfigurationService', 'procurementContractTransactionLayout',
			'modelViewerTranslationModules',

			function (_, PlatformUIBaseTranslationService, $q, procurementContractHeaderLayout,
				businesspartnerCertificateToContractLayout, basicsMaterialPriceConditionLayout, procurementContractMasterRestrictionLayout, procurementContractAdvanceDetailLayout, procurementCommonTranslationService, projectMainStandardConfigurationService, procurementContractTransactionLayout,
				modelViewerTranslationModules) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				function getHeaderApprovalWords() {
					var cloudCommonModule = 'cloud.common';
					var usedWords = {
						ClerkFk: {location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
						ClerkRoleFk: {location: cloudCommonModule, identifier: 'entityClerkRole', initial: 'Clerk Role'},
						DueDate: {location: procurementContractModule, identifier: 'entityDueDate', initial: 'DueDate'},
						IsApproved: {location: procurementContractModule, identifier: 'entityApproved', initial: 'Approved'},
						Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
						EvaluatedOn: {location: procurementContractModule, identifier: 'entityEvaluatedOn', initial: 'Evaluated on'},
						EvaluationLevel: {location: procurementContractModule, identifier: 'entityEvaluationLevel', initial: 'Evaluationlevel'}
					};

					return { translationInfos: {
						extraModules: [procurementContractModule, cloudCommonModule],
						extraWords: usedWords
					}};
				}

				var projectMainLayout = _.cloneDeep(projectMainStandardConfigurationService.getProjectMainLayout());

				var service = new MyTranslationService([{
					translationInfos: {
						extraModules: [procurementStructureModule,
							modelWdeViewerModule, resourceEquipment, resourceEquipmentGroup, logisticJob, changeMainModule, defectMainModule, cloudCommonModule, projectMainModule,controllingStructureModule].concat(modelViewerTranslationModules)
					}
				}, businesspartnerCertificateToContractLayout, basicsMaterialPriceConditionLayout,
				procurementCommonTranslationService.getCallOffAgreementLayout(), procurementCommonTranslationService.getMandatoryDeadlineLayout(),
				procurementCommonTranslationService.getAccountAssignmentLayout(), procurementCommonTranslationService.getCrewLayout(), procurementContractHeaderLayout,
				procurementContractMasterRestrictionLayout, procurementContractAdvanceDetailLayout, projectMainLayout, procurementContractTransactionLayout, getHeaderApprovalWords()]);

				// for container information service use
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				service.addContractHeaderWords = function addContractHeaderWords(words) {
					// words.PrcHeaderEntity = {};
					words.ProjectChangeFk = {
						location: 'procurement.common',
						identifier: 'reqheaderChangeRequest',
						initial: 'Change Request'
					};
					words.ConfigurationFk = {
						location: 'procurement.common',
						identifier: 'prcConfigurationDescription',
						initial: 'Configuration'
					};
					words.StructureFk = {
						location: 'basics.common',
						identifier: 'entityPrcStructureFk',
						initial: 'Procurement Structure'
					};
					words.StrategyFk = {location: 'cloud.common', identifier: 'EntityStrategy', initial: 'Strategy'};
					return _.merge(words, procurementContractHeaderLayout.translationInfos.extraWords);
				};

				return service;
			}

		]);

})(angular);
