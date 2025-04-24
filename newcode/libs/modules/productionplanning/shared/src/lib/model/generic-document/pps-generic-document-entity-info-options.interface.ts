import { IPpsGenericDocumentBaseEntityInfoOptions } from './pps-generic-document-base-entity-info-options.interface';
export interface IPpsGenericDocumentEntityInfoOptions<PT extends object> extends IPpsGenericDocumentBaseEntityInfoOptions<PT> {
	dataProcessor?: string,
	parentFilter: string, // e.g. 'headerFk', 'taskId'
	IsParentEntityReadonlyFn?: () => boolean;
	canCreate?: boolean,
	canDelete?: boolean,
}
