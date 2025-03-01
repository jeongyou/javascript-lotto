var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _LottoMachine_instances, generateLottoNumbers_fn, _rankHistory, _Winning_instances, updateSecondOrThirdPlace_fn, getRankHandler_fn, getTotalPrize_fn, increaseRankingHistory_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const LOTTO_NUMBER_LENGTH = 6;
const MIN_PRICE = 1e3;
const MAX_PRICE = 1e5;
const MIN_LOTTO_NUMBER = 1;
const MAX_LOTTO_NUMBER = 45;
const PRIZE = {
  first: 2e9,
  second: 3e7,
  third: 15e5,
  fourth: 5e4,
  fifth: 5e3
};
function getRandomNumberInRange(min = 1, max = 45) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    __privateSet(this, _numbers, [...numbers].sort((a, b) => a - b));
  }
  get numbers() {
    return __privateGet(this, _numbers);
  }
}
_numbers = new WeakMap();
class LottoMachine {
  constructor() {
    __privateAdd(this, _LottoMachine_instances);
  }
  generateLotto(price2) {
    const lottos2 = [];
    for (let i = 0; i < price2 / MIN_PRICE; i++) {
      const lottoNumbers = __privateMethod(this, _LottoMachine_instances, generateLottoNumbers_fn).call(this);
      lottos2.push(new Lotto(lottoNumbers));
    }
    return lottos2;
  }
}
_LottoMachine_instances = new WeakSet();
generateLottoNumbers_fn = function() {
  const lottoNumbers = /* @__PURE__ */ new Set();
  while (lottoNumbers.size < LOTTO_NUMBER_LENGTH) {
    lottoNumbers.add(getRandomNumberInRange());
  }
  return Array.from(lottoNumbers);
};
function checkIsEmpty$1(input) {
  if (!input.trim()) {
    throw new Error("[ERROR] 공백 입력이 되었습니다.");
  }
}
function checkIsNumber(input) {
  if (Number.isNaN(Number(input))) {
    throw new Error("[ERROR] 숫자 이외의 입력입니다.");
  }
}
function checkWinningNumberCount(input) {
  if (input.length !== LOTTO_NUMBER_LENGTH) {
    throw new Error(`[ERROR] ${LOTTO_NUMBER_LENGTH}개의 숫자를 입력해주세요.`);
  }
}
function checkThousandUnit(input) {
  if (input % MIN_PRICE !== 0) {
    throw new Error("[ERROR] 천원 단위로 입력해주세요.");
  }
}
function checkPriceRange(input) {
  if (input > MAX_PRICE || input < MIN_PRICE) {
    throw new Error("[ERROR] 구입 금액 범위는 1,000 ~ 100,000원 입니다.");
  }
}
function checkLottoNumberRange(input) {
  if (input > MAX_LOTTO_NUMBER || input < MIN_LOTTO_NUMBER) {
    throw new Error("[ERROR] 로또 숫자의 범위는 1 ~ 45 입니다.");
  }
}
function checkWinningNumberDuplicate(input) {
  const numbers = new Set(input);
  if (numbers.size !== LOTTO_NUMBER_LENGTH) {
    throw new Error("[ERROR] 당첨 번호가 중복 입력되었습니다.");
  }
}
function checkBonusNumberDuplicate(winningNumber, bonusNumber) {
  if (winningNumber.includes(bonusNumber)) {
    throw new Error("[ERROR] 당첨 번호와 중복 입력입니다.");
  }
}
function checkRestartChar(restart) {
  if (!["y", "n", "Y", "N"].includes(restart)) {
    throw new Error("[ERROR] y 또는 n을 입력해주세요.");
  }
}
function validatePrice(price2) {
  checkIsEmpty$1(price2);
  checkIsNumber(price2);
  checkThousandUnit(price2);
  checkPriceRange(price2);
}
function validateWinningNumbers(winningNumbers) {
  winningNumbers.forEach((winningNumber) => {
    checkIsEmpty$1(winningNumber);
    checkIsNumber(winningNumber);
    checkWinningNumberCount(winningNumbers);
    checkLottoNumberRange(winningNumber);
  });
  checkWinningNumberDuplicate(winningNumbers);
}
function validateBonusNumber(bonusNumber, winningNumbers) {
  checkIsNumber(bonusNumber);
  checkLottoNumberRange(bonusNumber);
  checkBonusNumberDuplicate(winningNumbers, Number(bonusNumber));
}
const Validate = {
  checkIsEmpty: checkIsEmpty$1,
  checkRestartChar,
  validatePrice,
  validateWinningNumbers,
  validateBonusNumber
};
class Winning {
  constructor(winningNumbers, bonusNumber) {
    __privateAdd(this, _Winning_instances);
    __privateAdd(this, _rankHistory, {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0
    });
    this.winningNumbers = winningNumbers.sort((a, b) => a - b);
    this.bonusNumber = bonusNumber;
  }
  calculateRank(boughtLottos) {
    boughtLottos.forEach((boughtLotto) => {
      this.calculateRankHistory(boughtLotto.numbers);
    });
  }
  calculateRankHistory(boughtLotto) {
    const matchCount = this.winningNumbers.filter(
      (winningNumber) => boughtLotto.includes(winningNumber)
    ).length;
    const rankHandler = __privateMethod(this, _Winning_instances, getRankHandler_fn).call(this, boughtLotto);
    if (rankHandler[matchCount]) {
      rankHandler[matchCount]();
    }
  }
  getCalculatedPrizeRate(price2) {
    const totalPrize = __privateMethod(this, _Winning_instances, getTotalPrize_fn).call(this);
    const prizeRate = (totalPrize / price2 * 100).toFixed(1);
    return Number(prizeRate);
  }
  get rankHistory() {
    return { ...__privateGet(this, _rankHistory) };
  }
}
_rankHistory = new WeakMap();
_Winning_instances = new WeakSet();
updateSecondOrThirdPlace_fn = function(boughtLotto) {
  if (boughtLotto.includes(this.bonusNumber)) {
    __privateMethod(this, _Winning_instances, increaseRankingHistory_fn).call(this, "second");
    return;
  }
  __privateMethod(this, _Winning_instances, increaseRankingHistory_fn).call(this, "third");
};
getRankHandler_fn = function(boughtLotto) {
  return {
    6: () => __privateMethod(this, _Winning_instances, increaseRankingHistory_fn).call(this, "first"),
    5: () => __privateMethod(this, _Winning_instances, updateSecondOrThirdPlace_fn).call(this, boughtLotto),
    4: () => __privateMethod(this, _Winning_instances, increaseRankingHistory_fn).call(this, "fourth"),
    3: () => __privateMethod(this, _Winning_instances, increaseRankingHistory_fn).call(this, "fifth")
  };
};
getTotalPrize_fn = function() {
  return Object.entries(this.rankHistory).reduce((total, [rank, count]) => {
    return total + PRIZE[rank] * count;
  }, 0);
};
increaseRankingHistory_fn = function(rank) {
  __privateGet(this, _rankHistory)[rank] += 1;
};
const lottoMachine = new LottoMachine();
const resultModal = document.querySelector(".dialog");
const closeBtn = document.querySelector(".close-btn");
const purchaseBtn = document.querySelector(".purchase-btn");
let price = 0;
let lottos = [];
document.querySelector("#purchase-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const priceInput = document.querySelector("#purchase-input").value;
    Validate.validatePrice(priceInput);
    price = priceInput;
    lottos = lottoMachine.generateLotto(price);
    updateLottoUI(lottos);
    updatePurchaseUI(true);
    purchaseBtn.disabled = true;
  } catch (error) {
    updatePurchaseUI(false);
    alert(error.message);
  }
});
function updateLottoUI(lottos2) {
  updateLottoCount(lottos2.length);
  renderLottoTickets(lottos2);
}
function updateLottoCount(count) {
  document.querySelector(".purchase-count-message span").textContent = count;
}
function renderLottoTickets(lottos2) {
  const lottoList = document.querySelector(".lotto-tickets");
  lottoList.innerHTML = "";
  lottos2.forEach((lotto) => {
    lottoList.appendChild(createLottoItem(lotto));
  });
}
function createLottoItem(lotto) {
  const lottoItem = document.createElement("li");
  const ticketIcon = document.createElement("span");
  ticketIcon.classList.add("lotto-title");
  ticketIcon.textContent = "🎟️";
  const lottoNumbers = document.createElement("span");
  lottoNumbers.classList.add("lotto-body");
  lottoNumbers.textContent = lotto.numbers.join(", ");
  lottoItem.appendChild(ticketIcon);
  lottoItem.appendChild(lottoNumbers);
  return lottoItem;
}
function updatePurchaseUI(isPurchased) {
  const lottoDisplayContainer = document.querySelector(".lotto-display-container");
  const purchaseInput = document.querySelector("#purchase-input");
  if (isPurchased) {
    lottoDisplayContainer.style.display = "block";
    purchaseInput.value = "";
    return;
  }
  lottoDisplayContainer.style.display = "none";
  purchaseInput.value = "";
}
document.querySelector(".show-result-btn").addEventListener("click", (event) => {
  event.preventDefault();
  try {
    const { winningNumbers, bonusNumber } = getAndValidateWinningNumbers();
    processWinningResult(winningNumbers, bonusNumber);
    resultModal.showModal();
    resetWinningBonusInput();
  } catch (error) {
    alert(error.message);
  }
});
function getWinningNumbers() {
  const numberInputs = document.querySelectorAll(".winning-numbers-input .number-input");
  return Array.from(numberInputs).map((input) => input.value.trim()).filter((value) => value !== "");
}
function getBonusNumber() {
  return Number(document.querySelector("#bonus-input").value.trim());
}
function resetWinningBonusInput() {
  const numberInputs = document.querySelectorAll(".winning-numbers-input .number-input");
  numberInputs.forEach((input) => {
    input.value = "";
  });
  document.querySelector("#bonus-input").value = "";
}
function checkIsEmpty(value) {
  if (value.length < 1) {
    throw new Error("[ERROR] 당첨번호를 입력해 주세요.");
  }
}
function updateWinningTable(rankHistory) {
  document.querySelectorAll(".dialog-container table tr").forEach((row, index) => {
    if (index > 0) {
      const rank = ["fifth", "fourth", "third", "second", "first"][index - 1];
      row.lastElementChild.textContent = `${rankHistory[rank]}개`;
    }
  });
}
function updatePrizeRate(prizeRate) {
  document.querySelector(".winning-rate-result p").textContent = `당신의 총 수익률은 ${prizeRate.toFixed(1).toLocaleString()}%입니다.`;
}
function getAndValidateWinningNumbers() {
  const winningNumbersInput = getWinningNumbers();
  checkIsEmpty(winningNumbersInput);
  Validate.validateWinningNumbers(winningNumbersInput);
  const winningNumbers = winningNumbersInput.map(Number);
  const bonusNumber = getBonusNumber();
  Validate.validateBonusNumber(bonusNumber, winningNumbers);
  return { winningNumbers, bonusNumber };
}
function processWinningResult(winningNumbers, bonusNumber) {
  const winning = new Winning(winningNumbers, bonusNumber);
  winning.calculateRank(lottos);
  const prizeRate = winning.getCalculatedPrizeRate(price);
  updateWinningTable(winning.rankHistory);
  updatePrizeRate(prizeRate);
}
closeBtn.addEventListener("click", () => {
  resultModal.close();
});
document.querySelector(".restart-btn").addEventListener("click", () => {
  resetGame();
});
function resetGame() {
  price = 0;
  lottos = [];
  document.querySelector(".lotto-display-container").style.display = "none";
  document.querySelector("#purchase-input").value = "";
  resetWinningBonusInput();
  updateWinningTable({ first: 0, second: 0, third: 0, fourth: 0, fifth: 0 });
  updatePrizeRate(0);
  purchaseBtn.disabled = false;
  resultModal.close();
}
