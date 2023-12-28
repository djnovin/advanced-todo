import "./App.css";
import { useState, ChangeEvent } from "react";
import { create } from 'zustand';
import { Overview } from "./components/Overview";

export type TValue = {
  stock: string;
  unitsBought: number;
  unitsSold: number;
  buy: number;
  sell: number;
};

type TState = {
  stocks: TValue[];
  addStock: (stock: TValue) => void;
  removeStock: (stock: TValue) => void;
};

const useStore = create<TState>((set) => ({
  stocks: [],
  addStock: (newStock: TValue) =>
    set((state) => ({ stocks: [...state.stocks, newStock] })),
  removeStock: (stockToRemove: TValue) =>
    set((state) => ({
      stocks: state.stocks.filter((stock) => stock !== stockToRemove),
    })),
}));

const App = () => {
  const INITIAL_VALUE: TValue = {
    stock: "",
    unitsBought: 0,
    unitsSold: 0,
    buy: 0,
    sell: 0,
  };

  const [value, setValue] = useState<TValue>(INITIAL_VALUE);
  const stocks = useStore((state) => state.stocks);
  const addStock = useStore((state) => state.addStock);
  const removeStock = useStore((state) => state.removeStock);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const addStockToList = () => {
    if (value.buy && value.sell && value.stock && value.unitsBought && value.unitsSold) {
      addStock({ ...value });
      setValue(INITIAL_VALUE);
    }
  };

  const removeStockFromList = (stock: TValue) => {
    removeStock(stock);
  };

  const formatCapitalGains = (gains: number) =>
    gains >= 0 ? `+${gains.toFixed(2)}%` : `${gains.toFixed(2)}%`;

  const calculateCapitalGains = (unitsBought: number, buy: number, unitsSold: number, sell: number) => {
    const totalBuyCost = unitsBought * buy;
    const totalSellRevenue = unitsSold * sell;
    return ((totalSellRevenue - totalBuyCost) / totalBuyCost) * 100;
  };

 return (
    <div className="App">
      <Overview stocks={stocks} />

      {value.buy && value.sell && (
        <p>
          {formatCapitalGains(
            calculateCapitalGains(
              value.unitsBought,
              value.buy,
              value.unitsSold,
              value.sell
            )
          )}
        </p>
      )}

      <div>
        <label htmlFor="stock">Stock:</label>
        <input
          value={value.stock}
          type="text"
          onChange={handleChange}
          name="stock"
          placeholder="Enter stock name"
        />

        <label htmlFor="unitsBought">Units Bought:</label>
        <input
          value={value.unitsBought}
          type="number"
          onChange={handleChange}
          name="unitsBought"
          placeholder="Enter units bought"
        />

        <label htmlFor="buy">Buy Price:</label>
        <input
          onChange={handleChange}
          placeholder="Enter buy price"
          value={value.buy}
          type="number"
          name="buy"
        />

        <label htmlFor="unitsSold">Units Sold:</label>
        <input
          value={value.unitsSold}
          type="number"
          onChange={handleChange}
          name="unitsSold"
          placeholder="Enter units sold"
        />

        <label htmlFor="sell">Sell Price:</label>
        <input
          onChange={handleChange}
          placeholder="Enter sell price"
          value={value.sell}
          type="number"
          name="sell"
        />

        <button
          onClick={addStockToList}
          disabled={
            !value.stock ||
            !value.buy ||
            !value.sell ||
            typeof value.unitsBought !== "number" ||
            typeof value.unitsSold !== "number"
          }
        >
          +
        </button>
      </div>

      {stocks.length > 0 &&
        stocks.map((stock, i) => (
          <div key={i}>
            <p>
              <strong>Stock:</strong> {stock.stock}
            </p>
            <p>
              <strong>Buy Price:</strong> ${stock.buy}
            </p>
            <p>
              <strong>Sell Price:</strong> ${stock.sell}
            </p>
            <p>
              <strong>Capital Gains:</strong>{" "}
              {formatCapitalGains(
                calculateCapitalGains(
                  stock.unitsBought,
                  stock.buy,
                  stock.unitsSold,
                  stock.sell
                )
              )}
            </p>
            <button onClick={() => removeStockFromList(stock)}>-</button>
          </div>
        ))}
    </div>
  );
};

export default App;
