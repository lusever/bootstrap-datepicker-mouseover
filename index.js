/**
 * Bootsrap Datepicker extension for range preview when calendar is open.
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  function parseDay(picker, target) {
    var day = parseInt(target.text(), 10) || 1;
    var year = picker.viewDate.getUTCFullYear();
    var month = picker.viewDate.getUTCMonth();

    // From last month
    if (target.hasClass('old')) {
      if (month === 0) {
        month = 11;
        year = year - 1;
      } else {
        month = month - 1;
      }
    }

    // From next month
    if (target.hasClass('new')) {
      if (month === 11) {
        month = 0;
        year = year + 1;
      } else {
        month = month + 1;
      }
    }
    return Date.UTC(year, month, day);
  }

  function onPickerMouseEnter(e) {
    var picker = e.data.picker;
    if (!picker.range) {
      return;
    }

    var target = $(e.target);
    if (!target.hasClass('day')) {
      return;
    }
    if (target.hasClass('disabled')) {
      target = null;
    }
    var currentIndex = e.data.index;
    var days = picker.picker.find('.day');
    var currentDate;
    var range = picker.range.slice(0);
    var selected = picker.range.slice(0); // clone

    if (target) {
      selected.splice(currentIndex, 1);
      days.removeClass('active');
      target.addClass('active');
      currentDate = parseDay(picker, target);
      range[currentIndex] = currentDate;
    }

    for (var i = 0; i < days.length; i++) {
      var d = days.eq(i);
      var date = parseDay(picker, d);
      var isRange = date > range[0] && date < range[range.length - 1];
      var isRangeStart = date === range[0];
      var isRangeEnd = date === range[range.length - 1];
      var isSelected = range.indexOf(date) !== -1;
      d.toggleClass('range', isRange);
      d.toggleClass('range-start', isRangeStart);
      d.toggleClass('range-end', isRangeEnd);
      d.toggleClass('selected', isSelected);
      if (!target) {
        var isActive = picker.dates.contains(date) !== -1;
        d.toggleClass('active', isActive);
      }
    }
  }

  function onPickerMouseLeave(e) {
    var picker = e.data;
    picker.picker.find('.day').removeClass('active range range-start selected');
    picker.fill();
  }

  $.fn.datepickerMouseover = function () {
    var datepicker = this.data('datepicker');
    for (var i = 0; i < datepicker.pickers.length; i++) {
      var picker = datepicker.pickers[i];
      picker.picker.on('mouseenter', '.day', { picker: picker, index: i }, onPickerMouseEnter);
      picker.picker.on('mouseleave', 'tbody', picker, onPickerMouseLeave);
      this.on('hide', picker, onPickerMouseLeave);
    }
  };
}));
