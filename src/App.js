import { useState, useCallback } from "react";
import "./styles.css";
import { debounce } from "./utils/debouncing";

export default function App() {
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const onQueryChange = (e) => {
    console.log(e.target.value);

    const q = e.target.value;
    setQuery(q);
    // console.log(q, e.target.selectionStart);

    // console.log(getCurrentWord(q, e.target.selectionStart));

    if (q) {
      const currWord = getCurrentWord(q, e.target.selectionStart);
      debouncedgetSuggestions(currWord);
    } else {
      setSuggestions([]);
    }
  };

  const getCurrentWord = (q, index) => {
    const strs = q.split("");
    let word = "";
    let currword = "";
    let wordStartAt = 0;
    for (let i = 0; i < strs.length; i++) {
      if (strs[i] === " ") {
        if (index > wordStartAt && index <= i + 1) {
          currword = word;
        }
        word = "";
        wordStartAt = i + 1;
      } else {
        word += strs[i];
      }
    }
    return currword || word;
  };

  const getSuggestionForQuery = (q) => {
    console.log({ q });

    setErr("");
    getSuggestions(q)
      .then((res) => {
        console.log({ res });
        setSuggestions(res);
      })
      .catch((err) => {
        console.log(err);
        setErr("There was an error in API.");
      });
  };

  const debouncedgetSuggestions = useCallback(
    debounce((q) => getSuggestionForQuery(q), 200),
    []
  );

  const onSuggesionClick = (s) => {
    setQuery(s);
  };
  return (
    <div className="App">
      <h1>Welcome to TS</h1>
      <input
        type="text"
        placeholder="type a query"
        value={query}
        onChange={onQueryChange}
      />
      {err ? (
        <span>{err}</span>
      ) : (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li key={s} onClick={() => onSuggesionClick(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

//Problem Statement
//Create an input box where users can type their search.
//Display suggestions in a drop down.
//Suggestions should be fetched and displayed while typing
//Suggestion can be selected to replace input box.
//The input for the getSuggestion API will be the current word that is being typed not the whole search.
//The output for the getSuggestion API will be only for the current word.
//getSuggestions API returns a promise which can get resolved or rejected at any time ranging from 0 - 200 ms.
// ================================= Mock Server Start =============================
var FAILURE_COEFF = 10;
var MAX_SERVER_LATENCY = 200;
function getRandomBool(n) {
  var maxRandomCoeff = 1000;
  if (n > maxRandomCoeff) n = maxRandomCoeff;
  return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
}
function getSuggestions(text) {
  var pre = "pre";
  var post = "post";
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    var randomTimeout = Math.random() * MAX_SERVER_LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COEFF)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}
// ================================= Mock Server End =============================
