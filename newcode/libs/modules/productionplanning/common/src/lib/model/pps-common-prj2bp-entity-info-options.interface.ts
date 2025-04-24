import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsEntityInfoOptions } from '@libs/productionplanning/shared';

export interface IPpsCommonPrj2bpEntityInfoOptions<PT extends object>
	extends IPpsEntityInfoOptions<PT> {
	projectFkField: string,
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
}
