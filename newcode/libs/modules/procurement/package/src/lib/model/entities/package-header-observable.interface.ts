export interface IPropertyChangedArgs {
	fieldKind: string;
}

export interface IPackageStructureChangedArgs extends IPropertyChangedArgs{
	isUpdateSubListDescription: boolean;
	OriginalPrcStructureId: number;
	id?: number;
	value?: string ;
}