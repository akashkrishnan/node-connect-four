var ConnectFour = require('./connect-four.js');

var Board = new ConnectFour.Board(6, 7, 4);
var HumanPlayer = new ConnectFour.HumanPlayer(getMove);
var ComputerPlayer = new ConnectFour.ComputerPlayer(7);
var Game = new ConnectFour.Game(Board, HumanPlayer, ComputerPlayer);

Game.start(function (b) {
  if (b) {
    console.log(b.score());
    console.log(b.toString() + '\n');
  } else {
    console.log('Game over.');
    console.log(Board.toString());
  }
});

function getMove(Board, done) {
  var moves = Board.getValidMoves();
  var m = Math.floor(Math.random() * moves.length);
  done(moves[m], function (err, Board) {
    if (err) console.log(err);
  });
}
