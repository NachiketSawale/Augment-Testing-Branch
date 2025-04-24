import { IEntityIdentification, IInitializationContext, Translatable } from '@libs/platform/common';
import { IDataServiceOptions, IEntitySchemaId, IEntitySelection } from '@libs/platform/data-access';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';

export interface IFilterStructureEntityInfoOptions<T extends IEntityIdentification> {
	permissionUuid: string;
	gridContainerUuid: string;
	gridTitle: Translatable;
	filterStructureDataServiceCreateContext: IfilterStructureDataServiceCreateContext<T>;
	customizeLayoutConfiguration?: () => ILayoutConfiguration<T>;
	dtoSchemaId: IEntitySchemaId;
}

export interface IfilterStructureDataServiceCreateContext<T extends IEntityIdentification> {
	qualifier: string;
	dataServiceOption: IDataServiceOptions<T>;
	instanceId?: string | null;
	isParentReadonlyFn?: (parentService: IEntitySelection<IProjectLocationEntity>, context: IInitializationContext) => boolean;
}
