/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, Input, OnInit} from '@angular/core';
import {MaterialSearchScope} from '../../model/material-search-scope';
import {BasicsSharedMaterialSearchService} from '../../services/material-search.service';
import {IMaterialSearchOptions} from '../../model/interfaces/material-search-options.interface';

/**
 * Material search container
 */
@Component({
  selector: 'basics-shared-material-search',
  templateUrl: './material-search.component.html',
  styleUrls: ['./material-search.component.scss']
})
export class BasicsSharedMaterialSearchComponent implements OnInit {
  /**
   * Scope, shared in all subcomponents of material search view
   */
  public scope = new MaterialSearchScope();

  /**
   * Search service setter, default is BasicsSharedMaterialSearchService in scope
   * It is allowed to inherit it and extend functions such as extra filter or data processor
   */
  @Input()
  public set searchService(value: BasicsSharedMaterialSearchService | null | undefined) {
    if (value) {
      this.scope.searchService = value;
    }
  }

  /**
   * Search view options
   */
  @Input()
  public set searchOptions(value: IMaterialSearchOptions) {
    this.scope.searchOptions = value;
  }

  /**
   * initialization
   */
  public ngOnInit() {
    this.scope.translateService.load(['basics.material', 'cloud.common']);
    this.scope.searchService.initSearchRequest(this.scope.request);
  }
}