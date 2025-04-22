export interface IPesContractLookupFilter {
	StatusIsInvoiced: boolean;
	StatusIsCanceled: boolean;
	StatusIsVirtual: boolean;
	StatusIsOrdered: boolean;
	ControllingUnit?: number;
	PrcConfigurationId?: number;
	IsFramework: boolean;
	BusinessPartnerFk?: number;
	PrcPackageFk?: number;
	PrcStructureFk?: number;
	ProjectFk?: number;
}
