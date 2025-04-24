import { IPpsEntityInfoOptionsWithFkProperties } from './pps-entity-info-options-with-fk-properties.interface';
//import { IPpsEntityInfoOptions } from './pps-entity-info-options.interface';
export interface IPpsDocumentEntityInfoOptions<PT extends object> extends IPpsEntityInfoOptionsWithFkProperties<PT> {
	//export interface IPpsDocumentEntityInfoOptions<PT extends object> extends IPpsEntityInfoOptions<PT> {
	// endPoint?: string,
	// foreignKey: string,
	idProperty?: string,
	selectedItemIdProperty?: string,
	IsParentEntityReadonlyFn?: () => boolean,
	canCreate?: boolean,
	canDelete?: boolean,

	/* is used for containers: 
		productionplanning.drawing.ppsdocument.list
		productionplanning.drawing.productdescription.ppsdocument.list
		productionplanning.engineering.cadImport.ppsdocument.list
		productionplanning.engineering.cadImport.productdescription.ppsdocument.list
	*/
	instantPreview?: boolean,

	// is used for trsReqDocumentLookupDataService of old angularjs code
	provideLoadPayloadFn?: () => object,

}