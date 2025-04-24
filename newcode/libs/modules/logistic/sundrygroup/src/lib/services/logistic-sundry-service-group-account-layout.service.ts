/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ILogisticSundryServiceGroupAccountEntity } from '@libs/logistic/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticSundryServiceGroupLookupOverloadProvider } from './logistic-sundry-service-group-lookup-overload-provider.service';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticSundryServiceGroupLookupDataService } from '@libs/logistic/shared';

@Injectable({
	providedIn: 'root',
})
export class LogisticSundryGroupAccountLayoutService{

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<ILogisticSundryServiceGroupAccountEntity>>{
		const lookupDataService = context.injector.get(LogisticSundryServiceGroupLookupDataService);
		const sundryServiceGroupLookupOverloadProvider = context.injector.get(LogisticSundryServiceGroupLookupOverloadProvider);
		await lookupDataService.loadLookupData();

		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['LedgerContextFk','ValidFrom','ValidTo','AccountTypeFk','CommentText'],
				},{
					gid: 'accounts',
					attributes: [
						'Account01Fk','NominalDimension0101','NominalDimension0102','NominalDimension0103',
						'Account02Fk','NominalDimension0201','NominalDimension0202','NominalDimension0203',
						'Account03Fk','NominalDimension0301','NominalDimension0302','NominalDimension0303',
						'Account04Fk','NominalDimension0401','NominalDimension0402','NominalDimension0403',
						'Account05Fk','NominalDimension0501','NominalDimension0502','NominalDimension0503',
						'Account06Fk','NominalDimension0601','NominalDimension0602','NominalDimension0603'
					],
				}
			],
			overloads: {
				LedgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLedgerContextLookupOverload(true),
				AccountTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideAccountTypeLookupOverload(true),
				Account01Fk: sundryServiceGroupLookupOverloadProvider.provideAccountingLookupOverload(),
				Account02Fk: sundryServiceGroupLookupOverloadProvider.provideAccountingLookupOverload(),
				Account03Fk: sundryServiceGroupLookupOverloadProvider.provideAccountingLookupOverload(),
				Account04Fk: sundryServiceGroupLookupOverloadProvider.provideAccountingLookupOverload(),
				Account05Fk: sundryServiceGroupLookupOverloadProvider.provideAccountingLookupOverload(),
				Account06Fk: sundryServiceGroupLookupOverloadProvider.provideAccountingLookupOverload(),
				NominalDimension0101: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0101'),
				NominalDimension0102: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0102'),
				NominalDimension0103: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0103'),
				NominalDimension0201: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0201'),
				NominalDimension0202: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0202'),
				NominalDimension0203: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0203'),
				NominalDimension0301: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0301'),
				NominalDimension0302: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0302'),
				NominalDimension0303: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0303'),
				NominalDimension0401: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0401'),
				NominalDimension0402: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0402'),
				NominalDimension0403: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0403'),
				NominalDimension0501: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0501'),
				NominalDimension0502: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0502'),
				NominalDimension0503: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0503'),
				NominalDimension0601: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0601'),
				NominalDimension0602: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0602'),
				NominalDimension0603: sundryServiceGroupLookupOverloadProvider.provideNominalDimensionLookupOverload('NominalDimension0603')
			},
			labels: {
				...prefixAllTranslationKeys('logistic.sundrygroup.', {
					LedgerContextFk: {key: 'ledgercontext'},
					Account01Fk: {key: 'entityAccount', params: { 'index': 1 }},
					Account02Fk: {key: 'entityAccount', params: { 'index': 2 }},
					Account03Fk: {key: 'entityAccount', params: { 'index': 3 }},
					Account04Fk: {key: 'entityAccount', params: { 'index': 4 }},
					Account05Fk: {key: 'entityAccount', params: { 'index': 5 }},
					Account06Fk: {key: 'entityAccount', params: { 'index': 6 }},
					NominalDimension0101: {key: 'entityNominalDimension0101'},
					NominalDimension0102: {key: 'entityNominalDimension0102'},
					NominalDimension0103: {key: 'entityNominalDimension0103'},
					NominalDimension0201: {key: 'entityNominalDimension0201'},
					NominalDimension0202: {key: 'entityNominalDimension0202'},
					NominalDimension0203: {key: 'entityNominalDimension0203'},
					NominalDimension0301: {key: 'entityNominalDimension0301'},
					NominalDimension0302: {key: 'entityNominalDimension0302'},
					NominalDimension0303: {key: 'entityNominalDimension0303'},
					NominalDimension0401: {key: 'entityNominalDimension0401'},
					NominalDimension0402: {key: 'entityNominalDimension0402'},
					NominalDimension0403: {key: 'entityNominalDimension0403'},
					NominalDimension0501: {key: 'entityNominalDimension0501'},
					NominalDimension0502: {key: 'entityNominalDimension0502'},
					NominalDimension0503: {key: 'entityNominalDimension0503'},
					NominalDimension0601: {key: 'entityNominalDimension0601'},
					NominalDimension0602: {key: 'entityNominalDimension0602'},
					NominalDimension0603: {key: 'entityNominalDimension0603'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ValidFrom: {key: 'entityValidFrom'},
					ValidTo: {key: 'entityValidTo'},
					CommentText: {key: 'entityComment'},
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					AccountTypeFk: {key: 'accountingtype'},
				})
			}
		};
	}
}