/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable, of} from 'rxjs';
import {isNil, keyBy, remove} from 'lodash';
import {Component, Input} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MaterialSearchScope} from '../../model/material-search-scope';

/**
 * Footer of search view, currently handle material paging
 */
@Component({
  selector: 'basics-shared-material-search-footer',
  templateUrl: './material-search-footer.component.html',
  styleUrls: ['./material-search-footer.component.scss']
})
export class BasicsSharedMaterialSearchFooterComponent {
  /**
   * Search scope
   */
  @Input()
  public scope!: MaterialSearchScope;

  /**
   * Handle page event
   * @param e
   */
  public handlePageEvent(e: PageEvent) {
    this.scope.request.ItemsPerPage = e.pageSize;
    this.scope.request.CurrentPage = e.pageIndex + 1;
    this.scope.paging();
  }

  /**
   * handle MultiSelection checkbox change
   */
  public onCheckMultiSelection() {
    if (!this.scope.enableMultiSelection) {
      this.scope.selectedItems.forEach(function (item) {
        item.selected = false;
      });
      this.scope.selectedItems = [];
      this.scope.checkAllFromCurrentPage = false;
      this.scope.checkAllFromResultSet = false;
      this.scope.resetSelectedItem();
    }
  }

  /**
   * handle Check All From CurrentPage
   */
  public onCheckAllFromCurrentPage() {
    this.scope.enableMultiSelection = this.scope.checkAllFromCurrentPage ? true :this.scope.enableMultiSelection;
    const selectedItemsMap = keyBy(this.scope.selectedItems, 'Id');
    this.scope.response.items.forEach(item => {
      item.selected = this.scope.checkAllFromCurrentPage;
      if (item.selected) {
        if (!selectedItemsMap[item.Id]) {
          this.scope.selectedItems.push(item);
        }
      } else {
        remove(this.scope.selectedItems, {Id: item.Id});
      }
    });
    this.scope.updateCheckAllStatus(this.scope.checkAllFromCurrentPage);
    this.scope.resetSelectedItem();
  }

  /**
   * handle Check All From Result Set
   */
  public onCheckAllFromResultSet() {
    return new Observable(observer => {
      const totalLen = this.scope.response.maxGroupCount + this.scope.selectedItems.length;
      if (this.scope.checkAllFromResultSet) {
        if (totalLen > 500) {
          this.scope.checkAllFromResultSet = false;
          this.scope.checkAllFromResultSetDisable = true;
          of(null);
        } else {
          this.scope.enableMultiSelection = true;
          this.scope.checkAllFromCurrentPage = true;
          this.scope.response.items.forEach((item) => {
            item.selected = true;
          });
          if (isNil(this.scope.currentSearchResult)) {
            const originalItemsPerPage = this.scope.request.ItemsPerPage;
            this.scope.load500ResultSet().subscribe((response) => {
              this.scope.request.ItemsPerPage = originalItemsPerPage;
              const materials = response.items;
              if (materials.length > 0) {
                const selectedItemsMap = keyBy(this.scope.selectedItems, 'Id');
                materials.forEach(item => {
                  if (!selectedItemsMap[item.Id]) {
                    this.scope.selectedItems.push(item);
                  }
                });
                this.scope.currentSearchResult = materials;
                this.scope.resetSelectedItem();
              }
              observer.next();
              observer.complete();
            });
          } else if (!isNil(this.scope.currentSearchResult)) {
            const selectedItemsMap = keyBy(this.scope.selectedItems, 'Id');
            this.scope.currentSearchResult.forEach(item => {
              if (!selectedItemsMap[item.Id]) {
                this.scope.selectedItems.push(item);
              }
            });
            this.scope.resetSelectedItem();
            of(null);
          }
        }
      } else {
        this.scope.checkAllFromCurrentPage = false;
        this.scope.response.items.forEach((item) => {
          item.selected = false;
        });
        const materials = this.scope.currentSearchResult;
        if (materials && materials.length > 0) {
          materials.forEach(item => {
            item.selected = false;
            remove(this.scope.selectedItems, {Id: item.Id});
          });
          this.scope.resetSelectedItem();
        }
        of(null);
      }
    }).subscribe();
  }
}