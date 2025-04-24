/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingPeriodTransactionDataService } from '../services/timekeeping-period-transaction-data.service';
import { ITimekeepingTransactionEntity } from './entities/timekeeping-transaction-entity.interface';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedBasAccountLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { TimekeepingEmployeeLookupService, TimekeepingPeriodLookupService, TimekeepingSettlementItemLookupService } from '@libs/timekeeping/shared';
import { SchedulingActivityLookupProviderService } from '@libs/scheduling/main';
import { ProcurementShareInvoiceLookupService } from '@libs/procurement/shared';
import { SalesSharedBillingLookupService } from '@libs/sales/shared';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';


export const TIMEKEEPING_PERIOD_TRANSACTION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingTransactionEntity> ({
	grid: {
		title: {key: 'timekeeping.period.transactionListTitle'},
	},
	form: {
		title: { key: 'timekeeping.period.transactionDetailTitle' },
		containerUuid: '5dbfeadb546b43bc96e46f11201fd918',
	},
	dataService: ctx => ctx.injector.get(TimekeepingPeriodTransactionDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Period', typeName: 'TimekeepingTransactionDto'},
	permissionUuid: '940ef410ba484efb97058e0dd40486c1',
	layoutConfiguration:async ctx=> {
		const activityLookupProvider = ctx.injector.get(SchedulingActivityLookupProviderService);
		return <ILayoutConfiguration<ITimekeepingTransactionEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: ['EmployeeFk','CompanyChargedFk','ControllingUnitFk','AccountFk','InvHeaderFk','BilHeaderFk','UomFk','SettlementItemFk',/*'CompanyCostHeaderFk','ProjectChangeFk',*/'ActivityFk','TransactionCase', 'PostingDate', 'PostingNarritive', 'Account', 'VoucherNumber', 'VoucherDate', 'IsSuccess', 'CompanyFk', 'NominalDimension1',
						'NominalDimension2', 'NominalDimension3', 'Amount', 'IsDebit', 'Quantity', 'ControllingUnitCode', 'ControllingUnitAssign01', 'ControllingUnitAssignDesc01', 'ControllingUnitAssign02', 'ControllingUnitAssignDesc02', 'ControllingUnitAssign03', 'ControllingUnitAssignDesc03', 'ControllingUnitAssign04',
						'ControllingUnitAssignDesc04', 'ControllingUnitAssign05', 'ControllingUnitAssignDesc05', 'ControllingUnitAssign06', 'ControllingUnitAssignDesc06', 'ControllingUnitAssign07', 'ControllingUnitAssignDesc07', 'ControllingUnitAssign08', 'ControllingUnitAssignDesc08', 'ControllingUnitAssign09', 'ControllingUnitAssignDesc09',
						'ControllingUnitAssign10', 'ControllingUnitAssignDesc10']
				},],
			overloads: {
				ControllingUnitFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ControllingSharedControllingUnitLookupService
					})
				},
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
				ActivityFk: activityLookupProvider.generateActivityLookup({
					readonly: true
				}),
				CompanyFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName'
					}),
				},
				CompanyChargedFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName'
					}),
				},
				PeriodFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingPeriodLookupService,
					})
				},
				EmployeeFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
							dataServiceToken: TimekeepingEmployeeLookupService,
							displayMember: 'Code',
							valueMember: 'Id'
						}
					)
				},
				AccountFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBasAccountLookupService
					})
				},
				InvHeaderFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementShareInvoiceLookupService,
						showDescription: true,
						descriptionMember: 'Reference',
					}),
				},
				BilHeaderFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: SalesSharedBillingLookupService
					}),
					additionalFields:[
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'basics.accountingJournals.entityBillHeaderFkDesc',
							column: true,
							singleRow: true,
						},
					],
				},
				BasCountryFk: BasicsSharedLookupOverloadProvider.provideCountryReadonlyLookupOverload(),
				SettlementItemFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingSettlementItemLookupService,
					})
				},
				TransactionCase: {readonly: true},
				PostingDate:{readonly: true},
				PostingNarritive:{readonly: true},
				Account:{readonly: true},
				VoucherNumber:{readonly: true},
				VoucherDate:{readonly: true},
				IsSuccess:{readonly: true},
				NominalDimension1:{readonly: true},
				NominalDimension2:{readonly: true},
				NominalDimension3:{readonly: true},
				Amount:{readonly: true},
				IsDebit:{readonly: true},
				Quantity:{readonly: true},
				ControllingUnitCode:{readonly: true},
				ControllingUnitAssign01:{readonly: true},
				ControllingUnitAssignDesc01:{readonly: true},
				ControllingUnitAssign02:{readonly: true},
				ControllingUnitAssignDesc02:{readonly: true},
				ControllingUnitAssign03:{readonly: true},
				ControllingUnitAssignDesc03:{readonly: true},
				ControllingUnitAssign04:{readonly: true},
				ControllingUnitAssignDesc04:{readonly: true},
				ControllingUnitAssign05:{readonly: true},
				ControllingUnitAssignDesc05:{readonly: true},
				ControllingUnitAssign06:{readonly: true},
				ControllingUnitAssignDesc06:{readonly: true},
				ControllingUnitAssign07:{readonly: true},
				ControllingUnitAssignDesc07:{readonly: true},
				ControllingUnitAssign08:{readonly: true},
				ControllingUnitAssignDesc08:{readonly: true},
				ControllingUnitAssign09:{readonly: true},
				ControllingUnitAssignDesc09:{readonly: true},
				ControllingUnitAssign10:{readonly: true},
				ControllingUnitAssignDesc10:{readonly: true}
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.common.', {
					PostingDate: {key: 'postingDate'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					VoucherNumber: {key: 'entityVoucherNumber'},
					VoucherDate: {key: 'entityVoucherDate'},
					'CompanyFk': {
						text: 'Company',
						key: 'entityCompany'
					},
					Amount: {key: 'entityAmount'},
					ControllingUnitCode: {key: 'entityControllingUnit'},
					PostingNarritive: {key: 'entityPostingNarritive'},
					ControllingUnitFk: {key: 'entityControllingUnit'},
				}),

				...prefixAllTranslationKeys('timekeeping.period.', {
					TransactionCase: {key: 'entityTransactionCase'},
					Account: {key: 'entityAccountNumber'},
					IsDebit: {key: 'entityIsDebit'},
					IsSuccess: {key: 'entityIsSuccess'},
					EmployeeFk: {key: 'entityEmployee'},
					NominalDimension1: {key: 'entityNominalDimension1'},
					NominalDimension2: {key: 'entityNominalDimension2'},
					NominalDimension3: {key: 'entityNominalDimension3'},
					Quantity: {key: 'entityQuantity'},
					ControllingUnitAssign01: {key: 'entityControllingUnitAssign01'},
					ControllingUnitAssignDesc01: {key: 'entityControllingUnitAssign01Desc'},
					ControllingUnitAssign02: {key: 'entityControllingUnitAssign02'},
					ControllingUnitAssignDesc02: {key: 'entityControllingUnitAssign02Desc'},
					ControllingUnitAssign03: {key: 'entityControllingUnitAssign03'},
					ControllingUnitAssignDesc03: {key: 'entityControllingUnitAssign03Desc'},
					ControllingUnitAssign04: {key: 'entityControllingUnitAssign04'},
					ControllingUnitAssignDesc04: {key: 'entityControllingUnitAssign04Desc'},
					ControllingUnitAssign05: {key: 'entityControllingUnitAssign05'},
					ControllingUnitAssignDesc05: {key: 'entityControllingUnitAssign05Desc'},
					ControllingUnitAssign06: {key: 'entityControllingUnitAssign06'},
					ControllingUnitAssignDesc06: {key: 'entityControllingUnitAssign06Desc'},
					ControllingUnitAssign07: {key: 'entityControllingUnitAssign07'},
					ControllingUnitAssignDesc07: {key: 'entityControllingUnitAssign07Desc'},
					ControllingUnitAssign08: {key: 'entityControllingUnitAssign08'},
					ControllingUnitAssignDesc08: {key: 'entityControllingUnitAssign08Desc'},
					ControllingUnitAssign09: {key: 'entityControllingUnitAssign09'},
					ControllingUnitAssignDesc09: {key: 'entityControllingUnitAssign09Desc'},
					ControllingUnitAssign10: {key: 'entityControllingUnitAssign10'},
					ControllingUnitAssignDesc10: {key: 'entityControllingUnitAssign10Desc'},
					ActivityFk: {key: 'entityActivity'},
					AccountFk: {key: 'entityAccount'},
					CompanyChargedFk: {key: 'entityCompanyChargedFk'},
					InvHeaderFk: {key: 'entityInvHeader'},
					BilHeaderFk: {key: 'entityBilHeader'},
					SettlementItemFk: {key: 'SettlementItemFk'},
					ProjectChangeFk: {key: 'entityChange'},
					UomFk: {key: 'UomFk'},
				})
			}
		};
	}
});