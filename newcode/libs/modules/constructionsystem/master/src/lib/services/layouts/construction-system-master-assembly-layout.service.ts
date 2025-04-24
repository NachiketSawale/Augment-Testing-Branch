/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { ICosAssemblyEntity } from '../../model/entities/cos-assembly-entity.interface';
import { EstimateMainAssemblyTemplateLookupService } from '@libs/estimate/shared';
import { ConstructionSystemMasterEstAssemblyCatLookupService } from '../lookup/construction-system-master-est-assemblycat-lookup.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';
import { ConstructionSystemMasterEstAssemblyLookupService } from '../lookup/construction-system-master-est-assembly-lookup.service';

/**
 * Cos assembly layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterAssemblyLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public generateLayout(): ILayoutConfiguration<ICosAssemblyEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'CommentText', 'EstLineItemFk', 'EstAssemblyCatFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					CommentText: { key: 'entityCommentText', text: 'Comment' },
				}),
				...prefixAllTranslationKeys('constructionsystem.master.', {
					EstLineItemFk: { key: 'entityEstLineItemFk', text: 'Est LineItem Code' },
					EstAssemblyCatFk: { key: 'entityEstAssemblyCatFk', text: 'Est Assembly Cat Code' },
				}),
			},
			overloads: {
				EstLineItemFk: {
					type: FieldType.Lookup,
					// formatterOptions: { 	///todo seems not working
					// 	lookupType: 'estassemblyfk',
					// 	dataServiceName: 'ConstructionSystemMasterEstAssemblyLookupService',
					// },
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainAssemblyTemplateLookupService,
						showClearButton: false,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: (e) => {
									const selectedEntity = e.context.lookupInput?.selectedItem as IEstLineItemEntity;
									if (selectedEntity) {
										e.context.entity.EstAssemblyCatFk = selectedEntity.EstAssemblyCatFk ?? 0;
										e.context.entity.EstHeaderFk = selectedEntity.EstHeaderFk ?? 0;
										const estAssemblyTemplateLookupService = ServiceLocator.injector.get(EstimateMainAssemblyTemplateLookupService);
										estAssemblyTemplateLookupService.loadParentGridItems().subscribe((catItems) => {
											const treeHelper = ServiceLocator.injector.get(BasicsSharedTreeDataHelperService);
											const cats = treeHelper.flatTreeArray(catItems, (e) => e.AssemblyCatChildren);
											const catItem = cats.filter((e) => e.Id === selectedEntity.EstAssemblyCatFk);
											const estAssemblyCatLookupService = ServiceLocator.injector.get(ConstructionSystemMasterEstAssemblyCatLookupService);
											estAssemblyCatLookupService.cache.list.push(catItem[0]);
											const estAssemblyLookupService = ServiceLocator.injector.get(ConstructionSystemMasterEstAssemblyLookupService);
											estAssemblyLookupService.cache.list.push(selectedEntity);
										});
									}
								},
							},
						],
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'constructionsystem.master.entityEstLineItemDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				EstAssemblyCatFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterEstAssemblyCatLookupService,
						displayMember: 'Code',
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'constructionsystem.master.entityEstAssemblyCatDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
			},
		};
	}
}
