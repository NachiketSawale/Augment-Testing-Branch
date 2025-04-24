import { IEntitySelection } from '@libs/platform/data-access';

export interface IPpsUpstreamItemDataSrvInitOptions<PT extends object> {
	endPoint?: string,
	mainItemColumn?: string, // e.g. 'Id'
	ppsHeaderColumn?: string, // e.g. 'PPSHeaderFk'
	ppsItemColumn?: string, // e.g. 'Id'
	parentService: IEntitySelection<PT>;
	deleteSupported?: boolean, // for spltUpstreamItem container, its value should be false
	createSupported?: boolean, // for spltUpstreamItem container, its value should be false
}
