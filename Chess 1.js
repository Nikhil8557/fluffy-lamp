const Chess = () => {
  const SYMBOLS = 'pnbrqkPNBRQK';

  const DEFAULT_POSITION =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  const TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];

  const PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15],
  };

  const PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1],
  };

  const ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 20, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 24,
    0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0,
    0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
  ];

  const RAYS = [-17, -16, -15, 1, 17, 16, 15, -1];

  const SHIFTS = {
    p: 0,
    n: 1,
    b: 2,
    r: 3,
    q: 4,
    k: 5,
  };

  const BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    PROMOTION: 8,
    EN_PASSANT: 16,
    CASTLING: 32,
  };

  const RANK_1 = 7;
  const RANK_2 = 6;
  const RANK_3 = 5;
  const RANK_4 = 4;
  const RANK_5 = 3;
  const RANK_6 = 2;
  const RANK_7 = 1;
  const RANK_8 = 0;

  const SQUARE_MAP = {
    a8: 0,
    b8: 1,
    c8: 2,
    d8: 3,
    e8: 4,
    f8: 5,
    g8: 6,
    h8: 7,
    a7: 16,
    b7: 17,
    c7: 18,
    d7: 19,
    e7: 20,
    f7: 21,
    g7: 22,
    h7: 23,
    a6: 32,
    b6: 33,
    c6: 34,
    d6: 35,
    e6: 36,
    f6: 37,
    g6: 38,
    h6: 39,
    a5: 48,
    b5: 49,
    c5: 50,
    d5: 51,
    e5: 52,
    f5: 53,
    g5: 54,
    h5: 55,
    a4: 64,
    b4: 65,
    c4: 66,
    d4: 67,
    e4: 68,
    f4: 69,
    g4: 70,
    h4: 71,
    a3: 80,
    b3: 81,
    c3: 82,
    d3: 83,
    e3: 84,
    f3: 85,
    g3: 86,
    h3: 87,
    a2: 96,
    b2: 97,
    c2: 98,
    d2: 99,
    e2: 100,
    f2: 101,
    g2: 102,
    h2: 103,
    a1: 112,
    b1: 113,
    c1: 114,
    d1: 115,
    e1: 116,
    f1: 117,
    g1: 118,
    h1: 119,
  };

  let board = new Array(128); // 8x8 board with buffer
  let kings = { w: EMPTY, b: EMPTY };
  let turn = WHITE;
  let castling = { w: 0, b: 0 };
  let epSquare = EMPTY;
  let halfMoves = 0;
  let moveNumber = 1;
  let history = [];
  let header = {};

  const WHITE = 0;
  const BLACK = 1;
  const EMPTY = -1;

  const isSquareOffboard = (sq) => {
    return (sq & 0x88) !== 0;
  };

  const swapColor = (color) => {
    return color === WHITE ? BLACK : WHITE;
  };

  const isPieceEmpty = (piece) => {
    return piece === EMPTY;
  };

  const getPieceColor = (piece) => {
    return piece === piece.toLowerCase() ? BLACK : WHITE;
  };

  const getPieceType = (piece) => {
    return SYMBOLS.indexOf(piece.toLowerCase());
  };

  const buildMove = (from, to, flags, promotion = '') => {
    return (
      from | (to << 7) | (flags << 14) | (promotion.charCodeAt(0) << 20)
    );
  };

  const getMoveFrom = (move) => {
    return move & 0x7f;
  };

  const getMoveTo = (move) => {
    return (move >> 7) & 0x7f;
  };

  const getMoveFlags = (move) => {
    return (move >> 14) & 0xf;
  };

  const getMovePromotion = (move) => {
    return String.fromCharCode((move >> 20) & 0xff);
  };

  const generateMoves = () => {
    const moves = [];
    const us = turn;
    const them = swapColor(us);
    const secondRank = { w: RANK_2, b: RANK_7 };

    const addMove = (moves, from, to, flags) => {
      if (
        board[from].toLowerCase() === 'p' &&
        (to < 8 || to >= 112)
      ) {
        // Handle promotion moves
        const pieces = ['q', 'r', 'b', 'n'];
        for (let i = 0, len = pieces.length; i < len; i++) {
          moves.push(buildMove(from, to, flags, pieces[i]));
        }
      } else {
        moves.push(buildMove(from, to, flags));
      }
    };

    const isSquareAttacked = (sq, color) => {
      for (leti = 0, len = RAYS.length; i < len; i++) {
        let piece = board[sq + RAYS[i]];
        while (!isSquareOffboard(piece)) {
          if (piece !== EMPTY) {
            if (
              (piece === 'r' || piece === 'q') &&
              getPieceColor(piece) === color
            ) {
              return true;
            }
            break;
          }
          piece = board[sq + RAYS[i]];
        }
      }
      return false;
    };

    const generatePawnMoves = () => {
      let piece;
      let from;
      let to;
      let flags;
      let promotion;

      for (let sq = 0; sq < 128; sq++) {
        if (isSquareOffboard(sq) || (sq & 0x88)) continue;

        piece = board[sq];
        if (piece === EMPTY || piece.toLowerCase() !== 'p') continue;

        let color = getPieceColor(piece);
        let inc = color === WHITE ? -16 : 16;

        from = sq;
        to = from + inc;

        if (board[to] === EMPTY) {
          // Single pawn push
          addMove(moves, from, to, BITS.NORMAL);

          // Double pawn push
          if (
            (color === WHITE && secondRank.w === getRank(from)) ||
            (color === BLACK && secondRank.b === getRank(from))
          ) {
            if (board[to + inc] === EMPTY) {
              addMove(moves, from, to + inc, BITS.BIG_PAWN);
            }
          }
        }

        // Pawn captures
        for (let j = 2; j < 4; j++) {
          let targetSquare = to + PAWN_OFFSETS[color][j];
          if (
            isSquareOffboard(targetSquare) ||
            (targetSquare & 0x88) !== 0
          )
            continue;

          if (
            getPieceColor(board[targetSquare]) === them ||
            targetSquare === epSquare
          ) {
            addMove(moves, from, targetSquare, BITS.CAPTURE);
          }
        }

        // En passant
        if (epSquare !== EMPTY) {
          for (let j = 2; j < 4; j++) {
            let targetSquare = to + PAWN_OFFSETS[color][j];
            if (
              targetSquare === epSquare &&
              getPieceColor(board[targetSquare]) === them
            ) {
              addMove(moves, from, targetSquare, BITS.EN_PASSANT);
            }
          }
        }
      }
    };

    const generateKnightMoves = () => {
      let piece;
      let from;
      let to;
      let flags;

      for (let sq = 0; sq < 128; sq++) {
        if (isSquareOffboard(sq) || (sq & 0x88)) continue;

        piece = board[sq];
        if (piece === EMPTY || piece.toLowerCase() !== 'n') continue;

        from = sq;
        for (let i = 0, len = PIECE_OFFSETS.n.length; i < len; i++) {
          let offset = PIECE_OFFSETS.n[i];
          to = sq + offset;

          if (
            isSquareOffboard(to) ||
            (to & 0x88) !== 0 ||
            (getPieceColor(board[to]) === us &&
              !isPieceEmpty(board[to]))
          )
            continue;

          flags = isPieceEmpty(board[to]) ? BITS.NORMAL : BITS.CAPTURE;
          addMove(moves, from, to, flags);
        }
      }
    };

    const generateSlidingMoves = () => {
      const directions = ['b', 'r', 'q'];
      let piece;
      let from;
      let to;
      let flags;

      for (let sq = 0; sq < 128; sq++) {
        if (isSquareOffboard(sq) || (sq & 0x88)) continue;

        piece = board[sq];
        if (piece === EMPTY || directions.indexOf(piece.toLowerCase()) < 0)
          continue;

        from = sq;
        for (let i = 0, len = PIECE_OFFSETS[piece.toLowerCase()].length; i < len; i++) {
          let offset = PIECE_OFFSETS[piece.toLowerCase()][i];
          to = sq;

          while (true) {
            to += offset;
            if (
              isSquareOffboard(to) ||
              (to & 0x88) !== 0 ||
              (getPieceColor(board[to]) === us &&
                !isPieceEmpty(board[to]))
            )
              break;

            flags = isPieceEmpty(board[to]) ? BITS.NORMAL : BITS.CAPTURE;
            addMove(moves, from, to, flags);

            if (getPieceColor(board[to]) === them) break;

            if (
              piece.toLowerCase() === 'n' ||
              piece.toLowerCase() === 'k'
            ) {
              break;
            }
          }
        }
      }
    };

    const generateKingMoves = () => {
      let piece;
      let from;
      let to;
      let flags;

      for (let sq = 0; sq < 128; sq++) {
        if (isSquareOffboard(sq) || (sq & 0x88)) continue;

        piece = board[sq];
        if (piece === EMPTY || piece.toLowerCase() !== 'k') continue;

        from = sq;
        for (let i = 0, len = PIECE_OFFSETS.k.length; i < len; i++) {
          let offset = PIECE_OFFSETS.k[i];
          to = sq + offset;

          if (
            isSquareOffboard(to) ||
            (to & 0x88) !== 0 ||
            (getPieceColor(board[to]) === us &&
              !isPieceEmpty(board[to]))
          )
            continue;

          flags = isPieceEmpty(board[to]) ? BITS.NORMAL : BITS.CAPTURE;
          addMove(moves, from, to, flags);
        }
      }
    };

    const generateCastlingMoves = () => {
      const kingSquare = kings[us];
      if (isSquareAttacked(kingSquare, them)) return;

      if (
        (castling[us] & BITS.KSIDE_CASTLE) !== 0 &&
        board[kingSquare + 1] === EMPTY &&
        board[kingSquare + 2] === EMPTY
      ) {
        if (
          !isSquareAttacked(kingSquare + 1, them) &&
          !isSquareAttacked(kingSquare + 2, them)
        ) {
          addMove(moves, kingSquare, kingSquare + 2, BITS.CASTLING);
        }
      }

      if (
        (castling[us] & BITS.QSIDE_CASTLE) !== 0 &&
        board[kingSquare - 1] === EMPTY &&
        board[kingSquare - 2] === EMPTY &&
        board[kingSquare - 3] === EMPTY
      ) {
        if (
          !isSquareAttacked(kingSquare - 1, them) &&
          !isSquareAttacked(kingSquare - 2, them)
        ) {
          addMove(moves, kingSquare, kingSquare - 2, BITS.CASTLING);
        }
      }
    };

    generatePawnMoves();
    generateKnightMoves();
    generateSlidingMoves();
    generateKingMoves();
    generateCastlingMoves();

    return moves;
  };

  const makeMove = (move) => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    const flags = getMoveFlags(move);
    const promotion = getMovePromotion(move);

    const captured = board[to];
    const piece = board[from];

    history.push({
      move,
      kings: { w: kings.w, b: kings.b },
      turn,
      castling: { w: castling.w, b: castling.b },
      epSquare,
      halfMoves,
      moveNumber,
    });

    board[to] = piece;
    board[from] = EMPTY;

    if (piece.toLowerCase() === 'k') {
      kings[turn] = to;
      castling[turn] &= ~(BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE);
    } else if (piece.toLowerCase() === 'p') {
      halfMoves = 0;
      if (flags & BITS.BIG_PAWN) {
        if (turn === WHITE) {
          epSquare = from + 16;
        } else {
          epSquare = from - 16;
        }
      } else if (flags & BITS.EN_PASSANT) {
        if (turn === WHITE) {
          captured = to - 16;
        } else {
          captured = to + 16;
        }
      }
    }

    if (epSquare !== EMPTY) {
      castling[turn] &= ~(BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE);
    }

    if (flags & BITS.CAPTURE) {
      halfMoves = 0;
      if (captured.toLowerCase() === 'r') {
        if (to === 0) {
          castling.b &= ~BITS.QSIDE_CASTLE;
        } else if (to === 7) {
          castling.b &= ~BITS.KSIDE_CASTLE;
        } else if (to === 112) {
          castling.w &= ~BITS.QSIDE_CASTLE;
        } else if (to === 119) {
          castling.w &= ~BITS.KSIDE_CASTLE;
        }
      }
    }

    if (castling[turn] === 0) {
      castling[turn] = '-';
    }

    if (flags & BITS.PROMOTION) {
      board[to] = promotion;
    }

    turn = swapColor(turn);
    if (turn === BLACK) {
      moveNumber++;
    }
  };

  const undoMove = () => {
    const old = history.pop();
    if (old === undefined) {
      return null;
    }

    const move = old.move;
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    const flags = getMoveFlags(move);
    const promotion = getMovePromotion(move);

    board[from] = board[to];
    board[to] = EMPTY;

    if (board[from].toLowerCase() === 'k') {
      kings[turn] = from;
    }

    if (flags & BITS.CAPTURE) {
      board[to] = old.captured;
    }

    if (flags & BITS.EN_PASSANT) {
      let index;
      if (turn === WHITE) {
        index = to - 16;
      } else {
        index = to + 16;
      }
      board[index] = old.captured;
    }

    turn = old.turn;
    castling = old.castling;
    epSquare = old.epSquare;
    halfMoves = old.halfMoves;
    moveNumber = old.moveNumber;

    return move;
  };

  const validateFen = (fen) => {
    if (fen === '') {
      return false;
    }

    const errors = {
      0: 'No errors.',
      1: 'FEN string must contain six space-delimited fields.',
      2: '6th field (move number) must be a positive integer.',
      3: '5th field (half move counter) must be a non-negative integer.',
      4: '4th field (en-passant square) is invalid.',
      5: '3rd field (castling availability) is invalid.',
      6: '2nd field (side to move) is invalid.',
      7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.',
      8: '1st field (piece positions) is invalid [consecutive numbers].',
      9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
      11: 'Illegal en-passant square',
    };

    const fields = fen.split(' ');
    if (fields.length !== 6) {
      return { valid: false, error_number: 1, error: errors[1] };
    }

    if (isNaN(fields[5]) || parseInt(fields[5], 10) <= 0) {
      return { valid: false, error_number: 2, error: errors[2] };
    }

    if (isNaN(fields[4]) || parseInt(fields[4], 10) < 0) {
      return { valid: false, error_number: 3, error: errors[3] };
    }

    if (
      !/^(-|[abcdefgh][36])$/.test(fields[3])
    ) {
      return { valid: false, error_number: 4, error: errors[4] };
    }

    if (
      !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(fields[2])
    ) {
      return { valid: false, error_number: 5, error: errors[5] };
    }

    if (
      !/^(w|b)$/.test(fields[1])
    ) {
      return { valid: false, error_number: 6, error: errors[6] };
    }

    const rows = fields[0].split('/');
    if (rows.length !== 8) {
      return { valid: false, error_number: 7, error: errors[7] };
    }

    for (let i = 0; i < rows.length; i++) {
      let sumFields = 0;
      let previousWasNumber = false;

      for (let k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previousWasNumber) {
            return { valid: false, error_number: 8, error: errors[8] };
          }
          sumFields += parseInt(rows[i][k], 10);
          previousWasNumber = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return { valid: false, error_number: 9, error: errors[9] };
          }
          sumFields += 1;
          previousWasNumber = false;
        }
      }

      if (sumFields !== 8) {
        return { valid: false, error_number: 10, error: errors[10] };
      }
    }

    if (
      (fields[2].indexOf('K') !== -1 && fields[0].indexOf('K') === -1) ||
      (fields[2].indexOf('Q') !== -1 && fields[0].indexOf('Q') === -1) ||
      (fields[2].indexOf('k') !== -1 && fields[0].indexOf('k') === -1) ||
      (fields[2].indexOf('q') !== -1 && fields[0].indexOf('q') === -1)
    ) {
      return { valid: false, error_number: 11, error: errors[11] };
    }

    return { valid: true, error_number: 0, error: errors[0] };
  };

  const getBoard = () => board;
  const getTurn = () => turn;
  const getCastling = () => castling;
  const getEpSquare = () => epSquare;
  const getHalfMoves = () => halfMoves;
  const getMoveNumber = () => moveNumber;
  const getHistory = () => history;

  const loadFen = (fen) => {
    if (!validateFen(fen).valid) {
      return false;
    }

    const fields = fen.split(' ');
    let position = fields[0];
    let square = 0;

    for (let i = 0; i < position.length; i++) {
      if (position[i] === '/') {
        square += 8;
      } else if (isNaN(position[i])) {
        const isUpperCase = position[i] === position[i].toUpperCase();
        const piece = position[i].toLowerCase();
        const color = isUpperCase ? WHITE : BLACK;
        board[square] = piece;
        square++;
      } else {
        square += parseInt(position[i], 10);
      }
    }

    turn = fields[1];
    castling = fields[2];
    epSquare = fields[3] === '-' ? EMPTY : SQUARES[fields[3]];
    halfMoves = parseInt(fields[4], 10);
    moveNumber = parseInt(fields[5], 10);

    kings = {
      w: board.indexOf('k'),
      b: board.indexOf('K'),
    };

    return true;
  };

  const getFen = () => {
    let emptySquares = 0;
    let fen = '';

    for (let i = 0; i < 128; i++) {
      if (i & 0x88) {
        i += 7;
        continue;
      }

      if (board[i] === EMPTY) {
        emptySquares++;
      } else {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        fen += board[i];
      }

      if ((i + 1) & 0x88) {
        if (emptySquares > 0) {
          fen += emptySquares;
        }

        if (i !== SQUARES.h8) {
          fen += '/';
        }

        emptySquares = 0;
        i += 8;
      }
    }

    let cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) {
      cflags += 'K';
    }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) {
      cflags += 'Q';
    }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) {
      cflags += 'k';
    }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) {
      cflags += 'q';
    }

    const epflags = epSquare === EMPTY ? '-' : algebraic(epSquare);

    return [fen, turn, cflags, epflags, halfMoves, moveNumber].join(' ');
  };

  const inCheck = () => isSquareAttacked(kings[turn], swapColor(turn));

  const inCheckmate = () => {
    return inCheck() && generateMoves().length === 0;
  };

  const inStalemate = () => {
    return !inCheck() && generateMoves().length === 0;
  };

  const insufficientMaterial = () => {
    const pieces = {};
    const bishops = [];
    let numPieces = 0;
    let sqColor = 0;

    for (let sq = 0; sq < 128; sq++) {
      sqColor = (sqColor + 1) % 2;
      if (sq & 0x88) {
        sq += 7;
        continue;
      }

      const piece = board[sq];
      if (piece !== EMPTY) {
        pieces[piece] = piece in pieces ? pieces[piece] + 1 : 1;
        if (piece.toLowerCase() === 'b') {
          bishops.push(sqColor);
        }
        numPieces++;
      }
    }

    if (numPieces === 2) {
      return true;
    } else if (numPieces === 3 && (pieces['n'] === 1 || pieces['b'] === 1)) {
      return true;
    } else if (numPieces === pieces['b'] + 2) {
      let sum = 0;
      let len = bishops.length;
      for (let i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) {
        return true;
      }
    }

    return false;
  };

  const inThreefoldRepetition = () => {
    const moves = [];
    const positions = {};
    let repetition = false;

    while (true) {
      const move = undoMove();
      if (!move) {
        break;
      }
      moves.push(move);
    }

    while (true) {
      const position = getFen();
      positions[position] = position in positions ? positions[position] + 1 : 1;

      if (positions[position] === 3) {
        repetition = true;
      }

      if (moves.length === 0) {
        break;
      }

      makeMove(moves.pop());
    }

    return repetition;
  };

  const isDraw = () => {
    return (
      halfMoves >= 100 ||
      inStalemate() ||
      insufficientMaterial() ||
      inThreefoldRepetition()
    );
  };

  const gameOver = () => inCheckmate() || isDraw();

  return {
    loadFen,
    getBoard,
    getTurn,
    getCastling,
    getEpSquare,
    getHalfMoves,
    getMoveNumber,
    getHistory,
    generateMoves,
    makeMove,
    undoMove,
    validateFen,
    getFen,
    inCheck,
    inCheckmate,
    inStalemate,
    insufficientMaterial,
    inThreefoldRepetition,
    isDraw,
    gameOver,
  };
};
