/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const infReqModule = 'project.inforequest';
	let module = angular.module(infReqModule);
	const changeMainModule = 'change.main';
	const cloudCommonModule = 'cloud.common';
	const modelMainModule = 'model.main';
	const wdeViewerModule = 'model.wdeviewer';
	const basicsConfModule = 'basics.config';
	const basicsCustomModule = 'basics.customize';
	const projectMainModule = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectLocationTranslationService
	 * @description provides translation for project main module
	 */
	module.service('projectInfoRequestTranslationService', ProjectInfoRequestTranslationService);

	ProjectInfoRequestTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function ProjectInfoRequestTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [infReqModule, cloudCommonModule, modelMainModule,
				wdeViewerModule, basicsConfModule, projectMainModule, basicsCustomModule, 'defect.main', changeMainModule].concat(modelViewerTranslationModules)
		};

		data.words = {
			// Entities / container / Title
			requestEntity: { location: infReqModule, identifier: 'requestEntity', initial: 'Information Request'},
			infoRequestListTitle: { location: infReqModule, identifier: 'infoRequestListTitle', initial: 'Information Requests'},
			infoRequestDetailTitle: { location: infReqModule, identifier: 'infoRequestDetailTitle', initial: 'Information Request Details'},
			contributionEntity: { location: infReqModule, identifier: 'contributionEntity', initial: 'Contribution'},
			contributionListTitle: { location: infReqModule, identifier: 'contributionListTitle', initial: 'Contributions'},
			relevantToEntity: { location: infReqModule, identifier: 'relevantToEntity', initial: 'Relevant To'},
			relevantToListTitle: { location: infReqModule, identifier: 'relevantToListTitle', initial: 'Relevant To'},
			relevantToDetailTitle: { location: infReqModule, identifier: 'relevantToDetailTitle', initial: 'Relevant To Details' },
			referenceToEntity: { location: infReqModule, identifier: 'referenceToEntity', initial: 'Relevant To' },
			referenceToListTitle: { location: infReqModule, identifier: 'referenceToListTitle', initial: 'Reference To' },
			referenceToDetailTitle: { location: infReqModule, identifier: 'referenceToDetailTitle', initial: 'Reference To Details' },
			RequestFromFk: { location: infReqModule, identifier: 'requestFromFk', initial: 'From' },
			RequestToFk: { location: infReqModule, identifier: 'requestToFk', initial: 'To' },
			ReferenceTypeFk: { location: infReqModule, identifier: 'referenceTypeFk', initial: 'Type' },
			changeStatus: { location: cloudCommonModule, identifier: 'changeStatus', initial: 'Change Status'},
			sidebarTitle: { location: basicsConfModule, identifier: 'sidebarTitle', initial: 'Wizards'},

			// Attributes
			ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
			ModelFk: { location: modelMainModule, identifier: 'entityModel', initial: 'Model'},
			RequestStatusFk: { location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			RequestGroupFk: { location: cloudCommonModule, identifier: 'entityGroup', initial: 'Group'},
			RequestTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
			Specification: { location: cloudCommonModule, identifier: 'EntitySpec', initial: 'Specification'},
			ClerkRaisedByFk: { location: infReqModule, identifier: 'recordRaisedBy', initial: 'Raised By'},
			ClerkResponsibleFk: { location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
			ClerkCurrentFk: { location: cloudCommonModule, identifier: 'currentTag', initial: 'Current'},
			BusinesspartnerFk: { location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
			ContactFk: { location: projectMainModule, identifier: 'entityContact', initial: 'Contact'},
			DateRaised: { location: infReqModule, identifier: 'recordRaised', initial: 'Raised'},
			DateDue: { location: infReqModule, identifier: 'recordDueDate', initial: 'Due Date'},
			InfoRequestFk: { location: infReqModule, identifier: 'requestEntity', initial: 'Information Request'},
			RequestContributionFk: { location: cloudCommonModule, identifier: 'contributionEntity', initial: 'Contribution'},
			RequestContributionTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
			ClerkFk: { location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
			CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
			DefectFk : {location: infReqModule, identifier: 'defectFk', initial: 'Defect Number'},
			ChangeFk : {location: infReqModule, identifier: 'changeFk', initial: 'Change Number'},
			Rfi2ChangeTypeFk:{ location: infReqModule, identifier: 'rfi2ChangeType', initial: 'RFI To ChangeType'},
			Rfi2DefectTypeFk:{ location: infReqModule, identifier: 'rfi2DefectType', initial: 'RFI To DefectType'},
			ExternalSourceFk: {location: infReqModule, identifier: 'entityExternalSourceFk', initial: 'External Source'},
			ExtGuid: {location: infReqModule, identifier: 'entityExtGuid', initial: 'External GUID'},
			ExtName: {location: infReqModule, identifier: 'entityExtName', initial: 'External Name'},
			ExtPath: {location: infReqModule, identifier: 'entityExtPath', initial: 'External Path'},
			RubricCategoryFk: {location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Rubric Category'},
			HeaderFk: {location: cloudCommonModule, identifier: 'entityContract', initial: 'Contract'},
			PriorityFk: {location: basicsCustomModule, identifier: 'priority', initial: 'Priority'},
			SubsidiaryFk: { location: cloudCommonModule, identifier: 'entitySubsidiary' },
			MarkerFk:{ location: infReqModule, identifier: 'entityMarker', initial: 'Marker'},
			ObjectSetFk:{ location: infReqModule, identifier: 'entityObjectSet', initial: 'Object Set'},
			ChangeStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Basic Data'},
			ChangeTypeFk: {location: projectMainModule, identifier: 'entityChangeType', initial: 'Type'},
			DfmStatusFk: {location: projectMainModule, identifier: 'defectStatus', initial: 'Status'},
			BasDefectTypeFk: {location: projectMainModule, identifier: 'defectType', initial: 'Defect Type'},
			PrjProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' }
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');


		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(this, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
