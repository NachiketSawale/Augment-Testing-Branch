/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPrcItemAssignmentHelper {
	IsManually?: boolean;
	LineItemFk?: number;
	EstHeaderFk?: number;
	ResourceFk?: number;
	PrcPackageFk: number;
	MainItemId: number;
	BoqHeaderId?: number;
	BoqItemId?: number;
}