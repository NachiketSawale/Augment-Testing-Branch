(function (angular) {
	'use strict';

	var resourceRequisitionModule = 'resource.requisition';
	var resourceMasterModule = 'resource.master';
	var resourceSkillModule = 'resource.skill';
	var resourceReservationModule = 'resource.reservation';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var schedulingMainModule = 'scheduling.main';
	var logisticJobModule = 'logistic.job';
	var basicsMaterialModule = 'basics.material';
	var procurementStockModule = 'procurement.stock';
	/**
	 * @ngdoc service
	 * @name resourceRequisitionTranslationService
	 * @description provides translation for object Main module
	 */
	angular.module(resourceRequisitionModule).factory('resourceRequisitionTranslationService', ['_', 'platformTranslationUtilitiesService',

		function (_, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [resourceRequisitionModule, cloudCommonModule, basicsCustomizeModule, schedulingMainModule,
					              resourceMasterModule, resourceReservationModule, logisticJobModule, resourceSkillModule, basicsMaterialModule,procurementStockModule]
			};

			data.words = {
				basicData: {location: cloudCommonModule, identifier: 'entityProperties'},
				PrjStockFk: {location: resourceRequisitionModule, identifier: 'entityStock'},
				DocumentTypeFk: {location: cloudCommonModule, identifier: 'entityType'},
				Date: { location: cloudCommonModule, identifier: 'entityDate'},
				Barcode: { location: resourceRequisitionModule, identifier: 'entityBarcode'},
				OriginFileName: { location: cloudCommonModule, identifier: 'documentOriginFileName'},
				Url: { location: resourceRequisitionModule, identifier: 'url' },
				Code: { location: resourceRequisitionModule, identifier: 'entityCode' },
				RubricCategoryFk: { location: resourceRequisitionModule, identifier: 'entityRubricCategoryFk' },
			};

			function addRequisitionTranslation(words) {
				words.requisitionListTitle = { location: resourceRequisitionModule, identifier: 'requisitionListTitle'};
				words.requisitionDetailTitle = { location: resourceRequisitionModule, identifier: 'requisitionListTitle'};
				words.ReservedFrom = { location: resourceRequisitionModule, identifier: 'entityReservedFrom'};
				words.ReservedTo = { location: resourceRequisitionModule, identifier: 'entityReservedTo'};
				words.RequisitionStatusFk = { location: cloudCommonModule, identifier: 'entityState'};
				words.JobFk = { location: resourceRequisitionModule, identifier: 'entityJob'};
				words.JobPreferredFk = { location : resourceRequisitionModule, identifier : 'entityJobPreferred' };
				words.TypeFk = { location: basicsCustomizeModule, identifier: 'resourcetype'};
				words.TrsRequisitionFk = { location: resourceRequisitionModule, identifier: 'entityTrsRequisitionFk'};
				words.PpsEventFk = { location: resourceRequisitionModule, identifier: 'entityPpsEvent'};
				words.RequestedFrom = { location: resourceRequisitionModule, identifier: 'entityRequestedFrom'};
				words.RequestedTo = { location: resourceRequisitionModule, identifier: 'entityRequestedTo'};
				words.IsLinkedFixToReservation = {location: resourceRequisitionModule, identifier: 'entityIsLinkedFixToReservation'};
				words.ReservedFrom = { location: resourceRequisitionModule, identifier: 'entityReservedFrom'};
				words.ReservedTo = { location: resourceRequisitionModule, identifier: 'entityReservedTo'};
				words.ActivityFk = { location: schedulingMainModule, identifier: 'activity'};
				words.ResourceFk = { location: resourceRequisitionModule, identifier: 'entityPreferredResource'};
				words.Quantity = {location: cloudCommonModule, identifier: 'entityQuantity'};
				words.UomFk = { location: cloudCommonModule, identifier: 'entityUoM'};
				words.DispatcherGroupFk = { location: resourceRequisitionModule, identifier: 'entityDispatcherGroupFk'};
				words.MaterialFk = {location: basicsMaterialModule, identifier: 'record.material'};
				words.CommentText = { location: cloudCommonModule, identifier: 'entityComment'};
				words.ProjectFk = { location: cloudCommonModule, identifier: 'entityProject'};
				words.JobGroupFk = { location: resourceRequisitionModule, identifier: 'entityJobGroup'};
				words.SiteFk = { location: resourceRequisitionModule, identifier: 'SiteFk'};
				words.RequisitionTypeFk =  { location: basicsCustomizeModule, identifier: 'resrequisitiontype'};
				words.RequisitionGroupFk = { location: basicsCustomizeModule, identifier: 'resourcerequisitiongroup',initial:'Resource Requisition Group'};
				words.RequisitionPriorityFk={location: basicsCustomizeModule, identifier: 'resrequisitionpriorty', initial:'Resource Requisition Priority'};
				words.ClerkOwnerFk= { location: resourceRequisitionModule, identifier: 'ClerkownerFk'};
				words.ClerkResponsibleFk= { location: resourceRequisitionModule, identifier: 'ClerkresponsibleFk'};
				words.RequisitionFk = {location: resourceRequisitionModule, identifier: 'RequisitionFk'};
				words.ReservationId={location: resourceRequisitionModule, identifier: 'ReservationId'};
				words.StockFk ={location: resourceRequisitionModule, identifier: 'entityStock'};
				words.JobSiteFk ={ location: resourceRequisitionModule, identifier: 'entityJobSite'};
				words.PreferredResourceSiteFk ={ location: resourceRequisitionModule, identifier: 'entityPreferredResourceSite'};
				words.RequisitionFk ={ location : resourceRequisitionModule,identifier : 'entityRequisitionFk' };
				words.ProjectStockFk = { location : resourceRequisitionModule,identifier : 'entityProjectStockFk' };
				words.CompanyFk = {location: cloudCommonModule, identifier: 'entityCompany'};
				words.ProjectChangeFk = {location: cloudCommonModule, identifier: 'entityProjectChange'};
				words.ProjectChangeStatusFk = {location: basicsCustomizeModule, identifier: 'projectchangestatus', initial: 'Project Change Status'};
				words.IsBottleNeck = { location : resourceRequisitionModule,identifier : 'entityIsBottleNeck' };
				words.QuantityFromEstimate = { location : resourceRequisitionModule,identifier : 'entityQuantityFromEstimate' };
				words.MdcControllingUnitFk = { location : resourceRequisitionModule,identifier : 'entityMdcControllingUnitFk' };
				words.PlannedStart = { location : resourceRequisitionModule,identifier : 'entityPlannedStart' };
				words.PlannedEnd = { location : resourceRequisitionModule,identifier : 'entityPlannedEnd' };
				words.IsTimeEnhancement = { location : resourceRequisitionModule,identifier : 'entityIsTimeEnhancement' };
				words.IsRequestBizPartner = { location : resourceRequisitionModule,identifier : 'entityIsRequestBizPartner' };
				words.IsRequestProjectDoc = { location : resourceRequisitionModule,identifier : 'entityIsRequestProjectDoc' };
				words.EstimateQuantity = { location : resourceRequisitionModule,identifier : 'entityEstimateQuantity' };
				words.EstWorkOperationTypeFk = { location : resourceRequisitionModule,identifier : 'entityEstWorkOperationTypeFk' };
				words.Requisition2requisitionFk = { location : resourceRequisitionModule,identifier : 'entityRequisition2requisitionFk' };
				words.TypeAlternativeFk = { location : resourceRequisitionModule,identifier : 'entityTypeAlternativeFk' };
				words.DropPointFk = { location : resourceRequisitionModule,identifier : 'entityDropPointFk' };
				words.WorkOperationTypeFk = { location : resourceRequisitionModule,identifier : 'entityWorkOperationTypeFk' };
				words.WorkOperationTypeFromEstimateFk = { location : resourceRequisitionModule,identifier : 'entityWorkOperationTypeFromEstimateFk' };
				words.ExecPlannerItemFk = { location : resourceRequisitionModule,identifier : 'entityExecPlannerItemFk' };
				words.ProjectTimeSlotFk = { location : resourceRequisitionModule,identifier : 'entityProjectTimeSlotFk' };
				words.SkillFk = { location: resourceSkillModule, identifier: 'resourceSkillEntity'};
				words.estimateGroup = { location: resourceRequisitionModule, identifier : 'entityEstimateGroup',initial: 'Original Estimate' };
			}

			addRequisitionTranslation(data.words);

			service.addRequisitionTranslation = addRequisitionTranslation;
			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			let modules = ['logistic', 'resource',  'basics', 'project', 'services','documents'];
			data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 6, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);


