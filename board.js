module.exports = Board;

var CHAIN_WEIGHT = [0, 1, 10, 100, 1000];

function Board(rows, cols, connect) {

  this.rows = rows;
  this.cols = cols;
  this.connect = connect;
  this.height = [];
  this.board = [];
  this.moves = [];
  this.currentPlayer = 1;
  this.winningPlayer = 0;

  // Initialize board
  for (var c = 0; c < this.cols; c++) {
    this.height[c] = 0;
    this.board[c] = [];
    for (var r = 0; r < this.rows; r++) this.board[c][r] = 0;
  }

}

Board.prototype.score = function () {
  if (this.currentPlayer) {
    var cp = this.currentPlayer;
    return oppScore(this, cp, this.connect);
  } else return -Infinity;
};

Board.prototype.getValidMoves = function () {
  var moves = [];
  for (var c = 0; c < this.cols; c++) if (this.height[c] < this.rows) moves.push(c);
  return moves;
};

Board.prototype.makeMove = function (move, done) {
  if (this.currentPlayer) {
    if (this.height[move] < this.rows) {
      this.board[move][this.height[move]] = this.currentPlayer;
      this.height[move]++;
      this.moves.push(move);
      this.currentPlayer = this.currentPlayer % 2 + 1;
      this.updateStatus();
      done();
    } else done(new Error('Invalid move.'));
  } else done(new Error('Invalid move. Game is over.'));
};

Board.prototype.undoMove = function (done) {
  var move = this.moves.pop();
  if (move || move == 0) {
    this.height[move]--;
    this.board[move][this.height[move]] = 0;
    this.currentPlayer = this.currentPlayer % 2 + 1;
    done();
  } else done(new Error('Unable to undo move. No moves have been made.'));
};

Board.prototype.updateStatus = function () {
  if (this.currentPlayer) {
    this.winningPlayer = oppScore(this, 0, this.connect, true);
    if (this.winningPlayer || this.moves.length == this.rows * this.cols) this.currentPlayer = 0;
  }
};

Board.prototype.clone = function () {
  var b = new Board(this.rows, this.cols, this.connect);
  for (var c = 0; c < this.cols; c++) {
    b.height[c] = this.height[c];
    for (var r = 0; r < this.rows; r++) b.board[c][r] = this.board[c][r];
  }
  for (var m = 0; m < this.moves.length; m++) b.moves[m] = this.moves[m];
  b.currentPlayer = this.currentPlayer;
  b.winningPlayer = this.winningPlayer;
  return b;
};

Board.prototype.toString = function () {
  var lines = [];
  for (var r = this.rows - 1; r >= 0; r--) {
    var line = [];
    for (var c = 0; c < this.cols; c++) line.push(this.board[c][r] || '.');
    lines.push(line.join(' '));
  }
  return lines.join('\n');
};

function oppScore(Board, p, connect, winner) {
  var S = [horiOppScore, vertOppScore, diag1OppScore, diag2OppScore];
  var s = 0;
  for (var i = 0; i < S.length; i++) {
    s += S[i](Board, p, p % 2 + 1, connect, winner);
    if (winner && s) return s;
  }
  return s;
}

function horiOppScore(Board, cp, op, connect, winner) {
  var s = 0;
  for (var r = 0; r < Board.rows; r++) {
    for (var c = 0; c <= Board.cols - connect; c++) {
      var counts = [0, 0, 0];
      for (var o = 0; o < connect; o++) counts[Board.board[c + o][r]]++;
      if (winner) {
        if (counts[1] == connect) return 1;
        if (counts[2] == connect) return 2;
      } else if (counts[0] + counts[cp] == connect) s += CHAIN_WEIGHT[counts[cp]];
      else if (counts[0] + counts[op] == connect) s -= CHAIN_WEIGHT[counts[op]];
    }
  }
  return s;
}

function vertOppScore(Board, cp, op, connect, winner) {
  var s = 0;
  for (var c = 0; c < Board.cols; c++) {
    for (var r = 0; r <= Board.rows - connect; r++) {
      var counts = [0, 0, 0];
      for (var o = 0; o < connect; o++) counts[Board.board[c][r + o]]++;
      if (winner) {
        if (counts[1] == connect) return 1;
        if (counts[2] == connect) return 2;
      } else if (counts[0] + counts[cp] == connect) s += CHAIN_WEIGHT[counts[cp]];
      else if (counts[0] + counts[op] == connect) s -= CHAIN_WEIGHT[counts[op]];
    }
  }
  return s;
}

function diag1OppScore(Board, cp, op, connect, winner) {
  var s = 0;
  for (var r = 0; r <= Board.rows - connect; r++) {
    for (var c = 0; c <= Board.cols - connect; c++) {
      var counts = [0, 0, 0];
      for (var o = 0; o < connect; o++) counts[Board.board[c + o][r + o]]++;
      if (winner) {
        if (counts[1] == connect) return 1;
        if (counts[2] == connect) return 2;
      } else if (counts[0] + counts[cp] == connect) s += CHAIN_WEIGHT[counts[cp]];
      else if (counts[0] + counts[op] == connect) s -= CHAIN_WEIGHT[counts[op]];
    }
  }
  return s;
}

function diag2OppScore(Board, cp, op, connect, winner) {
  var s = 0;
  for (var r = connect - 1; r < Board.rows; r++) {
    for (var c = 0; c <= Board.cols - connect; c++) {
      var counts = [0, 0, 0];
      for (var o = 0; o < connect; o++) counts[Board.board[c + o][r - o]]++;
      if (winner) {
        if (counts[1] == connect) return 1;
        if (counts[2] == connect) return 2;
      } else if (counts[0] + counts[cp] == connect) s += CHAIN_WEIGHT[counts[cp]];
      else if (counts[0] + counts[op] == connect) s -= CHAIN_WEIGHT[counts[op]];
    }
  }
  return s;
}
