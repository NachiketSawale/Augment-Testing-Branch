/**
 * Created by lvy on 8/2/2019.
 */
(function () {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('procurementCommonPostconHistoryLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			'fid': 'procurement.common.history.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{'gid': 'baseGroup', 'attributes': ['prccommunicationchannelfk']},
				{'gid': 'entityHistory', isHistory: true}],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					'baseGroup': {
						location: cloudCommonModule,
						'identifier': 'entityProperties',
						'initial': 'Basic Data'
					},
					'PrjDocumentFk': {
						location: modName,
						'identifier': 'entityPrjDocument',
						'initial': 'Document'
					},
					'PrcCommunicationChannelFk': {
						location: modName,
						'identifier': 'entityPrcCommunicationChannel',
						'initial': 'Communication Channel'
					}
				}
			},
			'overloads': {
				'prccommunicationchannelfk': {
					detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.lookup.prccommunicationchannel', 'Description', null, false, {}),
					grid: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
						lookupName: 'basics.lookup.prccommunicationchannel',
						att2BDisplayed: 'Description',
						readOnly: true,
						options: {}
					}),
					'readonly': true
				}
			},
			'addition': {
				grid: [
					{
						field: 'ProjectNo',
						name: 'Project No.',
						name$tr$: 'documents.project.entityPrjProject',
						width: 125
					},
					{
						field: 'ProjectName',
						name: 'Project Name 1',
						name$tr$: 'documents.project.project_name1',
						width: 125
					},
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
						lookupName: 'documents.project.documenttype',
						att2BDisplayed:  'Description',
						readOnly: true,
						confObj: {
							id: 'PrjDocumentTypeFk',
							field: 'PrjDocumentTypeFk',
							name: 'Project Document Type',
							name$tr$: 'documents.project.entityPrjDocumentType',
							width: 125
						}
					}),
					{
						field: 'BusinessPartnerName1',
						name: 'Business Partner',
						name$tr$: 'procurement.rfq.BusinessPartner',
						width: 125
					},
					{
						field: 'OriginFileName',
						name: 'Origin File Name',
						name$tr$: 'procurement.rfq.originFileName',
						width: 125
					}],
				detail: [
					{
						rid: 'prjprojectfk',
						gid: 'baseGroup',
						label: 'Project No.',
						label$tr$: 'documents.project.entityPrjProject',
						type: 'directive',
						model: 'PrjProjectFk',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'procurement-project-lookup-dialog',
							descriptionMember: 'ProjectName'
						},
						readonly: true
					},
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('documents.project.documenttype', 'Description', {
						rid: 'prjDocumentTypeFk',
						gid: 'baseGroup',
						model: 'PrjDocumentTypeFk',
						label: 'Project Document Type',
						label$tr$: 'documents.project.entityPrjDocumentType',
						type: 'lookup',
						readonly: true
					}),
					{
						afterId: 'documentTypeFk',
						rid: 'businessPartnerName1',
						gid: 'baseGroup',
						model: 'BusinessPartnerName1',
						label: 'Business Partner',
						label$tr$: 'procurement.rfq.BusinessPartner',
						type: 'description',
						readonly: true
					},
					{
						afterId: 'businessPartnerName1',
						rid: 'originFileName',
						gid: 'baseGroup',
						model: 'OriginFileName',
						label: 'Origin File Name',
						label$tr$: 'procurement.rfq.originFileName',
						type: 'text',
						readonly: true
					}
				]
			}
		};

	}]);

	angular.module(modName).factory('procurementCommonPostconHistoryUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonPostconHistoryLayout', 'platformSchemaService','platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService,platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcPostconHistoryDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;


				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service,layout.addition, domainSchema);

				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};


				return service;
			}
		]);
})();