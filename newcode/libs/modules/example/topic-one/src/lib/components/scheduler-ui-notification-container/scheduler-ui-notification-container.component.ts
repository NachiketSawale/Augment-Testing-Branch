/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';

import { ServicesScheduleruiStatusNotificationService } from '@libs/services/schedulerui';
import { Subscription } from 'rxjs';


@Component({
	selector: 'example-topic-one-scheduler-ui-notification-container',
	templateUrl: './scheduler-ui-notification-container.component.html',
	styleUrl: './scheduler-ui-notification-container.component.scss',
})
export class SchedulerUiNotificationContainerComponent extends ContainerBaseComponent {
	private subscription!:Subscription;

	private duplicateSubscription!:Subscription;

	private readonly SchedulerUiStatusNotificationObservableWrapper = inject(ServicesScheduleruiStatusNotificationService);

	public register() {
		this.subscription = this.SchedulerUiStatusNotificationObservableWrapper.register([704149, 704150],(value)=>{
			console.log('first',value);
		});

	}

	public registerWithAvailableJobId(){
		this.duplicateSubscription = this.SchedulerUiStatusNotificationObservableWrapper.register(704149,(value)=>{
			console.log('Available',value);
		});
	}

	public unregister() {
		this.subscription.unsubscribe();
	}
}
