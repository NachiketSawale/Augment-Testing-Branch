import { IPpsEntityInfoOptions } from '@libs/productionplanning/shared';
import { IPpsCommonBizPartnerDataSrvInitOptions } from './pps-common-biz-partner-data-srv-init-options.interface';

export interface IPpsCommonBizPartnerEntityInfoOptions<PT extends object>
	extends IPpsCommonBizPartnerDataSrvInitOptions<PT>, IPpsEntityInfoOptions<PT> {

}
