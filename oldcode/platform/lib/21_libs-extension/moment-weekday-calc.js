/**
 * Weekdays calculator
 * @author Andrei Kondratev [andrew@kondratev.pro]
 */
;if ( typeof require !== 'undefined' )
{
  moment = require('moment');
}
(function(moment) {

  function WeekDayCalc (rangeStart,rangeEnd,weekdays,exclusions,useIsoWeekday) {
    this.rangeStart = moment(rangeStart);
    this.rangeEnd = moment(rangeEnd);
    this.exclusions = exclusions;
    this.useIsoWeekday = (useIsoWeekday==true);
    if(this.rangeStart.isAfter(this.rangeEnd)) {
      throw new WeekDayCalcException('rangeStart is after rangeEnd');
    }
    this.weekdays = parseWeekdays(weekdays, this.useIsoWeekday);
  }

  WeekDayCalc.prototype.calculate = function() {
    var weekDaysCount = 0;
    var rangeStartWeekEnd = this.rangeStart.clone().endOf('week');
    var rangeEndWeekStart = this.rangeEnd.clone().startOf('week');

    if (rangeEndWeekStart.diff(rangeStartWeekEnd,'days')<30 || this.exclusions) {
      weekDaysCount = this.calculateIterative(this.rangeStart,this.rangeEnd,this.weekdays,this.exclusions);
    } else {
      /* a little optimisation for longer time intervals - it works faster with intervals longer than one year */
      var wholeWeeksDiff = Math.round(rangeEndWeekStart.diff(rangeStartWeekEnd,'weeks',true));
      weekDaysCount += wholeWeeksDiff*this.weekdays.length;
      weekDaysCount += this.calculateIterative(this.rangeStart,rangeStartWeekEnd,this.weekdays);
      weekDaysCount += this.calculateIterative(rangeEndWeekStart,this.rangeEnd,this.weekdays);
    }

    return weekDaysCount;
  };

  WeekDayCalc.prototype.calculateIterative = function(rangeStart,rangeEnd,weekdays,exclusions) {
    var weekDaysCount = 0, day = rangeStart.clone();
    var str_exclusions = parseExclusions(exclusions);

    while(day.valueOf()<=rangeEnd.valueOf()) {
      var weekdayFunc = this.useIsoWeekday?'isoWeekday':'weekday';
      if ( (weekdays.indexOf(day[weekdayFunc]())>=0) && (str_exclusions.length==0 || str_exclusions.indexOf(day.format("YYYY-MM-DD"))<0) ) {
        weekDaysCount++;
      }
      day.add(1, 'day');
    }
    return weekDaysCount;
  };

  Function.prototype.construct = function(aArgs) {
    var fConstructor = this, fNewConstr = function() { fConstructor.apply(this, aArgs); };
    fNewConstr.prototype = fConstructor.prototype;
    return new fNewConstr();
  };

  function WeekDayCalcException (message) {
    this.message = message;
    this.name = 'WeekDayCalcException';
  }
  WeekDayCalcException.prototype = new Error;
  WeekDayCalc.prototype.WeekDayCalcException = WeekDayCalcException;
  
  function DaysSetConverter (rangeStart, weekdays, exclusions, useIsoWeekday) {
    this.rangeStart = moment(rangeStart);
    this.useIsoWeekday = (useIsoWeekday==true);
    this.exclusions = exclusions;
    this.weekdays = parseWeekdays(weekdays, this.useIsoWeekday);
  }

  /**
   * Calculates the date of {workdays} from now excluding today
   * @param daysToAdd
   * @returns {Suite|*}
   */
  DaysSetConverter.prototype.calculate = function(daysToAdd) {
    var daysLeft = daysToAdd;
    var resultDate = this.rangeStart.clone();
    var str_exclusions = parseExclusions(this.exclusions);
    var weekdayFunc = this.useIsoWeekday?'isoWeekday':'weekday';
    if (daysLeft>=0){
        /* positive value - add days */
        while (daysLeft > 0) {
            resultDate.add(1, 'day');
            if ((this.weekdays.indexOf(resultDate[weekdayFunc]()) >= 0) && (str_exclusions.length == 0 || str_exclusions.indexOf(resultDate.format("YYYY-MM-DD")) < 0)) {
                daysLeft--;
            }
        }
    } else {
        /* negative value - subtract days */
        while (daysLeft < 0) {
            resultDate.subtract(1, 'day');
            if ((this.weekdays.indexOf(resultDate[weekdayFunc]()) >= 0) && (str_exclusions.length == 0 || str_exclusions.indexOf(resultDate.format("YYYY-MM-DD")) < 0)) {
                daysLeft++;
            }
        }
    }
    return resultDate;
  };


  function DaysSetConverterException (message) {
    this.message = message;
    this.name = 'DaysSetConverterException';
  }
  DaysSetConverterException.prototype = new Error;
  DaysSetConverter.prototype.DaysSetConverterException = DaysSetConverterException;

  var parseWeekdays = function(weekdays, useIsoWeekday) {
    var validWeekdays = [];
    if (!weekdays) {
      throw new WeekDayCalcException('weekdays must be defined');
    }
    if (weekdays.length > 7) {
      throw new WeekDayCalcException("Weekdays array exceeding week length of 7 days");
    }
    for (var i=0;i<weekdays.length;i++) {
      var weekday = weekdays[i];
      if (useIsoWeekday) {
        if (isNaN(weekday)) throw new WeekDayCalcException("isoWeekDayCalc accepts weekdays as numbers only, try using weekdayCalc if you need a locale aware behaviour");
        if (weekday<1 || weekday>7) throw new WeekDayCalcException("The weekday is out of 1 to 7 range");
      } else if(!isNaN(weekday)){
        if (weekday<0 || weekday>6) throw new WeekDayCalcException("The weekday is out of 0 to 6 range");
      } else {
        weekday = moment().day(weekday).weekday();
      }
      if (validWeekdays.indexOf(weekday)>=0) {
        throw new WeekDayCalcException("Weekdays set contains duplicate weekday");
      }
      validWeekdays.push(weekday);
    }
    return validWeekdays;
  };

  var parseExclusions = function(exclusions) {
    var str_exclusions = [];
    if (exclusions) {
      while(exclusions.length>0) {
        str_exclusions.push(moment(exclusions.shift()).format("YYYY-MM-DD"));
      }
    }
    return str_exclusions;
  };

  WeekDayCalc.calculateWeekdays = function(that, arguments, useIsoWeekday) {
    var rangeStart, rangeEnd, weekdays, exclusions;
    useIsoWeekday = useIsoWeekday?true:false;
    switch (arguments.length) {
      case 4:
        exclusions = arguments[3];
        /* Fall-through to three args */
      case 3:
        rangeStart = moment(arguments[0]).startOf('day');
        rangeEnd = moment(arguments[1]).endOf('day');
        weekdays = arguments[2];
        break;
      case 2:
        rangeStart = that;
        rangeEnd = arguments[0];
        weekdays = arguments[1];
        break;
      case 1:
        var arg = arguments[0];
        if (arg && arg.rangeEnd && arg.weekdays) {
          rangeStart = arg.rangeStart ? moment(arg.rangeStart).startOf('day') : that;
          rangeEnd = moment(arg.rangeEnd).endOf('day');
          weekdays = arg.weekdays;
          exclusions = arg.exclusions;
        } else {
          rangeStart = that.clone().startOf('year');
          rangeEnd = that.clone().endOf('year');
          weekdays = arg;
        }
        break;
      default:
        new WeekDayCalcException('unexpected arguments length '+arguments.length+'. Expecting 1 to 4 args');
    }
    if(rangeStart.isAfter(rangeEnd)) {
      var trueEnd  = rangeStart.clone();
      rangeStart = rangeEnd.clone();
      rangeEnd = trueEnd;
    }

    var calc =  WeekDayCalc.construct([rangeStart, rangeEnd, weekdays, exclusions, useIsoWeekday]);
    return calc.calculate();
  };

  DaysSetConverter.calculateDate = function(that, arguments, useIsoWeekday) {
    var days, exclusions, weekdaysSet;
    useIsoWeekday = useIsoWeekday?true:false;
    var rangeStart = that;
    switch (arguments.length) {
      case 3:
        exclusions = arguments[2];
      /* Fall-through to two args*/
      case 2:
        days = arguments[0];
        weekdaysSet = arguments[1];
        break;
      case 1:
        var arg = arguments[0];
        if (arg && (arg.days!=undefined || arg.workdays!=undefined) ) {
          if (arg.days!=undefined && arg.workdays!=undefined) throw new DaysSetConverterException("days and weekdays args should not be used together, because weekdays is an alias of days");
          days = arg.days?arg.days:arg.workdays;
          weekdaysSet = arg.weekdays?arg.weekdays:[1,2,3,4,5];
          exclusions = arg.exclusions;
        } else {
          days = arg;
        }
        break;
      default:
        new DaysSetConverterException('unexpected arguments length '+arguments.length+'. Expecting 1 to 3 args');
    }
    var calc =  DaysSetConverter.construct([that, weekdaysSet, exclusions, useIsoWeekday]);
    return calc.calculate(days);
  };

  /**
   * Calculate weekdays with locale aware weekdays
   */
  moment.fn.weekdayCalc = function(){
    return WeekDayCalc.calculateWeekdays(this, arguments);
  };

  /**
   * Calculate weekdays with moment#isoWeekdays function, where 1 is always monday and 7 is always Sunday
   */
  moment.fn.isoWeekdayCalc = function() {
    return WeekDayCalc.calculateWeekdays(this, arguments, true);
  };

  /**
   * Calculates the date of {workdays} from now excluding today
   * For example 4 workdays from Wed 19 Aug 2015 is a Tue 25 Aug 2015
   * workdays set is Mon-Fri, please use addSetWeekdays if you have a different set
   */
  moment.fn.addWorkdays = function(days, exclusions) {
    return DaysSetConverter.calculateDate(this, [days, [1,2,3,4,5], exclusions]);
  };

  /**
   * Calculates how many calendar days within {workdays}
   * For example 4 workdays from Wed 19 Aug 2015 is 6 calendar days
   * workdays set is Mon-Fri, please use setWeekdaysToCalendarDays if you have a different set
   */
  moment.fn.workdaysToCalendarDays = function(days, exclusions) {
    var date = DaysSetConverter.calculateDate(this, [days, [1,2,3,4,5], exclusions]);
    return date.diff(this,'days');
  };

  moment.fn.addWeekdaysFromSet = function() {
    return DaysSetConverter.calculateDate(this, arguments);
  };

  moment.fn.weekdaysFromSetToCalendarDays = function() {
    var date = DaysSetConverter.calculateDate(this, arguments);
    return date.diff(this,'days');
  };

  moment.fn.isoAddWeekdaysFromSet = function() {
    return DaysSetConverter.calculateDate(this, arguments, true);
  };

  moment.fn.isoWeekdaysFromSetToCalendarDays = function() {
    var date = DaysSetConverter.calculateDate(this, arguments, true);
    return date.diff(this,'days');
  };

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = WeekDayCalc :
    typeof define === 'function' && define.amd ? define(WeekDayCalc) :
      this.WeekDayCalc = WeekDayCalc;

})(moment);
