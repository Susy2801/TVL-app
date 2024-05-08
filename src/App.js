import { useState } from "react";
import { useEffect } from "react";
import logo from "./Asset/logo.svg";
import tick from "./Asset/tick.png";
import xmark from "./Asset/x.png";

import "./App.css";

function App() {
  const [gameData, setGameData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isDone, setDone] = useState(false);
  const [refCode, setCode] = useState("");
  const [isValid, setValid] = useState();
  const statAPI = `https://api-beta.piratebattle.xyz/statistic/chart`;
  const checkAPI = `https://api.piratebattle.xyz/user/check-code?ref_code=${refCode}`;

  useEffect(() => {
    setDone(false);
    const getValid = async () => {
      const response = await fetch(checkAPI);
      const data = await response.json();
      console.log(data);
      if (data.error_code === "") {
        setValid(data.data.valid);
      }
      setDone(true);
    };

    getValid();
  }, [checkAPI]);

  useEffect(() => {
    var getStat = async () => {
      const response = await fetch(statAPI);
      const data = await response.json();
      setGameData(data.data.new_user_chart);
      setLoading(true);
    };
    const interval = setInterval(getStat, 5000);

    // Xóa interval khi component bị unmounted
    return () => clearInterval(interval);
  }, []);

  function formatDate(stamp) {
    const date = new Date(stamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  function getDateNow() {
    const now = new Date();

    const gio = now.getHours(); // Lấy giờ
    const phut = now.getMinutes(); // Lấy phút
    const ngay = now.getDate(); // Lấy ngày
    const thang = now.getMonth() + 1; // Lấy tháng (chú ý: tháng trong JavaScript bắt đầu từ 0)
    const nam = now.getFullYear(); // Lấy năm

    var dateNow = `${gio}:${phut} ${ngay}/${thang}/${nam}`;
    return dateNow;
  }

  const latestData = gameData[gameData.length - 2];
  const currentUser = gameData[gameData.length - 1];
  const lastData = gameData[gameData.length - 3];

  return (
    <div className="App">
      <div className="check__ref">
        <div className="check__title">Check Referral Code</div>
        <div className="input__box">
          <input
            value={refCode}
            placeholder="Nhập ref code"
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
        </div>
        <div>
          {isValid ? (
            <img alt="true" src={tick} className="tick" />
          ) : (
            <img alt="false" src={xmark} className="tick" />
          )}
        </div>
      </div>
      <div className="user__container box">
        <div>
          <div className="user__title title"> New User </div>
          <div className="user__number stat">
            {isLoading ? latestData.new_user : <div class="loader"></div>}
          </div>
        </div>

        <div>
          <div className="current__user--title title"> Current User</div>
          {isLoading ? (
            <div className="current__user--number stat">
              {currentUser.new_user}
            </div>
          ) : (
            <div class="loader"></div>
          )}
        </div>

        <div>
          <div className="percent__title title">Chênh lệch so với hôm qua</div>
          {isLoading ? (
            <div className="percent__number stat">
              {((latestData.new_user / lastData.new_user) * 100).toFixed(2) +
                "%"}
            </div>
          ) : (
            <div class="loader"></div>
          )}
        </div>

        <div className="update__time">
          Cập nhập: <span>{getDateNow()}</span>
        </div>
      </div>
      <div className="last__container last__box">
        <div className="old__title">DỮ LIỆU CŨ</div>
        {gameData
          .slice()
          .reverse()
          .slice(2)
          .map((data, index) => (
            <div className="box" key={index}>
              <div>
                <div className="user__title title">New user</div>
                <div className="user__number stat">{data.new_user}</div>
              </div>
              <div>
                <div className="title">Ngày cập nhật</div>
                <div className="update__time">
                  <span>{formatDate(data.date)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
