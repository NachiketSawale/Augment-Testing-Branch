/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedBidTypeLookupService, BasicsSharedClerkLookupService, BasicsSharedProcurementConfigurationLookupService, BasicsSharedProcurementStructureLookupService, BasicsSharedRubricLookupService } from '@libs/basics/shared';
import { IEstMainCreateBidBasic, IEstMainCreateBidContext } from '../create-bid-context.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { BusinessPartnerLookupService, BusinesspartnerSharedCustomerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainBasicSettingService {
	private readonly translateService = inject(PlatformTranslateService);

	// TODO: after sale.common and sale.bid are created, append translation of all labels
	private basicSettingForm: IFormConfig<IEstMainCreateBidContext> = {
		formId: 'basicSettingForm',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			}
		],
		rows: [
			{
				id: 'updateModel',
				label: '',
				type: FieldType.Radio,
				model: 'UpdateModel',
				sortOrder: 1,
				itemsSource: {
					items: [
						{
							id: 1,
							displayName:  { text: 'Create Bid', key: 'estimate.main.bidCreationWizardCreateBid'}
						},
						{
							id: 2,
							displayName:  { text: 'Update Bid', key: 'estimate.main.bidCreationWizardUpdateBid'}
						}
					]
				}
			},
			{
				id: 'type',
				label: {key: 'Type', text: 'Type'},
				type: FieldType.Lookup,
				model: 'TypeFk',
				sortOrder: 2,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedBidTypeLookupService,
					showDialog: false
				})
			},
			{
				id: 'ConfigurationFk',
				label: {key: 'Configuration', text: 'Configuration'},
				type: FieldType.Lookup,
				model: 'ConfigurationFk',
				sortOrder: 3,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					showDialog: false
				})
			},
			{
				id: 'RubricCategoryFk',
				label: {key: 'project.main.entityRubric', text: 'Rubric Category'},
				type: FieldType.Lookup,
				model: 'RubricCategoryFk',
				sortOrder: 4,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricLookupService,
					showDialog: false,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			{
				id: 'code',
				label: {key: 'cloud.common.entityCode', text: 'Code'},
				type: FieldType.Code,
				model: 'Code',
				sortOrder: 5
			},
			{
				id: 'Description',
				label: {key: 'cloud.common.entityDescription', text: 'Description'},
				type: FieldType.Description,
				model: 'Description',
				sortOrder: 6
			},
			{
				id: 'ResponsibleCompanyFk',
				label: {key: 'Company Responsible', text: 'Company Responsible'},
				type: FieldType.Integer,
				model: 'ResponsibleCompanyFk',
				sortOrder: 7,
				// TODO:  company lookup
				// lookupOptions: createLookup({
				// 	dataServiceToken: BasicsSharedBidTypeLookupService,
				// 	showDialog: false
				// })
			},
			{
				id: 'clerk',
				label: {key: 'basics.clerk.entityClerk', text: 'Clerk'},
				type: FieldType.Lookup,
				model: 'ClerkFk',
				sortOrder: 8,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showDialog: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			{
				id: 'ProjectFk',
				label: {key: 'cloud.common.entityProjectName', text: 'Project'},
				type: FieldType.Lookup,
				model: 'ProjectFk',
				sortOrder: 9,
				lookupOptions:  createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
					showDialog: true
				})
			},
			{
				id: 'ContractTypeFk',
				label: {key: 'Contract Type', text: 'Contract Type'},
				type: FieldType.Integer,
				model: 'ContractTypeFk',
				sortOrder: 10,
				// TODO:  Contract Type lookup
				// lookupOptions:  createLookup({
				// 	dataServiceToken: ProjectSharedLookupService,
				// 	showDialog: true
				// })
			},
			{
				id: 'BusinesspartnerFk',
				label: {key: 'cloud.common.entityBusinessPartner', text: 'Business Partner'},
				model: 'BusinesspartnerFk',
				sortOrder: 11,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					showDialog: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			{
				id: 'SubsidiaryFk',
				label: {key: 'cloud.common.entitySubsidiary', text: 'Branch'},
				model: 'SubsidiaryFk',
				sortOrder: 12,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					showDialog: false,
				})
			},
			{
				id: 'CustomerFk',
				label: {key: 'Customer', text: 'Customer'},
				model: 'CustomerFk',
				sortOrder: 13,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedCustomerLookupService,
					showDialog: true,
					showDescription: true,
					descriptionMember: 'BusinessPartnerName1'
				})
			},
			{
				id: 'BidHeaderFk',
				label: {key: 'Main Bid', text: 'Main Bid'},
				model: 'BidHeaderFk',
				sortOrder: 14,
				visible: false,
				type: FieldType.Integer,
				// TODO:  main bid lookup
				// lookupOptions:  createLookup({
				// 	dataServiceToken: ProjectSharedLookupService,
				// 	showDialog: true
				// })
			},
			{
				id: 'PrcStructureFk',
				label: {key: 'basics.common.entityPrcStructureFk', text: 'Procurement Structure'},
				model: 'PrcStructureFk',
				sortOrder: 15,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementStructureLookupService,
					showDialog: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated'
				})
			},
			{
				id: 'PrjChangeFk',
				label: {key: 'Project Change', text: 'Project Change'},
				model: 'PrjChangeFk',
				sortOrder: 16,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareProjectChangeLookupService,
					showDialog: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			}
		]
	};

	public getBasicSetting(){
		return new FormStep('basicSettingStep', this.translateService.instant('estimate.main.bidCreationWizard.basic').text, this.basicSettingForm, 'BasicSetting');
	}

	public getEmptySetting(){
		return {
			UpdateModel: 1,
			TypeFk: 0,
			ConfigurationFk: 0,
			RubricCategoryFk: 0,
			Code: '',
			Description: '',
			ResponsibleCompanyFk: 0,
			ClerkFk: 0,
			ProjectFk: 0,
			ContractTypeFk: 0,
			BusinesspartnerFk: 0,
			SubsidiaryFk: 0
		};
	}

	public loadDefaultSetting(entity: IEstMainCreateBidBasic){

	}
}