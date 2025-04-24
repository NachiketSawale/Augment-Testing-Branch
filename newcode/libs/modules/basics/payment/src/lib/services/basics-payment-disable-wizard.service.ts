import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import {IPaymentTermEntity} from '../model/entities/payment-term-entity.interface';
import {PaymentTermDataService} from './basics-payment-main.service';

@Injectable({
    providedIn: 'root'
})
export class BasicsPaymentDisableWizardService extends BasicsSharedSimpleActionWizardService<IPaymentTermEntity> {

    private readonly paymentTermDataService = inject(PaymentTermDataService);

    public onStartDisableWizard(): void {
        const doneMsg = 'basics.payment.disablePaymentTermDone';
        const nothingToDoMsg = 'basics.payment.paymentTermAlreadyDisabled';
        const questionMsg = 'cloud.common.questionDisableSelection';
        const option: ISimpleActionOptions<IPaymentTermEntity> = {
            headerText: 'cloud.common.enableRecord',
            codeField: 'Code',
            doneMsg: doneMsg,
            nothingToDoMsg: nothingToDoMsg,
            questionMsg: questionMsg
        };

        this.startSimpleActionWizard(option);
    }


    public override getSelection(): IPaymentTermEntity[]{
        return this.paymentTermDataService.getSelection();
    }

    public override filterToActionNeeded(selected: IPaymentTermEntity[]): IPaymentTermEntity[]{
        const filteredSelection: IPaymentTermEntity[] = [];
        // Filter out the selection needed
        selected.forEach(item => {
            if(item.IsLive){
                filteredSelection.push(item);
            }
        });
        return filteredSelection;
    }


    public override performAction(filtered: IPaymentTermEntity[]): void{
        filtered.forEach(item => {
            item.IsLive = false;
            this.paymentTermDataService.setModified(item);
        });
    }


    public override postProcess(): void {

    }
}