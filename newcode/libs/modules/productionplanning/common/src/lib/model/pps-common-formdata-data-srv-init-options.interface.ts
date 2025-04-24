import { Rubric } from '@libs/basics/shared';
import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';

export interface IPpsFormdataDataSrvInitOptions<PT extends object> {
	apiUrl?: string,
	endPoint?: string,
	rubric: Rubric,
	contextFk?: string, // for container "Form Data for PPS Item" in Engineering module, its value is "PPSItemFk"
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
	deleteSupported?: boolean, // at the moment, only for container like "Planning Unit: Upstream Result Form Data", it's not allow to create, its value should be false
	createSupported?: boolean, // at the moment, only  for container like "Planning Unit: Upstream Result Form Data", it's not allow to delete, its value should be false
}