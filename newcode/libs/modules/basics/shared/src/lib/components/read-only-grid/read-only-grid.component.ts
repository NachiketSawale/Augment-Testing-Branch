/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { ColumnDef, IGridConfiguration } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

/**
 * component Repesent Basics Shared Read Only Grid Component
 */
@Component({
	selector: 'basics-shared-read-only-grid',
	templateUrl: './read-only-grid.component.html',
	styleUrl: './read-only-grid.component.css',
})
export class BasicsSharedReadOnlyGridComponent<T extends IEntityIdentification, PT extends IEntityIdentification> extends ContainerBaseComponent implements OnInit, OnDestroy {
	/**
	 * The data service to listen for selection changes.
	 */
	@Input() public parentService!: IEntitySelection<object>;

	/**
	 * Unique identifier for the grid.
	 */
	@Input() public gridUuid!: string;

	/**
	 * Columns to be displayed, passed through injection.
	 */
	@Input() public columnsProvider!: ColumnDef<T>[];

	/**
	 * Method to fetch data based on selection.
	 */
	@Input() public getListData!: (selected: PT) => Observable<T[]>;

	public configuration!: IGridConfiguration<T>;

	private configurationSubject = new BehaviorSubject<IGridConfiguration<T>>({
		uuid: '',
		columns: [],
		items: [],
	});
	public configuration$ = this.configurationSubject.asObservable();
	private parentSelectionSubscription?: Subscription;

	public ngOnInit(): void {
		if (this.parentService?.selectionChanged$) {
			this.parentSelectionSubscription = this.parentService.selectionChanged$.subscribe((selection) => {
				const selected = selection?.[0] || null;
				if (selected) {
					this.getListData(selected as PT).subscribe((items) => this.initializeGrid(items));
				} else {
					this.initializeGrid([]);
				}
			});
		} else {
			console.error('parentService or selectionChanged$ is undefined.');
		}

		this.initializeGrid([]);
	}

	private initializeGrid(items: T[]): void {
		this.configuration = {
			uuid: this.gridUuid,
			columns: this.columnsProvider,
			items,
		};
		this.configurationSubject.next(this.configuration);
	}

	public override ngOnDestroy(): void {
		this.parentSelectionSubscription?.unsubscribe();
	}
}
