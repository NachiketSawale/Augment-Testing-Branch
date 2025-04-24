import { IEntitySelection } from '@libs/platform/data-access';

export interface IPpsGenericDocumentDataSrvInitOptions<PT extends object> {
	apiUrl: string,
	endPoint?: string,
	uploadServiceKey?: string, // e.g. 'pps-header', 'eng-task'
	dataProcessor?: string,
	parentFilter: string,
	parentService: IEntitySelection<PT>;
	IsParentEntityReadonlyFn?: () => boolean;
}
