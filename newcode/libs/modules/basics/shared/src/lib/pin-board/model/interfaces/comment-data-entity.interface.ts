/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

/**
 * Comment Entity
 */
export interface ICommentEntity extends IEntityBase {
	Id: number;
	CommentFk?: number;
	ClerkFk: number;
	Comment: string;
}

/**
 * Comment Data Entity for standard pin board container
 */
export interface ICommentDataEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	MainItemFk?: number;
	CommentFk?: number;
	UserDefinedText1: string;
	ChildCount: number;
	Comment: ICommentEntity;
	Children: Array<ICommentDataEntity>;
	IsNew: boolean;
	CanDelete: boolean;
	CanCascadeDelete?: boolean;
	isVisible?: boolean;
}
