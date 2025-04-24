import {
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';

/**
 * service for create default serviceOptions
 */
export class EstimateLineItemBaseDataServiceOptionsService {
	/**
	 * create default ServiceOption
	 */
	public static createDefaultDataServiceOptions<T>(): IDataServiceOptions<T>{
		return {
			apiUrl: 'estimate/main/lineitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered_new',
				usePost: true
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint:'update',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<T>>{
				role: ServiceRole.Root,
				itemName: 'EstLineItems',
			}
		};
	}
}