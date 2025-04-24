/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject, takeUntil } from 'rxjs';
import { Component, Input, inject, ElementRef, ViewChild, OnInit, OnDestroy, Type, StaticProvider, ViewEncapsulation } from '@angular/core';
import { ActivePopup, PopupService } from '@libs/ui/common';
import { IEntityFilterApplyValue, IEntityFilterDefinition, IEntityFilterProfileEntity, EntityFilterScope, IEntityFilterSearchField, EntityFilterProfileSaveOption } from '../../model';
import { BasicsSharedEntityFilterSelectionComponent } from '../entity-filter-selection/entity-filter-selection.component';
import { BasicsSharedEntityFilterSavedComponent } from '../entity-filter-saved/entity-filter-saved.component';
import { IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedEntityFilterAttributeComponent } from '../entity-filter-attribute/entity-filter-attribute.component';
import { BasicsSharedEntityFilterSearchFieldListComponent } from '../entity-filter-search-field-list/entity-filter-search-field-list.component';
import { BasicsSharedEntityFilterSearchInfoComponent } from '../entity-filter-search-info/entity-filter-search-info.component';
import { BasicsSharedEntityFilterProfileConfigComponent } from '../entity-filter-profile-config/entity-filter-profile-config.component';
import { BasicsSharedEntityFilterSaveOptionsComponent } from '../entity-filter-save-options/entity-filter-save-options.component';

/**
 * Entity filter bar component
 * This component allows the user to interact with and manage entity filters,
 * including adding new filters, viewing saved filters, and applying saved profiles.
 */
@Component({
	selector: 'basics-shared-entity-filter-bar',
	templateUrl: './entity-filter-bar.component.html',
	styleUrl: './entity-filter-bar.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class BasicsSharedEntityFilterBarComponent<TEntity extends IEntityIdentification> implements OnInit, OnDestroy {
	private readonly popupService = inject(PopupService);

	/**
	 * Used to emit value when component is destroyed.
	 * This is a Subject that allows for managing cleanup logic on component destruction.
	 */
	private destroy$ = new Subject<void>();

	/**
	 * Used to store the search info popup instance.
	 * @private
	 */
	private searchInfoPopup?: ActivePopup;

	/**
	 * Used to store active popup instances.
	 * @private
	 */
	private activePopups: ActivePopup[] = [];

	@ViewChild('btnAdd')
	private btnAdd!: ElementRef;

	@ViewChild('btnShow')
	private btnShow!: ElementRef;

	@ViewChild('btnAddAttr')
	private btnAddAttr!: ElementRef;

	@ViewChild('btnSearchFields')
	private btnSearchFields!: ElementRef;

	@ViewChild('searchInfo')
	private searchInfo!: ElementRef;

	@ViewChild('btnSaveFilter')
	private btnSaveFilter!: ElementRef;

	/**
	 * Search scope
	 * The scope defines the context in which the filters are applied.
	 */
	@Input()
	public scope!: EntityFilterScope<TEntity>;

	public ngOnInit(): void {
		// Initialize and load any predefined filter definitions for the scope
		this.scope.loadFilterDefs();
		this.scope.loadSearchFields();
	}

	public ngOnDestroy(): void {
		// Trigger the cleanup process
		this.destroy$.next();
		this.destroy$.complete();

		// Clean up and destroy any active popups
		this.activePopups.forEach((e) => e.destroy());
		this.closeSearchInfoPopup();
	}

	/**
	 * Toggles a popup window with the given owner, component, and providers.
	 * Subscribes to the popup's close event and performs cleanup.
	 * @param owner The element that owns the popup.
	 * @param component The component to be loaded in the popup.
	 * @param onClose The callback function to execute when the popup is closed.
	 * @param providers Additional providers to pass into the popup's context.
	 * @private
	 */
	private togglePopup(owner: ElementRef, component: Type<unknown>, onClose: (e: unknown) => void, providers: StaticProvider[] = []): void {
		// Open the popup with the provided component and scope
		const popup = this.popupService.toggle(owner, component, {
			providers: [
				{
					provide: EntityFilterScope<TEntity>,
					useValue: this.scope,
				},
				...providers,
			],
		});

		if (popup) {
			// Subscribe to the popup's close event and handle the result
			const subscription = popup.closed.pipe(takeUntil(this.destroy$)).subscribe((result) => {
				onClose(result); // Call the provided onClose callback with the result
				subscription.unsubscribe(); // Unsubscribe from the close event
				this.activePopups = this.activePopups.filter((e) => e !== popup); // Clean up active popups list
			});
			this.activePopups.push(popup); // Store the active popup for cleanup
		}
	}

	/**
	 * Handles the click event to show saved filters.
	 * Opens a popup with saved filter profiles and applies the selected profile.
	 */
	public showSavedFilters(): void {
		this.togglePopup(this.btnShow, BasicsSharedEntityFilterSavedComponent<TEntity>, async (result) => {
			const res = result as IEntityFilterApplyValue<IEntityFilterProfileEntity>;
			if (res?.apply) {
				// Apply the selected saved profile
				await this.scope.applyProfile(res.value);
			}
		});
	}

	/**
	 * Handles the click event to add a new filter.
	 * Opens a popup to select a filter and adds it to the scope.
	 */
	public addFilter(): void {
		this.togglePopup(this.btnAdd, BasicsSharedEntityFilterSelectionComponent<TEntity>, (result) => {
			const res = result as IEntityFilterApplyValue<IEntityFilterDefinition>;
			if (res?.apply) {
				// Add the new filter to the scope
				this.scope.addFilter(res.value);
			}
		});
	}

	/**
	 * Adds an attribute filter to the scope.
	 * Opens a popup to select an attribute filter and adds it to the scope.
	 */
	public addAttributeFilter(): void {
		this.togglePopup(this.btnAddAttr, BasicsSharedEntityFilterAttributeComponent<TEntity>, (result) => {
			const res = result as IEntityFilterApplyValue<string>;
			if (res?.apply) {
				// Add the new attribute filter to the scope
				this.scope.addAttributeFilter(res.value);
			}
		});
	}

	/**
	 * Opens the search fields settings popup.
	 * This method toggles a popup to manage search fields settings and applies the selected search fields.
	 */
	public openSearchFieldsSettings(): void {
		this.togglePopup(this.btnSearchFields, BasicsSharedEntityFilterSearchFieldListComponent<TEntity>, (result) => {
			const res = result as IEntityFilterApplyValue<IEntityFilterSearchField[]>;
			if (res?.apply) {
				// Apply the selected search fields to the scope
				this.scope.applySearchFields(res.value);
			}
		});
	}

	/**
	 * Opens the search info popup.
	 * This method opens a popup displaying search information if it is not already open.
	 */
	public openSearchInfoPopup() {
		if (this.searchInfoPopup) {
			return;
		}

		this.searchInfoPopup = this.popupService.open(this.searchInfo, BasicsSharedEntityFilterSearchInfoComponent, {
			width: 280,
		});
		const subscription = this.searchInfoPopup.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
			subscription.unsubscribe(); // Unsubscribe from the close event
			this.searchInfoPopup = undefined;
		});
	}

	/**
	 * Closes the search info popup.
	 * This method closes the currently open search info popup if it exists.
	 */
	public closeSearchInfoPopup() {
		this.searchInfoPopup?.close();
	}

	/**
	 * Handles the click event to save filters.
	 * @param event The click event.
	 */
	public async saveFilters() {
		if (this.scope.currentProfile.IsNew) {
			this.showProfileConfig();
			return;
		}

		await this.showSaveOption();
	}

	private showProfileConfig() {
		this.togglePopup(this.btnSaveFilter, BasicsSharedEntityFilterProfileConfigComponent, async (result) => {
			const success = result as IEntityFilterApplyValue<boolean>;
			if (!success) {
				throw new Error('Failed to save filter');
			}
		});
	}

	private async showSaveOption() {
		this.togglePopup(this.btnSaveFilter, BasicsSharedEntityFilterSaveOptionsComponent, async (result) => {
			const saveOption = result as IEntityFilterApplyValue<EntityFilterProfileSaveOption>;
			if (saveOption?.apply) {
				switch (saveOption?.value) {
					case EntityFilterProfileSaveOption.AsCopy:
						{
							this.showProfileConfig();
						}
						break;
					case EntityFilterProfileSaveOption.AsChange: {
						await this.scope.saveFilters();
					}
				}
			}
		});
	}
}
