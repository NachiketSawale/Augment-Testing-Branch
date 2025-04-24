(function (angular) {
	'use strict';

	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformDateshiftHelperService
	 * @description
	 * platformDateshiftHelperService provides an access layer to the platformDateshiftService
	 */
	angular.module(moduleName).service('platformDateshiftHelperService', PlatformDateshiftHelperService);

	PlatformDateshiftHelperService.$inject = ['platformDateshiftService', '_', 'math', 'moment', 'platformSequenceManagerService', 'mainViewService', 'platformModalService', '$translate', 'platformGridAPI', '$q'];

	function PlatformDateshiftHelperService(platformDateshiftService, _, math, moment, platformSequenceManagerService, mainViewService, platformModalService, $translate, platformGridAPI, $q) {
		var service = {
			registerDateshift: registerDateshift,
			unregisterDateshift: unregisterDateshift,
			shiftDate: shiftDate,
			resetDateshift: resetDateshift,
			getDateshiftTools: getDateshiftTools,
			getSequenceData: getSequenceData,
			getCalendarData: getCalendarData,
			updateSequenceData: updateSequenceData,
			updateCalendarId: updateCalendarId
			// changeMode: changeMode
		};

		var registeredServices = [];

		let toolsForConfigId = {};
		/**
		 * @ngdoc function
		 * @name deepCopy
		 * @description Private function that fast deep copies the objects that are instances of Object, Date, Map and Array as alternative to lodash cloneDeep.
		 * Use with caution! Objcets of other instances won't be copied! If needed can be expanded.
		 *
		 * @param {Object} obj - The object to be deep copied
		 * @returns {Object} - Deep copy of given object
		 **/
		function deepCopy(obj) {
			if (typeof obj !== 'object' || obj === null) {
				return obj;
			}

			if (obj instanceof Date) {
				return new Date(obj.getTime());
			}

			if (obj instanceof moment) {
				return moment(new Date(obj).getTime());
			}

			if (obj instanceof Map) {
				let map = new Map();
				obj.forEach((value, key) => {
					map.set(key, deepCopy(value));
				});
				return map;
			}

			if (obj instanceof Array) {
				return obj.reduce((arr, item, i) => {
					arr[i] = deepCopy(item);
					return arr;
				}, []);
			}

			if (obj instanceof Object) {
				return Object.keys(obj).reduce((newObj, key) => {
					if (obj[key] instanceof Date) {
						newObj[key] = new Date(obj[key].getTime());
					} else if (obj[key] instanceof moment) {
						newObj[key] = moment(new Date(obj[key]).getTime());
					} else if (obj[key] instanceof Map) {
						let map = new Map(obj[key]);
						obj[key].forEach((value, key) => {
							map.set(key, deepCopy(value));
						});
						newObj[key] = map;
					} else if (obj[key] instanceof Array) {
						newObj[key] = [...obj[key]];
						obj[key].forEach((item, index) => {
							if (item instanceof Date) {
								newObj[key][index] = new Date(item.getTime());
							} else if (item instanceof moment) {
								newObj[key][index] = moment(new Date(item).getTime());
							} else {
								newObj[key][index] = deepCopy(item);
							}
						});
					} else if (obj[key] instanceof Object) {
						newObj[key] = Object.assign({}, obj[key]);
					} else {
						newObj[key] = obj[key];
					}
					return newObj;
				}, {});
			}
		}

		/**
		 * @ngdoc class
		 * @name DateshiftRegistration
		 * @description Class that represents a dateshifthelper registration.
		 *
		 * @param {Object} dataService - The dataservice that registers for the dateshift helper functionality.
		 * The following methods of the dataService will be used:
		 * @param {function} dataService.getServiceName - Used for id of the registration
		 * @param {function} dataService.getDateshiftData - Used to fetch a list of the currently cached entity list, relations and dateshift config.
		 * @param {function} [dataService.postProcessDateshift] - Optional method that is executed after each dateshift.
		 * @param {function} dataService.gridRefresh - Executed after a dateshift if no postProcessDateshift() method is defined.
		 * @param {function} dataService.registerListLoaded - Registers resetDateshiftData() to execute each time a new list of entities is loaded.
		 * @param {function} dataService.registerSelectionChanged - Registers resetDateshiftData() to execute each time the selected entity changes.
		 **/
		function DateshiftRegistration(dataService) {
			var _this = this;
			this.id = dataService.getServiceName();
			this.dataService = dataService;
			this.config = {}; // by fetched data
			this.originalActivities = []; // by fetched data
			this.relations = []; // by fetched data
			this.calendarData = new Map(); // by fetched data
			this.fullshift = {
				default: false
			};
			this.mode = {
				default: 'both'
			};
			this.modeCssClass = {
				'both': 'tlb-icons ico-date-shift-both',
				'left': 'tlb-icons ico-date-shift-left',
				'right': 'tlb-icons ico-date-shift-right',
				'self': 'tlb-icons ico-date-shift-self',
				'push': 'tlb-icons ico-date-shift-push'
			};
			this.lastShiftOptions = null;
			this.cacheSequenceData = [];

			this.resetDateshiftData = function () {
				// special mode implementation
				let dataToClone = _this.dataService.getDateshiftData();
				var dateShiftData = {};
				if (!dataToClone.relations || !dataToClone.originalActivities
					|| (dataToClone.relations && dataToClone.originalActivities && dataToClone.originalActivities.length + dataToClone.relations.length <= 50000)) {
					dateShiftData = deepCopy(dataToClone);
				} else {
					// from items count > 50 000 the cloneDeep function from lodash is more efficient
					dateShiftData = _.cloneDeep(dataToClone);
				}
				_.assign(_this, dateShiftData);
				// reset last variant:
				_this.lastShiftOptions = null;
			};

			if (dataService.postProcessDateshift && _.isFunction(dataService.postProcessDateshift)) {
				this.postProcess = dataService.postProcessDateshift;
			} else {
				this.postProcess = function (result) {
					if (result) {
						_this.dataService.gridRefresh();
					}
				};
			}

			this.updateSequenceData = (activities) => {
				if (activities && activities.length > 0 && _this.relations.length > 0 && _this.config && _this.calendarData) {
					_this.cacheSequenceData = platformSequenceManagerService.generateSequenceData(activities, _this.relations, _this.config, _this.calendarData, _this.dataService.getContainerData());
				}
				return _this.cacheSequenceData;
			};

			this.updateProperties = (activities, triggerEntity) => {
				if (_.isFunction(dataService.updateProperties)) {
					return dataService.updateProperties(activities, triggerEntity);
				}
				return activities;
			};

			this.updateCalendarId = (activities, actIds, calendarId) => {
				if (!_.isNil(calendarId)) {
					activities.filter(activity => actIds.includes(activity[this.config.id])).forEach(activity => activity[this.config.calendar] = calendarId);
					_this.originalActivities.filter(activity => actIds.includes(activity[this.config.id])).forEach(activity => activity[this.config.calendar] = calendarId);
				}
				return activities;
			}

			// register reset triggers
			if (_.isFunction(dataService.registerListLoaded)) {
				dataService.registerListLoaded(this.resetDateshiftData);
				dataService.registerListLoaded(this.updateSequenceData);
			}
			if (_.isFunction(dataService.registerSelectionChanged)) {
				dataService.registerSelectionChanged(this.resetDateshiftData);
			}
		}

		// public methods

		/**
		 * @ngdoc function
		 * @name registerDateshift
		 * @description Public function that registers a dataservice in order to use dateshift at a later point.
		 *
		 * @param {Object} dataService - The dataService that is registered.
		 **/
		function registerDateshift(dataService) {
			if (dataService && evaluateDataService(dataService)) {
				var newRegistration = new DateshiftRegistration(dataService);
				registeredServices.push(newRegistration);
			} else {
				console.warn('The passed service does not meet the requirements for dateShift or is already registered');
			}
		}

		/**
		 * @ngdoc function
		 * @name unregisterDateshift
		 * @description Public function that unregisters (removes) a dataservice from the list of registered services.
		 *
		 * @param {Object} dataService - The dataService that is registered.
		 **/
		function unregisterDateshift(dataService) {
			var serviceName = dataService.getServiceName();
			var removed = _.remove(registeredServices, { id: serviceName });
			return !_.isEmpty(removed);
		}
		/**
		 * @ngdoc function
		 * @name shiftDate
		 * @description Public function that executes the dateshift.
		 * Additionally it modifies the data of the dataService
		 * and executes a postProcess method that is either defined by the dataService or by default (see below)
		 *
		 * @param {string} serviceName - Name of the registered service
		 * @param {Object} triggerEntity - Entity that is used to shift. Needs to contain the changed start and end properties!
		 * @param {string=} configId - Optional parameter if mode needs to be set explicitly
		 * @param {string=} fixedShiftVariant - Optional parameter to determine if shiftVariant is fixed
		 * @param {Object} shiftStatus - Optional parameter to inform if shifting finished
		 **/
		function shiftDate(serviceName, triggerEntity, configId, fixedShiftVariant, shiftStatus = { isShiftFinished: false }) {
			var rs = registeredServices.find(rs => rs.id === serviceName);

			if (!rs) {
				console.warn('The requested dateshift service is not registered');
				return null;
			}

			var currentActivities;
			if (rs.dataService.isItemFilterEnabled && rs.dataService.isItemFilterEnabled()) {
				currentActivities = rs.dataService.getUnfilteredList();
			} else {
				currentActivities = rs.dataService.getList();
			}

			var _fullshift = _.isUndefined(rs.fullshift[configId]) ? rs.fullshift['default'] : rs.fullshift[configId];
			var _mode = _.isUndefined(rs.mode[configId]) ? rs.mode['default'] : rs.mode[configId];
			var _config = _.clone(rs.config);
			_config.mode = _mode;

			// we do not use the original activities because we would not be able to tell what the user manipulated in the grid
			// maybe provide a way to imply the variant to the helper?
			// var currentOriginalEntity = _.first(findElements(rs.originalActivities, triggerEntity, rs.config.id));
			var currentOriginalEntity = _.first(findElements(currentActivities, triggerEntity, rs.config.id));

			const isSizeLockedPropName = rs.dataService.getContainerData().entityMappings[triggerEntity.EntityName].IsSizeLocked;
			if (!_.isUndefined(isSizeLockedPropName) && triggerEntity[isSizeLockedPropName] && !_fullshift) {
				let isLockedWarningMessage = ['Dateshift for activity ' + currentOriginalEntity[rs.config.id] + ':'];
				let warnMessage = `The ${triggerEntity.EntityName.toLowerCase()} may have ${triggerEntity.EntityName.toLowerCase()}(s) as sub-entities! No other dateshift mode than fullshift is valid in this case. The dateshift has been aborted`;
				isLockedWarningMessage.push(warnMessage);
				console.warn(_.join(isLockedWarningMessage, '\n'));
				return null;
			}

			function checkStartParams() {
				if (!currentOriginalEntity) {
					return '';
				}

				if (!(moment.isMoment(triggerEntity[rs.config.start]) && moment.isMoment(triggerEntity[rs.config.end]))) {
					// if one or both dates are not set -> always assume it's dualshift
					return 'fullShift';
				}

				var diffStart = triggerEntity[rs.config.start].diff(currentOriginalEntity[rs.config.start], 'seconds');
				var diffEnd = triggerEntity[rs.config.end].diff(currentOriginalEntity[rs.config.end], 'seconds');

				if (diffStart === 0 && diffEnd === 0) {
					// if none changed: cancel operation!
					return 'break';
				}

				if (!_.isUndefined(fixedShiftVariant)) {
					return fixedShiftVariant;
				}

				if (diffStart !== 0 && diffEnd !== 0) {
					return 'fullShift';
				}

				if (diffStart !== 0 && diffEnd === 0) {
					return 'startShift';
				}

				if (diffStart === 0 && diffEnd !== 0) {
					return 'endShift';
				}

				// if none changed: cancel operation!
				return 'break';
			}

			let _shiftVariant = checkStartParams();

			if (_shiftVariant === 'break') {
				return [];
			}

			let shiftOptions = {
				shiftVariant: _shiftVariant,
				fullShift: _fullshift
			};

			// if shift variant changed
			if (!_.isNil(rs.lastShiftOptions) &&
				(rs.lastShiftOptions.fullShift !== shiftOptions.fullShift || (!shiftOptions.fullShift && rs.lastShiftOptions.shiftVariant !== shiftOptions.shiftVariant))) {
				// reset data
				rs.resetDateshiftData();
			}
			rs.lastShiftOptions = _.cloneDeep(shiftOptions);

			// DEV-32482 - this functinality was apparently causing unwanted behavior. Until the logic for this feature is
			// corrected, will be deactivated!
			//let relations = rs.dataService.isDateshiftDeactivated ? [] : rs.relations;
			let relations = rs.relations;

			rs.updateProperties(rs.originalActivities, triggerEntity);

			var dateShiftResult = platformDateshiftService.shiftDate(rs.originalActivities, relations, triggerEntity, _config, rs.calendarData, shiftOptions);
			let markItemsAsModifiedNeeded = false;
			let gridElements = [];

			_.forEach(dateShiftResult.activities, (activitiy) => {
				if (activitiy.hasChanged) {
					markItemsAsModifiedNeeded = true;
					// set gridData
					// possibility of multiple matches
					gridElements = findElements(currentActivities, activitiy, rs.config.id);
					_.forEach(gridElements, (gridElement) => {
						// #114445
						gridElement[rs.config.start] = !_.isNil(gridElement[rs.config.start]) ? moment(activitiy[rs.config.start]) : null;
						gridElement[rs.config.end] = !_.isNil(gridElement[rs.config.end]) ? moment(activitiy[rs.config.end]) : null;
						// mark item as modified to save changes
						if (_.isFunction(rs.dataService.markItemAsModified) && !_.isFunction(rs.dataService.markEntitiesAsModified)) {
							rs.dataService.markItemAsModified(gridElement);
						}
					});

					if (activitiy[rs.config.id] === triggerEntity[rs.config.id]) {
						var originalStartMoment = moment(triggerEntity[rs.config.start]);
						var orginalEndMoment = moment(triggerEntity[rs.config.end]);
						triggerEntity[rs.config.start] = originalStartMoment.isValid() ? moment(activitiy[rs.config.start]) : triggerEntity[rs.config.start];
						triggerEntity[rs.config.end] = orginalEndMoment.isValid() ? moment(activitiy[rs.config.end]) : triggerEntity[rs.config.end];
					}
				}
			});
			if (markItemsAsModifiedNeeded && _.isFunction(rs.dataService.markEntitiesAsModified)) {
				rs.dataService.markEntitiesAsModified(_.filter(dateShiftResult.activities, { 'hasChanged': true }));
				markItemsAsModifiedNeeded = false;
			}
			rs.postProcess(dateShiftResult.activities);

			// at the end: reset data if needed
			if (dateShiftResult.shiftCorrected) {
				rs.resetDateshiftData();
			}

			// if messages of dateshift: print them
			if (!_.isEmpty(dateShiftResult.messages)) {
				buildDateshiftMessages(dateShiftResult.messages, currentOriginalEntity[rs.config.id], rs);
			}

			shiftStatus.isShiftFinished = true;
			return dateShiftResult.activities;
		}

		let descriptionMap = new Map();

		function buildDateshiftMessageElem(errType, messages, entityPrefixes, virtualEntites, rs, descriptionMap) {
			let mainElem = document.createElement('div');
			mainElem.classList.add('msg-part');
			mainElem.classList.add(errType);

			let headerElem = document.createElement('p');
			headerElem.classList.add('header');
			headerElem.innerText = errType[0].toUpperCase() + errType.substr(1) + `s (${messages.length}) ∇`;
			headerElem.style.backgroundColor = 'rgb(221 221 221)';
			headerElem.style.padding = '18px';
			headerElem.style.color = 'black';

			let dateshiftMessageString = '';
			let tmpString = '';
			let mainLineWithId = '';

			messages.map((msgData) => {
				let translatedMessageText = $translate.instant(`platform.dateshiftMessages.${errType}.${msgData.message.messageCode}`);
				if (translatedMessageText === `platform.dateshiftMessages.${errType}.${msgData.message.messageCode}`) {
					translatedMessageText = msgData.message.defaultMessageText;
				}
				let entityOfError = virtualEntites[entityPrefixes.get(msgData.id[0])].find((x) => x.Id === +msgData.id.substr(1));

				mainLineWithId = `${$translate.instant('platform.dateshiftMessages.forActivity')} ${msgData.id}`;

				if (descriptionMap && entityOfError) {
					mainLineWithId += ` (${$translate.instant('platform.dateshiftMessages.entityType')}: ${entityPrefixes.get(msgData.id[0])}`;
					(rs.dataService.getContainerData().messageDescriptions[entityPrefixes.get(msgData.id[0])].mappedProperties).forEach(propsForEntityType => {
						const descMapForEntityType = descriptionMap.has(entityPrefixes.get(msgData.id[0])) && descriptionMap.get(entityPrefixes.get(msgData.id[0]));
						const descsForProp = descMapForEntityType && descMapForEntityType.get(propsForEntityType.propName);
						const descForEntity = descsForProp && descsForProp.get(entityOfError.Id);

						if (descMapForEntityType && descsForProp && descForEntity) {
							let translationString = `${propsForEntityType.module}.${propsForEntityType.translation}`;
							let translation = $translate.instant(translationString);
							mainLineWithId += ` # ${translation !== translationString ? translation : propsForEntityType.defaultDescription}: ${descForEntity}`;
						}
					});
					mainLineWithId += ')';
				}

				tmpString = ' ' + msgData.message.messageCode + ' - ' + translatedMessageText + '\n';
				dateshiftMessageString += mainLineWithId + '\n' + tmpString + '\n';

				/* if (msgData.additionalInfo) {
					dateshiftMessageString =+ msgData.additionalInfo ? '\n' + msgData.additionalInfo : '';
				} */
			});

			let preElem = document.createElement('pre');
			preElem.style.whiteSpace = 'pre-wrap';
			preElem.style.display = 'none';
			preElem.innerHTML = dateshiftMessageString;

			headerElem.addEventListener('click', () => {
				preElem.style.display = preElem.style.display === 'none' ? 'block' : 'none';
			});

			mainElem.appendChild(headerElem);
			mainElem.appendChild(preElem);

			return mainElem;
		}

		function buildDateshiftMessages(dsMessages, actId, rs) {
			if (dsMessages.filter(msg => msg.type === 'error').length > 0) {
				const entityPrefixes = new Map(Object.entries(rs.dataService.getContainerData().entityPrefixes).map(x => [x[1], x[0]]));
				const virtualEntites = rs.dataService.getContainerData().virtualEntities;

				const distinctErrorEntityIds = new Set(dsMessages.map(errorEntity => errorEntity.id));
				const errorEntitiesByType = new Map();

				[...distinctErrorEntityIds.values()].forEach((compositeId) => {
					const entityTypeName = entityPrefixes.get((compositeId).substring(0, 1));
					const id = +(compositeId).substring(1);

					if (!!id) {
						const entity = virtualEntites[entityTypeName] && virtualEntites[entityTypeName].find(vE => vE.Id === id);
						if (!errorEntitiesByType.has(entityTypeName)) {
							errorEntitiesByType.set(entityTypeName, []);
						}
						errorEntitiesByType.get(entityTypeName).push(entity);
					}
				});
				let msgElements = [];

				let descriptionMap = new Map();
				let promiseList = [];

				errorEntitiesByType.forEach((list, entityTypeName) => {
					if (rs.dataService.getContainerData().messageDescriptions && rs.dataService.getContainerData().messageDescriptions[entityTypeName] && rs.dataService.getContainerData().messageDescriptions[entityTypeName].getDescriptionPromiseFn) {
						promiseList.push(rs.dataService.getContainerData().messageDescriptions[entityTypeName].getDescriptionPromiseFn()(list).then(result => {
							descriptionMap.set(entityTypeName, result);
							return result;
						}));
					}
				});

				// #region build text for dialog

				$q.all(promiseList).then(() => {
					const errorMessages = _.map(_.filter(dsMessages, { type: 'error' }));
					if (!_.isEmpty(errorMessages)) {
						msgElements.push(buildDateshiftMessageElem('error', errorMessages, entityPrefixes, virtualEntites, rs, descriptionMap));
					}

					const warnMessages = _.map(_.filter(dsMessages, { type: 'warning' }));
					if (!_.isEmpty(warnMessages)) {
						msgElements.push(buildDateshiftMessageElem('warning', warnMessages, entityPrefixes, virtualEntites, rs, descriptionMap));
					}

					const infoMessages = _.map(_.filter(dsMessages, { type: 'info' }));
					if (!_.isEmpty(infoMessages)) {
						msgElements.push(buildDateshiftMessageElem('info', infoMessages, entityPrefixes, virtualEntites, rs, descriptionMap));
					}

					const messageIconClass = !_.isEmpty(errorMessages) ? 'error' : !_.isEmpty(warnMessages) ? 'warning' : 'info';

					const mainLineElem = document.createElement('h1');
					let mainLine = messageIconClass === 'error' ? $translate.instant('platform.dateshiftMessages.abortShift') + '\n' : '';
					mainLine += $translate.instant('platform.dateshiftMessages.mainLine') + ' ' + actId + ` (${entityPrefixes.get(actId[0])}):`;
					mainLineElem.innerHTML = mainLine;

					msgElements.unshift(mainLineElem);



					// #endregion build text for dialog

					let timer = 3000;
					const toastTemplate = `
				<div class="alarm-overlay ds-message">
					<div class="alert" role="alert" style="text-align:center">
					${$translate.instant('platform.dateshiftMessages.errorToastMessage')}
					<p class="timer">(${timer / 1000}s)<p>
					</div>
				</div>`

					let toastElem = ((new DOMParser).parseFromString(toastTemplate, 'text/html')).getElementsByClassName('alarm-overlay')[0];
					let timerElem = toastElem.getElementsByClassName('timer')[0];

					toastElem.firstElementChild.addEventListener('click', (event) => {
						platformModalService.showMsgBox('', $translate.instant('platform.dateshiftMessages.dialogTitle'), messageIconClass);

						setTimeout(() => {
							let refElement = document.getElementsByClassName('message')[0];
							if (refElement) {
								let divElement = document.createElement('div');
								refElement.parentElement.replaceChild(divElement, refElement);
								msgElements.forEach(msgElem => divElement.appendChild(msgElem));
							}
						}, 40);
					});

					let activeElem = document.activeElement.querySelector('.modal-dialog') || document.getElementsByTagName('body')[0].appendChild(toastElem);

					if (activeElem !== toastElem) {
						activeElem.appendChild(toastElem);
					}

					let timerInterval = setInterval(() => {
						timer -= 1000;
						timerElem.innerHTML = `(${timer / 1000}s)`;
					}, 1000)

					setTimeout(() => {
						clearInterval(timerInterval);
						toastElem.remove();
					}, timer);
				});
			} else {
				return false;
			}

		}

		/**
		 * @ngdoc function
		 * @name resetDateshift
		 * @description Public function that resets the stored data of a DateshiftRegistration.
		 *
		 * @param {string} id - The name of the registered dataService.
		 **/
		function resetDateshift(id) {
			var rs = _.find(registeredServices, { id: id });
			if (rs) {
				rs.resetDateshiftData();
			}
		}
		/**
		 * @ngdoc function
		 * @name getDateshiftTools
		 * @description Public function that resets the stored data of a DateshiftRegistration.
		 *
		 * @param {string} id - The name of the registered dataService using the tools.
		 * @param {Object} toolConfigList: A list of configuration objects for each tool.
		 * @param {string} toolConfigList[].id: Id of the tool.
		 * @param {bool} toolConfigList[].excluded: If true, the setting with the given config id will not be added.
		 * Since there is no setting, no tool will be returend either.
		 * The properties hidde and value will not be evaluated (see below)
		 * @param {*} toolConfigList[].value: Start value of the setting with the given config id.
		 * @param {bool} toolConfigList[].hidden: If true, the setting for the given config id will be set but no tool will be returned.
		 * @param {string} - configId: The id of the config setting.
		 * @param {string} - containerScope: The angular scope of the entire container.
		 **/
		function getDateshiftTools(id, toolConfigList, configId, containerScope) {
			var returnedTools = [];
			var rs = _.find(registeredServices, { id: id });

			if (!rs) {
				return null;
			}
			configId = configId || 'default';

			var toolTemplates = {
				dateshiftModes: {
					toolPath: 'mode',
					getToolFn: getModeTool
				},
				fullshift: {
					toolPath: 'fullshift',
					getToolFn: getFullshiftTool
				}
			};

			// Verify the container is planning board or normal grid
			// Id container having grid then, check for fullshift icon access.
			let containerId;
			let toolbarSettings = [];

			if (containerScope && containerScope.$parent && typeof containerScope.$parent.getContainerUUID === 'function') {
				containerId = containerScope.$parent.getContainerUUID();
			}

			if (containerScope && containerScope.getContainerUUID && typeof containerScope.getContainerUUID === 'function') {
				toolbarSettings = mainViewService.customData(containerScope.getContainerUUID(), 'toolbarSettings');
			}

			// config object: excluded (bool), value (varies)
			_.forEach(toolTemplates, function (toolTemplate, toolId) {
				var toolConfig = _.find(toolConfigList, { id: toolId }) || {};
				// ignore the toolbarSettings if we have the config from toolConfigList
				let dateshiftmode = (toolbarSettings && toolbarSettings.length > 0) ? _.find(toolbarSettings, { id: toolId }) || {} : {};

				if (toolId === 'fullshift' && containerId && platformGridAPI.grids.exist(containerId) && !rs.dataService.fullshiftPermission) {
					toolConfig.hidden = true;
					toolConfig.excluded = true; // Skip further execution
					toggleFullshift(rs.id, configId, containerScope, true);
				}

				if (!toolConfig.excluded) {
					if (!_.isNil(dateshiftmode.value)) {
						rs[toolTemplate.toolPath][configId] = dateshiftmode.value;
					} else {
						rs[toolTemplate.toolPath][configId] = !_.isNil(toolConfig.value) ? toolConfig.value : rs[toolTemplate.toolPath]['default'];
					}

					if (!toolConfig.hidden) {
						var tool = toolTemplate.getToolFn(rs, configId, containerScope);
						returnedTools.push(tool);
					}

					if (toolsForConfigId[configId]) {
						toolsForConfigId[configId].forEach(tools => {
							if (tools.items.find(x => x.id === toolId)) {
								switch (toolId) {
									case 'dateshiftModes':
										let foundTools = tools.items.find(x => x.id === toolId);
										foundTools.list.activeValue = rs[toolTemplate.toolPath][configId];
										foundTools.iconClass = _.find(foundTools.list.items, { 'value': rs[toolTemplate.toolPath][configId] }).iconClass;
										break;
									case 'fullshift':
										tools.items.find(x => x.id === toolId).value = rs[toolTemplate.toolPath][configId];
									default:
										break;
								}
							}
						});
					}
				}
			});

			if (containerScope && containerScope.tools) {
				if (!toolsForConfigId[configId]) {
					toolsForConfigId[configId] = new Map();
				}

				if (_.isFunction(containerScope.$on)) {
					containerScope.$on('$destroy', function () {
						toolsForConfigId[configId].delete(containerScope.gridId);
					});
				}

				toolsForConfigId[configId].set(containerScope.gridId || 'withoutGridId', containerScope.tools);
				toolsForConfigId[configId].forEach(tools => _.isFunction(tools.update) && tools.update());
			}

			return returnedTools;
		}

		// private methods

		function changeMode(id, mode, configId, containerScope) {
			var rs = _.find(registeredServices, { id: id });
			if (rs && rs.mode && _.isString(mode)) {
				rs.mode[configId] = mode;
				rs.resetDateshiftData();
			}

			// set active mode in toolbar
			let containerUUID = containerScope.getContainerUUID();
			let settings = [{ 'id': 'dateshiftModes', 'value': mode }];
			let toolbarSettings = mainViewService.customData(containerUUID, 'toolbarSettings');
			if (toolbarSettings && toolbarSettings.length > 0) {
				let foundFullshiftSettings = toolbarSettings.find(set => set.id === 'dateshiftModes');
				foundFullshiftSettings ? foundFullshiftSettings.value = mode : toolbarSettings = [...toolbarSettings, ...settings];
			} else {
				toolbarSettings = settings;
			}

			var dateshiftModes = _.find(containerScope.dateShiftModeTools, { 'id': 'dateshiftModes' });
			dateshiftModes.iconClass = _.find(dateshiftModes.list.items, { 'value': mode }).iconClass;

			if (toolsForConfigId[configId]) {
				toolsForConfigId[configId].forEach((tools,uuid) => {
						let foundTools = tools?.items?.find(x => x.id === 'dateshiftModes') || containerScope?.tools?.items?.find(x => x.id === 'dateshiftModes');
						if (foundTools) {
							foundTools.list.activeValue = rs.mode[configId];
							foundTools.iconClass = _.find(foundTools.list.items, { 'value': mode }).iconClass;
							mainViewService.customData(uuid, 'toolbarSettings', toolbarSettings);
							tools.update();
							containerScope.tools.update();
						}
				});
			} else {
				mainViewService.customData(containerUUID, 'toolbarSettings', toolbarSettings);
				containerScope.tools.update();
			}
		}

		function toggleFullshift(id, configId, containerScope, valueNew) {
			var rs = _.find(registeredServices, { id: id });
			let containerUUID = containerScope.getContainerUUID();
			if (rs && rs.fullshift && _.isString(configId)) {
				if (_.isUndefined(rs.fullshift[configId])) {
					// set to initial value
					rs.fullshift[configId] = rs.fullshift['default'];
				}
				rs.fullshift[configId] = valueNew;
				let settings = [{ 'id': 'fullshift', 'value': rs.fullshift[configId] }];
				let toolbarSettings = mainViewService.customData(containerUUID, 'toolbarSettings');
				if (toolbarSettings && toolbarSettings.length > 0) {
					let foundFullshiftSettings = toolbarSettings.find(set => set.id === 'fullshift');
					foundFullshiftSettings ? foundFullshiftSettings.value = valueNew : toolbarSettings = [...toolbarSettings, ...settings];
				} else {
					toolbarSettings = settings;
				}
				rs.resetDateshiftData();

				if (toolsForConfigId[configId]) {
					toolsForConfigId[configId].forEach((tools, uuid) => {
						if (tools?.items?.find(x => x.id === 'fullshift') !== undefined || containerScope?.tools?.items?.find(x => x.id === 'fullshift') !== undefined) {
							tools.items.find(x => x.id === 'fullshift').value = valueNew;
							mainViewService.customData(uuid, 'toolbarSettings', toolbarSettings);
						}
						tools.update();
						containerScope.tools.update();
					});
				} else {
					mainViewService.customData(containerUUID, 'toolbarSettings', toolbarSettings);
					containerScope.tools.update();
				}
			}
		}

		function getModeTool(rs, configId, containerScope) {
			// rs.mode[configId] = !_.isUndefined(value)? value : rs.mode['default'];
			return {
				id: 'dateshiftModes',
				sort: 1,
				iconClass: rs.modeCssClass[rs.mode[configId]],
				type: 'dropdown-btn',
				caption: 'platform.gantt.dateshiftModes',
				showTitles: false,
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					activeValue: rs.mode[configId],
					items: [
						{
							id: 'dateShiftBoth',
							caption: 'platform.gantt.both',
							type: 'radio',
							value: 'both',
							iconClass: rs.modeCssClass.both,
							// shiftMode: 'both',
							fn: function () {
								changeMode(rs.id, 'both', configId, containerScope);
							}
						},
						{
							id: 'dateShiftRight',
							caption: 'platform.gantt.right',
							type: 'radio',
							value: 'right',
							iconClass: rs.modeCssClass.right,
							// shiftType: 'right',
							fn: function () {
								changeMode(rs.id, 'right', configId, containerScope);
							}
						},
						{
							id: 'dateShiftLeft',
							caption: 'platform.gantt.left',
							type: 'radio',
							value: 'left',
							iconClass: rs.modeCssClass.left,
							// shiftType: 'left',
							fn: function () {
								changeMode(rs.id, 'left', configId, containerScope);
							}
						},
						{
							id: 'dateShiftSelf',
							caption: 'platform.gantt.self',
							type: 'radio',
							value: 'self',
							iconClass: rs.modeCssClass.self,
							// shiftType: 'self',
							fn: function () {
								changeMode(rs.id, 'self', configId, containerScope);
							}
						},
					/* // replaced by fullPush
						{
							id: 'dateShiftPush',
							caption: 'platform.gantt.push',
							type: 'radio',
							value: 'push',
							iconClass: rs.modeCssClass.push,
							// shiftType: 'push',
							fn: function () {
								changeMode(rs.id, 'push', configId, containerScope);
							}
						}, */
						{
							id: 'dateShiftFullPush',
							caption: 'platform.gantt.fullPush',
							type: 'radio',
							value: 'fullPush',
							iconClass: rs.modeCssClass.push,
							// shiftType: 'fullPush',
							fn: function () {
								changeMode(rs.id, 'fullPush', configId, containerScope);
							}
						}
					]
				}
			};
		}

		function getFullshiftTool(rs, configId, containerScope) {
			// rs.fullshift[configId] = !_.isUndefined(value)? value : rs.fullshift['default'];
			return {
				id: 'fullshift',
				caption: 'platform.gantt.fullshift',
				type: 'check',
				value: rs.fullshift[configId],
				iconClass: 'tlb-icons ico-timeline2',
				fn: function (itemId, item) {
					toggleFullshift(rs.id, configId, containerScope, item.value);
				}
			};
		}

		function evaluateDataService(dataService) {
			var isAlreadyRegistered = _.findIndex(registeredServices, { id: dataService.getServiceName() }) >= 0;
			var requirements = [
				dataService.getServiceName,
				dataService.getDateshiftData,
				dataService.getList
			];
			return !isAlreadyRegistered && _.every(requirements, _.isFunction);
		}

		function findElements(list, object, propertyName) {
			return _.filter(list, function (element) {
				return element[propertyName] === object[propertyName];
			});
		}

		function getSequenceData(id) {
			if (id) {
				var rs = _.find(registeredServices, { id: id });
				return rs ? rs.cacheSequenceData : [];
			}
			return [];
		}

		function getCalendarData(id) {
			if (id) {
				var rs = _.find(registeredServices, { id: id });
				return rs ? rs.calendarData : new Map();
			}
			return new Map();
		}

		function updateSequenceData(id) {
			if (id) {
				var rs = _.find(registeredServices, { id: id });
				return rs ? rs.updateSequenceData(rs.dataService.getList()) : [];
			}
			return [];
		}

		function updateCalendarId(id, actIds, calendarId) {
			if (id) {
				const rs = _.find(registeredServices, { id: id });
				return rs ? rs.updateCalendarId(rs.dataService.getList(), actIds, calendarId) : [];
			}
			return [];
		}

		return service;
	}
})(angular);
