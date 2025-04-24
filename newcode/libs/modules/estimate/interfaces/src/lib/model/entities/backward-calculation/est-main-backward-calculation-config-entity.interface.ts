export interface IConfigEntity {
	Id: number;
	MajorCostCode: string;
	ResourceTypeFk: number;
	ResourceType: string;
	IsChange: boolean;
	ChangeValueFk: number;
	CalculationMethod: string;
}