// Copyright 2014 Justin Xing.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A class to represent a countdown timer.
 */

goog.provide('game.ui.DigitTimer');
goog.provide('game.ui.DigitTimer.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.style');
goog.require('goog.Timer');
goog.require('goog.ui.Component');

/**
 * A timer for countdown.
 *
 * @constructor
 * @extend {goog.ui.Component}
 * @param {number=} opt_cycle The cycle of a timer, whose unit is sencond. And
 *     the maximum is 3599 seconds, e.g. 59:59.
 */
game.ui.DigitTimer = function(opt_cycle) {
  goog.base(this);

  this.timer_ = new goog.Timer(game.ui.DigitTimer.TIMER_INTERVAL_);
  this.defaultCycle_ = opt_cycle || game.ui.DigitTimer.TIMER_CYCLE_;
  this.defaultCycle_ %= 3600;
  this.cycle_ = 0;
};
goog.inherits(game.ui.DigitTimer, goog.ui.Component);


/**
 * The intervals that timer executes.
 * @const {number}
 */
game.ui.DigitTimer.TIMER_INTERVAL_ = 1000;


/**
 * The default timer cycle.
 * @const {number}
 */
game.ui.DigitTimer.TIMER_CYCLE_ = 3*60;


/** @override */
game.ui.DigitTimer.prototype.createDom = function() {
  this.setElementInternal(this.getDomHelper().createDom(
      'div', goog.getCssName('game-timer-container')));

  goog.style.setElementShown(this.getElement(), false);
};


/** @override */
game.ui.DigitTimer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.timer_, goog.Timer.TICK,
      this.onTick_);
};


/**
 * The handler for timer tick event.
 * @param {goog.events.Event} e
 */
game.ui.DigitTimer.prototype.onTick_ = function(e) {
  this.cycle_--;

  if (this.cycle_ > 0) {
    this.formatTime();
  } else {
    this.stop();
  }
};


/**
 * Starts timer ticks.
 */
game.ui.DigitTimer.prototype.start = function() {
  this.cycle_ = this.defaultCycle_;
  this.formatTime();
  goog.style.setElementShown(this.getElement(), true);
  this.timer_.start();
  this.dispatchEvent(game.ui.DigitTimer.EventType.START);
};


/**
 * Stops timer ticks.
 */
game.ui.DigitTimer.prototype.stop = function() {
  this.timer_.stop();
  this.formatTime();
  this.cycle_ = 0;
  goog.style.setElementShown(this.getElement(), false);
  this.dispatchEvent(game.ui.DigitTimer.EventType.STOP);
};


/**
 * Formats the remaining times using mm:ss format.
 */
game.ui.DigitTimer.prototype.formatTime = function() {
  var minutes = Math.floor(this.cycle_ / 60);
  var seconds = this.cycle_ % 60;
  var time = minutes >= 10 ? minutes + '' : '0' + minutes;
  time += ' : ';
  time += seconds >= 10 ? seconds + '' : '0' + seconds;
  goog.dom.setTextContent(this.getElement(), time);
};


/**
 * Gets the cycle.
 * @return {number} The cycle of timer.
 */
game.ui.DigitTimer.prototype.getCycle = function() {
  return this.defaultCycle_;
};


/**
 * Sets the cycle.
 * @param {number} The cycle of timer.
 */
game.ui.DigitTimer.prototype.setCycle = function(cycle) {
  if (this.timer_.enabled) {
    this.stop();
  }
  this.defaultCycle_ = cycle % 3600;
};


/**
 * The status of timer.
 * @enum {string}
 */
game.ui.DigitTimer.EventType = {
  START: 'start',
  STOP: 'stop'
};
