(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name logisticJobDataService
	 * @function
	 *
	 * @description
	 * logisticJobDataService is the data service for all job related functionality.
	 */
	var moduleName = 'logistic.job';
	var logisticModule = angular.module(moduleName);
	logisticModule.service('logisticJobDataService',LogisticJobDataService);
	LogisticJobDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'platformObjectHelper',
		'cloudDesktopSidebarService','basicsCompanyNumberGenerationInfoService','logisticJobConstantValues','platformPermissionService',
		'permissions','logisticJobReadonlyProcessorService'];
	function LogisticJobDataService (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                 mandatoryProcessor, platformRuntimeDataService, basicsLookupdataLookupFilterService, platformObjectHelper,
	                                 cloudDesktopSidebarService, basicsCompanyNumberGenerationInfoService,logisticJobConstantValues,platformPermissionService,
	                                 permissions,logisticJobReadonlyProcessorService) {

		var self = this;
		let readOnlyFlag = null;
		var logisticJobServiceOption = {
			flatRootItem: {
				module: logisticModule,
				serviceName: 'logisticJobDataService',
				entityNameTranslationID: 'logistic.job.entityJob',
				entityInformation: { module: 'Logistic.Job', entity: 'Job', specialTreatmentService: null },
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'JobDto',
					moduleSubModule: 'Logistic.Job'
				}),logisticJobReadonlyProcessorService],
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canCreateOrDelete, canCreateCallBackFunc: canCreateOrDelete},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {}
				},
				entityRole: {
					root: {
						itemName: 'Jobs',
						moduleName: 'cloud.desktop.moduleDisplayNameLogisticJob',
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: true,
						pinningOptions: {
							isActive: true, showPinningContext: [{token: 'project.main', show: true}],
							setContextCallback: function (prjService) {
								cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'ProjectFk');
							}
						},
						withExecutionHints: true
					}
				}
			}
		};


		var serviceContainer = platformDataServiceFactory.createNewComplete(logisticJobServiceOption,self);
		var service = serviceContainer.service;

		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'JobDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobValidationService'
		});

		var jobEntityRelatedFilters = [
			{
				key: 'logistic-job-priceversion-filter',
				fn: function (coco, job) {
					return job.CostCodePriceListFk ? coco.PriceListFk === job.CostCodePriceListFk : true;
				}
			},
			{
				key: 'logistic-job-subsidiary-filter',
				fn: function (subsidiary, entity) {
					return ( subsidiary.BusinessPartnerFk === entity.BusinessPartnerFk);
				}
			},
			{
				key: 'logistic-job-customer-filter',
				fn: function (customer, entity) {
					return ( customer.BusinessPartnerFk === entity.BusinessPartnerFk);
				}
			},
			{
				key: 'logistic-job-business-partner-contact-filter',
				serverSide: true,
				serverKey: 'business-partner-contact-filter-by-simple-business-partner',
				fn: function(entity){
					return {
						BusinessPartnerFk: entity.BusinessPartnerFk
					};
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(jobEntityRelatedFilters);

		service.navigateTo = function navigateTo(item, triggerfield) {
			if (!item || !triggerfield) return;

			var jobId = null;
			if (item && (platformObjectHelper.getValue(item, triggerfield) || item.JobFk)) {
				jobId = platformObjectHelper.getValue(item, triggerfield) || item.JobFk;
			}

			if (jobId && triggerfield !== 'Ids') {
				cloudDesktopSidebarService.filterSearchFromPKeys([jobId]);
			} else if (triggerfield === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
				const ids = item.Ids.split(',').map(id => id.trim()).filter(id => id);
				if (ids.length > 0) {
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
			}

			/* serviceContainer.service.load().then(function () {
                var job = serviceContainer.service.getItemById(jobId);//Hope it is an id ...
                serviceContainer.service.setSelected(job);
                jobId = null;
            }); */
		};

		service.takeOver = function takeOver(entity) {
			var data = serviceContainer.data;
			var dataEntity = data.getItemById(entity.Id, data);

			data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
			data.markItemAsModified(dataEntity, data);
		};


		service.registerSelectionChanged (function (e, item){
			if(item){
				service.setReadOnly(item.IsReadOnly);
			}
		});

		service.setReadOnly = function setReadOnly (isreadonly) {
			if (readOnlyFlag === isreadonly) {
				return; // Nothing has changed -> nothing to be done
			}
			readOnlyFlag = isreadonly;

			if (isreadonly) {
				platformPermissionService.restrict(
					[
						logisticJobConstantValues.uuid.container.jobTaskList,
						logisticJobConstantValues.uuid.container.plantAllocationList,
						logisticJobConstantValues.uuid.container.plantLocationList,
						logisticJobConstantValues.uuid.container.sundryServicePriceList,
						logisticJobConstantValues.uuid.container.jobDocument,
						logisticJobConstantValues.uuid.container.equipmentCatPrice,
						logisticJobConstantValues.uuid.container.materialCatPrice,
						logisticJobConstantValues.uuid.container.material,
						logisticJobConstantValues.uuid.container.materialPriceCond,
						logisticJobConstantValues.uuid.container.materialRate,
						logisticJobConstantValues.uuid.container.plantPrice,
						logisticJobConstantValues.uuid.container.remark,
						logisticJobConstantValues.uuid.container.addressRemark,
						logisticJobConstantValues.uuid.container.deliveryAddressBlob,
						logisticJobConstantValues.uuid.container.projectDocument,
						logisticJobConstantValues.uuid.container.jobTaskArticle,
						logisticJobConstantValues.uuid.container.formData,
					],
					permissions.read);
			}
			else {
				platformPermissionService.restrict(
					[
						logisticJobConstantValues.uuid.container.jobTaskList,
						logisticJobConstantValues.uuid.container.plantAllocationList,
						logisticJobConstantValues.uuid.container.plantLocationList,
						logisticJobConstantValues.uuid.container.sundryServicePriceList,
						logisticJobConstantValues.uuid.container.jobDocument,
						logisticJobConstantValues.uuid.container.equipmentCatPrice,
						logisticJobConstantValues.uuid.container.materialCatPrice,
						logisticJobConstantValues.uuid.container.material,
						logisticJobConstantValues.uuid.container.materialPriceCond,
						logisticJobConstantValues.uuid.container.materialRate,
						logisticJobConstantValues.uuid.container.plantPrice,
						logisticJobConstantValues.uuid.container.remark,
						logisticJobConstantValues.uuid.container.addressRemark,
						logisticJobConstantValues.uuid.container.deliveryAddressBlob,
						logisticJobConstantValues.uuid.container.projectDocument,
						logisticJobConstantValues.uuid.container.jobTaskArticle,
						logisticJobConstantValues.uuid.container.formData,
					]);
			}
		};

		service.registerDataModified (function (){
			var selected = service.getSelected();
			if(selected && selected.IsReadOnly !== readOnlyFlag){
				service.setReadOnly(selected.IsReadOnly);
				logisticJobReadonlyProcessorService.processItem(selected);
			}
		});

		function canCreateOrDelete() {
			var result = true;
			var selected = service.getSelected();
			if (selected && selected.IsReadOnly) {
				result = false;
			}
			return result;
		}

		return service;
	}
})(angular);
