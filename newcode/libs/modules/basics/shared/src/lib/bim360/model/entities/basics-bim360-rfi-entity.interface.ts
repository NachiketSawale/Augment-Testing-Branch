/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360UserEntity } from './basics-bim360-user-entity.interface';
import { IBasicsBim360AttachmentEntity } from './basics-bim360-attachment-entity.interface';
import { Translatable } from '@libs/platform/common';
import { IBasicsBim360RFICommentEntity } from './basics-bim360-rfi-comment-entity.interface';

export interface IBasicsBim360RFIEntity {
	Selected: boolean;
	Imported: boolean;
	Id: string;
	Status: string | null;
	Title: string | null;
	Description: string | null;
	DueDate: string | null;
	AssignTo: IBasicsBim360UserEntity | null;
	AssignToName: string | null;

	ProjectId: number;
	ProjectKey: string | null;
	CompanyId: number;

	DateIssued: string | null;
	DateFinished: string | null;
	Currency: string | null;
	RaisedBy: IBasicsBim360UserEntity | null;
	UpdatedBy: IBasicsBim360UserEntity | null;
	UpdatedAt: string | null;
	Manager: IBasicsBim360UserEntity | null;
	Comments: IBasicsBim360RFICommentEntity[] | null;
	Attachments: IBasicsBim360AttachmentEntity[] | null;

	/**
	 * Status display, only for frontend.
	 */
	StatusDisplay?: Translatable;
}
