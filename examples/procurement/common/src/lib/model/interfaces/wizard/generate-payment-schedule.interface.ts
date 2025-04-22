export interface IGeneratePaymentSchedule {
	ScurveFk: number;
	CodeMask: string;
	DescriptionMask: string;
	TotalCost: number | null;
	TotalOcGross: number | null;
	StartWork: Date | null;
	EndWork: Date | null;
	ExchangeRate: number | null;
	VatPercent: number | null;
	HeaderFk: number | null;
	IsDelay: boolean;
	OcPercent: number | null;
	RadioType: string; // 0: sCurve,1:userFrequence
	Repeat: string;
	Occurence: number;
	Placeholder?: string;
	MultipleTotalType?: number;
	Ids?: number[];
}
