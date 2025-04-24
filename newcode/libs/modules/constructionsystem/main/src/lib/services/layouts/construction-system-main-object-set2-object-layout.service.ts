import { inject, Injectable } from '@angular/core';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IObjectSet2ObjectEntity } from '../../model/entities/object-set-2-object-entity.interface';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectSet2ObjectLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IObjectSet2ObjectEntity>> {
		const modelLookupProvider = await this.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['ProjectFk', 'ObjectFk', 'ModelFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('model.main.', {
					ProjectFk: { key: 'entityProjectNo', text: 'Project No' },
					ModelFk: { key: 'entityModel', text: 'Model' },
					ObjectFk: { key: 'entityObject', text: 'Object' },
				}),
			},
			overloads: {
				ProjectFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						showClearButton: false,
					}),
				},
				ModelFk: modelLookupProvider.generateModelLookup(),
				ObjectFk: {
					//TODO: model object lookup is not ready
					readonly: true,
				},
			},
		};
	}
}
