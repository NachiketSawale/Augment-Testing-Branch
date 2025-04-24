export interface IWorkflowActionInstance{
	Id: number;
	Description: string;
	Comment: string;
	Context: string;
	Started: Date;
	IsRunning: boolean;
	WorkflowInstanceId: number;
	ActionId: string;
	Endtime?: Date;
	Result: string;
	UserDefinedMoney1?: number;
	UserDefinedMoney2?: number;
	UserDefinedMoney3?: number;
	UserDefinedMoney4?: number;
	UserDefinedMoney5?: number;
	UserDefinedDate1?: Date;
	UserDefinedDate2?: Date;
	UserDefinedDate3?: Date;
	UserDefinedDate4?: Date;
	UserDefinedDate5?: Date;
}