/*
 * Copyright(c) RIB Software GmbH
 */

export interface IOriginalField {
	/**
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/**
	 * Code
	 */
	Code?: string | null;

	/**
	 * CurrencyFk
	 */
	CurrencyFk: number;

	/**
	 * DatePricefixing
	 */
	DatePricefixing?: string | null;

	/**
	 * DateQuoted
	 */
	DateQuoted: string;

	/**
	 * DateReceived
	 */
	DateReceived?: string | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * EvaluationRank
	 */
	EvaluationRank?: string | null;

	/**
	 * EvaluationResult
	 */
	EvaluationResult?: string | null;

	/**
	 * ExchangeRate
	 */
	ExchangeRate?: number | null;

	/**
	 * IsIdealBidder
	 */
	IsIdealBidder: boolean;

	/**
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/**
	 * PaymentTermPaFk
	 */
	PaymentTermPaFk?: number | null;

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
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * ReqHeaderId
	 */
	ReqHeaderId: number;

	/**
	 * RfqHeaderId
	 */
	RfqHeaderId: number;

	/**
	 * StatusFk
	 */
	StatusFk: number;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/**
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/**
	 * package2HeaderId
	 */
	package2HeaderId?: number | null;
}
