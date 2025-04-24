/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The interface defines the structure of the payload required by HTTP APIs related to pin board container (create, delete, last, remain APIs).
 *
 * The specific properties that are required depend on the specific requirements and context of the called API.
 * When using this interface, it is necessary to refer to the business logic to determine which properties are mandatory and how to populate them appropriately.
 */
export interface ICommentRequestInfo {
	Qualifier?: string;
	ParentItemId?: number;
	CommentDataIdToDelete?: number;
	CommentIdToDelete?: number;
	Comment?: string;
	StatusIconFk?: number | null;
	IsParentItemNew?: boolean;
	ClerkFK?: number;
	ParentCommentId?: number | null;
	ParentItemId2?: number;
	UserDefinedText1?: string;
}
