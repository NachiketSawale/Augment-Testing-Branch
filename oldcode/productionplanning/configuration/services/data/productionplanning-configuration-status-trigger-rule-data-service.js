(angular => {
	'use strict';
	/* global globals */

	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsStatusInheritedTriggerRuleDataService', ppsStatusInheritedTriggerRuleDataService);

	ppsStatusInheritedTriggerRuleDataService.$inject = ['platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService',
		'ppsStatusTriggerRuleProcessor'];

	function ppsStatusInheritedTriggerRuleDataService(platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		basicsLookupdataLookupFilterService,
		ppsStatusTriggerRuleProcessor) {
		let selectedTrigger = null;

		const serviceOptions = {
			flatRootItem: {
				module: moduleName + '.statusinheritedtriggering',
				serviceName: 'ppsStatusInheritedTriggerRuleDataService',
				entityNameTranslationID: 'productionplanning.configuration.entityPpsStatusInheritedTriggering',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/ppsstatustriggerrule/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'PpsStatusTriggerRule',
						moduleName: 'productionplanning.configuration.entityPpsStatusInheritedTriggering',
					}
				},
				dataProcessor: [ppsStatusTriggerRuleProcessor],
				presenter: {
					list: {
						initCreationData: (creationData) => {
							creationData.PKey1 = selectedTrigger.id;
						},
						handleCreateSucceeded: (newData) => {
							newData.Sorting = getNextSortingNum();
							newData.SourceEntityFk = selectedTrigger.source.entityId;
							newData.TargetEntityFk = selectedTrigger.entityId;

							function getNextSortingNum() {
								const list = service.getList().map(i => i.Sorting);
								if (list.length === 0) {
									return 1;
								} else {
									return Math.max(...list) + 1;
								}
							}
						}
					}
				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: () => {
						// only leaf node can create records
						return selectedTrigger !== null && selectedTrigger.hasSource();
					},
				},
				useItemFilter: true,
			}
		};

		const container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsStatusTriggerRuleDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'ppsStatusTriggerRuleValidationService'
		});

		const originDoPrepareDeleteFn = container.data.doPrepareDelete;
		container.data.doPrepareDelete = (deleteParams, data) => {
			originDoPrepareDeleteFn(deleteParams, data);
			ppsStatusTriggerRuleProcessor.revertProcessItem(deleteParams.entities);
		};

		const service = container.service;
		service.enableItemFilter(true);

		service.doPrepareUpdateCall = function (updateData) {
			if (!updateData || updateData.EntitiesCount === 0 || updateData.PpsStatusTriggerRule.length === 0) {
				return;
			}

			ppsStatusTriggerRuleProcessor.revertProcessItem(updateData.PpsStatusTriggerRule);
		};

		service.setSelectedTrigger = function (trigger) {
			if (selectedTrigger === trigger) {
				return;
			}

			service.deselect();

			selectedTrigger = trigger;
			if (!selectedTrigger) {
				selectedTrigger = null;
				service.setItemFilter(() => false);
				return;
			}

			const triggerIds = [];
			if (!selectedTrigger.hasSource()) {
				triggerIds.push(...(selectedTrigger.getTargetIds()));
			} else {
				triggerIds.push(selectedTrigger.id);
			}

			service.setItemFilter(item => {
				return triggerIds.includes(item.PpsEntityStatusTriggerFk);
			});
		};

		const filters = [{
			key: 'source-status-filter',
			fn: function(item, selectedItem) {
				// do not show status if it has been selected
				const selectedStatus = selectedItem.PossibleSourceStatus.concat(selectedItem.RequiredSourceStatus);
				return selectedStatus.filter(i => i === item.Id).length === 0;
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		return service;
	}
})(angular);