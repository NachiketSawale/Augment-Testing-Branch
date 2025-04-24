import { IEntitySelection } from '@libs/platform/data-access';

export interface IPpsGenericDocumentRevisionDataSrvInitOptions<PT extends object> {
	apiUrl: string,
	uploadServiceKey?: string, // e.g. 'pps-product-revision'
	parentService: IEntitySelection<PT>;
}