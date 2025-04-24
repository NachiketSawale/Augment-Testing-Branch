import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsNotificationEntity } from '../../model/notification/pps-notification-entity.interface';
import {IPpsNotificationEntityDataServiceInitializeOptions} from '../../model/notification/pps-notification-entity-info-options.interface';

export class ProductionplanningSharedNotificationDataService<PT extends object, PU extends object>
	extends DataServiceFlatLeaf<IPpsNotificationEntity, object, object> {

	public constructor(private initOptions: IPpsNotificationEntityDataServiceInitializeOptions<PT>) {
		const options: IDataServiceOptions<IPpsNotificationEntity> = {

			apiUrl: initOptions.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getNotifications',
				usePost: false,
				prepareParam: ident => ({mainItemId: ident.pKey1})
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsNotificationEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PhaseRequirement',
				parent: initOptions.parentService,
			}
		};
		super(options);
	}


}