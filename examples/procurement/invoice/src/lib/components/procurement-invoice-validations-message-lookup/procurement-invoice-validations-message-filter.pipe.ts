/*
 * Copyright(c) RIB Software GmbH
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'procurementInvoiceValidationsMessageFilter',
})
export class ProcurementInvoiceValidationsMessageFilterPipe implements PipeTransform {
  
  private maxLength = 80;

  public transform(input: string): string {
    let output = '';

    if (typeof input === 'string') {
      output = input.trim();
    }

    if (output.length > this.maxLength) {
      output = output.trim().substring(0, this.maxLength) + '...';
    }

    if (output.startsWith('<')) {
      output = '...';
    }

    return output.replace(/</g, '[').replace(/>/g, ']');
    
  }

}
