/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyTransactionDataService } from '../services/basics-company-transaction-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_TRANSACTION_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyTransactionEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listTransactionTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailTransactionTitle' },
			    containerUuid: 'd8758247b1a1461b8bf7d801bf019863',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyTransactionDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyTransactionDto'},
                permissionUuid: 'a47073dd69804cd2947d6a218433f6fb',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['Currency','PostingDate','VoucherNumber','VoucherDate','Account','OffsetAccount','PostingNarritive','Amount','AmountOc','Quantity',
							 'PesHeaderFk','InvHeaderFk','NominalDimension','PostingArea','WipHeaderFk','BilHeaderFk','NominalDimension2','NominalDimension3'],
						 },
						 {
							 gid:'Controlling Unit',attributes:['ControllingUnitCode','ControllingUnitAssign01','ControllingUnitAssign01Desc','ControllingUnitAssign02','ControllingUnitAssign02Desc',
								 'ControllingUnitAssign03','ControllingUnitAssign03Desc','ControllingUnitAssign04','ControllingUnitAssign04Desc','ControllingUnitAssign05','ControllingUnitAssign05Desc','ControllingUnitAssign06','ControllingUnitAssign06Desc'
								 ,'ControllingUnitAssign07','ControllingUnitAssign07Desc','ControllingUnitAssign08','ControllingUnitAssign08Desc','ControllingUnitAssign09','ControllingUnitAssign09Desc'
								 ,'ControllingUnitAssign10','ControllingUnitAssign10Desc'],
						 },
						 {
							 gid:'Offset Cont Unit',attributes:['OffsetContUnitAssign01','OffsetContUnitAssign01Desc','OffsetContUnitAssign02','OffsetContUnitAssign02Desc',
								 'OffsetContUnitAssign03','OffsetContUnitAssign03Desc','OffsetContUnitAssign04','OffsetContUnitAssign04Desc','OffsetContUnitAssign05','OffsetContUnitAssign05Desc','OffsetContUnitAssign06','OffsetContUnitAssign06Desc'
								 ,'OffsetContUnitAssign07','OffsetContUnitAssign07Desc','OffsetContUnitAssign08','OffsetContUnitAssign08Desc','OffsetContUnitAssign09','OffsetContUnitAssign09Desc'
								 ,'OffsetContUnitAssign10','OffsetContUnitAssign10Desc'],
						 },


					 ],
					 overloads: {
						 //To DO PesHeaderFk,InvHeaderFk,WipHeaderFk,BilHeaderFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 Currency: {key: 'entityCurrency'},
							 PostingDate: {key: 'entityPostingDate'},
							 VoucherNumber: {key: 'entityVoucherNumber'},
							 VoucherDate: {key: 'entityVoucherDate'},
							 OffsetAccount: {key: 'entityOffsetAccount'},
							 PostingNarritive: {key: 'entityPostingNarritive'},
							 Amount: {key: 'entityAmount'},
							 AmountOc: {key: 'entityAmountOc'},
							 Quantity: {key: 'entityQuantity'},
							 ControllingUnitCode: {key: 'entityControllingUnitCode'},
							 ControllingUnitAssign01: {key: 'entityControllingUnitAssign01'},
							 ControllingUnitAssign01Desc: {key: 'entityControllingUnitAssign01Desc'},
							 ControllingUnitAssign02: {key: 'entityControllingUnitAssign02'},
							 ControllingUnitAssign02Desc: {key: 'entityControllingUnitAssign02Desc'},
							 ControllingUnitAssign03: {key: 'entityControllingUnitAssign03'},
							 ControllingUnitAssign03Desc: {key: 'entityControllingUnitAssign03Desc'},
							 ControllingUnitAssign04: {key: 'entityControllingUnitAssign04'},
							 ControllingUnitAssign04Desc: {key: 'entityControllingUnitAssign04Desc'},
							 ControllingUnitAssign05: {key: 'entityControllingUnitAssign05'},
							 ControllingUnitAssign05Desc: {key: 'entityControllingUnitAssign05Desc'},
							 ControllingUnitAssign06: {key: 'entityControllingUnitAssign06'},
							 ControllingUnitAssign06Desc: {key: 'entityControllingUnitAssign06Desc'},
							 ControllingUnitAssign07: {key: 'entityControllingUnitAssign07'},
							 ControllingUnitAssign07Desc: {key: 'entityControllingUnitAssign07Desc'},
							 ControllingUnitAssign08: {key: 'entityControllingUnitAssign08'},
							 ControllingUnitAssign08Desc: {key: 'entityControllingUnitAssign08Desc'},
							 ControllingUnitAssign09: {key: 'entityControllingUnitAssign09'},
							 ControllingUnitAssign09Desc: {key: 'entityControllingUnitAssign09Desc'},
							 ControllingUnitAssign10: {key: 'entityControllingUnitAssign10'},
							 ControllingUnitAssign10Desc: {key: 'entityControllingUnitAssign10Desc'},
							 OffsetContUnitAssign01: {key: 'entityOffsetContUnitAssign01'},
							 OffsetContUnitAssign01Desc: {key: 'entityOffsetContUnitAssign01Desc'},
							 OffsetContUnitAssign02: {key: 'entityOffsetContUnitAssign02'},
							 OffsetContUnitAssign02Desc: {key: 'entityOffsetContUnitAssign02Desc'},
							 OffsetContUnitAssign03: {key: 'entityOffsetContUnitAssign03'},
							 OffsetContUnitAssign03Desc: {key: 'entityOffsetContUnitAssign03Desc'},
							 OffsetContUnitAssign04: {key: 'entityOffsetContUnitAssign04'},
							 OffsetContUnitAssign04Desc: {key: 'entityOffsetContUnitAssign04Desc'},
							 OffsetContUnitAssign05: {key: 'entityOffsetContUnitAssign05'},
							 OffsetContUnitAssign05Desc: {key: 'entityOffsetContUnitAssign05Desc'},
							 OffsetContUnitAssign06: {key: 'entityOffsetContUnitAssign06'},
							 OffsetContUnitAssign06Desc: {key: 'entityOffsetContUnitAssign06Desc'},
							 OffsetContUnitAssign07: {key: 'entityOffsetContUnitAssign07'},
							 OffsetContUnitAssign07Desc: {key: 'entityOffsetContUnitAssign07Desc'},
							 OffsetContUnitAssign08: {key: 'entityOffsetContUnitAssign08'},
							 OffsetContUnitAssign08Desc: {key: 'entityOffsetContUnitAssign08Desc'},
							 OffsetContUnitAssign09: {key: 'entityOffsetContUnitAssign09'},
							 OffsetContUnitAssign09Desc: {key: 'entityOffsetContUnitAssign09Desc'},
							 OffsetContUnitAssign10: {key: 'entityOffsetContUnitAssign10'},
							 OffsetContUnitAssign10Desc: {key: 'entityOffsetContUnitAssign10Desc'},
						}),
						 ...prefixAllTranslationKeys('basics.company.', {
							 Account: {key: 'entityAccount'},
							 PesHeaderFk: {key: 'entityPesHeaderFk'},
							 InvHeaderFk: {key: 'entityInvHeaderFk'},
							 NominalDimension: {key: 'entityNominalDimension'},
							 PostingArea: {key: 'entityPostingArea'},
							 WipHeaderFk: {key: 'entityWipHeaderFk'},
							 BilHeaderFk: {key: 'entityBillNo'},
							 NominalDimension2: {key: 'entityNominalDimension2'},
							 NominalDimension3: {key: 'entityNominalDimension3'},
						}),
					 }
				 }

            });