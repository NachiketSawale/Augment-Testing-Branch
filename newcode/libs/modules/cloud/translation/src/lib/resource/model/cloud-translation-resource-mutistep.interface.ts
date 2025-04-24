/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * configuration of mutistep dialog
 */
export interface IMultistepModelConfigObj {
	/**
	 * New Glossary Config
	 */
	newGlossaryConfig?: INewGlossaryConfig[];

	/**
	 * Assignment Config
	 */
	assignmentConfig?: IAssignmentConfig[];

	/**
	 * Normalization Config
	 */
	normalizationConfig?: INormalizationConfig[];
}

/**
 * New Glossary Config Api Response
 */
export interface INewGlossaryConfigResponse {
	/**
	 * api status of message
	 */
	Message: string;
	/**
	 * main resource Data
	 */
	OrphanResources: INewGlossaryConfig[];
}
/**
 * New Glossary Config
 */
export interface INewGlossaryConfig {
	/**
	 *  Resource Term
	 */
	ResourceTerm: string;

	/**
	 * Count
	 */
	Count: number;
}

/**
 * Assignment Config Api Response
 */
export interface IAssignmentConfigResponse {
	/**
	 * Api sucess of messsage
	 */
	Message: string;
	/**
	 * main data
	 */
	ChangedResources: IAssignmentConfig[];
}

/**
 * Assignment Item Config
 */
export interface IAssignmentConfig {
	/**
	 * Id
	 */
	Id?: number | string;

	/**
	 *  Resource Term
	 */
	ResourceTerm?: string;

	/**
	 * TlsResourceFk
	 */
	TlsResourceFk?: number;

	/**
	 * Path
	 */
	Path?: string | number;

	/**
	 * Exclude
	 */
	Exclude?: boolean;

	/**
	 * AssignedTo
	 */
	AssignedTo?: string | number;

	/**
	 * ChildItems
	 */
	ChildItems?: IAssignmentConfig[];

	/**
	 * ParentId
	 */
	ParentId?: number | string;
}

/**
 * Normalization Config Api Response
 */
export interface INormalizationConfigResponse {
	/**
	 * FileUrl
	 */
	FileUrl: string;

	/**
	 * main load data
	 */
	Message: INormalizationConfig[];
}

/**
 * Normalization Config Object
 */
export interface INormalizationConfig {
	/**
	 * Id
	 */
	Id?: number | string;

	/**
	 * Title
	 */
	Title: string;

	/**
	 * Message
	 */
	Message: string;

	/**
	 * ParentId
	 */
	ParentId?: number | string;

	/**
	 * ChildItems
	 */
	ChildItems?: INormalizationConfig[];
}
