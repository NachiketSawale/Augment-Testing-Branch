/**
 * Created by lcn on 1/18/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';
	var cloudCommonModule = 'cloud.common';
	var boqMainModule = 'boq.main';
	var estimateMainModule = 'estimate.main';
	var basicsImportModule = 'basics.import';
	angular.module(moduleName).factory('basicsWorkflowTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService',

		function (platformTranslateService, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, cloudCommonModule,boqMainModule,estimateMainModule,basicsImportModule]
			};
			data.words = {
				basicData: {location: moduleName, identifier: 'approver.basicData'},
				ClerkRoleFk: {location: moduleName, identifier: 'approver.clerkRole'},
				EvaluationLevel: {location: moduleName, identifier: 'approver.evaluationLevel'},
				TimeToApprove: {location: moduleName, identifier: 'approver.timeToApprove'},
				ClassifiedNum: {location: moduleName, identifier: 'approver.classifiedNum'},
				ClassifiedAmount: {location: moduleName, identifier: 'approver.classifiedAmount'},
				ClassifiedText: {location: moduleName, identifier: 'approver.classifiedText'},
				ClassifiedDate: {location: moduleName, identifier: 'approver.classifiedDate'},
				Formular: {location: moduleName, identifier: 'approver.formular'},
				IsMail: {location: moduleName, identifier: 'approver.isMail'},
				NeedComment4Approve: {location: moduleName, identifier: 'approver.needComment4Approve'},
				NeedComment4Reject: {location: moduleName, identifier: 'approver.needComment4Reject'},
				AllowReject2Level : {location: moduleName, identifier: 'approver.allowreject2level'},
				InstanceFk: {location: moduleName, identifier: 'approver.instanceFk'},
				ActionInstanceFk: {location: moduleName, identifier: 'approver.actionInstanceFk'},
				ClerkFk: {location: moduleName, identifier: 'approver.clerkFk'},
				IsApproved: {location: moduleName, identifier: 'approver.isApproved'},
				EvaluatedOn: {location: moduleName, identifier: 'approver.evaluatedOn'},
				Comment: {location: moduleName, identifier: 'approver.comment'},
				DueDate: {location: moduleName, identifier: 'approver.dueDate'},
				IsSendMailToClerk : {location: moduleName, identifier: 'approver.isSendMailToClerk'}
			};
			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			//Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
