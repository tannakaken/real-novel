import React, { useRef } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import clamp from "lodash.clamp";
import "./App.css";

const swap = <T,>(list: T[], fromIndex: number, toIndex: number) => {
  const newList = [...list];
  const elem = newList[fromIndex];
  newList[fromIndex] = newList[toIndex];
  newList[toIndex] = elem;
  return newList;
};

const items = [
  {
    value: 1,
    body: "最初の文章",
  },
  {
    value: 2,
    body: "真ん中の文章",
  },
  {
    value: 3,
    body: "最後の文章",
  },
];

const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 250 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "y" || key === "zIndex",
        }
      : {
          y: order.indexOf(index) * 250,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        };

function App() {
  const order = useRef(items.map((_, index) => index));
  const [springs, api] = useSprings(items.length, fn(order.current));
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(
      Math.round((curIndex * 100 + y) / 100),
      0,
      items.length - 1
    );
    const newOrder = swap(order.current, curIndex, curRow);
    api.start(fn(newOrder, active, originalIndex, curIndex, y));
    if (!active) order.current = newOrder;
  });
  return (
    <div className="App">
      <div
        className="body"
        style={{
          height: 200 * items.length,
        }}
      >
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            className="sentence"
            style={{
              zIndex,
              boxShadow: shadow.to(
                (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
              ),
              y,
              scale,
            }}
          >
            <p>{items[i].value}</p>
            <p>{items[i].body}</p>
          </animated.div>
        ))}
      </div>
    </div>
  );
}

export default App;
