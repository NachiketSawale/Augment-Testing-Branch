

export interface IPackage2HeaderCreateRequest  {
	MainItemId:number
	StructureFk?:number | null;
	ConfigurationFk: number;
	MdcControllingunitFk?: number;
	MdcTaxCodeFk: number;
	ProjectFk: number;
}
