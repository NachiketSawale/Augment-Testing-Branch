import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedClerkLayoutService } from '../services/basics-shared-clerk-layout.service';
import { IBasicsClerkEntity } from '../model/basics-clerk-entity.interface';
import { ILink2ClerkEntityInfoOptions } from '../model/link2clerk-interface';
import { BasicsSharedLink2clerkDataServiceManager } from '../services/link2clerk-data-service-manager.service';

export class BasicsSharedLink2ClerkEntityInfoFactory {
	public static create<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(options: ILink2ClerkEntityInfoOptions<PT>): EntityInfo {
		return EntityInfo.create<IBasicsClerkEntity>({
			grid: {
				containerUuid: options.gridContainerUuid,
				title: options.gridTitle,
			},
			form: {
				containerUuid: options.formContainerUuid,
				title: options.formTitle,
			},
			dataService: (ctx) => {
				return ctx.injector.get(BasicsSharedLink2clerkDataServiceManager).createDataServiceInstance<PT, PU>(options.link2clerkDataServiceCreateContext, ctx);
			},

			dtoSchemeId: {
				moduleSubModule: 'Basics.Common',
				typeName: 'ClerkDataDto',
			},
			permissionUuid: options.permissionUuid,
			layoutConfiguration: async (ctx) => {
				return options.customizeLayoutConfiguration ?? await ctx.injector.get(BasicsSharedClerkLayoutService).generateConfig();
			},

			prepareEntityContainer: (ctx) => {
				ctx.translateService.load('basics.common');
			},
		});
	}
}
