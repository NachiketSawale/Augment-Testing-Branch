
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseTemplateDataService', TemplateDataService);

	TemplateDataService.$inject = ['$http','platformDataServiceFactory',
		'productionplanningProcessConfigurationProcessTemplateDataService',
		'ppsProcessConfigurationPhaseTemplateProcessor',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataSimpleLookupService'];

	function TemplateDataService($http, platformDataServiceFactory,
		processTemplateDataService,
		ppsProcessConfigurationPhaseTemplateProcessor,
		basicsCommonMandatoryProcessor,
		basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataSimpleLookupService) {

		var container;
		var processTemplates = [];
		var serviceOptions = {
			flatNodeItem: {
				module: moduleName,
				serviceName: 'ppsProcessConfigurationPhaseTemplateDataService',
				entityNameTranslationID: 'productionplanning.processconfiguration.entityPhaseTemplate',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/phasetemplate/',
					endRead: 'listbyprocesstemplate'
				},
				entityRole: {
					node: {
						itemName: 'PhaseTemplate',
						parentService: processTemplateDataService,
						parentFilter: 'ProcessTemplateId',
						useIdentification: true
					}
				},
				dataProcessor: [ppsProcessConfigurationPhaseTemplateProcessor],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var selected = processTemplateDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
				}
			}
		};

		/* jshint -W003 */
		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PhaseTemplateDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration',
			validationService: 'ppsProcessConfigurationPhaseTemplateValidationService',
			// mustValidateFields: ['PhaseTypeFk', 'SequenceOrder', 'Duration', 'SuccessorLeadTime', 'PsdRelationkindFk', 'SuccessorMinSlackTime', 'ExecutionLimit']
		});

		container.service.handleFieldChanged = function (entity, field) {
			if(field === 'IsPlaceholder'){
				ppsProcessConfigurationPhaseTemplateProcessor.setColumnsReadOnly(entity, ['ExecutionLimit'], !entity.IsPlaceholder);
				ppsProcessConfigurationPhaseTemplateProcessor.setColumnsReadOnly(entity, ['ProcessTemplateDefFk'], !entity.IsPlaceholder);
				container.service.gridRefresh();
			}
			container.service.markItemAsModified(entity);
		};

		var filters = [
			{
				key: 'pps-phase-template-process-filter',
				fn: function (entity) {
					var types = basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsprocesstype');
					types = _.filter(types, function (type) {
						return type.IsPlaceHolder;
					});
					return !!_.find(types, {Id : entity.ProcessTypeFk});
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		container.service.unRegisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		container.service.initprocessType = function () {
			$http.post(globals.webApiBaseUrl + 'basics/customize/ppsprocesstype/list').then(function (response) {
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsprocesstype', response.data);
			});
		};

		container.service.initprocessType();

		return container.service;
	}
})(angular);
