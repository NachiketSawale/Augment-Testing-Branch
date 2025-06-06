/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTSInterfaceLookupHelperGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { IResourceEquipmentLookupProvider } from '../resource-equipment-lookup-provider.interface';
import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

export interface IResourceEquipmentLookupProviderGenerated {
	/**
	* Generates a lookup field overload definition to pick a EquipmentPlant.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	provideEquipmentPlantLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a EquipmentPlant.
	* 
	* @returns The lookup field overload.
	*/
	provideEquipmentPlantReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a PlantDocument.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	providePlantDocumentLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a PlantDocument.
	* 
	* @returns The lookup field overload.
	*/
	providePlantDocumentReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a PlantFixedAsset.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	providePlantFixedAssetLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a PlantFixedAsset.
	* 
	* @returns The lookup field overload.
	*/
	providePlantFixedAssetReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a PlantAssignment.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	providePlantAssignmentLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a PlantAssignment.
	* 
	* @returns The lookup field overload.
	*/
	providePlantAssignmentReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a PlantComponent.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	providePlantComponentLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a PlantComponent.
	* 
	* @returns The lookup field overload.
	*/
	providePlantComponentReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a PlantEurolist.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	providePlantEurolistLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a PlantEurolist.
	* 
	* @returns The lookup field overload.
	*/
	providePlantEurolistReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a Maintenance.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	provideMaintenanceLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a Maintenance.
	* 
	* @returns The lookup field overload.
	*/
	provideMaintenanceReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to pick a PlantComponentMaintSchema.
	* 
	* @param options The options to apply to the lookup
	* 
	* @returns The lookup field overload.
	*/
	providePlantComponentMaintSchemaLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	/**
	* Generates a lookup field overload definition to read a PlantComponentMaintSchema.
	* 
	* @returns The lookup field overload.
	*/
	providePlantComponentMaintSchemaReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
}
export const RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IResourceEquipmentLookupProvider>('resource.equipment.LookupProvider');