/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectModelStakeholderUIConfig
	 * @function
	 *
	 * @description
	 * modelProjectModelStakeholderUIConfig is the data service for the UI configurations of the model stakeholder entity.
	 */
	angular.module(moduleName).factory('modelProjectModelStakeholderUIConfig',
		['_', 'platformUIStandardConfigService', 'modelProjectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',
			'basicsLookupdataLookupFilterService',

			function (_, platformUIStandardConfigService, modelProjectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, basicsLookupdataLookupFilterService) {

				const BaseService = platformUIStandardConfigService;

				function getModelStakeholderDetailLayout() {
					const filters = [{
						key: 'model-stakeholder-contact-filter',
						serverSide: true,
						serverKey: 'project-main-bizpartner-contact-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinessPartnerFk
							};
						}
					}, {
						key: 'model-stakeholder-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null
							};
						}
					}
					];
					_.each(filters, function (filter) {
						if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
							basicsLookupdataLookupFilterService.registerFilter(filter);
						}
					});
					return {
						fid: 'model.project.modelstakeholderdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'contactfk', 'stakeholderrolefk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							clerkfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Description'
									}
								}
							},
							businesspartnerfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										initValueField: 'BusinesspartnerBpName1',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
							contactfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'FamilyName'
									},
								}
							},
							contacktroletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype'),
							subsidiaryfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'model-stakeholder-subsidiary-filter',
										showClearButton: true,
										displayMember: 'AddressLine'
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-subsidiary-lookup',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'model-stakeholder-subsidiary-filter',
											displayMember: 'AddressLine'
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Subsidiary',
										displayMember: 'AddressLine'
									}
								}
							},
							stakeholderrolefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelstakeholderrole'),
						}
					};
				}

				const modelProjectModelStakeholderDetailLayout = getModelStakeholderDetailLayout();

				let attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ModelStakeholderDto',
					moduleSubModule: 'Model.Project'
				});
				if (attributeDomains) {
					attributeDomains = attributeDomains.properties;
				}

				function ModelProjectModelStakeholderUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ModelProjectModelStakeholderUIStandardService.prototype = Object.create(BaseService.prototype);
				ModelProjectModelStakeholderUIStandardService.prototype.constructor = ModelProjectModelStakeholderUIStandardService;

				return new BaseService(modelProjectModelStakeholderDetailLayout, attributeDomains, modelProjectMainTranslationService);
			}
		]);
})(angular);
