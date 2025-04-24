/**
 * Created by mik on 01/10/2021.
 */
/* global */

(function (angular) {
	'use strict';

	angular.module('productionplanning.common').service('productionplanningCommonLoadSequenceDataService', ProductionplanningCommonLoadSequenceDataService);

	ProductionplanningCommonLoadSequenceDataService.$inject = ['_', 'moment', 'PlatformMessenger', 'mountingTrsRequisitionStatusLookupService', 'platformDateshiftCalendarService'];

	function ProductionplanningCommonLoadSequenceDataService(_, moment, PlatformMessenger, mountingTrsRequisitionStatusLookupService, dateshiftCalendarService) {
		let service = this;

		let loadCounter = 1;
		let projectStretchRate = 4; // in the future with lookup
		let stretchRateFactor = 25.00;
		let stretchRate = projectStretchRate + (projectStretchRate * (stretchRateFactor / 100));
		service.options = {
			'startDate': moment(),
			'dailyStartTime': moment.utc().hours(7).minutes(0).seconds(0),
			'projectStretchRate': projectStretchRate,
			'stretchRateFactor': stretchRateFactor,
			'stretchRate': stretchRate,
			'maxWeight': 15000,
			'halfStretchRateFriday': false,
			'maximizeLastLoad': true, // temporarily set to true
			'plannedStretchRate': 0
		};// default options for load sequence

		// mobilized data variables
		service.mobilizedDataData = {
			changeSystemTriggered: false,
			mobilizedDataChanged: false,
			mobilizedDataComment: ''// 'The mobilized data has been changed!'
		};

		service.getDefaultGridSettings = () => {
			const defaultGridSettings = {
				columnWidth: 230,
				showInfoFields: true
			};
			return defaultGridSettings;
		};

		let activityTypeId = 0;
		let propertyMapping = {};
		let fieldSequenceInfos = {
			DrawingId: 0,
			ProjectId: 0,
			LgmJobId: 0,
			InstallationRequisitionId: 0
		};

		let initialLoadSequence = [];
		let loadsToDelete = [];
		let daysToDelete = [];

		// todo: make original data part of current data! (rework constructors!)
		let originalDays = [];
		let originalLoads = [];
		let originalProducts = [];

		let calendarData;

		let productsRef = [];
		setOriginalProductsRef();

		function setOriginalProductsRef() {
			productsRef = JSON.parse(JSON.stringify(originalProducts));
		}

		service.setActivityType = (activityId) => {
			activityTypeId = activityId;
		};

		service.setPropertyMapping = (mapping) => {
			propertyMapping = mapping;
		};

		service.setCalendarData = (calData) => {
			calendarData = calData;
		};

		let loadSequence = [];

		/**
		 * @name SequenceDay
		 * @type class
		 * @description A class for the Day of Field Sequence Plan
		 */
		class SequenceDay {
			constructor(options, id = Math.floor(Math.random() * 100000), totalTime = moment.utc(0), loads = [], eventTypeFk = activityTypeId, code = 'Code', version = 0) {
				this.Id = id;
				this.EventTypeFk = eventTypeFk;
				this.PlannedStart = !_.isUndefined(options.plannedStart) ? moment(options.plannedStart).format('YYYY-MM-DDTHH:mm:ss') : moment().utc(0).format('YYYY-MM-DDTHH:mm:ss');
				this.Code = code;
				this.Version = version;
				this.rowId = 'day' + id;
				this.label = options.label;
				this.stretchRate = options.stretchRate || null;
				this.loads = loads;
				this.totalTime = totalTime;
				this.totalTimeFormatted = formatTime(totalTime);
				this.loadCount = 0;
				this.productCount = 0;
				this.weight = 0;
				this.hasChanged = false;

				this.setLoadCount = () => {
					if (this.loads.length === 1 && this.loads[0].children.length === 0) {
						this.loadCount = 0;
					} else {
						this.loadCount = this.loads.length;
					}
				};

				this.setStretchRate = (stretchRate) => {
					this.stretchRate = stretchRate;
				};

				this.recalculate = () => {
					this.recalculateTimes();
					this.recalculateWeights();
					this.recalculateCounts();
				};

				this.recalculateTimes = () => {
					this.setTotalTime();
					this.setLoadStartTime();
				};

				this.recalculateWeights = () => {
					this.loads.forEach(load => {
						load.setWeight();
					});
				};

				this.recalculateCounts = () => {
					this.setProductCount();
					this.setLoadCount();
				};

				this.setLoadStartTime = () => {
					this.loads.forEach((load, idx) => {
						if (idx > 0) {
							let prevLoad = this.loads[idx - 1];
							let loadStart = moment.utc(prevLoad.PlannedStart).add(getTimeSeconds(prevLoad) * 1000);
							load.setPlannedStart(loadStart);
						} else {
							load.setPlannedStart(moment.utc(this.PlannedStart));
						}
					});
				};

				this.setPlannedStart = (date) => {
					this.PlannedStart = moment.utc(this.PlannedStart).hours(moment.utc(date).hours()).minutes(moment.utc(date).minutes());
				};

				this.setProductCount = () => {
					this.productCount = _.flatMap(this.loads, 'children').length;
				};

				this.setTotalTime = () => {
					this.totalTime = moment.utc(0);
					this.loads.forEach(load => {
						load.setLoadTime();
						this.totalTime = this.totalTime.add(getTimeSeconds(load) * 1000);
					});
					this.totalTimeFormatted = formatTime(this.totalTime);
				};

				this.addLoad = (load) => {
					this.loads.push(load);
				};

				this.addLoadAfter = (afterLoad, load) => {
					if (_.isEqual(afterLoad.Code, '')) {
						let indexAfter = this.loads.indexOf(afterLoad);
						this.removeLoad(indexAfter);
						load.setPlannedStart(moment.utc(afterLoad.PlannedStart).hours(moment(service.options.dailyStartTime).hours()).minutes(moment(service.options.dailyStartTime).minutes()).seconds(0));
						this.loads.splice(indexAfter, 0, load);
					} else {
						load.setPlannedStart(moment.utc(afterLoad.PlannedStart));
						this.loads.splice(this.loads.indexOf(afterLoad) + 1, 0, load);
					}
				};

				this.removeLoad = (idx, deleteLoad = true) => {
					if (!_.isUndefined(this.loads[idx])) {
						if (deleteLoad === true) {
							addLoadToDelete(this, idx);
						}
						this.loads.splice(idx, 1);
					}
				};

				this.moveDayToDate = (date) => {
					const timeUnit = 'd';
					const originalDate = moment.utc(this.PlannedStart).startOf(timeUnit);
					const newDate = moment.utc(date).startOf(timeUnit);
					const diffTimeSpan = newDate.diff(originalDate, timeUnit);
					this.moveDayBy(diffTimeSpan, timeUnit);
				};

				this.moveDayBy = (timeSpan, timeUnit = 's') => {
					if (_.isNil(timeSpan) || timeSpan === 0) {
						return;
					}
					// add to date of day
					this.PlannedStart.add(timeSpan, timeUnit);
					this.label = moment(this.PlannedStart).format('dddd L');
					// day needs to be saved!
					this.setDayHasChanged();
					// change days of all loads as well!
					this.loads.forEach((l) => {
						l.setPlannedStart(moment.utc(this.PlannedStart).hours(moment(l.PlannedStart).hours()).minutes(moment(l.PlannedStart).minutes()).seconds(0));
						l.setLoadHasChanged();
					});
				};

				this.setDayHasChanged = () => {
					this.hasChanged = true;
				};

				this.processItem = () => {
					this.PlannedStart = moment(this.PlannedStart).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
					// todo: remove if required to be set to different value!
					this.PlannedFinish = this.PlannedStart;
					this[_.get(propertyMapping, 'Day.StretchRate')] = this.stretchRate;
				};
			}
		}

		/**
		 * @name Load
		 * @type class
		 * @description A class for the Load of Field Sequence Plan
		 *
		 * @property {number} Id
		 * @property {string} Code
		 * @property {string} start
		 * @property {number} time
		 * @property {number} weight
		 * @property {number} Version
		 * @property {moment} PlannedStart
		 */
		class Load {
			constructor(start, time = moment.utc(0), plannedStart = moment.utc(0), weight = 0, children = [], version = 0, id = Math.floor(Math.random() * 100000), code = '', bundleId = null, isAccepted = false) {
				this.Id = id;
				this.Code = code;
				this.Version = version;
				this.PlannedStart = moment.utc(plannedStart);
				this.start = start;
				this.time = time;
				this.weight = weight;
				this.children = children;
				this.hasChanged = false;
				this._bundleId = bundleId;
				this.IsAccepted = isAccepted;
				//this.processServerItem();

				this.setLoadHasChanged = () => {
					this.hasChanged = true;
					if (this.IsAccepted) {
						service.setMobilizedDataChanged();
					}
				};

				this.setWeight = () => {
					this.weight = _.sum(_.map(this.children, 'weight'));
				};

				this.setLoadTime = () => {
					this.time = moment.utc(0);
					this.children.forEach(product => {
						this.time = this.time.add(getTimeSeconds(product) * 1000);
					});
				};

				this.setProductStartTime = () => {
					this.children.forEach((product, idx) => {
						if (idx > 0) {
							let prevProduct = this.children[idx - 1];
							let productStart = moment.utc(prevProduct.start, 'H:mm').add(getTimeSeconds(prevProduct) * 1000);
							product.setStartTime(formatTime(productStart));
						} else {
							// first product of load has the same start as the load
							product.setStartTime(this.start);
						}
					});
				};

				this.setStartTime = (start) => {
					this.start = start;
					this.setProductStartTime();
				};

				this.setPlannedStart = (date) => {
					this.setStartTime(formatTime(date));
					this.PlannedStart = moment.utc(date).hours(moment(this.start, 'H:mm').hours()).minutes(moment(this.start, 'H:mm').minutes()).format('YYYY-MM-DDTHH:mm:ss');
				};

				this.addProduct = (product) => {
					this.children.push(product);
					this.setWeight();
				};

				this.setCode = () => {
					if (this.children.length > 0 && _.isEqual(this.Code, '')) {
						this.Code = 'Load ' + loadCounter++;
					} else if (this.children.length === 0) {
						this.Code = '';
					}
				};

				this.removeProduct = (idx) => {
					this.children.splice(idx, 1);
				};

				this.addProductAfter = (afterProduct, product) => {
					if (_.isEqual(afterProduct.Code, '')) {
						let indexAfter = this.children.indexOf(afterProduct);
						this.removeProduct(indexAfter);
						this.children.splice(indexAfter, 0, product);
					} else {
						this.children.splice(this.children.indexOf(afterProduct) + 1, 0, product);
					}
					this.setProductStartTime();
				};

/*
				this.processServerItem = () => {
					let statusList = mountingTrsRequisitionStatusLookupService.getList();
					let status = _.find(statusList, {Id: this.TrsReqStatusFk});
					this.IsAccepted = status.IsAccepted;
				};
*/

				this.processItem = () => {
					this.PlannedStart = moment(this.PlannedStart).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
					// todo: remove if required to be set to different value!
					this.PlannedFinish = this.PlannedStart;
				};
			}
		}

		/**
		 * @name Product
		 * @type class
		 * @description A class of the Product of Field Sequence Plan
		 *
		 * @property {number} Id
		 * @property {number} Code
		 * @property {number} fieldSequence
		 * @property {moment} start
		 * @property {moment} time
		 * @property {number} weight
		 * @property {boolean} hasChanged
		 */
		class Product {
			constructor(product, start, fieldSequence = productsRef.indexOf(product) + 1) {
				this.Id = product.Id;
				this.Code = product.Code;
				this.fieldSequence = fieldSequence;
				this.start = start;
				this.time = moment.utc(0).minutes(product[_.get(propertyMapping, 'Product.InstallationTime')] || 0);
				this.weight = product.Weight ? product.Weight : product.weight;
				this.hasChanged = false;

				this.setStartTime = (start) => {
					this.start = start;
				};
				this.setProductHasChanged = () => {
					this.hasChanged = true;
				};

				this.processItem = () => {
					const fromZero = this.time.clone().startOf('day');
					const diffMinutes = this.time.diff(fromZero, 'minutes');
					this[_.get(propertyMapping, 'Product.InstallationOrder')] = this.fieldSequence.toString();
					this[_.get(propertyMapping, 'Product.InstallationTime')] = diffMinutes.toString();
				};
			}
		}

		function formatTime(date) {
			return date.format('H:mm');
		}

		service.setMobilizedDataChanged = () => {
			service.mobilizedDataData.changeSystemTriggered = true;
			service.mobilizedDataData.mobilizedDataChanged = true;
			service.onMobilizedDataChangeSystemTriggered.fire();
		};

		/**
		 * @name setOptions
		 * @description Set options for the load sequence.
		 * @param newOptions {object}
		 */
		service.setOptions = (newOptions) => {
			service.options = {
				startDate: newOptions.startDate,
				dailyStartTime: newOptions.dailyStartTime,
				stretchRate: newOptions.stretchRate,
				maxWeight: newOptions.maxWeight,
				projectStretchRate: newOptions.projectStretchRate,
				stretchRateFactor: newOptions.stretchRateFactor,
				halfStretchRateFriday: newOptions.halfStretchRateFriday ? newOptions.halfStretchRateFriday : service.options.halfStretchRateFriday,
				maximizeLastLoad: newOptions.maximizeLastLoad ? newOptions.maximizeLastLoad : service.options.maximizeLastLoad,
				plannedStretchRate: newOptions.plannedStretchRate ? newOptions.plannedStretchRate : service.options.plannedStretchRate
			};
		};

		/**
		 * @name addLoadToDelete
		 * @description Add load to array of loads to be deleted by server.
		 *
		 * @param day {object}
		 * @param loadIndex {number}
		 */
		function addLoadToDelete(day, loadIndex) {
			if (day.loads[loadIndex].Version !== 0) {
				if (_.isUndefined(loadsToDelete[day.Id])) {
					loadsToDelete[day.Id] = [];
				}
				loadsToDelete[day.Id].push(day.loads[loadIndex]);
				day.loads[loadIndex].setLoadHasChanged();
			}
		}

		/**
		 * @name addDayToDelete
		 * @description Add day to array of days to be deleted by server.
		 *
		 * @param day {object}
		 */
		function addDayToDelete(day) {
			if (daysToDelete.indexOf(day) < 0 && day.Version !== 0) {
				daysToDelete.push(day);
			}
		}

		/**
		 * @name setInitialLoadSequence
		 * @description Set initial calculated load sequence.
		 *
		 * @return loadSequence
		 */
		service.setInitialLoadSequence = () => {
			loadSequence = JSON.parse(JSON.stringify(initialLoadSequence));
		};

		/**
		 * @name getLoadByDay
		 * @description Get days by day Id.
		 *
		 * @param dayId
		 * @return {*[]}
		 */
		service.getLoadByDay = (dayId) => {
			try {
				return loadSequence.filter(sequence => sequence.rowId === dayId)[0].loads;
			} catch (e) {
				return null;
			}
		};

		/**
		 * @name getLoadsOfDayByProduct
		 * @description Get loads of the day by product Id.
		 *
		 * @param productId
		 * @return {*[]}
		 */
		service.getLoadsOfDayByProduct = (productId) => {
			return loadSequence.filter(sequence => {
				return (JSON.stringify(sequence).indexOf(productId) > 0);
			})[0].loads;
		};

		/**
		 * @name getLoadByProduct
		 * @description Get load containing product by product Id.
		 *
		 * @param productId
		 * @return {*[]}
		 */
		service.getLoadByProduct = (productId) => {
			return loadSequence.filter(sequence => {
				return (JSON.stringify(sequence).indexOf(productId) > 0);
			})[0].loads.filter(l => l.children.includes(service.getProductById(productId)));
		};

		/**
		 * @name calculateLoadSequence
		 * @description Calculate the load sequence with the given products and options.
		 *
		 * @param useOriginalProducts {boolean}
		 * @param modifiedProducts {[Product]?}
		 */
		service.calculateLoadSequence = (useOriginalProducts = true, modifiedProducts) => {
			loadCounter = 1;
			let nextStartTimeSec = 0;
			let optionsForCalculation = _.clone(service.options);
			let dailyStartTime = moment(optionsForCalculation.startDate).hours(moment(optionsForCalculation.dailyStartTime, 'H:mm').hours()).minutes(moment(optionsForCalculation.dailyStartTime, 'H:mm').minutes());
			let stretchRatesOfDays = [];

			if (useOriginalProducts) {
				setOriginalProductsRef();
			}
			if (loadSequence.length > 0) {
				loadSequence.forEach(day => {
					if (day.loads.length >= 0) {
						stretchRatesOfDays.push(day.stretchRate);
					}
				});
			}
			loadSequence.forEach(d => {
				addDayToDelete(d);
				d.loads.forEach((l, idx) => {
					addLoadToDelete(d, idx);
				});
			});
			loadSequence = [];

			let products = modifiedProducts || [];
			if (!modifiedProducts) {
				_.forEach(productsRef, productRef => {
					let product = new Product(productRef, formatTime(dailyStartTime.add(nextStartTimeSec, 's')));
					products.push(product);
				});
			} else {
				_.forEach(modifiedProducts, modifiedProduct => {
					modifiedProduct.start = formatTime(dailyStartTime.add(nextStartTimeSec, 's'));
				});
			}

			while (products.length > 0) {
				let product = products[0];
				let currentDay = (loadSequence) ? loadSequence.at(-1) : false;
				let currentDayStretchRate = 0;
				if (currentDay) {
					currentDayStretchRate = moment.utc(currentDay.PlannedStart).day() === 5  && optionsForCalculation.halfStretchRateFriday ? Math.ceil(currentDay.stretchRate/2) : currentDay.stretchRate;
					currentDay.setProductCount();
				}

				if (currentDay && currentDayStretchRate > currentDay.productCount) {
					// add to this day
					let lastLoad = currentDay.loads.at(-1);
					if (lastLoad && lastLoad.weight + product.weight <= optionsForCalculation.maxWeight) {
						// add to this load
						lastLoad.addProduct(product);
						products.splice(0, 1);
					} else {
						// create new load and add product
						let newLoad = new Load(formatTime(dailyStartTime.add(nextStartTimeSec, 's')), moment.utc(0), dailyStartTime.add(nextStartTimeSec, 's'));
						newLoad.addProduct(product);
						newLoad.setCode();
						currentDay.addLoad(newLoad);
						products.splice(0, 1);
					}
				} else {
					if(optionsForCalculation.maximizeLastLoad){
						// ensure a new product is returned
						product = maximizeLastLoadOfDay(products, currentDay); // Add a product to the last load of day if flag maximizeLastLoad set to true
					}
					// create new day, new initial load and add product
					let newDayStretchRate = 0;
					if (!_.isUndefined(stretchRatesOfDays[loadSequence.length])){
						newDayStretchRate = stretchRatesOfDays[loadSequence.length];
					} else {
						newDayStretchRate = moment.utc(loadSequence.at(-1).PlannedStart).day() === 4 && optionsForCalculation.halfStretchRateFriday ? Math.ceil(optionsForCalculation.stretchRate/2) : optionsForCalculation.stretchRate;
					}

					let newProduct = null;
					if (newDayStretchRate !== 0) {
						// remove product from list and add to load
						newProduct = product;
						products.splice(0, 1);
					}

					createNewDay(newDayStretchRate, newProduct);
				}
			}

			// add empty day at the end
			createNewDay(optionsForCalculation.stretchRate);

			service.recalculateDays();

			// maybe not needed if initial reload is removed
			// if (initialLoadSequence.length <= 0) {
			// 	initialLoadSequence = JSON.parse(JSON.stringify(loadSequence));
			// }

			service.onLoadSequenceChanged.fire(loadSequence);
		};

		/**
		 * @name maximizeLastLoadOfDay
		 * @description Add a product to last load of day if maxWeight of load not exceeded
		 *
		 * @param products List of available products
		 * @param addToDay The day of load to maximized
		 *
		 * @return { Product } Returns the next product of the list.
		 */
		function maximizeLastLoadOfDay(products, addToDay){
			let product = products ? products[0] : [];
			let lastLoad = addToDay ? addToDay.loads.at(-1) : false;
			if (lastLoad && lastLoad.weight + product.weight <= service.options.maxWeight) {
				// add to this load
				lastLoad.addProduct(product);
				products.splice(0, 1);
			}
			return products[0];
		}

		/**
		 * @name createNewDay
		 * @description Create new Day with given properties.
		 *
		 * @param stretchRate
		 * @param product
		 */
		function createNewDay(stretchRate, product = null) {
			let nextStartDate = moment.utc(service.options.startDate);
			if (loadSequence.length > 0) {
				nextStartDate = moment.utc(loadSequence[loadSequence.length - 1].PlannedStart).add(1, 'd');
			}
			const actualStartDate = service.getNextFreeDay(nextStartDate);
			let newLoad = new Load(formatTime(moment(service.options.dailyStartTime)), moment.utc(0), actualStartDate.hours(moment(service.options.dailyStartTime, 'H:mm').hours()).minutes(moment(service.options.dailyStartTime, 'H:mm').minutes()).seconds(0));
			let newDay = new SequenceDay(
				{
					label: moment(actualStartDate).format('dddd L'),
					stretchRate: stretchRate,
					plannedStart: moment(actualStartDate)
				}
			);

			if (!_.isNull(product)) {
				newLoad.addProduct(product);
			}

			newLoad.setCode();

			newDay.addLoad(newLoad);
			loadSequence.push(newDay);
		}

		service.getNextFreeDay = (startDate, moveBackwards) => {
			return dateshiftCalendarService.getNextFreeDay(calendarData, startDate, moveBackwards);
		};

		/**
		 * @name recalculateTimes
		 * @description Recalculate times of all products of all days in field sequence.
		 */
		service.recalculateTimes = () => {
			loadSequence.forEach(day => {
				day.recalculateTimes();
			});

			// service.onDataChanged.fire(loadSequence);
		};

		function recalculateProductSequence() {
			let index = 1;
			loadSequence.forEach(day => {
				day.loads.forEach(load => {
					load.children.forEach((p) => {
						// set properties of manipulated data
						if(p.fieldSequence !== index){
							p.fieldSequence = index;
							p.setProductHasChanged();

							// set update product reference array
							let prodRef = productsRef.filter(pRef => pRef.Id === p.Id)[0];
							prodRef.Userdefined1 = p.fieldSequence.toString();
						}
						index++;
					});
				});
			});

			productsRef = _.sortBy(productsRef, (product) => parseInt(product.Userdefined1));
		}

		/**
		 * @name moveProductAfterProduct
		 * @description Move the product with drag and drop on a new load or a new day. Removes the load if it is empty after moving the product.
		 *
		 * @param products {[Product]} - Array of loads.
		 * @param [afterProduct] {Product} - (optional) is the destination load for the product. toLoad can be empty on a new day.
		 */
		service.moveProductAfterProduct = (products, afterProduct) => {
			let sequenceChanged = false;
			loadSequence.forEach((day, dayIdx) => {
				if (day.loads.length > 0) {
					day.loads.forEach(load => {
						if (load.children.length > 0 && load.children.indexOf(products[0]) >= 0) {
							products.forEach(productToDelete => {
								let indexOfProductInLoad = load.children.indexOf(productToDelete);
								if (indexOfProductInLoad >= 0 && load.children[indexOfProductInLoad].Id !== afterProduct.Id) { // remove product if the product to remove is not the target product
									load.removeProduct(load.children.indexOf(productToDelete));
									load.setLoadHasChanged();
								}
							});
						}
						if (load.children.length === 0) {
							load.setCode();
							addLoadToDelete(day, day.loads.indexOf(load));
							load.setLoadHasChanged();
						}
						if (load.children.indexOf(afterProduct) >= 0) {
							products.forEach(productToPaste => {
								if (load.children.indexOf(productToPaste) === -1 && load.children.length > 0) { // add product if the product to add is not already in the load
									load.addProductAfter(afterProduct, productToPaste);
									productToPaste.setProductHasChanged();
									load.setLoadHasChanged();
									// add new day if moved to last day
									if (loadSequence.length - 1 === loadSequence.indexOf(day)) {
										sequenceChanged = true;
										createNewDay(service.options.stretchRate);
									}
								}
							});
						}
					});
				}
			});

			service.recalculateDays();

			if (sequenceChanged) {
				// only fire if a new day was added
				service.onLoadSequenceChanged.fire(loadSequence);
			} else {
				service.onDataChanged.fire(loadSequence);
			}
		};

		/**
		 * @name moveLoadToLoad
		 * @description Move the product with drag and drop on a new load or a new day. Removes the load if it is empty after moving the product.
		 *
		 * @param loads {[Load]} - Array of loads.
		 * @param [toLoad] {Load} - (optional) is the destination load for the product. toLoad can be empty on a new day.
		 */
		service.moveLoadToLoad = (loads, toLoad) => {
			let sequenceChanged = false;
			loadSequence.forEach((day, dayIdx) => {
				if (day.loads.length > 0 && day.loads.indexOf(loads[0]) >= 0) {
					loads.forEach(loadToDelete => {
						let indexOfLoadInDay = day.loads.indexOf(loadToDelete);
						if (indexOfLoadInDay >= 0 && day.loads[indexOfLoadInDay].Id !== toLoad.Id) { // remove load if the load to remove is not the target load
							day.removeLoad(day.loads.indexOf(loadToDelete), false);
							loadToDelete.setLoadHasChanged();
						}
					});
				}
				if (day.loads.length === 0) {
					let newLoad = new Load(formatTime(moment(service.options.dailyStartTime)), moment.utc(0), moment.utc(day.PlannedStart).hours(moment(service.options.dailyStartTime, 'H:mm').hours()).minutes(moment(service.options.dailyStartTime, 'H:mm').minutes()).seconds(0));
					newLoad.setCode();
					day.addLoad(newLoad);
					day.setDayHasChanged();
				}
				if (day.loads.indexOf(toLoad) >= 0) {
					loads.forEach(loadToPaste => {
						if (day.loads.indexOf(loadToPaste) === -1 && loadToPaste.children.length !== 0) { // add load if the load to add is not already in the day
							loadToPaste.setLoadHasChanged();
							day.addLoadAfter(toLoad, loadToPaste);
							// add new day if moved to last day
							if (loadSequence.length - 1 === loadSequence.indexOf(day)) {
								sequenceChanged = true;
								createNewDay(service.options.stretchRate);
							}
						}
					});
				}
			});

			service.recalculateDays();

			if (sequenceChanged) {
				// only fire if a new day was added
				service.onLoadSequenceChanged.fire(loadSequence);
			} else {
				service.onDataChanged.fire(loadSequence);
			}
		};

		/**
		 * @name moveProduct
		 * @description Move the product with drag and drop on a new load or a new day. Removes the load if it is empty after moving the product.
		 *
		 * @param products {[Product]} - Array of products.
		 * @param [toLoad] {object} - (optional) is the destination load for the product. toLoad can be empty on a new day.
		 */
		service.moveProductToLoad = (products, toLoad) => {
			let sequenceChanged = false;
			products.forEach(product => {
				loadSequence.forEach((day, dayIdx) => {
					if (day.loads.length > 0) {
						day.loads.forEach(load => {
							if (load.children.length > 0) {
								load.children.forEach(loadProduct => {
									if (loadProduct.Id === product.Id) {
										load.removeProduct(load.children.indexOf(loadProduct));
										load.setLoadHasChanged();
										// only remove when no children (products) are left and its not the last load on that day
										if (load.children.length <= 0) {
											addLoadToDelete(day, day.loads.indexOf(load));
											if (day.loads.length > 1) {
												day.removeLoad(day.loads.indexOf(load));
												load.setLoadHasChanged();
											}
										}
									}
								});
							}

							if (load.Id === toLoad.Id) {
								load.addProduct(product);
								product.setProductHasChanged();
								load.setLoadHasChanged();

								// add new day if moved to last day
								if (loadSequence.length - 1 === loadSequence.indexOf(day)) {
									sequenceChanged = true;
									createNewDay(service.options.stretchRate);
								}
							}
							load.setCode();
						});
					}
				});
			});

			service.recalculateDays();

			if (sequenceChanged) {
				// only fire if a new day was added
				service.onLoadSequenceChanged.fire(loadSequence);
			} else {
				service.onDataChanged.fire(loadSequence);
			}
		};

		/**
		 * @name recalculateDays
		 * @description Recalculate properties of all days in field sequence.
		 */
		service.recalculateDays = () => {
			loadSequence.forEach(day => {
				day.recalculate();
			});
			recalculateProductSequence();
		};

		// service.recalculateWeights = () => {
		// 	loadSequence.forEach(day => {
		// 		day.loads.forEach(load => {
		// 			load.setWeight();
		// 		});
		// 	});
		// };

		/**
		 * @name setStretchRateOfDay
		 * @description Set a new stretchRate of a specific day.
		 *
		 * @param dayId {String}
		 * @param stretchRate {number}
		 */
		service.setStretchRateOfDay = (dayId, stretchRate) => {
			loadSequence.forEach((day) => {
				if (day.rowId === dayId) {
					day.setStretchRate(stretchRate);
					day.setDayHasChanged();
				}
			});
		};

		/**
		 * @name setProductTime
		 * @description Set duration of installation of a product.
		 *
		 * @param productId {number}
		 * @param time {number}
		 */
		service.setProductTime = (productId, time) => {
			productsRef.forEach((product) => {
				if (product.Id === productId) {
					product.time = time;
				}
				return product;
			});
		};

		/**
		 * @name setProductWeight
		 * @description Set weight of a product. (Currently not used/needed)
		 *
		 * @param productId {number}
		 * @param weight {number}
		 */
		service.setProductWeight = (productId, weight) => {
			productsRef.forEach((product) => {
				if (product.Id === productId) {
					product.weight = weight;
				}
				return product;
			});
		};

		/**
		 * @name createNewLoad
		 * @description Create a new load on a specific day with the selected products.
		 *
		 * @param dayId {number}
		 * @param productIds {array}
		 */
		service.createNewLoad = (dayId, productIds) => {
			let productsToAdd = [];
			let editedDay = _.find(loadSequence, ['Id', dayId]);
			let loadsOfDay = editedDay.loads;
			let earliestProductToMove = {
				product: {},
				load: {}
			};

			_.forEach(loadsOfDay, load => {
				if (!_.isUndefined(load)) {
					load.time = moment.utc(0);
					load.weight = 0;
					_.forEach(load.children, product => {
						if (!_.isUndefined(product)) {
							if (_.includes(productIds, product.Id)) {
								if (earliestProductToMove.product.Id && moment.utc(earliestProductToMove.product.start, 'H:mm').isSameOrAfter(moment.utc(product.start, 'H:mm')) || _.isUndefined(earliestProductToMove.product.Id)) {
									earliestProductToMove.product = product;
									earliestProductToMove.load = load;
								}
								productsToAdd.push(product);
							}
						}
					});
				}
				productsToAdd.forEach(product => {
					if (load.children.indexOf(product) >= 0) {
						// remove product from current load
						load.removeProduct(load.children.indexOf(product));
						load.setLoadHasChanged();
					}
				});
			});

			if (productsToAdd.length > 0) {
				// add new load after the load of selected product with earliest start
				let newLoad = new Load(earliestProductToMove.product.time, moment.utc(0), editedDay.PlannedStart, 0, productsToAdd);
				newLoad.setCode();
				editedDay.addLoadAfter(editedDay.loads[loadsOfDay.indexOf(earliestProductToMove.load)], newLoad);
				editedDay.loads = loadsOfDay.filter(loads => loads.children.length > 0);
			}
			service.recalculateDays();
			service.onLoadCreated.fire(dayId);
		};

		function getTimeSeconds(product) {
			return moment.duration(formatTime(product.time)).asSeconds();
		}

		/**
		 * @name resetInitialLoadSequence
		 * @description Reset the initial set load sequence.
		 */
		service.resetInitialLoadSequence = () => {
			initialLoadSequence = [];
		};

		service.resetLoadSequence = () => {
			loadSequence = [];
			daysToDelete = [];
			loadsToDelete = [];
			loadCounter = 1;
			service.mobilizedDataData.changeSystemTriggered = false;
			service.mobilizedDataData.mobilizedDataChanged = false;
			service.mobilizedDataData.mobilizedDataComment = '';// 'The mobilized data has been changed!'
		};

		/**
		 * @name refreshManipulatedData
		 * @description Refresh manipulated data of field sequence plan.
		 * @param data {[Product]}
		 */
		service.refreshManipulatedData = (data) => {
			let modifiedProducts = [];

			loadSequence.forEach(day =>
				day.loads.forEach(load =>
					load.children.forEach(product => {
						let modifiedProduct = data.filter(modProd => modProd.Id === product.Id)[0];
						modifiedProducts.push(_.merge(product, modifiedProduct));
					})));
			modifiedProducts = _.sortBy(modifiedProducts, ['fieldSequence']);
			service.calculateLoadSequence(false, modifiedProducts);
		};

		/**
		 * @name setLoadSequenceFromData
		 * @description Set the field sequence plan from delivered data
		 *
		 * @param data {object}
		 * @param data.DrawingId {number}
		 * @param data.ProjectId {number}
		 * @param data.LgmJobId {number}
		 * @param data.InstallationRequisitionId {number}
		 * @param data.FieldSequenceDays {array}
		 * @param data.FieldSequenceLoads {array}
		 * @param data.FieldSequenceProducts {array}
		 */
		service.setLoadSequenceFromData = (data) => {
			let currentProductSequence = 1;
			fieldSequenceInfos = _.clone(data.PlanInfo);
			// reset original data here
			originalDays.length = 0;
			originalLoads.length = 0;
			originalProducts.length = 0;
			let sumInstallationTime = 0;
			let index = 1;

			let options = _.clone(service.options);
			let statusList = mountingTrsRequisitionStatusLookupService.getList();
			let status = {};

			if (data.FieldSequenceDays) {
				data.FieldSequenceDays.forEach((day) => {
					let currentDay = {};
					let currentPlannedStart = options.startDate;
					if (!_.isUndefined(day.InstallationActivity)) {
						originalDays.push(day.InstallationActivity[0]);
						currentDay = new SequenceDay({
							label: moment(day.InstallationActivity[0].PlannedStart).format('dddd L'),
							stretchRate: parseInt(day.InstallationActivity[0][_.get(propertyMapping, 'Day.StretchRate')]),
							plannedStart: moment.utc(day.InstallationActivity[0].PlannedStart),
						}, day.InstallationActivity[0].Id, moment(options.startDate).add(loadSequence.length, 'd'), [], day.InstallationActivity[0].EventTypeFk, day.InstallationActivity[0].Code, day.InstallationActivity[0].Version);
					} else {
						currentPlannedStart = !_.isUndefined(loadSequence[loadSequence.length - 1]) ? loadSequence[loadSequence.length - 1].PlannedStart : currentPlannedStart;
						currentDay = new SequenceDay({
							label: moment(currentPlannedStart).add(1, 'd').format('dddd L'),
							stretchRate: options.stretchRate,
							plannedStart: moment(currentPlannedStart).add(1, 'd').hours(options.dailyStartTime.hours()).minutes(options.dailyStartTime.minutes()).seconds(0),
						});
					}

					if (day.FieldSequenceLoads) {
						day.FieldSequenceLoads.forEach(load => {
							let currentLoad = {};

							if (!_.isUndefined(load.TransportRequisition)) {
								let status = _.find(statusList, {Id: load.TransportRequisition[0].TrsReqStatusFk});
								originalLoads.push(load.TransportRequisition[0]);
								currentLoad = new Load(formatTime(moment(load.TransportRequisition[0].PlannedStart)), moment.utc(0), moment(load.TransportRequisition[0].PlannedStart), 0, [], load.TransportRequisition[0].Version, load.TransportRequisition[0].Id, load.TransportRequisition[0].Code, load.BundleId,  status.IsAccepted);
							} else {
								currentLoad = new Load(formatTime(moment(options.dailyStartTime)), moment.utc(0), moment.utc(currentPlannedStart).add(1, 'd').hours(moment(service.options.dailyStartTime, 'H:mm').hours()).minutes(moment(service.options.dailyStartTime, 'H:mm').minutes()).seconds(0));
							}

							if (load.FieldSequenceProducts) {
								load.FieldSequenceProducts = _.sortBy(load.FieldSequenceProducts, (product) => parseInt(product.Userdefined1));
								load.FieldSequenceProducts.forEach(product => {
									// product.time = product.Length; //todo set correct property of time - for testing lenght!
									//product.InstallationSequence = index;
									product.Userdefined1 = (index).toString();
									originalProducts.push(product);
									let productToAdd = new Product(product, '', currentProductSequence++);
									currentLoad.addProduct(productToAdd);
									sumInstallationTime += productToAdd.time;
									index++;
								});
							}
							currentLoad.setProductStartTime();
							currentLoad.setCode();
							if (currentLoad.children.length !== 0 || currentDay.loads.length === 0) {
								currentDay.addLoad(currentLoad);
							}
						});
					}
					currentDay.setProductCount();
					if (currentDay.Version !== 0 && (_.isNil(currentDay.stretchRate) || _.isNaN(currentDay.stretchRate))) {
						currentDay.setStretchRate(currentDay.productCount);
					}
					if (currentDay.loads.length > 0) {
						loadSequence.push(currentDay);
					} else {
						daysToDelete.push(currentDay);
					}
				});
			}

			// add last empty day with empty load
			createNewDay(service.options.stretchRate);
			productsRef = [...originalProducts];

			// set planned stretch rate depending on installation time of all products
			service.options.plannedStretchRate = Math.ceil(productsRef.length / Math.ceil((moment.duration(sumInstallationTime).asMinutes() || 1) / moment.duration(moment.utc(0).hours(8)).asMinutes()));

			// if the load sequence doesn't exist yet -> calculate automatic
			if (data.FieldSequenceDays.length === 1 && _.isNull(data.FieldSequenceDays[0].MainItemId)
				&& data.FieldSequenceDays[0].FieldSequenceLoads.length === 1 && _.isNull(data.FieldSequenceDays[0].FieldSequenceLoads[0].MainItemId)) {
				service.calculateLoadSequence(true);
			} else {
				// otherwise recalculate the data to update grid
				service.recalculateDays();
			}
		};

		/**
		 * @name getLoadSequence
		 * @description Get calculated load sequence.
		 *
		 * @return loadSequence
		 */
		service.getLoadSequence = () => {
			return loadSequence;
		};

		/**
		 * @name getLoadSequenceForServer
		 * @description Generates and returns an object from current field sequence plan that's readable for server
		 *
		 * @return {{PlanInfo: {DrawingId: number, LgmJobId: number, InstallationRequisitionId: number, ProjectId: number}, DrawingId: number, FieldSequenceDaysToSave: *[], FieldSequenceDaysToDelete: *[]}}
		 */
		service.getLoadSequenceForServer = () => {
			// pop if last day and its loads are empty
			if (loadSequence[loadSequence.length - 1].loads.filter(l => l.children.length > 0).length === 0) {
				loadSequence.pop();
			}

			let fieldSequencePlan = {
				FieldSequenceDaysToSave: [],
				FieldSequenceDaysToDelete: [],
				PlanInfo: fieldSequenceInfos
			};

			let dayToSave = {};
			let loadToSave = {};

			loadSequence.forEach(day => {
				if (daysToDelete.indexOf(day) < 0) {
					day.processItem();
					dayToSave = {
						MainItemId: day.Id,
						InstallationActivity: null,
						FieldSequenceLoadsToSave: [],
						FieldSequenceLoadsToDelete: []
					};
					day.loads.forEach(load => {
						load.processItem();
						loadToSave = {
							MainItemId: load.Id,
							BundleId: load._bundleId,
							TransportRequisition: null,
							FieldSequenceProductsToSave: []
						};
						if ((load.Version === 0 || load.hasChanged) && !_.isEqual(load.Code, '')) {
							// map original transport requisitions here!
							const modifiedLoad = _.find(originalLoads, {Id: load.Id}) || {};
							_.merge(modifiedLoad, load);
							loadToSave.TransportRequisition = [modifiedLoad];
							if(load.Version === 0){ // if load new => all products hasChanged flag to true
								load.children.forEach(p => p.setProductHasChanged());
							}
						}
						loadToSave.FieldSequenceProductsToSave = load.children.filter(p => p.hasChanged).map(p => {
							p.processItem();
							p = _.merge(productsRef.filter(pRef => pRef.Id === p.Id)[0], p);
							return p;
						});

						if (loadToSave.TransportRequisition !== null || loadToSave.FieldSequenceProductsToSave.length > 0) {
							dayToSave.FieldSequenceLoadsToSave.push(loadToSave);
						}

						if (!_.isUndefined(loadsToDelete[day.Id])) {
							let currentLoadsToDelete = loadsToDelete[day.Id].filter(l => day.loads.indexOf(l) === -1 && l.Version > 0);
							if (!_.isNull(currentLoadsToDelete)) {
								dayToSave.FieldSequenceLoadsToDelete = currentLoadsToDelete;
							}
						}
					});
					if (!_.isEqual(day.loads[0].Code, '') && (day.Version === 0 || day.hasChanged)) {
						// map original transport requisitions here!
						const modifiedDay = _.find(originalDays, {Id: day.Id}) || {};
						_.merge(modifiedDay, day);
						dayToSave.InstallationActivity = [modifiedDay];
					}
					if (dayToSave.InstallationActivity !== null || dayToSave.FieldSequenceLoadsToSave.length > 0 || dayToSave.FieldSequenceLoadsToDelete.length > 0) {
						fieldSequencePlan.FieldSequenceDaysToSave.push(dayToSave);
					}
				}
			});

			// additionally, delete all loads that are not part of a day anymore!
			const dayIds = loadSequence.map((d) => d.Id);
			const additionalLoadsToDelete = loadsToDelete.filter((v, i) => !dayIds.includes(i)).flat();
			const dayToSaveForDelLoads = {
				FieldSequenceLoadsToDelete: []
			};
			additionalLoadsToDelete.forEach(l => {
				if (l.Version > 0) {
					l.processItem();
					dayToSaveForDelLoads.FieldSequenceLoadsToDelete.push(l);
				}
			});
			if (!_.isEmpty(dayToSaveForDelLoads.FieldSequenceLoadsToDelete)) {
				fieldSequencePlan.FieldSequenceDaysToSave.push(dayToSaveForDelLoads);
			}

			fieldSequencePlan.FieldSequenceDaysToDelete = daysToDelete;
			fieldSequencePlan[_.get(propertyMapping, 'Plan.Settings')] = formatSettings(service.options);
			if (service.mobilizedDataData.mobilizedDataChanged) {
				fieldSequencePlan.PlanInfo.UpdateComment = service.mobilizedDataData.mobilizedDataComment;
				fieldSequencePlan.PlanInfo.TriggerWorkflow = true;
			}
			return fieldSequencePlan;
		};

		function formatSettings(options) {
			return {
				'startDate': options.startDate.format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
				'dailyStartTime': options.dailyStartTime.format('H:mm'),
				'projectStretchRate': options.projectStretchRate,
				'stretchRateFactor': options.stretchRateFactor,
				'stretchRate': options.stretchRate,
				'maxWeight': options.maxWeight,
				'halfStretchRateFriday': options.halfStretchRateFriday,
				'maximizeLastLoad': options.maximizeLastLoad
			};
		}

		service.getList = () => {
			return loadSequence[0];
		};

		let treeCount = 0;
		// get load trees for each grid
		service.getTree = () => {
			if (treeCount > loadSequence.length - 1) {
				treeCount = 0;
			}
			let loads = loadSequence[treeCount].loads;
			treeCount = (treeCount < loadSequence.length - 1) ? treeCount + 1 : 0;
			return loads;
		};

		service.getProducts = () => {
			return loadSequence.flatMap(day => {
				return day.loads.flatMap(load => {
					return load.children;
				});
			});
		};

		service.getProductById = (productId) => {
			let productFromId;
			loadSequence.filter(day => {
				return day.loads.filter(load => {
					return load.children.filter(product => {
						if (product.Id === productId) {
							productFromId = product;
						}
					});
				});
			});
			return productFromId;
		};

		service.getSelected = () => {
			return false;
		};

		/**
		 * @name setDefinedStretchRateOfLoadSequence
		 * @description Set the stretch rates of all days of field sequence plan to stretch rate defined in wizard settings dialog
		 */
		service.setDefinedStretchRateOfLoadSequence = () => {
			if (loadSequence.length > 0) {
				loadSequence.forEach(day => {
					day.stretchRate = service.options.stretchRate;
				});
			}
		};

		service.isInstanceOfSequenceDay = (object) => {
			return object instanceof SequenceDay;
		};

		service.isInstanceOfLoad = (object) => {
			return object instanceof Load;
		};

		service.isInstanceOfProduct = (object) => {
			return object instanceof Product;
		};

		let selectedEntity = {};
		let selectedEntities = new Map();
		service.setSelected = (selected, entities) => {
			selectedEntity = selected;
			// selectedEntities = entities;
		};

		service.setSelectedByGrid = (uuid, entities) => {
			selectedEntities.set(uuid, entities);
		};

		service.removeSelectionByGrid = (uuid) => {
			selectedEntities.delete(uuid);
		};

		service.resetSelection = () => {
			selectedEntities = new Map();
		};

		service.getSelectedFlat = () => {
			return _.flatMap(Array.from(selectedEntities.values()));
		};

		service.getFieldSequenceInfos = () => {
			return fieldSequenceInfos;
		};

		service.loadSequenceChanged = () => {
			service.onLoadSequenceChanged.fire(loadSequence);
		};

		// custom events
		service.onLoadSequenceChanged = new PlatformMessenger();
		service.onDataChanged = new PlatformMessenger();
		service.onLoadCreated = new PlatformMessenger();
		service.onLoadSequenceFromDataCreated = new PlatformMessenger();
		service.onMobilizedDataChangeSystemTriggered = new PlatformMessenger();
		service.onLeadingGridInitialized = new PlatformMessenger();

		service.registerOnLoadSequenceChanged = (fn) => {
			service.onLoadSequenceChanged.register(fn);
		};

		service.unRegisterOnLoadSequenceChanged = (fn) => {
			service.onLoadSequenceChanged.unregister(fn);
		};

		service.registerOnDataChanged = (fn) => {
			service.onDataChanged.register(fn);
		};

		service.unRegisterOnDataChanged = (fn) => {
			service.onDataChanged.unregister(fn);
		};

		service.registerOnLoadCreated = (fn) => {
			service.onLoadCreated.register(fn);
		};

		service.unRegisterOnLoadCreated = (fn) => {
			service.onLoadCreated.unregister(fn);
		};

		service.registerOnLoadSequenceFromDataCreated = (fn) => {
			service.onLoadSequenceFromDataCreated.register(fn);
		};

		service.unRegisterOnLoadSequenceFromDataCreated = (fn) => {
			service.onLoadSequenceFromDataCreated.unregister(fn);
		};

		service.registerOnMobilizedDataChangeSystemTriggered = (fn) => {
			service.onMobilizedDataChangeSystemTriggered.register(fn);
		};

		service.unRegisterOnMobilizedDataChangeSystemTriggered = (fn) => {
			service.onMobilizedDataChangeSystemTriggered.unregister(fn);
		};

		service.registerOnLeadingGridInitialized = (fn) => {
			service.onLeadingGridInitialized.register(fn);
		};

		service.unRegisterOnLeadingGridInitialized = (fn) => {
			service.onLeadingGridInitialized.unregister(fn);
		};

		return service;
	}
})(angular);