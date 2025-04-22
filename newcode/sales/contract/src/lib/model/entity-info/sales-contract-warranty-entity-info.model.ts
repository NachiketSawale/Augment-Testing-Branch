/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SalesContractWarrantyBehavior } from '../../behaviors/sales-contract-warranty-behavior.service';
import { SalesContractWarrantyDataService } from '../../services/sales-contract-warranty-data.service';
import { IOrdWarrantyEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_WARRANTY_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdWarrantyEntity> ({
	grid: {
		title: {key: 'sales.common.warranty.warrantyContainerGridTitle'},
		behavior: ctx => ctx.injector.get(SalesContractWarrantyBehavior),
	},
	form: {
		title: { key: 'sales.common.warranty.warrantyContainerDetailTitle' },
		containerUuid: 'f3c2bfb95684489bb83cc50eeddc1017'
	},
	dataService: ctx => ctx.injector.get(SalesContractWarrantyDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdWarrantyDto'},
	permissionUuid: 'fea263be52ed4f2098f70ff5290dc910',
	layoutConfiguration: {
		groups: [
			{ gid: 'Basic Data', attributes: ['BasWarrantysecurityFk', 'BasWarrantyobligationFk', 'Description', 'HandoverDate', 'DurationMonths', 'WarrantyEnddate', 'CommentText',
					'UserDefinedText1', 'UserDefinedText2', 'UserDefinedText3', 'UserDefinedText4', 'UserDefinedText5',
					'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5',
					'UserDefinedNumber1', 'UserDefinedNumber2', 'UserDefinedNumber3', 'UserDefinedNumber4', 'UserDefinedNumber5'] },
		],
		overloads: {
			BasWarrantysecurityFk: BasicsSharedCustomizeLookupOverloadProvider.provideWarrantySecurityLookupOverload(true),
			BasWarrantyobligationFk: BasicsSharedCustomizeLookupOverloadProvider.provideWarrantyObligationLookupOverload(true),
			Description: { label: { text: 'Description', key: 'Description' }, visible: true },
			HandoverDate: { label: { text: 'Handover Date', key: 'HandoverDate' }, visible: true },
			DurationMonths: { label: { text: 'Duration Months', key: 'DurationMonths' }, visible: true },
			WarrantyEnddate: { label: { text: 'Warranty End Date', key: 'WarrantyEnddate' }, visible: true },
			CommentText: { label: { text: 'Comment', key: 'Comment' }, visible: true },
			UserDefinedText1: { label: { text: 'User Defined Text 1', key: 'UserDefinedText1' }, visible: true },
			UserDefinedText2: { label: { text: 'User Defined Text 2', key: 'UserDefinedText2' }, visible: true },
			UserDefinedText3: { label: { text: 'User Defined Text 3', key: 'UserDefinedText3' }, visible: true },
			UserDefinedText4: { label: { text: 'User Defined Text 4', key: 'UserDefinedText4' }, visible: true },
			UserDefinedText5: { label: { text: 'User Defined Text 5', key: 'UserDefinedText5' }, visible: true },
			UserDefinedDate1: { label: { text: 'User Defined Data 1', key: 'UserDefinedDate1' }, visible: true },
			UserDefinedDate2: { label: { text: 'User Defined Data 2', key: 'UserDefinedDate2' }, visible: true },
			UserDefinedDate3: { label: { text: 'User Defined Data 3', key: 'UserDefinedDate3' }, visible: true },
			UserDefinedDate4: { label: { text: 'User Defined Data 4', key: 'UserDefinedDate4' }, visible: true },
			UserDefinedDate5: { label: { text: 'User Defined Data 5', key: 'UserDefinedDate5' }, visible: true },
			UserDefinedNumber1: { label: { text: 'User Defined Number 1', key: 'UserDefinedNumber1' }, visible: true },
			UserDefinedNumber2: { label: { text: 'User Defined Number 2', key: 'UserDefinedNumber2' }, visible: true },
			UserDefinedNumber3: { label: { text: 'User Defined Number 3', key: 'UserDefinedNumber3' }, visible: true },
			UserDefinedNumber4: { label: { text: 'User Defined Number 4', key: 'UserDefinedNumber4' }, visible: true },
			UserDefinedNumber5: { label: { text: 'User Defined Number 5', key: 'UserDefinedNumber5' }, visible: true },
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
				BasWarrantysecurityFk: {key: 'entityWarrantySecurityFk'},
				BasWarrantyobligationFk: {key: 'entityWarrantyObligationFk'}
			}),
		},
	}
});