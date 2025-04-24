/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360SaveIssuesItemResultEntity {
	IssueId: string | null;
	IsSuccess: boolean;
	Message: string | null;
	ItwoDefectId: number;
	ItwoDefectCode: string | null;
}
