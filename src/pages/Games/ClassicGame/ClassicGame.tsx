import { useEffect, useReducer } from 'react';
import Info from '@/components/Info';
import Deck from '@/components/Deck';
import GameOver from '@/components/GameOver';

interface IDeck {
  beer: number;
  matched: boolean;
}

function getRandomUniqueNumbers(length: number, min = 1, max = 34): number[] {
  const numbers = new Set();

  while (numbers.size < length) {
    const randomNumber = Math.floor(Math.random() * ( max - min + 1 )) + min;
    numbers.add(randomNumber);
  }
  return Array.from(numbers) as number[];
}

const generateDeck = (): IDeck[] => {
  const beers: number[] = getRandomUniqueNumbers(6);

  const deck = [];
  // Каждому цвету добавляем две карточки
  for (const beer of beers) {
    deck.push({beer, matched: false});
    deck.push({beer, matched: false});
  }
  // Перемешиваем колоду
  return deck.sort(() => Math.random() - 0.5);
};

export interface IState {
  deck: IDeck[];
  flipped: number[];
  matched: number[];
  turns: number;
  score: number;
  pendingReset: boolean;
  gameOver: boolean;
}

const initialState: IState = {
  deck: generateDeck(),
  flipped: [],
  matched: [],
  turns: 0,
  score: 0,
  pendingReset: false,
  gameOver: false,
};

interface IAction {
  index?: number;
  type: string;
}

const gameReducer = (state: IState, action: IAction) => {
  switch (action.type) {

    case 'FLIP_CARD':
      // Переворачиваем карточку
      if (state.flipped.length < 2 && action.index !== undefined && !state.flipped.includes(action.index) && !state.matched.includes(state.deck[action.index].beer)) {
        return {...state, flipped: [...state.flipped, action.index]};
      }
      return state;
    case 'CHECK_MATCH':
      // Проверяем совпадение перевернутых карточек
      const [first, second] = state.flipped;
      if (state.deck[first].beer === state.deck[second].beer) {
        const newMatched = [...state.matched, state.deck[first].beer];
        const isGameOver = newMatched.length === state.deck.length / 2;
        return {
          ...state,
          matched: newMatched,
          score: isGameOver ? state.score + 1 : state.score,
          flipped: [],
          pendingReset: false,
          gameOver: isGameOver,
        };
      } else {
        return {...state, pendingReset: true};
      }
    case 'RESET_FLIPPED':
      // Сбрасываем перевернутые карточки
      return {...state, flipped: [], pendingReset: false};
    case 'INCREMENT_TURN':
      // Увеличиваем счетчик попыток
      return {...state, turns: state.turns + 1};
    case 'RESET_GAME':
      // Сбрасываем состояние игры
      return {
        ...initialState,
        deck: generateDeck(),
      };
    default:
      return state;
  }
};

export const ClassicGame = () => {

  const [state, dispatch] = useReducer(gameReducer, initialState);

// Проверка на совпадение перевернутых карточек
  useEffect(() => {
    if (state.flipped.length === 2) {
      dispatch({type: 'CHECK_MATCH'});
      dispatch({type: 'INCREMENT_TURN'});
    }
  }, [state.flipped]);


// Таймер для сброса перевернутых карточек
  useEffect(() => {
    if (state.pendingReset) {
      const timer = setTimeout(() => {
        dispatch({type: 'RESET_FLIPPED'});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.pendingReset]);

// Обработка клика на карточку
  const handleCardClick = (index: number) => {
    if (!state.gameOver && state.flipped.length < 2 && !state.flipped.includes(index)) {
      dispatch({type: 'FLIP_CARD', index});
    }
  };

  const handlePlayAgain = () => {
    dispatch({type: 'RESET_GAME'});
  };

  return (
    <main>
      <Info turns={ state.turns } reset={ handlePlayAgain }/>
      <Deck state={ state } cardClick={ handleCardClick }/>

      { state.gameOver && <GameOver title={ 'Вы выиграли!' } reset={ handlePlayAgain }/> }

      { !state.gameOver && state.turns >= 15 && <GameOver title={ 'Игра окончена!' } reset={ handlePlayAgain }/> }
    </main>
  )
}