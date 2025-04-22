/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, Rubric } from '@libs/basics/shared';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { IChangeEntity } from '../model/entities/change-entity.interface';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';


/**
 * Project Change layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractProjectChangeLayoutService {
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

	public async generateConfig(): Promise<ILayoutConfiguration<IChangeEntity>> {
		return <ILayoutConfiguration<IChangeEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'ProjectFk',
						'RubricCategoryFk',
						'ChangeStatusFk',
						'Code',
						'Description',
						'LastDate',
						'Reference',
						'ChangeTypeFk',
						'ChangeReasonFk',
						'Remark',
						'Reason',
						'Probability',
						'ExpectedCost',
						'ExpectedRevenue',
						'InstructionDate',
						'SubmissionDate',
						'ConfirmationDate',
						'UserDefinedText01',
						'UserDefinedText02',
						'UserDefinedText03',
						'UserDefinedText04',
						'UserDefinedText05',
						'UserDefinedNumber01',
						'UserDefinedNumber02',
						'UserDefinedNumber03',
						'UserDefinedNumber04',
						'UserDefinedNumber05',
						'UserDefinedDate01',
						'UserDefinedDate02',
						'UserDefinedDate03',
						'UserDefinedDate04',
						'UserDefinedDate05',
						'SearchPattern',
						'OrdHeaderFk',
						'ContractHeaderFk',
						'FactorByReason',
						'FactorByAmount',
						'ElectronicDataExchangeNrGermanGaeb',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('project.main.', {
					LastDate: { key: 'entityLastDate', text: 'Last Date' },
					Reference: {
						key: 'entityReference',
						text: 'Reference',
					},
					ChangeTypeFk: {
						key: 'entityChangeType',
						text: 'Type',
					},
					Probability: { key: 'entityProbability', text: 'Incident Rate' },
					ExpectedCost: { key: 'entityExpectedCost', text: 'Expected Cost' },
					ExpectedRevenue: { key: 'entityExpectedRevenue', text: 'ExpectedRevenue' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ProjectFk: { key: 'entityProject', text: 'Project' },
					RubricCategoryFk: {
						key: 'entityBasRubricCategoryFk',
						text: 'Rubric Category',
					},
					ChangeStatusFk: {
						key: 'entityStatus',
						text: 'Status',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
					Remark: {
						key: 'entityRemark',
						text: 'Remark',
					},
				}),
				...prefixAllTranslationKeys('change.main.', {
					ChangeReasonFk: { key: 'changeReason', text: 'Change Reason' },
					Reason: {
						key: 'entityReason',
						text: 'Reason',
					},
					InstructionDate: { key: 'instructionDate', text: 'Instruction Date' },
					SubmissionDate: { key: 'submissionDate', text: 'Submission Date' },
					ConfirmationDate: { key: 'confirmationDate', text: 'Confirmation Date' },
					FactorByReason: { key: 'factorByReason', text: 'Factor by Reason' },
					FactorByAmount: { key: 'factorByAmount', text: 'Factor by Amount' },
					ElectronicDataExchangeNrGermanGaeb: { key: 'entityGaebNr', text: 'Gaeb Nr' },
				}),
				...prefixAllTranslationKeys('procurement.contract.projectChange.', {
					UserDefinedText01: { key: 'UserDefinedText01', text: 'Text 1' },
					UserDefinedText02: { key: 'UserDefinedText02', text: 'Text 2' },
					UserDefinedText03: { key: 'UserDefinedText03', text: 'Text 3' },
					UserDefinedText04: { key: 'UserDefinedText04', text: 'Text 4' },
					UserDefinedText05: { key: 'UserDefinedText05', text: 'Text 5' },
					UserDefinedNumber01: { key: 'UserDefinedNumber01', text: 'Number 1' },
					UserDefinedNumber02: { key: 'UserDefinedNumber02', text: 'Number 2' },
					UserDefinedNumber03: { key: 'UserDefinedNumber03', text: 'Number 3' },
					UserDefinedNumber04: { key: 'UserDefinedNumber04', text: 'Number 4' },
					UserDefinedNumber05: { key: 'UserDefinedNumber05', text: 'Number 5' },
					UserDefinedDate01: { key: 'UserDefinedDate01', text: 'Date 1' },
					UserDefinedDate02: { key: 'UserDefinedDate02', text: 'Date 2' },
					UserDefinedDate03: { key: 'UserDefinedDate03', text: 'Date 3' },
					UserDefinedDate04: { key: 'UserDefinedDate04', text: 'Date 4' },
					UserDefinedDate05: { key: 'UserDefinedDate05', text: 'Date 5' },
				}),
				...prefixAllTranslationKeys('project.main.', {
					OrdHeaderFk: { key: 'entityOrdHeaderFk', text: 'Sales Contract' },
					ContractHeaderFk: { key: 'entityConHeaderFk', text: 'Procurement Contract' },
				}),
			},
			overloads: {
				ProjectFk: {
					type: FieldType.Lookup,
					lookupOptions: this.projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							readonly: true,
						},
					}),
				},
				ContractHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(false, 'Description'),
				RubricCategoryFk: BasicsSharedLookupOverloadProvider.provideRubricCategoryByCompanyLookupOverload(true, {
					key: 'change-main-rubric-category-by-rubric-filter',
					execute() {
						return { Rubric: Rubric.ChangeOrder };
					},
				}),
				ChangeStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectChangeStatusReadonlyLookupOverload(),
				ChangeTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideChangeTypeLookupOverload(false),
				ChangeReasonFk: BasicsSharedCustomizeLookupOverloadProvider.provideChangeReasonLookupOverload(false),
				OrdHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(false, ''),
			},
		};
	}
}
