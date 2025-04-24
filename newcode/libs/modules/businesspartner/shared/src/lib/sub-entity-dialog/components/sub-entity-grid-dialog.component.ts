import {Component, inject, InjectionToken, OnDestroy} from '@angular/core';
import {
	IEntityCreate,
	IEntityDelete, IEntityList,
	IEntityModification,
	IEntityRuntimeDataRegistry,
	IEntitySelection
} from '@libs/platform/data-access';
import {IEntityBase, IEntityIdentification} from '@libs/platform/common';
import {
	ISubEntityGridDialog,
	SUB_ENTITY_DATA_SERVICE_TOKEN,
	ISubEntityGridDialogOptions,
	ISubEntityDialog
} from '../model/sub-entity-dialog.interface';
import {
	CellChangeEvent,
	getCustomDialogDataToken, IDialogResult,
	IGridConfiguration,
	IMenuItemsList
} from '@libs/ui/common';
import {Subscription} from 'rxjs';

export type SubEntityInDialogDataService = IEntitySelection<IEntityBase & IEntityIdentification> &
	IEntityModification<IEntityBase & IEntityIdentification> &
	IEntityCreate<IEntityBase & IEntityIdentification> &
	IEntityDelete<IEntityBase & IEntityIdentification> &
	IEntityRuntimeDataRegistry<IEntityBase & IEntityIdentification> &
	IEntityList<IEntityBase & IEntityIdentification> &
	ISubEntityDialog;
export const GRID_DIALOG_OPTIONS_TOKEN = new InjectionToken<ISubEntityGridDialogOptions<IEntityBase & IEntityIdentification>>('grid-dialog-options-token');

@Component({
	selector: 'businesspartner-shared-sub-entity-grid-dialog',
	templateUrl: './sub-entity-grid-dialog.component.html',
	styleUrls: ['./sub-entity-grid-dialog.component.scss']
})
export class BusinesspartnerSharedSubEntityGridDialogComponent<T extends IEntityBase & IEntityIdentification> implements OnDestroy {
	private dataService: SubEntityInDialogDataService;
	private dialogOptions: ISubEntityGridDialogOptions<T>;

	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo;

	/**
	 * Holds the column configuration used to render the grid
	 */
	public config: IGridConfiguration<T> = {
		uuid: '',
		columns: [],
		items: [],
	};

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IDialogResult, BusinesspartnerSharedSubEntityGridDialogComponent<T>>());

	private subscription: Subscription;
	public constructor() {
		this.dataService = inject(SUB_ENTITY_DATA_SERVICE_TOKEN);
		this.dialogOptions = inject(GRID_DIALOG_OPTIONS_TOKEN) as unknown as ISubEntityGridDialogOptions<T>;
		this.dialogInfo = (function createDialogInfo(owner: BusinesspartnerSharedSubEntityGridDialogComponent<T>) {
			return owner.context;
		})(this);

		this.dataService.setTemporary();

		this.subscription = this.dataService.listChanged$
			.subscribe({
				next: list => {
					this.refreshData(list as unknown as T[]);
				}
			});
	}

	/**
	 * Returns toolbar menulist data
	 *
	 * @returns { IMenuItemsList<ISubEntityGridDialog> | undefined} Tools data.
	 */
	public get tools(): IMenuItemsList<ISubEntityGridDialog> | undefined {
		return this.dialogOptions.tools as unknown as IMenuItemsList<ISubEntityGridDialog>;
	}

	/**
	 * Menulist Context
	 *
	 * @returns {ISubEntityGridDialog} Grid dialog data.
	 */
	public get context(): ISubEntityGridDialog {
		return {
			close: this.dialogWrapper.close, // todo chi: right?
			dataService: this.dataService
		};
	}

	/**
	 * Used to pass the selected data from the grid to the dataservice
	 *
	 * @param {T[]} selectedRows.
	 */
	public onSelectionChanged(selectedRows: T[]): void {
		this.dataService.select(selectedRows);
	}

	public onCellChanged(event: CellChangeEvent<T>): void {
		this.dataService.setModified(event.item);
	}

	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	private refreshData(items: T[]) {
		this.config = {
			uuid: this.dialogOptions.gridConfig.uuid,
			columns: this.dialogOptions.gridConfig.columns || [],
			items: [...items],
			skipPermissionCheck: true,
		};
	}
}