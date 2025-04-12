import { useGame } from '@/hooks/useGame';
import { useEffect } from 'react';
import Deck from '@/components/Deck';
import Info from '@/components/Info';
import GameOver from '@/components/GameOver';


export const ClassicGame = () => {
  const {state, checkMatch, flipCard, tick, resetGame} = useGame();

  const {deck, flipped, matched, turns, time, endGame, gameOver} = state;

  // Логика таймера
  useEffect(() => {
    if (endGame) return;

    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [endGame, tick]); // Зависимости стабильны благодаря useCallback

  // Проверка совпадений
  useEffect(() => {
    if (flipped.length === 2) {
      const timer = setTimeout(() => checkMatch(), 400);
      return () => clearTimeout(timer);
    }
  }, [flipped]);

  return (
    <main>
      <Info time={ time } turns={ turns } reset={ resetGame }/>
      <Deck
        deck={ deck }
        flipped={ flipped }
        matched={ matched }
        onCardClick={ flipCard }
      />
      { endGame && (
        <GameOver
          title={ 'Вы выиграли!' }
          gameOver={ gameOver }
          reset={ resetGame }
          content={
            <div>
              <p>Попыток: { turns }</p>
              <p>Время: { time }</p>
            </div>
          }
        />
      ) }
    </main>
  );
};