/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var ItemGroupView = require('../../items/ItemGroupView');

/**
 * Represents a challenge within the EnglishChallengesMenu.
 * @param challenge {EnglishChallenge} Challenge that can be accessed through
 * this item.
 * @param parentView {PopUp} PopUp that contatins this item.
 * @constructor
 */
var MenuItem = function(challenge, parentView) {
    ItemGroupView.call(this, challenge.englishChallenge.iconKey,
        challenge.englishChallenge.name, parentView);
    this.challenge = challenge;
    this.updateScoreText();
};

MenuItem.prototype = Object.create(ItemGroupView.prototype);
MenuItem.prototype.constructor = MenuItem;

/**
 * Called when the play button is clicked. It close the menu (PopUp), creates
 * a new challenge and displays it to the player.
 */
MenuItem.prototype.buttonAction = function() {
    this.parent.close();
    this.challenge.newChallenge();
    this.challenge.open();
};

/**
 * Updates the text that shows the number of points that player can get, after
 * completing the challenge.
 */
MenuItem.prototype.updateScoreText = function() {
    this.message.text = '' + this.challenge.englishChallenge.score;
};

module.exports = MenuItem;

