import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SalesContractAdvanceBehavior } from '../../behaviors/sales-contract-advance-behavior.service';
import { SalesContractAdvanceDataService } from '../../services/sales-contract-advance-data.service';
import { SalesContractCustomizeLookupOverloadProvider } from '../../lookup-helper/sales-contract-lookup-overload-provider.class';
import { IOrdAdvanceEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_ADVANCE_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdAdvanceEntity> ({
	grid: {
		title: {key: 'procurement.contract.advanceGridTitle'},
		behavior: ctx => ctx.injector.get(SalesContractAdvanceBehavior),
	},
	form: {
		title: { key: 'procurement.contract.advanceFormTitle' },
		containerUuid: '9b5d79172acb48ada68bda1dc08bde61'
	},
	dataService: ctx => ctx.injector.get(SalesContractAdvanceDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdAdvanceDto'},
	permissionUuid: '0a06e01363ec4fe1866ab408501e9dfd',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data', attributes: ['SlsAdvanceTypeFk', 'OrdAdvanceStatusFk', 'BilHeaderFk', 'ReductionRule', 'ReductionValue', 'PaymentTermFk',
														 'Description', 'DateDue', 'AmountDue', 'DateDone','AmountDone', 'AmountDueOc', 'AmountDoneOc', 'CommentText',
					'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5',] },
		],
		overloads: {
			SlsAdvanceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesAdvanceTypeLookupOverload(false),
			OrdAdvanceStatusFk: SalesContractCustomizeLookupOverloadProvider.provideOrdAdvanceStatusLookupOverload(false, true),
			PaymentTermFk: BasicsSharedCustomizeLookupOverloadProvider.providePaymentMethodLookupOverload(true),
			BilHeaderFk: SalesContractCustomizeLookupOverloadProvider.provideBilHeaderLookupOverload(true, false)
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
					 SlsAdvanceTypeFk: {key: 'entitySlsAdvanceTypeFk'},
				    BilHeaderFk: {key: 'entityAdvanceBillNo', text: 'Advance Payment Bill No.'},
					 ReductionRule: {key: 'entityReductionRule'},
					 ReductionValue: {key: 'entityReductionValue'},
					 PaymentTermFk: {key: 'entityPaymentTermFk'},
					 Description: {key: 'entityDescription'},
					 DateDue: {key: 'entityDateDue'},
					 AmountDue: {key: 'entityAmountDue'},
					 DateDone: {key: 'entityDateDone'},
					 AmountDone: {key: 'entityAmountDone'},
					 AmountDueOc: {key: 'entityAmountDueOc'},
					 AmountDoneOc: {key: 'entityAmountDoneOc'},
					 CommentText: {key: 'entityCommentText'},
					 UserDefined1: {key: 'entityUserDefined1'},
					 UserDefined2: {key: 'entityUserDefined2'},
					 UserDefined3: {key: 'entityUserDefined3'},
					 UserDefined4: {key: 'entityUserDefined4'},
					 UserDefined5: {key: 'entityUserDefined5'},
					 OrdAdvanceStatusFk: {key: 'entityOrdAdvanceStatusFk'}
			}),
		},
	}
});