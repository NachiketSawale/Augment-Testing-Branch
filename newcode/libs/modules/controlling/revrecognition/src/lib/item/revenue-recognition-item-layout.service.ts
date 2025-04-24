/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IPrrItemEntity } from '../model/entities/prr-item-entity.interface';

/**
 * Controlling Revenue Recognition Item layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemLayoutService {

	/**
	 * Generate layout config
	 */

	public async generateLayout(): Promise<ILayoutConfiguration<IPrrItemEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Code',
						'AmountContract',
						'AmountContractCo',
						'AmountContractTotal',
						'AmountPervious',
						'AmountInc',
						'AmountTotal',
						'Percentage',
						'HeaderDate',
						'RelevantDate',
						'PrrAccrualType',
						'PostingNarrative',
						'BusinessPartner',
						'Remark'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Code': {
						text: 'Code',
						key: 'entityCode'
					},
					'Remark': {
						text: 'Remark',
						key: 'entityRemark'
					}
				}),
				...prefixAllTranslationKeys('controlling.revrecognition.', {
					'AmountContract': {
						text: 'Contract Value',
						key: 'entityAmountContract'
					},
					'AmountContractCo': {
						text: 'Change Order Value',
						key: 'entityAmountContractCo'
					},
					'AmountContractTotal': {
						text: 'Total Contract Value',
						key: 'entityAmountContractTotal'
					},
					'AmountPervious': {
						text: 'Previous Period',
						key: 'entityAmountPerviousPeriod'
					},
					'AmountInc': {
						text: 'Current Period',
						key: 'entityAmountIncPeriod'
					},
					'AmountTotal': {
						text: 'Total',
						key: 'entityTotal'
					},
					'Percentage': {
						text: '%',
						key: 'entityPercentage'
					},
					'HeaderDate': {
						text: 'Header Date',
						key: 'entityHeaderDate'
					},
					'RelevantDate': {
						text: 'Relevant Date',
						key: 'entityRelevantDate'
					},
					'PrrAccrualType': {
						text: 'Accrual Type',
						key: 'PrrAccrualType'
					},
					'PostingNarrative': {
						text: 'Posting Narrative',
						key: 'PostingNarrative'
					},
					'BusinessPartner': {
						text: 'Business Partner',
						key: 'entityBusinessPartner'
					}
				}),
			},
			overloads: {
				PrrAccrualType: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						showDescription: true,
					})
				},
			}
		};
	}
}