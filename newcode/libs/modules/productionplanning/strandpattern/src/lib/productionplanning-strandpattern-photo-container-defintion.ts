/*
 * Copyright(c) RIB Software GmbH
 */

import {PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';
import {
	BasicsSharedPhotoEntityViewerComponent,
	IPhotoEntityViewerContext,
	PHOTO_ENTITY_VIEWER_OPTION_TOKEN
} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {runInInjectionContext} from '@angular/core';
import { ProductionplanningStrandpatternDataService } from './services/productionplanning-strandpattern-data.service';
import { ProductionplanningStrandpatternEntity } from './model/productionplanning-strandpattern-entity.class';


export class ProductionplanningStrandpatternPhotoContainerDefinition {
	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private readonly definition = {
		uuid: '30cfb1e85e51424194c5bf1da1c5cdf3',
		id: 'productionplanning.strandpattern.photo',
		title: {
			text: 'Strand Pattern Photo',
		},
		containerType: BasicsSharedPhotoEntityViewerComponent,
		permission: '8e390164f0d441fba5a8f7dc5c4da845',
		providers: [{
			provide: new EntityContainerInjectionTokens<ProductionplanningStrandpatternEntity>().dataServiceToken,
			useExisting: ProductionplanningStrandpatternDataService
		}, {
			provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
			useValue: {
				isSyncMode: false,
				isSingle: true,
				hideChangeItem: true,
				blobFieldName: 'BasBlobsFk',
				dtoName: 'PpsStrandPatternDto',
				deleteUrl: this.configService.webApiBaseUrl + 'productionplanning/strandpattern/blob/delete',
				importUrl: this.configService.webApiBaseUrl + 'productionplanning/strandpattern/blob/create',
				getUrl: this.configService.webApiBaseUrl + 'productionplanning/strandpattern/blob/export',
				canCreate: (context: IPhotoEntityViewerContext) => {
					const strandPatternService = ServiceLocator.injector.get(ProductionplanningStrandpatternDataService);
					const selected = strandPatternService.getSelectedEntity();
					return selected && strandPatternService.getEntityReadOnlyFields(selected).length === 0 && context.canCreate.call(context.component);
				},
				canDelete: (context: IPhotoEntityViewerContext) => {
					const strandPatternService = ServiceLocator.injector.get(ProductionplanningStrandpatternDataService);
					const selected = strandPatternService.getSelectedEntity();
					return selected && strandPatternService.getEntityReadOnlyFields(selected).length === 0 && context.canDelete.call(context.component);
				},
				processors: () => {
					const strandPatternService = ServiceLocator.injector.get(ProductionplanningStrandpatternDataService);
					return strandPatternService.getProcessors();
				}
			}
		}]
	};

	public getDefinition () {
		return this.definition;
	}
}

export const PRODUCTIONPLANNING_STRANDPATTERN_PHOTO_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new ProductionplanningStrandpatternPhotoContainerDefinition().getDefinition());
