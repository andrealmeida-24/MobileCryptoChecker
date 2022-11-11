"use strict";

const coinInput = document.querySelector(".hero--input");
const inputBtn = document.querySelector(".hero--btn");
const coinSection = document.querySelector(".coin--section");
const coinImg = document.querySelector(".coin--img");
const coinName = document.querySelector(".coin--name");
const coinAbv = document.querySelector(".coin--abv");
const coinValue = document.querySelector(".coin--value");
const coinReact = document.querySelector(".coin--value-infl");
const coinMarketCap = document.querySelector(".coin--market");
const coinVolume = document.querySelector(".coin--volume");
const coinCirculation = document.querySelector(".coin--circulation");
const coinCirculationTxt = document.querySelector(".coin--circulation-txt");

const modalWindow = document.querySelector(".modal--window");
const errorDisplay = document.querySelector(".modal--txt");
const txtErrorDisplay = document.querySelector(".modal--txt-2");
const errorBtn = document.querySelector(".lower--modal--btn");

const lastupdateTxt = document.querySelector(".footer--update-info");

const calculatorInput = document.querySelector(".amount");

const modalLandscapeWindow = document.querySelector(
  ".modal--landscape--window"
);

window.addEventListener("load", function () {
  // orientation
  window.addEventListener(
    "orientationchange",
    function () {
      if (modalWindow.classList.contains("visible")) {
        modalWindow.classList.remove("visible");
        modalWindow.classList.add("hidden");
      }

      if (this.window.orientation === 90) {
        modalLandscapeWindow.classList.remove("hidden");
        modalLandscapeWindow.classList.add("visible");
      } else {
        modalLandscapeWindow.classList.remove("visible");
        modalLandscapeWindow.classList.add("hidden");
      }
    },
    false
  );

  //user input
  inputBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // coin name to lower case
    const coinUserTxt = coinInput.value.toLowerCase();

    // get data from API
    const getCoinsList = async function (coin) {
      try {
        const data = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}`
        );

        // error handling
        if (data.status === 404)
          throw new Error(`Couldn't find "${coinUserTxt}" in our database!`);

        if (data.status === 503)
          throw new Error("Sorry! Our server is down ☹️, try again later!");

        if (coinUserTxt === "")
          throw new Error("Please insert a valid coin name!");

        const dataCoin = await data.json();

        const dataCoinAbv = dataCoin.symbol;

        // fetch coin prices data

        const dataPrices = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
        );

        const dataCoinPrices = await dataPrices.json();

        const coinPriceUSD = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Object.values(dataCoinPrices)[0].usd);

        const coinUSD24Change =
          Object.values(dataCoinPrices)[0].usd_24h_change.toFixed(2);

        const coinUSDMarketCap = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Object.values(dataCoinPrices)[0].usd_market_cap);

        const coinUSD24Volume = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Object.values(dataCoinPrices)[0].usd_24h_vol);

        // log API data to app

        // display coin section
        coinSection.classList.remove("hidden");
        coinSection.classList.add("visible");

        //coin info
        coinImg.src = dataCoin.image.small;
        coinName.textContent = dataCoin.name;
        coinAbv.textContent = dataCoinAbv;

        coinValue.textContent = coinPriceUSD;

        if (coinUSD24Change > 0) {
          coinReact.textContent = coinUSD24Change + "%";
          coinReact.style.color = "green";
        } else if (coinUSD24Change === 0) {
          coinReact.textContent = coinUSD24Change + "%";
          coinReact.style.color = "black";
        } else {
          coinReact.textContent = coinUSD24Change + "%";
          coinReact.style.color = "red";
        }

        coinMarketCap.textContent = coinUSDMarketCap;

        coinVolume.textContent = coinUSD24Volume;

        coinCirculationTxt.textContent = `${dataCoinAbv} Price Calculator`;
        coinCirculation.textContent = `${dataCoinAbv} ${coinPriceUSD}`;

        const dateLastUpdate = new Date(dataCoin.last_updated);
        const dateFormat = String(dataCoin.last_updated).slice(0, 10);
        console.log(dateFormat);
        console.log(dateLastUpdate);

        lastupdateTxt.textContent = `Last update: ${dateFormat} at ${String(
          dateLastUpdate
        ).slice(15, 31)}`;

        //clear input text
        coinInput.value = "";

        // coin calculator data

        calculatorInput.addEventListener("input", function (e) {
          e.preventDefault();

          //get number
          const userImputAmount = Number(calculatorInput.value);
          console.log(Object.values(dataCoinPrices)[0].usd);
          const multiply =
            userImputAmount * Object.values(dataCoinPrices)[0].usd;

          // display
          coinCirculation.textContent = `${dataCoinAbv} ${new Intl.NumberFormat(
            "en-US",
            {
              style: "currency",
              currency: "USD",
            }
          ).format(multiply)}`;
        });
      } catch (err) {
        //clear input text
        coinInput.value = "";

        // if a prior coin search is visible - clear it
        if (coinSection.classList.contains("visible")) {
          coinSection.classList.remove("visible");
          coinSection.classList.add("hidden");
        }

        modalWindow.classList.remove("hidden");
        modalWindow.classList.add("visible");

        txtErrorDisplay.textContent = String(err);

        errorBtn.addEventListener("click", function (e) {
          e.preventDefault();
          modalWindow.classList.remove("visible");
          modalWindow.classList.add("hidden");
        });

        console.clear();
      }
    };

    getCoinsList(coinUserTxt);
  });
});
