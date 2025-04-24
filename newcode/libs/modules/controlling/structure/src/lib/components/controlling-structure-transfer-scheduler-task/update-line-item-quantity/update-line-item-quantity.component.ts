import {Component, inject} from '@angular/core';
import {
  ControllingStructureSchedulerTask
} from '../../../model/entities/controlling-structure-scheduler-task.interface';
import {TRANSFER_SCHEDULER_TASK_TOKEN} from '../../../wizards/controlling-structure-transfer-scheduler-to-project-wizard.service';

@Component({
  selector: 'controlling-structure-update-line-item-quantity',
  templateUrl: './update-line-item-quantity.component.html'
})
export class ControllingStructureUpdateLineItemQuantityComponent {
  public entity: ControllingStructureSchedulerTask = {} as ControllingStructureSchedulerTask;
  
  public constructor() {
    this.entity = inject(TRANSFER_SCHEDULER_TASK_TOKEN);
  }

  public onCheckUpdateInstalledQty(){
    this.entity.updateInstalledQty = !this.entity.updateInstalledQty;
    if(!this.entity.updateInstalledQty){
      this.entity.insQtyUpdateFrom = -1;
    }else{
      this.entity.insQtyUpdateFrom = 1;
    }
  }
}
