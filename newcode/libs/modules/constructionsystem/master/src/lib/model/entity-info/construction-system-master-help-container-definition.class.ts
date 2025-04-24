import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedPhotoEntityViewerComponent, IPhotoEntityViewerContext, PHOTO_ENTITY_VIEWER_OPTION_TOKEN } from '@libs/basics/shared';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { runInInjectionContext } from '@angular/core';
import { ConstructionSystemMasterHeaderDataService } from '../../services/construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

export class ConstructionSystemMasterHelpContainerDefinition {
	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private readonly definition = {
		uuid: '4fb2bbe16e21445282f5b3c9c64bde9b',
		id: 'constructionsystem.master.help',
		title: {
			text: 'Help',
			key: 'constructionsystem.master.helpContainerTitle',
		},
		containerType: BasicsSharedPhotoEntityViewerComponent,
		permission: 'df958953d5774978a24be290074c2fdc',
		providers: [
			{
				provide: new EntityContainerInjectionTokens<ICosHeaderEntity>().dataServiceToken,
				useExisting: ConstructionSystemMasterHeaderDataService,
			},
			{
				provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
				useValue: {
					isSyncMode: false,
					isSingle: true,
					hideChangeItem: true,
					blobFieldName: 'BasBlobsFk',
					dtoName: 'CosHeaderDto',
					deleteUrl: this.configService.webApiBaseUrl + 'constructionsystem/master/help/deleteblob',
					importUrl: this.configService.webApiBaseUrl + 'constructionsystem/master/help/importblob',
					getUrl: this.configService.webApiBaseUrl + 'constructionsystem/master/help/getblob',
					canCreate: (context: IPhotoEntityViewerContext) => {
						const masterHeaderService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
						const selected = masterHeaderService.getSelectedEntity();
						return selected && !masterHeaderService.isEntityReadOnly(selected) && context.canCreate.call(context.component);
					},
					canDelete: (context: IPhotoEntityViewerContext) => {
						const masterHeaderService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
						const selected = masterHeaderService.getSelectedEntity();
						return selected && !masterHeaderService.isEntityReadOnly(selected) && context.canDelete.call(context.component);
					},
					processors: () => {
						const masterHeaderService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
						return masterHeaderService.getProcessors();
					},
				},
			},
		],
	};

	public getDefinition() {
		return this.definition;
	}
}

export const CONSTRUCTION_SYSTEM_MASTER_HELP_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new ConstructionSystemMasterHelpContainerDefinition().getDefinition());
