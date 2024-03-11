import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [tvl, setTvl] = useState("");
  const [result, setResult] = useState("");
  const [des, setDes] = useState("");
  const [name, setName] = useState("");
  const [ava, setAva] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAva, setLoadingAva] = useState(false);

  useEffect(() => {
    if (tvl.trim() === "") {
      setResult("");
      return;
    }

    async function getTVL() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.llama.fi/tvl/${tvl
            .trim()
            .toLowerCase()
            .replace(/\s/g, "-")}`
        );
        if (response.status === 200) {
          const data = await response.json();
          setResult(data);
        }
      } catch (error) {
        console.error("Error fetching TVL:", error);
      } finally {
        setLoading(false);
      }
    }

    async function getAva() {
      try {
        setLoadingAva(true);
        const response = await fetch(
          `https://api.llama.fi/protocol/${tvl
            .trim()
            .toLowerCase()
            .replace(/\s/g, "-")}`
        );
        if (response.status === 200) {
          const data = await response.json();
          setAva(data.logo);
          setDes(data.description);
          setName(data.name);
          console.log(data);
        } else {
          setAva("");
        }
      } catch (error) {
        console.error("Error fetching TVL:", error);
      } finally {
        setLoadingAva(false);
      }
    }
    getAva();
    getTVL();
  }, [tvl]);

  const handleChange = (e) => {
    setTvl(e.target.value);
  };

  const handleClick = () => {
    setTvl(tvl);
  };

  const handleClear = () => {
    setTvl("");
    setAva("");
    setDes("");
    setName("");
  };

  return (
    <div className="App">
      <input value={tvl} onChange={handleChange} />
      <button onClick={handleClick}>Send</button>
      <div className="header">
        <h2 className="title">Total Locked Value</h2>
        {loading && (
          <div className="loading">
            <div class="loader"></div>
          </div>
        )}
        {result && <strong>$</strong>}
        {result ? Math.floor(result).toLocaleString() : <div>No data</div>}
      </div>
      <button onClick={handleClear}>Clear</button>
      <div>
        {loadingAva ? (
          <div className="loading">
            {" "}
            <div class="loader"></div>
          </div>
        ) : (
          ava && <img className="ava" src={ava} alt="" />
        )}
      </div>
      <div className="name">{name}</div>
      <div className="des">{des}</div>
    </div>
  );
}

export default App;
