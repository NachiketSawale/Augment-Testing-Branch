import {PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';
import {
	BasicsSharedPhotoEntityViewerComponent,
	IPhotoEntityViewerContext,
	PHOTO_ENTITY_VIEWER_OPTION_TOKEN
} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import {runInInjectionContext} from '@angular/core';
import { BasicsClerkDataService } from './services/basics-clerk-data.service';

export class BasicsClerkPhotoContainerDefinition {
	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private readonly definition = {
		uuid: '880ec74c43cc4778b94cd26f1b6115e3',
		id: 'basics.clerk.photo',
		title: {
			text: 'Clerk Photo',
			key: 'basics.clerk.clerkPhotoContainerTitle'
		},
		containerType: BasicsSharedPhotoEntityViewerComponent,
		permission: '880ec74c43cc4778b94cd26f1b6115e3',
		providers: [{
			provide: new EntityContainerInjectionTokens<IBasicsClerkEntity>().dataServiceToken,
			useExisting: BasicsClerkDataService
		}, {
			provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
			useValue: {
				isSyncMode: false,
				isSingle: true,
				hideChangeItem: true,
				blobFieldName: 'BlobsPhotoFk',
				dtoName: 'ClerkDto',
				deleteUrl: this.configService.webApiBaseUrl + 'basics/clerk/blobsfoto/deleteblobsfoto',
				importUrl: this.configService.webApiBaseUrl + 'basics/clerk/blobsfoto/importblobsfoto',
				getUrl: this.configService.webApiBaseUrl + 'basics/clerk/blobsfoto/exportblobsfoto',
				canCreate: (context: IPhotoEntityViewerContext) => {
					const clerkService = ServiceLocator.injector.get(BasicsClerkDataService);
					const selected = clerkService.getSelectedEntity();
					return selected && clerkService.getEntityReadOnlyFields(selected).length === 0 && context.canCreate.call(context.component);
				},
				canDelete: (context: IPhotoEntityViewerContext) => {
					const clerkService = ServiceLocator.injector.get(BasicsClerkDataService);
					const selected = clerkService.getSelectedEntity();
					return selected && clerkService.getEntityReadOnlyFields(selected).length === 0 && context.canDelete.call(context.component);
				},
				processors: () => {
					const clerkService = ServiceLocator.injector.get(BasicsClerkDataService);
					return clerkService.getProcessors();
				}
			}
		}]
	};

	public getDefinition () {
		return this.definition;
	}
}

export const CLERK_PHOTO_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new BasicsClerkPhotoContainerDefinition().getDefinition());
