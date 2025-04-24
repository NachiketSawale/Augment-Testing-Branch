/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, inject} from '@angular/core';
import {ProcurementTicketSystemCartItemScope} from '../../model/cart-item-scope';
import {ContainerBaseComponent} from '@libs/ui/container-system';
import {PlatformTranslateService} from '@libs/platform/common';
/**
 * cart item view
 */
@Component({
  selector: 'procurement-ticket-system-cart-view',
  templateUrl: './cart-item-view.component.html',
  styleUrls: ['./cart-item-view.component.scss']
})
export class ProcurementTicketSystemCartItemViewComponent extends ContainerBaseComponent {
  /**
   * cart scope
   */
  public scope = new ProcurementTicketSystemCartItemScope();

  /**
   * Translation service
   */
  public translateService = inject(PlatformTranslateService);

  /**
   * initialization
   */
  public ngOnInit() {
    this.translateService.load(['basics.material', 'procurement.ticketsystem']);
  }
}
