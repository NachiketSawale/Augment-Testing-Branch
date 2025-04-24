/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360UserEntity } from './basics-bim360-user-entity.interface';
import { IBasicsBim360IssueTypeEntity } from './basics-bim360-issue-type-entity.interface';
import { IBasicsBim360IssueCommentEntity } from './basics-bim360-issue-comment-entity.interface';
import { IBasicsBim360AttachmentEntity } from './basics-bim360-attachment-entity.interface';
import { Translatable } from '@libs/platform/common';

export interface IBasicsBim360IssueEntity {
	Selected: boolean;
	Imported: boolean;
	Id: string;
	Status: string | null;
	Title: string | null;
	Description: string | null;
	DueDate: string | null;
	AssignTo: IBasicsBim360UserEntity | null;
	AssignToName: string | null;
	IssueType: IBasicsBim360IssueTypeEntity | null;
	IssueSubtype: IBasicsBim360IssueTypeEntity | null;

	ProjectId: number;
	ProjectKey: string | null;
	CompanyId: number;

	DateIssued: string | null;
	DateFinished: string | null;
	Currency: string | null;
	RaisedBy: IBasicsBim360UserEntity | null;
	Comments: IBasicsBim360IssueCommentEntity[] | null;
	Attachments: IBasicsBim360AttachmentEntity[] | null;

	/**
	 * Status display, only for frontend.
	 */
	StatusDisplay?: Translatable;
}
