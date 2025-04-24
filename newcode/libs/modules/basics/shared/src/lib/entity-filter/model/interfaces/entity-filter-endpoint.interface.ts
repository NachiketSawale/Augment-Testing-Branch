/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing an entity filter endpoint.
 */
export interface IEntityFilterEndpoint {
	/** The url which used to get available list for list filter */
	Url: string;

	/** Use http post */
	UsePost: boolean;

	/** The payload of this url */
	Payload: unknown;
}