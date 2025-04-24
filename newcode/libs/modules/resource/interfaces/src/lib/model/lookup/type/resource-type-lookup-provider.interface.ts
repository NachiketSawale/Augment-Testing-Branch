/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IResourceTypeLookupProviderGenerated } from './generated/resource-type-lookup-provider-generated.interface';
import { ILookupOptions, TypedConcreteFieldOverload } from "@libs/ui/common";
import { IResourceTypeEntity } from "../../entities/type";

export interface IResourceTypeLookupProvider extends IResourceTypeLookupProviderGenerated {

	generateResourceTypeLookup<T extends object>(options?: ILookupOptions<IResourceTypeEntity, T> | undefined): TypedConcreteFieldOverload<T>;

}