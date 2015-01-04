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
 * @fileoverview A class to represent the guessing word game.
 */

goog.provide('game.ui.WordGame');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.style');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Component');
goog.require('game.ui.DigitTimer');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');


/**
 * A class to represent the guessing word game.
 * @constructor
 * @extend {goog.ui.Component}
 */
game.ui.WordGame = function() {
  goog.base(this);

  this.startPageEl_ = null;
  this.startBtnEl_ = null;
  this.digitTimer_ = new game.ui.DigitTimer();
  this.docKeyHandler_ = new goog.events.KeyHandler(document);
  this.usedWords_ = {};
  this.wordProcessing_ = false;
  this.points_ = 0;
  this.dialog_ = new goog.ui.Dialog();
  this.dialog_.setTitle('得分');
  this.dialog_.setButtonSet(goog.ui.Dialog.ButtonSet.OK);

}
goog.inherits(game.ui.WordGame, goog.ui.Component);


/** @override */
game.ui.WordGame.prototype.createDom = function() {
  this.setElementInternal(this.getDomHelper().createDom(
      'div', goog.getCssName('game-process-word')));

  this.startPageEl_ = this.getDomHelper().getElementByClass('game-start-page');
  this.startBtnEl_ = this.getDomHelper().getElementByClass('game-start-button');
  this.timerInputEl_ =
      this.getDomHelper().getElementByClass('game-timer-input');
  this.backfillTimerCycle();
  this.startBtnEl_.focus();
  goog.style.setElementShown(this.getElement(), false);
};


/** @override */
game.ui.WordGame.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.digitTimer_.render();
  this.getHandler().listen(this.digitTimer_, [
    game.ui.DigitTimer.EventType.START,
    game.ui.DigitTimer.EventType.STOP
  ], this.onTimerTick_);
  this.getHandler().listen(this.docKeyHandler_, 'key', this.handleKeyEvent);
  this.getHandler().listen(this.startBtnEl_, goog.events.EventType.CLICK,
      this.handleStartButtonClick);
  this.getHandler().listen(this.dialog_, goog.ui.Dialog.EventType.SELECT,
      this.handleDialogSelect);
  this.getHandler().listen(this.timerInputEl_, goog.events.EventType.CHANGE,
      this.handleTimerInputChange);
};


/**
 * Handler for timer tick event.
 * @param {goog.events.Event} e The timer event.
 */
game.ui.WordGame.prototype.onTimerTick_ = function(e) {
  switch (e.type) {
    case game.ui.DigitTimer.EventType.START:
      this.startProcessWord_();
      break;
    case game.ui.DigitTimer.EventType.STOP:
      this.stopProcessWord_();
      break;
  }
};


/**
 * Starts guessing word game.
 */
game.ui.WordGame.prototype.startProcessWord_ = function() {
  this.wordProcessing_ = true;
  this.points_ = 0;
  goog.style.setElementShown(this.startPageEl_, false);
  goog.style.setElementShown(this.getElement(), true);
  this.processWord();
};


/**
 * Stops guessing word game.
 */
game.ui.WordGame.prototype.stopProcessWord_ = function() {
  this.wordProcessing_ = false;
  goog.style.setElementShown(this.startPageEl_, true);
  goog.style.setElementShown(this.getElement(), false);
  this.dialog_.setVisible(true);
  this.dialog_.setContent(this.getPoints());
};


/**
 * Handler for key event.
 * In order to record the correct points, we use space to record the correct
 * word, and ESC to cancel current timer cycle, and other keys will skip the
 * words.
 * @param {goog.events.KeyEvent} e The key event.
 */
game.ui.WordGame.prototype.handleKeyEvent = function(e) {
  if (this.wordProcessing_ && e.keyCode == goog.events.KeyCodes.SPACE) {
    this.points_ ++;
    this.processWord();
  } else if (this.wordProcessing_ && e.keyCode == goog.events.KeyCodes.ESC) {
    this.digitTimer_.stop();
  } else if (this.wordProcessing_) {
    this.processWord();
  } 
};


/**
 * Generates game word randomly.
 */
game.ui.WordGame.prototype.processWord = function() {
  var len = chWords.length;
  var index = Math.floor(Math.random() * len);
  var word = chWords[index];
  var num = 0;
  while (word in this.usedWords_) {
    index = Math.floor(Math.random() * len);
    word = chWords[index];
    num ++;
  }
  this.usedWords_[word] = true;
  goog.dom.setTextContent(this.getElement(), word);
}; 


/**
 * Handler for start button clicking.
 */
game.ui.WordGame.prototype.handleStartButtonClick = function() {
  this.digitTimer_.start();
};


/**
 * Gets the correct points for this round guessing.
 */
game.ui.WordGame.prototype.getPoints = function() {
  return this.points_;
}; 


/**
 * Handler for dialog select event.
 * @param {goog.events.Event} e The dialog event.
 */
game.ui.WordGame.prototype.handleDialogSelect = function(e) {
  this.dialog_.setVisible(false);
};


/**
 * Handler for timer cycle change.
 */
game.ui.WordGame.prototype.handleTimerInputChange = function() {
  var minutes = parseFloat(this.timerInputEl_.value);
  if (!isNaN(minutes)) {
    var seconds = Math.round((Math.round(minutes * 10) / 10) * 60);
    this.digitTimer_.setCycle(seconds);
  }
  this.backfillTimerCycle();
};


/**
 * Backfills timer cycle.
 * Based on the cycle of current timer, to fill the timer cycle using minutes.
 */
game.ui.WordGame.prototype.backfillTimerCycle = function() {
  var cycle = this.digitTimer_.getCycle();
  var minutes = cycle / 60;
  this.timerInputEl_.value = Math.round(minutes * 10) / 10;
};
