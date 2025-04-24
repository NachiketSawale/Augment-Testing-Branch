/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ICharacteristicDataEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataLayoutService } from '../services/layout/basics-shared-characteristic-data-layout.service';
import { ICharacteristicDataEntityInfoOptions } from './interfaces/characteristic-data-entity-info-options.interface';
import { FieldType } from '@libs/ui/common';
import { BasicsSharedCharacteristicDataServiceManager } from '../services/characteristic-data-service-manager.service';

/**
 * create characteristic data entity info factory service.
 */
export class BasicsSharedCharacteristicDataEntityInfoFactory {
	/**
	 * Create Characteristic Data Entity Info for container "Characteristic".
	 * @param options options for creation.
	 * @typeParam PT - entity type handled by the parent data service
	 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
	 * @return Characteristic Data Entity Info created.
	 */
	public static create<PT extends IEntityIdentification, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>>(options: ICharacteristicDataEntityInfoOptions<PT>) {
		return EntityInfo.create<ICharacteristicDataEntity>({
			grid: {
				containerUuid: options.containerUuid,
				title: options.gridTitle ?? {
					text: 'Characteristics',
					key: 'cloud.common.ContainerCharacteristicDefaultTitle',
				},
				containerType: SplitGridContainerComponent,
				providers: (ctx) => [
					{
						provide: SplitGridConfigurationToken,
						useValue: <ISplitGridConfiguration<ICharacteristicDataEntity, ICharacteristicGroupEntity>>{
							parent: {
								uuid: '428d3fa7c6784f0b81ea74f030c2cf0c',
								columns: [
									{
										id: 'description',
										model: 'DescriptionInfo',
										type: FieldType.Translation,
										label: {
											text: 'Description',
											key: 'cloud.common.entityDescription',
										},
										sortable: true,
										visible: true,
										readonly: true,
									},
								],
								dataService: BasicsSharedCharacteristicDataServiceManager.getGroupDataService<PT, PU>(options, ctx),
								treeConfiguration: {
									//todo: simplify tree configuration when ISplitParentGridConfiguration finished modification.
									parent: function (entity: ICharacteristicGroupEntity) {
										const service = BasicsSharedCharacteristicDataServiceManager.getGroupDataService<PT, PU>(options, ctx);
										return service.parentOf(entity);
									},
									children: function (entity: ICharacteristicGroupEntity) {
										const service = BasicsSharedCharacteristicDataServiceManager.getGroupDataService<PT, PU>(options, ctx);
										return service.childrenOf(entity);
									},
								},
							},
						},
					},
				],
			},
			dataService: (ctx) => {
				return BasicsSharedCharacteristicDataServiceManager.getDataService<PT, PU>(options, ctx);
			},
			dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicDataDto' },
			permissionUuid: options.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(BasicsSharedCharacteristicDataLayoutService).generateLayout<PT, PU>(options.sectionId, BasicsSharedCharacteristicDataServiceManager.getDataService<PT, PU>(options, context));
			},
			prepareEntityContainer: (ctx) => {
				ctx.translateService.load('basics.characteristic');
			},
		});
	}

	/**
	 * Create Characteristic Data Entity Info for container "Characteristics2".
	 * @param options options for creation.
	 * @typeParam PT - entity type handled by the parent data service
	 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
	 * @return Characteristic Data Entity Info created.
	 */
	public static create2<PT extends IEntityIdentification, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>>(options: ICharacteristicDataEntityInfoOptions<PT>) {
		options.gridTitle ??= {
			text: 'Characteristics2',
			key: 'cloud.common.ContainerCharacteristicDefaultTitle2',
		};
		return BasicsSharedCharacteristicDataEntityInfoFactory.create<PT, PU>(options);
	}
}
