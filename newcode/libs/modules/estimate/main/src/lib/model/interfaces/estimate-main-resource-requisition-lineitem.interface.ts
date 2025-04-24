/**
 * Interface for all the steps together
 */
export interface IReqRequisition {
	Step1: IStep1;
	Step2: IStep2;
	Step3: IStep3;
}

/**
 * Interface for Step1
 */
export interface IStep1 {
	Selection: string;
}

/**
 * Interface for Step2
 */
export interface IStep2 {
	ProcessData: IProcessData;
}

/**
 * Interface for Step3
 */
export interface IStep3 {
	Aggression: IAggression;
}

/**
 * Interface for Step2 properties
 */
export interface IProcessData {
	ProcessCostCodes: boolean;
	ProcessMaterial: boolean;
	ProcessPlant: boolean;
	ProcessResResource: boolean;
}

/**
 * Interface for Step3 properties
 */
export interface IAggression {
	ControllingUnit: boolean;
	ProcurementStructure: boolean;
}