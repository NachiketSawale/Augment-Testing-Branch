/*
 * Copyright(c) RIB Software GmbH
 */

import { IDataProvider } from '../../../data-provider/data-provider.interface';
import { IIdentificationDataConverter } from '../identification-data-converter.interface';
import { IEntityProcessor } from '../../../data-processor/entity-processor.interface';
import { IDataServiceEndPointOptions } from '../../data-service-end-point-options.interface';
import { IDataServiceRoleOptions } from './data-service-role-options.interface';
import { IDataServiceActionOptions } from './data-service-action-options.interface';


/**
 * Interface providing the different options which can be set to data services
 * @typeParam T -  entity type handled by the data service
 */
export interface IDataServiceOptions<T> {
	readonly apiUrl: string;
	readonly readInfo?: IDataServiceEndPointOptions,
	readonly createInfo?: IDataServiceEndPointOptions,
	readonly updateInfo?: IDataServiceEndPointOptions,
	readonly deleteInfo?: IDataServiceEndPointOptions,
	readonly provider?: IDataProvider<T>;
	readonly converter?: IIdentificationDataConverter<T>;
	readonly processors?: IEntityProcessor<T>[];
	readonly roleInfo: IDataServiceRoleOptions<T>;
	readonly entityActions?: IDataServiceActionOptions;
}
