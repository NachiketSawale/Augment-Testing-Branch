/*
 * Copyright(c) RIB Software GmbH
 */
/*
 * Copyright(c) RIB Software GmbH
 */

export interface IDocumentParentEntity{
	Id?: number;
	BusinessPartnerFk?: number;
	ProjectFk?: number | null; 
	JobFk?: number;
	PrcStructureFk?: number;
	StructureFk?: number;
	ConHeaderFk?: number;
	ControllingUnitFk?: number | null;
	PrcPackageFk?: number;
	PackageFk?: number | null;
	ActivityFk?: number;
	MaterialCatalogFk?: number | null;
	ModelFk?: number;
	RfqHeaderFk?: number;
	ScheduleFk?: number;
	PesHeaderFk?: number;
	PrjLocationFk?: number;
	PrjChangeFk?: number;
	ProjectInfoRequestFk?: number;
	QtoHeaderFk?: number;
	PrjCompanyFk?: number;
	PpsItemUpstreamFk?: number;
	ContactFk?: number;
	BilHeaderFk?: number;
	BpdCertificateFk?: number;
	LgmDispatchHeaderFk?: number;
	EstHeaderFk?: number;
	InvHeaderFk?: number;
	QtnHeaderFk?: number;
	ReqHeaderFk?: number;
	LgmSettlementFk?: number;
	WipHeaderFk?: number;
	OrdHeaderFk?: number;
	SubsidiaryFk?: number;
}