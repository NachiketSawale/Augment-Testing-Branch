/*
 * Copyright(c) RIB Software GmbH
 */
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import {  prefixAllTranslationKeys } from '@libs/platform/common';
import {IPrcWarrantyEntity} from '../model/entities';
import { BasicsSharedWarrantyObligationLookupService, BasicsSharedWarrantySecurityLookupService} from '@libs/basics/shared';
/**
 * Common procurement warranty layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonWarrantyLayoutService {

	public async generateLayout<T extends IPrcWarrantyEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['BasWarrantysecurityFk', 'BasWarrantyobligationFk', 'Description', 'HandoverDate', 'DurationMonths', 'WarrantyEnddate', 'CommentText', 'UserDefinedText1', 'UserDefinedText2', 'UserDefinedText3', 'UserDefinedText4', 'UserDefinedText5', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5', 'UserDefinedNumber1', 'UserDefinedNumber2', 'UserDefinedNumber3', 'UserDefinedNumber4', 'UserDefinedNumber5']
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					BasWarrantysecurityFk: {text: 'Warranty Security', key: 'warranty.basWarrantySecurityFk'},
					BasWarrantyobligationFk: {text: 'Warranty Obligation', key: 'warranty.basWarrantyObligationFk'},
					Description: {text: 'Description', key: 'warranty.description'},
					HandoverDate: {text: 'Hand Over Date', key: 'warranty.handOverDate'},
					DurationMonths: {text: 'Duration Months', key: 'warranty.durationMonths'},
					WarrantyEnddate: {text: 'Warranty End Date', key: 'warranty.warrantyEndDate'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {text: 'Comment', key: 'entityCommentText'},
					UserDefinedText1: {text: 'User Defined Text 1', key: 'entityUserDefined', params: {'p_0': 'Text 1'}},
					UserDefinedText2: {text: 'User Defined Text 2', key: 'entityUserDefined', params: {'p_0': 'Text 2'}},
					UserDefinedText3: {text: 'User Defined Text 3', key: 'entityUserDefined', params: {'p_0': 'Text 3'}},
					UserDefinedText4: {text: 'User Defined Text 4', key: 'entityUserDefined', params: {'p_0': 'Text 4'}},
					UserDefinedText5: {text: 'User Defined Text 5', key: 'entityUserDefined', params: {'p_0': 'Text 5'}},
					UserDefinedDate1: {text: 'User Defined Date 1', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate2: {text: 'User Defined Date 2', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate3: {text: 'User Defined Date 3', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate4: {text: 'User Defined Date 4', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate5: {text: 'User Defined Date 5', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedNumber1: {text: 'User Defined 1', key: 'entityUserDefined', params: {'p_0': 'Number 1'}},
					UserDefinedNumber2: {text: 'User Defined 2', key: 'entityUserDefined', params: {'p_0': 'Number 2'}},
					UserDefinedNumber3: {text: 'User Defined 3', key: 'entityUserDefined', params: {'p_0': 'Number 3'}},
					UserDefinedNumber4: {text: 'User Defined 4', key: 'entityUserDefined', params: {'p_0': 'Number 4'}},
					UserDefinedNumber5: {text: 'User Defined 5', key: 'entityUserDefined', params: {'p_0': 'Number 5'}},
				})
			},
			overloads: {
				BasWarrantysecurityFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedWarrantySecurityLookupService,
						displayMember: 'DescriptionInfo.Translated',
					})
				},
				BasWarrantyobligationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedWarrantyObligationLookupService,
						displayMember: 'DescriptionInfo.Translated'
					})
				},
				HandoverDate: {
					type: FieldType.DateUtc
				},
				WarrantyEnddate: {
					type: FieldType.DateUtc
				},
				CommentText: {
					'maxLength': 252
				},
				Description: {
					'maxLength': 252
				},
				UserDefinedText1: {
					'maxLength': 252
				},
				UserDefinedText2: {
					'maxLength': 252
				},
				UserDefinedText3: {
					'maxLength': 252
				},
				UserDefinedText4: {
					'maxLength': 252
				},
				UserDefinedText5: {
					'maxLength': 252
				}
			}
		};
	}
}