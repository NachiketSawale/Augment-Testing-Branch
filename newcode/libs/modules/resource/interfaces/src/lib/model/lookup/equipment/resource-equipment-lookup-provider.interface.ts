/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IResourceEquipmentLookupProviderGenerated } from './generated/resource-equipment-lookup-provider-generated.interface';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from "@libs/ui/common";

export interface IResourceEquipmentLookupProvider extends IResourceEquipmentLookupProviderGenerated {
	/**
	 * Generates a lookup field overload definition to pick a plant group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	providePlantLookupOverload<T extends object>(options?: ICommonLookupOptions ): TypedConcreteFieldOverload<T>;
}