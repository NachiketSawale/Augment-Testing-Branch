export class CreateProjectAlternativeInfo{
	public projectName?: string;
	public projectName2?: string;
	public setNewAlternativeActive?: boolean;
	public alternativeDescription?: string;
	public alternativeComment?: string;
	public projectToCopyFk?: number;
	public projectTemplateToCopy?: boolean;
}

export class CreateProjectAlternativeTemplate{
	public projectToCopyFk?: number;
	public copyProjectFromTemplate?: boolean;
	public projectTemplateFk?: number;
}

// TODO: missing dynamic page
// TODO: provide two grid tables
export class CreateProjectAlternativeEntity{
	public id?: number;
	public copyEntity?: boolean;
	public code?: string;
	public description?: string;
	public isLive?: boolean;
}
export class CreateProjectAlternativeSchedules{
	public schedules = <CreateProjectAlternativeEntity>[];
}
export class CreateProjectAlternativeEstimates{
	public estimates = <CreateProjectAlternativeEntity>[];
}
export class CreateProjectAlternativeBoq{
	public copyBoq?: boolean;
	public copyLineItemSelectionStatement?: boolean;
	public copyCosInstanceHeaders?: boolean;
	public copyControllingUnits?: boolean;
	public copyCostGroupCatalogs?: boolean;
	public copyProcurementPackage?: boolean;
}
export class CreateProjectAlternativeInvolved{
	public copyBusinessPartner?: boolean;
	public copyCharacteristics?: boolean;
	public copyLocations?: boolean;
	public copyDocuments?: boolean;
	public copyExchangeRates?: boolean;
	public copySales?: boolean;
	public copyTenderResults?: boolean;
	public copyClerkRights?: boolean;
	public copyGenerals?: boolean;
	public copyKeyFigures?: boolean;
}
export class CreateProjectAlternativeSortCodes{
	public copySortCode01?: boolean;
	public copySortCode02?: boolean;
	public copySortCode03?: boolean;
	public copySortCode04?: boolean;
	public copySortCode05?: boolean;
	public copySortCode06?: boolean;
	public copySortCode07?: boolean;
	public copySortCode08?: boolean;
	public copySortCode09?: boolean;
	public copySortCode10?: boolean;
}

export class CreateProjectAlternativeConfiguration{
	public alternativeConfiguration = new CreateProjectAlternativeInfo();
	public projectTemplateConfiguration = new CreateProjectAlternativeTemplate();
	public scheduleConfiguration = new CreateProjectAlternativeSchedules().schedules;
	public estimateConfiguration = new CreateProjectAlternativeEstimates().estimates;
	public boqConfiguration = new CreateProjectAlternativeBoq();
	public involvedConfiguration = new CreateProjectAlternativeInvolved();
	public sortCodesConfiguration = new CreateProjectAlternativeSortCodes();
}