import {PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';
import {
	BasicsSharedPhotoEntityViewerComponent,
	IPhotoEntityViewerContext,
	PHOTO_ENTITY_VIEWER_OPTION_TOKEN
} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {IMaterialEntity} from '@libs/basics/interfaces';
import {BasicsMaterialRecordDataService} from './basics-material-record-data.service';
import {runInInjectionContext} from '@angular/core';

export class BasicsMaterialPreviewContainerDefinition {
	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private readonly definition = {
		uuid: '875c61bb2c5a4f54987a8db8125dd211',
		id: 'basics.material.preview',
		title: {
			text: 'Preview',
			key: 'basics.material.preview.title'
		},
		containerType: BasicsSharedPhotoEntityViewerComponent,
		permission: '875c61bb2c5a4f54987a8db8125dd211',
		providers: [{
			provide: new EntityContainerInjectionTokens<IMaterialEntity>().dataServiceToken,
			useExisting: BasicsMaterialRecordDataService
		}, {
			provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
			useValue: {
				isSyncMode: false,
				isSingle: true,
				hideChangeItem: true,
				blobFieldName: 'BasBlobsFk',
				dtoName: 'MaterialDto',
				deleteUrl: this.configService.webApiBaseUrl + 'basics/material/preview/deleteblob',
				importUrl: this.configService.webApiBaseUrl + 'basics/material/preview/importblob',
				getUrl: this.configService.webApiBaseUrl + 'basics/material/preview/getblob',
				canCreate: (context: IPhotoEntityViewerContext) => {
					const materialService = ServiceLocator.injector.get(BasicsMaterialRecordDataService);
					const selected = materialService.getSelectedEntity();
					return selected && materialService.getEntityReadOnlyFields(selected).length === 0 && context.canCreate.call(context.component);
				},
				canDelete: (context: IPhotoEntityViewerContext) => {
					const materialService = ServiceLocator.injector.get(BasicsMaterialRecordDataService);
					const selected = materialService.getSelectedEntity();
					return selected && materialService.getEntityReadOnlyFields(selected).length === 0 && context.canDelete.call(context.component);
				},
				processors: () => {
					const materialService = ServiceLocator.injector.get(BasicsMaterialRecordDataService);
					return materialService.getProcessors();
				}
			}
		}]
	};

	public getDefinition () {
		return this.definition;
	}
}

export const MATERIAL_PREVIEW_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new BasicsMaterialPreviewContainerDefinition().getDefinition());
