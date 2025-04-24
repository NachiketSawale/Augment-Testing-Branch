/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityBase } from '@libs/platform/common';

/**
 * company entity
 */
export class CompanyEntity extends EntityBase {
	/**
	 *
	 * @param Id
	 * @param EquipmentDivisionFk
	 * @param CompanyTypeFk
	 * @param LoginAllowed
	 * @param IsLive
	 * @param CurrencyFk
	 * @param LanguageFk
	 * @param CountryFk
	 * @param ContextFk
	 * @param LineItemContextFk
	 * @param SubledgerContextFk
	 * @param LedgerContextFk
	 * @param ModuleContextFk
	 * @param TextModuleContextFk
	 * @param LogisticContextFk
	 * @param IsRibArchive
	 * @param IsCalculateOverGross
	 * @param PrrMethodFk
	 * @param IsRestrictedToProfitCenter
	 * @param IsSequenceBasedOnProfitCenter
	 */

	public constructor(
		public Id: number,
		public EquipmentDivisionFk: number,
		public CompanyTypeFk: number,
		public LoginAllowed: boolean,
		public IsLive: boolean,
		public CurrencyFk: number,
		public LanguageFk: number,
		public CountryFk: number,
		public ContextFk: number,
		public LineItemContextFk: number,
		public SubledgerContextFk: number,
		public LedgerContextFk: number,
		public ModuleContextFk: number,
		public TextModuleContextFk: number,
		public LogisticContextFk: number,
		public IsRibArchive: boolean,
		public IsCalculateOverGross: boolean,
		public PrrMethodFk: number,
		public IsRestrictedToProfitCenter: boolean,
		public IsSequenceBasedOnProfitCenter: boolean
	) {
		super();
	}

	/**
	 * CompanyFk
	 */
	public CompanyFk?: number;

	/**
	 * Code
	 */
	public Code?: string;

	/**
	 * CompanyName
	 */
	public CompanyName?: string;

	/**
	 * CompanyName2
	 */
	public CompanyName2?: string;

	/**
	 * CompanyName3
	 */
	public CompanyName3?: string;

	/**
	 * ClerkFk
	 */
	public ClerkFk?: number;

	/**
	 * AddressFk
	 */
	public AddressFk?: number;

	/**
	 * Profitcenter
	 */
	public Profitcenter?: string;

	/**
	 * ValidFrom
	 */
	public readonly ValidFrom?: Date;

	/**
	 * ValidTo
	 */
	public readonly ValidTo?: Date;

	/**
	 * Signatory
	 */
	public Signatory?: string;

	/**
	 * TelephonePattern
	 */
	public TelephonePattern?: string;

	/**
	 * TelephoneNumberFk
	 */
	public TelephoneNumberFk?: number;

	/**
	 * TelefaxPattern
	 */
	public TelefaxPattern?: string;

	/**
	 * TelephoneTelefaxFk
	 */
	public TelephoneTelefaxFk?: number;

	/**
	 * Email
	 */
	public Email?: string;

	/**
	 * Internet
	 */
	public Internet?: string;

	/**
	 * BillingSchemaFk
	 */
	public BillingSchemaFk?: number;

	/**
	 * PaymentTermFiFk
	 */
	public PaymentTermFiFk?: number;

	/**
	 * BlobsFk
	 */
	public BlobsFk?: number;

	/**
	 * SearchPattern
	 */
	public SearchPattern?: string;

	/**
	 * DefectContextFk
	 */
	public DefectContextFk?: number;

	/**
	 * DefectContextFk
	 */
	public TimesheetContextFk?: number;

	/**
	 * ProjectContextFk
	 */
	public ProjectContextFk?: number;

	/**
	 * PriceConditionFk
	 */
	public PriceConditionFk?: number;

	/**
	 * TaxCodeFk
	 */
	public TaxCodeFk?: number;

	/**
	 * CalendarFk
	 */
	public CalendarFk?: number;

	/**
	 * SchedulingContextFk
	 */
	public SchedulingContextFk?: number;

	/**
	 * DunsNo
	 */
	public DunsNo?: string;

	/**
	 * ExternalCode
	 */
	public ExternalCode?: string;

	/**
	 * CrefoNo
	 */
	public CrefoNo?: string;

	/**
	 * VatNo
	 */
	public VatNo?: string;

	/**
	 * TaxNo
	 */
	public TaxNo?: string;

	/**
	 * UserDefined1
	 */
	public UserDefined1?: string;

	/**
	 * UserDefined2
	 */
	public UserDefined2?: string;

	/**
	 * UserDefined3
	 */
	public UserDefined3?: string;

	/**
	 * UserDefined4
	 */
	public UserDefined4?: string;

	/**
	 * UserDefined5
	 */
	public UserDefined5?: string;

	/**
	 * BusinessPartnerFk
	 */
	public BusinessPartnerFk?: number;

	/**
	 * HsqContextFk
	 */
	public HsqContextFk?: number;
}