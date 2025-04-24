import { IInitializationContext, Translatable } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IBasicsClerkEntity } from './basics-clerk-entity.interface';

export interface ILink2ClerkEntityInfoOptions<PT extends object> {
	permissionUuid: string;
	gridContainerUuid: string;
	gridTitle: Translatable;
	formContainerUuid: string;
	formTitle: Translatable;
	link2clerkDataServiceCreateContext: ILink2ClerkDataServiceCreateContext<PT>;
	customizeLayoutConfiguration?: ILayoutConfiguration<IBasicsClerkEntity>;
}

export interface ILink2ClerkDataServiceCreateContext<PT extends object> {
	qualifier: string;
	instanceId?: string | null;
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>;
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>, context: IInitializationContext) => boolean;
}

export interface ILink2ClerkDataServiceInitOptions<PT extends object> {
	Qualifier: string;
	parentService: IEntitySelection<PT>;
	isParentReadonlyFn?: (parentService: IEntitySelection<PT>) => boolean;
}
