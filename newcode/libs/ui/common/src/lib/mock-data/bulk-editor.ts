/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

// mock data for mockLanguageSetting
export const mockLanguageSettings = {
	test: "let's test",
	language: 'en',
	culture: 'en-gb',
};

// mock data for bulk-editor
export const modaloptions = {
	runText: 'platform.bulkEditor.run',
	saveAndRunText: 'platform.bulkEditor.saveAndRun',
	saveText: 'platform.bulkEditor.save',
	cancelBtnText: 'basics.common.cancel',
	ok: (param: Array<string>) => {
		param = ['run', 'saveAndRun', 'save'];
		return param;
	},
	cancel: () => {},
	isShown: (param: Array<string>) => {
		param = ['run', 'saveAndRun', 'save', 'cancel'];
		return param;
	},
	isDisabled: () => {},
	defaultButton: 'run' || 'saveAndRun' || 'save' || 'cancel',
};

// mock data for basics-common-rule-editor
export const ops = {
	Id: 'CompareProperty',
	DisplaydomainFk: 'lookup',
};

export const conditions = [
	{
		Id: 'ompareProperty',
		DisplaydomainFk: 'lookup' && 'relationset',
		OperatorFk: '',
		Operands: [1],
		valid: null,
	},
	{
		Id: 'CompareProperty',
		DisplaydomainFk: 'look',
		OperatorFk: 1,
		Operands: [1],
		valid: null,
	},
	{
		Id: 'Compare',
		DisplaydomainFk: 'translation',
		OperatorFk: 1,
		Operands: [1],
		valid: null,
	},
	{
		Id: '',
		DisplaydomainFk: 1 && '',
	},
];

export const objt = [
	{
		$$hashKey: 'a',
		Id: 1,
		OperatorFk: 1,
		Context: [],
	},
];

export const mgrs = {
	createSchemaGraphProvider: () => {},
	creationCondition: () => {},
	determineDomain: () => {
		const operandIndex = 2;
		return { conditions, operandIndex };
	},
	determineLookupColumn: () => {
		const lookupCol = {
			editorOptions: 'av',
		};
		return lookupCol;
	},
	getColorInfo: () => {},
	getGroupOperators: () => {},
	getLiteralOperandPath: () => {
		const operandIndex = 1;
		return { conditions, operandIndex };
	},
	getMissingPinningContext: () => {},
	getOtherOperands: () => {
		return conditions;
	},
	getPlaceHolder: () => {
		const fieldName = 'ab';
		return { conditions, fieldName };
	},
	getPropertyOperandPath: () => {
		return 0;
	},
	getUiTypeByDisplayDomainId: () => {
		return ops.DisplaydomainFk;
	},
	hasToShow: () => {
		return conditions[0];
	},
	isEditorLess: () => {},
	isFirstOperandReady: () => {},
	notifyRuleChanged: () => {},
	registerDataLoaded: () => {
		setTimeout(() => {}, 1000);
	},
	remove: () => {},
	unregisterDataLoaded: () => {},
	adaptForRule: () => {},
	getConfig: () => {
		const RuleDefinitionsToDelete = '';
		const affectedEntities = [{}, {}];
		return { RuleDefinitionsToDelete, affectedEntities };
	},
	processOutgoingRules: () => {},
	checkChildren: () => {},
	checkColumn: () => {},
	clearRulesData: () => {},
	getColumnDisplayName: () => {},
	getOperatorByType: () => {},
};

export const obj = {
	BulkConfigurationEntities: null,
	ClobsFk: null,
	ConditionFk: 0,
	ConditionFktop: 0,
	ConditiontypeFk: 0,
	Context: [],
	Description: '',
	EntityIdentifier: null,
	Id: 0,
	InsertedAt: '',
	InsertedBy: 0,
	OperatorFk: 20,
	UpdatedAt: null,
	UpdatedBy: null,
	Version: 0,
	valid: null,
	$$hashKey: '',
	Operands: [
		{
			NamedProperty: {
				FieldName: '',
			},
		},
		{
			NamedProperty: {
				FieldName: '',
			},
		},
	],
};

// mock data for bulk-editor-configuration-service-spec
export const config = [
	{
		BulkGroup: [
			[
				{
					Children: [],
					Context: [],
					Operands: [],
					Id: 1,
					Description: '',
					ConditionFk: null,
					ConditionFktop: null,
					ConditiontypeFk: 1,
					EntityIdentifier: null,
					OperatorFk: 1,
					ClobsFk: null,
					InsertedAt: '',
					InsertedBy: 1,
					UpdatedAt: null,
					UpdatedBy: null,
				},
			],
		],
		TopFk: 0,
		Id: 0,
		Description: 'null',
		ConditionFk: 0,
		Entityidentifier: '',
		InsertedAt: '',
		InsertedBy: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 20,
		valid: false,
		OperatorFk: 1,
	},
	{
		BulkGroup: [[]],
		TopFk: 0,
		Id: 0,
		Description: null,
		ConditionFk: 0,
		Entityidentifier: '',
		InsertedAt: '',
		InsertedBy: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 0,
		valid: false,
		OperatorFk: 1,
	},
	{
		BulkGroup: [[]],
		TopFk: 0,
		Id: 0,
		Description: null,
		ConditionFk: 0,
		Entityidentifier: '',
		InsertedAt: '',
		InsertedBy: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 0,
		valid: false,
		OperatorFk: 1,
	},
	{
		BulkGroup: [
			[
				{
					Children: [],
					Context: [],
					Operands: [],
					Id: 1,
					Description: '',
					ConditionFk: null,
					ConditionFktop: null,
					ConditiontypeFk: 1,
					EntityIdentifier: null,
					OperatorFk: 1,
					ClobsFk: null,
					InsertedAt: '',
					InsertedBy: 1,
					UpdatedAt: null,
					UpdatedBy: null,
				},
			],
		],
		TopFk: 0,
		Id: 0,
		Description: '',
		ConditionFk: 0,
		Entityidentifier: '',
		InsertedAt: '',
		InsertedBy: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 20,
		valid: false,
		OperatorFk: 1,
	},
];

export const selectedcolumn = {
	userLabelName: '',
	behavior: '',
	bulkSupport: true,
	columnFilterString: '',
	cssClass: '',
	defaultSortAsc: false,
	domain: '',
	editor$name: '',
	field: '',
	focusable: false,
	formatter$name: '',
	gridUid: '',
	grouping: {
		title: '',
		getter: '',
		aggregateCollapsed: false,
		generic: false,
	},
	headerCssClass: null,
	hidden: false,
	id: '',
	keyboard: {
		enter: false,
		tab: false,
	},
	maxLength: 0,
	minWidth: 0,
	name: '',
	name$tr$: '',
	navigator: {
		moduleName: '',
		targetID: '',
	},
	pinned: false,
	required: false,
	rerenderOnResize: false,
	resizable: false,
	searchable: false,
	selectable: false,
	sort: false,
	sortable: false,
	toolTip: '',
	toolTip$tr$: '',
	width: 0,
};

export const selectedcolumns = [
	{
		userLabelName: '',
		behavior: '',
		bulkSupport: true,
		columnFilterString: '',
		cssClass: '',
		defaultSortAsc: false,
		domain: '',
		editor$name: '',
		field: '',
		focusable: false,
		formatter$name: '',
		gridUid: '',
		grouping: {
			title: '',
			getter: '',
			aggregateCollapsed: false,
			generic: false,
		},
		headerCssClass: null,
		hidden: false,
		id: '',
		keyboard: {
			enter: false,
			tab: false,
		},
		maxLength: 0,
		minWidth: 0,
		name: '',
		name$tr$: '',
		navigator: {
			moduleName: '',
			targetID: '',
		},
		pinned: false,
		required: false,
		rerenderOnResize: false,
		resizable: false,
		searchable: false,
		selectable: false,
		sort: false,
		sortable: false,
		toolTip: '',
		toolTip$tr$: '',
		width: 0,
	},
];

export const validation = {
	// asyncValidateAssetMasterFk: () => { },
	// asyncValidateBusinessPartnerFk: () => { },
	// asyncValidateContactFk: () => { },
	// asyncValidateCustomerFk: () => { },
	// asyncValidateProjectNo: () => { },
	// validateCatalogConfigTypeFk: () => { },
	// validateClerkFk: () => { },
	// validateEndDate: () => { },
	// validateGroupFk: () => { },
	// validatePrjContentTypeFk: () => { },
	// validateProjectNo: () => { },
	// validateRubricCategoryFk: () => { },
	// validateStartDate: () => { },
	// validateEmail: () => { }

	asyncValidateAssetMasterFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	asyncValidateBusinessPartnerFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	asyncValidateContactFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	asyncValidateCustomerFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	asyncValidateProjectNo: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateCatalogConfigTypeFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateClerkFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateEndDate: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateGroupFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	validatePrjContentTypeFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateProjectNo: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateRubricCategoryFk: function (): {} {
		throw new Error('Function not implemented.');
	},
	validateStartDate: function (): {} {
		throw new Error('Function not implemented.');
	},
};

export const gridconfig = {
	serverSideBulkProcessing: true,
	cellChangeCallBack: () => {},
	enableConfigSave: true,
	enableCopyPasteExcel: true,
	grouping: true,
	initCalled: true,
	rowChangeCallBack: () => {},
};

export const affectedentities = [
	{
		AddressEntity: { CountryDescription: null, CountryISO2: null, StateDescription: null, Id: 1019040, CountryFk: 56 },
		AddressFk: 1019040,
		AssetMasterFk: 1000069,
		BasBlobsFk: null,
		BillingSchemaFk: 1000098,
		BudgetCodeFk: null,
		BusinessPartnerFk: 1000978,
		BusinessUnitFk: 6,
		CalendarFk: 1,
		CallOffDate: () => {},
		CallOffNo: null,
		CallOffRemark: null,
		CatalogConfigFk: 2000255,
		CatalogConfigTypeFk: null,
		CheckPermission: false,
		ClassificationFk: null,
		ClerkFk: 1000180,
		ClosingDatetime: null,
		ClosingLocation: null,
		CompanyFk: 1,
		CompanyResponsibleFk: 1,
		ContactFk: null,
		ContentEntity: null,
		ContentTypeEntity: null,
		ContractNo: null,
		ContractTypeFk: 1,
		ControllingUnitTemplateFk: 5,
		CostgroupCatEntities: null,
		CountryFk: 56,
		CurrencyFk: 1,
		CustomerFk: null,
		CustomerGroupFk: 3,
		DateEffective: () => {},
		DateReceipt: () => {},
		Distance: null,
		Email: null,
		EndDate: () => {},
		GroupFk: 1,
		HandoverDate: null,
		Id: 10002365,
		InsertedAt: () => {},
		InsertedBy: 1546,
		InternetWebCam: null,
		IsAdministration: false,
		IsInterCompany: true,
		IsLive: true,
		IsTemplate: false,
		KeyfigureEntities: null,
		LanguageContractFk: 2,
		LineItemContextId: 1,
		MainProject: 0,
		Matchcode: 'TEST ALM2 104649',
		Overnight: null,
		PaymentTermFiFk: 1000015,
		PaymentTermPaFk: 1000015,
		PermissionObjectInfo: '',
		PlannedAwardDate: null,
		PrjCategoryFk: null,
		PrjClassificationFk: null,
		PrjContentFk: null,
		PrjContentTypeFk: null,
		PrjKindFk: 1000003,
		Project2BusinessPartnerEntities: null,
		Project2basAddressEntities: null,
		Project2certificateEntities: null,
		ProjectContextFk: 1000000,
		ProjectDescription: 'test1',
		ProjectDocPath: null,
		ProjectEntities_PrjProjectMainFk: null,
		ProjectEntity_PrjProjectMainFk: null,
		ProjectIndex: 0,
		ProjectIndexAlpha: '0',
		ProjectMainFk: null,
		ProjectName: 'Test ALM2 104649',
		ProjectName2: '2',
		ProjectNo: '01377',
		ProjectPath: null,
		PublicationDate: null,
		RealEstateFk: null,
		RegionFk: 1,
		Remark: null,
		RubricCatLocationFk: null,
		RubricCategoryFk: 2,
		SaleEntity: null,
		SearchPattern: '01377Test ALM2 1046492StuttgartLautlinger Weg 3',
		StartDate: () => {},
		StatusFk: 1000004,
		SubsidiaryFk: 1000992,
		TelephoneMobil: null,
		TelephoneMobilFk: null,
		TelephoneNumber: null,
		TelephoneNumberFk: null,
		TelephoneNumberTelefax: null,
		TelephoneTelefaxFk: null,
		TenderDate: null,
		TenderRemark: null,
		TypeFk: 5,
		UpdatedAt: () => {},
		UpdatedBy: 2117,
		Userdefined1: '1000',
		Userdefined2: '',
		Userdefined3: null,
		Userdefined4: null,
		Userdefined5: null,
		Version: 59,
		WICFk: null,
		WarrentyEnd: null,
		WarrentyRemark: null,
		WarrentyStart: null,
		WorkCategoryFk: null,
		businessPartnerItem: null,
		projectMainStatusItem: { Description: 'Bid submitted', Id: 1000004, sorting: 2, isLive: true, isDefault: null },
		subsidiary: null,
	},
];

export const changeObject = {
	affectedProperty: '',
	asyncValidationResult: true,
	desiredValue: null,
	desiredValue2: null,
	id: 1,
	isChanged: true,
	isReadonly: true,
	propertyDisplayMember: '',
	validationResult: true,
	valueAlreadyAssigned: true,
};

export const configuredrules = [
	{
		BulkGroup: [
			[
				{
					$$hashKey: 'object:1590',
					BulkConfigurationEntities: null,
					Children: [
						{
							$$hashKey: 'object:1598',
							Context: [],
							Operands: [
								{
									NamedProperty: {
										FieldName: 'businessunitfk',
									},

									Literal: {
										String: 1,
									},
								},
							],
							Id: -1,
							Description: 'Rule 1002684',
							ConditionFk: 1002683,
							ConditionFktop: 1002683,
							ConditiontypeFk: 2,
							EntityIdentifier: null,
							OperatorFk: 1,
							ClobsFk: null,
							InsertedAt: '0001-01-01T00:00:00Z',
							InsertedBy: 0,
							UpdatedAt: null,
							UpdatedBy: null,
							Version: 0,
							BulkConfigurationEntities: null,
							valid: true,
						},
					],
					ClobsFk: null,
					ConditionFk: null,
					ConditionFktop: null,
					ConditiontypeFk: 1,
					Context: [],
					Description: 'Group ',
					EntityIdentifier: null,
					Id: 1002683,
					InsertedAt: '0001-01-01T00:00:00Z',
					InsertedBy: 0,
					Operands: [
						{
							NamedProperty: {
								FieldName: '',
							},
							Literal: {
								String: 1,
							},
						},
					],
					OperatorFk: 1,
					UpdatedAt: null,
					UpdatedBy: null,
					Version: 0,
				},
			],
		],
		TopFk: 0,
		Id: 0,
		Description: 'null',
		ConditionFk: 0,
		Entityidentifier: '',
		InsertedAt: '',
		InsertedBy: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 20,
		valid: false,
		OperatorFk: 1,
		Operands: [
			{
				NamedProperty: {
					FieldName: '',
				},
				Literal: {
					String: 1,
				},
			},
		],
	},
	{
		BulkGroup: [
			[
				{
					$$hashKey: 'object:1590',
					BulkConfigurationEntities: null,
					Children: [
						{
							$$hashKey: 'object:1598',
							Context: [],
							Operands: [
								{
									NamedProperty: {
										FieldName: 'businessunitfk',
									},

									Literal: {
										String: 1,
									},
								},
							],
							Id: -1,
							Description: 'Rule 1002684',
							ConditionFk: 1002683,
							ConditionFktop: 1002683,
							ConditiontypeFk: 2,
							EntityIdentifier: null,
							OperatorFk: 1,
							ClobsFk: null,
							InsertedAt: '0001-01-01T00:00:00Z',
							InsertedBy: 0,
							UpdatedAt: null,
							UpdatedBy: null,
							Version: 0,
							BulkConfigurationEntities: null,
							valid: true,
						},
					],
					ClobsFk: null,
					ConditionFk: null,
					ConditionFktop: null,
					ConditiontypeFk: 1,
					Context: [],
					Description: 'Group ',
					EntityIdentifier: null,
					Id: 1002683,
					InsertedAt: '0001-01-01T00:00:00Z',
					InsertedBy: 0,
					Operands: [
						{
							NamedProperty: {
								FieldName: '',
							},
							Literal: {
								String: 1,
							},
						},
					],
					OperatorFk: 1,
					UpdatedAt: null,
					UpdatedBy: null,
					Version: 0,
				},
			],
		],
		TopFk: 0,
		Id: 0,
		Description: null,
		ConditionFk: 0,
		Entityidentifier: '',
		InsertedAt: '',
		InsertedBy: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 0,
		valid: false,
		OperatorFk: 1,
		Operands: [
			{
				NamedProperty: {
					FieldName: '',
				},
				Literal: {
					String: 1,
				},
			},
		],
	},
	{
		BulkGroup: [
			[
				{
					$$hashKey: 'object:1590',
					BulkConfigurationEntities: null,
					Children: [
						{
							$$hashKey: 'object:1598',
							Context: [],
							Operands: [
								{
									NamedProperty: {
										FieldName: 'businessunitfk',
									},

									Literal: {
										String: 1,
									},
								},
							],
							Id: -1,
							Description: 'Rule 1002684',
							ConditionFk: 1002683,
							ConditionFktop: 1002683,
							ConditiontypeFk: 2,
							EntityIdentifier: null,
							OperatorFk: 1,
							ClobsFk: null,
							InsertedAt: '0001-01-01T00:00:00Z',
							InsertedBy: 0,
							UpdatedAt: null,
							UpdatedBy: null,
							Version: 0,
							BulkConfigurationEntities: null,
							valid: true,
						},
					],
					ClobsFk: null,
					ConditionFk: null,
					ConditionFktop: null,
					ConditiontypeFk: 1,
					Context: [],
					Description: 'Group ',
					EntityIdentifier: null,
					Id: 1002683,
					InsertedAt: '0001-01-01T00:00:00Z',
					InsertedBy: 0,
					Operands: [
						{
							NamedProperty: {
								FieldName: '',
							},
							Literal: {
								String: 1,
							},
						},
					],
					OperatorFk: 1,
					UpdatedAt: null,
					UpdatedBy: null,
					Version: 0,
				},
			],
		],
		ConditionFk: 1002683,
		Description: null,
		Entityidentifier: 'project.main.projects',
		Id: 1002234,
		InsertedAt: '0001-01-01T00:00:00Z',
		InsertedBy: 0,
		TopFk: 0,
		UpdatedAt: null,
		UpdatedBy: null,
		Version: 0,
		valid: true,
		OperatorFk: 1,
		Operands: [
			{
				NamedProperty: {
					FieldName: '',
				},
				Literal: {
					String: 1,
				},
			},
		],
	},
];
