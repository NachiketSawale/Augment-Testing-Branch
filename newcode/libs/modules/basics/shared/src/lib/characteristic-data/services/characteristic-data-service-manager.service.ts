/*
 * Copyright(c) RIB Software GmbH
 */
import { runInInjectionContext } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { ICharacteristicDataEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { IEntitySelection } from '@libs/platform/data-access';
import { BasicsSharedCharacteristicDataService } from '../services/basics-shared-characteristic-data.service';
import { BasicsSharedCharacteristicDataGroupDataService } from '../services/basics-shared-characteristic-data-group-data.service';
import { ICharacteristicDataEntityInfoOptions } from '../model/interfaces/characteristic-data-entity-info-options.interface';

/**
 * create characteristic data entity info factory service.
 */
export class BasicsSharedCharacteristicDataServiceManager {
	private static _dataServiceCache = new Map<string, IEntitySelection<ICharacteristicDataEntity>>();
	private static _groupDataServiceCache = new Map<string, IEntitySelection<ICharacteristicGroupEntity>>();

	/**
	 * Get or create data service.
	 * @param options creation options.
	 * @param context Initialization context.
	 * @return data service.
	 */
	public static getDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(options: ICharacteristicDataEntityInfoOptions<PT>, context: IInitializationContext) {
		const uuid = options.containerUuid || options.permissionUuid;
		let instance = BasicsSharedCharacteristicDataServiceManager.getDataServiceFromCache(uuid);

		if (!instance) {
			instance = runInInjectionContext(
				context.injector,
				() =>
					new BasicsSharedCharacteristicDataService<ICharacteristicDataEntity, PT, PU>({
						sectionId: options.sectionId,
						parentField: options.parentField,
						pKey1Field: options.pKey1Field,
						pKey2Field: options.pKey2Field,
						pKey3Field: options.pKey3Field,
						parentService: options.parentServiceFn(context),
						isParentReadonlyFn:
							options.isParentReadonlyFn !== undefined
								? (parentService: IEntitySelection<PT>) => {
										return options.isParentReadonlyFn!(parentService);
									}
								: undefined,
						areParentsCanCreateOrDeleteFn:
							options.areParentsCanCreateOrDeleteFn != undefined
								? (parentService: IEntitySelection<PT>) => {
										return options.areParentsCanCreateOrDeleteFn!(parentService);
									}
								: undefined,
						setEntityToReadonlyIfRootEntityIsFn:
							options.setEntityToReadonlyIfRootEntityIsFn != undefined
								? (parentService: IEntitySelection<PT>, entity: ICharacteristicDataEntity) => {
										return options.setEntityToReadonlyIfRootEntityIsFn!(parentService, entity);
									}
								: undefined,
						isAddSubscriptionForParentEntityCreated: options.isAddSubscriptionForParentEntityCreated != undefined ? options.isAddSubscriptionForParentEntityCreated : true,
						getDefaultListForParentEntityCreateFn:
							options.getDefaultListForParentEntityCreateFn != undefined
								? (parentEntity: PT, sectionId: number, configurationSectionId?: number, structureSectionId?: number) => {
										return options.getDefaultListForParentEntityCreateFn!(parentEntity, sectionId, configurationSectionId, structureSectionId);
									}
								: undefined,
						getDefaultListForParentEntityCreatePerSectionFn:
							options.getDefaultListForParentEntityCreatePerSectionFn != undefined
								? (parentEntity: PT) => {
										return options.getDefaultListForParentEntityCreatePerSectionFn!(parentEntity, options.sectionId);
									}
								: undefined,
						groupService: this.getGroupDataService(options, context),
					}),
			);
			BasicsSharedCharacteristicDataServiceManager._dataServiceCache.set(uuid, instance);
		}
		return instance as BasicsSharedCharacteristicDataService<ICharacteristicDataEntity, PT, PU>;
	}

	/**
	 * Get or create group data service.
	 * @param options creation options.
	 * @param context Initialization context.
	 * @return group data service.
	 */
	public static getGroupDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(options: ICharacteristicDataEntityInfoOptions<PT>, context: IInitializationContext) {
		const uuid = options.containerUuid || options.permissionUuid;
		let instance = BasicsSharedCharacteristicDataServiceManager.getGroupDataServiceFromCache(uuid);

		if (!instance) {
			instance = runInInjectionContext(
				context.injector,
				() =>
					new BasicsSharedCharacteristicDataGroupDataService<ICharacteristicGroupEntity, PT, PU>({
						sectionId: options.sectionId,
						parentField: options.parentField,
						pKey1Field: options.pKey1Field,
						pKey2Field: options.pKey2Field,
						pKey3Field: options.pKey3Field,
						parentService: options.parentServiceFn(context),
						isParentReadonlyFn: (parentService) => {
							return !!(options.isParentReadonlyFn && options.isParentReadonlyFn(parentService));
						},
					}),
			);
			BasicsSharedCharacteristicDataServiceManager._groupDataServiceCache.set(uuid, instance);
		}
		return instance as BasicsSharedCharacteristicDataGroupDataService<ICharacteristicGroupEntity, PT, PU>;
	}

	/**
	 * Retrieve the data service from cache according to the container uuid.
	 * @param uuid containerUuid
	 * @return data service.
	 */
	public static getDataServiceFromCache(uuid: string) {
		return BasicsSharedCharacteristicDataServiceManager._dataServiceCache.get(uuid);
	}

	/**
	 * Retrieve the data service from cache according to the container uuid.
	 * @param uuid containerUuid
	 * @return group data service.
	 */
	public static getGroupDataServiceFromCache(uuid: string) {
		return BasicsSharedCharacteristicDataServiceManager._groupDataServiceCache.get(uuid);
	}
}
