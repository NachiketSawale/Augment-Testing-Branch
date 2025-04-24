/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { GridComponent, IGridConfiguration, IMenuItemsList } from '@libs/ui/common';
import { BasicsEfbsheetsCopyMasterCrewMixService } from '../services/basics-efb-sheets-copy-master-crew-mix.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'basics-efbsheets-copy-master-crew-mixes',
  templateUrl: './basics-efb-sheets-copy-master-crew-mixes.component.html',
  standalone: true,
  imports: [GridComponent, CommonModule, FormsModule],
})

/**
 * BasicsEfbSheetsCopyMasterCrewMixesComponent - Component for copying master crew mixes
 */
export class BasicsEfbSheetsCopyMasterCrewMixesComponent implements OnInit {

  /**
   * Search data for the grid
   */
  public searchData: string = '';

  /**
   * Holds the grid configuration used to render the grid
   */
  public gridConfig: IGridConfiguration<IBasicsEfbsheetsEntity>;

  /**
   * Holds the tools for the grid
   */
  public tools: IMenuItemsList = {};

  /**
   * Data service for the component
   */
  private readonly dataService = inject(BasicsEfbsheetsCopyMasterCrewMixService);

  public constructor() {
    this.gridConfig = this.dataService.getStandardConfigForListView();
  }

  /**
   * ngOnInit - Angular lifecycle hook
   */
  public ngOnInit() {
    this.loadInitialData();
  }

  /**
   * loadInitialData - Load the initial data for the grid
   */
  private loadInitialData() {
    this.dataService.getListAsync()
      .subscribe({
        next: (items) => this.refreshData(items),
      });
  }

  /** 
   * refreshData - Refresh the grid with the given items
   * @param items - The items to refresh the grid with
   */
  private refreshData(items: IBasicsEfbsheetsEntity[]) {
    this.gridConfig = { ...this.gridConfig, items: [...items] };
  }

  /**
   * onSelectionChanged - Event handler for when the selection changes
   * @param selectedRows - The selected rows
   */
  public onSelectionChanged(selectedRows: IBasicsEfbsheetsEntity[]) {
    this.dataService.selectItems(selectedRows);
  }
  
  /**
   * onSearch - Event handler for when the search button is clicked
   */
  public onSearch() {
    this.dataService.getSearchList(this.searchData)
      .subscribe({
        next: (items) => this.refreshData(items),
        error: (err) => console.error('Error during search:', err),
      });
  }
}
