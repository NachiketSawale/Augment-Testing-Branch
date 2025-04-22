/*
 * Copyright(c) RIB Software GmbH
 */

export enum DeliveryScheduleRadioSelect {
	CurrentSubPackage = 1,
	CurrentAllSubPackages = 2,
}

export enum DeliveryScheduleSourceStatus {
	EstLinkedWithSCHD = 1,
	EstNotLinkedWithSCHD = 2,
	Package = 3,
}

export enum DeliveryScheduleRepeatOptions {
	weekly = 1,
	monthly = 2,
	quarterly = 3,
	userSpecified,
}

export enum DeliveryScheduleStepSelect {
	ChooseItemScope = 0,
	ChooseItems = 1,
	SpecifySchedule = 2,
	ShowResult = 3,
}
