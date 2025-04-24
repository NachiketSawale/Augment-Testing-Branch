/**
* Created by wuky on 04/13/2022
* */
(function (angular){
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsRecurrenceMeetingController',['_', '$scope','moment','$translate', 'platformDialogService', 'basicsMeetingConstantValues',
		function (_, $scope, moment, $translate, platformDialogService, constantValues){

			$scope.options = $scope.$parent.modalOptions;

			$scope.recurrence = {
				pattern : {
					type : -1,
					interval : 1,
					index : 0,
					month : 0,
					firstDayOfWeek : 0,
					daysOfWeek : [],
					dayOfMonth : 0
				},
				range : {
					type : -1,
					startDate : null,
					endDate : $scope.options.endDate,
					numberOfOccurrences : 0
				}
			};

			let date = new Date();
			$scope.modalOptions = {
				showAppointmentTime : true,
				showRecurrencePattern : true,
				showRecurrenceRange : true,
				startTime : null,
				endTime : null,
				duration : '',
				recordStartTime : null,
				recordEndTime : null,
				recurrencePatternType : 1,
				isWatch : true,
				recurrencePattern : {
					interval : 1,
					dailyRadio : 1,  /* 2.every weekday */
					isEveryWeekday : false,
					daysOfWeek:[],
					firstDayOfWeek : null,
					day : date.getDay().toString(),
					dayOfMonth : date.getDate(),
					index : '0',
					month1 : date.getMonth().toString(),
					month2 : date.getMonth().toString(),
					monthlyRadio : 1,  /* 1. absoluteMonthly   2. relativeMonthly */
					yearlyRadio : 1,   /* 1. absoluteYearly   2. relativeYearly */
				},
				recurrenceRange:{
					startDate : null,
					endDate : null,
					numberOfOccurrences : 1,
					type: 1  /* 1.endDate   2.numbered */
				},
				isRemove : true,
				okButtonText : $translate.instant('cloud.common.ok'),
				cancelButtonText : $translate.instant('cloud.common.cancel'),
				removeRecurrenceButtonText : $translate.instant('basics.meeting.recurrence.removeRecurrence'),
				headerText : $translate.instant('basics.meeting.recurrence.appointmentRecurrence')
			};

			$scope.modalOptions.weekOption = [
				{id: 0, state : false, value : $translate.instant('basics.meeting.recurrence.sunday')},
				{id: 1, state : false, value : $translate.instant('basics.meeting.recurrence.monday')},
				{id: 2, state : false, value : $translate.instant('basics.meeting.recurrence.tuesday')},
				{id: 3, state : false, value : $translate.instant('basics.meeting.recurrence.wednesday')},
				{id: 4, state : false, value : $translate.instant('basics.meeting.recurrence.thursday')},
				{id: 5, state : false, value : $translate.instant('basics.meeting.recurrence.friday')},
				{id: 6, state : false, value : $translate.instant('basics.meeting.recurrence.saturday')}
			];
			$scope.modalOptions.durationOption = [
				`0 ${$translate.instant('basics.meeting.recurrence.minutes')}`,
				`15 ${$translate.instant('basics.meeting.recurrence.minutes')}`,
				`30 ${$translate.instant('basics.meeting.recurrence.minutes')}`,
				`1 ${$translate.instant('basics.meeting.recurrence.hour')}`,
				`2 ${$translate.instant('basics.meeting.recurrence.hours')}`,
				`3 ${$translate.instant('basics.meeting.recurrence.hours')}`,
				`1 ${$translate.instant('basics.meeting.recurrence.day')}`,
				`2 ${$translate.instant('basics.meeting.recurrence.days')}`,
				`1 ${$translate.instant('basics.meeting.recurrence.week')}`,
				`2 ${$translate.instant('basics.meeting.recurrence.weeks')}`,
			];
			$scope.modalOptions.frequencyOption = [
				{id: 0, value: $translate.instant('basics.meeting.recurrence.first')},
				{id: 1, value: $translate.instant('basics.meeting.recurrence.second')},
				{id: 2, value: $translate.instant('basics.meeting.recurrence.third')},
				{id: 3, value: $translate.instant('basics.meeting.recurrence.fourth')},
				{id: 4, value: $translate.instant('basics.meeting.recurrence.last')}
			];
			$scope.modalOptions.monthOption = [
				{id: 0, value: $translate.instant('basics.meeting.recurrence.january')},
				{id: 1, value: $translate.instant('basics.meeting.recurrence.february')},
				{id: 2, value: $translate.instant('basics.meeting.recurrence.march')},
				{id: 3, value: $translate.instant('basics.meeting.recurrence.april')},
				{id: 4, value: $translate.instant('basics.meeting.recurrence.may')},
				{id: 5, value: $translate.instant('basics.meeting.recurrence.june')},
				{id: 6, value: $translate.instant('basics.meeting.recurrence.july')},
				{id: 7, value: $translate.instant('basics.meeting.recurrence.august')},
				{id: 8, value: $translate.instant('basics.meeting.recurrence.september')},
				{id: 9, value: $translate.instant('basics.meeting.recurrence.october')},
				{id: 10, value: $translate.instant('basics.meeting.recurrence.november')},
				{id: 11, value: $translate.instant('basics.meeting.recurrence.december')},
			];

			$scope.modalOptions.recurrencePatternRadioGroupOpt = {
				displayMember: 'description',
				valueMember: 'value',
				cssMember: 'cssClass',
				items: [
					{
						value: 1,
						description: $translate.instant('basics.meeting.recurrence.daily'),
						cssClass: 'spaceToUp'
					},
					{
						value: 2,
						description: $translate.instant('basics.meeting.recurrence.weekly'),
						cssClass: 'spaceToUp'
					},
					{
						value: 3,
						description: $translate.instant('basics.meeting.recurrence.monthly'),
						cssClass: 'spaceToUp'
					},
					{
						value:4,
						description: $translate.instant('basics.meeting.recurrence.yearly'),
						cssClass: 'spaceToUp'
					}
				]
			};

			initData();

			function initData(){
				if ($scope.options.recurrence){
					showCreatedRecurrence();
				}else{
					if ($scope.options.startTime !== null && $scope.options.endTime !== null){
						let startDate = $scope.options.startDate === null ? moment(Date.now()) : moment($scope.options.startDate);
						let endDate = $scope.options.endDate === null ? moment(Date.now()) : moment($scope.options.endDate);
						if ($scope.options.isAllDay === true){
							startDate = startDate.hours(0);
							startDate = startDate.minutes(0);
							endDate = endDate.date(endDate.date() + 1);
							endDate = endDate.hours(0);
							endDate = endDate.minutes(0);
							$scope.modalOptions.startTime = startDate;
							$scope.modalOptions.endTime = endDate;

							$scope.modalOptions.recordStartTime = $scope.modalOptions.startTime;
							$scope.modalOptions.recordEndTime = $scope.modalOptions.endTime;
							let index =  $scope.modalOptions.durationOption.indexOf(`1 ${$translate.instant('basics.meeting.recurrence.day')}`);
							$scope.modalOptions.duration = $scope.modalOptions.durationOption[index];
						}else{
							let startTime = moment($scope.options.startTime);
							let endTime = moment($scope.options.endTime);
							startDate = startDate.hours(startTime.hours());
							startDate = startDate.minutes(startTime.minutes());
							endDate = endDate.hours(endTime.hours());
							endDate = endDate.minutes(endTime.minutes());
							$scope.modalOptions.startTime = startDate;
							$scope.modalOptions.endTime = endDate;

							$scope.modalOptions.recordStartTime = $scope.modalOptions.startTime;
							$scope.modalOptions.recordEndTime = $scope.modalOptions.endTime;
							processDuration();
						}
					}else{
						$scope.modalOptions.duration = $scope.modalOptions.durationOption[2];
					}

					$scope.modalOptions.weekOption[date.getDay()].state = true;

					$scope.modalOptions.recurrenceRange.startDate = $scope.options.startDate === null ? moment(Date.now()) : $scope.options.startDate;

					let end = $scope.options.endDate === null ? moment($scope.modalOptions.recurrenceRange.startDate) : moment($scope.options.endDate);
					$scope.modalOptions.recurrenceRange.endDate = end.month(end.month() + 3);
				}

				$scope.modalOptions.isRemove = $scope.options.recurrence === null;
			}

			$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
				if (model === 'recurrencePatternType'){
					initRecurrencePatternData();
					processEndDate(radioValue);
				}
				$scope.modalOptions[model] = parseInt(radioValue);
			};

			function initRecurrencePatternData(){
				$scope.modalOptions.recurrencePattern.dailyRadio = 1;
				$scope.modalOptions.recurrencePattern.monthlyRadio = 1;
				$scope.modalOptions.recurrencePattern.yearlyRadio = 1;
				$scope.modalOptions.recurrencePattern.interval = 1;
				$scope.modalOptions.recurrencePattern.index = '0';
				$scope.modalOptions.recurrencePattern.day = date.getDay().toString();

				_.forEach($scope.modalOptions.weekOption, function (day){
					day.state = false;
				});
				$scope.modalOptions.weekOption[date.getDay()].state = true;
				$scope.modalOptions.recurrencePattern.dayOfMonth = date.getDate();
				$scope.modalOptions.recurrencePattern.month1 = date.getMonth().toString();
				$scope.modalOptions.recurrencePattern.month2 = date.getMonth().toString();
			}

			$scope.$watch('modalOptions.startTime', function (newVal, oldVal){
				if ($scope.modalOptions.isWatch){
					if (newVal !== oldVal){
						processEndTime();
					}
				}
			});
			$scope.$watch('modalOptions.endTime', function (newVal, oldVal){
				if (!$scope.modalOptions.isWatch){
					if (newVal !== oldVal){
						processDuration();
					}
				}
			});
			$scope.$watch('modalOptions.duration', function (newVal, oldVal){
				if ($scope.modalOptions.isWatch){
					if (newVal !== oldVal){
						processEndTime();
					}
				}
			});

			function processEndTime(){
				if ($scope.modalOptions.duration && $scope.modalOptions.startTime){
					let durationArr = $scope.modalOptions.duration.split(' ');
					let startTime = $scope.modalOptions.startTime;
					let end = moment(startTime);
					if (durationArr.includes($translate.instant('basics.meeting.recurrence.minutes'))) {
						$scope.modalOptions.endTime = end.minutes(startTime.minutes() + parseInt(durationArr[0]));
					}else if (durationArr.includes($translate.instant('basics.meeting.recurrence.hour'))
                    || durationArr.includes($translate.instant('basics.meeting.recurrence.hours'))){
						$scope.modalOptions.endTime = end.hours(startTime.hours() + parseInt(durationArr[0]));
					}else if (durationArr.includes($translate.instant('basics.meeting.recurrence.day'))
                    || durationArr.includes($translate.instant('basics.meeting.recurrence.days'))){
						$scope.modalOptions.endTime = end.date(startTime.date() + parseInt(durationArr[0]));
					}else if (durationArr.includes($translate.instant('basics.meeting.recurrence.week'))
                    || durationArr.includes($translate.instant('basics.meeting.recurrence.weeks'))){
						$scope.modalOptions.endTime = end.weekday(startTime.weekday() + parseInt(durationArr[0]) * 7);
					}

					$scope.modalOptions.recordEndTime = $scope.modalOptions.endTime;
				}
			}
			function processDuration(){
				if ($scope.modalOptions.startTime && $scope.modalOptions.endTime){
					if ($scope.modalOptions.recordEndTime !== null){
						$scope.modalOptions.recordEndTime.hours($scope.modalOptions.endTime.hours());
						$scope.modalOptions.recordEndTime.minutes($scope.modalOptions.endTime.minutes());
						$scope.modalOptions.endTime = $scope.modalOptions.recordEndTime;
					}
					const start = $scope.modalOptions.startTime.format('YYYY-MM-DD HH:mm');
					const end = $scope.modalOptions.endTime.format('YYYY-MM-DD HH:mm');

					let timeDiff = moment(end).diff(moment(start),'minutes');
					let timeH = timeDiff / 60;
					timeH = timeH.toString().includes('.') ? timeH.toFixed(1) : timeH;
					let option = timeH < 1 ? `${timeDiff} ${$translate.instant('basics.meeting.recurrence.minutes')}`
						: `${timeH} ${$translate.instant('basics.meeting.recurrence.hours')}`;
					if (option.split(' ')[0] === '1' && option.split(' ')[1] === $translate.instant('basics.meeting.recurrence.hours')){
						option = `1 ${$translate.instant('basics.meeting.recurrence.hour')}`;
					}

					if ($scope.modalOptions.durationOption.includes(option)){
						let index = $scope.modalOptions.durationOption.indexOf(option);
						$scope.modalOptions.duration = $scope.modalOptions.durationOption[index];
					}else{
						$scope.modalOptions.durationOption.push(option);
						$scope.modalOptions.duration = option;
					}
				}
			}

			$scope.modalOptions.ok = function onOk(){
				if (!$scope.modalOptions.startTime || !$scope.modalOptions.endTime){
					showErrorDialog('appointmentTime');
					return;
				}

				if (!$scope.modalOptions.recurrenceRange.startDate || (!$scope.modalOptions.recurrenceRange.endDate && $scope.modalOptions.recurrenceRange.type === 1)){
					showErrorDialog('date');
					return;
				}

				if ($scope.modalOptions.recurrenceRange.type === 1 &&
					moment($scope.modalOptions.recurrenceRange.endDate).diff($scope.modalOptions.recurrenceRange.startDate) < 0){
					showErrorDialog('rangeIsNotValid');
					return;
				}

				processRecurrencePattern();
				processRecurrenceRange();

				if ($scope.recurrence.pattern.type === 1 && $scope.recurrence.pattern.daysOfWeek.length < 1){
					showErrorDialog('patternIsNotValid');
					return;
				}

				if ($scope.recurrence.pattern.type === 4){
					let year = new Date().getFullYear();
					let day = new Date(year, $scope.recurrence.pattern.month,0).getDate();
					if (day < $scope.recurrence.pattern.dayOfMonth){
						showErrorDialog('patternIsNotValid');
						return;
					}
				}

				let endDate = calEndDate();
				let data = {
					isEveryWeekday : $scope.modalOptions.recurrencePattern.isEveryWeekday,
					startDate : $scope.modalOptions.recurrenceRange.startDate,
					endDate : endDate,
					startTime : $scope.modalOptions.startTime,
					endTime : $scope.modalOptions.endTime,
					recurrence: $scope.recurrence,
					isAllDay: moment($scope.modalOptions.endTime).diff($scope.modalOptions.startTime,'hours') === 24
				};

				if (estimatePattern()){
					if ($scope.recurrence.pattern.type === 2 && $scope.recurrence.pattern.dayOfMonth > 28){
						let notifyDialogConfig = {
							headerText: $translate.instant('basics.meeting.recurrence.recurrencePattern'),
							bodyText: $translate.instant('basics.meeting.recurrence.recurrencePatternNotify',{number : $scope.recurrence.pattern.dayOfMonth}),
							showOkButton: true,
							iconClass: 'ico-warning'
						};
						platformDialogService.showDialog(notifyDialogConfig).then(function (result){
							if (result.ok){
								$scope.$close({
									data : data
								});
							}
						});
					}else{
						$scope.$close({
							data : data
						});
					}
				}
			};

			function calEndDate(){
				if ($scope.modalOptions.duration !== null && $scope.modalOptions.startTime !== null){
					let durationArr = $scope.modalOptions.duration.split(' ');
					let startTime = $scope.modalOptions.recurrenceRange.startDate;
					startTime = startTime.hours($scope.modalOptions.startTime.hours());
					startTime = startTime.minutes($scope.modalOptions.startTime.minutes());
					let end = moment(startTime);
					if (durationArr.includes($translate.instant('basics.meeting.recurrence.hour'))
						|| durationArr.includes($translate.instant('basics.meeting.recurrence.hours'))){
						end = end.hours(startTime.hours() + parseInt(durationArr[0]));
					}else if (durationArr.includes($translate.instant('basics.meeting.recurrence.day'))
						|| durationArr.includes($translate.instant('basics.meeting.recurrence.days'))){
						end = end.date(startTime.date() + parseInt(durationArr[0]));
					}else if (durationArr.includes($translate.instant('basics.meeting.recurrence.week'))
						|| durationArr.includes($translate.instant('basics.meeting.recurrence.weeks'))){
						end = end.weekday(startTime.weekday() + parseInt(durationArr[0]) * 7);
					}

					return end;
				}
			}

			function processRecurrencePattern(){
				$scope.recurrence.pattern.interval = $scope.modalOptions.recurrencePattern.interval;

				switch ($scope.modalOptions.recurrencePatternType){
					case 1:
						$scope.recurrence.pattern.type = constantValues.recurrence.pattern.daily;
						if ($scope.modalOptions.recurrencePattern.dailyRadio === 2){
							$scope.modalOptions.recurrencePattern.isEveryWeekday = true;
							$scope.recurrence.pattern.type = constantValues.recurrence.pattern.weekly;
							$scope.recurrence.pattern.interval = 1;
							$scope.recurrence.pattern.daysOfWeek = [1, 2, 3, 4, 5];
						}
						break;
					case 2:
						$scope.recurrence.pattern.type = constantValues.recurrence.pattern.weekly;

						for (let i = 0; i< $scope.modalOptions.weekOption.length; i++){
							if ($scope.modalOptions.weekOption[i].state === true)
								$scope.modalOptions.recurrencePattern.daysOfWeek.push($scope.modalOptions.weekOption[i].id);
						}
						$scope.recurrence.pattern.daysOfWeek = $scope.modalOptions.recurrencePattern.daysOfWeek;
						break;
					case 3:
						if ($scope.modalOptions.recurrencePattern.monthlyRadio === 1){
							$scope.recurrence.pattern.type = constantValues.recurrence.pattern.absoluteMonthly;
							$scope.recurrence.pattern.dayOfMonth = parseInt($scope.modalOptions.recurrencePattern.dayOfMonth);
						}else{
							$scope.recurrence.pattern.type = constantValues.recurrence.pattern.relativeMonthly;
							for (const index of $scope.modalOptions.frequencyOption){
								if (index.id === parseInt($scope.modalOptions.recurrencePattern.index)){
									$scope.recurrence.pattern.index = index.id;
								}
							}
							for (const day of $scope.modalOptions.weekOption){
								if (day.id === parseInt($scope.modalOptions.recurrencePattern.day)){
									$scope.modalOptions.recurrencePattern.daysOfWeek.push(day.id);
								}
							}
							$scope.recurrence.pattern.daysOfWeek = $scope.modalOptions.recurrencePattern.daysOfWeek;
						}
						break;
					case 4:
						if ($scope.modalOptions.recurrencePattern.yearlyRadio === 1){
							$scope.recurrence.pattern.type = constantValues.recurrence.pattern.absoluteYearly;
							$scope.recurrence.pattern.dayOfMonth = parseInt($scope.modalOptions.recurrencePattern.dayOfMonth);

							for (const month of $scope.modalOptions.monthOption){
								if (month.id === parseInt($scope.modalOptions.recurrencePattern.month1)){
									$scope.recurrence.pattern.month = month.id + 1;
								}
							}
						}else{
							$scope.recurrence.pattern.type = constantValues.recurrence.pattern.relativeYearly;
							for (let index of $scope.modalOptions.frequencyOption){
								if (index.id === parseInt($scope.modalOptions.recurrencePattern.index)){
									$scope.recurrence.pattern.index = index.id;
								}
							}
							for (const day of $scope.modalOptions.weekOption){
								if (day.id === parseInt($scope.modalOptions.recurrencePattern.day)){
									$scope.modalOptions.recurrencePattern.daysOfWeek.push(day.id);
								}
							}
							$scope.recurrence.pattern.daysOfWeek = $scope.modalOptions.recurrencePattern.daysOfWeek;

							for (const month of $scope.modalOptions.monthOption){
								if (month.id === parseInt($scope.modalOptions.recurrencePattern.month2)){
									$scope.recurrence.pattern.month = month.id + 1;
								}
							}
						}
						break;
					default:
						break;
				}
			}

			function processRecurrenceRange(){
				if (moment.isMoment($scope.modalOptions.recurrenceRange.startDate) && $scope.modalOptions.recurrenceRange.startDate.isValid()) {
					$scope.recurrence.range.startDate = $scope.modalOptions.recurrenceRange.startDate.format('YYYY-MM-DD');

					if ($scope.modalOptions.recurrenceRange.type === 1) {
						$scope.recurrence.range.type = constantValues.recurrence.range.endDate;
						if (moment.isMoment($scope.modalOptions.recurrenceRange.endDate) && $scope.modalOptions.recurrenceRange.endDate.isValid()){
							$scope.recurrence.range.endDate = $scope.modalOptions.recurrenceRange.endDate.format('YYYY-MM-DD');
						}
					} else {
						$scope.recurrence.range.type = constantValues.recurrence.range.numbered;
						$scope.recurrence.range.numberOfOccurrences = parseInt($scope.modalOptions.recurrenceRange.numberOfOccurrences);
					}
				}
			}

			function estimatePattern(){
				const durationArr = $scope.modalOptions.duration.split(' ');
				let durHours = null;
				switch(durationArr[1]){
					case $translate.instant('basics.meeting.recurrence.hour'):
						durHours = durationArr[0];
						break;
					case $translate.instant('basics.meeting.recurrence.hours'):
						durHours = durationArr[0];
						break;
					case $translate.instant('basics.meeting.recurrence.day'):
						durHours = parseInt(durationArr[0]) * 24;
						break;
					case $translate.instant('basics.meeting.recurrence.days'):
						durHours = parseInt(durationArr[0]) * 24;
						break;
					case $translate.instant('basics.meeting.recurrence.week'):
						durHours = parseInt(durationArr[0]) * 7 * 24;
						break;
					case $translate.instant('basics.meeting.recurrence.weeks'):
						durHours = parseInt(durationArr[0]) * 7 * 24;
						break;
					default:
						break;
				}

				if (durHours !== null){
					switch ($scope.recurrence.pattern.type){
						case 0:
							if (durHours > $scope.recurrence.pattern.interval * 24){
								showErrorDialog('duration');
								return false;
							}
							break;
						case 1:
							if (durHours > $scope.recurrence.pattern.interval * 7 * 24){
								showErrorDialog('duration');
								return false;
							}
							break;
						default:
							break;
					}

					if ( $scope.modalOptions.recurrencePatternType === 1 && $scope.modalOptions.recurrencePattern.dailyRadio === 2){
						if (durHours > $scope.recurrence.pattern.interval * 5 * 24){
							showErrorDialog('duration');
							return false;
						}
					}
				}

				return true;
			}

			function showCreatedRecurrence(){
				$scope.modalOptions.startTime = $scope.options.startTime;
				$scope.modalOptions.endTime = $scope.options.endTime;

				$scope.modalOptions.recordStartTime = $scope.modalOptions.startTime;
				$scope.modalOptions.recordEndTime = $scope.modalOptions.endTime;
				processDuration();

				if ($scope.options.recurrence.pattern.daysOfWeek.length === 0){
					$scope.modalOptions.weekOption[date.getUTCDay()].state = true;
				}

				switch ($scope.options.recurrence.pattern.type){
					case 0:
						$scope.modalOptions.recurrencePatternType = 1;
						break;
					case 1:
						if ($scope.options.isEveryWeekday)
						{
							$scope.modalOptions.recurrencePatternType = 1;
							$scope.modalOptions.recurrencePattern.dailyRadio = 2;
						}else{
							$scope.modalOptions.recurrencePatternType = 2;
							for (let weekItem of $scope.modalOptions.weekOption){
								if ($scope.options.recurrence.pattern.daysOfWeek.includes(weekItem.id)){
									weekItem.state = true;
								}
							}
						}
						break;
					case 2:
						$scope.modalOptions.recurrencePatternType = 3;
						$scope.modalOptions.recurrencePattern.monthlyRadio = 1;
						break;
					case 3:
						$scope.modalOptions.recurrencePatternType = 3;
						$scope.modalOptions.recurrencePattern.monthlyRadio = 2;
						for (let index of $scope.modalOptions.frequencyOption){
							if (index.id === $scope.options.recurrence.pattern.index){
								$scope.modalOptions.recurrencePattern.index = index.id.toString();
							}
						}
						for (let weekItem of $scope.modalOptions.weekOption){
							if (weekItem.id === $scope.options.recurrence.pattern.daysOfWeek[0]){
								$scope.modalOptions.recurrencePattern.day = weekItem.id.toString();
							}
						}
						break;
					case 4:
						$scope.modalOptions.recurrencePatternType = 4;
						$scope.modalOptions.recurrencePattern.yearlyRadio = 1;
						$scope.modalOptions.recurrencePattern.month1 = ($scope.options.recurrence.pattern.month - 1).toString();
						break;
					case 5:
						$scope.modalOptions.recurrencePatternType = 4;
						$scope.modalOptions.recurrencePattern.yearlyRadio = 2;
						for (let index of $scope.modalOptions.frequencyOption){
							if (index.id === $scope.options.recurrence.pattern.index){
								$scope.modalOptions.recurrencePattern.index = index.id.toString();
							}
						}
						for (let weekItem of $scope.modalOptions.weekOption){
							if (weekItem.id === $scope.options.recurrence.pattern.daysOfWeek[0]){
								$scope.modalOptions.recurrencePattern.day = weekItem.id.toString();
							}
						}
						$scope.modalOptions.recurrencePattern.month2 = ($scope.options.recurrence.pattern.month - 1).toString();
						break;
					default:
						break;
				}

				$scope.modalOptions.recurrencePattern.interval = $scope.options.recurrence.pattern.interval;
				$scope.modalOptions.recurrencePattern.dayOfMonth= $scope.options.recurrence.pattern.dayOfMonth === 0 ? date.getDate() : $scope.options.recurrence.pattern.dayOfMonth;

				$scope.modalOptions.recurrenceRange.startDate = $scope.options.recurrence.range.startDate === null ?
					moment(Date.now()) : moment($scope.options.recurrence.range.startDate);

				let end = moment($scope.modalOptions.recurrenceRange.startDate);
				$scope.modalOptions.recurrenceRange.endDate = end.month(end.month() + 3);
				switch ($scope.options.recurrence.range.type){
					case 0:
						$scope.modalOptions.recurrenceRange.type = 1;
						$scope.modalOptions.recurrenceRange.endDate = $scope.options.recurrence.range.endDate === null ?
							$scope.modalOptions.recurrenceRange.endDate : moment($scope.options.recurrence.range.endDate);
						break;
					case 1:
						$scope.modalOptions.recurrenceRange.type = 2;
						$scope.modalOptions.recurrenceRange.numberOfOccurrences = $scope.options.recurrence.range.numberOfOccurrences;
						break;
					default:
						break;
				}
			}

			function processEndDate(radioValue){
				let endData = $scope.options.endDate !== null ? moment($scope.options.endDate) : moment(Date.now());
				switch (parseInt(radioValue)){
					case 1:
						$scope.modalOptions.recurrenceRange.endDate = endData.month(endData.month() + 3);
						break;
					case 2:
						$scope.modalOptions.recurrenceRange.endDate = endData.month(endData.month() + 6);
						break;
					case 3:
						$scope.modalOptions.recurrenceRange.endDate = endData.year(endData.year() + 1);
						break;
					case 4:
						$scope.modalOptions.recurrenceRange.endDate = endData.year(endData.year() + 9);
						break;
					default:
						break;
				}
			}

			$scope.modalOptions.estimateInterval = function estimateInterval(){
				if ($scope.modalOptions.recurrencePattern.interval){
					$scope.modalOptions.recurrencePattern.interval = $scope.modalOptions.recurrencePattern.interval.toString().replace(/[^\d]/g,'');
					if ($scope.modalOptions.recurrencePattern.interval <= 0){
						$scope.modalOptions.recurrencePattern.interval = null;
					}
				}
			};

			$scope.modalOptions.estimateNumberOfOccurrences = function estimateNumberOfOccurrences(){
				if ($scope.modalOptions.recurrenceRange.numberOfOccurrences){
					$scope.modalOptions.recurrenceRange.numberOfOccurrences = $scope.modalOptions.recurrenceRange.numberOfOccurrences.toString().replace(/[^\d]/g,'');
					if ($scope.modalOptions.recurrenceRange.numberOfOccurrences <= 0){
						$scope.modalOptions.recurrenceRange.numberOfOccurrences = null;
					}
				}
			};

			$scope.modalOptions.estimateDayOfMonth = function estimateDayOfMonth(){
				if ($scope.modalOptions.recurrencePattern.dayOfMonth){
					$scope.modalOptions.recurrencePattern.dayOfMonth = $scope.modalOptions.recurrencePattern.dayOfMonth.toString().replace(/[^\d]/g,'');
					if ($scope.modalOptions.recurrencePattern.dayOfMonth <=0){
						$scope.modalOptions.recurrencePattern.dayOfMonth = null;
					}else{
						if ($scope.modalOptions.recurrencePattern.dayOfMonth > 31){
							$scope.modalOptions.recurrencePattern.dayOfMonth = 31;
						}
					}
				}
			};

			$scope.modalOptions.setDefaultInterval = function setDefaultInterval(){
				if ($scope.modalOptions.recurrencePattern.interval === ''){
					$scope.modalOptions.recurrencePattern.interval = 1;
				}
			};

			$scope.modalOptions.setDefaultNumberOfOccurrences = function setDefaultNumberOfOccurrences(){
				if ($scope.modalOptions.recurrenceRange.numberOfOccurrences === ''){
					$scope.modalOptions.recurrenceRange.numberOfOccurrences = 1;
				}
			};

			$scope.modalOptions.setDefaultDayOfMonth = function setDefaultDayOfMonth(){
				if ($scope.modalOptions.recurrencePattern.dayOfMonth === ''){
					$scope.modalOptions.recurrencePattern.dayOfMonth = date.getDate();
				}
			};

			$scope.modalOptions.hideOption = function hideOption (value){
				if (value.length > 0){
					let strArr = value.split(' ');
					if (strArr.length > 1){
						if (strArr[1] === 'hours'){
							if (parseInt(strArr[0]) >3 || strArr[0].includes('.')){
								return {'display' : 'none'};
							}
						}
					}
					if (parseInt(strArr[0]) < 0){
						return {'display' : 'none'};
					}
				}
			};

			function showErrorDialog(type){
				let errorDialogConfig;
				switch (type){
					case 'duration':
						errorDialogConfig = {
							headerText: $translate.instant('basics.meeting.recurrence.recurrencePattern'),
							bodyText: $translate.instant('basics.meeting.recurrence.recurrencePatternErrorMessage'),
							showCancelButton: true,
							iconClass: 'error'
						};
						break;
					case 'patternIsNotValid':
						errorDialogConfig = {
							headerText: $translate.instant('basics.meeting.recurrence.recurrencePattern'),
							bodyText: $translate.instant('basics.meeting.recurrence.patternIsNotValid'),
							showCancelButton: true,
							iconClass: 'error'
						};
						break;
					case 'date':
						errorDialogConfig = {
							headerText: $translate.instant('basics.meeting.recurrence.rangeOfRecurrence'),
							bodyText: $translate.instant('basics.meeting.recurrence.recurrenceRangeErrorMessage'),
							showCancelButton: true,
							iconClass: 'error'
						};
						break;
					case 'appointmentTime':
						errorDialogConfig = {
							headerText: $translate.instant('basics.meeting.recurrence.appointmentTime'),
							bodyText: $translate.instant('basics.meeting.recurrence.appointmentTimeErrorMessage'),
							showCancelButton: true,
							iconClass: 'error'
						};
						break;
					case 'rangeIsNotValid':
						errorDialogConfig = {
							headerText: $translate.instant('basics.meeting.recurrence.rangeOfRecurrence'),
							bodyText: $translate.instant('basics.meeting.recurrence.rangeIsNotValid'),
							showCancelButton: true,
							iconClass: 'error'
						};
						break;
					default:
						break;
				}
				platformDialogService.showDialog(errorDialogConfig);
			}

			$scope.modalOptions.close = function onCancel(){
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = $scope.modalOptions.close;

			$scope.modalOptions.remove = function remove(){
				$scope.$close({
					data : {
						startTime : null,
						endTime : null,
						recurrence : null
					}
				});
			};
		}]);

})(angular);