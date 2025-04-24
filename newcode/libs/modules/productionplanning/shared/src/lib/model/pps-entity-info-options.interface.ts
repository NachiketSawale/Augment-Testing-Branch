import { IInitializationContext, Translatable } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';

export interface IPpsEntityInfoOptions<PT extends object> {
	permissionUuid: string;
	containerUuid: string;
	gridTitle?: Translatable;
	formContainerUuid?: string;
	formTitle?: Translatable;
	moduleName?: string; // e.g. 'productionplanning.product', 'productionplanning.formwork'
	isReadonly?: boolean;

	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>;
}