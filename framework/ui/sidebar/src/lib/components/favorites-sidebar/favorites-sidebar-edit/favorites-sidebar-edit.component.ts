/*
 * Copyright(c) RIB Software GmbH
 */

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges, inject } from '@angular/core';

import { UiSidebarFavoritesService } from '../../../services/sidebar-favorites.service';

import { ISidebarFavoriteAccordionData } from '../../../model/interfaces/favorites/sidebar-favorites-accordion-data.interface';
import { ISidebarFavorites } from '../../../model/interfaces/favorites/sidebar-favorites.interface';

/**
 * Implements the sidebar operation in edit/sortable mode.
 */
@Component({
	selector: 'ui-sidebar-favorites-sidebar-edit',
	templateUrl: './favorites-sidebar-edit.component.html',
	styleUrls: ['./favorites-sidebar-edit.component.scss'],
})
export class UiSidebarFavoritesSidebarEditComponent implements OnChanges, AfterViewChecked {
	/**
	 * Accordion Data received.
	 */
	@Input() public favoriteAccordionData: ISidebarFavoriteAccordionData[] = [];

	/**
	 * Event to emit on item delete.
	 */
	@Output() public deleted = new EventEmitter<number>();

	/**
	 * Filtered Accordion data to diaplay.
	 */
	public favoritesData: ISidebarFavoriteAccordionData[] = [];

	/**
	 * Base class that provides change detection functionality.
	 */
	private cdRef = inject(ChangeDetectorRef);

	/**
	 * Sidebar favorites service instance.
	 */
	private sidebarFavoriteService = inject(UiSidebarFavoritesService);

	/**
	 * A wrapper around a native element inside of a View.
	 */
	private hostElement = inject(ElementRef);

	/**
	 * Renderer is used to bypass Angular's templating and make custom UI changes that can't be expressed declaratively.
	 */
	private renderer = inject(Renderer2);

	/**
	 * Function detects the changes in input value and initializes the component.
	 *
	 * @param {SimpleChanges} changes Favorites data.
	 */
	public ngOnChanges(changes: SimpleChanges) {
		if (changes && changes['favoriteAccordionData'].currentValue) {
			this.initializeFavoritesData();
		}
	}

	/**
	 * Function hides the accordion panel toggle icon in edit mode.
	 */
	public ngAfterViewChecked() {
		this.toggleExpandIcon();
	}

	/**
	 * Initializes the favorites data based on the input data received.
	 */
	public initializeFavoritesData() {
		this.favoritesData = [];
		this.favoriteAccordionData.forEach((data) => {
			const accordionData = { ...data };
			accordionData.hasChild = false;
			accordionData.expanded = false;
			this.favoritesData.push(accordionData);
		});
		this.cdRef.detectChanges();
	}

	/**
	 * Function gets called when delete button for project is clicked.
	 *
	 * @param {number|undefined} id Unique project id.
	 */
	public onProjectDeleteClick(id: number | undefined) {
		this.deleted.emit(id);
	}

	/**
	 * Function performs the sort operation on accordion items.
	 *
	 * @param {CdkDragDrop<ISidebarFavoriteAccordionData[]>} event Sort event.
	 */
	public processSortItems(event: CdkDragDrop<ISidebarFavoriteAccordionData[]>) {
		moveItemInArray(this.favoriteAccordionData, event.previousIndex, event.currentIndex);
		this.favoriteAccordionData.forEach((data: ISidebarFavoriteAccordionData, i: number) => {
			if (data.projectId) {
				const item: ISidebarFavorites = this.sidebarFavoriteService.favoritesSettings[data.projectId];
				if (item) {
					const _projectName = this.sidebarFavoriteService.isJsonObj(item.projectName) ? JSON.parse(item.projectName).projectName : item.projectName;
					item.projectName = JSON.stringify({ projectName: _projectName, sort: i });
					this.sidebarFavoriteService.favoritesSettings[data.projectId] = item;
				}
			}
		});
		this.sidebarFavoriteService.saveFavoritesSetting$().subscribe();
		this.initializeFavoritesData();
	}

	/**
	 * Function hides the accordion panel toggle icon in edit mode.
	 */
	private toggleExpandIcon() {
		const elementCollection = this.hostElement.nativeElement.querySelectorAll('.mat-expansion-indicator');
		elementCollection.forEach((element: HTMLElement) => {
			this.renderer.setStyle(element, 'display', 'none');
		});
	}
}
