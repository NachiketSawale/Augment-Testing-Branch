/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEfbsheets {
	Id: number;
	Code: string;
	AverageStandardWage: number;
	CrewAverage: number;
	CrewMixAf: number;
	CrewMixAfsn: number;
	CrewSize: number;
	ExtraPay: number;
	CurrencyFk: number;
	HoursDay: number;
	InsertedAt: Date;
	InsertedBy: number;
	UpdatedAt?: Date;
	UpdatedBy?: number;
	Version: number;
	ProjectFk: number;
	TotalExtraCost: number;
	TotalHours: number;
	TotalSurcharge: number;
	WageIncrease1: number;
	WageIncrease2: number;
	WorkingDaysMonths: number;
}
