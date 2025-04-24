import {Component, inject} from '@angular/core';
import {
  ControllingStructureSchedulerTask
} from '../../../model/entities/controlling-structure-scheduler-task.interface';
import {TRANSFER_SCHEDULER_TASK_TOKEN} from '../../../wizards/controlling-structure-transfer-scheduler-to-project-wizard.service';

@Component({
  selector: 'controlling-structure-update-sales-revenue',
  templateUrl: './update-sales-revenue.component.html'
})
export class UpdateSalesRevenueComponent {
  public entity: ControllingStructureSchedulerTask = {} as ControllingStructureSchedulerTask;

  public constructor() {
    this.entity = inject(TRANSFER_SCHEDULER_TASK_TOKEN);
  }

  public onCheckUpdateRevenue(){
    this.entity.updateRevenue = !this.entity.updateRevenue;
    if(!this.entity.updateRevenue){
      this.entity.revenueUpdateFrom = -1;
    }else {
      this.entity.revenueUpdateFrom = 1;
    }
  }
}
