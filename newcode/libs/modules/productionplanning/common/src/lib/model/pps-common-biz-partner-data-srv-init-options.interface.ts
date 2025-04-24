import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';

export interface IPpsCommonBizPartnerDataSrvInitOptions<PT extends object> {
	projectFkField: string,
	ppsHeaderFkField: string,
	mntReqFkField?: string
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,

}