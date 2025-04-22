/*
 * Copyright(c) RIB Software GmbH
 */
import {forkJoin} from 'rxjs';
import {escape, isNil} from 'lodash';
import {Component, ElementRef, inject, Input} from '@angular/core';
import {ProcurementTicketSystemCartItemScope} from '../../model/cart-item-scope';
import {IMaterialAttributeLoadEntity,IMaterialSearchDocumentEntity,IMaterialSearchDocumentTypeEntity} from '@libs/basics/shared';

/**
 * cart detail view
 */
@Component({
  selector: 'procurement-ticket-system-cart-item-detail',
  templateUrl: './cart-item-detail.component.html',
  styleUrls: ['./cart-item-detail.component.scss']
})
export class ProcurementTicketSystemCartItemDetailComponent {
  private elementRef = inject(ElementRef);
  /**
   * Search scope
   */
  @Input()
  public scope!: ProcurementTicketSystemCartItemScope;
  /**
   * if show material 3d model
   */
  public mdc3dShow: boolean = false;

  /**
   * preview attributes
   */
  public previewAttributes: IMaterialAttributeLoadEntity[] = [];

  /**
   * preview document
   */
  public previewDocuments: IMaterialSearchDocumentEntity[] = [];

  /**
   * preview document type
   */
  public previewDocumentTypes: IMaterialSearchDocumentTypeEntity[] = [];

  /**
   * internet Catalog
   */
  public internetCatalog?: number = undefined;

  /**
   * initializing
   */
  public ngOnInit() {
    if (this.scope.detailItem) {
      this.mdc3dShow = !isNil(this.scope.detailItem.Uuid);
      forkJoin([
        this.scope.materialService.getPreviewAttribute(this.scope.detailItem),
        this.scope.materialService.getDocumentByMaterial(this.scope.detailItem)
      ]).subscribe((response) => {
        this.previewAttributes = response[0];
        this.previewAttributes.forEach(a => {
          a.Property = escape(a.Property);
          a.Value = escape(a.Value);
        });
        this.previewDocuments = response[1].Main;
        this.previewDocuments.forEach(d => {
          d.Description = escape(d.Description);
        });
        this.previewDocumentTypes = response[1].DocumentType;
        if (this.scope.detailItem && this.scope.detailItem.InternetCatalogFk) {
          this.internetCatalog = this.scope.detailItem.InternetCatalogFk;
        }
      });
    }
  }

  /**
   * Go back search view
   */
  public goBack() {
    this.scope.showDetail = false;
    this.scope.detailItem = undefined;
  }

  /**
   * handle on preview document
   * @param id
   * @param index
   */
  public onDocumentPreview(id: number, index: number) {
    /* TODO: show document content
    const content = this.elementRef.nativeElement.querySelector('.ms-sv-commodity-preview-document-box .ms-sv-commodity-preview-document-content_' + index);
    if (content.classList.contains('hidden')) {
      content.innerText = 'preview feature coming soon ...';
    }
    content.classList.toggle('hidden');
     */
  }
}
