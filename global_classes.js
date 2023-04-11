// CLASSES
class Question {
  constructor(obj) {
    this.text = obj.text;
    this.opt1 = obj.opt1;
    this.opt2 = obj.opt2;
    this.calcPercent();
  }
  
  calcPercent() {
    var total = this.opt1.numPicked + this.opt2.numPicked;
    if (total === 0) total = 1;
    this.opt1Perc = this.opt1.numPicked / total;
    this.opt2Perc = this.opt2.numPicked / total;
  }

  getPercent(choice) {
    if (choice === 0)
      return this.opt1Perc;
    else
      return this.opt2Perc;
  }
  
  // print() {
  //   console.log("Would you rather " + this.text);
  // }
  
  updatePercents(choice) {
    choice === 0 ? ++this.opt1.numPicked : ++this.opt2.numPicked;
    this.calcPercent();
    this.opt1Perc = this.roundPercent(this.opt1Perc);
    this.opt2Perc = this.roundPercent(this.opt2Perc);
  }
  
  roundPercent(num) {
    if (num === 1) return 100;
    return Math.round((num + Number.EPSILON) * 100);// / 100;
  }
}

class Option {
  constructor(text) {
    this.text = text;
    this.numPicked = 0;
  }
}

module.exports = Question