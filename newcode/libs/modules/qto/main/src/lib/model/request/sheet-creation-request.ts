/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * sheet creation request model
 */
export class QtoSheetCreationRequest {
	public IsItem?: boolean = false;
	public IsOverflow?: boolean = false;
	public MainItemId: number = 0;
	public PageNumber?: string = '';
	public parentId?: number = 0;

	public IsPrjBoq?: boolean = false;
	public IsPrcBoq?: boolean = false;
	public IsWipBoq?: boolean = false;
	public IsPesBoq?: boolean = false;
	public IsBillingBoq?: boolean = false;
	public IsQtoBoq?: boolean = false;

	public Number?: number = 0;
	public Numbers?: number[];
	public QtoType?: number;
}

