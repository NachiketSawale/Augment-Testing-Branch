/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import {
	CellChangeEvent,
	ColumnDef,
	FieldType,
	getCustomDialogDataToken,
	GridComponent,
	IDialog,
	IGridConfiguration,
	ILookupViewResult,
	IMenuItemsList,
	ItemType,
	LookupContext,
	LookupGridViewBase,
	StandardDialogButtonId,
	UiCommonModule,
} from '@libs/ui/common';
import { ATTENDEE_LOOKUP_OPTION_TOKEN, IMtgClerkEntity } from '@libs/basics/interfaces';
import { BasicsMeetingAttendeeSearchClerkEntityGridService } from '../../services/create-meeting/basics-meeting-attendee-search-clerk-entity-grid.service';
import { KeyboardCode, PlatformCommonModule, PlatformHttpService } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
//TODO: circular dependency
//import { BusinessPartnerLookupService, IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/shared';
import { BasicsMeetingAttendeeSearchContactEntityGridService } from '../../services/create-meeting/basics-meeting-attendee-search-contact-entity-grid.service';

@Component({
	selector: 'basics-shared-meeting-attendee-lookup-dialog',
	templateUrl: './attendee-lookup-dialog.component.html',
	styleUrls: ['./attendee-lookup-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, UiCommonModule, DatePipe, NgIf, NgForOf, NgClass, GridComponent],
	standalone: true,
})
export class BasicsMeetingAttendeeLookupDialogComponent<TItem extends IMtgClerkEntity, TEntity extends object = object> extends LookupGridViewBase<TItem, TEntity> implements OnInit, AfterViewInit {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ILookupViewResult<IMtgClerkEntity>, BasicsMeetingAttendeeLookupDialogComponent<TItem, TEntity>>());
	protected lookupContext = inject(LookupContext<TItem, TEntity>);
	private readonly http = inject(PlatformHttpService);
	private readonly clerkEntityGridService = inject(BasicsMeetingAttendeeSearchClerkEntityGridService<TItem>);
	private readonly contactEntityGridService = inject(BasicsMeetingAttendeeSearchContactEntityGridService<TItem>);
	public readonly attendeeLookupOption = inject(ATTENDEE_LOOKUP_OPTION_TOKEN);
	//public readonly businessPartnerLookupService = inject(BusinessPartnerLookupService<IBusinessPartnerSearchMainEntity>);
	public page = new MtgAttendeePage();
	@ViewChild('input')
	public input!: ElementRef<HTMLInputElement>;
	public userInput: string = '';
	public selectedItems: TItem[] = [];
	public selectedBp: number | null = null;
	public override gridConfig: IGridConfiguration<TItem> = {
		uuid: 'bb0374df49b1447e853aa4be8df928e3',
		columns: [],
		items: [],
		iconClass: null,
		enableDraggableGroupBy: true,
		enableModuleConfig: true,
		skipPermissionCheck: true,
		indicator: false,
		enableColumnReorder: false,
		enableCopyPasteExcel: true,
		//multiSelect:false,/// not support
		// lazyInit:true///
		///enableConfigSave: true,/// todo not support yet
	};

	public constructor() {
		super();
		//this.businessPartnerLookupService.config.showClearButton = true;
		this.page.enabled = true;
		this.page.pageCount = 200;
	}

	public ngOnInit(): void {
		let columns: ColumnDef<TItem>[];
		if (this.attendeeLookupOption.isLookupClerk) {
			columns = this.clerkEntityGridService.generateGridConfig();
		} else {
			columns = this.contactEntityGridService.generateGridConfig();
		}
		const extendsColum: ColumnDef<TItem>[] = [
			{
				id: 'selected',
				model: 'Selected', //cant not be absent, otherwise list data will not show
				label: {
					text: 'Selected',
					key: 'cloud.common.entitySelected',
				},
				type: FieldType.Boolean, /// todo: seems checked/unchecked filter function does not work
				width: 80,
				sortable: true,
				visible: true,
				headerChkbox: true, /// todo: callback not support yet
			},
		];
		const allColumns = [...extendsColum, ...columns];
		this.gridConfig = { ...this.gridConfig, columns: allColumns };
	}

	/***
	 * update selectedItems
	 * @param entity
	 * @private
	 */
	private updateSelectedItem(entity: TItem) {
		const exist = this.selectedItems.find((item) => item.Id == entity.Id);
		if (exist && !entity.Selected) {
			this.selectedItems = this.selectedItems.filter((item) => item.Id !== entity.Id);
		} else {
			if (!exist && entity.Selected) {
				this.selectedItems.push(entity);
			}
		}
	}

	public search(userInput?: string, copyFromContext: boolean = false, refresh: boolean = false) {
		this.isLoading = true;
		if (this.attendeeLookupOption.isLookupClerk) {
			this.searchClerk(userInput, copyFromContext);
		} else {
			this.searchContact(userInput, copyFromContext, refresh);
		}
	}

	private searchClerk(userInput?: string, copyFromContext: boolean = false) {
		let request;
		if (copyFromContext) {
			const contextClerks = this.attendeeLookupOption.contextClerks;
			request = {
				SearchValue: null,
				ClerkIds: contextClerks,
				IsFromContext: true,
			};
		} else {
			request = {
				SearchValue: userInput,
				ClerkIds: null,
				IsFromContext: false,
			};
		}
		this.http.post<TItem[]>('basics/meeting/wizard/attendeeclerklookup', request).then((result) => {
			this.setGridData(result);
			this.setList(result);
			this.isLoading = false;
			this.refreshSelectedItem();
		});
	}

	private searchContact(userInput?: string, copyFromContext: boolean = false, refresh: boolean = false) {
		if (refresh) {
			this.page.index = 0;
		}
		const additionalParameters: {
			BusinessPartnerFk?: number | null;
			ContactIds?: number[] | null;
			IsFilterByContext: boolean;
		} = {
			BusinessPartnerFk: null,
			ContactIds: null,
			IsFilterByContext: false,
		};
		let bp = null;
		if (copyFromContext) {
			if (this.attendeeLookupOption.contextContacts) {
				additionalParameters.ContactIds = this.attendeeLookupOption.contextContacts;
			}
			additionalParameters.IsFilterByContext = true;
			bp = this.attendeeLookupOption.contextBp;
		}
		if (!bp) {
			bp = this.selectedBp;
		}
		additionalParameters.BusinessPartnerFk = bp;
		const request = {
			AdditionalParameters: additionalParameters,
			FilterKey: 'meeting-attendee-contact-filter',
			PageState: {
				PageNumber: this.page.index,
				PageSize: this.page.pageCount,
			},
			SearchFields: ['FullName', 'FirstName', 'FamilyName', 'Telephone1', 'Telephone2', 'Telefax', 'Mobile', 'Email', 'ContactRoleFk'],
			SearchText: userInput,
			TreeState: { StartId: null, Depth: null },
			RequirePaging: this.page.enabled,
		};
		this.http.post$<IContactSearchList<TItem>>('basics/lookupdata/masternew/getsearchlist?lookup=contact', request).subscribe({
			next: (result) => {
				this.page.setLength(result.RecordsFound);
				if (result.SearchList) {
					this.setGridData(result.SearchList);
					this.setList(result.SearchList);
				} else {
					this.setList([]);
				}
				// $scope.tools.update();  todo tools is not working well
			},
			complete: () => {
				this.isLoading = false;
			},
		});
	}

	/**
	 * load previous page
	 */
	public override loadPreviousPage() {
		if (this.page.index <= 0) {
			return;
		}
		this.page.index--;
		this.search(this.userInput, false);
	}

	/**
	 * load next page
	 */
	public override loadNextPage() {
		if (this.page.length <= this.page.index) {
			return;
		}
		this.page.index++;
		this.search(this.userInput, false);
	}

	private setGridData(gridData: TItem[]) {
		const selectedItemIds = this.selectedItems.map((item) => item.Id);
		gridData.forEach((gridItem) => {
			if (selectedItemIds.includes(gridItem.Id)) {
				gridItem.Selected = true;
				// platformRuntimeDataService.readonly(gridItem, [{ ///todo joy:platformRuntimeDataService not support yet
				// 	field: 'Selected',
				// 	readonly: true
				// }]);
			} else {
				gridItem.Selected = false;
				// platformRuntimeDataService.readonly(gridItem, [{ ///todo joy:platformRuntimeDataService not support yet
				// 	field: 'Selected',
				// 	readonly: false
				// }]);
			}
		});
		// const checkboxElement = document.querySelectorAll('[id^=chkbox_slickgrid]'); ///todo
		// if (checkboxElement.length === 1) {
		// 	checkboxElement[0].checked = !hasFalseValue && gridData.length; // Whether all checkboxes are checked
		// 	checkboxElement[0].indeterminate = hasTrueValue && hasFalseValue; // Whether some checkboxes are selected
		// }
	}

	/**
	 * Cell change handler
	 * @param $event
	 */
	public onCellChanged($event: CellChangeEvent<TItem>) {
		if ($event.cell === 0) {
			/// the first column "selected"
			this.updateSelectedItem($event.item);
		}
	}

	// }
	///
	private refreshSelectedItem() {
		this.selectedItems = [];
		const items = this.gridData.filter((item) => {
			// todo get readonly item form grid
			// let isReadonlyItem = item.__rt$data && item.__rt$data.readonly && _.find(item.__rt$data.readonly, {field: 'Selected', readonly: true});
			// if (isReadonlyItem) {  // If readonly, keep the item selected.
			// 	item.Selected = true;
			// }
			//return item.Selected && !isReadonlyItem;
			return item.Selected;
		});

		items.forEach((item) => {
			this.selectedItems.push(item);
		});
	}

	public handleUserInput(e: KeyboardEvent) {
		switch (e.code) {
			case KeyboardCode.ENTER:
				{
					e.stopPropagation();
					this.search(this.userInput);
				}
				break;
		}
	}

	protected scrollIntoView(dataItem: TItem): void {}

	protected override select(dataItem: TItem) {
		this.dialogWrapper.value = {
			apply: true,
			result: dataItem,
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	/**
	 * Click copyFromContext button will trigger this method
	 */
	public copyFromContext() {
		this.search('', true, true);
	}

	public ngAfterViewInit() {
		setTimeout(() => {
			this.focusSearchInput();
		}, 200);
	}

	private focusSearchInput() {
		this.input.nativeElement.focus();
	}

	/**
	 * Tools above grid
	 * @protected
	 */
	protected get tools(): IMenuItemsList<IDialog> | undefined {
		return {
			// version: Math.random(), /// todo not support yet
			// update: function () {
			// 	$scope.tools.version += 1;
			// },
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Check,
					caption: { key: 'cloud.common.taskBarGrouping' },
					iconClass: 'tlb-icons ico-group-columns',
					id: 'group',
					fn: () => {
						//platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value); /// todo toolbar button is not working well now
					},
					//value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId), /// todo
					disabled: false,
				},
				{
					type: ItemType.Item,
					caption: { key: 'cloud.common.gridlayout' },
					iconClass: 'tlb-icons ico-settings',
					id: 'setting',
					fn: () => {
						//platformGridAPI.configuration.openConfigDialog($scope.gridId); /// todo
					},
				},
			],
		};
	}
}

/**
 * todo This is temporary solution, it should be  LookupDataPage
 */
class MtgAttendeePage {
	public enabled = false;
	// current page
	public index = 0;
	// total page count
	public length = 0;
	// page count
	public pageCount = 200;
	// total count
	public totalCount = 0;

	public canNext(): boolean {
		return this.index < this.length - 1;
	}

	public canPrev(): boolean {
		return this.index > 0;
	}

	public setLength(value: number) {
		this.totalCount = value;
		this.length = Math.ceil(value / this.pageCount);
	}

	public getPageInfo(): string {
		if (this.totalCount > 0) {
			const range = this.range();
			return `${range[0] + 1}-${range[1]}/${this.totalCount}`;
		}
		return '0-0/0';
	}

	private range() {
		const start = this.pageCount * this.index;
		let end = (this.index + 1) * this.pageCount;
		if (end > this.totalCount) {
			end = this.totalCount;
		}
		return [start, end];
	}
}

interface IContactSearchList<Item extends IMtgClerkEntity> {
	SearchList: Item[];
	RecordsFound: number;
}
