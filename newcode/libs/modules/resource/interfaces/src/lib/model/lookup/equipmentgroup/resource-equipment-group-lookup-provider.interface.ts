/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';
import { IEquipmentGroupEntity } from "../../entities/equipmentgroup";

export interface IEquipmentGroupLookupProvider {
	generateEquipmentGroupLookup<T extends object>(options?: ILookupOptions<IEquipmentGroupEntity, T> | undefined): TypedConcreteFieldOverload<T>;
	generateEquipmentGroupReadOnlyLookup<T extends object>(options?: ILookupOptions<IEquipmentGroupEntity, T> | undefined): TypedConcreteFieldOverload<T>;
}
export const EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IEquipmentGroupLookupProvider>('resource.equipmentgroup.LookupProvider');
