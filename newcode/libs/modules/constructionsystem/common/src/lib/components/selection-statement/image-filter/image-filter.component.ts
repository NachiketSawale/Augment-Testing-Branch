/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { IFilterDefinitionEntity } from '../../../model/entities/selection-statement/filter-definition-entity.interface';
import { PlatformCommonModule } from '@libs/platform/common';
@Component({
	selector: 'constructionsystem-common-image-filter',
	templateUrl: './image-filter.component.html',
	styleUrls: ['./image-filter.component.scss'],
	standalone: true,
	imports: [NgIf, NgOptimizedImage, NgForOf, PlatformCommonModule],
})
export class ImageFilterComponent {
	@Input() public options: IFilterDefinitionEntity[] = [];
	@Input() public selectedValue: number | undefined;
	@Output() public selectedValueChange = new EventEmitter<number>();

	public isOpen = false;
	public searchQuery = '';
	public get selectedOption(): IFilterDefinitionEntity | undefined {
		return this.options.find((opt) => opt.Id === this.selectedValue);
	}
	public get filteredOptions(): IFilterDefinitionEntity[] {
		if (!this.searchQuery) {
			return this.options;
		}
		return this.options.filter((option) => option.DisplayName.toLowerCase().includes(this.searchQuery.toLowerCase()));
	}

	public toggleDropdown(event: Event): void {
		event.stopPropagation();
		this.isOpen = !this.isOpen;
		if (this.isOpen) {
			// Reset search when dropdown opens
			this.searchQuery = '';
			// Focus search input after dropdown animation completes
			setTimeout(() => {
				const searchInput = document.querySelector('.image-filter-search input');
				if (searchInput) {
					(searchInput as HTMLElement).focus();
				}
			}, 100);
		}
	}

	public closeDropdown(): void {
		this.isOpen = false;
		this.searchQuery = '';
	}

	public selectOption(value: number): void {
		this.selectedValue = value;
		this.selectedValueChange.emit(value);
		this.closeDropdown();
	}

	// Handle click outside to close dropdown
	@HostListener('document:click', ['$event'])
	public onDocumentClick(): void {
		if (this.isOpen) {
			this.closeDropdown();
		}
	}

	public onSearchInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.searchQuery = input.value;
	}

	public clearSearch(): void {
		this.searchQuery = '';
		const searchInput = document.querySelector('.image-filter-search input');
		if (searchInput) {
			(searchInput as HTMLInputElement).value = '';
			(searchInput as HTMLElement).focus();
		}
	}
}
