import { ResourceSharedLookupOverloadProviderGenerated } from './resource-shared-lookup-overload-provider-generated.class';
import { ConcreteFieldOverload, createLookup, FieldType } from '@libs/ui/common';
import { ResourceSharedResourceCatalogLookupService } from './catalog/resource-equipment-catalog-lookup.service';
import { ResourceSharedResourceCatalogRecordLookupService } from './catalog/resource-equipment-catalog-record-lookup.service';
import { IEquipmentGroupEurolistEntityGenerated, IResourceCatalogEntity, IResourceCatalogRecordEntity, IResourceTypeEntity, IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import { ResourceWotPlantFilterLookupService } from './wot/resource-wot-plant-filter-lookup.service';
import { ResourceWotPlantTypeFilterLookupService } from './wot/resource-wot-plant-type-filter-lookup.service';
import { ResourceEquipmentGroupEurolistLookupService } from './equipmentgroup';
import { ResourceTypeLookupService } from './type';
import { ResourceWorkOperationTypeLookupService } from './wot';


export class ResourceSharedLookupOverloadProvider extends ResourceSharedLookupOverloadProviderGenerated {
	public static provideResourceCatalogLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IResourceCatalogEntity>({
				dataServiceToken: ResourceSharedResourceCatalogLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceCatalogReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IResourceCatalogEntity>({
				dataServiceToken: ResourceSharedResourceCatalogLookupService,
				showClearButton: false
			})
		};
	}

	public static provideResourceCatalogRecordLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IResourceCatalogRecordEntity>({
				dataServiceToken: ResourceSharedResourceCatalogRecordLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceCatalogRecordReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IResourceCatalogRecordEntity>({
				dataServiceToken: ResourceSharedResourceCatalogRecordLookupService,
				showClearButton: false
			})
		};
	}


	public static provideEquipmentGroupEurolistLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IEquipmentGroupEurolistEntityGenerated>({
				dataServiceToken: ResourceEquipmentGroupEurolistLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentGroupEurolistReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IEquipmentGroupEurolistEntityGenerated>({
				dataServiceToken: ResourceEquipmentGroupEurolistLookupService,
				showClearButton: false
			})
		};
	}


	public static provideResourceTypeLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IResourceTypeEntity>({
				dataServiceToken: ResourceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceTypeReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IResourceTypeEntity>({
				dataServiceToken: ResourceTypeLookupService,
				showClearButton: false
			})
		};
	}


	public static provideWorkOperationTypeLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IResourceWorkOperationTypeEntity>({
				dataServiceToken: ResourceWorkOperationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkOperationTypeReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IResourceWorkOperationTypeEntity>({
				dataServiceToken: ResourceWorkOperationTypeLookupService,
				showClearButton: false
			})
		};
	}


	public static provideResourceWotFilterByPlantLookupOverload<T extends object>(showClearBtn: boolean, plantPropertyName: string, filterKey: string): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ResourceWotPlantFilterLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: {
					key: filterKey,
					execute(context){
						const accessor = plantPropertyName ? plantPropertyName : 'PlantFk';
						let plantFk = null;
						if (context.entity && context.entity[accessor]) {
							plantFk = context.entity[accessor];
						}
						return {
							PlantFk: plantFk
						};
					}
				}
			})
		};
	}

	public static provideResourceWotFilterByPlantTypeLookupOverload<T extends object>(showClearBtn: boolean, plantTypePropertyName: string, filterKey: string): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ResourceWotPlantTypeFilterLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: {
					key: filterKey,
					execute(context){
						const accessor = plantTypePropertyName ? plantTypePropertyName : 'PlantTypeFk';
						let plantTypeFk = null;
						if (context.entity && context.entity[accessor]) {
							plantTypeFk = context.entity[accessor];
						}
						return {
							PlantTypeFk: plantTypeFk
						};
					}
				}
			})
		};
	}
}