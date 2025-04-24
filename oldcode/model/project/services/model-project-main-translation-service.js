/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var modelProjectModule = 'model.project';
	var modelAdministrationModule = 'model.administration';
	var cloudCommonModule = 'cloud.common';
	var servicesSchedulerUIModule = 'services.schedulerui';
	const basicsCompanyModule = 'basics.company';

	/**
	 * @ngdoc service
	 * @name modelProjectMainTranslationService
	 * @description provides translation for model project module
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelProjectModule).factory('modelProjectMainTranslationService', ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules',

		function (platformTranslationUtilitiesService, modelViewerTranslationModules) {
			var service = {};

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [
					modelProjectModule,
					cloudCommonModule,
					basicsCompanyModule,
					servicesSchedulerUIModule
				].concat(modelViewerTranslationModules)
			};

			data.words = {
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				StatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Basic Data'},
				LodFk: {location: modelProjectModule, identifier: 'entityLod', initial: 'Lod'},
				TypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment Text'},
				EstimateHeaderFk: {location: modelProjectModule, identifier: 'entityHeader', initial: 'EstHeader'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
				ScheduleFk: {location: modelProjectModule, identifier: 'entitySchedule', initial: 'Schedule'},
				FileArchiveDocFk: {
					location: modelProjectModule,
					identifier: 'entityFileArchiveDoc',
					initial: 'File Archive'
				},
				OriginFileName: {location: modelProjectModule, identifier: 'entityFileArchiveDoc', initial: 'File Archive'},
				ProjectFk: {location: modelProjectModule, identifier: 'entityProjectNo', initial: 'Project No'},
				Action: {location: modelProjectModule, identifier: 'action', initial: 'Action'},
				Convert: {location: modelProjectModule, identifier: 'convert', initial: 'Convert'},
				IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
				Status: {location: modelProjectModule, identifier: 'status', initial: 'Status'},
				ModelFk: {location: modelProjectModule, identifier: 'model', initial: 'Model'},
				ModelPartFk: {location: modelProjectModule, identifier: 'modelPart', initial: 'Sub-Model'},
				IsComposite: {location: modelProjectModule, identifier: 'isComposite', initial: 'Is Composite'},
				ModelVersion: {location: modelProjectModule, identifier: 'modelVersion', initial: 'Version'},
				ModelRevision: {location: modelProjectModule, identifier: 'modelRevision', initial: 'Revision'},
				DataTreeFk: {location: modelAdministrationModule, identifier: 'dataTree.dataTree', initial: 'Brrr'},
				AssignLocations: {
					location: modelAdministrationModule,
					identifier: 'assignLocations',
					initial: 'Assign Locations'
				},
				OverwriteLocations: {
					location: modelAdministrationModule,
					identifier: 'overwriteLocations',
					initial: 'Overwrite Locations'
				},
				PropertyKeyFk: {location: modelProjectModule, identifier: 'propertyKey', initial: 'Property Key'},
				modelCnvGroup: {location: modelProjectModule, identifier: 'modelCnvGroup', initial: 'Conversion'},
				PkTagIds: {location: modelProjectModule, identifier: 'pkTags', initial: 'Attribute Tags'},
				ExpiryDate: {location: modelProjectModule, identifier: 'expiryDate', initial: 'Expiry Date'},
				ExpiryDays: {location: modelProjectModule, identifier: 'expiryDays', initial: 'Expiry Days'},
				DefaultExpiryDate: {
					location: modelProjectModule,
					identifier: 'defaultExpiryDate',
					initial: 'Default Expiry Date'
				},
				DefaultExpiryDays: {
					location: modelProjectModule,
					identifier: 'defaultExpiryDays',
					initial: 'Default Expiry Days'
				},
				modelLifecycleGroup: {
					location: modelProjectModule,
					identifier: 'modelLifecycleGroup',
					initial: 'Model Lifecycle'
				},
				linkageGroup: {location: modelProjectModule, identifier: 'linkageGroup', initial: 'Links'},
				expiryGroup: {location: modelProjectModule, identifier: 'expiryGroup', initial: 'Auto-Expiry'},
				Trace: {location: modelProjectModule, identifier: 'trace', initial: 'Enable Tracing'},
				ImportProfileFk: {location: modelProjectModule, identifier: 'modelImportPrf', initial: 'Import Profile'},
				ClerkFk: {location: modelProjectModule, identifier: 'clerk', initial: 'Clerk'},
				BusinessPartnerFk: {location: modelProjectModule, identifier: 'businesspartner', initial: 'Businesspartner'},
				SubsidiaryFk: {location: modelProjectModule, identifier: 'subsidiary', initial: 'Subsidiary'},
				ContactFk: {location: modelProjectModule, identifier: 'contact', initial: 'Contact'},
				StakeholderRoleFk: {location: modelProjectModule, identifier: 'stakeholder_role', initial: 'Stakeholder_role'},
				DocumentTypeFk: {location: modelProjectModule, identifier: 'modelDocType'},
				basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				baseData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom' },
				ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo' },
			};
			platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			
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
