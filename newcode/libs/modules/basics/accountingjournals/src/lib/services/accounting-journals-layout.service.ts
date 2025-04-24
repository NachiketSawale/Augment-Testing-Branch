/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IAccountingJournalsEntity } from '../model/entities/accounting-journals-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ControllingCommonCompanyYearLookupService } from '@libs/controlling/common';
import { BasicsCompanyPeriodLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Accounting Journals layout service
 */
@Injectable({
	providedIn: 'root',
})
export class AccountingJournalsLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IAccountingJournalsEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['CompanyYearFk','TransactionTypeFk', 'TransactionTypeAbbreviation', 'Description', 'PostingDate', 'CommentText', 'ReturnValue', 'IsSuccess', 'CompanyTransheaderStatusFk','CompanyPeriodFk']
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.accountingJournals.', {
					CompanyYearFk: { key: 'entityTradingYear', text: 'Trading Year' },
					CompanyPeriodFk: { key: 'entityTradingPeriod', text: 'Trading Period' },
					TransactionTypeAbbreviation: { key: 'entityTransactionTypeAbbreviation', text: 'Transaction Type Abbreviation' },
					Description: { key: 'entityDescription', text: 'Description' },
					PostingDate: { key: 'entityPostingDate', text: 'Posting Date' },
					CommentText: { key: 'entityCommentText', text: 'Comment Text' },
					ReturnValue: { key: 'entityReturnValue', text: 'Return Value' },
					IsSuccess: { key: 'entityIsSuccess', text: 'Is Success' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					TransactionTypeFk: { key: 'entityTransactionTypeFk', text: 'Transaction Type' },
				}),
				...prefixAllTranslationKeys('basics.company.', {
					CompanyTransheaderStatusFk: { key: 'entityTransactionStatusFk', text: 'Transaction Status' },
				}),
			},
			overloads: {
				TransactionTypeAbbreviation: { readonly: true },
				ReturnValue: { readonly: true },
				IsSuccess: { readonly: true },
				CompanyYearFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ControllingCommonCompanyYearLookupService,
					}),
				},
				TransactionTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideTransactionTypeLookupOverload(true),
				CompanyTransheaderStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideCompanyTransheaderStatusLookupOverload(true),
				CompanyPeriodFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyPeriodLookupService
					}),
					additionalFields:[
						{
							displayMember: 'StartDate',
							label: 'basics.accountingJournals.entityTradingPeriodStartDate',
							column: true,
							row: true,
						},
						{
							displayMember: 'EndDate',
							label: 'basics.accountingJournals.entityTradingPeriodEndDate',
							column: true,
							row: true,
						},
					],
				}
			}
		};
	}
}
