/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Identifies standard button IDs found in entity containers.
 */
 export enum EntityContainerCommand {

	/**
	 * The command to create a new record.
	 */
	CreateRecord = 'create',

	/**
	 * The command to create a new sub-record in a hierarchy.
	 */
	CreateSubRecord = 'createChild',

	/**
	 * The command to delete records.
	 */
	DeleteRecord = 'delete',

	/**
	 * The command to toggle grouping options.
	 */
	Grouping = 'grouping',

	/**
	 * The command to print data.
	 */
	Print = 'print',

	/**
	 * The command to toggle the search options.
	 */
	SearchOptions = 'search',

	/**
	 * The command to toggle the column filter.
	 */
	ColumnFilter = 'columnFilter',

	/**
	 * The menu header for clipboard options.
	 */
	Clipboard = 'clipboard',

	/**
	 * The command to copy a cell area to the clipboard.
	 */
	CopyCellArea = 'copyCellArea',

	/**
	 * The command to copy content to the clipboard.
	 */
	Copy = 'copy',

	/**
	 * The command to paste data from the clipboard.
	 */
	Paste = 'paste',

	/**
	 * The option to copy data to the clipboard with column headers.
	 */
	CopyWithHeader = 'copyWithHeader',

	/**
	 * The group for options concerning copy commands.
	 */
	ExportOptions = 'exportOptions',

	/**
	 * The menu header for container settings.
	 */
	Settings = 'settings',

	/**
	 * The command to configure a details form.
	 */
	FormConfiguration = 'formConfig',

	/**
	 * The command to modify the layout of a grid.
	 */
	GridLayout = 'gridLayout',

	/**
	 * The option to toggle visibility of the status bar.
	 */
	ShowStatusBar = 'showStatusBar',

	/**
	 * The option to toggle highlighting of read-only fields.
	 */
	MarkReadOnly = 'markReadOnly',

	/**
	 * The command to collapse the selected item(s).
	 */
	Collapse = 'collapse',

	/**
	 * The command to expand the selected item(s).
	 */
	Expand = 'expand',

	/**
	 * The command to collapse all collapsible groups or nodes.
	 */
	CollapseAll = 'collapseAll',

	/**
	 * The command to expand all collapsible groups or nodes.
	 */
	ExpandAll = 'expandAll',

	/**
	 * The command to promote a node in a hierarchy, i.e. move it one level up.
	 */
	Promote = 'promote',

	/**
	 * The command to demote a node in a hierarchy, i.e. move it one level down.
	 */
	Demote = 'demote',

	/**
	 * The group of commands used to create new items.
	 */
	CreationGroup = 'grpCreation',

	/**
	 * The group of commands used to delete items.
	 */
	DeletionGroup = 'grpDeletion',

	/**
	 * The group of commands used to expand or collapse items.
	 */
	ExpandCollapseGroup = 'grpExpandCollapse',

	/**
	 * The group of commands used to change a node's level in the hierarchy.
	 */
	ChangeHierarchyLevelGroup = 'grpChangeLevel',

	/**
	 * The group of commands used to record navigation items.
	 */
	RecordNavigationGroup = 'recordNavigationGroup',

	/**
	 * The commands for goToFirst functions.
	 */
	First = 'first',

	/**
	 * The commands for goToPrevious functions.
	 */
	Previous = 'previous',

	/**
	 * The commands for goToNext functions.
	 */
	Next = 'next',

	/**
	 * The commands for goToLast functions.
	 */
	Last = 'last',
}
