import { IPpsEntityInfoOptions } from '@libs/productionplanning/shared';
import { IPpsFormdataDataSrvInitOptions } from './pps-common-formdata-data-srv-init-options.interface';

export interface IPpsFormdataEntityInfoOptions<PT extends object>
	extends IPpsFormdataDataSrvInitOptions<PT>, IPpsEntityInfoOptions<PT> {

}
