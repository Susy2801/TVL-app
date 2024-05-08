import { useState } from "react";
import { useEffect } from "react";
import logo from "./Asset/logo.svg";

import "./App.css";

function App() {
  const statAPI = `https://api-beta.piratebattle.xyz/statistic/chart`;
  const [gameData, setGameData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    var getStat = async () => {
      const response = await fetch(statAPI);
      const data = await response.json();
      console.log(data);
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
      <div className="user__container">
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
    </div>
  );
}

export default App;
