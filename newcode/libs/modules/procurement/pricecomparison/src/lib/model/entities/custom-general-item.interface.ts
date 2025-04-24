/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICustomGeneralItem {

	/**
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/**
	 * ConfigurationId
	 */
	ConfigurationId: number;

	/**
	 * GeneralTypeId
	 */
	GeneralTypeId: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * PrcHeaderId
	 */
	PrcHeaderId: number;

	/**
	 * QtnHeaderId
	 */
	QtnHeaderId: number;

	/**
	 * QtnVersion
	 */
	QtnVersion: number;

	/**
	 * QuoteKey
	 */
	QuoteKey?: string | null;

	/**
	 * ReqHeaderId
	 */
	ReqHeaderId: number;

	/**
	 * Value
	 */
	Value: number;
}
