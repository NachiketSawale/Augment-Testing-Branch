import { Component, inject, OnInit } from '@angular/core';
import { IWorkflowDataHubStatusChart } from '../../model/interfaces/workflow-data-hub-status-chart.interface';
import { BasicsWorkflowDataHubDataService } from '../../services/basics-workflow-data-hub-data.service';
import { IWorkflowDataHubMonthCountChart } from '../../model/interfaces/workflow-data-hub-month-count-chart.interface';
import { IWorkflowDataHubTopTenActionsChart } from '../../model/interfaces/workflow-data-hub-top-ten-actions-chart.interface';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Chart } from 'chart.js';

@Component({
	selector: 'workflow-admin-itwo40-workflow-data-hub',
	templateUrl: 'workflow-data-hub.component.html',
	styleUrls: ['workflow-data-hub.component.scss'],
})
export class WorkflowDataHubComponent extends ContainerBaseComponent implements OnInit {

	private readonly dataHubDataService = inject(BasicsWorkflowDataHubDataService);

	private monthLabels: string[] = [];

	public async ngOnInit() {
		this.monthLabels = this.getMonthLabels();
		Promise.all([
			this.dataHubDataService.getStatus(),
			this.dataHubDataService.getAvgDuration(),
			this.dataHubDataService.getTopTenActions(),
			this.dataHubDataService.getUserTaskCount()]).then(result => {
				this.createStatusChart(result[0]);
			   this.createAvgDurationChart(result[1]);
			   this.createTopTenChart(result[2]);
			   this.createUserTaskChart(result[3]);
		});
	}

	private createStatusChart(statusData: IWorkflowDataHubStatusChart[]) {
		const labels: string[] = [];
		const data: number[] = [];
		statusData.map(statusResult => {
			if (statusResult.Status) {
				switch (statusResult.Status) {
					case 1:
						labels.push('Running');
						break;
					case 2:
						labels.push('Finished');
						break;
					case 3:
						labels.push('Escalate');
						break;
					case 4:
						labels.push('Waiting');
						break;
					case 5:
						labels.push('Failed');
						break;
					case 6:
						labels.push('Killed');
						break;
					case 7:
						labels.push('Validation failed');
						break;
					case 8:
						labels.push('Skipped');
						break;
					default:
						labels.push(statusResult.Status.toString());
				}
			}
			if (statusResult.Count) {
				data.push(statusResult.Count);
			}
		});

		const chartData = {
			labels: labels,
			datasets: [{
				label: 'Count',
				data: data
			}]
		};

		new Chart('statusChart', {
			type: 'pie',
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: 'Status'
					}
				}
			}
		});
	}

	private createAvgDurationChart(avgDurationData: IWorkflowDataHubMonthCountChart) {
		const data: number[] = [];
		for (let i = 0; i < 12; i++) {
			const key = `CurrentMonth${i === 0 ? '' : i}`;
			const value = avgDurationData[key];
			data.push(value !== null && value !== undefined ? value : 0);
		}
		data.reverse();

		const chartData = {
			labels: this.monthLabels,
			datasets: [{
				label: 'Duration in Seconds',
				data: data
			}]
		};
		new Chart('avgDurationChart', {
			type: 'bar',
			data: chartData,
			options: {
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: 'Average Duration'
					}
				}
			}
		});
	}

	private createTopTenChart(topTenActionData: IWorkflowDataHubTopTenActionsChart[]) {
		const labels: string[] = [];
		const data: number[] = [];
		topTenActionData.map(topTenActionResult => {
			if (topTenActionResult.Actionid) {
				labels.push(topTenActionResult.Actionid);
			}
			if (topTenActionResult.Count) {
				data.push(topTenActionResult.Count);
			}
		});

		const chartData = {
			labels: labels,
			datasets: [{
				label: 'Count',
				data: data
			}]
		};

		new Chart('topTenChart', {
			type: 'bar',
			data: chartData,
			options: {
				indexAxis: 'y',
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: 'Top Ten Actions'
					}
				}
			}
		});
	}

	private createUserTaskChart(userTaskData: IWorkflowDataHubMonthCountChart) {
		const data: number[] = [];
		for (let i = 0; i < 12; i++) {
			const key = `CurrentMonth${i === 0 ? '' : i}`;
			const value = userTaskData[key];
			data.push(value !== null && value !== undefined ? value : 0);
		}
		data.reverse();

		const chartData = {
			labels: this.monthLabels,
			datasets: [{
				label: 'Count',
				data: data
			}]
		};

		new Chart('userTaskChart', {
			type: 'line',
			data: chartData,
			options: {
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'User Task Count last 12 months'
					}
				}
			}
		});
	}

	private getMonthLabels() {
		const currentMonth = new Date().getMonth();

		const monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];

		const labels = [];
		for (let i = 11; i >= 0; i--) {
			labels.push(monthNames[(currentMonth - i + 12) % 12]);
		}
		return labels;
	}

}