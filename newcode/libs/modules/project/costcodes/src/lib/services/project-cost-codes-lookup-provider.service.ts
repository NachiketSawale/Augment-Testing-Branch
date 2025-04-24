import {  IBasicsCustomizeCostTypeEntity, IControllingCostCodes } from '@libs/basics/interfaces';
import { FieldType, ICommonLookupOptions, TypedConcreteFieldOverload, createLookup } from '@libs/ui/common';

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IProjectCodesLookupProvider, PROJECT_COSTCODES_LOOKUP_PROVIDER_TOKEN } from '../model/interfaces/project-costcodes-lookup-provider.interface';
import { BasicsCostCodesControllingLookup, BasicsSharedCostTypeLookupService } from '@libs/basics/shared';

/**
 * Provides project cost code lookup
 */
@LazyInjectable({
	token: PROJECT_COSTCODES_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ProjectCostcodesLookupProvider implements IProjectCodesLookupProvider {

	/**
	 * Generates lookup
	 *
	 * @returns The lookup field overload.
	 */

    public provideProjectCostcodesControllingLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IControllingCostCodes>({
				dataServiceToken: BasicsCostCodesControllingLookup,
				showClearButton: !!options?.showClearButton,
			})
		};
	}


	public provideProjectCostcodesCostTypeLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBasicsCustomizeCostTypeEntity>({
				dataServiceToken: BasicsSharedCostTypeLookupService,
				showClearButton: !!options?.showClearButton,
			})
		};
	}

	



}