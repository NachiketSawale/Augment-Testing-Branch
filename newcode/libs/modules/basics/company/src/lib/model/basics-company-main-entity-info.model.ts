/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from '../services/basics-company-main-data.service';


 export const BASICS_COMPANY_MAIN_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listCompanyTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailCompanyTitle' },
			    containerUuid: '44c2c0adb0c9408fb873b8c395aa5e08',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyMainDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyDto'},
                permissionUuid: '50593FEEA9FE4280B36F72E27C8DFDA1',
					 layoutConfiguration: {
						 groups: [
							 { gid: 'Address', attributes: ['Code','LoginAllowed','ClerkFk','CompanyTypeFk','CompanyName','CompanyName2','CompanyName3','CountryFk',
									 'AddressFk','TelephoneNumberFk','TelephoneTelefaxFk','Email','Internet','CurrencyFk','LanguageFk','Profitcenter','DunsNo',
									 'ExternalCode','IsActive']
							 },
							 { gid:'Standard Values', attributes:['BillingSchemaFk','TaxCodeFk','PaymentTermPaFk','PaymentTermFiFk','CalendarFk',
									 'Signatory','CrefoNo','VatNo','TaxNo','BusinessPartnerFk']
							 },
							 { gid:'Master Data Pool', attributes:['ContextFk','SchedulingContextFk','HsqContextFk','LineItemContextFk','LedgerContextFk',
									 'SubledgerContextFk','ModuleContextFk','TextModuleContextFk','ResourceContextFk','EquipmentContextFk','DefectContextFk',
									 'TimesheetContextFk','LogisticContextFk','ProjectContextFk','PriceConditionFk','EquipmentDivisionFk','IsRibArchive','IsCalculateOverGross']
							 },
							 { gid:'User-Defined Texts', attributes:['UserDefined1','UserDefined2','UserDefined3','UserDefined4','UserDefined5']
							 }

						 ],
						 overloads:{
							 ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
							 CompanyTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideCompanyTypeLookupOverload(true),
							 ContextFk:BasicsSharedCustomizeLookupOverloadProvider.provideModuleContextLookupOverload(true),
							 LanguageFk:BasicsSharedCustomizeLookupOverloadProvider.provideUserInterfaceLanguageLookupOverload(true),
							 //CurrencyFk: {},ContextFk:{}, PriceConditionFk:{} TO DO
							 AddressFk: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
							 TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
							 TelephoneTelefaxFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
							 CountryFk: BasicsSharedLookupOverloadProvider.provideCountryLookupOverload(true),
							 BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
							 TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
							 PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
							 PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
							 SchedulingContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideScheduleContextLookupOverload(true),
							 HsqContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideHsqeContextLookupOverload(true),
							 LineItemContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLineItemContextLookupOverload(true),
							 LedgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLedgerContextLookupOverload(true),
							 SubledgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideSubledgerContextLookupOverload(true),
							 ModuleContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideModuleContextLookupOverload(true),
							 TextModuleContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideTextModuleContextLookupOverload(true),
							 ResourceContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceContextLookupOverload(true),
							 EquipmentContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideEquipmentContextLookupOverload(true),
							 DefectContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideDefectContextLookupOverload(true),
							 TimesheetContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimeSheetContextLookupOverload(true),
							 LogisticContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLogisticsContextLookupOverload(true),
							 ProjectContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectContextLookupOverload(true),
							 EquipmentDivisionFk: BasicsSharedCustomizeLookupOverloadProvider.provideEquipmentDivisionLookupOverload(true),

						 },
						 labels: {
							 ...prefixAllTranslationKeys('cloud.common.', {
								 BusinessPartnerFk: {key: 'businessPartner'}
							}),
							 ...prefixAllTranslationKeys('basics.company.', {
								 Code: {key: 'entityCode'},
								 LoginAllowed: {key: 'entityLoginAllowed'},
								 ClerkFk: {key: 'entityClerkFk'},
								 CompanyTypeFk: {key: 'entityCompanyTypeFk'},
								 CompanyName: {key: 'entityCompanyName'},
								 CompanyName2: {key: 'entityCompanyName2'},
								 CompanyName3: {key: 'entityCompanyName3'},
								 CountryFk: {key: 'entityCountry'},
								 AddressFk: {key: 'entityAddress'},
								 TelephoneNumberFk: {key: 'entityTelephoneNumberFk'},
								 TelephoneTelefaxFk: {key: 'entityFaxNumber'},
								 Email: {key: 'entityEmail'},
								 Internet: {key: 'entityInternet'},
								 CurrencyFk: {key: 'entityCurrencyFk'},
								 LanguageFk: {key: 'entityLanguageFk'},
								 Profitcenter: {key: 'entityProfitcenter'},
								 DunsNo: {key: 'dunsNo'},
								 ExternalCode: {key: 'externalCode'},
								 IsActive: {key: 'entityIsActive'},
								 BillingSchemaFk: {key: 'entitymdcBillingSchemaFk'},
								 TaxCodeFk: {key: 'entityTaxCodeFk'},
								 PaymentTermPaFk: {key: 'entityPaymentTermPaFk'},
								 PaymentTermFiFk: {key: 'entityPaymentTermFiFk'},
								 CalendarFk: {key: 'entityCalCalendarFk'},
								 Signatory: {key: 'entitySignatory'},
								 CrefoNo: {key: 'entityCrefoNo'},
								 VatNo: {key: 'entityVatNo'},
								 ContextFk: {key: 'entityContextFk'},
								 HsqContextFk: {key: 'entityHsqContextFk'},
								 LineItemContextFk: {key: 'entityLineItemContextFk'},
								 LedgerContextFk: {key: 'entityMdcLedgerContextFk'},
								 SubledgerContextFk: {key: 'entityBpdSubledgerContextFk'},
								 SchedulingContextFk: {key: 'entitySchedulingContextFk'},
								 ModuleContextFk: {key: 'entityModuleContextFk'},
								 TextModuleContextFk: {key: 'entityTextModuleContextFk'},
								 ResourceContextFk: {key: 'entityResourceContextFk'},
								 DefectContextFk: {key: 'entityDefectContextFk'},
								 TimesheetContextFk: {key: 'entityTimesheetContextFk'},
								 EquipmentContextFk: {key: 'entityEquipmentContextFk'},
								 LogisticContextFk: {key: 'entityLogisticContextFk'},
								 ProjectContextFk: {key: 'entityProjectContextFk'},
								 PriceConditionFk: {key: 'entityPriceConditionFk'},
								 EquipmentDivisionFk: {key: 'equipmentDivision'},
								 IsRibArchive: {key: 'entityIsRibArchive'},
								 IsCalculateOverGross: {key: 'entityIsCalculateOverGross'},
							})

						 }
					 }

            });