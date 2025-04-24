/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILookupContext, TypedConcreteFieldOverload } from '@libs/ui/common';
import { BasicsSharedAccountingLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeAccountingEntity } from '@libs/basics/interfaces';
import { IPrcStructureAccountEntity } from '../model/entities/prc-structure-account-entity.interface';

export class AccountLookupOverloadProvider {
	// Lookup provider for BAS Account
	public static provideBasAccountLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.LookupInputSelect,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedAccountingLookupService,
				showClearButton: showClearBtn,
				clientSideFilter: {
					execute: (item: IBasicsCustomizeAccountingEntity, context: ILookupContext<IBasicsCustomizeAccountingEntity, IPrcStructureAccountEntity>) => {
						return item.LedgerContextFk === context.entity?.LedgerContextFk;
					}
				}
			})
		};
	}

	// Lookup provider for BAS Account Description
	public static provideBasAccountDescriptionLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedAccountingLookupService,
				displayMember: 'DescriptionInfo.Translated'
			})
		};
	}
}